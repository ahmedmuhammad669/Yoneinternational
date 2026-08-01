import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "../../../components/page-hero";
import { SiteShell } from "../../../components/site-shell";
import { albumBySlug, albumImages } from "../../../lib/content";
export const dynamic="force-dynamic";
export default async function AlbumPage({params}:{params:Promise<{album:string}>}){const {album:slug}=await params;const album=await albumBySlug(slug);if(!album)notFound();const images=await albumImages(album.id);return <SiteShell><PageHero eyebrow="Gallery album" title={album.name} description={album.description||"Approved authentic images from Yone International."} breadcrumbs={[{label:"Home",href:"/"},{label:"Gallery",href:"/gallery"},{label:album.name}]}/><section className="section"><div className="site-container gallery-grid">{images.map((image)=><figure key={image.id}><Image src={`/api/media/${image.mediaId}`} alt={image.altText||""} width={1200} height={900} unoptimized/>{image.caption&&<figcaption>{image.caption}</figcaption>}</figure>)}</div></section></SiteShell>;}
