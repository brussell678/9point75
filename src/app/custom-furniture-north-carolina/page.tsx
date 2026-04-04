import type { Metadata } from "next";
import { ServicePage } from "@/components/service-page";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Custom Furniture North Carolina",
  description:
    "Custom furniture in North Carolina handcrafted for lasting function, warmth, and character. Explore the process and request a quote from 9point75 Woodworks.",
  path: "/custom-furniture-north-carolina",
  keywords: ["custom furniture North Carolina", "handcrafted furniture Jacksonville NC"],
});

export default function CustomFurnitureNorthCarolinaPage() {
  return (
    <ServicePage
      eyebrow="Custom furniture in North Carolina"
      title="Custom furniture in North Carolina built for daily life and long-term use."
      description="9point75 Woodworks designs and builds custom furniture in North Carolina for clients who want something better than mass-produced pieces. From dining tables and beds to credenzas, media consoles, and one-off statement pieces, each build is tailored to the room, the way it will be used, and the materials that will age well over time."
      imageSrc="/home/975-image-2.jpg"
      imageAlt="Custom furniture handcrafted in North Carolina by 9point75 Woodworks"
      benefits={[
        "Custom furniture gives you control over dimensions, storage, wood species, and finish so the final piece actually fits your home and routines.",
        "Instead of settling for disposable furniture, clients get durable joinery, hardwood construction, and a piece designed around how they live.",
        "Each project is built with a handcrafted process that keeps communication direct and the final result intentional from every angle.",
      ]}
      processSummary={[
        "Start with a conversation about the room, dimensions, and function.",
        "Refine the design, wood choice, and finish until the direction feels right.",
        "Build the piece with durability, proportion, and everyday use in mind.",
        "Deliver a finished custom furniture piece made to live well in North Carolina homes.",
      ]}
      materials={["Walnut", "White Oak", "Maple", "Mahogany"]}
      ctaCopy="If you are looking for custom furniture in North Carolina, send the measurements, inspiration, or rough idea and we can shape the rest together."
      currentHref="/custom-furniture-north-carolina"
    />
  );
}
