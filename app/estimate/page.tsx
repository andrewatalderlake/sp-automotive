import type { Metadata } from "next";
import PhoneCTA from "@/components/ui/PhoneCTA";
import SmsCTA from "@/components/ui/SmsCTA";
import EstimateForm from "./EstimateForm";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Send 3 photos. Get a callback.",
  description:
    "The lighter way to start. Drop three photos of the damage, your phone, and your car — Serge calls back within 24 hours.",
  alternates: { canonical: `${SITE_URL}/estimate` },
};

export default function EstimatePage() {
  return (
    <section className="bg-bg px-6 md:px-10 py-32 pt-40">
      <div className="max-w-3xl mx-auto">
        <p className="eyebrow">Estimate</p>
        <h1 className="mt-4 display-lg">Send 3 photos. Get a callback.</h1>
        <p className="editorial mt-8 max-w-2xl">
          You don&apos;t need a write-up. You don&apos;t need to know what&apos;s damaged. Drop
          three photos that show the worst of it, tell us what the car is, and Serge will be in
          touch within twenty-four hours with a real next step.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <PhoneCTA size="lg" location="estimate" />
          <SmsCTA location="estimate" />
        </div>

        <EstimateForm />
      </div>
    </section>
  );
}
