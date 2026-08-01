import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { latestCatalog, topCategories } from "../lib/content";
import {
  getI18n,
  localizeReactNode,
  type Locale,
  type Translate,
} from "../lib/i18n";
import { primaryNav, siteConfig } from "../lib/site";
import { LanguageSwitcher } from "./language-switcher";

export function SiteHeader({
  locale,
  t,
  currentPath,
}: {
  locale: Locale;
  t: Translate;
  currentPath: string;
}) {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="utility-bar">
        <div className="site-container utility-inner">
          <p>Precision instrument manufacturing · Sialkot, Pakistan</p>
          <div className="utility-links" aria-label="Quick contact">
            <a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a>
            <span aria-hidden="true">•</span>
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          </div>
        </div>
      </div>
      <div className="nav-shell">
        <div className="site-container nav-inner">
          <Link className="brand" href="/" aria-label="Yone International home">
            <span className="brand-image-wrap">
              <Image
                className="brand-image"
                src="/images/yone-logo-clean.webp"
                alt="Yone International — Sialkot Experts"
                width={348}
                height={296}
                priority
                unoptimized
              />
            </span>
          </Link>

          <nav className="desktop-nav" aria-label="Primary navigation">
            {primaryNav.slice(0, 7).map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="nav-actions">
            <Link className="text-action" href="/products">Search</Link>
            <a className="text-action" href="/catalog">Catalog</a>
            <a
              className="text-action"
              href={siteConfig.whatsappHref}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
            <LanguageSwitcher
              locale={locale}
              languageLabel={t("Language")}
              currentPath={currentPath}
              compact
            />
            <Link className="button button-small button-light" href="/rfq">
              Request a Quote
            </Link>
          </div>

          <details className="mobile-menu">
            <summary aria-label="Open navigation menu">
              <span />
              <span />
              <span />
            </summary>
            <nav aria-label="Mobile navigation">
              {primaryNav.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
              <a href="/catalog">Product Catalog</a>
              <LanguageSwitcher
                locale={locale}
                languageLabel={t("Language")}
                currentPath={currentPath}
              />
              <Link className="button button-primary" href="/rfq">
                Request a Quote
              </Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}

export async function SiteFooter() {
  const [categories,catalog]=await Promise.all([topCategories(),latestCatalog()]);
  return (
    <footer className="site-footer">
      <div className="site-container footer-grid">
        <section className="footer-brand" aria-labelledby="footer-brand-title">
          <p className="footer-kicker">YONE INTERNATIONAL</p>
          <h2 id="footer-brand-title">Precision instruments, clearly specified.</h2>
          <p>
            Manufacturing dental, beauty and surgical instruments for professional
            buyers from Sialkot, Pakistan.
          </p>
          <Link className="button button-light" href="/rfq">
            Start an RFQ <span aria-hidden="true">→</span>
          </Link>
        </section>

        <nav aria-label="Product links">
          <h3>Products</h3>
          {categories.slice(0,5).map((category)=><Link href={`/products/${category.slug}`} key={category.id}>{category.name}</Link>)}
          <Link href="/products">All categories</Link>
          <a href="/catalog">{catalog ? "Download catalog" : "View product catalog"}</a>
        </nav>

        <nav aria-label="Company links">
          <h3>Company</h3>
          <Link href="/about">Our company</Link>
          <Link href="/about/ceo-message">CEO message</Link>
          <Link href="/manufacturing">Manufacturing</Link>
          <Link href="/quality">Quality &amp; compliance</Link>
          <Link href="/html-sitemap">HTML sitemap</Link>
        </nav>

        <section className="footer-contact" aria-labelledby="footer-contact-title">
          <h3 id="footer-contact-title">Contact</h3>
          <address>{siteConfig.address}</address>
          <a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a>
          <a href={siteConfig.whatsappHref}>{siteConfig.whatsappDisplay}</a>
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          <div className="social-links" aria-label="Social profiles">
            <a href={siteConfig.instagram} target="_blank" rel="noreferrer">Instagram</a>
            <a href={siteConfig.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <a href={siteConfig.facebook} target="_blank" rel="noreferrer">Facebook</a>
            <a href={siteConfig.twitter} target="_blank" rel="noreferrer">X / Twitter</a>
          </div>
        </section>
      </div>

      <div className="site-container footer-bottom">
        <p>© {new Date().getFullYear()} Yone International. All rights reserved.</p>
        <nav aria-label="Legal links">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/cookie-preferences">Cookie preferences</Link>
          <Link href="/product-disclaimer">Product disclaimer</Link>
        </nav>
      </div>
    </footer>
  );
}

export async function SiteShell({ children }: { children: ReactNode }) {
  const { locale, t, currentPath } = await getI18n();
  const header = SiteHeader({ locale, t, currentPath });
  const footer = await SiteFooter();

  return localizeReactNode(
    <>
      {header}
      <main id="main-content">{children}</main>
      {footer}
      <a
        className="whatsapp-float"
        href={siteConfig.whatsappHref}
        target="_blank"
        rel="noreferrer"
        aria-label={`Chat with Yone International on WhatsApp at ${siteConfig.whatsappDisplay}`}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M12 2a9.7 9.7 0 0 0-8.3 14.7L2.4 21.6l5-1.3A9.8 9.8 0 1 0 12 2Zm0 2a7.8 7.8 0 0 1 0 15.6c-1.3 0-2.5-.3-3.6-.9l-.7-.4-2.4.6.7-2.3-.5-.8A7.8 7.8 0 0 1 12 4Zm-3 3.6c-.2 0-.5.1-.7.3-.2.3-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.6 2.6 4 3.5 2 .8 2.4.6 2.9.5.4-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-1.5-.8c-.4-.2-.7-.3-.9.2l-.7.9c-.2.2-.4.3-.8.1a6.3 6.3 0 0 1-3-2.6c-.2-.4 0-.6.2-.8l.5-.6c.1-.2.1-.4 0-.6l-.7-1.7c-.2-.5-.4-.7-.8-.7H9Z" />
        </svg>
        <span>Chat on WhatsApp</span>
      </a>
      <div className="mobile-cta-bar" aria-label="Quick enquiry actions">
        <a href={siteConfig.whatsappHref} target="_blank" rel="noreferrer">
          Chat on WhatsApp
        </a>
        <Link href="/rfq">Request a Quote</Link>
      </div>
    </>,
    t,
    locale,
  );
}

export function Breadcrumbs({
  items,
}: {
  items: Array<{ label: string; href?: string }>;
}) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
