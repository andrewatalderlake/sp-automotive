import type { Metadata } from "next";
import Link from "next/link";
import PhoneCTA from "@/components/ui/PhoneCTA";
import SmsCTA from "@/components/ui/SmsCTA";
import FinalCTA from "@/components/cta/FinalCTA";
import { SITE_URL, SITE_NAME } from "@/lib/site";

const TITLE = "ADAS recalibration on exotics";
const DESCRIPTION =
  "Adaptive cruise, lane-keep, automatic braking, blind-spot, surround-view — every camera and radar sensor on a modern exotic has to be recalibrated after a collision. Here is what that actually involves and why most shops outsource it.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/explainers/adas` },
};

function TechArticleJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: TITLE,
    description: DESCRIPTION,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/explainers/adas`,
    about: "Advanced Driver Assistance Systems calibration",
    proficiencyLevel: "Expert",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function AdasExplainerPage() {
  return (
    <>
      <TechArticleJsonLd />
      <article className="bg-bg px-6 md:px-10 pt-40 pb-24 border-b border-divider">
        <div className="max-w-3xl mx-auto">
          <p className="eyebrow">Explainer · 01</p>
          <h1 className="mt-4 display-lg">{TITLE}</h1>
          <p className="editorial mt-8 max-w-2xl">{DESCRIPTION}</p>
        </div>
      </article>

      <section className="bg-bg px-6 md:px-10 py-24 md:py-32">
        <div className="max-w-3xl mx-auto">
          <div className="editorial max-w-[65ch] space-y-7">
            <p>
              Every Lamborghini, McLaren, Audi R8, and BMW M built in the last decade carries a
              suite of Advanced Driver Assistance Systems — ADAS — that depend on a handful of
              precisely-aimed cameras, radar units, and ultrasonic sensors. Adaptive cruise watches
              the car ahead. Automatic emergency braking decides when to intervene. Lane-keep
              corrects steering. Blind-spot monitoring lights up the mirror. Surround-view
              stitches four cameras into a top-down image. Every one of those features depends on
              a sensor pointed exactly where the factory aimed it.
            </p>
            <p>
              When you crash one of these cars, the sensors move. Even a low-speed bumper hit
              shifts the radar inside the front fascia by a fraction of a degree — enough that
              adaptive cruise will read a lane line as a vehicle, or the AEB will brake at a
              shadow. Replace a windshield and the camera mounted behind it has to be
              re-aimed against a target board calibrated to the car&rsquo;s ride height. Replace a
              quarter panel and the rear corner radar comes off with it.
            </p>
            <p>
              The work splits into two kinds of calibration. <span className="spec">Static</span>{" "}
              calibration is done in the shop, indoors, with the car perfectly level and a
              manufacturer-specified target board placed at a measured distance and height.{" "}
              <span className="spec">Dynamic</span> calibration is done on the road — the car has
              to be driven for a defined distance at a defined speed range while the sensor
              acquires real-world data. Both are required on most exotics. Skip either and the
              system either disables itself with a warning lamp or — worse — reports clean to the
              dash while reading the world wrong.
            </p>

            <h2 className="font-display text-2xl md:text-3xl text-accent leading-[1.1] !mt-14 mb-3">
              Why this is harder on an exotic
            </h2>
            <p>
              A 2018 Toyota and a 2024 Aventador both have ADAS. Calibrating the Toyota is a
              two-hour job a generalist shop can do with an aftermarket scan tool. Calibrating the
              Aventador requires <span className="spec">Lamborghini Diagnostic Tester</span>{" "}
              software, an air-suspension load procedure to set ride height, and a target sequence
              that runs differently than the same brand&rsquo;s urus. The McLaren equivalent
              uses MDS, the BMW uses ISTA, the Audi uses ODIS — and every one of them gets
              software updates that change the procedure mid-model-year.
            </p>
            <p>
              Most network body shops do not own these tools. They sub the calibration out to a
              mobile ADAS company, who shows up with a target board, runs the procedure in the
              parking lot, and bills the shop. The car may sit a week waiting for that
              appointment. The mobile tech, working in a windy lot in Florida sunlight, may not
              hit the precision the indoor procedure demands. The body shop has no way to verify
              the result because they do not own the software.
            </p>

            <h2 className="font-display text-2xl md:text-3xl text-accent leading-[1.1] !mt-14 mb-3">
              How we handle it
            </h2>
            <p>
              Every ADAS-equipped car gets a pre-scan the day it arrives — every fault code, every
              calibration status, written into the intake record. After repair, every affected
              sensor is recalibrated on premises with the manufacturer&rsquo;s scan tool. The car
              is leveled, the ride height is verified, the target is placed to manufacturer spec,
              the procedure runs, the result is documented. Where dynamic calibration is required
              we drive the route and confirm completion against the scan log. The car does not
              leave with a warning lamp. It does not leave with a cleared code that will return.
            </p>
            <p>
              You get the pre-scan report and the post-repair calibration record at delivery. If
              your insurance company decides to argue the line item later, that paper trail is
              what protects you.
            </p>
          </div>

          <div className="mt-16 pt-8 border-t border-divider flex flex-wrap items-center gap-4">
            <PhoneCTA size="lg" location="explainer-adas" />
            <SmsCTA location="explainer-adas" />
            <Link
              href="/faq#adas"
              className="link-underline text-sm uppercase tracking-[0.18em] text-muted hover:text-accent transition-colors ml-auto"
            >
              FAQ on ADAS &rarr;
            </Link>
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
