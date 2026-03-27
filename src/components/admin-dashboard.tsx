/* eslint-disable @next/next/no-img-element */
import { updateLeadStatus } from "@/app/admin/actions";
import {
  quoteStatusLabels,
  type AdminQuoteRequestRecord,
} from "@/lib/leads";

type AdminDashboardProps = {
  leads: AdminQuoteRequestRecord[];
  attachmentsEnabled: boolean;
};

export function AdminDashboard({ leads, attachmentsEnabled }: AdminDashboardProps) {
  const leadCounts = {
    new: leads.filter((lead) => lead.status === "new").length,
    in_review: leads.filter((lead) => lead.status === "in_review").length,
    responded: leads.filter((lead) => lead.status === "responded").length,
    closed: leads.filter((lead) => lead.status === "closed").length,
  };

  if (leads.length === 0) {
    return (
      <div className="admin-empty">
        <h2>No quote requests yet</h2>
        <p>Once the public form is live and Supabase is configured, new leads will appear here automatically.</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="lead-summary-grid">
        <article className="lead-summary-card">
          <span>New</span>
          <strong>{leadCounts.new}</strong>
        </article>
        <article className="lead-summary-card">
          <span>In review</span>
          <strong>{leadCounts.in_review}</strong>
        </article>
        <article className="lead-summary-card">
          <span>Responded</span>
          <strong>{leadCounts.responded}</strong>
        </article>
        <article className="lead-summary-card">
          <span>Closed</span>
          <strong>{leadCounts.closed}</strong>
        </article>
      </div>

      {leads.map((lead) => (
        <article key={lead.id} className="lead-card">
          <div className="lead-card__header">
            <div>
              <p className="section-heading__eyebrow">{lead.project_type || "General inquiry"}</p>
              <h2>{lead.name || lead.email}</h2>
            </div>
            <form action={updateLeadStatus} className="lead-card__status-form">
              <input type="hidden" name="id" value={lead.id} />
              <select name="status" defaultValue={lead.status}>
                {Object.entries(quoteStatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <button type="submit" className="button button--secondary">
                Save
              </button>
            </form>
          </div>

          <div className="lead-card__meta">
            <span>{new Date(lead.created_at).toLocaleDateString()}</span>
            <span>{lead.email}</span>
            {lead.phone ? <span>{lead.phone}</span> : null}
            {lead.location ? <span>{lead.location}</span> : null}
            {lead.budget_range ? <span>{lead.budget_range}</span> : null}
            {lead.timeline ? <span>{lead.timeline}</span> : null}
          </div>

          <p>{lead.description}</p>

          {lead.measurements ? (
            <p className="lead-card__subtle">
              <strong>Measurements:</strong> {lead.measurements}
            </p>
          ) : null}

          <div className="lead-card__attachments">
            <strong>Attachments:</strong>{" "}
            {lead.attachments.length > 0
              ? `${lead.attachments.length} file(s) ready to open`
              : attachmentsEnabled
                ? "No uploads"
                : "Storage bucket not configured yet"}
          </div>

          {lead.attachments.length > 0 ? (
            <div className="lead-attachments-list">
              {lead.attachments.map((attachment) => (
                <article key={attachment.path} className="lead-attachment-card">
                  {attachment.isImage ? (
                    <a href={attachment.url} target="_blank" rel="noreferrer" className="lead-attachment-card__preview">
                      <img src={attachment.url} alt={attachment.name} className="lead-attachment-card__image" />
                    </a>
                  ) : null}
                  <div className="lead-attachment-card__body">
                    <p>{attachment.name}</p>
                    <div className="lead-attachment-card__actions">
                      <a
                        className="button button--secondary"
                        href={attachment.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open
                      </a>
                      <a
                        className="button button--secondary"
                        href={attachment.url}
                        download={attachment.name}
                      >
                        Download
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : null}

          <div className="lead-card__quick-actions">
            <a className="button button--secondary" href={`mailto:${lead.email}`}>
              Reply by Email
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
