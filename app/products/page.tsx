import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState, PageHero } from "../../components/page-hero";
import { ProductCard } from "../../components/product-card";
import { SiteShell } from "../../components/site-shell";
import { productList, topCategories } from "../../lib/content";

export const metadata: Metadata = {
  title: "Instrument Categories",
  description:
    "Explore Yone International dental, beauty and surgical instrument categories and request product information.",
  alternates: { canonical: "/products" },
};

export const dynamic="force-dynamic";
export default async function ProductsPage({searchParams}:{searchParams:Promise<{q?:string}>}) {
  const query=await searchParams;const term=(query.q||"").trim().slice(0,100);const [categories,results]=await Promise.all([topCategories(),term?productList({search:term}):Promise.resolve([])]);
  return (
    <SiteShell>
      <PageHero
        eyebrow="Products"
        title="Find the instrument range you need."
        description="Published catalog records are organised by category and subcategory. Only approved product names, codes, images and specifications appear publicly."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
      />
      <section className="section">
        <div className="site-container">
          <form className="catalog-toolbar" method="get"><label><span>Search by product name, SKU or keyword</span><input type="search" name="q" defaultValue={query.q||""}/></label><button className="button button-dark" type="submit">Search products</button></form>
          {term&&<section aria-labelledby="search-results"><h2 id="search-results">Search results for “{term}”</h2>{results.length?<div className="product-grid">{results.map((product)=><ProductCard product={product} key={product.id}/>)}</div>:<EmptyState title="No approved product matched." description="Try another name or SKU, or submit the exact reference through the RFQ form." action={<Link className="button button-dark" href="/rfq">Submit product reference</Link>}/>}</section>}
          {!term&&<>
          <div className="category-grid">
          {categories.map((category) => (
            <Link className="category-card" key={category.slug} href={`/products/${category.slug}`}>
              <span className="category-number">{String(category.sortOrder||10).padStart(2,"0")}</span>
              <h2>{category.name}</h2>
              <p>{category.description}</p>
              <span className="card-link">Browse category →</span>
            </Link>
          ))}</div></>}
        </div>
      </section>
    </SiteShell>
  );
}
