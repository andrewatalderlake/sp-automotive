import CornerSection from "./CornerSection";

export default function StorageBlock() {
  return (
    <CornerSection
      chapterNumber="03"
      eyebrow="Indoor storage"
      headingId="storage-heading"
      scrubTime={18}
      animation="sweep"
      headline={<>Inside. Always.</>}
      body={
        <>
          <p>
            Every car lives behind a locked roll-up — totaled, mid-job,
            awaiting parts, ready for pickup. Climate-controlled. Monitored.
            Keys with Serge — not on a board.
          </p>
          <p className="mt-6 text-muted">
            If overflow ever forces a different arrangement, you&apos;ll know
            before it happens.
          </p>
        </>
      }
    />
  );
}
