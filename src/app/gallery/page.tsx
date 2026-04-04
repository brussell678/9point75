import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { GalleryBrowser } from "@/components/gallery-browser";
import { SectionHeading } from "@/components/section-heading";
import { getGalleryItemsFromCms } from "@/lib/cms";
import { buildPageMetadata } from "@/lib/seo";

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
      <section className="page-hero">
        <div className="shell process-section">
          <div>
            <SectionHeading
              eyebrow="Gallery"
              title="A closer look at custom work shaped by detail, durability, and the way each piece is meant to live in a space."
              description="Browse recent categories, open images for a fuller view, and check back as new projects are added over time."
            />
          </div>
          <div className="feature-image-card feature-image-card--gallery">
            <Image
              src="/home/975-image-5.jpg"
              alt="Gallery preview image from 9point75 Woodworks"
              width={1400}
              height={1000}
              className="feature-image"
            />
          </div>
        </div>
      </section>

      <section className="section section--compact">
        <div className="shell">
          <GalleryBrowser items={galleryItems} />
        </div>
      </section>

      <section className="section section--compact">
        <div className="shell split-layout">
          <article className="trust-card">
            <p className="section-heading__eyebrow">Looking for something similar?</p>
            <div className="footer-links">
              <Link href="/custom-furniture-north-carolina">Custom furniture in North Carolina</Link>
              <Link href="/custom-cabinets-north-carolina">Custom cabinets in North Carolina</Link>
              <Link href="/built-ins-north-carolina">Built-ins in North Carolina</Link>
            </div>
          </article>
          <article className="trust-card">
            <p className="section-heading__eyebrow">Start a project</p>
            <p>When you see a style or level of finish you like, the next step is a straightforward quote request.</p>
            <Link href="/contact" className="button button--primary">
              Request a Quote
            </Link>
          </article>
        </div>
      </section>
    </>
  );
}
