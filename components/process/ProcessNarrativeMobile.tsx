"use client";
import { motion } from "framer-motion";
import { BEATS, type Beat, type Overlay } from "@/lib/process-narrative";
import PhoneCTA from "@/components/ui/PhoneCTA";

export default function ProcessNarrativeMobile({ as: Heading = "h1" }: { as?: "h1" | "h2" } = {}) {
  return (
    <section id="process" className="bg-bg">
      <div className="px-6 pt-28 pb-0 text-center">
        <Heading className="display-md uppercase">The Process</Heading>
        <p className="mt-2 lead text-muted">Six steps. One signature.</p>
      </div>
      {BEATS.map((b) => (
        <BeatBlock key={b.id} beat={b} />
      ))}
    </section>
  );
}

function BeatBlock({ beat }: { beat: Beat }) {
  return (
    <motion.article
      className="relative w-full py-16 border-t border-divider first:border-t-0"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
    >
      <div className="px-6">
        <p className="eyebrow">{beat.eyebrow}</p>
        <h3 className="mt-4 display-md">{beat.title}</h3>
        <p className="mt-5 lead">{beat.copy}</p>

        {beat.overlays.length > 0 && <CalloutList overlays={beat.overlays} />}

        {beat.showCta && (
          <div className="mt-8">
            <PhoneCTA size="lg" location="process-mobile" />
          </div>
        )}
      </div>
    </motion.article>
  );
}

function CalloutList({ overlays }: { overlays: Overlay[] }) {
  return (
    <ul className="mt-8 grid grid-cols-2 gap-4">
      {overlays.map((ov, i) => (
        <li key={i} className="border border-white/10 px-4 py-3">
          {ov.kind === "callout" && (
            <>
              <div className="font-display text-2xl text-accent leading-none">{ov.text}</div>
              {ov.sub && <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted">{ov.sub}</div>}
            </>
          )}
          {ov.kind === "panel" && (
            <div className="text-sm uppercase tracking-[0.18em] text-accent">{ov.label}</div>
          )}
          {ov.kind === "torque" && (
            <>
              <div className="font-display text-2xl text-accent leading-none">{ov.spec}</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted">torque-spec</div>
            </>
          )}
          {ov.kind === "gap" && (
            <>
              <div className="font-display text-xl text-accent leading-none">{ov.measurement}</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted">gap</div>
            </>
          )}
          {ov.kind === "layer" && (
            <>
              <div className="font-display text-xl text-accent leading-none">{ov.label}</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted">{ov.thickness}</div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
