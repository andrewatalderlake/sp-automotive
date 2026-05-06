import type { Metadata } from "next";
import PhoneCTA from "@/components/ui/PhoneCTA";
import SmsCTA from "@/components/ui/SmsCTA";
import FinalCTA from "@/components/cta/FinalCTA";
import { PUBLISHED_FAQS } from "@/lib/faq-data";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Questions owners ask",
  description:
    "Timeline, OEM parts, paint match, ADAS, warranty, insurance, rental, storage, total loss, delivery — straight answers from the shop floor in Sarasota.",
  alternates: { canonical: `${SITE_URL}/faq` },
};

function FAQJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PUBLISHED_FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function FAQPage() {
  if (PUBLISHED_FAQS.length === 0) {
    // Same gating as testimonials — if every entry is unpublished, the page
    // still exists for routing but reads as a stub.
    return (
      <section className="bg-bg px-6 md:px-10 py-32 pt-40 min-h-[60vh]">
        <div className="max-w-3xl mx-auto">
          <p className="eyebrow">Questions</p>
          <h1 className="mt-4 display-lg">In review.</h1>
          <p className="editorial mt-8 max-w-2xl">
            Common questions are being finalized. In the meantime, talk to Serge directly.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <PhoneCTA size="lg" location="faq-stub" />
            <SmsCTA location="faq-stub" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <FAQJsonLd />
      <section className="bg-bg px-6 md:px-10 pt-40 pb-24 border-b border-divider">
        <div className="max-w-3xl mx-auto">
          <p className="eyebrow">Questions owners ask</p>
          <h1 className="mt-4 display-lg">Straight answers.</h1>
          <p className="editorial mt-8 max-w-2xl">
            Crashing an exotic raises questions a regular body shop will not answer. Here are the
            ones we hear most. If yours is not below, call.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <PhoneCTA size="lg" location="faq-hero" />
            <SmsCTA location="faq-hero" />
          </div>
        </div>
      </section>

      <section className="bg-bg px-6 md:px-10 py-24 md:py-32">
        <div className="max-w-3xl mx-auto">
          <ol className="space-y-16">
            {PUBLISHED_FAQS.map((f, idx) => (
              <li key={f.id} id={f.id} className="scroll-mt-32">
                <p className="spec text-xs text-muted">
                  {String(idx + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-3 font-display text-3xl md:text-4xl text-accent leading-[1.05]">
                  {f.question}
                </h2>
                <p className="editorial mt-5 max-w-[65ch]">{f.answer}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
