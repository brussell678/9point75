import Image from "next/image";
import type { Metadata } from "next";
import { GalleryBrowser } from "@/components/gallery-browser";
import { SectionHeading } from "@/components/section-heading";
import { getGalleryItemsFromCms } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Gallery",
};

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
    </>
  );
}
