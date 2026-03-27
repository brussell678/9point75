type QuoteNotificationInput = {
  name: string | null;
  email: string;
  projectType: string | null;
  budgetRange: string | null;
  timeline: string | null;
  description: string;
};

export async function sendQuoteRequestNotification(input: QuoteNotificationInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.NOTIFICATION_FROM_EMAIL;
  const toEmail = process.env.NOTIFICATION_TO_EMAIL || process.env.ADMIN_EMAIL;

  if (!apiKey || !fromEmail || !toEmail) {
    return { sent: false, skipped: true };
  }

  const subject = `New quote request from ${input.name || input.email}`;
  const html = `
    <h1>New quote request</h1>
    <p><strong>Name:</strong> ${input.name || "Not provided"}</p>
    <p><strong>Email:</strong> ${input.email}</p>
    <p><strong>Project type:</strong> ${input.projectType || "Not provided"}</p>
    <p><strong>Budget:</strong> ${input.budgetRange || "Not provided"}</p>
    <p><strong>Timeline:</strong> ${input.timeline || "Not provided"}</p>
    <p><strong>Description:</strong></p>
    <p>${input.description.replace(/\n/g, "<br />")}</p>
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
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Notification email failed: ${text}`);
  }

  return { sent: true, skipped: false };
}
