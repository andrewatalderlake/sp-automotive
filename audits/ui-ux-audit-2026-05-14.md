# UI/UX Audit — 2026-05-14

**Scope (per agreed plan):** Homepage (`app/page.tsx` + every section it imports), FAQ page (`app/faq/page.tsx` + `FAQAccordionList`), global StickyContactBar, global Navigation, global Footer, design tokens (`app/globals.css`), root chrome (`app/layout.tsx`).

**Out of scope this pass:** premium-make landing pages, `/about`, `/builds`, `/estimate`, `/contact`, `/explainers`, SEO routes.

**Methodology:** ui-ux-pro-max Quick Reference §1–§10 + Common Rules for App UI, cross-referenced against two rendered screenshots (homepage scroll, FAQ page) and full source read of every component listed in scope.

---

## Executive summary

| Priority | Count |
|---|---:|
| **P1 CRITICAL** — accessibility / interaction blockers | 2 |
| **P2 HIGH** — visible UX / consistency issues | 4 |
| **P3 MEDIUM** — polish, documentation gaps | 6 |
| **P4 LOW** — nits, optional refinements | 4 |
| **Total** | **16** |

### Top 5 to fix first
1. **P1-a — FAQ chip jump-nav touch targets** (`FAQAccordionList.tsx:118-124`) — chips render ~28px tall; fails 44pt minimum
2. **P1-b — Footer link density on mobile** (`Footer.tsx:43-58`) — 17 links in a single column at `text-sm` with no min-height; nearly impossible to tap without misses
3. **P2-a — Hero glass card visibility** (`HeroVideo.tsx:177-186`) — `bg-white/[0.015]` (1.5% white) reads as nearly invisible against cinematic footage; either commit harder or use `Surface variant="glass"`
4. **P2-b — Navigation desktop pill text size** (`Navigation.tsx:171`) — `text-xs` (12px) on nav links is at the bottom of the readable floor on a high-density desktop; consider `text-sm`
5. **P2-c — TrustStrip wordmarks contrast** (`TrustStrip.tsx:35`) — `text-ink/85` on paper at `text-sm` may sit at the AA threshold for normal text; verify with contrast tooling and bump to `text-ink` if it fails

### What the audit is **not** flagging
- Reveal animations (`HowItWorks`, `InsuranceHandling`, `FeaturedBuilds`, `TrustStrip`, `TheMath`, `StorageBlock`, `BodyworkAndEstimates`, `RevealWords`, `SplitText`) — all honor `useReducedMotion()` and have CSS-level `@media (prefers-reduced-motion)` overrides. Clean.
- StickyContactBar — section-aware theme + `inert` attribute + `min-h-[44px]` on all buttons + rAF-throttled scroll listener. Exemplary.
- Mobile nav dialog — focus trap (Tab/Shift+Tab clamp + Esc), iOS-safe scroll lock (position:fixed + restore offset), restore focus on close. Exemplary.
- FAQAccordionList accessibility — `aria-expanded`, `aria-controls`, `role="region"` panel, hydration-safe deep-link seeding, Lenis-aware scroll. Clean apart from chip touch targets (above).
- Global focus outline — ignite 2px / 3px offset preserved on `:focus-visible`. Skip link present in layout. h1 hierarchy fine (hero sr-only h1, FAQ visible h1).
- Token system — well-organized, well-commented, paired with semantic classes. The hex literal in `BeforeAfterGallery.tsx:112` for the breathing radial is acceptable inside the component (the radial is unique to that section).

---

## P1 CRITICAL

### P1-a — FAQ chip jump-nav fails 44pt touch target
- **File:** `components/faq/FAQAccordionList.tsx:118-124`
- **ui-ux rule:** §2 `touch-target-size` — minimum 44×44pt (Apple) / 48×48dp (Material)
- **Evidence:** chip uses `inline-block rounded-full border border-white/10 px-3 py-1.5 text-xs ...` — at 12px font + 6px vertical padding × 2 = ~28px tall. Confirmed by reading the FAQ screenshot at the chip cloud zone.
- **Risk:** mobile users mis-tap; particularly costly on the FAQ page where chip-jump is the primary discovery mechanism for questions further down the list. Adjacent chips also share <8px gap (`gap-2` = 8px exactly — at the floor).
- **Fix sketch:** bump padding to `py-2.5 px-4` and add `min-h-[44px] inline-flex items-center`. Increase `gap-2` to `gap-2.5` (10px) for cushion.
```tsx
className="inline-flex items-center min-h-[44px] rounded-full border border-white/10 px-4 py-2.5 text-xs text-bone/80 hover:..."
```
Cross-check: ensure the increased chip height doesn't push the chip row to wrap onto an extra line in the design.

### P1-b — Footer link list dense beyond touch comfort on mobile
- **File:** `components/footer/Footer.tsx:43-58`
- **ui-ux rule:** §2 `touch-target-size` + `touch-spacing` — minimum 44pt + 8pt+ spacing
- **Evidence:** 17 footer links in a single `flex flex-col gap-2 text-sm` column. `gap-2` is 8px; with `text-sm` (14px) at the default leading the per-link vertical reach is roughly 14 + 8 = 22px. The links sit one-after-another with only an 8px gap between hit areas.
- **Risk:** very high mis-tap rate on mobile — particularly between adjacent premium-make links (Lamborghini / McLaren / Audi R8 / BMW M / Ferrari / Porsche), where the user trying to reach a specific make is likely to hit the one above or below.
- **Fix sketch:** on mobile, give each link a `block min-h-[44px] flex items-center` and increase column gap to `gap-3` (12px). Optionally split the link list into two visual columns at `md+` to reduce vertical run.
```tsx
<Link className="link-underline block min-h-[44px] flex items-center hover:text-bone transition-colors">
  Lamborghini
</Link>
```

---

## P2 HIGH

### P2-a — Hero glass card reads as invisible-vapor against the cinematic backdrop
- **File:** `components/hero/HeroVideo.tsx:177-186`
- **ui-ux rule:** §4 `style-match` + §1 `color-contrast` for the body text within the card
- **Evidence:** the desktop hero card uses `bg-white/[0.015]` (1.5% white tint) + `border-white/[0.06]` + `backdrop-blur-sm`. Against the cinematic poster + scrub video, the card is visually a *very* faint rectangle — the screenshot suggests it reads as a UI placeholder rather than a deliberate liquid-glass artifact. The lead text inside (`text-bone/90`) likely lands above 4.5:1 against the video frame at most points, but the *card boundary* doesn't establish itself enough to feel intentional.
- **Risk:** first impression. The hero is the page's most-viewed surface. A card that reads as half-rendered breaks trust before the first scroll.
- **Fix options (pick one):**
  - **(A) Commit to glass.** Replace the hand-rolled treatment with `<Surface variant="glass">`. Inherits the dark mid-alpha tint, the strong backdrop blur, and the layered ring + shadow that read as a deliberate artifact.
  - **(B) Embrace paper.** Use `Surface variant="light"` for the card with a slight off-axis tilt (`-rotate-1`) and a hand-drawn shadow — reads as a physical estimate paper laid against the dark hero.
  - **(C) Half-measure (lowest risk).** Bump to `bg-white/[0.05]` + `border-white/[0.12]` + `backdrop-blur-md` and accept it as "almost glass". Cheap; conservative.

### P2-b — Navigation desktop pill links at the 12px floor
- **File:** `components/nav/Navigation.tsx:171`
- **ui-ux rule:** §6 `readable-font-size` — text below ~13px on desktop reads as a watermark, not navigation
- **Evidence:** `text-xs uppercase tracking-[0.18em]` = 12px Hanken at 0.18em tracking. Against the dark backdrop with the blur scrim, this is at the AA threshold for both contrast (bone on dark glass) and density.
- **Risk:** users skim past the nav. Particularly costly because the nav is the only path to `/about`, `/faq`, `/contact` from non-homepage routes.
- **Fix sketch:** bump to `text-sm` (14px) and keep the tracking. Verify the pill width doesn't break at narrow desktop widths (1024–1180).

### P2-c — TrustStrip wordmarks at `text-ink/85` may fail AA at small size
- **File:** `components/home/TrustStrip.tsx:35`
- **ui-ux rule:** §1 `color-contrast` (4.5:1 normal, 3:1 large)
- **Evidence:** `font-display uppercase tracking-[0.10em] text-ink/85 text-sm md:text-base` — at `text-sm` (14px), the 85% ink alpha against paper (#F4F2EE) is **at or just under 4.5:1** depending on rendering. The middle-dot separators are `text-ink/25` (decorative, `aria-hidden`, fine).
- **Risk:** below-AA contrast on the trust strip — the first content beat after the hero — is a credibility hit.
- **Fix sketch:** drop the alpha — use `text-ink` (or `text-ink/95` if 100% feels too loud). Verify with a contrast checker (target ratio ≥ 4.5:1 on `text-sm`).

### P2-d — Hero h1 is `sr-only`; visual hierarchy depends on display-bleed without a semantic anchor
- **File:** `components/hero/HeroVideo.tsx:83-85`
- **ui-ux rule:** §6 `weight-hierarchy` + a11y `heading-hierarchy` (semantic vs visual)
- **Evidence:** the only `<h1>` on the homepage is screen-reader-only (`<h1 className="sr-only">Totaled. Paid in Full. — SP Automotive...`). The visual hero phrase ("Totaled." / "Paid in Full.") is rendered as two `<span class="display-bleed">` elements inside `SplitText`. SR users hear the h1; visual users see two display words with no heading semantics.
- **Risk:** mild but real. Reader-mode browsers (Safari Reader, accessibility tools that filter by heading) skip the visual hero entirely and read only the sr-only string. Edge-case SEO crawlers may rank the visual hero as decorative.
- **Fix options:**
  - **(A) Wrap the visible phrases in an actual `<h1>`** (preferred): change `SplitText`'s `as` prop from `"span"` to `"h1"` for either "Totaled." or "Paid in Full." (whichever is visually anchored), then drop the sr-only h1. Combined sr-only text moves to an `aria-label` on the section.
  - **(B) Leave as-is and document** in `design-system/pages/home.md` why the hierarchy is split (already done).

Option (A) is cleaner; option (B) is acceptable if there's a reason not to make the display-bleed an h1 (e.g., font-loading flicker on h1 swap).

---

## P3 MEDIUM

### P3-a — Hero card hover state barely registers
- **File:** `components/hero/HeroVideo.tsx:182-186`
- **ui-ux rule:** §7 `state-transition` — interactive surfaces must visibly respond
- **Evidence:** hover changes `bg-white/[0.015]` → `bg-white/[0.035]` (a 2% delta on a near-transparent surface), `shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)]` → `shadow-[0_36px_80px_-20px_rgba(0,0,0,0.65)]`, plus `-translate-y-1`. On most monitors, only the translate is perceptible.
- **Risk:** unclear that the card is interactive (it's a container with CTAs inside, but the whole card lifts). Affordance is weak.
- **Fix sketch:** bump hover tint to at least `hover:bg-white/[0.07]` and add a faint border brightness shift (`hover:border-white/[0.18]`). Once P2-a lands, this may resolve itself.

### P3-b — §06 background breathing radial: pauses out-of-view? No.
- **File:** `components/gallery/BeforeAfterGallery.tsx:115-135`
- **ui-ux rule:** §3 `main-thread-budget` — keep continuous animation gated to viewport
- **Evidence:** the `bag-pulse` animation runs at 8s ease-in-out infinite, transforming `scale(1) → scale(1.08)` + opacity. CSS-only transform/opacity, so it's compositor-promoted — but it runs whether the user is on §06 or scrolled past to §09. Reduced-motion path correctly pauses it.
- **Risk:** mild battery / GPU drain on long sessions, particularly on lower-end laptops. Not a CLS or INP issue.
- **Fix sketch:** wrap the pulse element with an `IntersectionObserver` and toggle a class that switches `animation-play-state` to `paused` when off-screen. Or accept the cost — the animation is compositor-only.

### P3-c — Homepage §08 (HomeFAQ) and `/faq` are two separate question lists
- **Files:** `components/home/HomeFAQ.tsx:16-41` (hardcoded 6) vs `lib/faq-data.ts` → `PUBLISHED_FAQS` (used by `/faq`)
- **ui-ux rule:** consistency — section content should not silently diverge from the canonical data source
- **Evidence:** editing the canonical FAQ source does not update the homepage section.
- **Risk:** copy drift. The homepage shows answers that may contradict `/faq` after content edits.
- **Fix sketch:** point `HomeFAQ` at `PUBLISHED_FAQS.slice(0, 6)` (or a `HOMEPAGE_FAQS` curated subset in `lib/faq-data.ts`). Maintain a single source of truth.

### P3-d — No `--spacing-*` tokens in `@theme`
- **File:** `app/globals.css:3-91`
- **ui-ux rule:** §5 `spacing-scale` — define a spacing scale rather than relying on framework defaults silently
- **Evidence:** the `@theme` block defines colors, fonts, type scale, tracking, leading, motion, z-index — but no `--spacing-*` aliases. Tailwind v4's 4px base is used implicitly.
- **Risk:** future contributors don't know the scale is intentional. Migrations or token-name changes have no anchor.
- **Fix sketch:** add a documentation-only block in `globals.css` and a "Spacing" subsection in MASTER.md (already drafted in §5 of MASTER.md). If you ever want token-driven spacing, declare `--space-1` through `--space-32` in the `@theme` block; otherwise keep the doc-only approach.

### P3-e — `--font-mono` aliased to Hanken (no actual mono yet)
- **File:** `app/globals.css:40-41`
- **ui-ux rule:** §6 `text-styles-system` — type roles should match visual intent
- **Evidence:** the `.spec` class (`globals.css:267-273`) sets `font-family: var(--font-mono)`, but `--font-mono` resolves to Hanken Grotesk today. The class still works (tabular figures + 0.04em tracking still differentiate), but it's not actually monospaced.
- **Risk:** when a true monospaced spec callout is finally needed (torque values, paint depths), the class won't render differently — invisible failure.
- **Fix sketch:** when ready, add JetBrains Mono or IBM Plex Mono via `next/font/google` and point `--font-mono` at it. Leave `--font-body` and `--font-editorial` on Hanken.

### P3-f — TrustStrip middle-dot separators may be too subtle in print preview
- **File:** `components/home/TrustStrip.tsx:39-43`
- **ui-ux rule:** §6 `weight-hierarchy` — separators should be visually distinguishable but not noisy
- **Evidence:** `text-ink/25` middle-dots at `text-sm`. Decorative, `aria-hidden`. On high-density screens they read fine; in print/PDF or low-density displays they may disappear.
- **Risk:** low. The carriers and makes lists may run together visually for some viewers.
- **Fix sketch:** none required unless print/PDF support becomes a priority. If so, swap to `text-ink/40`.

---

## P4 LOW

### P4-a — Navigation "Home" link redundant with logo
- **File:** `components/nav/Navigation.tsx:11`
- **Evidence:** the logo on the left is `<Link href="/">` and the nav pill also includes a "Home" link.
- **Fix sketch:** consider removing "Home" from the nav list. Saves space, lets the other items (Work / About / FAQ / Contact) breathe.

### P4-b — §04 ignite dot decoration is very small
- **File:** `components/home/BodyworkAndEstimates.tsx:155-159`
- **Evidence:** `inline-block size-1.5 rounded-full bg-ignite` = 6×6px dot beside "Written estimate".
- **Fix sketch:** if the intent is "this step is the high-value moment", consider `size-2` (8px) or pair with a subtle weight change on the label.

### P4-c — Footer "Explainers" eyebrow size override
- **File:** `components/footer/Footer.tsx:54`
- **Evidence:** `className="mt-2 eyebrow !text-[10px]"` — uses `!important` to push below the 11px eyebrow standard.
- **Fix sketch:** drop the override and let it render at the standard 11px. Or, if 10px is intentional for footer grouping, add a `.eyebrow--sm` class to MASTER.md so the pattern is documented.

### P4-d — Hero ignite-on-hover for the "send 3 photos" link
- **File:** `components/hero/HeroVideo.tsx:134, 208`
- **Evidence:** `hover:text-ignite` on the inline `link-underline` Link. This is one of the few legitimate hover-only ignite usages; documented in MASTER.md §2 as an allowed slot.
- **Fix sketch:** none — keep. Listing it for completeness so future audits don't flag this as "ignite on hover, anti-pattern".

---

## Verification (post-fix)

When the P1/P2 items are addressed, run:

1. **Lighthouse Accessibility** on `/` and `/faq` (Chrome DevTools, mobile + desktop profiles). Target ≥95 on both.
2. **Manual keyboard nav** — Tab through homepage hero → trust strip → §01 → §05 → §08 → §09 → Footer → Sticky bar. Confirm every focusable element has a visible outline; no traps; Esc closes any opened FAQ row.
3. **Reduced-motion check** — DevTools → Rendering → Emulate CSS prefers-reduced-motion: reduce. Confirm: §01 numerals land instantly, §02–§05 cards land instantly, hero shine animation pauses, §06 breathing radial pauses.
4. **375px viewport** — confirm no horizontal scroll, sticky bar visible after 1 viewport scroll, no touch-target collisions in footer or chip rows.
5. **Contrast spot-check** — paste the suspicious pairings into a contrast tool: TrustStrip wordmarks (`text-ink/85` on paper), §06 card text on the brightest phase of the breathing radial, navigation pill links (`text-bone` on `bg-black/40` blurred).
6. **VoiceOver pass on FAQ page** — confirm h1 ("Straight answers.") reads first, chip jump-nav announces as buttons (not links), opening a row announces the expanded state + answer text.

---

## Open questions for the team

- **Q1 — Hero card direction (P2-a):** glass-commit, paper-tilt, or half-measure? This is a design judgment; recommend (A) commit to glass via `Surface variant="glass"`.
- **Q2 — HomeFAQ vs PUBLISHED_FAQS (P3-c):** which is canonical? Recommend the data file wins; homepage should read first 6 from it.
- **Q3 — Footer link density (P1-b):** is a two-column footer at `md+` acceptable, or should the link list stay single-column? The current density is too high for mobile regardless.
- **Q4 — TrustStrip alpha (P2-c):** is the 85% intentional softness, or accidental? If intentional, this audit accepts losing some contrast for tone — but verify with a contrast check first.

---

## How to use this audit

1. Read the executive summary.
2. Each finding cites a file:line and a ui-ux rule slug. If you disagree, push back here (or in the PR that fixes it) — not all findings will be accepted.
3. P1 items should ship before launch. P2 should ship soon after. P3 can sit in a follow-up sprint. P4 is optional / discretionary.
4. The MASTER.md `Pre-delivery checklist` (§12) is the regression check — keep that green when shipping.
