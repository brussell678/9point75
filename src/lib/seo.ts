import type { Metadata } from "next";

export const siteUrl = "https://9point75woodworks.com";
export const businessName = "9point75 Woodworks";
export const city = "Jacksonville";
export const state = "North Carolina";
export const region = "Northeastern North Carolina";
export const serviceAreaLabel = "Serving Jacksonville, North Carolina, Northeastern North Carolina, and surrounding areas.";

export const defaultKeywords = [
  "custom furniture North Carolina",
  "custom cabinets NC",
  "built-ins North Carolina",
  "custom woodworking Jacksonville NC",
  "veteran owned woodworker North Carolina",
];

export function buildPageMetadata({
  title,
  description,
  path = "",
  keywords = [],
}: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
}): Metadata {
  const url = `${siteUrl}${path}`;

  return {
    title,
    description,
    keywords: [...defaultKeywords, ...keywords],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | ${businessName}`,
      description,
      url,
      siteName: businessName,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: `${siteUrl}/brand/9point75_logo.jpg`,
          width: 500,
          height: 500,
          alt: `${businessName} logo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${businessName}`,
      description,
      images: [`${siteUrl}/brand/9point75_logo.jpg`],
    },
  };
}

export function getLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: businessName,
    image: `${siteUrl}/brand/9point75_logo.jpg`,
    url: siteUrl,
    email: "9point75Woodworks@gmail.com",
    areaServed: [
      {
        "@type": "City",
        name: city,
      },
      {
        "@type": "State",
        name: state,
      },
      region,
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: city,
      addressRegion: "NC",
      addressCountry: "US",
    },
    description:
      "Custom cabinetry, built-ins, furniture, military shadowboxes, plaques, and specialty woodwork handcrafted in Jacksonville, North Carolina.",
  };
}

export const servicePageLinks = [
  {
    href: "/custom-furniture-north-carolina",
    label: "Custom Furniture",
  },
  {
    href: "/custom-cabinets-north-carolina",
    label: "Custom Cabinets",
  },
  {
    href: "/built-ins-north-carolina",
    label: "Built-Ins",
  },
];
