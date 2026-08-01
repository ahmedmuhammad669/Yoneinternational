import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState, PageHero } from "../../components/page-hero";
import { SiteShell } from "../../components/site-shell";
import { posts } from "../../lib/content";

export const metadata: Metadata = { title: "Insights & Company News", robots: { index: true, follow: true }, alternates: { canonical: "/blog" } };
export const dynamic="force-dynamic";

export default async function BlogPage() {
  const items=await posts();
  return <SiteShell><PageHero eyebrow="Blog / News" title="Approved insights, not automated noise." description="Company updates, product guides, manufacturing information and source-checked industry topics appear here after editorial approval." breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog / News" }]} /><section className="section"><div className="site-container">{items.length?<div className="content-card-grid">{items.map((post)=><article className="content-card" key={post.id}><p className="eyebrow">{post.categoryName||"Company news"}</p><h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2><p>{post.excerpt||"Open the approved article."}</p><span>{post.publishedAt?new Date(post.publishedAt*1000).toLocaleDateString("en-GB"):""}</span></article>)}</div>:<EmptyState title="No articles are published yet." description="Draft or AI-assisted articles remain private until a named editor reviews sources, accuracy and originality." action={<Link className="button button-dark" href="/contact">Contact the company</Link>} />}</div></section></SiteShell>;
}
