import { NextResponse } from "next/server";
import { AdminError, audit, requireAdminApi } from "../../../../../lib/admin";
import { all, batch, id, run, unix } from "../../../../../lib/db";
import { deleteObjects, getObject } from "../../../../../lib/storage";
import { assertSameOrigin, validateFileBytes, ValidationError } from "../../../../../lib/security";

type Pending={objectKey:string;originalName:string;expectedMime:string;expectedSize:number;kind:string;visibility:string};
function readableName(name:string){return name.replace(/\.[^.]+$/,'').replace(/[-_]+/g,' ').replace(/\s+/g,' ').trim().slice(0,300);}

export async function POST(request:Request){let keys:string[]=[];let committed=false;let adminId="";let batchId="";
  try{
    await assertSameOrigin(request);const admin=await requireAdminApi();adminId=admin.id;const body=await request.json() as {batchId?:string;altPrefix?:string};batchId=String(body.batchId||"");if(!/^batch_[a-f0-9]{32}$/.test(batchId))throw new ValidationError("Invalid upload batch.");const altPrefix=String(body.altPrefix||"").trim().slice(0,300);
    const rows=await all<Pending>('SELECT object_key AS "objectKey",original_name AS "originalName",expected_mime AS "expectedMime",expected_size AS "expectedSize",kind,visibility FROM pending_media_uploads WHERE batch_id=? AND admin_user_id=? AND expires_at>? ORDER BY created_at',batchId,admin.id,unix());if(!rows.length||rows.length>20)throw new ValidationError("Upload batch is missing or expired.");keys=rows.map((row)=>row.objectKey);
    const now=unix();const statements=[] as Array<{sql:string;values:unknown[]}>;const mediaIds:string[]=[];
    for(const row of rows){const stored=await getObject(row.objectKey);if(!stored||stored.size!==Number(row.expectedSize))throw new ValidationError(`${row.originalName}: uploaded size does not match.`);const validated=validateFileBytes(stored.body,row.originalName,row.kind==="image"?10*1024*1024:20*1024*1024,row.kind!=="image");if(validated.mime!==row.expectedMime)throw new ValidationError(`${row.originalName}: file type does not match.`);const mediaId=id("med");mediaIds.push(mediaId);const suffix=readableName(row.originalName);const alt=row.kind==="image"?(altPrefix?`${altPrefix} — ${suffix}`:suffix)||null:null;const status=row.visibility==="public"?"published":"draft";statements.push({sql:"INSERT INTO media_assets(id,kind,visibility,object_key,original_name,mime_type,size_bytes,alt_text,caption,status,uploaded_by,deleted_at,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,NULL,?)",values:[mediaId,row.kind,row.visibility,row.objectKey,row.originalName,validated.mime,row.expectedSize,alt,null,status,admin.email,now]});}
    statements.push({sql:"DELETE FROM pending_media_uploads WHERE batch_id=? AND admin_user_id=?",values:[batchId,admin.id]});await batch(statements);committed=true;await audit(admin.email,"media.bulk_upload","media_batch",batchId,{count:rows.length,mediaIds}).catch(()=>undefined);return NextResponse.json({count:rows.length});
  }catch(error){if(!committed&&keys.length){await deleteObjects(keys).catch(()=>undefined);if(batchId&&adminId)await run("DELETE FROM pending_media_uploads WHERE batch_id=? AND admin_user_id=?",batchId,adminId).catch(()=>undefined);}const status=error instanceof AdminError?error.status:error instanceof ValidationError?error.status:500;return NextResponse.json({error:error instanceof Error?error.message:"Uploaded files could not be finalized."},{status});}
}
