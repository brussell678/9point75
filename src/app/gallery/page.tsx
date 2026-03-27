import type { Metadata } from "next";
import { GalleryBrowser } from "@/components/gallery-browser";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Gallery",
};

export default function GalleryPage() {
  return (
    <>
      <section className="page-hero">
        <div className="shell">
          <SectionHeading
            eyebrow="Selected work"
            title="A mobile-friendly gallery built for quick browsing, filtering, and full-screen detail."
            description="Launch content uses placeholders so the structure is ready as project photography comes in."
          />
        </div>
      </section>

      <section className="section section--compact">
        <div className="shell">
          <GalleryBrowser />
        </div>
      </section>
    </>
  );
}
