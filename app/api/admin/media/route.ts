import { NextResponse } from "next/server";
import { AdminError, audit, requireAdminApi } from "../../../../lib/admin";
import { bucket, d1, id, unix } from "../../../../lib/db";
import { assertSameOrigin, clean, validateUpload, ValidationError } from "../../../../lib/security";

const redirect=(request:Request,message:string,error=false)=>NextResponse.redirect(new URL(`/admin/media?${error?"error":"ok"}=${encodeURIComponent(message)}`,request.url),303);
const readableName=(name:string)=>name.replace(/\.[^.]+$/,"").replace(/[-_]+/g," ").replace(/\s+/g," ").trim().slice(0,180);

export async function POST(request:Request){
  const uploadedKeys:string[]=[];
  try{
    await assertSameOrigin(request);
    const admin=await requireAdminApi();
    const form=await request.formData();
    const files=form.getAll("files").filter((value):value is File=>value instanceof File&&value.size>0);
    const legacy=form.get("file");
    if(!files.length&&legacy instanceof File&&legacy.size)files.push(legacy);
    if(!files.length)throw new ValidationError("Choose at least one file.");
    if(files.length>20)throw new ValidationError("Upload no more than 20 files at once.");
    if(files.reduce((total,file)=>total+file.size,0)>50*1024*1024)throw new ValidationError("The combined upload must be 50 MB or smaller.");

    const kind=clean(form.get("kind"),30);
    const visibility=clean(form.get("visibility"),20);
    if(!["image","catalog","datasheet","certificate","resume"].includes(kind)||!["public","private"].includes(visibility))throw new ValidationError("Invalid media settings.");
    const perFileLimit=kind==="catalog"||kind==="datasheet"?20*1024*1024:10*1024*1024;
    const validated=await Promise.all(files.map(async(file)=>({file,valid:await validateUpload(file,perFileLimit)})));
    if(kind==="image"&&validated.some(({valid})=>valid.mime==="application/pdf"))throw new ValidationError("Image uploads cannot contain PDF files.");
    if((kind==="catalog"||kind==="datasheet")&&validated.some(({valid})=>valid.mime!=="application/pdf"))throw new ValidationError("Catalog and datasheet bulk uploads must contain PDF files only.");

    const now=unix();const prefix=clean(form.get("alt_text"),300);const status=visibility==="public"?"published":"draft";
    const records=[] as Array<{mediaId:string;objectKey:string;file:File;mime:string;size:number;alt:string|null}>;
    for(const {file,valid} of validated){
      const mediaId=id("med");const objectKey=`media/${mediaId}.${valid.extension}`;
      await bucket().put(objectKey,valid.bytes,{httpMetadata:{contentType:valid.mime},customMetadata:{originalName:file.name,uploadedBy:admin.email}});
      uploadedKeys.push(objectKey);
      const suffix=readableName(file.name);const alt=kind==="image"?(prefix?`${prefix} — ${suffix}`:suffix||null):prefix||null;
      records.push({mediaId,objectKey,file,mime:valid.mime,size:valid.bytes.byteLength,alt});
    }
    await d1().batch(records.map((record)=>d1().prepare("INSERT INTO media_assets(id,kind,visibility,object_key,original_name,mime_type,size_bytes,alt_text,caption,status,uploaded_by,deleted_at,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,NULL,?)").bind(record.mediaId,kind,visibility,record.objectKey,record.file.name.slice(0,180),record.mime,record.size,record.alt,null,status,admin.email,now)));
    uploadedKeys.length=0;
    await audit(admin.email,"media.bulk_upload","media_asset",records[0]?.mediaId,{count:records.length,kind,visibility}).catch(()=>undefined);
    return redirect(request,`${records.length} file${records.length===1?"":"s"} uploaded successfully.`);
  }catch(error){
    if(uploadedKeys.length)try{await bucket().delete(uploadedKeys);}catch{}
    const status=error instanceof AdminError?error.status:400;
    if(status===401||status===403)return NextResponse.json({error:error instanceof Error?error.message:"Access denied."},{status});
    return redirect(request,error instanceof Error?error.message:"Upload failed.",true);
  }
}
