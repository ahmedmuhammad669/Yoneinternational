import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "../../../components/page-hero";
import { SiteShell } from "../../../components/site-shell";

export const metadata: Metadata = {
  title: "CEO Message",
  description: "A leadership message from Muhammad Mutahar ACCA of Yone International.",
  alternates: { canonical: "/about/ceo-message" },
};

export default function CeoMessagePage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Leadership"
        title="A message from Muhammad Mutahar ACCA."
        description="A practical commitment to clear communication, responsible claims and buyer-focused manufacturing support."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Company", href: "/about" },
          { label: "CEO Message" },
        ]}
      />
      <section className="section">
        <div className="site-container leader-grid">
          <figure className="leader-photo">
            <Image
              src="/images/muhammad-mutahar-ceo.webp"
              alt="Muhammad Mutahar ACCA at the Yone International office"
              width={1200}
              height={1016}
              sizes="(max-width: 800px) 100vw, 42vw"
              priority
              unoptimized
            />
            <figcaption>
              <strong>Muhammad Mutahar ACCA</strong>
              <span>Director · Yone International</span>
            </figcaption>
          </figure>
          <article className="leadership-message">
            <p className="message-lead">
              At Yone International, we focus on clear communication and practical
              support for professional buyers.
            </p>
            <p>
              From Sialkot, Pakistan, we manufacture dental, beauty and surgical
              instruments and offer private labelling, samples, custom packaging and
              international shipping.
            </p>
            <p>
              Every enquiry is different. We ask buyers to share their product
              references, estimated quantities, target market, required documentation,
              branding and packaging needs so available specifications and commercial
              terms can be confirmed accurately.
            </p>
            <p>
              We welcome enquiries from distributors, importers, clinics, procurement
              teams and private-label buyers. We look forward to understanding your
              requirements and discussing how Yone International can support them.
            </p>
            <Link className="button button-dark" href="/rfq">Start a quotation enquiry</Link>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
