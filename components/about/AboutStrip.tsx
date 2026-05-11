import Link from "next/link";
import RevealWords from "@/components/effects/RevealWords";
import Surface from "@/components/ui/Surface";

// Pivot from "you found the right shop" (already covered in hero + AboutStory)
// to the proof-of-craft angle: what the shop is, what it isn't, what it
// touches. Earns the "Read more" click instead of restating the welcome.
//
// Carries chapter mark "07 / The signature" to read as the about beat
// after the process chapters (01–05) and the proof gallery (06). Body
// sits in a liquid-glass tab so it's clearly a defined section rather
// than text floating on the cinematic backdrop. Intentionally text-only
// — no background imagery — to give the reader a rest beat between the
// gallery and the closing CTA.
export default function AboutStrip() {
  return (
    <section className="relative px-6 md:px-10 py-32">
      <div className="relative z-10 mb-16">
        <div className="font-display text-bone leading-none tracking-[-0.02em] text-3xl md:text-5xl">
          07
        </div>
        <p className="eyebrow mt-2">/ The signature</p>
      </div>
      <Surface
        variant="glass"
        className="relative z-10 max-w-4xl mx-auto rounded-2xl p-8 md:p-12"
      >
        <p className="eyebrow">No subcontractors. No shortcuts.</p>
        <h2 className="mt-4 display-md">
          <RevealWords>One shop. One signature. Every weld.</RevealWords>
        </h2>
        <p className="mt-8 lead max-w-[65ch]">
          SP Automotive is Serge — start to finish. He documents the intake himself.
          He runs the booth. He measures the gaps. The cars he&apos;s built his name on —{" "}
          <Link href="/lamborghini-collision-repair-sarasota" className="link-underline text-bone transition-colors">Lamborghinis</Link>,{" "}
          <Link href="/mclaren-collision-repair-sarasota" className="link-underline text-bone transition-colors">McLarens</Link>,{" "}
          <Link href="/audi-r8-collision-repair-sarasota" className="link-underline text-bone transition-colors">R8s</Link>{" "}
          — leave the same way they came in: with one set of fingerprints on the work.
        </p>
        <Link
          href="/about"
          className="link-underline inline-block mt-10 text-bone uppercase tracking-[0.18em] text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-bone focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        >
          Read more about Serge →
        </Link>
      </Surface>
    </section>
  );
}
