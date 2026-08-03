import type { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "../../components/page-hero";
import { SiteShell } from "../../components/site-shell";
import { SubmitButton } from "../../components/submit-button";
import { safeAll } from "../../lib/db";

export const metadata: Metadata = { title: "Request a Quote", description: "Submit one quotation enquiry for multiple products and describe your branding, packaging and target-market requirements.", alternates: { canonical: "/rfq" } };

export const dynamic="force-dynamic";
export default async function RfqPage({searchParams}:{searchParams:Promise<{error?:string;added?:string}>}) {
  const query=await searchParams;const basketId=(await cookies()).get("yone_rfq_basket")?.value;const items=basketId?await safeAll<{id:string;productId:string;quantity:number;name:string;sku:string|null;imageId:string|null}>('SELECT bi.id,bi.product_id AS "productId",bi.quantity,p.name,p.sku,pm.media_id AS "imageId" FROM rfq_basket_items bi JOIN products p ON p.id=bi.product_id LEFT JOIN product_media pm ON pm.product_id=p.id AND pm.is_primary=1 WHERE bi.basket_id=? ORDER BY bi.created_at',basketId):[];
  return (
    <SiteShell>
      <PageHero eyebrow="Request a Quote" title="One enquiry. Multiple requirements." description="No account is required. Submitting an RFQ records an enquiry, not an order, and does not promise price, availability, MOQ or delivery timing." breadcrumbs={[{ label: "Home", href: "/" }, { label: "RFQ Basket" }]} />
      <section className="section">
        <div className="site-container form-layout">
          <aside className="form-aside">
            <p className="eyebrow">Your RFQ basket</p>
            <h2>{items.length?`${items.length} selected ${items.length===1?"product":"products"}.`:"Help us understand the order."}</h2>
            <ul>
              <li>Exact product names, SKUs or references</li>
              <li>Estimated quantities</li>
              <li>Target market and required documentation</li>
              <li>Private-label and packaging needs</li>
              <li>Preferred delivery date, if relevant</li>
            </ul>
            {items.length>0&&<div className="basket-items">{items.map((item)=><article key={item.id}>{item.imageId?<Image src={`/api/media/${item.imageId}`} alt="" width={72} height={72} unoptimized/>:<span className="basket-placeholder">YI</span>}<div><strong>{item.name}</strong>{item.sku&&<span>{item.sku}</span>}<form action="/api/rfq/basket" method="post"><input type="hidden" name="productId" value={item.productId}/><input type="hidden" name="returnTo" value="/rfq"/><label><span>Quantity</span><input type="number" name="quantity" defaultValue={item.quantity} min="1" required/></label><button className="text-button">Update</button></form><form action="/api/rfq/basket" method="post"><input type="hidden" name="action" value="remove"/><input type="hidden" name="itemId" value={item.id}/><input type="hidden" name="returnTo" value="/rfq"/><button className="text-button danger">Remove</button></form></div></article>)}</div>}
          </aside>
          <form className="rfq-form" action="/api/rfq" method="post" encType="multipart/form-data">
            {query.added&&<div className="form-success" role="status">Product added to your RFQ.</div>}
            {query.error&&<div className="form-error" role="alert" tabIndex={-1} autoFocus>{query.error}</div>}
            <div className="form-section-heading"><span>01</span><div><h2>Buyer details</h2><p>Required fields are marked with an asterisk.</p></div></div>
            <div className="field-grid">
              <label><span>Full name *</span><input name="fullName" autoComplete="name" required /></label>
              <label><span>Business email *</span><input type="email" name="email" autoComplete="email" required /></label>
              <label><span>Company name *</span><input name="company" autoComplete="organization" required /></label>
              <label><span>Country *</span><input name="country" autoComplete="country-name" required /></label>
              <label><span>Phone / WhatsApp</span><input name="phone" autoComplete="tel" /></label>
              <label><span>Target market</span><input name="targetMarket" /></label>
            </div>

            <div className="form-section-heading"><span>02</span><div><h2>Product requirements</h2><p>You can list several products and quantities.</p></div></div>
            <label className="field-full"><span>Products, SKUs or instrument references *</span><textarea name="products" rows={5} required placeholder="Example format: Product / reference — estimated quantity" /></label>
            <label className="field-full"><span>Message *</span><textarea name="message" rows={6} required placeholder="Describe specifications, application context and any questions." /></label>

            <details className="form-disclosure">
              <summary>Add project requirements</summary>
              <div className="field-grid disclosure-grid">
                <label><span>Required standard / certification</span><input name="requiredStandard" /></label>
                <label><span>Desired delivery date</span><input type="date" name="desiredDate" /></label>
                <label className="field-full"><span>Private-label requirements</span><textarea name="privateLabel" rows={3} /></label>
                <label className="field-full"><span>Packaging preference</span><textarea name="packaging" rows={3} /></label>
                <label className="field-full"><span>Reference file</span><input type="file" name="file" accept=".pdf,.jpg,.jpeg,.png,.webp" /><small>PDF, JPG, PNG or WebP up to 10 MB. Do not upload patient information.</small></label>
              </div>
            </details>

            <div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
            <label className="consent-field"><input type="checkbox" name="consent" value="yes" required /><span>I agree that Yone International may use these details to respond to this enquiry. See the <Link href="/privacy">Privacy Policy</Link>.</span></label>
            <SubmitButton pending="Submitting RFQ…">Submit Quote Request</SubmitButton>
          </form>
        </div>
      </section>
    </SiteShell>
  );
}
