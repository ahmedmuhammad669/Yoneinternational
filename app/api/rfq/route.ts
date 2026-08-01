import { NextResponse } from "next/server";
import { bucket, d1, id, run, unix } from "../../../lib/db";
import { queueNotification } from "../../../lib/notifications";
import { assertSameOrigin, clean, email, enforceRateLimit, reference, required, validateUpload, ValidationError } from "../../../lib/security";

export async function POST(request:Request){
  let attachmentId:string|null=null; let objectKey:string|null=null;
  try{
    await assertSameOrigin(request); await enforceRateLimit(request,"rfq",8,3600);
    const data=await request.formData();
    if(clean(data.get("website")))return NextResponse.redirect(new URL("/rfq/success?reference=received",request.url),303);
    if(clean(data.get("consent"))!=="yes")throw new ValidationError("Consent is required.");
    const fullName=required(data.get("fullName"),"Full name",160), businessEmail=email(data.get("email")), company=required(data.get("company"),"Company",200), country=required(data.get("country"),"Country",120), productsText=clean(data.get("products"),8000), message=required(data.get("message"),"Message",10000);
    const now=unix(); const rfqId=id("rfq"); const ref=reference("YI-RFQ");
    const file=data.get("file");
    if(file instanceof File&&file.size){const valid=await validateUpload(file,10*1024*1024);attachmentId=id("media");objectKey=`private/rfq/${crypto.randomUUID()}.${valid.extension}`;await bucket().put(objectKey,valid.bytes,{httpMetadata:{contentType:valid.mime,contentDisposition:"attachment"},customMetadata:{kind:"rfq"}});await run("INSERT INTO media_assets(id,kind,visibility,object_key,original_name,mime_type,size_bytes,status,created_at) VALUES(?,'rfq-attachment','private',?,?,?,?,'draft',?)",attachmentId,objectKey,file.name.slice(0,180),valid.mime,valid.bytes.byteLength,now);}
    const basketId=request.headers.get("cookie")?.split(";").map((v)=>v.trim()).find((v)=>v.startsWith("yone_rfq_basket="))?.split("=")[1];
    const items=basketId?await d1().prepare("SELECT bi.product_id AS productId,bi.quantity,p.name,p.sku FROM rfq_basket_items bi JOIN products p ON p.id=bi.product_id JOIN categories c ON c.id=p.category_id WHERE bi.basket_id=? AND p.status='published' AND p.deleted_at IS NULL AND c.status='published'").bind(basketId).all<{productId:string;quantity:number;name:string;sku:string|null}>():{results:[]};
    if(!productsText&&!items.results?.length)throw new ValidationError("Add a product or describe the requested instruments.");
    const statements=[d1().prepare("INSERT INTO rfqs(id,reference,full_name,email,company,country,phone,target_market,required_standard,private_label,packaging,desired_date,products_text,message,attachment_media_id,consent_at,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'new',?,?)").bind(rfqId,ref,fullName,businessEmail,company,country,clean(data.get("phone"),80)||null,clean(data.get("targetMarket"),160)||null,clean(data.get("requiredStandard"),500)||null,clean(data.get("privateLabel"),3000)||null,clean(data.get("packaging"),3000)||null,clean(data.get("desiredDate"),30)||null,productsText||null,message,attachmentId,now,now,now),...(items.results||[]).map((item)=>d1().prepare("INSERT INTO rfq_items(id,rfq_id,product_id,product_name,sku,quantity,created_at) VALUES(?,?,?,?,?,?,?)").bind(id("item"),rfqId,item.productId,item.name,item.sku,Math.max(1,Math.floor(item.quantity)),now))];
    await d1().batch(statements);
    if(basketId)await run("DELETE FROM rfq_baskets WHERE id=?",basketId);
    await queueNotification(`New quotation enquiry ${ref}`,`<p>A new RFQ was submitted by ${escapeHtml(company)}.</p><p>Reference: ${ref}</p>`);
    const response=NextResponse.redirect(new URL(`/rfq/success?reference=${encodeURIComponent(ref)}`,request.url),303);response.cookies.set("yone_rfq_basket","",{expires:new Date(0),httpOnly:true,secure:true,sameSite:"lax",path:"/"});return response;
  }catch(error){if(objectKey)await bucket().delete(objectKey).catch(()=>undefined);if(attachmentId)await run("DELETE FROM media_assets WHERE id=?",attachmentId).catch(()=>undefined);const message=error instanceof Error?error.message:"Unable to submit the RFQ.";return NextResponse.redirect(new URL(`/rfq?error=${encodeURIComponent(message)}`,request.url),303);}
}
function escapeHtml(value:string){return value.replace(/[&<>"']/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]||c));}
