import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ScrollVideoBackground } from "./components/ScrollVideoBackground";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SP Automotive — Collision Repair",
  description:
    "We work directly with your insurance company so you don't have to. Free estimates, expert collision repair.",
};

// Body uses `bg-black` as the fallback under the scroll video — if the video
// fails to load, letterboxes briefly at narrow aspect ratios, or paints during
// a hot reload, black reads as intentional rather than as a flash of white.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="bg-black text-charcoal font-sans">
        <ScrollVideoBackground />
        {children}
      </body>
    </html>
  );
}
