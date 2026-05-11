import SectionScrubVideo from "@/components/effects/SectionScrubVideo";
import HeroVideo from "@/components/hero/HeroVideo";
import TotalLossPlay from "@/components/home/TotalLossPlay";
import InsuranceHandling from "@/components/home/InsuranceHandling";
import StorageBlock from "@/components/home/StorageBlock";
import BodyworkAndEstimates from "@/components/home/BodyworkAndEstimates";
import CustomWork from "@/components/home/CustomWork";
import BeforeAfterGallery from "@/components/gallery/BeforeAfterGallery";
import AboutStrip from "@/components/about/AboutStrip";
import FinalCTA from "@/components/cta/FinalCTA";

// Hero + chapter 01 share a scroll-scrub video region (SectionScrubVideo).
// Chapters 02, 03, 05, and 08 each carry their own full-bleed background
// image via SectionParallaxImage. Chapters 04 and 07 are intentional rest
// beats — text-only — so the image-backed chapters land harder. Chapter
// 06 (BeforeAfterGallery) keeps its own gallery composition.
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
      <StorageBlock />
      <BodyworkAndEstimates />
      <CustomWork />
      <BeforeAfterGallery />
      <AboutStrip />
      <FinalCTA />
    </>
  );
}
