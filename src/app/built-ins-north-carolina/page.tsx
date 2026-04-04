import type { Metadata } from "next";
import { ServicePage } from "@/components/service-page";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Built-Ins North Carolina",
  description:
    "Built-ins in North Carolina for offices, mudrooms, living spaces, and storage walls. See how 9point75 Woodworks approaches custom built-ins and request a quote.",
  path: "/built-ins-north-carolina",
  keywords: ["built-ins North Carolina", "custom built-ins Jacksonville NC"],
});

export default function BuiltInsNorthCarolinaPage() {
  return (
    <ServicePage
      eyebrow="Built-ins in North Carolina"
      title="Built-ins in North Carolina designed to make the room work better without giving up warmth or character."
      description="9point75 Woodworks creates built-ins in North Carolina for homeowners who want better storage, stronger visual cohesion, and a custom fit that feels like part of the home. Whether the goal is an office wall, mudroom drop zone, library shelving, or a living space focal point, the work is shaped around function first and refined through handcrafted detail."
      imageSrc="/home/975-image-4.jpg"
      imageAlt="Custom built-ins handcrafted in North Carolina by 9point75 Woodworks"
      benefits={[
        "Built-ins add storage and structure while making the room feel more intentional and complete.",
        "Custom sizing means the final result works around real walls, trim, traffic flow, and daily routines.",
        "Each project is built to match the home and hold up well over time, not just look good in photos.",
      ]}
      processSummary={[
        "Talk through the room, the constraints, and what needs to be stored or displayed.",
        "Refine the built-in layout and overall visual direction.",
        "Build and install with attention to fit, finish, and long-term durability.",
        "Deliver built-ins that feel clean, useful, and native to the space.",
      ]}
      materials={["White Oak", "Maple", "Paint-grade hardwoods", "Walnut accents"]}
      ctaCopy="If you are planning built-ins in North Carolina, request a quote and share the space, dimensions, and goals for the room."
      currentHref="/built-ins-north-carolina"
    />
  );
}
