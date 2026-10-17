import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { contactDetails } from "@/content/site-content";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy",
  description: "What the 9point75 Woodworks website collects, why, and how to opt out of analytics.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="Privacy notice"
        description="Last updated October 17, 2026. This site collects two kinds of information: what you send through the quote form, and anonymous usage data from Google Analytics."
      />

      <section className="section">
        <div className="shell legal-copy">
          <h2>Who we are</h2>
          <p>
            9point75 Woodworks, Jacksonville, North Carolina. Questions about this notice go to{" "}
            <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a>.
          </p>

          <h2>The quote request form</h2>
          <p>
            When you request a quote, the form collects what you enter: your name, email address, phone
            number, location, project details, budget range, timeline, measurements, and any photos or files
            you attach. It is saved in the shop&apos;s private database and file storage, and a notification
            with the details is sent to the shop by email. We use it only to respond to you and to quote and
            build your project, and we keep it for as long as we need it for that and for our records.
          </p>

          <h2>Analytics</h2>
          <p>
            We use Google Analytics to understand how people use this site: which pages are viewed, how
            visitors arrived (for example, from a search engine or a link), approximate location at the city
            or country level, and device and browser type. Google Analytics uses cookies to do this. We look at
            the data in aggregate to improve the site, and we do not use it to identify you. The owner sign-in
            pages are not measured.
          </p>
          <p>
            Google processes this data under its own terms. You can read{" "}
            <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noreferrer">
              how Google uses information from sites that use its services
            </a>
            .
          </p>

          <h2>What we do not do</h2>
          <p>We do not sell your information, and we do not use this site&apos;s data for advertising.</p>

          <h2>Your choices</h2>
          <p>
            You can block or delete cookies in your browser settings, or install the{" "}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer">
              Google Analytics opt-out browser add-on
            </a>
            . To ask what we have from a request you sent, or to have it deleted, email{" "}
            <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a>.
          </p>

          <h2>Changes</h2>
          <p>If this notice changes, the date at the top changes with it.</p>
        </div>
      </section>
    </>
  );
}
