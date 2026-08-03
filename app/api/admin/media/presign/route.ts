import { NextResponse } from "next/server";
import { AdminError, requireAdminApi } from "../../../../../lib/admin";
import { all, batch, id, run, unix } from "../../../../../lib/db";
import { createSignedUpload, deleteObjects, storageBucket } from "../../../../../lib/storage";
import { assertSameOrigin, ValidationError } from "../../../../../lib/security";

type RequestedFile={name?:string;size?:number;type?:string};
type RequestBody={kind?:string;visibility?:string;files?:RequestedFile[]};
const MB=1024*1024;
const mimeByExtension:Record<string,string>={jpg:"image/jpeg",jpeg:"image/jpeg",png:"image/png",webp:"image/webp",pdf:"application/pdf"};

function safeName(value:string){return value.split(/[\\/]/).pop()?.trim().slice(0,180)||"";}
function describeFile(file:RequestedFile,kind:string){
  const name=safeName(String(file.name||""));const size=Number(file.size);const extension=name.split(".").pop()?.toLowerCase()||"";const expectedMime=mimeByExtension[extension];
  if(!name||!Number.isInteger(size)||size<1)throw new ValidationError("Every selected file must have a valid name and size.");
  if(kind==="image"&&!['jpg','jpeg','png','webp'].includes(extension))throw new ValidationError(`${name}: choose a JPEG, PNG, or WebP image.`);
  if(kind!=="image"&&extension!=="pdf")throw new ValidationError(`${name}: catalogs and datasheets must be PDF files.`);
  const limit=kind==="image"?10*MB:20*MB;if(size>limit)throw new ValidationError(`${name}: file is larger than ${limit/MB} MB.`);
  const supplied=String(file.type||"").toLowerCase();if(supplied&&supplied!==expectedMime)throw new ValidationError(`${name}: browser file type does not match its extension.`);
  return{name,size,extension,expectedMime};
}

export async function POST(request:Request){
  try{
    await assertSameOrigin(request);const admin=await requireAdminApi();const body=await request.json() as RequestBody;
    const kind=String(body.kind||"");const visibility=String(body.visibility||"");const files=Array.isArray(body.files)?body.files:[];
    if(!["image","catalog","datasheet"].includes(kind)||!["public","private"].includes(visibility))throw new ValidationError("Invalid media settings.");
    if(files.length<1||files.length>20)throw new ValidationError("Choose between 1 and 20 files.");
    const described=files.map((file)=>describeFile(file,kind));if(described.reduce((sum,file)=>sum+file.size,0)>50*MB)throw new ValidationError("The combined upload must be 50 MB or smaller.");
    const now=unix();const expired=await all<{objectKey:string}>('SELECT object_key AS "objectKey" FROM pending_media_uploads WHERE expires_at<? LIMIT 100',now);
    if(expired.length)await deleteObjects(expired.map((row)=>row.objectKey)).catch(()=>undefined);await run("DELETE FROM pending_media_uploads WHERE expires_at<?",now);
    const batchId=id("batch");const expiresAt=now+15*60;const uploads=[] as Array<{objectKey:string;token:string;fileName:string}>;const rows=[] as Array<{sql:string;values:unknown[]}>;
    for(const file of described){const objectKey=`pending/${admin.id}/${batchId}/${crypto.randomUUID()}.${file.extension}`;const ticket=await createSignedUpload(objectKey);uploads.push({objectKey:ticket.path||objectKey,token:ticket.token,fileName:file.name});rows.push({sql:"INSERT INTO pending_media_uploads(id,batch_id,admin_user_id,object_key,original_name,expected_mime,expected_size,kind,visibility,expires_at,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)",values:[id("pup"),batchId,admin.id,objectKey,file.name,file.expectedMime,file.size,kind,visibility,expiresAt,now]});}
    await batch(rows);return NextResponse.json({batchId,bucket:storageBucket(),uploads});
  }catch(error){const status=error instanceof AdminError?error.status:error instanceof ValidationError?error.status:500;return NextResponse.json({error:error instanceof Error?error.message:"Secure upload could not be prepared."},{status});}
}
