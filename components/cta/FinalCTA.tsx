import PhoneCTA from "@/components/ui/PhoneCTA";
import SmsCTA from "@/components/ui/SmsCTA";
import Surface from "@/components/ui/Surface";

// Closing CTA. Glass tab contains the action triangle (phone, SMS,
// supporting copy) so the CTAs sit on a clearly defined surface instead
// of floating on the road footage behind them. The "Next move" section
// label only makes sense on the home page (where the section sequence
// gives this CTA a section identity). Other surfaces pass no prop and
// get no label — the card stands on its own.
type Props = {
  /** Show the "Next move" section label. Only set true on the home page. */
  homepage?: boolean;
};

export default function FinalCTA({ homepage = false }: Props) {
  return (
    <section className="relative w-full overflow-hidden bg-paper text-ink px-6 md:px-10 py-20 md:py-28">
      {homepage && (
        <div className="relative z-10 mx-auto mb-12 max-w-3xl md:mb-14">
          <p className="font-display uppercase tracking-[0.10em] text-left text-ink text-3xl md:text-5xl leading-none">
            Next move
          </p>
        </div>
      )}
      <Surface
        variant="light"
        className="relative z-10 max-w-3xl mx-auto rounded-2xl p-8 md:p-12 flex flex-col items-center text-center"
      >
        <p className="eyebrow text-graphite">Tell us what happened.</p>
        <h2 className="mt-3 display-md text-ink">We&apos;ll handle the rest.</h2>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <PhoneCTA size="lg" theme="light" location="final-cta" />
          <SmsCTA theme="light" location="final-cta" />
        </div>
        <p className="eyebrow mt-8 text-graphite">
          Photos by text. Estimate by phone. Insurance by us.
        </p>
      </Surface>
    </section>
  );
}
