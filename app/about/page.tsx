import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../../components/page-hero";
import { SiteShell } from "../../components/site-shell";

export const metadata: Metadata = {
  title: "About Yone International",
  description:
    "Learn about Yone International, a manufacturer of dental, beauty and surgical instruments based in Sialkot, Pakistan.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Company"
        title="Precision manufacturing support from Sialkot."
        description="Yone International manufactures dental, beauty and surgical instruments and supports professional B2B enquiries with private labelling, samples, custom packaging and international shipping."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Company" }]}
      />
      <section className="section">
        <div className="site-container prose-grid">
          <div>
            <p className="eyebrow">Our company</p>
            <h2>Clear information for serious buyers.</h2>
          </div>
          <div className="rich-copy">
            <p>
              Yone International is based on Head Marala Road in Machi Khokhar,
              Sialkot, Pakistan. Its core range covers dental, beauty and surgical
              instruments for distributors, importers, healthcare procurement teams
              and private-label buyers.
            </p>
            <p>
              Company ownership reports 40 years of manufacturing experience. The
              exact founding year will be published only after documentary confirmation.
            </p>
            <div className="link-cluster">
              <Link className="inline-link" href="/about/ceo-message">CEO message →</Link>
              <Link className="inline-link" href="/manufacturing">Manufacturing capabilities →</Link>
              <Link className="inline-link" href="/quality">Quality &amp; compliance →</Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

