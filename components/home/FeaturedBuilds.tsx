"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import Surface from "@/components/ui/Surface";
import { BUILDS } from "@/components/builds/builds-data";

// SELECTED WORK — 1+3 builds grid, Lambo-style. Utility section with a
// `// Selected work` callout-style label instead of a proper section
// label, since this slot sits between numbered sections and shouldn't
// compete with them. Data pulled from the existing BUILDS array.
//
// Hero pick: urus-1016 (recognizable Lambo flagship).
// Thumbnails: huracan-mansory, r8-libertywalk, g-wagon-brabus (variety
// across brands).

const HERO_SLUG = "urus-1016";
const THUMB_SLUGS = ["huracan-mansory", "r8-libertywalk", "g-wagon-brabus"];

export default function FeaturedBuilds() {
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

  const hero = BUILDS.find((b) => b.slug === HERO_SLUG);
  const thumbs = THUMB_SLUGS
    .map((slug) => BUILDS.find((b) => b.slug === slug))
    .filter((b): b is NonNullable<typeof b> => Boolean(b));

  if (!hero) return null;

  return (
    <section
      ref={sectionRef}
      id="work"
      aria-labelledby="featured-builds-heading"
      className="featured-builds relative w-full overflow-hidden bg-paper text-ink px-6 py-20 md:px-10 md:py-28"
    >
      {/* Header row: tracked-uppercase label + headline + all-builds link. */}
      <div className="relative z-10 mx-auto max-w-7xl">
        <p className="font-display uppercase tracking-[0.18em] text-graphite text-sm">
          {"// Selected work"}
        </p>
        <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
          <h2
            id="featured-builds-heading"
            className="display-md leading-[1.05] text-ink"
          >
            Built where it broke.
          </h2>
          <Link
            href="/builds"
            data-cursor="View"
            className="link-underline shrink-0 text-ink uppercase tracking-[0.18em] text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          >
            View all builds →
          </Link>
        </div>
      </div>

      {/* Hero featured build card. Edge-bleed image with overlay copy.
          Hover: kit image (default) crossfades to reveal the stock image
          underneath, plus a subtle card lift. Tells the brand promise
          ("here's what we made of it / here's what we started with") inside
          the card itself. Reduced-motion users get the kit image only. */}
      <div
        className="featured-builds__card relative z-10 mx-auto mt-12 max-w-7xl md:mt-16"
        style={{ "--i": 0 } as React.CSSProperties}
      >
        <Surface
          variant="light"
          className="group relative overflow-hidden rounded-2xl p-0 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_36px_80px_-30px_rgba(14,15,17,0.4)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          <Link
            href={`/builds/${hero.slug}`}
            data-cursor="View"
            className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          >
            <div className="relative aspect-[16/10] w-full bg-ink md:aspect-[21/9]">
              {/* Stock — bottom layer, revealed when the kit fades. */}
              <Image
                src={hero.stockImage}
                alt={hero.car}
                fill
                sizes="(min-width: 1024px) 80rem, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
              />
              {/* Kit — top layer, fades out on hover. */}
              <Image
                src={hero.kitImage}
                alt={`${hero.car} with ${hero.kit} kit`}
                fill
                sizes="(min-width: 1024px) 80rem, 100vw"
                className="object-cover transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.02] group-hover:opacity-0 motion-reduce:transition-none motion-reduce:group-hover:opacity-100"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/45 to-transparent"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-ink/55 to-transparent"
              />
              <div className="absolute inset-x-6 bottom-6 md:inset-x-12 md:bottom-12 max-w-3xl">
                <p className="eyebrow text-bone/70">{hero.eyebrow}</p>
                <h3 className="mt-3 font-display text-bone text-3xl md:text-5xl leading-tight tracking-[-0.01em]">
                  {hero.title}
                </h3>
                <p className="mt-4 max-w-prose text-bone/85 text-sm md:text-base leading-snug line-clamp-3">
                  {hero.description}
                </p>
                <p className="mt-6 inline-flex items-center gap-2 text-bone uppercase tracking-[0.18em] text-xs md:text-sm">
                  View build →
                </p>
              </div>
            </div>
          </Link>
        </Surface>
      </div>

      {/* Thumbnail row: 3 cards. */}
      <ul className="relative z-10 mx-auto mt-6 grid max-w-7xl grid-cols-1 gap-6 md:mt-6 md:grid-cols-3">
        {thumbs.map((build, i) => (
          <li
            key={build.slug}
            className="featured-builds__card"
            style={{ "--i": i + 1 } as React.CSSProperties}
          >
            <Surface
              variant="light"
              className="group relative h-full overflow-hidden rounded-2xl p-0 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_36px_60px_-30px_rgba(14,15,17,0.4)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <Link
                href={`/builds/${build.slug}`}
                data-cursor="View"
                className="flex h-full flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              >
                <div className="relative aspect-[16/10] w-full bg-ink">
                  {/* Stock — bottom layer, revealed when the kit fades. */}
                  <Image
                    src={build.stockImage}
                    alt={build.car}
                    fill
                    sizes="(min-width: 1024px) 25rem, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
                  />
                  {/* Kit — top layer, fades out on hover. */}
                  <Image
                    src={build.kitImage}
                    alt={`${build.car} with ${build.kit} kit`}
                    fill
                    sizes="(min-width: 1024px) 25rem, 100vw"
                    className="object-cover transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.03] group-hover:opacity-0 motion-reduce:transition-none motion-reduce:group-hover:opacity-100"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-7">
                  <p className="eyebrow text-graphite">{build.kit}</p>
                  <h3 className="mt-2 font-display text-ink text-xl md:text-2xl leading-tight">
                    {build.car}
                  </h3>
                  <p className="mt-auto pt-6 text-ink uppercase tracking-[0.18em] text-xs">
                    View build →
                  </p>
                </div>
              </Link>
            </Surface>
          </li>
        ))}
      </ul>

      <style jsx>{`
        :global(.featured-builds__card) {
          opacity: 0;
          transform: translateY(18px);
          transition:
            opacity var(--motion-shutter, 600ms)
              cubic-bezier(0.83, 0, 0.17, 1),
            transform var(--motion-shutter, 600ms)
              cubic-bezier(0.83, 0, 0.17, 1);
          transition-delay: calc(240ms + var(--i) * 90ms);
        }
        :global(.featured-builds[data-revealed="1"] .featured-builds__card) {
          opacity: 1;
          transform: translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
          :global(.featured-builds__card) {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
