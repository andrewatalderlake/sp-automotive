import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Surface from "@/components/ui/Surface";
import FinalCTA from "@/components/cta/FinalCTA";
import { BUILDS } from "@/components/builds/builds-data";
import { SITE_NAME } from "@/lib/site";

// Builds index — grid of every entry in BUILDS. Card pattern mirrors the
// FeaturedBuilds thumbnails on the homepage so this page reads as the
// expanded version of that block.

export const metadata: Metadata = {
  title: "All Builds",
  description:
    "Every body-kit transformation completed at SP Automotive — Lamborghini, McLaren, Porsche, Audi R8, BMW M, and more. Custom widebody installs, factory paint matching, no compromises.",
  openGraph: {
    title: `All Builds — ${SITE_NAME}`,
    description:
      "Every body-kit transformation completed at SP Automotive — Lamborghini, McLaren, Porsche, Audi R8, BMW M, and more.",
    images: ["/builds/urus-1016/kit.webp"],
  },
};

export default function BuildsIndexPage() {
  return (
    <>
      <section className="relative w-full px-6 pt-40 pb-20 md:px-10 md:pt-48 md:pb-28">
        <div className="relative z-10 mx-auto max-w-7xl">
          <p className="font-display uppercase tracking-[0.18em] text-graphite text-sm">
            {"// Selected work"}
          </p>
          <h1 className="mt-4 display-lg leading-[1.02] text-bone">
            Every build that left the shop.
          </h1>
          <p className="mt-8 lead max-w-3xl text-bone/85">
            Body-kit conversions for the cars people don&apos;t bring to the
            average shop. Hand-laid forged carbon, factory paint match, no
            clearance compromises. Each build below was photographed in the
            booth before pickup.
          </p>
        </div>
      </section>

      <section className="relative w-full px-6 pb-32 md:px-10 md:pb-40">
        <ul className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {BUILDS.map((build) => (
            <li key={build.slug}>
              <Surface
                variant="glass"
                className="group relative h-full overflow-hidden rounded-2xl p-0"
              >
                <Link
                  href={`/builds/${build.slug}`}
                  data-cursor="View"
                  className="flex h-full flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-bone focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                >
                  <div className="relative aspect-[16/10] w-full bg-ink">
                    <Image
                      src={build.kitImage}
                      alt={`${build.car} with ${build.kit} kit`}
                      fill
                      sizes="(min-width: 1024px) 25rem, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6 md:p-7">
                    <p className="eyebrow text-graphite">{build.kit}</p>
                    <h2 className="mt-2 font-display text-bone text-xl md:text-2xl leading-tight">
                      {build.car}
                    </h2>
                    <p className="mt-3 text-bone/85 text-sm leading-snug line-clamp-3">
                      {build.description}
                    </p>
                    <p className="mt-auto pt-6 text-bone uppercase tracking-[0.18em] text-xs">
                      View build →
                    </p>
                  </div>
                </Link>
              </Surface>
            </li>
          ))}
        </ul>
      </section>

      <FinalCTA />
    </>
  );
}
