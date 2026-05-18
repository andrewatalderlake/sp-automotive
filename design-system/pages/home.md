# Home (`app/page.tsx`) — Page-Specific Rules

> Inherits everything from `../MASTER.md`. This file lists per-section deviations only.

## Section sequence (canonical)

The homepage is an 11-stop scroll, ordered along the trust-triad arc: **hook → reach-us → who → what → how → proof → details → close**. Reordered 2026-05-16 — see "Deprecated" notes below for what changed.

Chapter numerals **do not render** in the UI — every section just shows its Anton uppercase label. The component-name column below is the canonical identifier.

| # | Component | File | Section label | Surface | Role |
|---|---|---|---|---|---|
| 1 | `HeroVideo` | `components/hero/HeroVideo.tsx` | — (cinematic display-bleed) | Dark, `data-theme="dark"` | Hook |
| 2 | `TrustStrip` | `components/home/TrustStrip.tsx` | Reach-us dateline only (location · phone · appointment · hours) | Paper | Reach-us |
| 3 | `MeetSerge` | `components/home/MeetSerge.tsx` | Meet Serge | Dark, `data-theme="dark"` | Who |
| 4 | `InsuranceHandling` | `components/home/InsuranceHandling.tsx` | Carrier-side advocacy | Paper | What (the differentiator) |
| 5 | `HowItWorks` | `components/home/HowItWorks.tsx` | How it works | Dark, `data-theme="dark"` | How |
| 6 | `FeaturedBuilds` | `components/home/FeaturedBuilds.tsx` | // Selected work | Paper · carries `id="work"` anchor · stock↔kit crossfade on card hover | Proof of work |
| 7 | `StorageBlock` | `components/home/StorageBlock.tsx` | Climate-controlled storage | Paper | Secondary value prop |
| 8 | `BodyworkAndEstimates` | `components/home/BodyworkAndEstimates.tsx` | Estimate without the haul | Paper | Secondary value prop |
| 9 | `AboutStrip` | `components/about/AboutStrip.tsx` | The signature | Paper, `Surface variant="light"` card | Closing proof beat (stats + signature) |
| 10 | `HomeFAQ` | `components/home/HomeFAQ.tsx` | Common questions | Dark, `data-theme="dark"` | Objection handling |
| 11 | `FinalCTA homepage` | `components/cta/FinalCTA.tsx` | Next move | Paper, `Surface variant="light"` card | Close |

> **Deprecated 2026-05-16:** `components/home/TheMath.tsx` (formerly §01 — three big numerals 70% / 100% / +30% about insurance gap-closing) was removed from the homepage. The quantified claim it carried lives implicitly inside `InsuranceHandling`, and `AboutStrip`'s 4-stat row continues to carry the "tabular figures" voice signal at the closing beat. Component file remains in the repo for one cycle in case rollback is needed.

> **Deprecated 2026-05-14:** `components/gallery/BeforeAfterGallery.tsx` was removed from the homepage. Its job (visualizing the stock → kit transformation) is now done inside the FeaturedBuilds cards via the on-hover image crossfade. The component file remains in the repo for one cycle in case rollback is needed.

**Do not reorder.** Removing or moving a section breaks the trust-triad arc and the comments in `app/page.tsx:14-31`.

## Hero rules (`HeroVideo`)

- The two display-bleed words "Totaled." and "Paid in Full." enter at 200ms and 600ms respectively, with the `.display-bleed--shine` per-character gradient sweep
- Liquid-glass lead card enters at 950ms; phone + SMS CTAs at 1100ms
- The card uses `<Surface variant="glass">` (dark mid-alpha tint + strong backdrop blur + border + ring + shadow). Earlier iteration tried a hand-rolled `bg-white/[0.015]` treatment that read as nearly invisible — original audit P2-a. Committing to glass here keeps the card cinematic but actually visible.
- Desktop parallax: text drifts at 0.22× scroll, card at 0.16× scroll. Hero only — no other section uses scroll-linked parallax
- The `<h1>` is `sr-only` at line 83 — the display-bleed phrase is the visual h1
- Mobile uses a stacked vertical layout (`md:hidden`); desktop uses absolute-positioned edge-bleed (`hidden md:block`). Don't try to unify these breakpoints

## ~~TheMath~~ (deprecated 2026-05-16)

Removed from the homepage. Component file (`components/home/TheMath.tsx`) kept for one rollback cycle. If restoring, the prior rules were: paper surface · three numerals (70% / 100% / +30%) with eyebrow + caption · animated measurement rule reveals left→right · `min-h-screen` · numerals via `font-display` + `clamp(4rem, 12vw, 9rem)` · "The numbers" was the section's `<h2 id="the-math-heading">` (only homepage section where the label was the heading).

## Meet Serge — founder intro (the "who" beat)

- Server component. Placed between `TrustStrip` and `InsuranceHandling` (position 3) so the visitor meets the person before the technical chapters. **Dark surface** (`bg-ink text-bone`, `data-theme="dark"` so `StickyContactBar` flips its treatment) — the surface flip from paper `TrustStrip` into ink here marks the "meet the human" beat editorially, and the portrait reads cinematic against ink. Two dark interludes total on the homepage (this and `HowItWorks`), spaced two paper sections apart for scroll-rhythm contrast.
- Section label uses the canonical Anton uppercase pattern (`font-display uppercase tracking-[0.10em] text-3xl md:text-5xl`); display headline is `display-md`. Layout is text-left + portrait-right on desktop (12-col grid, 7/5 split), portrait-first stacked on mobile via `order-1 / md:order-2`.
- Portrait re-uses `/public/about/serge-portrait.webp` — single source feeds both `/about` AboutHero and this homepage section. 3:4 aspect matches the AboutHero crop so the build-time framing applies identically.
- `existsSync` fallback renders a "Portrait — pending" placeholder if the file is missing.
- **Copy is STUB** — voice-correct but not Serge-verified. The "three or four pairs of hands vs. one" contrast is the rhetorical hook and is defensible only if Serge personally walks every step from intake to handover; if helpers run any stage, the line needs softening. Other Serge bio phrasing lives in `AboutStory.tsx` and should not be duplicated here. Replace with real specifics (years at the bench, prior shops, named marques certified on) when content lands from Serge.
- `AboutStrip` remains at position 9 as the closing proof beat (stats + typographic signature) — the two sections play different roles and shouldn't be consolidated.

## InsuranceHandling — section-label exemplar

This is the canonical section-label layout. Use it as a reference when adding a new homepage section.

```tsx
<p className="font-display uppercase tracking-[0.10em] text-ink text-lg md:text-2xl leading-none">
  Carrier-side advocacy
</p>
```

Three `Surface variant="light"` phase cards (Document / Supplement / Negotiate). Hairline connector draws across at reveal. No glass — paper surface, light cards. Display headline below the label: "We fight the file. You stay out of it."

Section closes with a `// We work with` carrier wordmark strip (State Farm · Allstate · GEICO · Progressive · USAA · Liberty Mutual · Chubb), separated by a hairline (`border-t border-ink/10`). Relocated from `TrustStrip` so the carrier list lives where carriers are the subject. Renders via shared `components/home/Wordmarks.tsx` at `size="small"`.

## StorageBlock — full-bleed spotlight

- **Section label is `text-center`** — deliberate deviation from the global text-left rule in MASTER.md §7. The spotlight image below is full-bleed and frames better with a centered label.
- Image escapes section padding via `-mx-6 md:-mx-10`. The image **is** the surface; no glass card wraps it
- Scrim: bottom-up + left-right gradient guarantees overlay legibility regardless of image content
- "Inside. Always." headline + three callouts (Climate / Access / Monitored) sit on the scrim
- `min-h-[110svh]` — viewport-fill

## BodyworkAndEstimates — video + CTA pair

- Two cards side-by-side at `md:grid-cols-2`: an `AmbientVideo` card on the left (inspection lamp + gloved hands on carbon fiber) and a CTA card on the right (`Get on the schedule.` + PhoneCTA + SmsCTA). `items-stretch` keeps both at equal height
- The middle "// The path" steps card was removed (2026-05-14) — it duplicated §05's 4-step list and didn't carry any §04-specific narrative weight. The ignite-red dot that lived on it went with it; §04 now has no ignite allocation, which is fine — ignite is reclaimed by the global sticky CTA bar and focus rings
- CTA card houses PhoneCTA + SmsCTA with `theme="light"` — `primary-light` / `ghost-light` variants
- Display headline below the label: "We come to you."

## HowItWorks — dark glass step cards

- One of two dark interludes (the other is `MeetSerge`). Section label renders in `text-bone` (not `text-ink`)
- Marked `data-theme="dark"` so `StickyContactBar` flips to dark treatment when this section sits under it
- Four glass step cards (Send photos / We come to you / We work the file / You walk away whole), hairline connector across the middle on desktop
- Display-bleed headline ("Four steps. One phone number.") lives in the canvas, NOT inside a glass card — matches the hero recipe

## Selected work (`FeaturedBuilds`) — utility section

- `// Selected work` callout-style label (with `//` prefix), not a section label proper. Sits **after** `HowItWorks`, **before** `StorageBlock`
- 1+3 grid: hero build (Urus 1016) wide on top, three thumbnails below
- All four cards use `Surface variant="light"`, `rounded-2xl`, `overflow-hidden`, with `next/image`
- **Carries the `id="work"` anchor + `scroll-mt-32`** — the global nav's `/#work` link lands here (was on `BeforeAfterGallery`; moved here when that section was removed 2026-05-14)
- **Hover crossfade:** each card's `kitImage` is the default visible layer. On `group-hover` the kit fades out (700ms) to reveal the `stockImage` underneath, plus a subtle card lift (`-translate-y-1`, deeper shadow). Reduced-motion users see the kit only, no transitions. This delivers the before/after narrative inside the card itself.
- Display headline: "Built where it broke."
- Section closes with a `// We restore` marque wordmark strip (Ferrari · Lamborghini · McLaren · Porsche · Audi R8 · BMW M), separated by a hairline (`border-t border-ink/10`). Relocated from `TrustStrip`. Aligned with the Footer nav and `lib/faq-data.ts` "models we work on" answer — keep these three in sync

## AboutStrip — the signature (closing proof beat)

- `Surface variant="light"` card with 4-stat dl (`4` / `15+` / `100%` / `0`)
- The em-dashed "— Serge" line is the **typographic signature** — the one place "Serge" reads as a name on the page, not a third-person reference
- Inline links to model pages (`/lamborghini-...`, `/mclaren-...`, `/audi-r8-...`) use `link-underline`
- Stats values are currently placeholders — verify with Serge before launch (note in `AboutStrip.tsx:12`)
- Display headline (inside the card): "One shop. One signature. Every weld."

## HomeFAQ — native details/summary (dark interlude)

- **Dark register** with `data-theme="dark"` — flipped from paper on 2026-05-14 to break the back-half paper run (`FeaturedBuilds` / `StorageBlock` / `BodyworkAndEstimates` / `AboutStrip` are all paper in sequence and would otherwise read as one cream slab). The sticky CTA bar's section-aware theme picks up `data-theme="dark"` and flips when scrolled over this section.
- Built on native `<details>`/`<summary>` so keyboard + screen-reader support comes for free
- Single-open enforced via `onToggle` handler closing siblings; we don't manage state in React
- `+` indicator rotates 45° on open via `[open]` selector + `rotate(45deg)`
- Bone-on-ink text, bone/10 dividers, focus-visible ring uses bone with ink offset
- SmsCTA uses default dark theme (drop `theme="light"` if you re-render this elsewhere on a paper section — only the dark variant works on this section's bg)
- **Six hardcoded questions.** The `/faq` page reads from `lib/faq-data.ts` (`PUBLISHED_FAQS`) — these two lists are intentionally independent. If you change the data file, the homepage will not auto-update

## FinalCTA — closing card

- Same component used on `/faq`, but only the homepage passes `homepage={true}` (which renders the "Next move" section label)
- `Surface variant="light"` rounded card with PhoneCTA + SmsCTA (`theme="light"`)
- Headline `<h2 className="display-md text-ink">` — never `text-bone` (would fail contrast on the white card)
- "Photos by text. Estimate by phone. Insurance by us." — keep this line. It's a load-bearing voice moment

## Footer (global, but rendered after §08 on every page)

- `Surface variant="glass"` (dark scrim) sitting on top of `/footer-ambient.mp4` — the red footage shows through the glass tint, producing the warm red footer mood
- Three-column grid: brand block (logo + city/region), CTA cluster (PhoneCTA + SmsCTA + hours line), nav (About / FAQ / model pages / explainers)
- Many nav links by design — premium-make landing pages need to be reachable from anywhere

## Sticky bar (global) — homepage-specific behaviors

- Shows after `scrollY > innerHeight * 0.9` (past the hero)
- Theme flips to dark when `MeetSerge`, `HowItWorks`, or `HomeFAQ` is under it (the three `data-theme="dark"` sections below the hero)
- Hidden on `/estimate` and `/contact` — not the homepage
