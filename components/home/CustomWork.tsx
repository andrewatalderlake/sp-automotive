import CornerSection from "./CornerSection";

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
//
// Section 05 atmosphere: a faint `--color-ignite` (#C8281D) bloom anchored
// bottom-left (8% α inner → 4% → 0% by 65% of radius). The one section
// where the brand red shows up as atmosphere — primes the eye for the
// BeforeAfterGallery beat that follows. Hardcoded rgba because alpha
// mixing on a CSS custom property inside an inline string is awkward.
const BACKGROUND =
  "radial-gradient(ellipse 70% 55% at 15% 85%, " +
  "rgba(200, 40, 29, 0.08) 0%, " +
  "rgba(200, 40, 29, 0.04) 30%, " +
  "rgba(14, 15, 17, 0) 65%), " +
  "linear-gradient(to bottom, var(--color-ink), var(--color-ink-deep))";

export default function CustomWork() {
  return (
    <CornerSection
      chapterNumber="05"
      eyebrow="Custom work — Sarasota"
      headingId="custom-work-heading"
      animation="sweep"
      background={BACKGROUND}
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
  );
}
