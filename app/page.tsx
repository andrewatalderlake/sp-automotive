import HeroVideo from "@/components/hero/HeroVideo";
import TrustStrip from "@/components/home/TrustStrip";
import TheMath from "@/components/home/TheMath";
import InsuranceHandling from "@/components/home/InsuranceHandling";
import StorageBlock from "@/components/home/StorageBlock";
import BodyworkAndEstimates from "@/components/home/BodyworkAndEstimates";
import HowItWorks from "@/components/home/HowItWorks";
import FeaturedBuilds from "@/components/home/FeaturedBuilds";
import BeforeAfterGallery from "@/components/gallery/BeforeAfterGallery";
import AboutStrip from "@/components/about/AboutStrip";
import HomeFAQ from "@/components/home/HomeFAQ";
import FinalCTA from "@/components/cta/FinalCTA";

// Section sequence:
//   hero (Totaled / Paid in Full)
//   trust strip (carriers + makes/models — credibility immediately after hero)
//   01 the math (paper-light editorial break)
//   02 carrier handling
//   03 indoor storage (spotlight)
//   04 mobile estimate
//   05 how it works
//   selected work (featured builds 1+3 grid, unnumbered)
//   06 selected work (before/after gallery)
//   07 the signature (about, with stats + signature)
//   08 common questions (FAQ)
//   09 next move (final CTA)
//
// Atmosphere is per-section. The html canvas (atmospheric ink gradient,
// `globals.css`) carries the background for sections without their own
// surface treatment.
export default function Home() {
  return (
    <>
      <HeroVideo />
      <TrustStrip />
      <TheMath />
      <InsuranceHandling />
      <StorageBlock />
      <BodyworkAndEstimates />
      <HowItWorks />
      <FeaturedBuilds />
      <BeforeAfterGallery />
      <AboutStrip />
      <HomeFAQ />
      <FinalCTA homepage />
    </>
  );
}
