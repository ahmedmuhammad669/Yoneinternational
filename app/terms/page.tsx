import type { Metadata } from "next";
import { LegalPage } from "../../components/legal-page";

export const metadata: Metadata = { title: "Terms of Use", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" description="The terms that apply when using Yone International’s website and enquiry services.">
      <h2>1. Informational purpose</h2>
      <p>This website supports B2B product discovery and enquiries. Website content, form submission and RFQ references do not create an order, contract, quotation, price commitment or delivery promise.</p>
      <h2>2. Written quotation controls</h2>
      <p>Product specifications, quantities, documentation, pricing, payment, packaging, shipping and delivery terms apply only when confirmed in an authorised written quotation or agreement.</p>
      <h2>3. Acceptable use</h2>
      <p>Do not misuse the website, attempt unauthorised access, upload malicious files, submit unlawful material or interfere with the availability of the service.</p>
      <h2>4. Intellectual property</h2>
      <p>Unless otherwise stated, the website’s original brand material, copy and approved media belong to Yone International or are used with permission. Product references supplied by visitors remain subject to their owners’ rights.</p>
      <h2>5. Accuracy and availability</h2>
      <p>Yone International aims to keep published information accurate, but details may change and must be verified for the intended order and market. External links and service availability are not guaranteed.</p>
      <h2>6. Legal review</h2>
      <p>These terms are an operational website draft and should receive appropriate legal review before the public production launch.</p>
    </LegalPage>
  );
}

