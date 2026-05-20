import type { Metadata } from "next";
import Link from "next/link";
import PhoneCTA from "@/components/ui/PhoneCTA";
import SmsCTA from "@/components/ui/SmsCTA";
import FinalCTA from "@/components/cta/FinalCTA";
import AmbientVideo from "@/components/effects/AmbientVideo";
import SplitText from "@/components/effects/SplitText";
import RevealSection from "@/components/ui/RevealSection";
import CarOrbit from "@/components/body-kits/CarOrbit";
import { BUILDS } from "@/components/builds/builds-data";
import { SITE_URL, SITE_NAME } from "@/lib/site";

const TITLE = "Body kits — mounted, painted, finished to spec";
const DESCRIPTION =
  "Forged-carbon widebody, factory paint match, no compromise on clearance or fitment. Body-kit installs at SP Automotive in Sarasota.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/body-kits` },
  openGraph: {
    title: `${TITLE} — ${SITE_NAME}`,
    description: DESCRIPTION,
    images: ["/builds/urus-1016/kit.webp"],
  },
};

// Kit-maker counts derived from BUILDS so the ledger stays in sync as new
// builds land. Sorted by count desc, then name asc, so the "biggest program"
// rows surface first — feels like an editorial ranking instead of a
// reference list.
const KIT_MAKERS = (() => {
  const counts = new Map<string, number>();
  for (const b of BUILDS) counts.set(b.kit, (counts.get(b.kit) ?? 0) + 1);
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
})();

// One card per marque. videoSrc points at a 5–8s 360 orbit clip in
// /public/body-kits/. Poster falls back to an existing build still so the
// card has something to render before the video buffers (and for
// reduced-motion users). `programs` is the .spec annotation overlay —
// the kit programs we've actually installed on the marque.
const MARQUES: Array<{
  name: string;
  videoSrc: string;
  poster: string;
  brandHref: string;
  alt: string;
  programs: string;
}> = [
  {
    name: "Lamborghini",
    videoSrc: "/body-kits/urus-orbit.mp4",
    poster: "/builds/urus-1016/kit.webp",
    brandHref: "/lamborghini-collision-repair-sarasota",
    alt: "Lamborghini Urus 360 orbit",
    programs: "1016 · Mansory · STO",
  },
  {
    name: "Ferrari",
    videoSrc: "/body-kits/ferrari-orbit.mp4",
    poster: "/builds/488-novitec/kit.webp",
    brandHref: "/ferrari-collision-repair-sarasota",
    alt: "Ferrari 488 360 orbit",
    programs: "Novitec N-Largo",
  },
  {
    name: "McLaren",
    videoSrc: "/body-kits/mclaren-orbit.mp4",
    poster: "/builds/720s-1016/kit.webp",
    brandHref: "/mclaren-collision-repair-sarasota",
    alt: "McLaren 720S 360 orbit",
    programs: "1016 widebody",
  },
  {
    name: "Porsche",
    videoSrc: "/body-kits/porsche-orbit.mp4",
    poster: "/builds/911-gt3rs-gmg/kit.webp",
    brandHref: "/porsche-collision-repair-sarasota",
    alt: "Porsche 911 360 orbit",
    programs: "GMG Racing track-spec",
  },
  {
    name: "Audi R8",
    videoSrc: "/body-kits/audi-r8-orbit.mp4",
    poster: "/builds/r8-libertywalk/kit.webp",
    brandHref: "/audi-r8-collision-repair-sarasota",
    alt: "Audi R8 360 orbit",
    programs: "Liberty Walk",
  },
];

function ServiceJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Body kit installation",
    description: DESCRIPTION,
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    serviceType: "Aftermarket aero installation and paint match",
    areaServed: "Sarasota, FL",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function BodyKitsPage() {
  return (
    <>
      <ServiceJsonLd />

      {/* HERO — ambient workshop loop under an edge-darkening gradient.
          SplitText reveals the headline; the eyebrow, intro, and spec
          counter fade up in sequence on mount via the IntersectionObserver
          inside RevealSection (fires immediately because the hero is above
          the fold). */}
      <RevealSection
        className="relative isolate overflow-hidden bg-ink px-6 md:px-10 pt-40 pb-24 md:pt-48 md:pb-32 border-b border-hairline"
        rootMargin="0px"
      >
        <AmbientVideo
          src="/chapter-clips/05-workshop.mp4"
          poster="/chapter-clips/05-workshop-poster.jpg"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/90 via-ink/60 to-ink/95"
        />

        <div className="relative z-10 mx-auto max-w-4xl">
          <p className="eyebrow reveal-up">// Aftermarket aero</p>
          <SplitText
            as="h1"
            className="mt-4 display-lg text-bone"
            reveal="mount"
            mountDelayMs={200}
            staggerMs={28}
          >
            Body kits.
          </SplitText>
          <p className="editorial mt-8 max-w-2xl text-bone/85 reveal-up">
            Forged carbon. Real install time. We seat the panels with no clearance
            compromise, blend the paint to factory-match depth, and verify badge
            fitment and wheel-arch geometry before the car leaves the booth. Every
            kit ships with documentation of what was changed and why.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 spec text-bone/55 reveal-up">
            <span>
              <span className="text-bone/80 tabular-nums">05</span> · marques
            </span>
            <span aria-hidden className="h-3 w-px bg-bone/15" />
            <span>
              <span className="text-bone/80 tabular-nums">
                {String(KIT_MAKERS.length).padStart(2, "0")}
              </span>{" "}
              · kit programs
            </span>
            <span aria-hidden className="h-3 w-px bg-bone/15" />
            <span>
              <span className="text-bone/80 tabular-nums">~3</span> · weeks median
              install
            </span>
          </div>
        </div>
      </RevealSection>

      {/* KIT MAKERS LEDGER — printed-spec list, numbered, hairline-ruled,
          right-column build count. Each row reveals with a stagger. */}
      <RevealSection className="bg-ink px-6 md:px-10 py-20 md:py-28 border-b border-hairline">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-graphite reveal-up">// What we install</p>
              <h2 className="mt-4 font-display uppercase tracking-[0.10em] text-bone leading-none text-3xl md:text-5xl reveal-up">
                Kit makers we&rsquo;ve installed.
              </h2>
            </div>
            <span className="spec text-graphite tabular-nums whitespace-nowrap reveal-up">
              {KIT_MAKERS.length} programs · {BUILDS.length} builds
            </span>
          </div>

          <ol className="reveal-up-stagger mt-10 border-t border-hairline">
            {KIT_MAKERS.map((k, i) => (
              <li
                key={k.name}
                style={{ "--i": i } as React.CSSProperties}
                className="flex items-baseline justify-between gap-6 border-b border-hairline py-5"
              >
                <div className="flex items-baseline gap-6 md:gap-8">
                  <span className="font-display text-2xl md:text-3xl text-graphite tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-bone uppercase tracking-[0.04em] text-xl md:text-2xl">
                    {k.name}
                  </span>
                </div>
                <span className="spec text-bone/55 tabular-nums whitespace-nowrap">
                  {k.count} {k.count === 1 ? "build" : "builds"}
                </span>
              </li>
            ))}
          </ol>

          <p className="mt-10 max-w-2xl text-sm text-graphite reveal-up">
            If your kit isn&rsquo;t listed, call. We&rsquo;ve installed one-off
            commissions and short-run programs the catalog brands don&rsquo;t list.
          </p>
        </div>
      </RevealSection>

      {/* BY MARQUE GRID — orbit cards with a kit-program annotation overlay
          and a hairline connector that draws across the row on reveal
          (HowItWorks pattern). */}
      <RevealSection className="relative bg-ink-deep px-6 md:px-10 py-20 md:py-28 border-b border-hairline">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-graphite reveal-up">// 05 marques</p>
              <h2 className="mt-4 font-display uppercase tracking-[0.10em] text-bone leading-none text-3xl md:text-5xl reveal-up">
                Drag to spin.
              </h2>
            </div>
            <span
              aria-hidden
              className="hidden md:block h-px w-32 bg-bone/20 reveal-line self-end mb-3"
            />
          </div>
          <p className="mt-6 max-w-2xl text-bone/85 reveal-up">
            Each marque, photographed in studio. Drag a card to rotate the car a
            full 360°.
          </p>

          <div className="relative mt-12">
            <div className="reveal-up-stagger relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MARQUES.map((m, i) => (
                <article
                  key={m.name}
                  style={{ "--i": i } as React.CSSProperties}
                  className="group flex flex-col gap-4 transition duration-300 motion-safe:hover:-translate-y-1"
                >
                  <div className="relative">
                    <CarOrbit src={m.videoSrc} poster={m.poster} alt={m.alt} />
                    {/* Kit-program annotation pinned to the top-left of the
                        card. Same .spec mono treatment as the rest of the
                        site's technical callouts. */}
                    <div className="pointer-events-none absolute top-3 left-3 z-10 spec text-[10px] uppercase tracking-[0.18em] text-bone/90 bg-ink/70 backdrop-blur-sm px-2.5 py-1 rounded">
                      // {m.programs}
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between gap-3 px-1">
                    <h3 className="font-display uppercase tracking-[0.08em] text-bone text-xl md:text-2xl">
                      {m.name}
                    </h3>
                    <Link
                      href={m.brandHref}
                      className="link-underline text-xs uppercase tracking-[0.18em] text-graphite hover:text-bone transition-colors whitespace-nowrap"
                    >
                      Brand &rarr;
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </RevealSection>

      {/* QUOTE CTA */}
      <RevealSection className="bg-ink px-6 md:px-10 py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display uppercase tracking-[0.10em] text-bone leading-none text-3xl md:text-5xl reveal-up">
            Quoting a kit?
          </h2>
          <p className="editorial mt-6 max-w-2xl text-bone/85 reveal-up">
            Send three photos of the car as it sits and the kit you&rsquo;re
            considering. We come back with a number, install time, and a
            paint-match plan within the week.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4 reveal-up">
            <PhoneCTA size="lg" location="body-kits" />
            <SmsCTA location="body-kits" />
            <Link
              href="/estimate"
              className="link-underline text-sm uppercase tracking-[0.18em] text-graphite hover:text-bone transition-colors ml-auto"
            >
              Send 3 photos &rarr;
            </Link>
          </div>
        </div>
      </RevealSection>

      <FinalCTA />
    </>
  );
}
