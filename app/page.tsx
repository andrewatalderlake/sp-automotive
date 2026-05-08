import PageScrubVideo from "@/components/effects/PageScrubVideo";
import HeroVideo from "@/components/hero/HeroVideo";
import TotalLossPlay from "@/components/home/TotalLossPlay";
import InsuranceHandling from "@/components/home/InsuranceHandling";
import StorageBlock from "@/components/home/StorageBlock";
import BodyworkAndEstimates from "@/components/home/BodyworkAndEstimates";
import BeforeAfterGallery from "@/components/gallery/BeforeAfterGallery";
import AboutStrip from "@/components/about/AboutStrip";
import FinalCTA from "@/components/cta/FinalCTA";

// PageScrubVideo is a fixed-position background layer; document scroll progress
// drives video.currentTime. Sections render above it via position: relative.
// Section sequence: hero (Totaled / Paid in Full) -> 01 total-loss play ->
// 02 carrier handling -> 03 indoor storage -> 04 mobile estimate ->
// 05 selected work (before/after gallery) -> 06 the signature (about) ->
// 07 next move (final CTA). The combined heights provide the scroll
// runway PageScrubVideo needs to play end-to-end.
export default function Home() {
  return (
    <>
      <PageScrubVideo />
      <HeroVideo />
      <TotalLossPlay />
      <InsuranceHandling />
      <StorageBlock />
      <BodyworkAndEstimates />
      <BeforeAfterGallery />
      <AboutStrip />
      <FinalCTA />
    </>
  );
}
