import PhoneCTA from "@/components/ui/PhoneCTA";
import SmsCTA from "@/components/ui/SmsCTA";
import Surface from "@/components/ui/Surface";
import FinalCTABackdropVideo from "./FinalCTABackdropVideo";

// Closing chapter ("06 / Next move"). Glass tab contains the action
// triangle (phone, SMS, supporting copy) so the CTAs sit on a clearly
// defined surface instead of floating directly on the looping backdrop
// video behind. No per-section background — the html canvas (`ink →
// ink-deep`, fixed) provides the reduced-motion fallback contrast floor
// and keeps this section's top edge continuous with the chapter 05
// gradient above. When `FinalCTABackdropVideo` returns null, the canvas
// still gives the CTA a contrast floor.
export default function FinalCTA() {
  return (
    <section
      className="relative isolate w-full overflow-hidden px-6 md:px-10 pt-32 pb-32"
    >
      <FinalCTABackdropVideo />
      <div className="relative z-10 mb-16">
        <div className="font-display text-bone leading-none tracking-[-0.02em] text-3xl md:text-5xl">
          06
        </div>
        <p className="eyebrow mt-2">/ Next move</p>
      </div>
      <Surface
        variant="glass"
        className="relative z-10 max-w-3xl mx-auto rounded-2xl p-8 md:p-12 flex flex-col items-center text-center"
      >
        <p className="eyebrow">Tell us what happened.</p>
        <h2 className="mt-3 display-md">We&apos;ll handle the rest.</h2>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <PhoneCTA size="lg" location="final-cta" />
          <SmsCTA location="final-cta" />
        </div>
        <p className="eyebrow mt-8">
          Photos by text. Estimate by phone. Insurance by us.
        </p>
      </Surface>
    </section>
  );
}
