import type { Metadata } from "next";
import PhoneCTA from "@/components/ui/PhoneCTA";
import SmsCTA from "@/components/ui/SmsCTA";
import ContactForm from "./ContactForm";
import {
  CITY,
  REGION,
  HOURS_LABEL,
  HOURS_DAYS,
  BY_APPOINTMENT,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to Serge directly. Send photos of the damage and get a callback within 24 hours.",
};

export default function ContactPage() {
  return (
    <section className="bg-ink px-6 md:px-10 py-32 pt-40">
      <div className="max-w-6xl mx-auto">
        {/* Heading + immediate CTAs span full width */}
        <p className="eyebrow">Contact</p>
        <h1 className="mt-4 display-lg">Talk to Serge directly.</h1>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <PhoneCTA size="lg" location="contact" />
          <SmsCTA location="contact" />
        </div>

        {/* Two-column layout below the lede: form on the left (2 cols),
            shop info card on the right (1 col). Stacks on mobile. */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2">
            <ContactForm />
          </div>
          <aside className="md:col-span-1">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8 md:sticky md:top-32">
              <p className="eyebrow">The shop</p>
              <p className="mt-3 text-bone leading-relaxed">
                {CITY}, {REGION}
              </p>
              <p className="mt-1 text-bone/85 text-sm">
                Exotic collision &amp; restoration
              </p>

              <p className="eyebrow mt-8">Hours</p>
              <p className="mt-3 text-bone">{HOURS_LABEL}</p>
              <p className="mt-1 text-bone/85 text-xs">
                {HOURS_DAYS[0]}&ndash;{HOURS_DAYS[HOURS_DAYS.length - 1]}
                {BY_APPOINTMENT ? " · By appointment only" : ""}
              </p>

              <p className="eyebrow mt-8">What to expect</p>
              <ul className="mt-3 space-y-2 text-sm text-bone/85">
                <li>Callback usually inside the hour, always within 24.</li>
                <li>Photos by text get a faster read.</li>
                <li>Insurance handling on our side.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
