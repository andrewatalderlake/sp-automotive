import CornerSection from "./CornerSection";
import PhoneCTA from "@/components/ui/PhoneCTA";
import SmsCTA from "@/components/ui/SmsCTA";

// Section 04 atmosphere: centered radial vignette (50% x / 45% y — raised
// slightly so the brightest point sits behind the chapter mark, not the
// bottom-right glass card), steel at 30% α. Reads as a soft spotlight —
// the "we come to you" intimate beat — without competing with Section 2's
// off-center bloom.
const BACKGROUND =
  "radial-gradient(ellipse 60% 50% at 50% 45%, " +
  "rgba(42, 45, 50, 0.30) 0%, " +
  "rgba(14, 15, 17, 0) 70%), " +
  "linear-gradient(to bottom, var(--color-ink), var(--color-ink-deep))";

export default function BodyworkAndEstimates() {
  return (
    <CornerSection
      chapterNumber="04"
      eyebrow="Estimate without the haul"
      headingId="bodywork-estimates-heading"
      scrubTime={24}
      animation="tilt"
      background={BACKGROUND}
      headline={"We come to you."}
      body={
        <>
          <p>
            Cars that can&apos;t move don&apos;t have to. We bring the estimate
            to your driveway, your garage, your storage unit — wherever the
            car is. One to two days from the call to the written number.
          </p>
          <p className="mt-6 text-graphite">
            Monday through Saturday.
          </p>
        </>
      }
      cta={
        <>
          <PhoneCTA size="lg" location="bodywork-estimates" />
          <SmsCTA location="bodywork-estimates" />
        </>
      }
    />
  );
}
