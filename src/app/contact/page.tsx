import type { Metadata } from "next";
import { QuoteForm } from "@/components/quote-form";
import { SectionHeading } from "@/components/section-heading";
import { contactDetails } from "@/content/site-content";
import { getMissingEnvVars } from "@/lib/env";

export const metadata: Metadata = {
  title: "Contact",
};

type ContactPageProps = {
  searchParams?: Promise<{ submitted?: string }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const missingEnvVars = getMissingEnvVars();
  const submitted = params?.submitted === "1";

  return (
    <>
      <section className="page-hero">
        <div className="shell">
          <SectionHeading
            eyebrow="Request a quote"
            title="Tell us about the project, the space, and how you want it to feel."
            description="Email and project description are required. Budget is optional, and inspiration images can be uploaded when the production backend is connected."
          />
        </div>
      </section>

      <section className="section">
        <div className="shell split-layout split-layout--wide">
          <div className="contact-form-stack">
            {submitted ? (
              <div className="form-success-panel">
                <h2>Quote request received</h2>
                <p>
                  The project details were saved successfully. The owner can now review the request in the admin dashboard.
                </p>
              </div>
            ) : null}

            {missingEnvVars.length > 0 ? (
              <div className="form-warning-panel">
                <h2>Setup still needed</h2>
                <p>Add these environment variables before using the production form:</p>
                <ul className="check-list">
                  {missingEnvVars.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <QuoteForm />
          </div>

          <aside className="trust-card">
            <p className="section-heading__eyebrow">Direct contact</p>
            <div className="footer-links">
              <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a>
              <span>{contactDetails.location}</span>
              <span>{contactDetails.availability}</span>
            </div>
            <p className="contact-note">
              The quote process is designed to start with enough information to guide the first conversation,
              not force every decision upfront.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
