import type { Metadata } from "next";
import { LegalPage } from "../../components/legal-page";

export const metadata: Metadata = { title: "Product Information Disclaimer", alternates: { canonical: "/product-disclaimer" } };

export default function ProductDisclaimerPage() {
  return (
    <LegalPage title="Product Information / Regulatory Disclaimer" description="Important context for evaluating product descriptions, images and compliance information.">
      <h2>Product information</h2>
      <p>Website content is provided for B2B product enquiry and is not medical advice. Images are illustrative of the identified product record and do not override approved written specifications.</p>
      <h2>Verified fields only</h2>
      <p>Materials, finish, dimensions, intended use, sterility, reuse, sterilisation, packaging and regulatory status apply only when visibly published and confirmed in product-specific supporting documentation.</p>
      <h2>Market responsibility</h2>
      <p>Buyers must identify and verify the import, registration, labelling, documentation and use requirements for their destination market. A general company statement does not establish suitability of every product for every jurisdiction.</p>
      <h2>Commercial confirmation</h2>
      <p>Availability, MOQ, sample terms, lead time, price and shipping are confirmed separately in writing. Submitting an enquiry does not reserve stock or establish a commercial commitment.</p>
    </LegalPage>
  );
}

