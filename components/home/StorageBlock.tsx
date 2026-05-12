import CornerSection from "./CornerSection";

// Section 03 atmosphere: a soft top-left bloom (steel-tinted) — the
// "bay" beat as a quiet shaft of light, not a directional band. Earlier
// versions used a 135° linear gradient with a mid-stop, which banded
// across the section visibly. Replaced with a wide, transparent radial
// over the shared html-canvas base so the section reads continuous with
// 02 and 04 at the seams.
const BACKGROUND =
  "radial-gradient(ellipse 90% 75% at 18% 20%, " +
  "rgba(42, 45, 50, 0.38) 0%, " +
  "rgba(42, 45, 50, 0.14) 40%, " +
  "transparent 80%)";

export default function StorageBlock() {
  return (
    <CornerSection
      chapterNumber="03"
      eyebrow="Indoor storage"
      headingId="storage-heading"
      scrubTime={14}
      animation="spring"
      background={BACKGROUND}
      tightTop
      layout="plain"
      headline={"Indoor first.\nAlways covered."}
      body={
        <>
          <p>
            Every car under roof when we can — totaled, mid-job, awaiting
            parts, ready for pickup. Same goes for the ones still driving.
            Climate-controlled. Monitored. Keys with Serge — not on a board.
          </p>
          <p className="mt-6">
            Bays are sized for exotics. Cars don&apos;t touch. Covers on
            anything that sits more than a week. Dust handled by the same
            booth filtration that runs during paint — your finish doesn&apos;t
            pick up shop air while it waits.
          </p>
          <p className="mt-6">
            Pickup and drop-off are by appointment. You get a video
            walkaround the day it lands and the day it leaves — same
            camera, same angles, on file.
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
