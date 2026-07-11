"use client";

import clsx from "clsx";
import { useTransition } from "react";
import { updateLeadStatus } from "@/app/admin/actions";
import { quoteStatusLabels, type QuoteRequestRecord } from "@/lib/leads";

type LeadStatusPickerProps = {
  leadId: string;
  currentStatus: QuoteRequestRecord["status"];
};

/**
 * One-tap status buttons — no dropdown, no separate Save step.
 * The current status is highlighted; tapping another one updates it immediately.
 */
export function LeadStatusPicker({ leadId, currentStatus }: LeadStatusPickerProps) {
  const [pending, startTransition] = useTransition();

  function setStatus(status: QuoteRequestRecord["status"]) {
    if (status === currentStatus || pending) {
      return;
    }

    const formData = new FormData();
    formData.set("id", leadId);
    formData.set("status", status);
    startTransition(() => updateLeadStatus(formData));
  }

  return (
    <div className="status-picker" role="group" aria-label="Request status">
      <span className="status-picker__label">Status — tap to change</span>
      {(Object.entries(quoteStatusLabels) as Array<[QuoteRequestRecord["status"], string]>).map(
        ([value, label]) => (
          <button
            key={value}
            type="button"
            className={clsx("status-chip", value === currentStatus && "status-chip--current")}
            aria-pressed={value === currentStatus}
            disabled={pending}
            onClick={() => setStatus(value)}
          >
            {label}
          </button>
        ),
      )}
    </div>
  );
}
