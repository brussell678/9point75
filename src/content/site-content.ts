export const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const socialLinks = [
  {
    href: "https://www.instagram.com/9point75woodworks?igsh=MW5jMzc5Z2ZqOHh6eQ==",
    label: "Instagram",
  },
  {
    href: "https://www.facebook.com/share/1LHSyG7Dvf/",
    label: "Facebook",
  },
];

export const contactDetails = {
  email: "9point75Woodworks@gmail.com",
  location: "Jacksonville, North Carolina",
  availability: "By appointment only",
};

export const heroContent = {
  eyebrow: "Custom cabinetry · Built-ins · Heirloom furniture",
  title: "Woodwork built the way it should be: measured twice, made once, made to last.",
  description:
    "9point75 Woodworks is a veteran-owned shop in Jacksonville, North Carolina building fully custom pieces — from statement furniture and built-ins to military shadowboxes that honor a career of service.",
  primaryCta: {
    href: "/contact",
    label: "Request a Quote",
  },
  secondaryCta: {
    href: "/gallery",
    label: "See the Work",
  },
};

export const heroBadges = [
  "Marine Corps veteran owned",
  "Est. 11.11.22 — Veterans Day",
  "Jacksonville, North Carolina",
];

export const nameStory = {
  eyebrow: "Why “9point75”?",
  figure:
    "One late night at the table saw cost the maker a quarter inch of finger — and gave the shop its name.",
  note:
    "The blade in the logo isn't decoration. It's a reminder that this craft demands respect, patience, and total attention to detail. That same discipline — carried over from a career in the Marine Corps — goes into every cut, every joint, and every finish that leaves the shop.",
};

export const valueProps = [
  {
    title: "Designed around your space",
    description:
      "Every project starts with how you live, how the room works, and what the piece needs to do every single day.",
  },
  {
    title: "One craftsman, start to finish",
    description:
      "You work directly with the maker from the first conversation through delivery — no middlemen, no surprises.",
  },
  {
    title: "Built for the long haul",
    description:
      "Premium hardwoods, honest joinery, and a measured process create pieces made to stay in the family.",
  },
];

export const processSteps = [
  {
    title: "Inquiry",
    detail: "Send the idea, the measurements, or the inspiration photo. Rough is fine.",
  },
  {
    title: "Consultation",
    detail: "A direct conversation about the space, the use, and the budget.",
  },
  {
    title: "Design",
    detail: "Wood species, dimensions, and finish refined until the direction is right.",
  },
  {
    title: "Build",
    detail: "Unhurried, precise work in the shop — with updates along the way.",
  },
  {
    title: "Delivery",
    detail: "A final walkthrough to make sure the piece lives well in its new home.",
  },
];

export const materials = [
  "Walnut",
  "White Oak",
  "Maple",
  "Purpleheart",
  "Padauk",
  "Mahogany",
];

export const trustPoints = [
  "Handcrafted in Jacksonville, North Carolina",
  "Marine Corps veteran owned and operated",
  "Fully custom process from first sketch to final finish",
];

export const galleryCategories = [
  "All",
  "Cabinetry / Built-ins",
  "Furniture",
  "Military Shadowboxes / Gifts",
  "Plaques",
  "Other",
] as const;

export type GalleryCategory = (typeof galleryCategories)[number];

export type GalleryItem = {
  id: string;
  title: string;
  category: Exclude<GalleryCategory, "All">;
  description: string;
  image: string;
  alt: string;
  images: Array<{
    src: string;
    alt: string;
  }>;
};

export const galleryItems: GalleryItem[] = [
  {
    id: "built-in-hearth-storage",
    title: "Built-in Hearth Storage",
    category: "Cabinetry / Built-ins",
    description: "Clean-lined storage tailored to the room with a durable painted finish and warm wood top.",
    image: "/placeholders/gallery.svg",
    alt: "Placeholder image for built-in hearth storage project",
    images: [{ src: "/placeholders/gallery.svg", alt: "Placeholder image for built-in hearth storage project" }],
  },
  {
    id: "white-oak-entry-bench",
    title: "White Oak Entry Bench",
    category: "Furniture",
    description: "A practical entry piece designed for daily use, finished to bring out the grain without feeling precious.",
    image: "/placeholders/gallery.svg",
    alt: "Placeholder image for white oak entry bench project",
    images: [{ src: "/placeholders/gallery.svg", alt: "Placeholder image for white oak entry bench project" }],
  },
  {
    id: "service-tribute-shadowbox",
    title: "Service Tribute Shadowbox",
    category: "Military Shadowboxes / Gifts",
    description: "Framed to protect meaningful items while presenting them with a calm, respectful layout.",
    image: "/placeholders/gallery.svg",
    alt: "Placeholder image for military tribute shadowbox project",
    images: [{ src: "/placeholders/gallery.svg", alt: "Placeholder image for military tribute shadowbox project" }],
  },
  {
    id: "commissioned-family-name-plaque",
    title: "Commissioned Family Name Plaque",
    category: "Plaques",
    description: "Custom lettering and hardwood contrast built for gifting or front-entry display.",
    image: "/placeholders/gallery.svg",
    alt: "Placeholder image for commissioned family plaque project",
    images: [{ src: "/placeholders/gallery.svg", alt: "Placeholder image for commissioned family plaque project" }],
  },
  {
    id: "walnut-media-console",
    title: "Walnut Media Console",
    category: "Furniture",
    description: "Balanced proportions, soft-close storage, and a finish intended to age gracefully with the space.",
    image: "/placeholders/gallery.svg",
    alt: "Placeholder image for walnut media console project",
    images: [{ src: "/placeholders/gallery.svg", alt: "Placeholder image for walnut media console project" }],
  },
  {
    id: "mudroom-drop-zone",
    title: "Mudroom Drop Zone",
    category: "Cabinetry / Built-ins",
    description: "A high-traffic storage wall built to keep daily routines organized without giving up style.",
    image: "/placeholders/gallery.svg",
    alt: "Placeholder image for mudroom drop zone project",
    images: [{ src: "/placeholders/gallery.svg", alt: "Placeholder image for mudroom drop zone project" }],
  },
  {
    id: "retirement-recognition-case",
    title: "Retirement Recognition Case",
    category: "Military Shadowboxes / Gifts",
    description: "Crafted as a presentation piece with thoughtful spacing, trim, and long-term durability.",
    image: "/placeholders/gallery.svg",
    alt: "Placeholder image for retirement recognition case project",
    images: [{ src: "/placeholders/gallery.svg", alt: "Placeholder image for retirement recognition case project" }],
  },
  {
    id: "custom-mantel-display",
    title: "Custom Mantel Display",
    category: "Other",
    description: "A tailored focal point built to add character while fitting the room's exact proportions.",
    image: "/placeholders/gallery.svg",
    alt: "Placeholder image for custom mantel display project",
    images: [{ src: "/placeholders/gallery.svg", alt: "Placeholder image for custom mantel display project" }],
  },
  {
    id: "maple-dining-table",
    title: "Maple Dining Table",
    category: "Furniture",
    description: "Sized for gathering, built for everyday use, and detailed to feel refined without being delicate.",
    image: "/placeholders/gallery.svg",
    alt: "Placeholder image for maple dining table project",
    images: [{ src: "/placeholders/gallery.svg", alt: "Placeholder image for maple dining table project" }],
  },
  {
    id: "garage-workshop-cabinet-set",
    title: "Garage Workshop Cabinet Set",
    category: "Cabinetry / Built-ins",
    description: "Storage-first cabinetry that keeps tools close and the space feeling intentional.",
    image: "/placeholders/gallery.svg",
    alt: "Placeholder image for garage workshop cabinet set project",
    images: [{ src: "/placeholders/gallery.svg", alt: "Placeholder image for garage workshop cabinet set project" }],
  },
  {
    id: "commemorative-unit-plaque",
    title: "Commemorative Unit Plaque",
    category: "Plaques",
    description: "Layered wood species and clean routing make this a strong presentation piece.",
    image: "/placeholders/gallery.svg",
    alt: "Placeholder image for commemorative unit plaque project",
    images: [{ src: "/placeholders/gallery.svg", alt: "Placeholder image for commemorative unit plaque project" }],
  },
  {
    id: "reading-nook-shelving",
    title: "Reading Nook Shelving",
    category: "Cabinetry / Built-ins",
    description: "Custom shelving with integrated bench seating to turn unused square footage into a destination.",
    image: "/placeholders/gallery.svg",
    alt: "Placeholder image for reading nook shelving project",
    images: [{ src: "/placeholders/gallery.svg", alt: "Placeholder image for reading nook shelving project" }],
  },
];

export const budgetRanges = [
  "Under $500",
  "$500 - $2,000",
  "$2,000 - $5,000",
  "$5,000 - $10,000",
  "$10,000+",
];

export const projectTypes = [
  "Cabinetry / Built-ins",
  "Furniture",
  "Military Shadowboxes / Gifts",
  "Plaques",
  "Other",
];

export const timelineOptions = [
  "As soon as possible",
  "Within 1-2 months",
  "Within 3-6 months",
  "Just exploring",
];

export const aboutSections = {
  intro:
    "9point75 Woodworks was built around the idea that custom work should feel personal, durable, and thoughtfully made from the first conversation to the final walkthrough.",
  story:
    "The shop is rooted in patience, problem-solving, and the satisfaction of building something with purpose. As the business grows from a serious craft into a dedicated service, the goal stays the same: create work that feels honest, useful, and worth keeping.",
  philosophy:
    "Each project is approached with close communication, practical design thinking, and a respect for materials that earn their character over time.",
};

export const makerPoints = [
  {
    title: "Marine discipline, maker's patience",
    description:
      "A career in the Marine Corps teaches you that details are never optional. That standard carries into every board that crosses the bench.",
  },
  {
    title: "A name earned the hard way",
    description:
      "The shop is named for the 9.75 fingers the maker kept after a late night at the table saw. It stays in the name as a promise: respect the work, never rush a cut.",
  },
  {
    title: "Rooted in Jacksonville, NC",
    description:
      "Home of Camp Lejeune and a community that understands service. Shadowboxes, retirement gifts, and unit plaques get built with the reverence they deserve.",
  },
];
