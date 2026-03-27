import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { aboutSections, materials, trustPoints } from "@/content/site-content";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="shell">
          <SectionHeading
            eyebrow="About the shop"
            title="Craftsmanship without compromise, built around practical design and close communication."
            description={aboutSections.intro}
          />
        </div>
      </section>

      <section className="section">
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

      <section className="section section--contrast">
        <div className="shell split-layout">
          <article className="trust-card">
            <p className="section-heading__eyebrow">What clients can expect</p>
            <ul className="check-list">
              {trustPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
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
          </article>
        </div>
      </section>
    </>
  );
}
