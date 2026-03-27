import type { Metadata } from "next";
import { QuoteForm } from "@/components/quote-form";
import { SectionHeading } from "@/components/section-heading";
import { contactDetails } from "@/content/site-content";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
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
          <QuoteForm />

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
