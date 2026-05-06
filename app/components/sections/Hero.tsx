import { HeroHeading } from "./HeroHeading";
import { HeroBody } from "./HeroBody";

/**
 * Hero — fills the viewport (plus 10% on desktop) below the header.
 *
 * Backgrounds removed: the page-wide scroll video (see
 * `ScrollVideoBackground` mounted in the root layout) provides the visual
 * here. The Hero is now a pure text section sitting over that video; the
 * global vignette overlay handles legibility, no per-section panel needed.
 *
 * Earlier versions layered a cursor-driven exploded-car video and a black
 * gradient text panel here. Both are gone — the global scroll background
 * subsumes the visual role and the cursor scrub no longer fits.
 *
 * Layout:
 *   • Mobile (<lg): heading + body stacked, full-width, center-aligned.
 *   • Desktop (lg+): heading + body left-anchored at ~35% width so the
 *     right side remains "negative space" over the most visually active
 *     part of the video.
 */
export function Hero() {
  return (
    <section
      id="top"
      aria-label="Hero"
      // `flex-1` so it can grow; `min-h-svh` mobile-safe floor; +10% on
      // desktop for a substantial hero that scrolls past as one full screen.
      // data-scroll-anchor="0" → ScrollVideoBackground holds at frame 0
      // (start of the video) while the viewport is centered on this section.
      // See app/components/ScrollVideoBackground.tsx.
      data-scroll-anchor="0"
      className="relative flex-1 min-h-svh lg:min-h-[110vh]"
    >
      {/* Mobile: stacked, padded */}
      <div className="flex h-full flex-col justify-around gap-12 px-6 py-12 sm:px-10 lg:hidden">
        <HeroHeading />
        <HeroBody />
      </div>

      {/* Desktop: left-anchored text column over the video, ~35% width.
          Right side intentionally empty so the scroll video has room to
          breathe and the eye lands on the motion. */}
      <div className="absolute inset-y-0 left-0 hidden w-[35%] flex-col justify-around p-12 lg:flex xl:px-16">
        <HeroHeading />
        <HeroBody />
      </div>
    </section>
  );
}
