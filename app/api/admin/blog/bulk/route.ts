import { NextResponse } from "next/server";
import { audit, requireAdminApi } from "../../../../../lib/admin";
import { parseCsv } from "../../../../../lib/csv.mjs";
import { all, batch, first, id, unix } from "../../../../../lib/db";
import { assertSameOrigin, slug, ValidationError } from "../../../../../lib/security";

const allowedHeaders=new Set(["title","slug","excerpt","body","sources","hero_media_id","author_id","category_id"]);
const limit=(value:string,max:number)=>value.trim().slice(0,max)||null;
const redirect=(request:Request,message:string,error=false)=>NextResponse.redirect(new URL(`/admin/blog?${error?"error":"ok"}=${encodeURIComponent(message)}`,request.url),303);

export async function POST(request:Request){
  try{
    await assertSameOrigin(request);const admin=await requireAdminApi();const form=await request.formData();const file=form.get("file");
    if(!(file instanceof File)||!file.size)throw new ValidationError("Choose a CSV file.");
    if(file.size>2*1024*1024)throw new ValidationError("CSV file must be 2 MB or smaller.");
    if(file.name.split(".").pop()?.toLowerCase()!=="csv")throw new ValidationError("The bulk blog file must use the .csv extension.");
    const text=await file.text();if(text.includes("\0"))throw new ValidationError("CSV contains invalid binary data.");
    const parsed=parseCsv(text.replace(/^\uFEFF/,""));if(parsed.length<2)throw new ValidationError("CSV must contain a header and at least one article.");
    const headers=parsed[0].map((value)=>value.trim().toLowerCase());if(new Set(headers).size!==headers.length)throw new ValidationError("CSV header contains duplicate columns.");
    if(!headers.includes("title")||!headers.includes("body"))throw new ValidationError("CSV must include title and body columns.");
    const unknown=headers.filter((header)=>!allowedHeaders.has(header));if(unknown.length)throw new ValidationError(`Unsupported CSV column: ${unknown[0]}.`);
    const dataRows=parsed.slice(1);if(dataRows.length>100)throw new ValidationError("Import no more than 100 blog articles at once.");
    const articles=[] as Array<Record<string,string|null>>;
    for(let index=0;index<dataRows.length;index+=1){const values=dataRows[index];if(values.length>headers.length)throw new ValidationError(`Row ${index+2} has more values than the header.`);const row=Object.fromEntries(headers.map((header,column)=>[header,values[column]?.trim()||""]));const title=limit(row.title,300);const body=limit(row.body,50000);if(!title||!body)throw new ValidationError(`Row ${index+2} requires both title and body.`);articles.push({title,slug:slug(row.slug,title),excerpt:limit(row.excerpt,1000),body,sources:limit(row.sources,5000),hero_media_id:limit(row.hero_media_id,100),author_id:limit(row.author_id,100),category_id:limit(row.category_id,100)});}
    const slugs=articles.map((article)=>String(article.slug));if(new Set(slugs).size!==slugs.length)throw new ValidationError("CSV contains duplicate slugs.");const placeholders=slugs.map(()=>"?").join(",");const existing=await all<{slug:string}>(`SELECT slug FROM blog_posts WHERE slug IN (${placeholders})`,...slugs);if(existing.length)throw new ValidationError(`Slug already exists: ${existing[0].slug}.`);
    for(let index=0;index<articles.length;index+=1){const article=articles[index];if(article.author_id&&!await first("SELECT id FROM authors WHERE id=?",article.author_id))throw new ValidationError(`Row ${index+2} has an unknown author ID.`);if(article.category_id&&!await first("SELECT id FROM blog_categories WHERE id=?",article.category_id))throw new ValidationError(`Row ${index+2} has an unknown blog category ID.`);if(article.hero_media_id&&!await first("SELECT id FROM media_assets WHERE id=? AND kind='image' AND visibility='public' AND status='published' AND deleted_at IS NULL",article.hero_media_id))throw new ValidationError(`Row ${index+2} has an unavailable hero image ID.`);}
    const now=unix();await batch(articles.map((article)=>({sql:"INSERT INTO blog_posts(id,author_id,category_id,hero_media_id,title,slug,excerpt,body,sources,updated_date,status,published_at,created_by,updated_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,'draft',NULL,?,?,?,?)",values:[id("post"),article.author_id,article.category_id,article.hero_media_id,article.title,article.slug,article.excerpt,article.body,article.sources,now,admin.email,admin.email,now,now]})));
    await audit(admin.email,"blog.bulk_import","blog_posts",undefined,{count:articles.length,file:file.name.slice(0,180)}).catch(()=>undefined);return redirect(request,`${articles.length} blog draft${articles.length===1?"":"s"} imported successfully.`);
  }catch(error){return redirect(request,error instanceof Error?error.message:"Blog import failed.",true);}
}
