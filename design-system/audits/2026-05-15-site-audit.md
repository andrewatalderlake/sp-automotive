# SP Automotive — Site Audit (v1/ui-polish)

**Date**: 2026-05-15
**Branch**: `v1/ui-polish`
**Scope**: Homepage (11 sections) · global chrome (layout, nav, footer, sticky CTAs, SEO/404, effects) · 6 sub-page categories (about, contact, estimate, faq, builds + slug, 6 brand landers, 3 explainers)
**Total findings**: 127 (1 Critical · 25 High · 65 Medium · 36 Low)

Detailed per-area findings live in:
- `/tmp/sp-audit-homepage.md` (49 findings, 11 sections)
- `/tmp/sp-audit-chrome.md` (30 findings)
- `/tmp/sp-audit-subpages.md` (48 findings)

This file is the executive synthesis: anti-pattern verdict, cross-cutting issues, and a prioritized action plan.

---

## 1. Anti-Patterns Verdict — PASS, with caveats

**The site is not AI slop.** The design system is genuinely distinctive: Anton + Hanken pairing (not Inter, not Space Grotesk), ink/paper/bone/ignite palette (not purple gradient on white), brake-light accent discipline, hairline-divider editorial rhythm, "workshop cinema × owner's manual" voice. Implementation honors that vision across the majority of the surface area.

**But specific AI-slop tells are leaking through and need to be killed before launch:**

| Tell | Where | Severity |
|---|---|---|
| Agency boilerplate eyebrow `"Authorized-grade body work"` on all 6 brand pages | `components/brand/brands-data.ts` | High |
| Duplicated closing phrase `"the shop the dealer should have sent you to"` (verbatim in lambo + ferrari intros) | `brands-data.ts` | High |
| Unverified placeholder stats shipping in `AboutStrip` (`4 yrs at the bench`, `15+ exotics restored`, `100%`, `0`) — comment literally says "verify with Serge before launch" | `components/about/AboutStrip.tsx:11-19` | High |
| Generic form placeholders `"Your name"` / `"you@domain.com"` — the exact agency-default copy the voice guide is built against | `app/contact/ContactForm.tsx:172` | Medium |
| Slogan-voice headline `"Inside. Always."` in StorageBlock — closer to perfume-ad than owner's-manual | `StorageBlock.tsx:99` | Medium |
| `hover:text-ignite` on multiple links — burns the documented "ignite is brake-light, never on hover, never on body" rule (3 instances) | `HeroVideo.tsx:135, :208`; `TrustStrip.tsx:51` | High |
| Generic `MessageSquare` icon on SmsCTA — chat-bubble metaphor when the CTA's whole purpose is "send photos" (camera icon would land it) | `components/ui/SmsCTA.tsx:2, 39` | Medium |
| `"// Selected work"` eyebrow violates the documented `//`-vs-plain-uppercase convention for utility-section labels | `FeaturedBuilds.tsx:77-78` | Low |

None of these are fatal. They're the difference between "polished v1" and "you can tell this was built carefully."

---

## 2. Executive Summary — top 5 most important

Prioritized from across all three reports:

1. **🔴 CRITICAL — `SITE_URL` is `sp-automotive.vercel.app`** (`lib/site.ts:8`). Flows through `metadataBase`, sitemap, robots, JSON-LD, and OG. A `TODO` exists but is unresolved. Indexes the wrong host; OG cards render from preview origin once production launches. **Launch-blocker.**

2. **🟠 HIGH — Systemic `text-graphite` contrast failure** (~3.9-4.3:1, fails WCAG AA at body sizes). Affects TrustStrip, InsuranceHandling closing line, `/contact` aside, `/builds`, BrandHero, and more. AGENTS classifies graphite as "body, secondary" but at this contrast it should be reserved for ≥14px bold or ≥18px normal. Recurring WCAG 1.4.3 failure.

3. **🟠 HIGH — Autoplay videos run uncontrolled across the page.** `AmbientVideo` + `ProgressiveBlur` in HowItWorks compound 5 backdrop-blur layers + continuous video decode regardless of viewport visibility. Same pattern in BodyworkAndEstimates, and the Footer paints a red ambient video site-wide. Mobile battery + composite cost.

4. **🟠 HIGH — Brand voice violations on the 6 SEO landing pages.** "Authorized-grade body work" + duplicated closing phrases + missing canonicals + unverified stats. These are the highest-intent search-traffic pages; the boilerplate-feeling copy and missing canonical hygiene are the worst combination for the page-type.

5. **🟠 HIGH — Heading-hierarchy decoupling on the homepage.** HeroVideo's `<h1>` is `sr-only` while the visible "Totaled. Paid in Full." is `<span>` (the two strings even differ); StorageBlock's `<h2>` is "Inside. Always." while the more-informative "Climate-controlled storage" is just a `<p>` label. Screen-reader heading outline doesn't match what sighted users see.

---

## 3. Cross-cutting / Systemic Issues

These patterns repeat across multiple files and should be fixed once at the system level rather than per-occurrence.

### S1. `text-graphite` body copy fails WCAG AA — change at the token or usage level
- **Files**: ~10+ locations
- **Fix path**: Either darken `--color-graphite` from `#6E727A` to ~`#5A5E66` globally (cleanest), OR change the convention to reserve graphite for eyebrows/labels only and shift body to `text-bone/85` on dark and `text-ink/80` on paper.

### S2. `hover:text-ignite` burns the brake-light accent
- **Files**: `HeroVideo.tsx:135, :208`, `TrustStrip.tsx:51`
- **Fix path**: Drop the hover-color shift; `link-underline` already provides hover affordance. AGENTS is explicit: "ignite is brake-light. Never on hover. Never on body."

### S3. Autoplay videos lack IntersectionObserver gating
- **Files**: `components/effects/AmbientVideo.tsx` (used by HowItWorks, BodyworkAndEstimates), `components/footer/Footer.tsx`
- **Fix path**: Add IO inside `AmbientVideo`: pause + remove `src` when out of view, resume on re-entry. Reduced-motion path already shows a poster (good — extend that gating to default).

### S4. `TextScramble` announces mid-scramble characters to screen readers
- **Files**: `TheMath.tsx` (3 numerals), `AboutStrip.tsx` (4 stats)
- **Fix path**: Mirror `SplitText`'s pattern (`SplitText.tsx:173`). Wrap the scrambling visual in `aria-hidden="true"` and render a sibling `<span class="sr-only">` with the canonical value.

### S5. Missing canonical URLs on key SEO pages
- **Files**: `/about`, `/contact`, `/builds`, all 6 brand landing pages
- **Fix path**: Add `alternates: { canonical: ... }` to each page's metadata, OR generate canonicals from the `BrandPage` template for marque routes.

### S6. Hardcoded white-alpha values instead of `bone` tokens
- **Files**: `border-white/10` (AboutHero, EditorialImageSlot, BrandServices, BrandModels, contact aside), `hover:border-white/30` (HowItWorks), `bg-white/[0.02]` (FAQ pill, contact aside)
- **Fix path**: Replace with `border-hairline` or `border-bone/10` / `border-bone/15` / `bg-bone/[0.02]`. Bone has a warm cast; pure white reads cooler against ink — these drift over time.

### S7. Heading hierarchy degraded on multiple sections/pages
- **Files**: `HeroVideo.tsx:84-86` (sr-only h1 decoupled), `StorageBlock.tsx:57/91-99` (label as `<p>`, less-info h2), `FAQExplorer.tsx:254-260` (h2 disappears under filter), `FinalCTA.tsx:21,31` ("Next move" as `<p>` not h2), `explainers/oem-parts/page.tsx:42-141` (article + sibling section)
- **Fix path**: Per-file fixes; no system-level change needed. Worth a single pass.

### S8. Form UX gaps shared between `/contact` and `/estimate`
- Sequential photo upload (await in loop), no file thumbnails, no phone format validation beyond non-empty, success state doesn't scroll into view, no `required` on file input
- **Fix path**: Parallelize uploads with `Promise.allSettled`; add `URL.createObjectURL` thumbnails; soft-validate phone (≥10 digits after stripping); `el.scrollIntoView` + `focus()` on success; add `required` to file input.

---

## 4. The single Critical issue (launch blocker)

**`SITE_URL` is a vercel.app preview domain**
- **Where**: `lib/site.ts:8`
- **Standard**: General SEO hygiene
- **Impact**: Every canonical, OG `url`, sitemap entry, JSON-LD `url`/`image`, and `metadataBase` resolves to the preview origin. Indexes the wrong host, scatters PageRank, renders WhatsApp/iMessage OG cards from the preview domain after production launches.
- **Fix**: Gate on `NODE_ENV`/`VERCEL_ENV` — production → `https://sp-automotive.com` (or chosen apex). The existing `TODO` comment is the marker.

---

## 5. High-severity issues (the 25)

Grouped for fixing in clusters.

### 5a. Brand discipline (5)
- `hover:text-ignite` × 3 (HeroVideo, TrustStrip) — see S2
- Footer red ambient video + ink/75 scrim tints the bottom of every page with ignite-derived hue (`Footer.tsx:13-29`) — competes with the brake-light reserve rule. Consider neutral grade or poster-only.
- "Authorized-grade body work" eyebrow on all 6 brand pages — boilerplate + trademark risk

### 5b. Accessibility — heading & landmark hierarchy (4)
- HeroVideo h1 decoupled from visible "Totaled. Paid in Full." (`HeroVideo.tsx:84-86`)
- StorageBlock label/heading inversion (`StorageBlock.tsx:57, 91-99`)
- Hamburger missing `aria-controls`/`aria-haspopup`; mobile dialog rendered inside `<header>` (`Navigation.tsx:199-212`)
- Nav `<nav>` has no `aria-label`, dialog has no orientation hint (`layout.tsx:64`)

### 5c. Accessibility — contrast and visibility (3)
- AboutStrip inline links (Lamborghinis/McLarens/R8s) — `link-underline` only paints on hover; invisible at rest in body prose (WCAG 1.4.1)
- Nav links rely on 1px `link-underline` over `bg-black/40 backdrop-blur-md` — focus indistinguishable from rest (`Navigation.tsx:187`)
- Systemic graphite contrast — see S1

### 5d. Accessibility — interactive semantics (2)
- StickyContactBar Call uses `<button onClick=window.location.replace>` instead of `<a href="tel:">` — defeats long-press, drag-to-save, right-click; same in `PhoneCTA`. Acceptable trade-off documented for desktop hover-card avoidance, but breaks AT and JS-disabled paths.
- StickyContactBar `inert` prop has known Safari ≤16 partial-support footgun (the file itself flags this concern)

### 5e. Performance (4)
- HowItWorks compound autoplay+ProgressiveBlur (5 backdrop-blur layers) always on (`:81-84, :161-165`)
- BodyworkAndEstimates AmbientVideo no IO gating (`:90-93`)
- `/builds/[slug]` BeforeAfterCompare uses deprecated `priority` on BOTH images (`BeforeAfterCompare.tsx:60`) — only one image can be LCP; also `priority` is the deprecated alias for `preload` in Next 16
- Hero scroll listener never unsubscribes after hero scrolls out of view (`HeroVideo.tsx:48-68`)

### 5f. SEO (3)
- `SITE_URL` preview domain (Critical, above)
- Missing canonicals on 6 brand pages + 3 other pages — see S5
- OG image (`app/opengraph-image.tsx:21`) uses `fontFamily: "sans-serif"` — no Anton registered; social cards render off-brand

### 5g. Voice / content (3)
- AboutStrip placeholder stats shipping to production (`AboutStrip.tsx:11-19`)
- "Authorized-grade" boilerplate + duplicated closing phrases on brand intros (see Anti-Patterns table)
- "We come to you." (BodyworkAndEstimates h2) is verbatim step 02 of HowItWorks in the very next section

### 5h. Footer / theming (1)
- Footer is visually dark but not tagged `data-theme="dark"` — StickyContactBar reads it as light and paints paper-treatment chrome over an ink/75 scrim (`Footer.tsx:13`). One-line fix.

---

## 6. Medium-severity highlights (the 15 worth surfacing now)

The full list is in the per-area reports. These are the ones that materially affect polish:

- **TheMath**: "of ACV" caption abbreviates without expansion (use `<abbr>` or expand to "of actual cash value")
- **InsuranceHandling**: graphite closing line ("You don't sit on the phone…") borderline AA at body size
- **StorageBlock**: "Inside. Always." voice violation; coda dangles after centered hero
- **BodyworkAndEstimates**: AmbientVideo card has no text affordance (info disparity for AT users); "within an hour's drive" contradicts FAQ "all of Florida"
- **HowItWorks**: connector hairline `bg-bone/15` at ~1.2-1.5:1 (WCAG 1.4.11); `hover:border-white/30` uses raw white
- **FeaturedBuilds**: nested interactive — whole card is a `<Link>` with a fake "View build →" pseudo-button inside; both stock+kit images load at full quality on mount
- **AboutStrip**: TextScramble AT issue (S4); "Every weld" narrows the signature claim oddly for a collision shop
- **HomeFAQ**: `onToggle` close-others race; one rhetorical answer ("real schedule, not a placeholder")
- **FinalCTA**: section has no `aria-labelledby`; restates the hero CTA beat without adding a new fact
- **Nav**: mobile dialog drops the SMS CTA; logo uses unnecessary `priority`
- **Footer**: 13-link "link soup" right-aligned with no information architecture
- **StickyContactBar**: IO doesn't re-key on `pathname` (one-line `}, [hidden, pathname]);`); no dismiss affordance on long content pages
- **SmsCTA**: body string `"Photos of damage:"` has no trailing space — first char user types lands flush against the colon (`lib/site.ts:6`)
- **/builds/[slug]**: two ignite accents (BuildHero mono kit line + BeforeAfterCompare pill) — pick one
- **/explainers/***: "Explainer · 01/02/03" chapter numerals (retired homepage convention 2026-05-14); article-then-sibling-section landmark split

---

## 7. Positive findings — preserve these

- **Design system is genuinely distinctive**: Anton + Hanken, ink/paper/ignite, hairline rhythm. Not a generic AI aesthetic.
- **Brand pages are properly templated** — all 6 marques are 15-line wrappers around `components/brand/BrandPage.tsx`. No code duplication, only content drift (which is fixable).
- **Forms have solid a11y bones**: `aria-invalid`, `aria-describedby`, first-error focus, persistent `aria-live` region in FAQ. Better than typical agency work.
- **Sub-pages default to server components** — no unnecessary `"use client"`.
- **Reduced-motion handling is mostly correct**: SplitText, ScrubVideo, IntersectionObserver-driven reveals, AmbientVideo all have reduced-motion paths. Just needs the gaps closed (TextScramble, ProgressiveBlur).
- **Explainer voice (especially `/explainers/oem-parts`) is the on-brand tone the brand-page intros should imitate.** Declarative, technical, no hedging. Use as the reference.
- **Selection color** (`::selection` → ignite red on ink) is the right kind of unexpected detail — preserve.

---

## 8. Recommendations by priority

### 🔴 Immediate (launch-blocker)
1. Environment-gate `SITE_URL` in `lib/site.ts` for production
2. Verify or replace the 4 AboutStrip stats — pull the "verify with Serge" comment

### 🟠 Short-term (this sprint, before launch)
3. Kill the 3 `hover:text-ignite` instances
4. Rewrite the "Authorized-grade" eyebrow and the duplicated brand-intro closing phrases
5. Add canonicals to /about, /contact, /builds, and all 6 brand pages
6. Add `data-theme="dark"` to footer root (one-liner)
7. Promote one of HeroVideo's visible SplitText spans to `<h1>`
8. Fix StorageBlock heading inversion
9. Add IO gating inside `AmbientVideo`; conditionally render ProgressiveBlur in HowItWorks
10. Wire `aria-controls` + `aria-haspopup` on the hamburger; relocate the mobile dialog out of `<header>`
11. Fix `BeforeAfterCompare` — single `preload`, not both `priority`
12. Register Anton in `app/opengraph-image.tsx`
13. Add trailing space to `SMS_HREF` body string (`lib/site.ts:6`)
14. Add `data-theme="dark"` to footer; re-key StickyContactBar IO on `pathname`

### 🟡 Medium-term (next sprint, post-launch quality)
15. Decide the graphite contrast fix — token darken vs. usage convention (S1)
16. Replace `border-white/X`, `bg-white/[0.02]` with bone-token equivalents (S6)
17. Mirror SplitText's sr-only pattern in `TextScramble` (S4)
18. Form UX: parallelize uploads, add thumbnails, scroll success into view, soft phone-validate (S8)
19. Footer information architecture: split 13 links into labelled sub-navs
20. Replace `MessageSquare` with `Camera` icon in `SmsCTA`
21. Reconcile geographic copy ("within an hour" vs. "all of Florida")
22. Differentiate `BodyworkAndEstimates` h2 from HowItWorks step 02

### 🟢 Long-term (polish, debt, nice-to-haves)
23. Drop redundant `priority` on the logo
24. Disconnect IntersectionObservers after first intersect across all sections
25. Extract `ExplainerPage` template (currently 3× duplicated layout)
26. `BeforeAfterCompare` — either rename or actually make it a slider
27. Add multi-angle photography support to `/builds/[slug]`
28. Drop dead `--rule-progress` setter and `--ruleRef` fallback in TheMath
29. Address `existsSync` server-side filesystem dependency before any edge migration
30. Add `<h2 class="sr-only">Filtered results</h2>` in FAQ filter mode

---

## 9. Suggested commands for fixes

The user's installed `impeccable` and adjacent skills map onto these clusters:

| Command | Addresses |
|---|---|
| `/impeccable:normalize` | Token drift (S6: `border-white/10` → `border-hairline`), graphite contrast convention (S1), `hover:border-white/30` → `hover:border-bone/30` |
| `/impeccable:harden` | A11y wiring (hamburger `aria-controls`, heading hierarchy fixes, form `required`/AT improvements, StickyContactBar `inert` belt-and-braces) |
| `/impeccable:optimize` | Autoplay IO gating (S3), `BeforeAfterCompare` priority, scroll listener lifecycle, conditional ProgressiveBlur |
| `/impeccable:clarify` | Brand-page copy rewrites ("Authorized-grade", duplicated closing phrases), AboutStrip stat verification, "Inside. Always." → owner's-manual voice, FinalCTA new commitment line |
| `/impeccable:quieter` | Footer red ambient video grade-down; the page-wide ignite tint problem |
| `/impeccable:typeset` | "Explainer · 01" chapter-numeral retirement; `// Selected work` → `Selected work` |
| `/impeccable:delight` | FinalCTA "one new concrete commitment" line; SmsCTA icon swap; 404 surface routes |
| `/impeccable:arrange` | Footer link soup → 3 labelled sub-navs |
| `seo-audit` skill | Canonicals, sitemap completeness (Ferrari/Porsche verification), robots disallow for `/api/*`, JSON-LD enrichment (image, aggregateRating, datePublished) |
| `geo-citability` skill | Explainer datePublished/dateModified for AI citability |

`/impeccable:critique` would be the loop-back: re-audit a section after a fix cluster lands.

---

## 10. Pointers — where the verbose findings live

- **Homepage** (49 findings, 11 sections, per-section verdict): `/tmp/sp-audit-homepage.md`
- **Chrome** (30 findings, 7 areas): `/tmp/sp-audit-chrome.md`
- **Sub-pages** (48 findings, 10 pages + cross-cutting): `/tmp/sp-audit-subpages.md`

These are the source-of-truth detail files. This synthesis is the action plan.
