import Link from "next/link";
import { AdminPreview } from "@/components/admin-preview";
import { SectionHeading } from "@/components/section-heading";
import { getHeroContentFromCms } from "@/lib/cms";
import {
  materials,
  processSteps,
  trustPoints,
  valueProps,
} from "@/content/site-content";

export default async function Home() {
  const heroContent = await getHeroContentFromCms();

  return (
    <>
      <section className="hero">
        <div className="shell hero__grid">
          <div className="hero__content">
            <p className="hero__eyebrow">{heroContent.eyebrow}</p>
            <h1>{heroContent.title}</h1>
            <p className="hero__description">{heroContent.description}</p>
            <div className="button-row">
              <Link href={heroContent.primaryCta.href} className="button button--primary">
                {heroContent.primaryCta.label}
              </Link>
              <Link href={heroContent.secondaryCta.href} className="button button--secondary">
                {heroContent.secondaryCta.label}
              </Link>
            </div>
          </div>

          <aside className="hero__aside">
            <p className="hero__aside-label">Service region</p>
            <p>Jacksonville, North Carolina and surrounding coastal communities.</p>
            <p className="hero__aside-label">Project focus</p>
            <p>Built-ins, custom furniture, shadowboxes, plaques, and premium one-off pieces.</p>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow="Why clients hire 9point75"
            title="A custom process that stays personal without feeling informal."
          />
          <div className="cards-grid">
            {valueProps.map((item) => (
              <article key={item.title} className="info-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--contrast">
        <div className="shell">
          <SectionHeading
            eyebrow="How it works"
            title="A straightforward path from first conversation to final delivery."
          />
          <div className="process-grid">
            {processSteps.map((step, index) => (
              <article key={step} className="process-card">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell split-layout">
          <div>
            <SectionHeading
              eyebrow="Materials"
              title="Hardwoods and specialty species selected for durability, warmth, and long-term character."
            />
            <div className="tag-row">
              {materials.map((material) => (
                <span key={material} className="tag">
                  {material}
                </span>
              ))}
            </div>
          </div>

          <div className="trust-card">
            <p className="section-heading__eyebrow">Trust signals</p>
            <ul className="check-list">
              {trustPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <AdminPreview />

      <section className="section section--compact">
        <div className="shell cta-banner">
          <div>
            <p className="section-heading__eyebrow">Ready to talk through a project?</p>
            <h2>Bring the measurements, rough ideas, or inspiration images. We can shape the rest together.</h2>
          </div>
          <Link href="/contact" className="button button--primary">
            Start a Quote Request
          </Link>
        </div>
      </section>
    </>
  );
}
