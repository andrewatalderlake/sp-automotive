import RevealWords from "@/components/effects/RevealWords";
import { CardStack, type CardStackItem } from "./CardStack";
import { BUILDS } from "@/components/builds/builds-data";

// Section 06 — Featured builds. A 3D fan-stack carousel of body-kit
// transformations. Each card links to /builds/{slug} where the user can
// drag a before/after slider between the stock car and the kit-installed
// version. Data lives in components/builds/builds-data.ts.

const builds: CardStackItem[] = BUILDS.map((b, i) => ({
  id: i + 1,
  title: b.car,
  description: b.kit,
  imageSrc: b.kitImage,
  href: `/builds/${b.slug}`,
}));

export default function BeforeAfterGallery() {
  return (
    <section
      id="work"
      className="bag-section relative overflow-hidden px-6 md:px-10 pt-16 pb-20 md:pt-20 md:pb-24 scroll-mt-32"
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
            "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(200, 40, 29, 0.16) 0%, rgba(200, 40, 29, 0.08) 40%, rgba(200, 40, 29, 0) 75%)",
        }}
      />
      <div
        aria-hidden
        className="bag-pulse pointer-events-none absolute inset-0 -z-0"
        style={{
          background:
            "radial-gradient(ellipse 45% 40% at 50% 50%, rgba(200, 40, 29, 0.35) 0%, rgba(200, 40, 29, 0.18) 35%, rgba(200, 40, 29, 0) 70%)",
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
      <div className="relative z-10 mb-8 md:mb-10">
        <div className="font-display text-bone leading-none tracking-[-0.02em] text-3xl md:text-5xl">
          06
        </div>
        <p className="eyebrow mt-2">/ Featured builds</p>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="display-lg mb-6 md:mb-8 text-center">
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
        />
      </div>
    </section>
  );
}
