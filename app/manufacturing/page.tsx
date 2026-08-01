import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../../components/page-hero";
import { SiteShell } from "../../components/site-shell";
import { capabilities } from "../../lib/site";

export const metadata: Metadata = {
  title: "Manufacturing & Buyer Support",
  description:
    "Learn how Yone International supports product enquiries, samples, private labelling, custom packaging and international shipping.",
  alternates: { canonical: "/manufacturing" },
};

export default function ManufacturingPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Manufacturing"
        title="Configured around the buyer’s requirement."
        description="A disciplined enquiry flow for product references, samples, branding, packaging, documentation and international dispatch."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Manufacturing" }]}
      />
      <section className="section">
        <div className="site-container">
          <div className="section-heading split-heading">
            <div><p className="eyebrow">Confirmed capabilities</p><h2>Support beyond the instrument.</h2></div>
            <p>Exact materials, finishes, dimensions, manufacturing processes and commercial terms are confirmed against the specific product enquiry.</p>
          </div>
          <div className="service-grid">
            {capabilities.map((item, index) => (
              <article key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item}</h3>
                <p>
                  {item === "Private labelling" && "Share your branding and product requirements; the available scope will be confirmed for the requested items."}
                  {item === "Pre-order samples" && "Request samples for review. Availability, quantity, cost and shipping terms are confirmed per enquiry."}
                  {item === "Custom packaging" && "Provide the packaging format, branding files and target-market requirements with your RFQ."}
                  {item === "International shipping" && "Destination, carrier, cost, documentation and dispatch timing are agreed in the quotation."}
                </p>
              </article>
            ))}
          </div>
          <div className="inline-cta">
            <div><p className="eyebrow">Have a reference?</p><h2>Attach it to one structured RFQ.</h2></div>
            <Link className="button button-dark" href="/rfq">Request a Quote</Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

