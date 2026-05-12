import CornerSection from "./CornerSection";
import PhoneCTA from "@/components/ui/PhoneCTA";
import SmsCTA from "@/components/ui/SmsCTA";

// Section 04 atmosphere: very wide, low-intensity centered bloom (50% x /
// 45% y — brightest point sits behind the chapter mark, not the body).
// Spread enlarged and alpha dropped so the ellipse edge dissolves before
// it reaches the section borders; no visible ring against the canvas. No
// opaque base — sits directly on the html canvas (`ink → ink-deep`,
// fixed) so this section transitions seamlessly into 03 and 05.
const BACKGROUND =
  "radial-gradient(ellipse 120% 100% at 50% 45%, " +
  "rgba(42, 45, 50, 0.22) 0%, " +
  "rgba(42, 45, 50, 0.08) 45%, " +
  "transparent 85%)";

export default function BodyworkAndEstimates() {
  return (
    <CornerSection
      chapterNumber="04"
      eyebrow="Estimate without the haul"
      headingId="bodywork-estimates-heading"
      scrubTime={24}
      animation="tilt"
      background={BACKGROUND}
      tightTop
      layout="plain"
      headline={"We come to you."}
      body={
        <>
          <p>
            Cars that can&apos;t move don&apos;t have to. We pull up to your
            driveway, look at the damage, and turn a call into a written
            number in one to two days.
          </p>
          <p className="mt-6">
            Sarasota and a forty-mile ring around it — Bradenton, Venice,
            Lakewood Ranch, Longboat. Further than that, send photos by
            text first; we&apos;ll tell you what&apos;s worth a site visit.
          </p>
          <p className="mt-6">
            The estimate isn&apos;t a hand-wave. It&apos;s the same line-item
            document your carrier will see — parts, labor, paint,
            materials, with OEM sourcing flagged where it matters. If
            you decide to file, we hand the file off intact.
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
