import { redirect } from "next/navigation";
import { AdminShell } from "../../components/admin-shell";
import { requireAdmin, ownerCount } from "../../lib/admin";
import { all, first } from "../../lib/db";

export default async function AdminDashboard(){
  if(!await ownerCount())redirect("/admin/setup");
  const admin=await requireAdmin("/admin");
  const [counts,latest]=await Promise.all([
    Promise.all([
      first<{n:number}>("SELECT count(*) n FROM products WHERE deleted_at IS NULL"),
      first<{n:number}>("SELECT count(*) n FROM rfqs WHERE deleted_at IS NULL"),
      first<{n:number}>("SELECT count(*) n FROM contact_inquiries WHERE deleted_at IS NULL"),
      first<{n:number}>("SELECT count(*) n FROM media_assets WHERE deleted_at IS NULL"),
    ]),
    all<{reference:string;kind:string;createdAt:number}>("SELECT reference,'RFQ' kind,created_at createdAt FROM rfqs WHERE deleted_at IS NULL UNION ALL SELECT reference,'Contact' kind,created_at createdAt FROM contact_inquiries WHERE deleted_at IS NULL ORDER BY createdAt DESC LIMIT 8"),
  ]);
  return <AdminShell admin={admin}><div className="admin-page"><div className="admin-heading"><div><p className="eyebrow">Protected CMS</p><h1>Dashboard</h1></div><span className="status-pill">Database connected</span></div>
    <div className="admin-stats">{["Products","RFQs","Contact enquiries","Media files"].map((label,index)=><article key={label}><span>{label}</span><strong>{counts[index]?.n||0}</strong></article>)}</div>
    <section className="admin-panel"><h2>Recent enquiries</h2>{latest.length?<div className="admin-table-wrap"><table><thead><tr><th>Reference</th><th>Type</th><th>Received</th></tr></thead><tbody>{latest.map((row)=><tr key={`${row.kind}-${row.reference}`}><td>{row.reference}</td><td>{row.kind}</td><td>{new Date(row.createdAt*1000).toLocaleString("en-GB")}</td></tr>)}</tbody></table></div>:<p>No enquiries have been received yet.</p>}</section>
    <section className="admin-notice"><strong>Publishing safeguards</strong><p>Certificates stay private until evidence is verified. Testimonials require both verified feedback and publication permission. Drafts are never shown publicly.</p></section>
  </div></AdminShell>;
}
