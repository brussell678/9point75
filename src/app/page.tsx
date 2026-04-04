import Image from "next/image";
import Link from "next/link";
import { AdminPreview } from "@/components/admin-preview";
import { SectionHeading } from "@/components/section-heading";
import { getHeroContentFromCms } from "@/lib/cms";
import { buildPageMetadata, serviceAreaLabel, servicePageLinks } from "@/lib/seo";
import {
  materials,
  processSteps,
  trustPoints,
  valueProps,
} from "@/content/site-content";

export const metadata = buildPageMetadata({
  title: "Custom Woodworking Jacksonville NC",
  description:
    "Custom cabinetry, built-ins, furniture, shadowboxes, and specialty woodworking in Jacksonville, North Carolina. Request a quote from 9point75 Woodworks.",
  path: "/",
  keywords: ["custom woodworking Jacksonville NC", "custom furniture North Carolina", "built-ins North Carolina"],
});

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

          <div className="hero__side">
            <div className="feature-image-card feature-image-card--hero">
              <Image
                src="/home/975-image-1.jpg"
                alt="Featured custom woodworking project by 9point75 Woodworks"
                width={1400}
                height={1200}
                className="feature-image"
                priority
              />
            </div>

            <aside className="hero__aside">
              <p className="hero__aside-label">Service region</p>
              <p>Jacksonville, North Carolina and surrounding coastal communities.</p>
              <p className="hero__aside-label">Project focus</p>
              <p>Built-ins, custom furniture, shadowboxes, plaques, and premium one-off pieces.</p>
            </aside>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell process-section">
          <div>
            <SectionHeading
              eyebrow="Why clients hire 9point75"
              title="A custom process that stays personal without feeling informal."
              description="From Jacksonville, North Carolina to surrounding communities across Northeastern North Carolina, each project is built around practical use, honest communication, and a handcrafted result that lasts."
            />
          </div>
          <div className="feature-image-card feature-image-card--value">
            <Image
              src="/home/975-image-4.jpg"
              alt="Finished custom woodworking detail from 9point75 Woodworks"
              width={1400}
              height={1000}
              className="feature-image"
            />
          </div>
        </div>
        <div className="shell">
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
        <div className="shell split-layout">
          <article className="trust-card">
            <p className="section-heading__eyebrow">Service area</p>
            <h2>Custom woodworking for Jacksonville, North Carolina and surrounding areas.</h2>
            <p>{serviceAreaLabel}</p>
            <p className="contact-note">
              Clients reach out for custom furniture in North Carolina, custom cabinets in NC, and built-ins in North Carolina that feel tailored to the room instead of forced into it.
            </p>
          </article>
          <article className="trust-card">
            <p className="section-heading__eyebrow">Explore services</p>
            <div className="footer-links">
              {servicePageLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label} in North Carolina
                </Link>
              ))}
              <Link href="/gallery">View recent project photos</Link>
              <Link href="/contact">Request a quote</Link>
            </div>
          </article>
        </div>
      </section>

      <section className="section section--contrast">
        <div className="shell process-section">
          <div>
            <SectionHeading
              eyebrow="How it works"
              title="A straightforward path from first conversation to final delivery."
            />
          </div>
          <div className="feature-image-card feature-image-card--process">
            <Image
              src="/home/975-image-3.jpg"
              alt="Woodworking process detail from 9point75 Woodworks"
              width={1400}
              height={1000}
              className="feature-image"
            />
          </div>
        </div>
        <div className="shell">
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

          <div className="materials-side">
            <div className="feature-image-card feature-image-card--materials">
            <Image
              src="/home/975-image-2.jpg"
              alt="Custom woodworking materials and craftsmanship detail in North Carolina"
              width={1400}
              height={1000}
              className="feature-image"
              />
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
        </div>
      </section>

      <AdminPreview />

      <section className="section section--compact">
        <div className="shell cta-banner">
          <div>
            <p className="section-heading__eyebrow">Ready to talk through a project?</p>
            <h2>Bring the measurements, rough ideas, or inspiration images. We can shape the rest together.</h2>
            <p className="contact-note">
              Whether you need custom furniture, custom cabinets, or built-ins in North Carolina, the quote process is designed to be clear and low-pressure.
            </p>
          </div>
          <Link href="/contact" className="button button--primary">
            Start a Quote Request
          </Link>
        </div>
      </section>
    </>
  );
}
