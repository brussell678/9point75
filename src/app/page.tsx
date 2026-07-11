/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { getGalleryItemsFromCms, getHeroContentFromCms } from "@/lib/cms";
import { buildPageMetadata, serviceAreaLabel, servicePageLinks } from "@/lib/seo";
import {
  heroBadges,
  materials,
  nameStory,
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
  const [heroContent, galleryItems] = await Promise.all([
    getHeroContentFromCms(),
    getGalleryItemsFromCms(),
  ]);

  const featuredItems = galleryItems
    .filter((item) => item.image && item.image !== "/placeholders/gallery.svg")
    .slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="hero__backdrop">
          <Image
            src="/home/975-image-1.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="shell hero__inner">
          <div className="hero__content">
            <p className="hero__eyebrow">{heroContent.eyebrow}</p>
            <h1>{heroContent.title}</h1>
            <p className="hero__description">{heroContent.description}</p>
            <div className="button-row">
              <Link href={heroContent.primaryCta.href} className="button button--primary">
                {heroContent.primaryCta.label}
              </Link>
              <Link href={heroContent.secondaryCta.href} className="button button--ghost-dark">
                {heroContent.secondaryCta.label}
              </Link>
            </div>
          </div>

          <div className="hero__badges">
            {heroBadges.map((badge) => (
              <span key={badge} className="hero__badge">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell story-band">
          <Image
            src="/brand/9point75_logo.jpg"
            alt="9point75 Woodworks saw blade logo"
            width={500}
            height={500}
            className="story-band__logo"
          />
          <div>
            <p className="section-heading__eyebrow">{nameStory.eyebrow}</p>
            <p className="story-band__figure">{nameStory.figure}</p>
            <p className="story-band__note">{nameStory.note}</p>
          </div>
        </div>
      </section>

      {featuredItems.length > 0 ? (
        <section className="section section--contrast">
          <div className="shell">
            <SectionHeading
              eyebrow="Recent work"
              title="Fresh from the shop."
              description="A few of the latest pieces to leave the bench. Every one of them started as a conversation."
            />
            <div className="featured-strip">
              {featuredItems.map((item) => (
                <Link key={item.id} href="/gallery" className="gallery-card">
                  <div className="gallery-card__image-wrap">
                    <img src={item.image} alt={item.alt} className="gallery-image" loading="lazy" />
                  </div>
                  <div className="gallery-card__body">
                    <p className="gallery-card__category">{item.category}</p>
                    <h3>{item.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
            <div className="featured-strip__footer">
              <Link href="/gallery" className="button button--secondary">
                Browse the Full Gallery
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="shell process-section">
          <div>
            <SectionHeading
              eyebrow="Why clients hire 9point75"
              title="A custom process that stays personal without feeling informal."
              description="From Jacksonville to the surrounding coastal communities, each project is built around practical use, honest communication, and a handcrafted result that lasts."
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

      <section className="section section--dark">
        <div className="shell">
          <SectionHeading
            eyebrow="How it works"
            title="A straightforward path from first conversation to final delivery."
          />
          <div className="process-grid">
            {processSteps.map((step, index) => (
              <article key={step.title} className="process-card">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
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
              title="Hardwoods selected for durability, warmth, and long-term character."
            />
            <div className="tag-row">
              {materials.map((material) => (
                <span key={material} className="tag">
                  {material}
                </span>
              ))}
            </div>
            <p className="contact-note">
              Clients reach out for custom furniture, custom cabinets, and built-ins that feel
              tailored to the room instead of forced into it. {serviceAreaLabel}
            </p>
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
              <p className="section-heading__eyebrow">The standard</p>
              <ul className="check-list">
                {trustPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--compact">
        <div className="shell link-grid">
          {servicePageLinks.map((link) => (
            <Link key={link.href} href={link.href} className="info-card info-card--linked">
              <p className="section-heading__eyebrow">Service</p>
              <h3>{link.label} in North Carolina</h3>
              <span className="info-card__arrow" aria-hidden="true">
                Explore →
              </span>
            </Link>
          ))}
          <Link href="/gallery" className="info-card info-card--linked">
            <p className="section-heading__eyebrow">Portfolio</p>
            <h3>Recent project photos</h3>
            <span className="info-card__arrow" aria-hidden="true">
              View gallery →
            </span>
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="shell cta-banner">
          <div>
            <p className="section-heading__eyebrow">Ready to talk through a project?</p>
            <h2>Bring the measurements, rough ideas, or inspiration images. We can shape the rest together.</h2>
            <p className="contact-note">
              The quote process is designed to be clear and low-pressure — whether it&apos;s an heirloom
              dining table or a retirement shadowbox.
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
