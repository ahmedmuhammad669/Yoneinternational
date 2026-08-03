import { NextResponse } from "next/server";
import { AdminError, audit, requireAdminApi } from "../../../../lib/admin";
import { adminResources } from "../../../../lib/admin-resources";
import { first, id, run, unix } from "../../../../lib/db";
import { assertSameOrigin, clean, required, slug, ValidationError } from "../../../../lib/security";

const specialFields = new Set(["primary_media_id","media_id"]);
const numberFields = new Set(["sort_order","closing_date","verified"]);
const redirectTo=(request:Request,resource:string,message:string,error=false)=>NextResponse.redirect(new URL(`/admin/${resource}?${error?"error":"ok"}=${encodeURIComponent(message)}`,request.url),303);

async function validatePublish(resource:string,itemId:string,values:Record<string,unknown>){
  if(resource==="products"){
    const category=await first<{n:number}>("SELECT count(*) n FROM categories WHERE id=? AND status='published' AND deleted_at IS NULL",values.category_id||"");
    if(!category?.n)throw new ValidationError("Publish the selected category before publishing this product.");
    const mediaId=String(values.primary_media_id||"");
    const linked=mediaId?await first<{n:number}>("SELECT count(*) n FROM media_assets WHERE id=? AND visibility='public' AND status='published' AND deleted_at IS NULL",mediaId):await first<{n:number}>("SELECT count(*) n FROM product_media pm JOIN media_assets ma ON ma.id=pm.media_id WHERE pm.product_id=? AND ma.visibility='public' AND ma.status='published' AND ma.deleted_at IS NULL",itemId);
    if(!linked?.n)throw new ValidationError("A published product requires at least one approved public image.");
  }
  if(resource==="testimonials"&&(values.permission_status!=="approved"||values.verification_status!=="verified"))throw new ValidationError("Testimonials require approved permission and verified feedback before publication.");
  if(resource==="certifications"&&(Number(values.verified)!==1||!values.evidence_media_id))throw new ValidationError("Certification evidence and Owner verification are required before publication.");
}

export async function POST(request:Request){
  let resourceKey="overview";
  try{
    await assertSameOrigin(request);
    const form=await request.formData();
    resourceKey=clean(form.get("resource"),40);
    const resource=adminResources[resourceKey];
    if(!resource)throw new ValidationError("Unknown content resource.");
    const admin=await requireAdminApi(Boolean(resource.ownerOnly));
    const itemId=clean(form.get("item_id"),100);
    const values:Record<string,unknown>={};
    for(const field of resource.fields){
      const raw=field.required?required(form.get(field.name),field.label,12000):clean(form.get(field.name),12000);
      values[field.name]=numberFields.has(field.name)?(raw?Number.parseInt(raw,10):0):raw||null;
    }
    const naming=String(values.name||values.title||values.customer_name||"");
    if(resource.fields.some((field)=>field.name==="slug"))values.slug=slug(form.get("slug"),naming);
    const status=String(values.status||"draft");
    if(!["draft","published","archived"].includes(status))throw new ValidationError("Invalid publication status.");
    const recordId=itemId||id(resource.prefix);const now=unix();
    values.id=recordId;values.actor=admin.email;values.now=now;values.published_at=status==="published"?now:null;
    if(status==="published")await validatePublish(resourceKey,recordId,values);
    if(itemId){
      const allowed=resource.fields.filter((field)=>!specialFields.has(field.name));
      const assignments=allowed.map((field)=>`${field.name}=?`);
      const bound=allowed.map((field)=>values[field.name]);
      assignments.push("updated_by=?","updated_at=?","published_at=?");
      bound.push(admin.email,now,values.published_at);
      await run(`UPDATE ${resource.table} SET ${assignments.join(",")} WHERE id=?`,...bound,itemId);
    }else{
      const bound=resource.createValues.map((key)=>values[key]);
      await run(resource.createSql,...bound);
    }
    const mediaId=String(values.primary_media_id||values.media_id||"");
    if(resourceKey==="products"&&mediaId){
      await run("DELETE FROM product_media WHERE product_id=? AND is_primary=1",recordId);
      await run("INSERT INTO product_media(product_id,media_id,sort_order,is_primary) VALUES(?,?,0,1) ON CONFLICT(product_id,media_id) DO UPDATE SET sort_order=0,is_primary=1",recordId,mediaId);
    }
    if(resourceKey==="gallery"&&mediaId){
      await run("INSERT INTO gallery_images(id,album_id,media_id,caption,alt_text,image_date,sort_order,created_at) VALUES(?,?,?,?,?,NULL,0,?) ON CONFLICT(album_id,media_id) DO NOTHING",id("gimg"),recordId,mediaId,values.description||null,values.name||null,now);
    }
    await audit(admin.email,itemId?"content.update":"content.create",resource.table,recordId,{status});
    return redirectTo(request,resourceKey,itemId?"Changes saved.":"Record created.");
  }catch(error){
    const status=error instanceof AdminError?error.status:error instanceof ValidationError?400:500;
    if(status===401||status===403)return NextResponse.json({error:error instanceof Error?error.message:"Access denied."},{status});
    return redirectTo(request,resourceKey,error instanceof Error?error.message:"Content could not be saved.",true);
  }
}
