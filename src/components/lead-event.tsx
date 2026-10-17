"use client";

import { useEffect } from "react";

// Records a lead when the quote-request confirmation is shown.
export function LeadEvent() {
  useEffect(() => {
    window.gtag?.("event", "generate_lead", { form_name: "quote_request" });
  }, []);

  return null;
}
