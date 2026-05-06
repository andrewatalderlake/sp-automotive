import Link from "next/link";
import PhoneCTA from "@/components/ui/PhoneCTA";

export const metadata = {
  title: "Page not found",
  description: "This page came home before it was finished.",
};

export default function NotFound() {
  return (
    <section className="min-h-screen bg-bg flex items-center justify-center px-6 md:px-10">
      <div className="max-w-2xl text-center">
        <p className="eyebrow">404 · Page not found</p>
        <h1 className="mt-5 display-lg">This page came home before it was finished.</h1>
        <p className="mt-7 lead max-w-prose mx-auto">
          The link you followed may be old, mistyped, or under repair. Pick a route below — or call Serge.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-accent text-accent text-sm uppercase tracking-[0.18em] hover:bg-accent hover:text-bg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            Home
          </Link>
          <PhoneCTA location="404" />
        </div>
      </div>
    </section>
  );
}
