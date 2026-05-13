import HeroVideo from "@/components/hero/HeroVideo";
import TheMath from "@/components/home/TheMath";
import InsuranceHandling from "@/components/home/InsuranceHandling";
import StorageBlock from "@/components/home/StorageBlock";
import BodyworkAndEstimates from "@/components/home/BodyworkAndEstimates";
import HowItWorks from "@/components/home/HowItWorks";
import BeforeAfterGallery from "@/components/gallery/BeforeAfterGallery";
import AboutStrip from "@/components/about/AboutStrip";
import HomeFAQ from "@/components/home/HomeFAQ";
import FinalCTA from "@/components/cta/FinalCTA";

// Atmosphere is now per-section instead of page-wide. The hero owns its own
// scroll-scrub video (in HeroVideo); chapters 02-04 each carry their own
// SectionScrubVideo footage via the videoSrc prop on CornerSection; chapter
// 01 (TheMath) is the paper-light editorial break; chapter 05 (HowItWorks)
// rides the workshop scrub clip.
//
// Section sequence: hero (Totaled / Paid in Full) -> 01 the math ->
// 02 carrier handling -> 03 indoor storage -> 04 mobile estimate ->
// 05 how it works -> 06 selected work (before/after gallery) ->
// 07 the signature (about) -> 08 common questions (FAQ) -> 09 next move
// (final CTA). The html canvas (atmospheric ink gradient, `globals.css`)
// carries the background for sections without their own clip.
export default function Home() {
  return (
    <>
      <HeroVideo />
      <TheMath />
      <InsuranceHandling />
      <StorageBlock />
      <BodyworkAndEstimates />
      <HowItWorks />
      <BeforeAfterGallery />
      <AboutStrip />
      <HomeFAQ />
      <FinalCTA />
    </>
  );
}
