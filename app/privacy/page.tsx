import type { Metadata } from "next";
import { LegalPage } from "../../components/legal-page";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" description="How Yone International handles website enquiries, quotation requests and privacy choices.">
      <h2>1. Information you provide</h2>
      <p>We collect the information you knowingly submit through contact, quotation and career forms. This may include your name, business email, company, country, phone number, product requirements, message and approved file attachments.</p>
      <h2>2. How information is used</h2>
      <p>Submitted information is used to review and respond to the relevant business enquiry, manage follow-up, maintain records, protect the website and meet legal obligations. It is not used to create a misleading list of named website visitors.</p>
      <h2>3. Anonymous analytics</h2>
      <p>The website may collect privacy-friendly, anonymous usage events such as page views and quotation-button clicks. Anonymous analytics does not reveal a visitor’s real name, email or phone number. Raw IP addresses are not retained in the content-management system.</p>
      <h2>4. Files and service providers</h2>
      <p>Files are validated and stored according to their purpose. Private enquiry or application files are not treated as public media. Approved infrastructure, hosting, storage and email providers may process information only to operate the service.</p>
      <h2>5. Retention and deletion</h2>
      <p>Retention periods are configured by an authorised Owner. Until a final company retention schedule is approved, records are preserved for legitimate follow-up and security needs and may be reviewed for deletion on request.</p>
      <h2>6. Your choices</h2>
      <p>You may request access, correction or deletion of submitted personal information, subject to legal and operational requirements. You may also change nonessential analytics preferences at any time.</p>
      <h2>7. Contact</h2>
      <p>Privacy questions may be sent to <a href="mailto:yoneinternational@gmail.com">yoneinternational@gmail.com</a>.</p>
    </LegalPage>
  );
}

