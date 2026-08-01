import type { MetadataRoute } from "next";
import { safeAll } from "../lib/db";
import { localePath, locales } from "../lib/i18n";
import { baseUrl } from "../lib/site";

const routes = ["", "/company", "/company/our-story", "/company/leadership", "/about/ceo-message", "/products", "/manufacturing", "/quality", "/blog", "/gallery", "/careers", "/contact", "/rfq", "/privacy", "/terms", "/product-disclaimer", "/html-sitemap"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [categories,products,posts,albums,jobs]=await Promise.all([
    safeAll<{slug:string;updatedAt:number}>("SELECT slug,updated_at updatedAt FROM categories WHERE status='published' AND deleted_at IS NULL"),
    safeAll<{slug:string;categorySlug:string;parentSlug:string;updatedAt:number}>("SELECT p.slug,c.slug categorySlug,pc.slug parentSlug,p.updated_at updatedAt FROM products p JOIN categories c ON c.id=p.category_id LEFT JOIN categories pc ON pc.id=c.parent_id WHERE p.status='published' AND p.deleted_at IS NULL"),
    safeAll<{slug:string;updatedAt:number}>("SELECT slug,updated_at updatedAt FROM blog_posts WHERE status='published' AND deleted_at IS NULL"),
    safeAll<{slug:string;updatedAt:number}>("SELECT slug,updated_at updatedAt FROM gallery_albums WHERE status='published' AND deleted_at IS NULL"),
    safeAll<{slug:string;updatedAt:number}>("SELECT slug,updated_at updatedAt FROM jobs WHERE status='published' AND deleted_at IS NULL AND (closing_date IS NULL OR closing_date>=unixepoch())"),
  ]);
  const staticRoutes=routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/products" || route === "/rfq" ? 0.9 : 0.7,
  })) as MetadataRoute.Sitemap;
  const dynamicRoutes=[
    ...categories.map((row)=>({url:`${baseUrl}/products/${row.slug}`,lastModified:new Date(row.updatedAt*1000)})),
    ...products.filter((row)=>row.parentSlug).map((row)=>({url:`${baseUrl}/products/${row.parentSlug}/${row.categorySlug}/${row.slug}`,lastModified:new Date(row.updatedAt*1000)})),
    ...posts.map((row)=>({url:`${baseUrl}/blog/${row.slug}`,lastModified:new Date(row.updatedAt*1000)})),
    ...albums.map((row)=>({url:`${baseUrl}/gallery/${row.slug}`,lastModified:new Date(row.updatedAt*1000)})),
    ...jobs.map((row)=>({url:`${baseUrl}/careers/${row.slug}`,lastModified:new Date(row.updatedAt*1000)})),
  ] as MetadataRoute.Sitemap;
  return [...staticRoutes,...dynamicRoutes].flatMap((entry) => {
    const pathname = new URL(entry.url).pathname;
    return locales.map((locale) => ({
      ...entry,
      url: `${baseUrl}${localePath(locale, pathname)}`,
    }));
  });
}
