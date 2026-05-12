import CornerSection from "./CornerSection";

export default function TotalLossPlay() {
  return (
    <CornerSection
      chapterNumber="01"
      eyebrow="Built for exotics and rental fleets"
      headingId="total-loss-heading"
      animation="lift"
      layout="card"
      headline={"70% of value.\nThe math turns."}
      body={
        <>
          <p>
            Repair past seventy percent of value and totaling pays better than
            fixing. The carrier writes a check for the whole car — sometimes
            five figures over what you paid, depending on how the market
            moved.
          </p>
          <p className="mt-6 text-graphite">
            We document the damage. We make the case. We close the file.
          </p>
        </>
      }
    />
  );
}
