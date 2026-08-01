import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "../components/product-card";
import { SiteShell } from "../components/site-shell";
import { latestCatalog, posts, productList, topCategories } from "../lib/content";
import { capabilities, siteConfig } from "../lib/site";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Yone International",
  url: siteConfig.currentSite,
  logo: `${siteConfig.currentSite}/images/yone-logo-original.jpg`,
  email: siteConfig.email,
  telephone: "+923448416718",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Head Marala Road, Machi Khokhar",
    addressLocality: "Sialkot",
    addressCountry: "PK",
  },
  sameAs: [
    siteConfig.instagram,
    siteConfig.linkedin,
    siteConfig.facebook,
    siteConfig.twitter,
  ],
};

export const dynamic="force-dynamic";
export default async function Home() {
  const [categories,featured,articles,catalog]=await Promise.all([topCategories(),productList({featured:true,limit:6}),posts(),latestCatalog()]);
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <section className="hero">
        <div className="site-container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow eyebrow-light">
              Sialkot, Pakistan <span aria-hidden="true">·</span> Export-oriented manufacturing
            </p>
            <h1>Precision Surgical, Dental &amp; Beauty Instruments from Sialkot, Pakistan.</h1>
            <p className="hero-lead">
              Yone International supports professional and international buyers with
              focused manufacturing, clear communication and configurable supply options.
            </p>
            <div className="button-row">
              <Link className="button button-primary" href="/rfq">
                Request a Quote <span aria-hidden="true">→</span>
              </Link>
              <Link className="button button-ghost" href="/products">
                View Products
              </Link>
              <a className="button button-ghost" href="/catalog">
                {catalog ? "Download Catalog" : "View Product Catalog"}
              </a>
            </div>
            <p className="hero-note">
              Multi-product RFQs welcome · No buyer account required
            </p>
          </div>

          <div className="hero-visual">
            <div className="hero-image-frame">
              <Image
                src="/images/precision-instruments.webp"
                alt="Precision surgical and dental instruments arranged on a clean inspection bench"
                width={1440}
                height={1440}
                sizes="(max-width: 900px) 100vw, 48vw"
                priority
                unoptimized
              />
            </div>
            <div className="hero-proof-card">
              <span className="proof-mark" aria-hidden="true">✓</span>
              <div>
                <strong>Buyer documentation</strong>
                <span>Product-specific compliance files shared on request</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="credibility" aria-labelledby="credibility-title">
        <h2 className="sr-only" id="credibility-title">Company facts</h2>
        <div className="site-container credibility-grid">
          <div><strong>40 years</strong><span>Manufacturing expertise*</span></div>
          <div><strong>Sialkot</strong><span>Pakistan-based production</span></div>
          <div><strong>3 core ranges</strong><span>Dental · Beauty · Surgical</span></div>
          <div><strong>One RFQ</strong><span>Multiple products &amp; quantities</span></div>
        </div>
        <p className="claim-note site-container">
          *Owner-provided experience statement. The exact founding year is awaiting documentary confirmation.
        </p>
      </section>

      <section className="section" id="products">
        <div className="site-container">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Product range</p>
              <h2>Built around professional requirements.</h2>
            </div>
            <p>
              Browse administrator-managed categories, then add the products and quantities
              you need to one quotation request.
            </p>
          </div>

          <div className="category-grid">
            {categories.map((category,index) => (
              <Link
                className="category-card"
                key={category.slug}
                href={`/products/${category.slug}`}
              >
                <span className="category-number">{String(index+1).padStart(2,"0")}</span>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <span className="card-link">Explore category <span aria-hidden="true">→</span></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {featured.length>0&&<section className="section"><div className="site-container"><div className="section-heading split-heading"><div><p className="eyebrow">Featured products</p><h2>Approved instrument records.</h2></div><Link className="inline-link" href="/products">View all products →</Link></div><div className="product-grid">{featured.map((product)=><ProductCard key={product.id} product={product}/>)}</div></div></section>}

      <section className="section section-mist" id="capabilities">
        <div className="site-container capability-grid">
          <div className="capability-copy">
            <p className="eyebrow">Flexible supply</p>
            <h2>Your label. Your packaging. Your market requirements.</h2>
            <p>
              From early samples to configured packaging and international dispatch,
              the enquiry process is designed to capture the details procurement teams need.
            </p>
            <Link className="inline-link" href="/manufacturing">
              Review manufacturing capabilities <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="capability-list">
            {capabilities.map((capability, index) => (
              <div key={capability}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{capability}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      {articles.length>0&&<section className="section section-mist"><div className="site-container"><div className="section-heading split-heading"><div><p className="eyebrow">Latest insights</p><h2>Approved company and industry updates.</h2></div><Link className="inline-link" href="/blog">All articles →</Link></div><div className="content-card-grid">{articles.slice(0,3).map((post)=><article className="content-card" key={post.id}><p className="eyebrow">{post.categoryName||"Company update"}</p><h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3><p>{post.excerpt}</p></article>)}</div></div></section>}

      <section className="section process-section">
        <div className="site-container">
          <div className="section-heading centered-heading">
            <p className="eyebrow">From requirement to dispatch</p>
            <h2>A clear B2B enquiry process.</h2>
          </div>
          <ol className="process-grid">
            <li><span>01</span><h3>Define</h3><p>Select products or describe the exact instrument requirement.</p></li>
            <li><span>02</span><h3>Review</h3><p>Confirm specifications, quantities, documents and target market.</p></li>
            <li><span>03</span><h3>Configure</h3><p>Align labelling, samples and packaging where required.</p></li>
            <li><span>04</span><h3>Dispatch</h3><p>Agree shipping details before international fulfilment.</p></li>
          </ol>
        </div>
      </section>

      <section className="section quality-teaser">
        <div className="site-container quality-grid">
          <div className="quality-panel">
            <p className="eyebrow eyebrow-light">Quality &amp; compliance</p>
            <h2>Verify the documentation that applies to your exact order.</h2>
            <p>
              Quality and compliance documentation is managed per buyer and product
              requirement. Scope, certificate details and market suitability should be
              confirmed before order placement.
            </p>
            <Link className="button button-ghost" href="/quality">How we present compliance</Link>
          </div>
          <aside className="principles-card">
            <p>OUR QUALITY PRINCIPLES</p>
            <ul>
              <li><span>01</span> Requirements captured before quotation</li>
              <li><span>02</span> Product-specific documentation</li>
              <li><span>03</span> Transparent unverified fields</li>
              <li><span>04</span> Traceable buyer enquiries</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="section ceo-teaser">
        <div className="site-container ceo-teaser-grid">
          <div>
            <p className="eyebrow">Leadership</p>
            <h2>A message from Muhammad Mutahar ACCA.</h2>
          </div>
          <div>
            <p>
              Learn how Yone International approaches precision manufacturing,
              international buyer relationships and responsible product communication.
            </p>
            <Link className="inline-link" href="/about/ceo-message">
              Read the CEO message <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section final-cta">
        <div className="site-container final-cta-inner">
          <div>
            <p className="eyebrow eyebrow-light">Start a conversation</p>
            <h2>Tell us what you need to source.</h2>
            <p>Add several requirements, quantities and documents to one structured RFQ.</p>
          </div>
          <div className="button-row">
            <Link className="button button-primary" href="/rfq">Build your RFQ</Link>
            <a className="button button-ghost" href={siteConfig.whatsappHref}>WhatsApp</a>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
