import PhoneCTA from "@/components/ui/PhoneCTA";
import SmsCTA from "@/components/ui/SmsCTA";
import Surface from "@/components/ui/Surface";

export default function FinalCTA() {
  return (
    <section className="relative w-full overflow-hidden px-6 pt-32 pb-32">
      <Surface variant="solid" className="max-w-3xl mx-auto rounded-md py-20 px-6 md:px-10 flex flex-col items-center text-center">
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
