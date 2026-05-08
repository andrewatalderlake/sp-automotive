import CornerSection from "./CornerSection";

export default function InsuranceHandling() {
  return (
    <CornerSection
      chapterNumber="02"
      eyebrow="We handle the carrier"
      headingId="insurance-handling-heading"
      scrubTime={11}
      animation="slide"
      headline={"We fight the file.\nYou stay out of it."}
      body={
        <>
          <p>
            Most body shops file the claim, take the margin, hand you the keys.
            Different math here. We document, supplement, negotiate — adjuster
            to estimator, line item to line item — until the carrier pays for
            the car you actually own.
          </p>
          <p className="mt-6 text-graphite">
            You don&apos;t see the friction. You see the result.
          </p>
        </>
      }
    />
  );
}
