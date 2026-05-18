"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import SplitText from "@/components/effects/SplitText";

// Chapter 03 — Climate-controlled storage. Lambo-style spotlight: the
// image is the section. It bleeds edge-to-edge (escaping the section's
// horizontal padding), with the "Inside. Always." headline and three
// inline callouts overlaid on a darkened bottom-left scrim. No glass
// card wrapping — the image IS the surface. This is what makes §03
// visually distinct from §02 (text cards) and §04 (asymmetric trio).

const SCRUB_TIME = 14;

const CALLOUTS = [
  { eyebrow: "Climate", value: "Controlled, dry" },
  { eyebrow: "Access", value: "Keyed, per-bay" },
  { eyebrow: "Monitored", value: "24 / 7, on-premises" },
];

export default function StorageBlock() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (reduced) {
      section.dataset.revealed = "1";
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) section.dataset.revealed = "1";
        }
      },
      { rootMargin: "-15% 0px -15% 0px", threshold: 0 },
    );
    io.observe(section);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="storage-heading"
      data-scrub-time={SCRUB_TIME}
      className="storage-block relative min-h-[110svh] w-full overflow-hidden bg-paper text-ink px-6 py-20 md:px-10 md:py-28 border-t border-ink/15"
    >
      {/* Section label — Anton uppercase, no chapter numeral. Centered
          (deliberate one-off — the spotlight image below is full-bleed and
          frames better with a centered label); other sections default to
          text-left per MASTER.md §7. */}
      <div className="relative z-10 mx-auto max-w-7xl">
        <p className="font-display uppercase tracking-[0.10em] text-center text-ink text-3xl md:text-5xl leading-none">
          Climate-controlled storage
        </p>
      </div>

      {/* Spotlight — full-bleed image with overlaid headline + callouts.
          The negative horizontal margin escapes the section's px-6/px-10
          padding so the image hits the paper surface's edges. The headline
          and callouts sit on a bottom scrim baked into the image wrapper. */}
      <div className="relative z-10 mt-10 md:mt-14 -mx-6 md:-mx-10">
        <div className="storage-block__spotlight relative overflow-hidden rounded-2xl">
          <div className="relative aspect-[4/3] w-full bg-ink md:aspect-[21/9]">
            <Image
              src="/sections/ch03-storage.webp"
              alt="Covered exotic car in a climate-controlled storage hall under a hex LED ceiling array"
              fill
              sizes="100vw"
              priority={false}
              className="object-cover"
            />
            {/* Scrim — guarantees overlay legibility regardless of image
                content beneath. Vertical gradient from dark bottom to clear
                top, with stronger left bias where the text sits. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/45 to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-ink/55 to-transparent"
            />

            {/* Overlay content — headline + callout strip. */}
            <div className="absolute inset-x-6 bottom-6 md:inset-x-12 md:bottom-12 max-w-4xl">
              <SplitText
                as="h2"
                id="storage-heading"
                className="display-md leading-[1.05] text-bone"
                reveal="mount"
                mountDelayMs={500}
                staggerMs={24}
              >
                {"Inside. Always."}
              </SplitText>

              <div className="mt-6 md:mt-8 flex flex-wrap gap-x-8 gap-y-4 md:gap-x-12">
                {CALLOUTS.map((c, i) => (
                  <div
                    key={c.eyebrow}
                    className="storage-block__callout"
                    style={{ "--i": i } as React.CSSProperties}
                  >
                    <p className="eyebrow text-bone/70">{`// ${c.eyebrow}`}</p>
                    <p className="mt-1.5 font-display text-bone text-base md:text-lg leading-tight">
                      {c.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <p className="mt-10 text-ink/80 max-w-2xl">
          If overflow ever forces a different arrangement, you&apos;ll know
          before it happens.
        </p>
      </div>

      <style jsx>{`
        :global(.storage-block__spotlight) {
          opacity: 0;
          transform: translateY(20px) scale(1.02);
          transform-origin: center;
          transition:
            opacity var(--motion-shutter, 600ms)
              cubic-bezier(0.83, 0, 0.17, 1),
            transform var(--motion-cinema, 1200ms)
              cubic-bezier(0.22, 1, 0.36, 1);
          transition-delay: 200ms;
        }
        :global(.storage-block[data-revealed="1"] .storage-block__spotlight) {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        :global(.storage-block__callout) {
          opacity: 0;
          transform: translateY(8px);
          transition:
            opacity var(--motion-shutter, 600ms)
              cubic-bezier(0.83, 0, 0.17, 1),
            transform var(--motion-shutter, 600ms)
              cubic-bezier(0.83, 0, 0.17, 1);
          transition-delay: calc(800ms + var(--i) * 90ms);
        }
        :global(.storage-block[data-revealed="1"] .storage-block__callout) {
          opacity: 1;
          transform: translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
          :global(.storage-block__spotlight),
          :global(.storage-block__callout) {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
