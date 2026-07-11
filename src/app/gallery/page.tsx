import type { Metadata } from "next";
import Link from "next/link";
import { GalleryBrowser } from "@/components/gallery-browser";
import { PageHero } from "@/components/page-hero";
import { getGalleryItemsFromCms } from "@/lib/cms";
import { buildPageMetadata, servicePageLinks } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Gallery",
  description:
    "Browse custom furniture, built-ins, cabinetry, shadowboxes, and plaques handcrafted in Jacksonville, North Carolina by 9point75 Woodworks.",
  path: "/gallery",
  keywords: ["custom furniture gallery North Carolina", "built-ins gallery NC"],
});

export default async function GalleryPage() {
  const galleryItems = await getGalleryItemsFromCms();

  return (
    <>
      <PageHero
        eyebrow="The portfolio"
        title="The work speaks. Here's the proof."
        description="Built-ins, furniture, shadowboxes, and one-off pieces — each one shaped by a real conversation with a real client. Filter by category and tap any project for a closer look."
      />

      <section className="section">
        <div className="shell">
          <GalleryBrowser items={galleryItems} />
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
          <Link href="/contact" className="info-card info-card--linked">
            <p className="section-heading__eyebrow">Start a project</p>
            <h3>Saw a level of finish you like?</h3>
            <span className="info-card__arrow" aria-hidden="true">
              Request a quote →
            </span>
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="shell cta-banner">
          <div>
            <p className="section-heading__eyebrow">Your project could be next</p>
            <h2>Every piece here started with a rough idea and a conversation.</h2>
          </div>
          <Link href="/contact" className="button button--primary">
            Request a Quote
          </Link>
        </div>
      </section>
    </>
  );
}
