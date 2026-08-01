import type { Metadata } from "next";
import "./globals.css";
import { getI18n } from "../lib/i18n";
import { baseUrl, siteConfig } from "../lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Yone International | Surgical Instrument Manufacturer in Sialkot",
    template: "%s | Yone International",
  },
  description:
    "Yone International manufactures precision surgical, dental and beauty instruments in Sialkot, Pakistan for professional and international buyers.",
  applicationName: siteConfig.name,
  keywords: [
    "surgical instruments manufacturer in Sialkot",
    "dental instruments Pakistan",
    "beauty instruments manufacturer",
    "private label surgical instruments",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteConfig.name,
    title: "Yone International — Precision Instruments from Sialkot",
    description:
      "Dental, beauty and surgical instrument manufacturing for professional buyers.",
    images: [
      {
        url: "/images/precision-instruments-original.jpg",
        width: 1536,
        height: 1536,
        alt: "Precision instruments arranged for inspection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yone International — Precision Instruments from Sialkot",
    description:
      "Dental, beauty and surgical instrument manufacturing for professional buyers.",
    images: ["/images/precision-instruments-original.jpg"],
  },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale, dir } = await getI18n();
  return (
    <html lang={locale} dir={dir}>
      <body>{children}</body>
    </html>
  );
}
