import type { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import PositioningTable from "@/components/positioning/PositioningTable";
import FinalCTA from "@/components/cta/FinalCTA";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Serge",
  description:
    "Serge built SP Automotive in Sarasota for the exotics most shops won't touch. Forensic intake, factory-spec repair, one signature on every job.",
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStory />
      <PositioningTable />
      <FinalCTA />
    </>
  );
}
