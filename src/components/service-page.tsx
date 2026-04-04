import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { serviceAreaLabel, servicePageLinks } from "@/lib/seo";

type ServicePageProps = {
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  benefits: string[];
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

      <section className="section">
        <div className="shell cards-grid">
          {benefits.map((benefit) => (
            <article key={benefit} className="info-card">
              <h3>Why custom</h3>
              <p>{benefit}</p>
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
        <div className="shell split-layout">
          <article className="trust-card">
            <p className="section-heading__eyebrow">Explore related work</p>
            <div className="footer-links">
              <Link href="/gallery">Browse the gallery</Link>
              {relatedLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label} in North Carolina
                </Link>
              ))}
            </div>
          </article>
          <article className="trust-card">
            <p className="section-heading__eyebrow">Request a quote</p>
            <p>{ctaCopy}</p>
            <div className="button-row">
              <Link href="/contact" className="button button--primary">
                Request a Quote
              </Link>
              <Link href="/gallery" className="button button--secondary">
                View Gallery
              </Link>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
