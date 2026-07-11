/* eslint-disable @next/next/no-img-element */
"use client";

import clsx from "clsx";
import { useMemo, useState } from "react";
import { deleteLead } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/confirm-button";
import { LeadStatusPicker } from "@/components/lead-status-picker";
import {
  quoteStatusLabels,
  type AdminQuoteRequestRecord,
  type QuoteRequestRecord,
} from "@/lib/leads";

type AdminDashboardProps = {
  leads: AdminQuoteRequestRecord[];
  attachmentsEnabled: boolean;
};

type StatusFilter = "all" | QuoteRequestRecord["status"];

export function AdminDashboard({ leads, attachmentsEnabled }: AdminDashboardProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const leadCounts = useMemo(
    () => ({
      all: leads.length,
      new: leads.filter((lead) => lead.status === "new").length,
      in_review: leads.filter((lead) => lead.status === "in_review").length,
      responded: leads.filter((lead) => lead.status === "responded").length,
      closed: leads.filter((lead) => lead.status === "closed").length,
    }),
    [leads],
  );

  const visibleLeads =
    statusFilter === "all" ? leads : leads.filter((lead) => lead.status === statusFilter);

  if (leads.length === 0) {
    return (
      <div className="admin-empty">
        <h2>No quote requests yet</h2>
        <p>
          When someone fills out the &ldquo;Request a Quote&rdquo; form on the website, their project
          shows up right here — with their contact info and any photos they attached.
        </p>
      </div>
    );
  }

  const filterTiles: Array<{ key: StatusFilter; label: string }> = [
    { key: "all", label: "All requests" },
    { key: "new", label: quoteStatusLabels.new },
    { key: "in_review", label: quoteStatusLabels.in_review },
    { key: "responded", label: quoteStatusLabels.responded },
    { key: "closed", label: quoteStatusLabels.closed },
  ];

  return (
    <div className="admin-dashboard">
      <div className="lead-summary-grid">
        {filterTiles.map((tile) => (
          <button
            key={tile.key}
            type="button"
            className={clsx(
              "lead-summary-card",
              statusFilter === tile.key && "lead-summary-card--active",
            )}
            aria-pressed={statusFilter === tile.key}
            onClick={() => setStatusFilter(tile.key)}
          >
            <span>{tile.label}</span>
            <strong>{leadCounts[tile.key]}</strong>
          </button>
        ))}
      </div>

      {visibleLeads.length === 0 ? (
        <div className="admin-empty">
          <h2>Nothing under &ldquo;{filterTiles.find((t) => t.key === statusFilter)?.label}&rdquo;</h2>
          <p>Tap &ldquo;All requests&rdquo; above to see everything.</p>
        </div>
      ) : null}

      {visibleLeads.map((lead) => (
        <article key={lead.id} className="lead-card">
          <div className="lead-card__header">
            <div>
              <p className="section-heading__eyebrow">{lead.project_type || "General inquiry"}</p>
              <h2>{lead.name || lead.email}</h2>
            </div>
          </div>

          <LeadStatusPicker leadId={lead.id} currentStatus={lead.status} />

          <div className="lead-card__meta">
            <span>
              Received{" "}
              {new Date(lead.created_at).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span>{lead.email}</span>
            {lead.phone ? <span>{lead.phone}</span> : null}
            {lead.location ? <span>{lead.location}</span> : null}
            {lead.budget_range ? <span>Budget: {lead.budget_range}</span> : null}
            {lead.timeline ? <span>Timeline: {lead.timeline}</span> : null}
          </div>

          <p>{lead.description}</p>

          {lead.measurements ? (
            <p className="lead-card__subtle">
              <strong>Measurements:</strong> {lead.measurements}
            </p>
          ) : null}

          {lead.attachments.length > 0 ? (
            <div className="lead-attachments-list">
              {lead.attachments.map((attachment) => (
                <article key={attachment.path} className="lead-attachment-card">
                  {attachment.isImage ? (
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noreferrer"
                      className="lead-attachment-card__preview"
                    >
                      <img
                        src={attachment.url}
                        alt={attachment.name}
                        className="lead-attachment-card__image"
                      />
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
                      <a className="button button--secondary" href={attachment.url} download={attachment.name}>
                        Download
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="lead-card__attachments">
              {attachmentsEnabled ? "No photos attached." : "Photo uploads aren't set up yet."}
            </p>
          )}

          <div className="lead-card__quick-actions">
            <a
              className="button button--primary"
              href={`mailto:${lead.email}?subject=${encodeURIComponent("Your quote request — 9point75 Woodworks")}`}
            >
              Reply by Email
            </a>
            <form action={deleteLead}>
              <input type="hidden" name="id" value={lead.id} />
              <ConfirmButton
                className="button button--danger"
                message={`Delete the request from ${lead.name || lead.email}? This can't be undone.`}
              >
                Delete Request
              </ConfirmButton>
            </form>
          </div>
        </article>
      ))}
    </div>
  );
}
