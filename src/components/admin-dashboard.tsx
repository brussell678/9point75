import { updateLeadStatus } from "@/app/admin/actions";
import { quoteStatusLabels, type QuoteRequestRecord } from "@/lib/leads";

type AdminDashboardProps = {
  leads: QuoteRequestRecord[];
  attachmentsEnabled: boolean;
};

export function AdminDashboard({ leads, attachmentsEnabled }: AdminDashboardProps) {
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
            {lead.attachment_paths.length > 0
              ? `${lead.attachment_paths.length} file(s) stored in Supabase`
              : attachmentsEnabled
                ? "No uploads"
                : "Storage bucket not configured yet"}
          </div>
        </article>
      ))}
    </div>
  );
}
