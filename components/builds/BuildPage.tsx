import FinalCTA from "@/components/cta/FinalCTA";
import BuildHero from "./BuildHero";
import BuildSpecs from "./BuildSpecs";
import BeforeAfterCompare from "./BeforeAfterCompare";
import type { Build } from "./builds-data";

// Reusable composition for every featured-build page. One Build entry in
// builds-data.ts produces the full page; the dynamic route under
// app/builds/[slug]/page.tsx looks up the entry and renders this.

export default function BuildPage({ build }: { build: Build }) {
  return (
    <>
      <BuildHero build={build} />
      <section className="bg-ink px-6 md:px-10 pb-16 md:pb-20">
        <div className="max-w-6xl mx-auto">
          <BeforeAfterCompare
            stockImage={build.stockImage}
            kitImage={build.kitImage}
            alt={`${build.car} with ${build.kit}`}
          />
        </div>
      </section>
      <BuildSpecs build={build} />
      <FinalCTA />
    </>
  );
}
