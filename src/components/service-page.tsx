import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
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
      <PageHero eyebrow={eyebrow} title={title} description={description}>
        <p className="page-hero__area">{serviceAreaLabel}</p>
      </PageHero>

      <section className="section">
        <div className="shell split-layout">
          <div className="feature-image-card feature-image-card--gallery">
            <Image src={imageSrc} alt={imageAlt} width={1400} height={1000} className="feature-image" />
          </div>
          <article className="story-card">
            <h2>How the process works</h2>
            <ul className="check-list">
              {processSummary.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
            <p className="section-heading__eyebrow section-heading__eyebrow--spaced">
              Materials and finishes
            </p>
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

      <section className="section section--contrast">
        <div className="shell cards-grid">
          {benefits.map((benefit) => (
            <article key={benefit.title} className="info-card">
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="shell cta-banner">
          <div>
            <p className="section-heading__eyebrow">Start the conversation</p>
            <h2>Ready when you are.</h2>
            <p className="contact-note">{ctaCopy}</p>
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
          <Link href="/about" className="info-card info-card--linked">
            <p className="section-heading__eyebrow">The shop</p>
            <h3>Meet the maker</h3>
            <span className="info-card__arrow" aria-hidden="true">
              About →
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
