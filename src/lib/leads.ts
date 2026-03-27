export type QuoteRequestInsert = {
  name: string | null;
  email: string;
  phone: string | null;
  location: string | null;
  project_type: string | null;
  budget_range: string | null;
  timeline: string | null;
  measurements: string | null;
  description: string;
  attachment_paths: string[];
  status: "new" | "in_review" | "responded" | "closed";
};

export type QuoteRequestRecord = QuoteRequestInsert & {
  id: string;
  created_at: string;
};

export const quoteStatusLabels: Record<QuoteRequestRecord["status"], string> = {
  new: "New",
  in_review: "In review",
  responded: "Responded",
  closed: "Closed",
};
