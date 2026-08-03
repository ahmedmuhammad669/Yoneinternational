import { NextResponse } from "next/server";
import { AdminError, requireAdminApi } from "../../../../../lib/admin";
import { all, run } from "../../../../../lib/db";
import { deleteObjects } from "../../../../../lib/storage";
import { assertSameOrigin, ValidationError } from "../../../../../lib/security";

export async function POST(request:Request){
  try{await assertSameOrigin(request);const admin=await requireAdminApi();const body=await request.json() as {batchId?:string};const batchId=String(body.batchId||"");if(!/^batch_[a-f0-9]{32}$/.test(batchId))throw new ValidationError("Invalid upload batch.");const rows=await all<{objectKey:string}>('SELECT object_key AS "objectKey" FROM pending_media_uploads WHERE batch_id=? AND admin_user_id=?',batchId,admin.id);await deleteObjects(rows.map((row)=>row.objectKey)).catch(()=>undefined);await run("DELETE FROM pending_media_uploads WHERE batch_id=? AND admin_user_id=?",batchId,admin.id);return NextResponse.json({ok:true});}catch(error){const status=error instanceof AdminError?error.status:error instanceof ValidationError?error.status:500;return NextResponse.json({error:error instanceof Error?error.message:"Upload cleanup failed."},{status});}
}
