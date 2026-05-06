// Owner-letter voice — the bio is written in second person, addressed to the
// owner who just crashed. Editorial layout: asymmetric image/text blocks
// with one pull-quote at the thesis line. Image slots render placeholders
// until real photos land in /public/about/.

import { EditorialGrid, EditorialItem } from "@/components/editorial/EditorialGrid";
import EditorialImageSlot from "@/components/editorial/EditorialImageSlot";
import PullQuote from "@/components/editorial/PullQuote";

export default function AboutStory() {
  return (
    <section className="bg-bg px-6 md:px-10 py-24 md:py-32 border-t border-divider">
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
                I&apos;ve spent the last decade restoring exotics for private collectors across
                Florida. Cars came to me after the bigger shops gave up — Aventadors with
                misaligned clamshells, McLarens with carbon-tub damage the dealer wouldn&apos;t touch,
                R8 V10s that needed paint matched in a booth that didn&apos;t exist within a
                three-hour drive. I learned what factory-correct actually means by being told
                &ldquo;close enough&rdquo; and refusing it.
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
              src="/about/serge-booth.webp"
              alt="Serge in the paint booth"
              aspectClass="aspect-[4/5]"
              placeholderLabel="Booth portrait — pending"
            />
          </EditorialItem>

          {/* Pull-quote — the thesis line, set off as a magazine pull. */}
          <EditorialItem start={2} span={9}>
            <PullQuote attribution="— Serge">
              Forensic intake. Factory-spec process. One signature on every job — mine.
            </PullQuote>
          </EditorialItem>

          {/* Block 2 — image left (cols 1–4), text right (cols 6–12).
              Intake → strip. */}
          <EditorialItem start={1} span={4}>
            <EditorialImageSlot
              src="/about/intake-walkthrough.webp"
              alt="Serge documenting damage during forensic intake"
              aspectClass="aspect-[3/4]"
              placeholderLabel="Intake — pending"
            />
          </EditorialItem>
          <EditorialItem start={6} span={7}>
            <div className="editorial space-y-7 max-w-[55ch]">
              <p>
                Here&apos;s how it works when you bring me your car. We document everything in the
                first walkthrough — every panel, every gap, every component, photographed and
                measured. Your insurance adjuster gets a report they can defend. You get clarity
                on what your car actually needs.
              </p>
              <p>
                Then we strip it. Every panel comes off. We see what insurance estimates miss —
                frame stress, hidden fractures, suspension misalignment, the things only
                disassembly reveals. The plan changes if it has to. We tell you when it does.
              </p>
            </div>
          </EditorialItem>

          {/* Block 3 — text left (cols 1–7), image right (cols 9–12).
              Paint + reassembly. */}
          <EditorialItem start={1} span={7}>
            <div className="editorial space-y-7 max-w-[55ch]">
              <p>
                Paint is mixed in a booth that runs the same codes the factory uses. Same primer
                process. Same clear coat depth. Same gloss. Layered — not sprayed — so the only way
                to tell your car was ever damaged is the carfax. We can help with that too.
              </p>
              <p>
                Reassembly is to torque-spec. Every gap measured against factory data. Every
                alignment verified. The car doesn&apos;t leave my shop until it&apos;s right.
              </p>
            </div>
          </EditorialItem>
          <EditorialItem start={9} span={4}>
            <EditorialImageSlot
              src="/about/booth-detail.webp"
              alt="Paint booth detail"
              aspectClass="aspect-[3/4]"
              placeholderLabel="Booth detail — pending"
            />
          </EditorialItem>

          {/* Block 4 — closing. Inset slightly from the left for emphasis. */}
          <EditorialItem start={2} span={9}>
            <div className="editorial space-y-7 max-w-[60ch]">
              <p>
                No subcontractors. No shortcuts. No surprises on the invoice. When you pick up your
                car, you get a complete restoration record and a written warranty backed by the
                person who did the work.
              </p>
              <p className="text-text">
                Your car is more than transportation. It&apos;s a build. I treat it that way.
              </p>
            </div>
          </EditorialItem>

          {/* Models grid — full width, anchored to the start column. */}
          <EditorialItem start={1} span={9}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl">
              {["Lamborghini", "McLaren", "Audi R8", "BMW M", "Ferrari", "Porsche"].map((m) => (
                <div key={m} className="border border-white/10 px-4 py-3 text-sm text-text/85">
                  {m}
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted">
              If you don&apos;t see your model — call. We&apos;ve worked on cars older than this list.
            </p>
          </EditorialItem>
        </EditorialGrid>
      </div>
    </section>
  );
}
