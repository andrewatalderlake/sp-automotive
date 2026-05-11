import SectionScrubVideo from "@/components/effects/SectionScrubVideo";
import HeroVideo from "@/components/hero/HeroVideo";
import TotalLossPlay from "@/components/home/TotalLossPlay";
import InsuranceHandling from "@/components/home/InsuranceHandling";
import BrandShowcaseStrip from "@/components/showroom/BrandShowcaseStrip";
import StorageBlock from "@/components/home/StorageBlock";
import BodyworkAndEstimates from "@/components/home/BodyworkAndEstimates";
import CustomWork from "@/components/home/CustomWork";
import FinalCTA from "@/components/cta/FinalCTA";

// Hero + chapter 01 share a scroll-scrub video region (SectionScrubVideo).
// Chapters 02–05 each paint their own per-section gradient atmosphere
// (no full-bleed photos). Chapter 06 closes on a looping backdrop video.
// The selected-work gallery has moved to its own route at /gallery and is
// linked from the nav.
export default function Home() {
  return (
    <>
      <section data-scrub-region className="relative">
        <SectionScrubVideo
          src="/hero-clips/total-loss.mp4"
          poster="/hero-clips/total-loss-poster.jpg"
        />
        <HeroVideo />
        <TotalLossPlay />
      </section>
      <InsuranceHandling />
      <BrandShowcaseStrip />
      <StorageBlock />
      <BodyworkAndEstimates />
      <CustomWork />
      <FinalCTA />
    </>
  );
}
