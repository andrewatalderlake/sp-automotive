import { Anton, Hanken_Grotesk } from "next/font/google";
import { Metadata } from "next";
import Navigation from "@/components/nav/Navigation";
import Footer from "@/components/footer/Footer";
import Analytics from "@/components/analytics/Analytics";
import LocalBusinessJsonLd from "@/components/seo/LocalBusinessJsonLd";
import CustomCursor from "@/components/effects/CustomCursor";
import { SITE_NAME, SITE_URL, TAGLINE } from "@/lib/site";
import "./globals.css";

// Anton is a free near-equivalent to Druk Wide Heavy. Single weight, no
// italic, no variable axes — globals.css strips italic + opsz/SOFT
// font-variation-settings to match.
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

// Hanken Grotesk — body / editorial / mono surfaces site-wide. Anton stays
// for display headlines (the cinematic Druk identity). See globals.css
// "Type Families" comment for the full role split. Three weights: 400 body,
// 500 labels/medium, 600 emphasis.
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — ${TAGLINE}`, template: `%s — ${SITE_NAME}` },
  description: `${TAGLINE} Factory-correct collision repair for Lamborghini, McLaren, Audi R8, and BMW M. Sarasota, FL.`,
  openGraph: {
    title: `${SITE_NAME} — ${TAGLINE}`,
    description: `${TAGLINE} Factory-correct collision repair for exotic cars. Sarasota, FL.`,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: { card: "summary_large_image", title: `${SITE_NAME} — ${TAGLINE}`, description: `${TAGLINE} Factory-correct collision repair for exotic cars.` },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${hanken.variable}`}>
      <head>
        <LocalBusinessJsonLd />
        {/* Preload the poster only — it's the LCP candidate. The video element streams on its own; explicit video preload was tanking LCP at 9.8MB. */}
        <link rel="preload" as="image" href="/hero-clips/cinematic-poster.jpg" fetchPriority="high" />
      </head>
      <body className="text-bone font-body antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-bg focus:font-body focus:text-sm focus:uppercase focus:tracking-[0.18em] focus:rounded-md"
        >
          Skip to content
        </a>
        <Navigation />
        <main id="main">{children}</main>
        <Footer />
        <CustomCursor />
        <Analytics />
      </body>
    </html>
  );
}
