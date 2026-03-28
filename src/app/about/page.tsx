import Image from "next/image";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { materials, trustPoints } from "@/content/site-content";
import { getAboutContentFromCms } from "@/lib/cms";

export const metadata: Metadata = {
  title: "About",
};

export default async function AboutPage() {
  const aboutSections = await getAboutContentFromCms();

  return (
    <>
      <section className="page-hero">
        <div className="shell process-section">
          <div>
            <SectionHeading
              eyebrow="About the shop"
              title="Craftsmanship without compromise, built around practical design and close communication."
              description={aboutSections.intro}
            />
          </div>
          <div className="feature-image-card feature-image-card--about">
            <Image
              src="/home/975-image-6.jpg"
              alt="About the shop image for 9point75 Woodworks"
              width={1400}
              height={1000}
              className="feature-image"
            />
          </div>
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
