import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Inter } from "next/font/google";
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
  title: "Norman & Joo Yi | Wedding Invitation",
  description:
    "You are cordially invited to celebrate the wedding of Ang Norman & Ong Joo Yi on 15th May 2027 at VTEC Batu Kawan.",
  openGraph: {
    title: "Norman & Joo Yi | Wedding Invitation",
    description: "Join us on 15th May 2027 at VTEC Batu Kawan.",
    type: "website",
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
      <body>{children}</body>
    </html>
  );
}
