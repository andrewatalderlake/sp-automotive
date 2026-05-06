import type { Metadata } from "next";
import PhoneCTA from "@/components/ui/PhoneCTA";
import SmsCTA from "@/components/ui/SmsCTA";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to Serge directly. Send photos of the damage and get a callback within 24 hours.",
};

export default function ContactPage() {
  return (
    <section className="bg-bg px-6 md:px-10 py-32 pt-40">
      <div className="max-w-3xl mx-auto">
        <p className="eyebrow">Contact</p>
        <h1 className="mt-4 display-lg">Talk to Serge directly.</h1>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <PhoneCTA size="lg" location="contact" />
          <SmsCTA location="contact" />
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
