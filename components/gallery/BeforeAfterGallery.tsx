"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import RevealWords from "@/components/effects/RevealWords";
import { CardStack, type CardStackItem } from "./CardStack";
import { BUILDS } from "@/components/builds/builds-data";
import { ShineBorder } from "@/components/ui/shine-border";

// Section 06 — Featured builds. A 3D fan-stack carousel of body-kit
// transformations. Each card teases the STOCK car so the click reveals
// the transformation on the sub-page (`/builds/{slug}`), where stock
// and kit sit side-by-side. Data lives in components/builds/builds-data.ts.
//
// A glass-pill "See build" link in the bottom-right of each card
// navigates straight to the matching build page; the rest of the card
// body keeps CardStack's default behavior of re-centering the carousel
// on that card.

const builds: CardStackItem[] = BUILDS.map((b, i) => ({
  id: i + 1,
  title: b.car,
  description: b.kit,
  imageSrc: b.stockImage,
  href: `/builds/${b.slug}`,
  accentColor: b.accentColor,
}));

function BuildCard({
  item,
  active,
}: {
  item: CardStackItem;
  active: boolean;
}) {
  // Same ShineBorder ring as DefaultFanCard so the landing-page carousel
  // gets the rotating accent even though we use a custom renderer (for
  // the "See build" pill). Active card sweeps faster for emphasis.
  return (
    <ShineBorder
      borderRadius={16}
      borderWidth={4}
      duration={active ? 4 : 8}
      color={item.accentColor ?? ["#C9C4BB", "#6E727A"]}
      animated
      className="h-full w-full"
    >
      <div className="relative h-full w-full">
        {item.imageSrc ? (
          <Image
            src={item.imageSrc}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 760px"
            draggable={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-steel text-sm text-graphite">
            No image
          </div>
        )}

        {/* Bottom gradient for text legibility. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Title + description (bottom-left). */}
        <div className="relative z-10 flex h-full flex-col justify-end p-5 pr-32 md:pr-40">
          <div className="truncate text-lg font-semibold text-white">
            {item.title}
          </div>
          {item.description ? (
            <div className="mt-1 line-clamp-2 text-sm text-white/80">
              {item.description}
            </div>
          ) : null}
        </div>

        {/* See-build glass pill (bottom-right). stopPropagation keeps the
            carousel's setActive handler from firing during navigation. */}
        {item.href ? (
          <Link
            href={item.href}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-5 right-5 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs uppercase tracking-[0.18em] text-bone backdrop-blur-md transition hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bone/60"
            aria-label={`See ${item.title}${item.description ? ` ${item.description}` : ""} build`}
          >
            See build
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        ) : null}
      </div>
    </ShineBorder>
  );
}

export default function BeforeAfterGallery() {
  return (
    <section
      id="work"
      className="bag-section relative overflow-hidden bg-paper text-ink px-6 md:px-10 py-20 md:py-28 scroll-mt-32"
    >
      {/* Subtle red breathing glow behind the carousel. Two stacked
          radial-gradient layers: a wide warm bed + a tighter ember core
          that pulses via opacity over ~8s. Pure CSS, no Three.js — pauses
          via prefers-reduced-motion. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(200, 40, 29, 0.08) 0%, rgba(200, 40, 29, 0.04) 40%, rgba(200, 40, 29, 0) 75%)",
        }}
      />
      <div
        aria-hidden
        className="bag-pulse pointer-events-none absolute inset-0 -z-0"
        style={{
          background:
            "radial-gradient(ellipse 45% 40% at 50% 50%, rgba(200, 40, 29, 0.18) 0%, rgba(200, 40, 29, 0.09) 35%, rgba(200, 40, 29, 0) 70%)",
        }}
      />
      <style>{`
        @keyframes bag-breathing {
          0%, 100% { opacity: 0.45; transform: scale(1); }
          50%      { opacity: 0.85; transform: scale(1.08); }
        }
        .bag-pulse {
          animation: bag-breathing 8s ease-in-out infinite;
          transform-origin: 50% 50%;
        }
        @media (prefers-reduced-motion: reduce) {
          .bag-pulse { animation: none; opacity: 0.6; }
        }
      `}</style>
      <div className="relative z-10 mx-auto mb-8 max-w-7xl md:mb-10">
        <div className="font-display text-ink leading-none tracking-[-0.02em] text-3xl md:text-5xl">
          06
        </div>
        <p className="eyebrow mt-2 text-graphite">/ Before + after</p>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="display-lg text-ink mb-6 md:mb-8 text-center">
          <RevealWords>Built to a higher spec.</RevealWords>
        </h2>
        <CardStack
          items={builds}
          maxVisible={7}
          cardWidth={760}
          cardHeight={480}
          loop
          autoAdvance
          intervalMs={4200}
          pauseOnHover
          showDots
          renderCard={(item, { active }) => (
            <BuildCard item={item} active={active} />
          )}
        />
      </div>
    </section>
  );
}
