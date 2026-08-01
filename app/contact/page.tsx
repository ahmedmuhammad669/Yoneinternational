import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../../components/page-hero";
import { SiteShell } from "../../components/site-shell";
import { SubmitButton } from "../../components/submit-button";
import { siteConfig } from "../../lib/site";

export const metadata: Metadata = { title: "Contact Yone International", description: "Contact Yone International about instruments, private labelling, samples, packaging and international shipping.", alternates: { canonical: "/contact" } };

export const dynamic="force-dynamic";
export default async function ContactPage({searchParams}:{searchParams:Promise<{error?:string}>}) {
  const query=await searchParams;
  return (
    <SiteShell>
      <PageHero eyebrow="Contact" title="Let’s discuss your requirement." description="Use a direct channel for a quick conversation, or send a structured enquiry with the information needed for review." breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <section className="section">
        <div className="site-container contact-grid">
          <div className="contact-list">
            <article><span>EMAIL</span><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></article>
            <article><span>WHATSAPP</span><a href={siteConfig.whatsappHref}>{siteConfig.whatsappDisplay}</a></article>
            <article><span>TELEPHONE</span><a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a></article>
            <article><span>ADDRESS</span><p>{siteConfig.address}</p></article>
          </div>
          <form className="rfq-form" action="/api/contact" method="post">{query.error&&<div className="form-error" role="alert" tabIndex={-1} autoFocus>{query.error}</div>}<div className="form-section-heading"><span>01</span><div><h2>Contact enquiry</h2><p>Required fields are marked with an asterisk.</p></div></div><div className="field-grid"><label><span>Full name *</span><input name="fullName" required autoComplete="name"/></label><label><span>Business email *</span><input type="email" name="email" required autoComplete="email"/></label><label><span>Company</span><input name="company" autoComplete="organization"/></label><label><span>Country</span><input name="country" autoComplete="country-name"/></label><label><span>Phone / WhatsApp</span><input name="phone" autoComplete="tel"/></label><label><span>Subject</span><input name="subject"/></label></div><label className="field-full"><span>Message *</span><textarea name="message" rows={7} required/></label><div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div><label className="consent-field"><input type="checkbox" name="consent" value="yes" required/><span>I agree that Yone International may use these details to respond. See the <Link href="/privacy">Privacy Policy</Link>.</span></label><SubmitButton pending="Sending…">Send enquiry</SubmitButton></form>
        </div>
      </section>
    </SiteShell>
  );
}
