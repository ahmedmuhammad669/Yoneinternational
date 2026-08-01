import { NextResponse } from "next/server";
import { latestCatalog } from "../../lib/content";
import { siteConfig } from "../../lib/site";
export const dynamic="force-dynamic";
export async function GET(request:Request){
  const catalog=await latestCatalog();
  if(catalog)return NextResponse.redirect(new URL(`/api/media/${catalog.id}?download=1`,request.url),302);
  return NextResponse.redirect(siteConfig.catalog,302);
}
