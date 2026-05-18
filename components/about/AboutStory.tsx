// Owner-letter voice — the bio is written in second person, addressed to the
// owner who just crashed. Editorial layout: asymmetric image/text blocks
// with an oversized thesis line set as its own display heading. Image slots
// render placeholders until real photos land in /public/about/.

import { EditorialGrid, EditorialItem } from "@/components/editorial/EditorialGrid";
import EditorialImageSlot from "@/components/editorial/EditorialImageSlot";

export default function AboutStory() {
  return (
    <section className="bg-ink px-6 md:px-10 py-24 md:py-32">
      <div className="max-w-7xl mx-auto">
        <EditorialGrid rhythm="loose">
          {/* Header — single column, anchored left of the 12-col grid. */}
          <EditorialItem start={1} span={8}>
            <p className="eyebrow">A note from Serge</p>
            <h2 className="mt-4 display-md">You called the right shop.</h2>
          </EditorialItem>

          {/* Block 1 — text left (cols 1–6), image right (cols 8–12).
              Insurance angle + credentials + mission. */}
          <EditorialItem start={1} span={6}>
            <div className="editorial space-y-7 max-w-[55ch]">
              <p>
                Your insurance company is going to push you toward the cheapest body shop on their
                list. I&apos;m not on that list. There&apos;s a reason for that — and it&apos;s the
                same reason you ended up here.
              </p>
              <p>
                I&apos;ve spent the last 4 years restoring exotics for private collectors in
                the Sarasota area. Cars come to me after the bigger shops give up — Aventadors
                with misaligned clamshells, McLarens with carbon-tub damage the dealer
                wouldn&apos;t touch, R8 V10s that needed paint matched in a booth that
                didn&apos;t exist within a three-hour drive. I learned what factory-correct
                actually means by being told &ldquo;close enough&rdquo; and refusing it.
              </p>
              <p>
                SP Automotive exists because every Lamborghini, every McLaren, every R8, every BMW M
                deserves to come back exactly the way it left the factory. Most shops can&apos;t
                deliver that. Some don&apos;t even try.
              </p>
            </div>
          </EditorialItem>
          <EditorialItem start={8} span={5}>
            <EditorialImageSlot
              src="/about/lambo-front.webp"
              alt="Lamborghini Huracán in the SP Automotive service bay"
              aspectClass="aspect-[4/5]"
              placeholderLabel="Bay photo — pending"
            />
          </EditorialItem>

          {/* Thesis — oversized, intentional line breaks; no border, no choke.
              Each phrase claims its own line by design. */}
          <EditorialItem start={1} span={12}>
            <figure className="my-8 md:my-16">
              <p className="display-md">
                <span className="block">Forensic intake.</span>
                <span className="block">Factory-spec process.</span>
                <span className="block">One signature — mine.</span>
              </p>
              <figcaption className="mt-8 text-[10px] uppercase tracking-[0.3em] text-graphite">
                — Serge
              </figcaption>
            </figure>
          </EditorialItem>

          {/* Process block — image left (cols 1–4), text right (cols 6–12).
              Single condensed pass over intake → strip → paint → reassembly. */}
          <EditorialItem start={1} span={4}>
            <EditorialImageSlot
              src="/about/intake-walkthrough.webp"
              alt="White Porsche Cayman GT4 in the SP Automotive service bay"
              aspectClass="aspect-[3/4]"
              placeholderLabel="Intake — pending"
            />
          </EditorialItem>
          <EditorialItem start={6} span={7} className="self-center">
            <div className="editorial space-y-7 max-w-[55ch]">
              <p>
                When your car comes in I walk through it with you — every panel, every gap,
                photographed and measured. Then I strip it down so I can see what the estimate
                missed: frame stress, hidden fractures, misalignment.
              </p>
              <p>
                Paint goes on in layers, mixed to factory color codes. Reassembly is to
                torque-spec, every gap checked against the data.
              </p>
              <p>
                The car doesn&apos;t leave until it&apos;s right. Warranty signed by me — not a
                subcontractor.
              </p>
            </div>
          </EditorialItem>
        </EditorialGrid>
      </div>
    </section>
  );
}
