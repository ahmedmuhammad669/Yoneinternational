import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "../../../../components/admin-shell";
import { requireAdmin } from "../../../../lib/admin";
import { all, first } from "../../../../lib/db";

export const dynamic = "force-dynamic";

type RfqDetail = {
  id: string;
  reference: string;
  fullName: string;
  email: string;
  company: string;
  country: string;
  phone: string | null;
  targetMarket: string | null;
  requiredStandard: string | null;
  privateLabel: string | null;
  packaging: string | null;
  desiredDate: string | null;
  productsText: string | null;
  message: string;
  attachmentMediaId: string | null;
  consentAt: number;
  status: string;
  assignedTo: string | null;
  createdAt: number;
  updatedAt: number;
};

type RfqItem = {
  id: string;
  productName: string;
  sku: string | null;
  quantity: number;
  notes: string | null;
};

type InquiryNote = {
  id: string;
  note: string;
  createdBy: string;
  createdAt: number;
};

function Detail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="admin-detail-field">
      <dt>{label}</dt>
      <dd>{children || "—"}</dd>
    </div>
  );
}

export default async function RfqDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const admin = await requireAdmin(`/admin/rfqs/${id}`);

  const [rfq, items, notes] = await Promise.all([
    first<RfqDetail>(
      `SELECT id,reference,full_name AS fullName,email,company,country,phone,
        target_market AS targetMarket,required_standard AS requiredStandard,
        private_label AS privateLabel,packaging,desired_date AS desiredDate,
        products_text AS productsText,message,attachment_media_id AS attachmentMediaId,
        consent_at AS consentAt,status,assigned_to AS assignedTo,
        created_at AS createdAt,updated_at AS updatedAt
       FROM rfqs WHERE id=? AND deleted_at IS NULL`,
      id,
    ),
    all<RfqItem>(
      `SELECT id,product_name AS productName,sku,quantity,notes
       FROM rfq_items WHERE rfq_id=? ORDER BY created_at,id`,
      id,
    ),
    all<InquiryNote>(
      `SELECT id,note,created_by AS createdBy,created_at AS createdAt
       FROM inquiry_notes
       WHERE inquiry_type='rfqs' AND inquiry_id=?
       ORDER BY created_at DESC`,
      id,
    ),
  ]);

  if (!rfq) notFound();

  return (
    <AdminShell admin={admin}>
      <div className="admin-page">
        <div className="admin-heading admin-detail-heading">
          <div>
            <p className="eyebrow">Quotation enquiry</p>
            <h1>{rfq.reference}</h1>
          </div>
          <div className="button-row">
            <span className={`status-pill status-${rfq.status}`}>{rfq.status}</span>
            <Link className="button button-outline" href="/admin/rfqs">
              Back to RFQs
            </Link>
          </div>
        </div>

        {query.ok && <p className="form-success" role="status">{query.ok}</p>}

        <section className="admin-panel">
          <h2>Buyer details</h2>
          <dl className="admin-detail-grid">
            <Detail label="Full name">{rfq.fullName}</Detail>
            <Detail label="Company">{rfq.company}</Detail>
            <Detail label="Business email">
              <a href={`mailto:${rfq.email}`}>{rfq.email}</a>
            </Detail>
            <Detail label="Phone / WhatsApp">
              {rfq.phone ? <a href={`tel:${rfq.phone}`}>{rfq.phone}</a> : "—"}
            </Detail>
            <Detail label="Country">{rfq.country}</Detail>
            <Detail label="Target market">{rfq.targetMarket}</Detail>
          </dl>
        </section>

        <section className="admin-panel">
          <h2>Product requirements</h2>
          {items.length > 0 && (
            <div className="admin-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Quantity</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.productName}</td>
                      <td>{item.sku || "—"}</td>
                      <td>{item.quantity}</td>
                      <td>{item.notes || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="admin-message-block">
            <h3>Products, SKUs or instrument references</h3>
            <p>{rfq.productsText || (items.length ? "Selected products are listed above." : "—")}</p>
          </div>
          <div className="admin-message-block">
            <h3>Buyer message</h3>
            <p>{rfq.message}</p>
          </div>
        </section>

        <section className="admin-panel">
          <h2>Project requirements</h2>
          <dl className="admin-detail-grid">
            <Detail label="Required standard / certification">{rfq.requiredStandard}</Detail>
            <Detail label="Desired delivery date">{rfq.desiredDate}</Detail>
            <Detail label="Private-label requirements">{rfq.privateLabel}</Detail>
            <Detail label="Packaging preference">{rfq.packaging}</Detail>
            <Detail label="Reference file">
              {rfq.attachmentMediaId ? (
                <a
                  className="admin-detail-link"
                  href={`/api/media/${rfq.attachmentMediaId}?download=1`}
                >
                  Download secure attachment
                </a>
              ) : "No file attached"}
            </Detail>
            <Detail label="Consent recorded">
              {new Date(rfq.consentAt * 1000).toLocaleString("en-GB")}
            </Detail>
            <Detail label="Received">
              {new Date(rfq.createdAt * 1000).toLocaleString("en-GB")}
            </Detail>
            <Detail label="Last updated">
              {new Date(rfq.updatedAt * 1000).toLocaleString("en-GB")}
            </Detail>
          </dl>
        </section>

        <section className="admin-panel">
          <h2>Workflow</h2>
          <form className="workflow-form admin-detail-workflow" action="/api/admin/inquiries" method="post">
            <input type="hidden" name="type" value="rfqs" />
            <input type="hidden" name="id" value={rfq.id} />
            <input type="hidden" name="return_to" value={`/admin/rfqs/${rfq.id}`} />
            <label>
              <span>Status</span>
              <select name="status" defaultValue={rfq.status}>
                <option value="new">New</option>
                <option value="reviewing">Reviewing</option>
                <option value="quoted">Quoted</option>
                <option value="closed">Closed</option>
              </select>
            </label>
            <label>
              <span>Assigned to</span>
              <input name="assigned_to" defaultValue={rfq.assignedTo || ""} placeholder="Name or email" />
            </label>
            <label className="admin-detail-note">
              <span>Add internal note</span>
              <textarea name="note" rows={4} placeholder="Private note visible only to administrators" />
            </label>
            <button type="submit">Save workflow</button>
          </form>
        </section>

        <section className="admin-panel">
          <h2>Internal notes</h2>
          {notes.length ? (
            <div className="admin-notes">
              {notes.map((note) => (
                <article key={note.id}>
                  <p>{note.note}</p>
                  <small>
                    {note.createdBy} · {new Date(note.createdAt * 1000).toLocaleString("en-GB")}
                  </small>
                </article>
              ))}
            </div>
          ) : (
            <p>No internal notes yet.</p>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
