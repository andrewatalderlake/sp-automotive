import Link from "next/link";
import { TextScramble } from "@/components/effects/TextScramble";
import Surface from "@/components/ui/Surface";

// Pivot from "you found the right shop" (already covered in hero + AboutStory)
// to the proof-of-craft angle. Uses the standard Anton uppercase section
// label ("The signature") above a Surface light card. Inline 4-stat row
// anchors the "one shop, one signature" copy with numbers, and a
// typographic "— Serge" signature closes the section before the
// Read-more link.
//
// Stats values are placeholders — verify with Serge before launch.

const STATS = [
  { value: "4", label: "yrs at the bench" },
  { value: "15+", label: "exotics restored" },
  { value: "100%", label: "paid-in-full target" },
  { value: "0", label: "totaled twice" },
];

export default function AboutStrip() {
  return (
    <section className="relative bg-paper text-ink px-6 md:px-10 py-20 md:py-28 border-t border-ink/15">
      <div className="relative z-10 mx-auto mb-12 max-w-4xl md:mb-16">
        <p className="font-display uppercase tracking-[0.10em] text-left text-ink text-3xl md:text-5xl leading-none">
          The signature
        </p>
      </div>
      <Surface
        variant="light"
        className="relative z-10 max-w-4xl mx-auto rounded-2xl p-8 md:p-12"
      >
        <p className="eyebrow text-graphite">No subcontractors. No shortcuts.</p>
        <h2 className="mt-4 display-md text-ink">
          One shop. One signature. Every weld.
        </h2>
        <p className="mt-8 lead text-ink max-w-[65ch]">
          SP Automotive is Serge — start to finish. He documents the intake himself.
          He runs the booth. He measures the gaps. The cars he&apos;s built his name on —{" "}
          <Link href="/lamborghini-collision-repair-sarasota" className="link-underline text-ink transition-colors">Lamborghinis</Link>,{" "}
          <Link href="/mclaren-collision-repair-sarasota" className="link-underline text-ink transition-colors">McLarens</Link>,{" "}
          <Link href="/audi-r8-collision-repair-sarasota" className="link-underline text-ink transition-colors">R8s</Link>{" "}
          — leave the same way they came in: with one set of fingerprints on the work.
        </p>

        {/* Stats — 4 anchoring numbers. Hairline-bordered. */}
        <dl
          className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-y border-ink/15 py-8 md:grid-cols-4 md:gap-x-8"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {STATS.map((s) => (
            <div key={s.label}>
              <dt
                className="font-display leading-none tracking-[-0.03em] text-ink text-[clamp(2.25rem,4.5vw,3.5rem)]"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                <TextScramble duration={2} speed={0.05} characterSet="0123456789">
                  {s.value}
                </TextScramble>
              </dt>
              <dd className="mt-3 text-ink/80 text-sm leading-tight max-w-[14ch]">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>

        {/* Typographic signature — the one place "Serge" reads as a name
            on the page, not a third-person reference. Em-dash + Anton
            italic-feel via tracking. Drop-in slot for an SVG signature
            later if one is produced. */}
        <p className="mt-8 font-display text-ink text-lg md:text-xl tracking-[0.04em]">
          — Serge
        </p>

        <Link
          href="/about"
          className="link-underline inline-block mt-10 text-ink uppercase tracking-[0.18em] text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        >
          Read more about Serge →
        </Link>
      </Surface>
    </section>
  );
}
