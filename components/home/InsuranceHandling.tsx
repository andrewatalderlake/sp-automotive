import CornerSection from "./CornerSection";

// Section 02 atmosphere: warm-cool baseline. A radial bloom anchored
// top-right (steel-tinted, ~55% α at center, fading by 65% of radius)
// over the page's ink → ink-deep linear. Reads as light entering from
// upper-right — the "arrival" beat for the insurance chapter.
const BACKGROUND =
  "radial-gradient(ellipse 80% 60% at 85% 15%, " +
  "rgba(42, 45, 50, 0.55) 0%, " +
  "rgba(14, 15, 17, 0) 65%), " +
  "linear-gradient(to bottom, var(--color-ink), var(--color-ink-deep))";

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
