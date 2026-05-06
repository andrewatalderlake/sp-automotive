import PageScrubVideo from "@/components/effects/PageScrubVideo";
import HeroVideo from "@/components/hero/HeroVideo";
import TotalLossPlay from "@/components/home/TotalLossPlay";
import InsuranceHandling from "@/components/home/InsuranceHandling";
import StorageBlock from "@/components/home/StorageBlock";
import BodyworkAndEstimates from "@/components/home/BodyworkAndEstimates";
import AboutStrip from "@/components/about/AboutStrip";
import FinalCTA from "@/components/cta/FinalCTA";

// PageScrubVideo is a fixed-position background layer; document scroll progress
// drives video.currentTime. Sections render above it via position: relative.
// The combined section heights (7 × ~100svh) provide the scroll runway the
// scrub mechanism needs to play the cinematic clip end-to-end.
export default function Home() {
  return (
    <>
      <PageScrubVideo />
      <HeroVideo />
      <TotalLossPlay />
      <InsuranceHandling />
      <StorageBlock />
      <BodyworkAndEstimates />
      <AboutStrip />
      <FinalCTA />
    </>
  );
}
