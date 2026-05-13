import PhoneCTA from "@/components/ui/PhoneCTA";
import SmsCTA from "@/components/ui/SmsCTA";
import Surface from "@/components/ui/Surface";

// Closing chapter ("09 / Next move"). Glass tab contains the action
// triangle (phone, SMS, supporting copy) so the CTAs sit on a clearly
// defined surface instead of floating on the road footage behind them.
// The chapter marker only makes sense on the home page (chapter 09 in
// the cinematic sequence). Other surfaces pass no prop and get no marker.
type Props = {
  /** Show the "09 / Next move" chapter marker. Only set true on the home page. */
  chapterMarker?: boolean;
};

export default function FinalCTA({ chapterMarker = false }: Props) {
  return (
    <section className="relative w-full overflow-hidden bg-paper text-ink px-6 md:px-10 py-20 md:py-28">
      {chapterMarker && (
        <div className="relative z-10 mx-auto mb-12 max-w-3xl md:mb-14">
          <div className="font-display text-ink leading-none tracking-[-0.02em] text-3xl md:text-5xl">
            09
          </div>
          <p className="eyebrow mt-2 text-graphite">/ Next move</p>
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
