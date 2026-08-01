import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EmptyState, PageHero } from "../../../components/page-hero";
import { SiteShell } from "../../../components/site-shell";
import { categoryBySlug, productList, subcategories } from "../../../lib/content";
import { ProductCard } from "../../../components/product-card";
export const dynamic="force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await categoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: `Browse approved ${category.name.toLowerCase()} from Yone International or submit a product reference for quotation.`,
    alternates: { canonical: `/products/${category.slug}` },
    robots: { index: true, follow: true },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = await categoryBySlug(slug);
  if (!category) notFound();
  const [children,products]=await Promise.all([subcategories(category.id),productList({categoryId:category.id})]);

  return (
    <SiteShell>
      <PageHero
        eyebrow="Product category"
        title={category.name}
        description={category.description || `Browse approved ${category.name.toLowerCase()} or submit a product reference for quotation.`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: category.name },
        ]}
      />
      <section className="section">
        <div className="site-container">
          {children.length>0&&<div className="subcategory-grid">{children.map((child)=><Link className="subcategory-card" href={`/products/${category.slug}/${child.slug}`} key={child.id}><span>Subcategory</span><h2>{child.name}</h2><p>{child.description}</p><strong>Browse products →</strong></Link>)}</div>}
          {products.length>0&&<div className="product-grid">{products.map((product)=><ProductCard key={product.id} product={product}/>)}</div>}
          {!children.length&&!products.length&&<EmptyState
            title="No approved products are published here yet."
            description="Attach a catalog page, image or product reference to your RFQ and the team can review the requirement without inventing an online product record."
            action={<Link className="button button-dark" href="/rfq">Submit a product reference</Link>}
          />}
        </div>
      </section>
    </SiteShell>
  );
}
