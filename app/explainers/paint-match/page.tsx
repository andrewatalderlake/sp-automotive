import type { Metadata } from "next";
import Link from "next/link";
import PhoneCTA from "@/components/ui/PhoneCTA";
import SmsCTA from "@/components/ui/SmsCTA";
import FinalCTA from "@/components/cta/FinalCTA";
import { SITE_URL, SITE_NAME } from "@/lib/site";

const TITLE = "What factory paint match actually means";
const DESCRIPTION =
  "Color is the easy part. Matching the flake, the depth, the gloss, and the angle the light catches a tri-coat — that is the work. Here is how exotic paint match is done correctly.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/explainers/paint-match` },
};

function TechArticleJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: TITLE,
    description: DESCRIPTION,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/explainers/paint-match`,
    about: "Factory paint matching for exotic vehicles",
    proficiencyLevel: "Expert",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function PaintMatchExplainerPage() {
  return (
    <>
      <TechArticleJsonLd />
      <article className="bg-bg px-6 md:px-10 pt-40 pb-24 border-b border-divider">
        <div className="max-w-3xl mx-auto">
          <p className="eyebrow">Explainer · 02</p>
          <h1 className="mt-4 display-lg">{TITLE}</h1>
          <p className="editorial mt-8 max-w-2xl">{DESCRIPTION}</p>
        </div>
      </article>

      <section className="bg-bg px-6 md:px-10 py-24 md:py-32">
        <div className="max-w-3xl mx-auto">
          <div className="editorial max-w-[65ch] space-y-7">
            <p>
              Ask a body shop if they can match your paint and they will say yes. Color codes are
              public — you can pull a Rosso Mars or a Volcano Black or a Daytona Grey out of a
              database in thirty seconds. The reason they say yes is that they are answering a
              different question than the one you are asking.
            </p>
            <p>
              A factory paint match on an exotic is not a single number. It is four numbers.
              First, the base color — hue and saturation. Second, the metallic flake — particle
              size, density, orientation. Third, the layer thickness — how deep the color goes
              before clear coat starts. Fourth, the gloss reading — how the clear refracts at the
              angle you photograph the car. Get the first one and miss any of the other three and
              the repaired panel will read as &ldquo;close&rdquo; from one angle and obviously
              wrong from another.
            </p>
            <p>
              On a single-stage solid color this is hard. On a metallic basecoat-clearcoat it is
              harder. On a tri-coat — pearl, candy, or chameleon — it is a different job
              entirely, because the visible color depends on a translucent mid-coat sitting on top
              of a base. Lamborghini Verde Mantis, McLaren MSO Volcano Yellow, Audi Glacier White
              Pearl: all tri-coats. The mid-coat layer thickness changes the perceived color.
              Spray the mid-coat one mil too thick and the panel reads dark; one mil too thin and
              it reads pale. Both look obvious in sunlight.
            </p>

            <h2 className="font-display text-2xl md:text-3xl text-accent leading-[1.1] !mt-14 mb-3">
              How the factory does it
            </h2>
            <p>
              The car was originally painted in a climate-controlled booth, on a moving line, with
              the same gun, the same air pressure, the same flash time, and the same paint batch
              for every panel. That is a process you cannot fully reproduce after a collision —
              there is no &ldquo;same batch.&rdquo; Paint mixed today is not paint mixed in 2019.
              UV exposure has aged the original car&rsquo;s clear since the day it left the
              factory. Even on a one-year-old vehicle the panels you do not repaint have changed.
            </p>
            <p>
              So &ldquo;factory match&rdquo; in a body shop means: the new paint reads visually
              identical to the surrounding panels under shop light, daylight, and incandescent,
              from any reasonable viewing angle, with the same gloss reading and the same total
              film thickness as factory spec.
            </p>

            <h2 className="font-display text-2xl md:text-3xl text-accent leading-[1.1] !mt-14 mb-3">
              How we handle it
            </h2>
            <p>
              Mixing happens in-house, not at a third-party paint supplier. We start with the
              manufacturer&rsquo;s color code and pull current factory variant data — most exotic
              colors have three to seven approved variants accounting for batch drift over the
              model run. We test on a hidden panel from the car itself, never on a paint card.
              We check the result under three light sources and, on tri-coats, against a measured
              control sample at the booth&rsquo;s reference angle.
            </p>
            <p>
              Application is layered. <span className="spec">Primer · Base · Mid (tri-coat)
              · Clear · Clear</span> — each step measured with a dry-film thickness gauge before
              the next coat goes on. Final film thickness is verified against factory data at
              multiple points across the panel. The gloss reading is checked at the booth and
              again after the bake. Every measurement goes into the repair record so you can see
              what was sprayed and where.
            </p>
            <p>
              Tri-coats and candies get a per-coat photographic record because the visible result
              depends on the mid-coat thickness — once the clear is on, it is too late to know
              whether the mid was sprayed correctly. We document the booth conditions at the time
              of paint: temperature, humidity, gun pressure. If the panel ever needs to be touched
              again, the record tells the next painter exactly what was done.
            </p>
          </div>

          <div className="mt-16 pt-8 border-t border-divider flex flex-wrap items-center gap-4">
            <PhoneCTA size="lg" location="explainer-paint-match" />
            <SmsCTA location="explainer-paint-match" />
            <Link
              href="/faq#paint-match"
              className="link-underline text-sm uppercase tracking-[0.18em] text-muted hover:text-accent transition-colors ml-auto"
            >
              FAQ on paint &rarr;
            </Link>
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
