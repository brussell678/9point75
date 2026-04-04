import type { Metadata } from "next";
import { ServicePage } from "@/components/service-page";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Custom Cabinets North Carolina",
  description:
    "Custom cabinets in North Carolina for kitchens, storage walls, mudrooms, and specialty spaces. Learn the process and request a quote from 9point75 Woodworks.",
  path: "/custom-cabinets-north-carolina",
  keywords: ["custom cabinets NC", "custom cabinetry North Carolina"],
});

export default function CustomCabinetsNorthCarolinaPage() {
  return (
    <ServicePage
      eyebrow="Custom cabinets in NC"
      title="Custom cabinets in North Carolina made to fit the room, the storage needs, and the finish you want."
      description="9point75 Woodworks builds custom cabinets in North Carolina for clients who want clean installation, practical storage, and a more intentional result than stock cabinetry can deliver. Projects range from cabinetry walls and office storage to specialty cabinets that need precise sizing, thoughtful layout, and a finish that suits the home."
      imageSrc="/home/975-image-3.jpg"
      imageAlt="Custom cabinets handcrafted in North Carolina by 9point75 Woodworks"
      benefits={[
        "Custom cabinets make better use of every inch, especially in rooms with unusual dimensions or specific storage goals.",
        "The design process prioritizes layout, durability, and finish so the cabinets feel integrated instead of added on.",
        "Clients work directly with the builder, which helps decisions stay clear and tailored from first consultation through installation.",
      ]}
      processSummary={[
        "Review the space, storage priorities, and visual direction.",
        "Define cabinet layout, function, and finish details.",
        "Build custom cabinets with a focus on durability and clean fitment.",
        "Deliver cabinetry that supports the way the room works every day.",
      ]}
      materials={["Paint-grade hardwoods", "White Oak", "Maple", "Walnut"]}
      ctaCopy="If you need custom cabinets in NC, request a quote with measurements, photos, or a rough sketch and we can map out the best direction."
      currentHref="/custom-cabinets-north-carolina"
    />
  );
}
