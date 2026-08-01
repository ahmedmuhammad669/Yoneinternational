import Link from "next/link";
import { SiteShell } from "../components/site-shell";

export default function NotFound() {
  return (
    <SiteShell>
      <section className="not-found"><div className="site-container"><p className="eyebrow">404 · Page not found</p><h1>The instrument page you requested is not available.</h1><p>It may be unpublished, archived or moved. Browse the product categories or start a quotation enquiry with your own reference.</p><div className="button-row"><Link className="button button-dark" href="/products">Browse Products</Link><Link className="button button-outline" href="/rfq">Request a Quote</Link></div></div></section>
    </SiteShell>
  );
}

