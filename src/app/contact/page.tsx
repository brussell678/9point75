import type { Metadata } from "next";
import { LeadEvent } from "@/components/lead-event";
import { PageHero } from "@/components/page-hero";
import { QuoteForm } from "@/components/quote-form";
import { contactDetails } from "@/content/site-content";
import { getMissingEnvVars } from "@/lib/env";
import { buildPageMetadata, serviceAreaLabel } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Request a quote for custom furniture, custom cabinets, and built-ins in Jacksonville, North Carolina and surrounding areas.",
  path: "/contact",
  keywords: ["request woodworking quote North Carolina", "custom cabinets Jacksonville NC"],
});

type ContactPageProps = {
  searchParams?: Promise<{ submitted?: string }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const missingEnvVars = getMissingEnvVars();
  const submitted = params?.submitted === "1";

  return (
    <>
      <PageHero
        eyebrow="Request a quote"
        title="Tell us about the project, the space, and how you want it to feel."
        description="Only an email and a project description are required. Rough ideas, napkin sketches, and inspiration photos are all welcome — that's how most projects start."
      />

      <section className="section">
        <div className="shell split-layout split-layout--wide">
          <div className="contact-form-stack">
            {submitted ? (
              <div className="form-success-panel">
                <LeadEvent />
                <h2>Quote request received</h2>
                <p>
                  Thanks — the project details made it to the shop. You&apos;ll hear back directly at the
                  email you provided.
                </p>
              </div>
            ) : null}

            {missingEnvVars.length > 0 ? (
              <div className="form-warning-panel">
                <h2>Form temporarily offline</h2>
                <p>
                  The quote form isn&apos;t connected right now. Please email{" "}
                  <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a> directly and
                  we&apos;ll get back to you.
                </p>
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
            <p className="contact-note">{serviceAreaLabel}</p>

            <p className="section-heading__eyebrow section-heading__eyebrow--spaced">
              What happens next
            </p>
            <ol className="next-steps">
              <li>Your request lands directly with the maker — not a call center.</li>
              <li>You get a reply to talk through the piece, the space, and the budget.</li>
              <li>Design, wood, and finish get refined until the direction is right.</li>
            </ol>

            <p className="section-heading__eyebrow section-heading__eyebrow--spaced">
              Good to know
            </p>
            <p className="contact-note">
              Every build is quoted individually — size, species, and finish all matter, so there&apos;s
              no one-size price list. Sharing a budget range up front just helps the first
              conversation start in the right place.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
