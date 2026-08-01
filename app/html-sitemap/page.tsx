import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../../components/page-hero";
import { SiteShell } from "../../components/site-shell";
import { topCategories } from "../../lib/content";

export const metadata: Metadata = { title: "HTML Sitemap", robots: { index: false, follow: true }, alternates: { canonical: "/html-sitemap" } };

const groups = [
  { title: "Company", links: [["Home", "/"], ["Company", "/about"], ["CEO Message", "/about/ceo-message"], ["Manufacturing", "/manufacturing"], ["Quality & Compliance", "/quality"]] },
  { title: "Resources", links: [["Blog / News", "/blog"], ["Gallery", "/gallery"], ["Careers", "/careers"], ["Contact", "/contact"], ["Request a Quote", "/rfq"]] },
  { title: "Legal", links: [["Privacy Policy", "/privacy"], ["Terms of Use", "/terms"], ["Cookie Preferences", "/cookie-preferences"], ["Product Disclaimer", "/product-disclaimer"]] },
] as const;

export const dynamic="force-dynamic";
export default async function HtmlSitemapPage() {
  const categories=await topCategories();
  return (
    <SiteShell>
      <PageHero eyebrow="Sitemap" title="Find your way around Yone International." description="A clear index of public website pages and published product categories." breadcrumbs={[{ label: "Home", href: "/" }, { label: "HTML Sitemap" }]} />
      <section className="section"><div className="site-container sitemap-grid">
        <nav aria-label="Product sitemap"><h2>Products</h2><Link href="/products">All products</Link>{categories.map((item) => <Link key={item.slug} href={`/products/${item.slug}`}>{item.name}</Link>)}</nav>
        {groups.map((group) => <nav key={group.title} aria-label={`${group.title} sitemap`}><h2>{group.title}</h2>{group.links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>)}
      </div></section>
    </SiteShell>
  );
}
