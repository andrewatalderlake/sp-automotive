import type { Metadata } from "next";
import Link from "next/link";
import PhoneCTA from "@/components/ui/PhoneCTA";
import SmsCTA from "@/components/ui/SmsCTA";
import FinalCTA from "@/components/cta/FinalCTA";
import SplitText from "@/components/effects/SplitText";
import RevealSection from "@/components/ui/RevealSection";
import ColorSwatchLibrary from "@/components/paint-work/ColorSwatchLibrary";
import { COLORS } from "@/components/paint-work/colors-data";
import { SITE_URL, SITE_NAME } from "@/lib/site";

const TITLE = "Paint work — booth-mixed, measured, documented";
const DESCRIPTION =
  "Color-matched to factory variant, layered to factory depth, every coat measured. Tri-coats, full repaints, carbon refresh, and custom livery work at SP Automotive in Sarasota.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/paint-work` },
  openGraph: {
    title: `${TITLE} — ${SITE_NAME}`,
    description: DESCRIPTION,
    images: ["/builds/urus-1016/kit.webp"],
  },
};

// Color families we work in. Concrete, not marketing — every entry maps to
// real paint chemistry the booth can handle. Sub-label is a representative
// example or the technique tag the family is known for.
const COLOR_FAMILIES = [
  { name: "Tri-coats & pearls", note: "Verde Mantis · Volcano Yellow" },
  { name: "OEM single-stage", note: "Solids, full coverage" },
  { name: "Frozen, matte & satin", note: "Frozen Brilliant, satin clears" },
  { name: "Custom liveries", note: "Two-tone, race-spec" },
  { name: "Color changes", note: "Inc. jambs and engine bay" },
  { name: "Carbon clear refresh", note: "UV-stable lacquer, weave-flat" },
  { name: "Trim & accent refinish", note: "Black-out trim, brake calipers" },
];

// The coat-stack diagram. Real film-thickness ranges for an exotic tri-coat
// repair. Surfaces the dry-film discipline claim as a visual, not a sentence.
const COAT_STACK = [
  { name: "Primer", thickness: "0.8 mil", role: "Adhesion" },
  { name: "Base", thickness: "1.5 mil", role: "Color" },
  { name: "Mid", thickness: "0.7 mil", role: "Pearl / candy" },
  { name: "Clear", thickness: "1.8 mil", role: "Depth" },
  { name: "Clear", thickness: "1.8 mil", role: "Gloss" },
];

function ServiceJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Exotic paint refinish and color match",
    description: DESCRIPTION,
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    serviceType: "Automotive paint refinishing and color matching",
    areaServed: "Sarasota, FL",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function PaintWorkPage() {
  return (
    <>
      <ServiceJsonLd />

      {/* HERO — warm dark. Stays on-brand with the workshop-cinema voice
          but pushes the cool ink toward a warm near-black with a strong
          orange wash spilling from the Papaya swatch side. Reads like a
          paint booth lit from above — keeps the chromatic energy that
          the cool ink + dark green swatch combination was missing. */}
      <RevealSection
        className="relative isolate overflow-hidden bg-ink px-6 md:px-10 pt-40 pb-24 md:pt-48 md:pb-32 border-b border-hairline"
        rootMargin="0px"
      >
        {/* Warm base tint — pushes cool ink (#0E0F11) toward a warm
            near-black with copper undertone. soft-light blend keeps it
            subtle so the typography still reads as bone-on-ink. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[#1a0f06] mix-blend-soft-light"
        />
        {/* Orange wash from the swatch side — strong enough to feel like
            light spilling off the chip into the canvas. Tuned to Papaya's
            hue so the spill reads as caused by the swatch, not decoration. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_45%,rgba(230,106,31,0.18),transparent_55%)]"
        />
        {/* Top/bottom vignette — anchors the hero so the wash doesn't
            bleed visually into the ledger section below. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink/70"
        />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-12 lg:gap-16 items-end">
            {/* Left column — eyebrow, headline, copy, spec row. */}
            <div>
              <p className="eyebrow reveal-up">{"// Refinish work"}</p>
              <SplitText
                as="h1"
                className="mt-4 display-lg text-bone"
                reveal="mount"
                mountDelayMs={200}
                staggerMs={28}
              >
                Color, matched.
              </SplitText>
              <p className="editorial mt-8 max-w-2xl text-bone/85 reveal-up">
                Booth-mixed. Variant-card tested on a hidden panel from the car
                itself. Layered to factory film depth with a dry-film gauge
                between coats. Every measurement goes on the repair record. If
                the panel ever needs to be touched again, the next painter sees
                exactly what we did.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 spec text-bone/55 reveal-up">
                <span>
                  <span className="text-bone/80 tabular-nums">
                    {String(COLOR_FAMILIES.length).padStart(2, "0")}
                  </span>{" "}
                  · color families
                </span>
                <span aria-hidden className="h-3 w-px bg-bone/15" />
                <span>variant-card tested</span>
                <span aria-hidden className="h-3 w-px bg-bone/15" />
                <span>dry-film verified</span>
              </div>
            </div>

            {/* Right column — featured pearl swatch. Renders with the same
                chip CSS treatment as the library wall so the hero visually
                previews what the page is selling. */}
            <div className="reveal-up">
              <div
                className="relative aspect-square w-full max-w-md mx-auto rounded-lg chip--pearl ring-1 ring-bone/15 shadow-[0_32px_72px_-24px_rgba(0,0,0,0.7)] overflow-hidden"
                style={
                  { "--chip-color": "#E66A1F" } as React.CSSProperties
                }
                role="img"
                aria-label="Featured pearl swatch — McLaren Papaya Spark"
              >
                <div className="pointer-events-none absolute top-4 right-4 spec text-[10px] uppercase tracking-[0.18em] text-bone/90 bg-ink/65 backdrop-blur-sm px-2.5 py-1 rounded">
                  {"// Featured · pearl"}
                </div>
                <div className="pointer-events-none absolute bottom-5 left-5 flex flex-col gap-1">
                  <p className="spec text-bone/85 tabular-nums">
                    McLaren · MSO-PS
                  </p>
                  <p className="font-display uppercase tracking-[0.04em] text-bone text-2xl md:text-3xl leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                    Papaya Spark
                  </p>
                  <p className="spec text-bone/75">
                    <span className="text-bone tabular-nums">4</span> factory
                    variants
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* COLOR FAMILIES LEDGER — numbered printed-spec rows on the left,
          documentation marginalia on the right at lg+. The marginalia
          callouts reinforce the evidentiary claims from the hero (gauge,
          variant card, repair record) and put the wide-canvas dead space
          to work. */}
      <RevealSection className="bg-ink px-6 md:px-10 py-20 md:py-28 border-b border-hairline">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-graphite reveal-up">{"// What we paint"}</p>
              <h2 className="mt-4 font-display uppercase tracking-[0.10em] text-bone leading-none text-3xl md:text-5xl reveal-up">
                Color families we handle.
              </h2>
            </div>
            <span className="spec text-graphite tabular-nums whitespace-nowrap reveal-up">
              {COLOR_FAMILIES.length} families
            </span>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 lg:gap-16">
            <ol className="reveal-up-stagger border-t border-hairline">
              {COLOR_FAMILIES.map((c, i) => (
                <li
                  key={c.name}
                  style={{ "--i": i } as React.CSSProperties}
                  className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-6 md:gap-x-8 border-b border-hairline py-5"
                >
                  <span className="font-display text-2xl md:text-3xl text-graphite tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-bone uppercase tracking-[0.04em] text-xl md:text-2xl">
                    {c.name}
                  </span>
                  <span className="spec text-bone/55 whitespace-nowrap text-right hidden md:inline">
                    {c.note}
                  </span>
                </li>
              ))}
            </ol>

            {/* Marginalia — documentation discipline callouts. Three
                evergreen claims that earn the dead canvas without
                duplicating the body copy elsewhere on the page. */}
            <aside className="reveal-up-stagger space-y-8 lg:pt-2">
              <div style={{ "--i": 0 } as React.CSSProperties}>
                <p className="eyebrow text-graphite">{"// Gauge"}</p>
                <p className="mt-3 text-sm text-bone/75 leading-relaxed">
                  Dry-film thickness measured between every coat. Each layer
                  verified within{" "}
                  <span className="spec text-bone tabular-nums">±0.2 mil</span>{" "}
                  of factory spec before the next goes on.
                </p>
              </div>
              <div style={{ "--i": 1 } as React.CSSProperties}>
                <p className="eyebrow text-graphite">{"// Variant card"}</p>
                <p className="mt-3 text-sm text-bone/75 leading-relaxed">
                  Test-spray on a hidden panel from the car itself &mdash; door
                  jamb, hood underside, or under-trunk lip. Never on a paint
                  card.
                </p>
              </div>
              <div style={{ "--i": 2 } as React.CSSProperties}>
                <p className="eyebrow text-graphite">{"// Record"}</p>
                <p className="mt-3 text-sm text-bone/75 leading-relaxed">
                  Booth conditions, mix ratio, layer thickness, gloss reading.
                  Every job logged. The next painter sees exactly what we did.
                </p>
              </div>
            </aside>
          </div>

          <p className="mt-12 max-w-2xl text-sm text-graphite reveal-up">
            If your color is a one-off PTS or build-sheet variant, call &mdash;
            we mix to the VIN, not the catalog code.
          </p>
        </div>
      </RevealSection>

      {/* THE LIBRARY — interactive color swatch wall. Tap a chip to see
          manufacturer code, factory variant count, family, and the
          one-line technical note. Replaces the generic "5 cars in a grid"
          treatment with something only a paint page could carry. */}
      <RevealSection className="relative bg-ink-deep px-6 md:px-10 py-20 md:py-28 border-b border-hairline">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-graphite reveal-up">{"// The library"}</p>
              <h2 className="mt-4 font-display uppercase tracking-[0.10em] text-bone leading-none text-3xl md:text-5xl reveal-up">
                Pick a color.
              </h2>
            </div>
            <span
              aria-hidden
              className="hidden md:block h-px w-32 bg-bone/20 reveal-line self-end mb-3"
            />
          </div>
          <p className="mt-6 max-w-2xl text-bone/85 reveal-up">
            A working slice of the exotic color shelf. Every entry is a real
            factory code — and every code is just the starting point. Tap a
            chip for the variant count and the technical handle we work it by.
          </p>

          <div className="mt-12 reveal-up">
            <ColorSwatchLibrary colors={COLORS} />
          </div>

          <p className="mt-10 max-w-2xl text-sm text-graphite reveal-up">
            Don&rsquo;t see yours? Text the code &mdash; PTS, MSO, Tailor Made,
            build-sheet variant, one-off commission. We mix to the VIN, not the
            catalog.
          </p>
        </div>
      </RevealSection>

      {/* HOW IT'S DOCUMENTED — paper-bg break with the coat-stack diagram
          as the visual centerpiece, copy below. */}
      <RevealSection className="bg-paper text-ink px-6 md:px-10 py-20 md:py-28 border-b border-ink/15">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-ink/55 reveal-up">
                {"// How it’s documented"}
              </p>
              <h2 className="mt-4 font-display uppercase tracking-[0.10em] text-ink leading-none text-3xl md:text-5xl reveal-up">
                Every coat measured.
              </h2>
            </div>
            <span className="spec text-ink/55 tabular-nums whitespace-nowrap reveal-up">
              5-coat stack · per-coat photo record
            </span>
          </div>

          {/* Coat-stack diagram. On md+, five horizontal blocks read left to
              right like a paint cross-section. On mobile, stacks vertically.
              Each block: Anton coat name, .spec thickness, ink/50 role line. */}
          <div className="reveal-up-stagger mt-12 grid grid-cols-1 md:grid-cols-5 gap-0 border-t border-b border-ink/15">
            {COAT_STACK.map((c, i) => (
              <div
                key={`${c.name}-${i}`}
                style={{ "--i": i } as React.CSSProperties}
                className="flex flex-col gap-2 px-5 py-6 border-b md:border-b-0 md:border-r border-ink/15 last:border-b-0 md:last:border-r-0"
              >
                <span className="spec text-ink/45 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display uppercase tracking-[0.08em] text-ink text-2xl leading-none">
                  {c.name}
                </span>
                <span className="spec text-ink/60 tabular-nums">
                  {c.thickness}
                </span>
                <span className="text-ink/55 text-xs uppercase tracking-[0.12em]">
                  {c.role}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mt-10 max-w-3xl">
            <p className="editorial text-ink/80 reveal-up">
              Mixing happens in-house, not at a third-party paint supplier. We
              pull the factory variant data — most exotic colors have three to
              seven approved variants accounting for batch drift — and test on a
              hidden panel from the car itself, never on a paint card.
            </p>
            <p className="editorial text-ink/80 reveal-up">
              Each step measured with a dry-film thickness gauge before the next
              coat goes on. Gloss reading is checked at the booth and again
              after the bake. Every measurement goes into the repair record so
              you can see what was sprayed and where.
            </p>
          </div>

          <div className="mt-10 pt-6 border-t border-ink/15 flex flex-wrap items-center gap-4">
            <PhoneCTA size="lg" theme="light" location="paint-work" />
            <SmsCTA theme="light" location="paint-work" />
            <Link
              href="/explainers/paint-match"
              className="link-underline text-sm uppercase tracking-[0.18em] text-ink/55 hover:text-ink transition-colors ml-auto"
            >
              Read the deep dive &rarr;
            </Link>
          </div>
        </div>
      </RevealSection>

      <FinalCTA />
    </>
  );
}
