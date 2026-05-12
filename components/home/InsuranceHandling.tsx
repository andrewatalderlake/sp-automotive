import CornerSection from "./CornerSection";

// Section 02 atmosphere: a single soft radial bloom anchored top-right
// (steel-tinted, ~45% α at center, fully transparent by 80% of radius).
// No opaque base — the html canvas (`ink → ink-deep`, fixed) provides the
// shared background that all chapter sections sit on, so adjacent sections
// don't show a seam at their boundary. Reads as light entering from
// upper-right — the "arrival" beat for the insurance chapter.
const BACKGROUND =
  "radial-gradient(ellipse 90% 70% at 85% 15%, " +
  "rgba(42, 45, 50, 0.45) 0%, " +
  "rgba(42, 45, 50, 0.18) 35%, " +
  "transparent 80%)";

export default function InsuranceHandling() {
  return (
    <CornerSection
      chapterNumber="02"
      eyebrow="We handle the carrier"
      headingId="insurance-handling-heading"
      scrubTime={11}
      animation="slide"
      background={BACKGROUND}
      tightTop
      layout="plain"
      headline={"We fight the file.\nYou stay out of it."}
      body={
        <>
          <p>
            Most shops file the claim, pocket the margin, hand back the keys.
            We negotiate line item to line item, adjuster to estimator, until
            the carrier pays you in full — and you come out ahead on the car,
            not the shop.
          </p>
          <p className="mt-6 text-graphite">
            You don&apos;t see the friction. You see the result.
          </p>
        </>
      }
    />
  );
}
