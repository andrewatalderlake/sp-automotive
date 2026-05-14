# FAQ (`app/faq/page.tsx`) — Page-Specific Rules

> Inherits everything from `../MASTER.md`. This file lists per-page deviations only.

## Page structure

| Slot | Component | Surface |
|---|---|---|
| Hero | inline `<section>` in `app/faq/page.tsx:61-74` | Dark (`bg-ink`) |
| Search + cluster controls + card grid | `<FAQExplorer>` | Dark (`bg-ink`) with sticky controls bar |
| Final CTA | `<FinalCTA />` (no `homepage` prop) | Paper card on paper |
| Footer | global, layout.tsx | Dark glass on red ambient video |

Three dark sections in a row (hero + controls + cards) → one paper section (FinalCTA) → dark footer. This is the only page on the site with such a long uninterrupted dark run; the FinalCTA's paper card is structurally important as the visual breath before the close.

## Hero rules

- `<h1 className="mt-4 display-lg">Straight answers.</h1>` — direct h1 (no chapter numeral, no sr-only h1)
- Eyebrow: `Questions owners ask`
- `.editorial` lead paragraph (~2 lines max)
- PhoneCTA `size="lg"` + SmsCTA (dark theme defaults)
- `pt-40` — top padding accounts for the floating nav pill that overlaps page top

## Stub state

If `PUBLISHED_FAQS.length === 0` (in `lib/faq-data.ts`), the page renders a minimal stub at `app/faq/page.tsx:38-55`:
- Same hero treatment but `display-lg` reads "In review."
- `.editorial` line explains and points at PhoneCTA/SmsCTA
- No `FAQExplorer`, no `FinalCTA`

## FAQExplorer rules (`components/faq/FAQExplorer.tsx`)

### Controls bar (search + cluster pills)

- **Sticky** at `top-20` (~80px from viewport top) — clears the floating nav pill. Uses `bg-ink/95 backdrop-blur-md` + faint `border-y border-bone/5` so it doesn't read as a hard divider when not scrolled into.
- Layout: `flex flex-col gap-4 md:flex-row md:items-center md:justify-between` — search input stacks above pills on mobile, sits left of pills on desktop.
- Search input: `<input type="search">` inside a `<label>` with `<span className="sr-only">Search questions</span>` for the accessible name. Visible placeholder = "Search questions". `Search` icon from `lucide-react` decorates left side with `aria-hidden`. Input is 44px tall (`h-11`), `bg-white/[0.03]`, `border border-bone/15`, focus state bumps to `bg-white/[0.05] + border-bone/40`. `aria-controls` points at the results region id.
- Cluster pills: 4 buttons in a `<div role="group" aria-label="Filter by topic">`. Pills are `aria-pressed` toggles (not `role="tab"`/tablist — simpler, no arrow-key focus management). All ≥44pt via `inline-flex items-center min-h-[44px]`. Active state: `bg-bone text-ink`. Inactive: `border border-bone/15 text-bone/80` with hover state.
- Pill order = `FAQ_CLUSTERS` order in `lib/faq-data.ts` (`All` first, then Repair & quality / Insurance & money / Logistics & updates).
- Counter: when any filter is active (cluster ≠ "all" OR search has content), an `.eyebrow` line "Showing X of 13" renders below the controls.

### Taxonomy (single source of truth)

Categories live in `lib/faq-data.ts`:

```ts
export type FAQCategory = "repair" | "money" | "logistics";
export const FAQ_CLUSTERS = [
  { id: "repair",    label: "Repair & quality" },
  { id: "money",     label: "Insurance & money" },
  { id: "logistics", label: "Logistics & updates" },
];
```

Each FAQ entry has a `category` field. Counts as of 2026-05-14: Repair & quality (6), Insurance & money (3), Logistics & updates (4) = 13 published.

When adding a new FAQ entry, tag its category. If a fourth category becomes necessary, extend `FAQCategory`, add to `FAQ_CLUSTERS`, and verify the pills layout still fits at 375px.

### Card pattern (per FAQ)

- `<Surface variant="glass">` with `rounded-2xl overflow-hidden` — dark glass card on the `bg-ink` canvas
- `<li id={faq.id} className="scroll-mt-32">` wraps each card — preserves deep linking
- Card header (clickable area): `<button aria-expanded aria-controls>` covering the full card padding, `text-left p-6 md:p-7`
- Header content:
  - Eyebrow: `// {cluster label}` (e.g. `// Repair & quality`), `.eyebrow text-graphite`
  - Question: `font-display text-2xl md:text-3xl text-bone leading-[1.15]`
  - **Always-visible preview** when collapsed: first ~140 chars of answer, line-clipped to a word boundary with `…` suffix, `text-bone/75 text-sm leading-relaxed`. **This is the rule that kills the dropdown-list feel** — users scan answers without clicking.
  - `+` indicator top-right, rotates 45° on `open` (CSS `transition-transform duration-300 ease-out`)
- Expanded panel: framer-motion `AnimatePresence` height tween (`{ height: 0 → "auto", opacity: 0 → 1 }`, 400ms, `--motion-shutter` easing)
  - Inner padding lives on a child div (`px-6 md:px-7 pb-6 md:pb-7 pt-5`) so the height tween doesn't interpolate padding — same trick as `FAQAccordionList`
  - Top border (`border-t border-bone/10`) separates the panel from the header
  - Full answer in `.editorial text-bone/90`
  - Row CTA: `<SmsCTA location={`faq-card-${id}`} />` — keeps the conversion path one tap away from every answer
- Grid: `grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5` (max 2 columns even on `lg+` — preserves reading width)

### When cluster headings render

- **Cluster headings render** when `cluster === "all"` AND search query is empty. In that mode, results are grouped under `<section aria-labelledby="cluster-{id}">` blocks, each headed by an `<h2>` ("Repair & quality" / "Insurance & money" / "Logistics & updates") in Anton uppercase, with `space-y-14 md:space-y-20` between groups.
- **Cluster headings hidden** when ANY filter is active (cluster pill ≠ "all" OR query has content). Results render as a single flat grid — heading would be redundant or misleading.

### Empty state pattern

- Renders when `filtered.length === 0` (a query yielded zero hits)
- Centered block, `role="status" aria-live="polite"` so SR users hear the change
- Copy: eyebrow "No match" + Anton headline "Text Serge a photo. He answers." + graphite line + `SmsCTA location="faq-empty-state"`
- Voice rule: the empty state is one of the highest-CRO surfaces on the page (a user typed a query that didn't match — they have an intent we don't know about). It must route to Serge, not silence.

### Card open behavior

- **Multiple cards may be open simultaneously** (state is `Set<string>` of open ids). Lets users compare answers (e.g. timeline + warranty).
- State persists across filter changes — a previously opened card stays open even if it's filtered out, and re-appears open when the filter clears.
- No "close all" affordance is rendered; users close by tapping the card header again (the `+` is visually rotated to `×` when open).

## Deep linking

- Hash routes like `/faq#timeline` work via `useEffect` in `FAQExplorer`:
  1. Find the FAQ with matching id
  2. Set `cluster` to its category (so the card is visible)
  3. Clear `query` (so it isn't filtered out by stale search state)
  4. Add the id to `openIds`
  5. Scroll via `window.__lenis?.scrollTo("#${id}", { offset: -128 })` with native `scrollIntoView` fallback
- `SCROLL_OFFSET = -128` mirrors each card's `scroll-mt-32` (Lenis doesn't observe CSS scroll-margin)
- Hash read happens in `useEffect`, never in a state initializer — hydration-safe

## FinalCTA rules

- Rendered without the `homepage` prop — no "Next move" section label on this page
- Same `Surface variant="light"` card pattern as the homepage version
- Use `text-ink` on the display headline, not `text-bone` (paper bg — bone-on-paper fails WCAG)

## SEO

- `metadata.title: "Questions owners ask"`
- `metadata.alternates.canonical: "${SITE_URL}/faq"`
- FAQ JSON-LD emitted by `<FAQJsonLd />` in `app/faq/page.tsx:16-35` — schema.org `FAQPage` + `Question` + `Answer` for every published entry. **Unaffected by the FAQExplorer redesign** — JSON-LD reads from `PUBLISHED_FAQS` directly, independent of UI state.
- Every FAQ answer text is in the DOM at page load (collapsed panels render as `height: 0 + opacity: 0` via framer-motion, but the text node is still in the rendered tree). Google's FAQPage spec accepts this.

## Sticky bars on this page

Two stickies coexist:

1. **Floating nav pill** (`components/nav/Navigation.tsx`) — site-wide, `fixed top-0`
2. **FAQExplorer controls bar** — `sticky top-20`, lives inside the FAQExplorer section, scrolls with the section

The global `StickyContactBar` also appears after `scrollY > innerHeight * 0.9`. It currently stays in **light theme** for the whole accordion run — even though the cards live on `bg-ink`. The accordion section element isn't marked `data-theme="dark"`. If you want the bar dark on FAQ, add `data-theme="dark"` to the wrapping `<section className="bg-ink ...">` in `FAQExplorer.tsx`.

## Deprecated component

`components/faq/FAQAccordionList.tsx` is **deprecated** as of 2026-05-14 but kept in the repo for one cycle in case rollback is needed. Delete in a follow-up PR after one weekend in production.
