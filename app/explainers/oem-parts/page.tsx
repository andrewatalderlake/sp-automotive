import type { Metadata } from "next";
import Link from "next/link";
import PhoneCTA from "@/components/ui/PhoneCTA";
import SmsCTA from "@/components/ui/SmsCTA";
import FinalCTA from "@/components/cta/FinalCTA";
import { SITE_URL, SITE_NAME } from "@/lib/site";

const TITLE = "OEM parts — and why aftermarket fails on exotics";
const DESCRIPTION =
  "An aftermarket fender on a Camry will fit. An aftermarket clamshell on an Aventador will not. The reason has nothing to do with brand loyalty and everything to do with how these cars are built.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/explainers/oem-parts` },
};

function TechArticleJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: TITLE,
    description: DESCRIPTION,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/explainers/oem-parts`,
    about: "Original equipment manufacturer parts policy for exotic collision repair",
    proficiencyLevel: "Expert",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function OemPartsExplainerPage() {
  return (
    <>
      <TechArticleJsonLd />
      <article className="bg-bg px-6 md:px-10 pt-40 pb-24 border-b border-divider">
        <div className="max-w-3xl mx-auto">
          <p className="eyebrow">Explainer · 03</p>
          <h1 className="mt-4 display-lg">{TITLE}</h1>
          <p className="editorial mt-8 max-w-2xl">{DESCRIPTION}</p>
        </div>
      </article>

      <section className="bg-bg px-6 md:px-10 py-24 md:py-32">
        <div className="max-w-3xl mx-auto">
          <div className="editorial max-w-[65ch] space-y-7">
            <p>
              Three categories of replacement panel exist after a collision.{" "}
              <span className="spec">OEM</span> — original equipment manufacturer — is the panel
              the car was built with, sourced from the manufacturer&rsquo;s parts depot.{" "}
              <span className="spec">Aftermarket</span> is a copy made by a third-party producer,
              often offshore, often reverse-engineered from a measured sample.{" "}
              <span className="spec">LKQ</span> is a salvage panel pulled from another car of the
              same make and model. On commodity vehicles, all three options can produce a
              defensible repair. On an exotic, only one of them does.
            </p>
            <p>
              The reason is geometry. Body panels on a Lamborghini, McLaren, or Audi R8 are not
              stamped from low-tensile steel like a sedan&rsquo;s fender. They are formed from
              aluminum alloys, structural composites, or carbon-fiber sandwich at gauges and
              tolerances that the original tooling holds to within fractions of a millimeter. The
              factory gap between the front clamshell and the doorline of an Aventador is held
              tighter than most production cars hold their bumper-to-headlight gap. An
              aftermarket clamshell — even a good one — is reverse-engineered from a measured
              copy and will be off by enough to destroy that gap.
            </p>

            <h2 className="font-display text-2xl md:text-3xl text-accent leading-[1.1] !mt-14 mb-3">
              The composite problem
            </h2>
            <p>
              Carbon fiber is not aluminum and is not steel. It is a layered composite — woven
              cloth set in resin, cured under heat and pressure to a specific cure schedule. The
              factory part is laid up by a process the manufacturer documents and validates. An
              aftermarket carbon part might be the same shape, but the layup orientation, the
              resin system, and the cure cycle are unknown. Under load it will fail differently
              than the factory panel. Under paint, the surface texture telegraphs the weave
              differently. Under sun, it ages differently.
            </p>
            <p>
              The same applies to aluminum panels with structural roles. A door skin on an
              R8 is bonded and rivet-bonded to an inner aluminum frame using a manufacturer-spec
              adhesive cured under controlled temperature. An aftermarket skin may be the wrong
              alloy. The bond may not hold. You will not know until the next collision tests it.
            </p>

            <h2 className="font-display text-2xl md:text-3xl text-accent leading-[1.1] !mt-14 mb-3">
              Why insurance pushes back
            </h2>
            <p>
              An OEM Aventador front fender lists at several thousand dollars. An aftermarket
              equivalent — when one exists — is a fraction of that. Insurance carriers, especially
              on direct-repair-program shops, push hard for aftermarket whenever the policy
              allows. The shop accepts because their margin survives. You accept because you do
              not know there is a difference.
            </p>
            <p>
              The Magnuson-Moss Warranty Act and most state-level statutes give you the right to
              insist on OEM where the car&rsquo;s warranty or manufacturer specification calls
              for it. On most exotics it does. We help you write that case to the carrier when
              the carrier resists.
            </p>

            <h2 className="font-display text-2xl md:text-3xl text-accent leading-[1.1] !mt-14 mb-3">
              How we handle it
            </h2>
            <p>
              OEM only, end of policy. We order through the manufacturer&rsquo;s parts depot —
              direct from Lamborghini, McLaren, Audi, BMW, or the appropriate authorized supplier.
              Lead times are quoted to you up front so you know whether a part is in stock in the
              United States or coming from Italy. If a part is genuinely unavailable — which is
              rare on cars under fifteen years old — we tell you the options before we order
              anything. We do not sub aftermarket without written approval from you, and we do
              not pretend an aftermarket panel is equivalent.
            </p>
            <p>
              Every part installed gets logged in the repair record with its OEM part number.
              When you sell the car, that record is what tells the next owner the repair was
              done correctly.
            </p>
          </div>

          <div className="mt-16 pt-8 border-t border-divider flex flex-wrap items-center gap-4">
            <PhoneCTA size="lg" location="explainer-oem-parts" />
            <SmsCTA location="explainer-oem-parts" />
            <Link
              href="/faq#oem-parts"
              className="link-underline text-sm uppercase tracking-[0.18em] text-muted hover:text-accent transition-colors ml-auto"
            >
              FAQ on parts &rarr;
            </Link>
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
