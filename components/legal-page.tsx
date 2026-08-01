import { PageHero } from "./page-hero";
import { SiteShell } from "./site-shell";

export function LegalPage({
  title,
  description,
  updated = "21 July 2026",
  children,
}: {
  title: string;
  description: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Legal information"
        title={title}
        description={description}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: title }]}
      />
      <section className="section legal-section">
        <article className="site-container legal-copy">
          <p className="legal-updated">Last updated: {updated}</p>
          {children}
        </article>
      </section>
    </SiteShell>
  );
}

