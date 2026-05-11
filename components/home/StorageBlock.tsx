import CornerSection from "./CornerSection";
import SectionParallaxImage from "@/components/effects/SectionParallaxImage";

export default function StorageBlock() {
  return (
    <div className="relative isolate overflow-hidden">
      <SectionParallaxImage
        src="/sections/ch03-storage-urus-bay.jpg"
        alt="Matte-black Lamborghini Urus inside SP Automotive's secure climate-controlled bay, Sarasota"
      />
      <CornerSection
        chapterNumber="03"
        eyebrow="Indoor storage"
        headingId="storage-heading"
        scrubTime={14}
        animation="spring"
        headline={"Inside. Always."}
        body={
          <>
            <p>
              Every car lives behind a locked roll-up — totaled, mid-job,
              awaiting parts, ready for pickup. Climate-controlled. Monitored.
              Keys with Serge — not on a board.
            </p>
            <p className="mt-6 text-graphite">
              If overflow ever forces a different arrangement, you&apos;ll know
              before it happens.
            </p>
          </>
        }
      />
    </div>
  );
}
