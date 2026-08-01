import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EmptyState, PageHero } from "../../components/page-hero";
import { SiteShell } from "../../components/site-shell";
import { albums } from "../../lib/content";

export const metadata: Metadata = { title: "Company Gallery", robots: { index: true, follow: true }, alternates: { canonical: "/gallery" } };
export const dynamic="force-dynamic";

export default async function GalleryPage() {
  const items=await albums();
  return <SiteShell><PageHero eyebrow="Gallery" title="Authentic images, published with context." description="Approved facility, manufacturing, packaging, conference, exhibition and product albums are managed through the secure admin area." breadcrumbs={[{ label: "Home", href: "/" }, { label: "Gallery" }]} /><section className="section"><div className="site-container">{items.length?<div className="content-card-grid">{items.map((album)=><Link className="content-card media-card" href={`/gallery/${album.slug}`} key={album.id}>{album.imageId&&<Image src={`/api/media/${album.imageId}`} alt="" width={800} height={600} unoptimized/>}<h2>{album.name}</h2><p>{album.description}</p></Link>)}</div>:<EmptyState title="No public albums are available yet." description="Only authentic Yone International photographs with approved captions and alt text will be published here." />}</div></section></SiteShell>;
}
