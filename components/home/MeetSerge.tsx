import Image from "next/image";
import Link from "next/link";

// "Meet Serge" — homepage introduction of the founder, placed between
// §TrustStrip and §InsuranceHandling so the visitor meets the person
// before the carrier-handling and process chapters take over the scroll.
// Dark surface (`data-theme="dark"` so StickyContactBar flips correctly)
// — the surface flip from paper sections above into ink here marks the
// "meet the human" beat editorially, and the portrait reads more
// cinematic against ink. Portrait re-used from /about so a single asset
// feeds both the deep-dive page and the homepage stub.
//
// STUB: copy is voice-correct but not Serge-verified. The "three or four
// pairs of hands vs. one" contrast is the rhetorical hook — defensible as
// long as Serge personally walks the job from intake to handover. If
// helpers run any step, the line needs softening. Other Serge bio
// phrasing lives in components/about/AboutStory.tsx and shouldn't be
// duplicated here. Replace with real specifics (years at the bench,
// prior shops, named marques certified on) when content lands.

// Portrait path. The asset lives at /public/about/serge-portrait.webp.
// A prior version of this file probed the filesystem at request time
// via existsSync() and rendered a placeholder when missing, but that
// probe silently returns false on serverless runtimes (where /public
// is served by the CDN, not present on the function's disk) if any
// parent layout makes the page dynamic via cookies()/headers(). The
// asset is committed; if it ever goes missing, a broken <Image> is
// the right loud signal — better than a silent placeholder that hides
// the regression.
const PORTRAIT_PATH = "/about/serge-portrait.webp";

export default function MeetSerge() {
  return (
    <section
      aria-labelledby="meet-serge-heading"
      data-theme="dark"
      className="relative w-full bg-ink text-bone px-6 py-20 md:px-10 md:py-28"
    >
      <div className="relative z-10 mx-auto max-w-7xl">
        <p className="font-display uppercase tracking-[0.10em] text-left text-bone text-3xl md:text-5xl leading-none">
          Meet Serge
        </p>

        <div className="mt-12 md:mt-16 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16 items-center">
          {/* Copy column. Desktop: text-left of portrait, matches the
              AboutHero treatment so /about and homepage read as one voice.
              Mobile: portrait first (order-1), copy below. */}
          <div className="order-2 md:order-1 md:col-span-7">
            <h2
              id="meet-serge-heading"
              className="display-md leading-[1.05] text-bone"
            >
              Same hands.
              <br />
              Every car.
            </h2>
            <p className="mt-8 lead text-bone/85 max-w-[55ch]">
              My name is Serge. I own SP Automotive, and I do the work
              myself. Most body shops pass your car between three or four
              pairs of hands before it goes home. Here, you&apos;re hiring
              one person to be on it from the first photo to the keys back
              &mdash; me.
            </p>
            <Link
              href="/about"
              className="link-underline inline-block mt-10 text-bone uppercase tracking-[0.18em] text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-bone focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              How I got here &rarr;
            </Link>
          </div>

          {/* Portrait column. 3:4 aspect matches the /about hero crop so
              the build-time crop on the source file lands the same way on
              both pages. */}
          <div className="order-1 md:order-2 md:col-span-5">
            <div className="relative w-full aspect-[3/4] border border-hairline overflow-hidden">
              <Image
                src={PORTRAIT_PATH}
                alt="Serge, founder of SP Automotive"
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
