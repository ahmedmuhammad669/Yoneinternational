import type { Metadata } from "next";
import { LegalPage } from "../../components/legal-page";

export const metadata: Metadata = { title: "Cookie Preferences", robots: { index: false, follow: true }, alternates: { canonical: "/cookie-preferences" } };

export default function CookiePreferencesPage() {
  return (
    <LegalPage title="Cookie Preferences" description="Understand and control nonessential website measurement.">
      <h2>Essential operation</h2>
      <p>Essential storage may be used for security, authentication, RFQ basket continuity, form protection and your privacy choice. It cannot be disabled where the requested service depends on it.</p>
      <h2>Privacy-friendly analytics</h2>
      <p>Nonessential analytics is designed to use coarse, anonymous event information rather than a named visitor profile. It does not provide Yone International with your real identity unless you knowingly submit it through a form.</p>
      <div className="preference-card">
        <div><strong>Essential</strong><span>Always active</span></div>
        <p>Required for website and security functions.</p>
      </div>
      <div className="preference-card">
        <div><strong>Anonymous analytics</strong><span>Not active in this review build</span></div>
        <p>A consent control will be enabled only when the corresponding production measurement service is configured and verified.</p>
      </div>
    </LegalPage>
  );
}

