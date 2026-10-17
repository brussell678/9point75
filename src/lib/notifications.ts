type QuoteNotificationInput = {
  name: string | null;
  email: string;
  phone: string | null;
  location: string | null;
  projectType: string | null;
  budgetRange: string | null;
  timeline: string | null;
  measurements: string | null;
  description: string;
  attachmentPaths: string[];
};

const OWNER_EMAIL = "9point75woodworks@gmail.com";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatValue(value: string | null) {
  return value ? escapeHtml(value) : "Not provided";
}

function formatMultilineValue(value: string) {
  return escapeHtml(value).replace(/\n/g, "<br />");
}

// The form only requires a non-empty email, and Resend rejects the whole send on a bad reply_to.
function looksLikeEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function sendQuoteRequestNotification(input: QuoteNotificationInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.NOTIFICATION_FROM_EMAIL;
  const toEmail = process.env.NOTIFICATION_TO_EMAIL || process.env.ADMIN_EMAIL || OWNER_EMAIL;

  if (!apiKey || !fromEmail) {
    return { sent: false, skipped: true };
  }

  const subject = `New quote request from ${input.name || input.email}`;
  const attachments =
    input.attachmentPaths.length > 0
      ? `<ul>${input.attachmentPaths
          .map((path) => `<li>${escapeHtml(path)}</li>`)
          .join("")}</ul>`
      : "<p>No uploads</p>";

  const html = `
    <h1>New quote request</h1>
    <p>A new quote request was submitted on the 9point75 Woodworks website.</p>
    <h2>Contact</h2>
    <p><strong>Name:</strong> ${formatValue(input.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
    <p><strong>Phone:</strong> ${formatValue(input.phone)}</p>
    <p><strong>Location:</strong> ${formatValue(input.location)}</p>
    <h2>Project</h2>
    <p><strong>Project type:</strong> ${formatValue(input.projectType)}</p>
    <p><strong>Budget:</strong> ${formatValue(input.budgetRange)}</p>
    <p><strong>Timeline:</strong> ${formatValue(input.timeline)}</p>
    <p><strong>Measurements:</strong> ${formatValue(input.measurements)}</p>
    <p><strong>Description:</strong></p>
    <p>${formatMultilineValue(input.description)}</p>
    <h2>Uploads</h2>
    ${attachments}
    <p>Sign in to the admin portal to view uploaded files and manage this request.</p>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      subject,
      html,
      ...(looksLikeEmail(input.email) ? { reply_to: input.email } : {}),
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Notification email failed: ${text}`);
  }

  return { sent: true, skipped: false };
}
