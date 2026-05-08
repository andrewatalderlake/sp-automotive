import CornerSection from "./CornerSection";

export default function TotalLossPlay() {
  return (
    <CornerSection
      chapterNumber="01"
      eyebrow="The total-loss play"
      headingId="total-loss-heading"
      scrubTime={7}
      animation="lift"
      headline={"70% of value.\nThe math turns."}
      body={
        <>
          <p>
            When the cost to repair crosses 70% of what the car is worth, the
            carrier owes you the car — not a patched copy of it. Settled in
            full. And on cars that have appreciated since you bought them,
            often $10–20k above what you paid.
          </p>
          <p className="mt-6 text-graphite">
            We document the damage. We make the case. The carrier writes the
            check.
          </p>
        </>
      }
    />
  );
}
