import type { Metadata } from "next";
import { Cormorant_Garamond, Public_Sans } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { businessName, defaultKeywords, getLocalBusinessJsonLd, siteUrl } from "@/lib/seo";

const displayFont = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bodyFont = Public_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: businessName,
    template: `%s | ${businessName}`,
  },
  description:
    "Custom cabinetry, built-ins, and heirloom furniture handcrafted in Jacksonville, North Carolina.",
  keywords: defaultKeywords,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: businessName,
    description:
      "Custom cabinetry, built-ins, and heirloom furniture handcrafted in Jacksonville, North Carolina.",
    url: siteUrl,
    siteName: businessName,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/brand/9point75_logo.jpg",
        width: 500,
        height: 500,
        alt: `${businessName} logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: businessName,
    description:
      "Custom cabinetry, built-ins, and heirloom furniture handcrafted in Jacksonville, North Carolina.",
    images: ["/brand/9point75_logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/brand/9point75_logo.jpg",
    apple: "/brand/9point75_logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusinessJsonLd = getLocalBusinessJsonLd();

  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <div className="page-shell">
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
