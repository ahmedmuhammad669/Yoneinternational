import { NextResponse } from "next/server";
import { audit, requireAdminApi } from "../../../../../lib/admin";
import { all } from "../../../../../lib/db";
const exports={
  rfqs:"SELECT reference,full_name,email,company,country,phone,target_market,required_standard,private_label,packaging,desired_date,products_text,message,attachment_media_id,consent_at,status,assigned_to,created_at,updated_at FROM rfqs WHERE deleted_at IS NULL ORDER BY created_at DESC",
  contacts:"SELECT reference,full_name,email,company,country,phone,subject,status,assigned_to,created_at FROM contact_inquiries WHERE deleted_at IS NULL ORDER BY created_at DESC",
  applications:"SELECT ja.reference,ja.full_name,ja.email,ja.phone,j.title AS job,ja.status,ja.assigned_to,ja.created_at FROM job_applications ja JOIN jobs j ON j.id=ja.job_id WHERE ja.deleted_at IS NULL ORDER BY ja.created_at DESC",
} as const;
const csv=(value:unknown)=>`"${String(value??"").replaceAll("\"","\"\"")}"`;
export async function GET(request:Request,{params}:{params:Promise<{type:string}>}){const admin=await requireAdminApi();const {type}=await params;if(!(type in exports))return NextResponse.json({error:"Unknown export."},{status:404});const rows=await all<Record<string,unknown>>(exports[type as keyof typeof exports]);const headers=rows[0]?Object.keys(rows[0]):["no_records"];const body=[headers.map(csv).join(","),...rows.map((row)=>headers.map((key)=>csv(row[key])).join(","))].join("\r\n");await audit(admin.email,"inquiry.export",type,undefined,{rows:rows.length});return new NextResponse(body,{headers:{"content-type":"text/csv; charset=utf-8","content-disposition":`attachment; filename=\"yone-${type}.csv\"`,"cache-control":"private, no-store"}});}
