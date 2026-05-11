import CornerSection from "./CornerSection";
import SectionParallaxImage from "@/components/effects/SectionParallaxImage";

// Chapter 05 — "Custom work". SP doesn't only fix wrecks; the same booth
// fits body kits, paints headlights/tail lights, and applies sprayable
// wrap. Inserted between the service chapters (01–04) and the proof
// gallery (06) to raise the perceived craftsmanship ceiling before the
// before/after work shows up.
//
// SEO: H2 carries three high-intent service terms verbatim. Eyebrow
// carries the geo + service category. Body weaves marque-agnostic
// semantic context (factory spec, exotic, Sarasota). Dedicated landing
// page at /custom-work-sarasota is the proper home for ranking depth —
// follow-up.
export default function CustomWork() {
  return (
    <div className="relative isolate overflow-hidden">
      <SectionParallaxImage
        src="/sections/ch05-custom-shelby.jpg"
        alt="Custom-painted red Ford F-150 Shelby in SP Automotive's Sarasota detail bay"
      />
      <CornerSection
        chapterNumber="05"
        eyebrow="Custom work — Sarasota"
        headingId="custom-work-heading"
        animation="sweep"
        headline={"Body kits.\nCustom paint.\nSprayable wrap."}
        body={
          <>
            <p>
              Headlights painted to factory spec or any custom color. Tail
              lights cleared, smoked, or color-matched. Sprayable wrap that
              goes on full and comes off clean. Body kits fitted, blended,
              painted in-house — not bolted on.
            </p>
            <p className="mt-6 text-graphite">
              The same booth that handles the wrecks does the builds. Same
              hand, same standard, on every exotic that rolls through
              Sarasota.
            </p>
          </>
        }
      />
    </div>
  );
}
