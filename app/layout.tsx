import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { LanguageProvider } from "@/lib/i18n";
import LanguageToggle from "@/components/LanguageToggle";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant-garamond",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const interSans = Inter({
  subsets: ["latin"],
  variable: "--font-inter-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wedding-invitation-ten-dusky.vercel.app"),
  title: "Norman & Jooyi Digital RSVP",
  description: "AJ❤️ Forever 15/5/2027",
  openGraph: {
    title: "Norman & Jooyi Digital RSVP",
    description: "AJ❤️ Forever 15/5/2027",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Norman & Jooyi Wedding",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Norman & Jooyi Digital RSVP",
    description: "AJ❤️ Forever 15/5/2027",
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${cormorantGaramond.variable} ${interSans.variable}`}
    >
      <body>
        <LanguageProvider>
          <LanguageToggle />
          {children}
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
