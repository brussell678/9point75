"use client";

import clsx from "clsx";
import { useState } from "react";

type AdminTabsProps = {
  leadCount: number;
  leadsPanel: React.ReactNode;
  galleryPanel: React.ReactNode;
};

/**
 * Two clear workspaces instead of one long scroll:
 * "Quote Requests" (the day-to-day inbox) and "Gallery" (showing off the work).
 */
export function AdminTabs({ leadCount, leadsPanel, galleryPanel }: AdminTabsProps) {
  const [activeTab, setActiveTab] = useState<"leads" | "gallery">("leads");

  return (
    <div>
      <div className="admin-tabs" role="tablist" aria-label="Admin sections">
        <button
          type="button"
          role="tab"
          id="tab-leads"
          aria-selected={activeTab === "leads"}
          aria-controls="panel-leads"
          className={clsx("admin-tab", activeTab === "leads" && "admin-tab--active")}
          onClick={() => setActiveTab("leads")}
        >
          Quote Requests
          {leadCount > 0 ? <span className="admin-tab__count">{leadCount}</span> : null}
        </button>
        <button
          type="button"
          role="tab"
          id="tab-gallery"
          aria-selected={activeTab === "gallery"}
          aria-controls="panel-gallery"
          className={clsx("admin-tab", activeTab === "gallery" && "admin-tab--active")}
          onClick={() => setActiveTab("gallery")}
        >
          Gallery
        </button>
      </div>

      <div
        id="panel-leads"
        role="tabpanel"
        aria-labelledby="tab-leads"
        hidden={activeTab !== "leads"}
      >
        {leadsPanel}
      </div>
      <div
        id="panel-gallery"
        role="tabpanel"
        aria-labelledby="tab-gallery"
        hidden={activeTab !== "gallery"}
      >
        {galleryPanel}
      </div>
    </div>
  );
}
