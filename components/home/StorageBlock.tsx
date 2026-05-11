import CornerSection from "./CornerSection";

// Section 03 atmosphere: cool steel. 135° linear gradient — steel-tinted
// top-left (35% α) falling through ink to ink-deep bottom-right. Most
// directional of the four chapter backgrounds; gives the eye something
// to track as it crosses the "bay" beat.
const BACKGROUND =
  "linear-gradient(135deg, " +
  "rgba(42, 45, 50, 0.35) 0%, " +
  "rgba(14, 15, 17, 1) 45%, " +
  "var(--color-ink-deep) 100%)";

export default function StorageBlock() {
  return (
    <CornerSection
      chapterNumber="03"
      eyebrow="Indoor storage"
      headingId="storage-heading"
      scrubTime={14}
      animation="spring"
      background={BACKGROUND}
      headline={"Indoor first.\nAlways covered."}
      body={
        <>
          <p>
            Every car under roof when we can — totaled, mid-job, awaiting
            parts, ready for pickup. Same goes for the ones still driving.
            Climate-controlled. Monitored. Keys with Serge — not on a board.
          </p>
          <p className="mt-6 text-graphite">
            If overflow ever forces a different arrangement, you&apos;ll know
            before it happens.
          </p>
        </>
      }
    />
  );
}
