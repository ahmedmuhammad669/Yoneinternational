import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../../components/page-hero";
import { SiteShell } from "../../components/site-shell";

export const metadata: Metadata = {
  title: "Quality & Compliance",
  description:
    "Request the product and market-specific quality or compliance documentation relevant to your Yone International enquiry.",
  alternates: { canonical: "/quality" },
};

export default function QualityPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Quality & compliance"
        title="Verify what applies to the product and market."
        description="Quality and regulatory requirements differ by instrument, intended market and buyer specification. Yone International keeps those details connected to the exact enquiry."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Quality & Compliance" }]}
      />
      <section className="section">
        <div className="site-container prose-grid">
          <div><p className="eyebrow">Documentation approach</p><h2>Specific evidence, not generic badges.</h2></div>
          <div className="rich-copy">
            <p>
              The relevant scope, certificate details, product coverage and market
              suitability must be checked for the items in your enquiry before any
              commercial decision.
            </p>
            <p>
              State the standard or document your target market requires in the RFQ.
              Available evidence can then be reviewed against the exact requested product.
            </p>
            <div className="notice-card">
              <strong>Important</strong>
              <p>ISO 13485 and CE information supplied by the company will remain an admin Draft until the certificate scope, number, validity and covered products are verified. No certification logo or regulatory approval is published before that review.</p>
            </div>
            <Link className="button button-dark" href="/rfq">Add a documentation requirement</Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
