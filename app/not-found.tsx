import Link from "next/link";
import PhoneCTA from "@/components/ui/PhoneCTA";

// 404 — workshop voice on a wrong-link landing. Keeps the existing
// "came home before it was finished" line (good shop metaphor for a
// stranded request), adds a mono diagnostic strip below the headline
// for owner's-manual register, and gives the visitor a known-good third
// destination (All builds) so Home isn't the only out.

export const metadata = {
  title: "Page not found",
  description: "This page came home before it was finished.",
};

export default function NotFound() {
  return (
    <section className="min-h-screen bg-ink flex items-center justify-center px-6 md:px-10">
      <div className="max-w-2xl text-center">
        <p className="eyebrow text-graphite">{"// 404"}</p>
        <h1 className="mt-5 display-lg text-bone">
          This page came home before it was finished.
        </h1>
        {/* Mono diagnostic line — owner's-manual register. .annotation is
            the design-system label class for "leader-line labels and
            callout pins. Mono small-caps." Fits the diagnostic vibe. */}
        <p className="annotation text-graphite mt-5">
          Status: under repair · Bay 04
        </p>
        <p className="mt-7 lead max-w-prose mx-auto text-bone/85">
          The link you followed may be old, mistyped, or under repair. Pick a
          route below — or call Serge.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-bone text-bone text-sm uppercase tracking-[0.18em] hover:bg-bone hover:text-ink transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bone focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            Home
          </Link>
          {/* Subordinate secondary — same shape, lower-strength border so
              the primary Home action stays dominant. */}
          <Link
            href="/builds"
            className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-bone/40 text-bone/85 text-sm uppercase tracking-[0.18em] hover:bg-bone/10 hover:text-bone transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bone focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            All builds
          </Link>
          <PhoneCTA location="404" />
        </div>
      </div>
    </section>
  );
}
