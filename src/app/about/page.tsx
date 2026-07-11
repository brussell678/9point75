import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { heroBadges, makerPoints, materials, trustPoints } from "@/content/site-content";
import { getAboutContentFromCms } from "@/lib/cms";
import { buildPageMetadata, serviceAreaLabel } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "About",
  description:
    "Learn about 9point75 Woodworks, a veteran-owned woodworking shop serving Jacksonville, North Carolina with custom cabinetry, furniture, and built-ins.",
  path: "/about",
  keywords: ["veteran owned woodworking North Carolina", "Jacksonville NC woodworker"],
});

export default async function AboutPage() {
  const aboutSections = await getAboutContentFromCms();

  return (
    <>
      <PageHero
        eyebrow="About the shop"
        title="Craftsmanship without compromise, built on Marine Corps attention to detail."
        description={aboutSections.intro}
      >
        <div className="page-hero__meta">
          {heroBadges.map((badge) => (
            <span key={badge} className="hero__badge">
              {badge}
            </span>
          ))}
        </div>
      </PageHero>

      <section className="section">
        <div className="shell process-section">
          <div>
            <SectionHeading
              eyebrow="The maker"
              title="One craftsman. One standard."
              description="No production line, no subcontractors — the person you talk to on day one is the same person sanding the final coat."
            />
          </div>
          <div className="feature-image-card feature-image-card--about">
            <Image
              src="/home/975-image-6.jpg"
              alt="Inside the 9point75 Woodworks shop"
              width={1400}
              height={1000}
              className="feature-image"
            />
          </div>
        </div>
        <div className="shell cards-grid">
          {makerPoints.map((point) => (
            <article key={point.title} className="info-card">
              <h3>{point.title}</h3>
              <p>{point.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--contrast">
        <div className="shell split-layout">
          <article className="story-card">
            <h2>The story</h2>
            <p>{aboutSections.story}</p>
          </article>
          <article className="story-card">
            <h2>The philosophy</h2>
            <p>{aboutSections.philosophy}</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="shell split-layout">
          <article className="trust-card">
            <p className="section-heading__eyebrow">What clients can expect</p>
            <ul className="check-list">
              {trustPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <p className="contact-note">{serviceAreaLabel}</p>
          </article>

          <article className="trust-card">
            <p className="section-heading__eyebrow">Preferred materials</p>
            <div className="tag-row">
              {materials.map((material) => (
                <span key={material} className="tag">
                  {material}
                </span>
              ))}
            </div>
            <p className="contact-note">
              Have a species in mind that isn&apos;t listed? Ask — sourcing something special is part of the job.
            </p>
          </article>
        </div>
      </section>

      <section className="section section--compact">
        <div className="shell cta-banner">
          <div>
            <p className="section-heading__eyebrow">Work with the shop</p>
            <h2>If it deserves to be built right, it deserves a conversation.</h2>
          </div>
          <Link href="/contact" className="button button--primary">
            Request a Quote
          </Link>
        </div>
      </section>
    </>
  );
}
