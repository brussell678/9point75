import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { serviceAreaLabel, servicePageLinks } from "@/lib/seo";

type ServiceBenefit = {
  title: string;
  description: string;
};

type ServicePageProps = {
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  benefits: ServiceBenefit[];
  processSummary: string[];
  materials: string[];
  ctaCopy: string;
  currentHref: string;
};

export function ServicePage({
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt,
  benefits,
  processSummary,
  materials,
  ctaCopy,
  currentHref,
}: ServicePageProps) {
  const relatedLinks = servicePageLinks.filter((link) => link.href !== currentHref);

  return (
    <>
      <section className="page-hero">
        <div className="shell process-section">
          <div>
            <SectionHeading eyebrow={eyebrow} title={title} description={description} />
            <p className="service-area-copy">{serviceAreaLabel}</p>
          </div>
          <div className="feature-image-card feature-image-card--gallery">
            <Image src={imageSrc} alt={imageAlt} width={1400} height={1000} className="feature-image" />
          </div>
        </div>
      </section>

      <section className="section section--compact">
        <div className="shell cards-grid">
          {benefits.map((benefit) => (
            <article key={benefit.title} className="info-card">
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--contrast">
        <div className="shell split-layout">
          <article className="story-card">
            <h2>How the process works</h2>
            <ul className="check-list">
              {processSummary.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </article>
          <article className="trust-card">
            <p className="section-heading__eyebrow">Materials and finishes</p>
            <div className="tag-row">
              {materials.map((material) => (
                <span key={material} className="tag">
                  {material}
                </span>
              ))}
            </div>
            <p className="contact-note">
              Each project is built to suit the room, the use case, and the level of finish the client wants.
            </p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="shell cta-banner">
          <div>
            <p className="section-heading__eyebrow">Request a quote</p>
            <h2>{ctaCopy}</h2>
          </div>
          <div className="button-row">
            <Link href="/contact" className="button button--primary">
              Request a Quote
            </Link>
            <Link href="/gallery" className="button button--ghost-dark">
              View Gallery
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--compact">
        <div className="shell link-grid">
          <Link href="/gallery" className="info-card info-card--linked">
            <p className="section-heading__eyebrow">Portfolio</p>
            <h3>Browse the gallery</h3>
            <span className="info-card__arrow" aria-hidden="true">
              View →
            </span>
          </Link>
          {relatedLinks.map((link) => (
            <Link key={link.href} href={link.href} className="info-card info-card--linked">
              <p className="section-heading__eyebrow">Related service</p>
              <h3>{link.label} in North Carolina</h3>
              <span className="info-card__arrow" aria-hidden="true">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
