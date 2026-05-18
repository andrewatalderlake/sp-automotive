"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "framer-motion";
import { Search } from "lucide-react";
import Surface from "@/components/ui/Surface";
import SmsCTA from "@/components/ui/SmsCTA";
import type { FAQ, FAQCategory } from "@/lib/faq-data";
import { FAQ_CLUSTERS } from "@/lib/faq-data";

// Replaces FAQAccordionList. Three changes that kill the "outdated dropdown
// list" feel without losing any of the working parts (a11y, JSON-LD,
// deep-linking, Lenis-aware scroll, reduced-motion):
//   1. Search + topical cluster pills at the top, sticky on scroll.
//   2. Cards instead of stacked accordion rows. Each card carries an
//      always-visible answer preview so users scan answers without clicking.
//   3. When "All" + no query, cards are grouped under cluster headings.
//      When a cluster is active or there's a query, a flat grid renders.
//
// Per-card entrance animation is intentionally NOT used. Cluster/search
// filter changes would remount cards (parent React tree changes between
// the grouped-clusters layout and the flat-grid layout), causing the
// entrance animation to replay on every filter switch. The AnimatePresence
// height tween on open/close is preserved — that's the load-bearing motion.

const SHUTTER_EASE: Transition["ease"] = [0.83, 0, 0.17, 1]; // --motion-shutter
// Mirrors the cards' Tailwind `scroll-mt-32` (8rem = 128px). Lenis's scrollTo
// doesn't observe CSS scroll-margin, so the offset is supplied explicitly.
const SCROLL_OFFSET = -128;
const PREVIEW_LENGTH = 140;

type ClusterFilter = "all" | FAQCategory;

type Props = {
  faqs: FAQ[];
};

// Trim the answer to a clean preview that ends on a word boundary. Falls
// back to a hard slice if there's no nearby space (very long single-word
// strings — unlikely here, but cheap to be safe).
function getPreview(answer: string): string {
  if (answer.length <= PREVIEW_LENGTH) return answer;
  const slice = answer.slice(0, PREVIEW_LENGTH);
  const lastSpace = slice.lastIndexOf(" ");
  return (lastSpace > 100 ? slice.slice(0, lastSpace) : slice).trim() + "…";
}

export default function FAQExplorer({ faqs }: Props) {
  const reduced = useReducedMotion();
  const [query, setQuery] = useState("");
  const [cluster, setCluster] = useState<ClusterFilter>("all");
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());

  const toggle = useCallback((id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const trimmedQuery = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    return faqs.filter((f) => {
      if (cluster !== "all" && f.category !== cluster) return false;
      if (!trimmedQuery) return true;
      return (
        f.question.toLowerCase().includes(trimmedQuery) ||
        f.answer.toLowerCase().includes(trimmedQuery)
      );
    });
  }, [faqs, cluster, trimmedQuery]);

  // Deep-link: read hash on mount. If the hash matches a FAQ id, surface the
  // card by clearing any filter that would hide it, mark it open, then scroll
  // via Lenis (with a CSS-scroll-margin-mirror offset).
  //
  // Must live in an effect rather than a useState initializer — window.hash
  // is browser-only, so seeding state from it during the first render would
  // mismatch the server HTML and trip React's hydration check.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const target = faqs.find((f) => f.id === hash);
    if (!target) return;
    // Hydration-safe deep-link seed: setting state here is intentional.
    // This effect runs only on mount (faqs is a stable prop from
    // PUBLISHED_FAQS, a module-level constant) and reads
    // window.location, which is not available during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount-only seed from URL hash
    setCluster(target.category);
    setQuery("");
    setOpenIds((prev) => {
      if (prev.has(hash)) return prev;
      const next = new Set(prev);
      next.add(hash);
      return next;
    });
    // Defer scroll to a macrotask so React commits state first. See
    // FAQAccordionList for the Lenis-vs-native scrollIntoView reasoning.
    setTimeout(() => {
      const lenis = typeof window !== "undefined" ? window.__lenis : undefined;
      if (lenis) {
        lenis.scrollTo(`#${hash}`, { offset: SCROLL_OFFSET });
        return;
      }
      const el = document.getElementById(hash);
      el?.scrollIntoView({ block: "start" });
    }, 0);
  }, [faqs]);

  const resultsId = "faq-results";
  const isFiltering = cluster !== "all" || trimmedQuery.length > 0;
  const showClusterHeadings = !isFiltering;

  return (
    <section className="bg-ink px-6 md:px-10 pt-16 pb-24 md:pb-32">
      <div className="max-w-6xl mx-auto">
        {/* Controls bar. Sticky so search + pills follow the user as they
            scroll the card grid. `top-20` (80px) clears the floating nav pill
            (which sits at `pt-5` with a ~40px logo, so ~60–70px tall). */}
        <div className="sticky top-20 z-30 -mx-6 md:-mx-10 px-6 md:px-10 py-4 bg-ink/95 backdrop-blur-md border-y border-bone/5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <label className="relative flex-1 max-w-md">
              <span className="sr-only">Search questions</span>
              <Search
                aria-hidden
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-graphite pointer-events-none"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions"
                aria-controls={resultsId}
                className="w-full h-11 pl-10 pr-4 rounded-md bg-white/[0.03] border border-bone/15 text-bone placeholder:text-graphite/70 focus:outline-none focus-visible:border-bone/40 focus-visible:bg-white/[0.05] transition-colors"
              />
            </label>
            <div
              role="group"
              aria-label="Filter by topic"
              className="flex flex-wrap gap-2"
            >
              <FilterPill
                active={cluster === "all"}
                label="All"
                onClick={() => setCluster("all")}
              />
              {FAQ_CLUSTERS.map((c) => (
                <FilterPill
                  key={c.id}
                  active={cluster === c.id}
                  label={c.label}
                  onClick={() => setCluster(c.id)}
                />
              ))}
            </div>
          </div>
          {isFiltering && (
            <p className="mt-3 eyebrow text-graphite">
              Showing {filtered.length} of {faqs.length}
            </p>
          )}
        </div>

        {/* Results region. role="region" on its own would be too noisy; the
            section already has its labelling. id exposed via aria-controls
            on search input + cluster pill group so SR users hear "search
            controls these results". */}
        <div id={resultsId} className="mt-10 md:mt-14">
          {/* Persistent screen-reader live region. Stays in the DOM at all
              times — JAWS and older NVDA versions only track content
              injected INTO an existing aria-live container; conditionally
              mounting the live region itself can suppress the
              announcement. aria-atomic="true" reads the new content as a
              single utterance. */}
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          >
            {filtered.length === 0
              ? "No questions match your search. Text Serge a photo for a custom answer."
              : ""}
          </div>

          {filtered.length === 0 ? (
            <EmptyState />
          ) : showClusterHeadings ? (
            <ClusterGroups
              faqs={filtered}
              openIds={openIds}
              onToggle={toggle}
              reduced={!!reduced}
            />
          ) : (
            <CardGrid
              faqs={filtered}
              openIds={openIds}
              onToggle={toggle}
              reduced={!!reduced}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function FilterPill({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center min-h-[44px] rounded-full px-4 py-2.5 text-xs uppercase tracking-[0.18em] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bone focus-visible:ring-offset-2 focus-visible:ring-offset-ink ${
        active
          ? "bg-bone text-ink"
          : "border border-bone/15 text-bone/80 hover:text-bone hover:border-bone/30 hover:bg-white/[0.02]"
      }`}
    >
      {label}
    </button>
  );
}

function ClusterGroups({
  faqs,
  openIds,
  onToggle,
  reduced,
}: {
  faqs: FAQ[];
  openIds: Set<string>;
  onToggle: (id: string) => void;
  reduced: boolean;
}) {
  return (
    <div className="space-y-14 md:space-y-20">
      {FAQ_CLUSTERS.map((c) => {
        const inCluster = faqs.filter((f) => f.category === c.id);
        if (inCluster.length === 0) return null;
        return (
          <section key={c.id} aria-labelledby={`cluster-${c.id}`}>
            <h2
              id={`cluster-${c.id}`}
              className="font-display uppercase tracking-[0.10em] text-bone text-lg md:text-2xl leading-none mb-6 md:mb-8"
            >
              {c.label}
            </h2>
            <CardGrid
              faqs={inCluster}
              openIds={openIds}
              onToggle={onToggle}
              reduced={reduced}
            />
          </section>
        );
      })}
    </div>
  );
}

function CardGrid({
  faqs,
  openIds,
  onToggle,
  reduced,
}: {
  faqs: FAQ[];
  openIds: Set<string>;
  onToggle: (id: string) => void;
  reduced: boolean;
}) {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
      {faqs.map((faq) => (
        <FAQCard
          key={faq.id}
          faq={faq}
          open={openIds.has(faq.id)}
          onToggle={() => onToggle(faq.id)}
          reduced={reduced}
        />
      ))}
    </ul>
  );
}

function FAQCard({
  faq,
  open,
  onToggle,
  reduced,
}: {
  faq: FAQ;
  open: boolean;
  onToggle: () => void;
  reduced: boolean;
}) {
  const panelId = `${faq.id}-panel`;
  const buttonId = `${faq.id}-btn`;
  const clusterLabel =
    FAQ_CLUSTERS.find((c) => c.id === faq.category)?.label ?? "";

  return (
    <li id={faq.id} className="scroll-mt-32">
      <Surface
        variant="glass"
        className="relative h-full rounded-2xl overflow-hidden"
      >
        <button
          id={buttonId}
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="w-full text-left p-6 md:p-7 outline-none focus-visible:ring-2 focus-visible:ring-bone focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        >
          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <p className="eyebrow text-graphite">{`// ${clusterLabel}`}</p>
              <h3 className="mt-3 font-display text-2xl md:text-3xl text-bone leading-[1.15]">
                {faq.question}
              </h3>
              {!open && (
                <p className="mt-4 text-bone/75 text-sm leading-relaxed">
                  {getPreview(faq.answer)}
                </p>
              )}
            </div>
            <span
              aria-hidden
              className={`shrink-0 text-bone text-2xl leading-none pt-1 transition-transform duration-300 ease-out ${
                open ? "rotate-45" : "rotate-0"
              }`}
            >
              +
            </span>
          </div>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="panel"
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              initial={reduced ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={
                reduced ? { duration: 0 } : { duration: 0.4, ease: SHUTTER_EASE }
              }
              style={{ overflow: "hidden" }}
            >
              {/* Inner div carries padding so the height tween doesn't
                  interpolate it (would visibly clip the text). Same trick
                  used in FAQAccordionList. */}
              <div className="px-6 md:px-7 pb-6 md:pb-7 border-t border-bone/10 pt-5">
                <p className="editorial text-bone/90">{faq.answer}</p>
                <div className="mt-6">
                  <SmsCTA location={`faq-card-${faq.id}`} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Surface>
    </li>
  );
}

function EmptyState() {
  // Visual-only — the SR announcement lives in a persistent aria-live
  // region rendered by the parent (see comment in FAQExplorer).
  return (
    <div className="max-w-2xl mx-auto text-center py-16 md:py-24">
      <p className="eyebrow text-graphite">No match</p>
      <h3 className="mt-3 font-display text-2xl md:text-3xl text-bone leading-tight">
        Text Serge a photo. He answers.
      </h3>
      <p className="mt-4 text-bone/85 max-w-md mx-auto">
        Not every question fits a list. Send the damage and a quick note —
        the reply comes back from the bench.
      </p>
      <div className="mt-8 flex justify-center">
        <SmsCTA location="faq-empty-state" />
      </div>
    </div>
  );
}
