import Link from "next/link";
import type { ReactNode } from "react";
import type { AdminIdentity } from "../lib/admin";
import { adminNav } from "../lib/admin-resources";
import { chatGPTSignOutPath } from "../app/chatgpt-auth";

export function AdminShell({ admin, children }: { admin: AdminIdentity; children: ReactNode }) {
  return <div className="admin-app">
    <aside className="admin-sidebar">
      <Link className="admin-brand" href="/admin">YONE <span>Admin</span></Link>
      <nav aria-label="Administration">
        {adminNav.map(([slug,label])=><Link href={slug==="overview"?"/admin":`/admin/${slug}`} key={slug}>{label}</Link>)}
      </nav>
      <a className="admin-signout" href={chatGPTSignOutPath("/")}>Secure sign out</a>
    </aside>
    <div className="admin-main">
      <header className="admin-topbar"><div><strong>{admin.displayName || admin.email}</strong><span>{admin.role}</span></div><Link href="/">View public site</Link></header>
      <main id="admin-content">{children}</main>
    </div>
  </div>;
}
