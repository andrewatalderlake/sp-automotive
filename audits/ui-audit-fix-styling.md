# UI Audit — `fix/styling` branch

**Scope:** forms (`/contact`, `/estimate`), editorial pages (`/about`, `/process`, `/faq`, `/explainers/*`), brand vehicle pages (`/audi-r8…`, `/mclaren…`, `/lamborghini…`), and system-wide concerns (tokens, motion, primitives, navigation, footer). Out of scope by request: `/` and `components/home/*`.

**Method:** code-only review against ui-ux-pro-max rule categories. No browser testing. Contrast ratios are computed analytically from token hex values.

**Severity counts:** Critical 8 · High 13 · Medium 11 · Low 6 · Token-migration items 30+

---

## Executive summary

1. **The new design system tokens (`bone`, `ink`, `steel`, `ignite`, `graphite`) are defined cleanly in `app/globals.css`, but every audited page outside `components/home/*` is still on the back-compat aliases** (`text-accent`, `bg-bg`, `text-text`, `text-muted`, `bg-surface`, `border-divider`, etc.). This is the single largest blocker to the system "holding": a future change to an alias will silently move 30+ files.

2. **`components/ui/Button.tsx` is below the 44pt minimum hit area** at default size (`px-6 py-3` ≈ 38–42px). Used by the form submit, the desktop nav phone CTA, the not-found page, and every `<Button variant="ghost">` (SMS CTA). This is a Critical accessibility/touch issue.

3. **Form errors are placed at the bottom of the form, not next to the invalid field, and submit failure does not move focus to the first invalid field.** Both `ContactForm` and `EstimateForm` violate `error-placement` and `focus-management`. They also lack required-field indicators and `aria-invalid`/`aria-describedby` linking.

4. **Mobile navigation is a `role="dialog"` without focus trap, Escape-to-close, body-scroll lock, or backdrop-click dismiss.** Keyboard users can tab out into the page underneath.

5. **No active-page indicator in the nav.** Users on `/faq` see no visual signal that "FAQ" is current — `nav-state-active` violation.

6. **Body-text contrast is borderline on dark theme.** `--color-graphite` (#6E727A) on `--color-ink` (#0E0F11) measures ≈ 4.05:1 — **fails WCAG AA 4.5:1 for normal text**, passes 3:1 large-text only. Used heavily for `.eyebrow`, `.annotation`, `.spec`, `text-muted` (footer copy, helper text, annotations across the site). On steel cards (`#2A2D32`) the same pair drops to ≈ 3.13:1.

7. **`BrandModels` cards have `data-cursor="Open"` and `hover:border-accent` but are not links** — they don't navigate or do anything. False affordance: looks clickable, isn't.

8. **Magnetic and CustomCursor are correctly gated on `pointer: coarse` and `prefers-reduced-motion`,** but `Magnetic` is rendered per item inside `BrandModels`, attaching one `mousemove` window listener and `requestAnimationFrame` loop **per model card**. On a desktop with 8–12 models this is wasteful.

9. **Form error color is `text-red-400`** (Tailwind default), not the system's `--color-ignite` (#C8281D). Breaks both the brand discipline and the token system.

10. **The Button component's focus ring uses `ring-accent` (bone)** while `globals.css` `:focus-visible` declares `outline: 2px solid var(--color-ignite)` (red). The button explicitly disables outline (`focus:outline-none`) and substitutes a bone ring — inconsistent with the rest of the site.

---

## CRITICAL

**[CRITICAL] `components/ui/Button.tsx:15`** — Default button size is `px-6 py-3 text-sm` ≈ 38–42px tall. Below the 44pt iOS / 48dp Material minimum. Affects form submit, SMS CTA (ghost), nav phone CTA (default), `not-found.tsx` button, every other place a default-size Button renders. **Fix:** raise default to `py-4` (≈ 48px) or add a `min-h-[44px]` floor; the `lg` size used by hero CTAs is fine (`py-5 ≈ 56px`).

**[CRITICAL] `components/nav/Navigation.tsx:86–112`** — Mobile menu opens as `role="dialog" aria-modal="true"` but: no focus trap, no Escape-to-close, no body scroll lock, no backdrop dismiss. Keyboard users can tab out of the dialog into the page underneath. **Fix:** trap focus with a small custom hook or a library (Radix `FocusScope`, react-focus-lock); add `useEffect` listener for `Escape`; toggle `document.body.style.overflow = 'hidden'` while open; add an explicit close affordance on tap-outside (the current `<div className="fixed inset-0">` is the dialog itself, no scrim layer to tap-out of).

**[CRITICAL] `components/nav/Navigation.tsx:60–69`** — Nav links have no active-page state. `text-text hover:text-accent` doesn't change for the current route. Users lose orientation. **Fix:** read `usePathname()` (already imported on line 21) and apply `text-accent` (or a bottom hairline) when `pathname === l.href || (l.href !== '/' && pathname.startsWith(l.href))`.

**[CRITICAL] `app/contact/ContactForm.tsx:55–58` and `app/estimate/EstimateForm.tsx:53–62`** — On submit validation failure, a single generic error renders at the bottom of the form ("Fill in every field except photos."). User can't tell which field is wrong. **Fix:** track per-field error state, render errors directly below each input via `aria-describedby`, and on submit failure call `.focus()` on the first invalid input.

**[CRITICAL] `app/contact/ContactForm.tsx`, `app/estimate/EstimateForm.tsx`** — No `aria-invalid` is set on invalid fields, and no `aria-describedby` links a field to its error message. Screen readers can't associate the error with the right input. **Fix:** when a field fails validation, set `aria-invalid="true"` and `aria-describedby={`${id}-error`}` on the input; set the error `<p id={`${id}-error`}>` next to the input.

**[CRITICAL] Contrast — `--color-graphite` on `--color-ink`** (≈ 4.05:1 — fails WCAG AA 4.5:1 for body text). Surfaces:
- All `.eyebrow` (`globals.css:149`) — used as section labels site-wide
- All `.annotation` (`globals.css:159`)
- All `.spec` (`globals.css:209`)
- `text-muted` mapped to graphite — used for footer copy (`Footer.tsx:24,25,33,38`), helper text in forms (e.g. `ContactForm.tsx:166,176,181`), explainer "FAQ" link (`adas/page.tsx:126`, etc.), and the entire nav phrase below brand hero (`BrandHero.tsx:17`).

The Cinema/Owner's-Manual aesthetic intentionally pulls toward greyscale, but the result is that *every small label and every helper line on the site* is at-risk for AA. **Fix options (pick one):**
- Bump graphite toward bone: change `--color-graphite` to ~`#878B92` (≈ 5.0:1) — breaks the warm-grey character slightly.
- Keep graphite for accents/dividers only; introduce a `--color-graphite-strong` (~`#9A9EA5`, ≈ 6.3:1) and remap `text-muted` and the body-text role of `.eyebrow`/`.annotation`/`.spec` to it. Preserves the aesthetic for hairlines while making text legible.

**[CRITICAL] Contrast — graphite on steel cards** (≈ 3.13:1). Any `text-muted` placed inside an elevated surface (`bg-surface`/`bg-steel`) is below AA-large for normal text. Surfaces include `EditorialImageSlot` placeholder labels (`text-muted/60` — even worse, ≈ 1.9:1), brand service cards if helper text were added, etc. **Fix:** as above, plus avoid `text-muted/60` for any text — use `text-muted/100` and let the muted token itself carry the dimming.

**[CRITICAL] `app/contact/ContactForm.tsx:172–173`, `app/estimate/EstimateForm.tsx:159–160`** — Error message uses `text-red-400` (Tailwind default `#F87171`), not the system's `--color-ignite` (`#C8281D`). Hardcoded color escapes the design system, and the brake-light discipline says ignite *is* the system's red. **Fix:** replace with `text-ignite` (or a dedicated `text-error` token mapped to ignite).

---

## HIGH

**[HIGH] `components/ui/Button.tsx:15`** — Button focus ring is `focus-visible:ring-2 focus-visible:ring-accent` (bone). `globals.css:288` declares the global focus baseline as `outline: 2px solid var(--color-ignite)` (red). The Button explicitly disables outline and substitutes bone, breaking the site-wide focus convention. **Fix:** remove `focus:outline-none` and the custom ring; let the global ignite outline apply. Or, if a ring is preferred for the button shape, change to `ring-ignite`.

**[HIGH] `components/brand/BrandModels.tsx:14–26`** — Each `<li>` wraps a `<div>` with `data-cursor="Open"` and `hover:text-accent` *but contains no link or onClick*. The cursor label shows "Open", the border highlights, the user clicks — nothing happens. False affordance. **Fix:** either wrap in `<Link>` to a model-specific anchor or model page; or remove the `data-cursor`, `hover:border-accent`, and `hover:text-accent` so the cards read as static chips. Decide the intent first.

**[HIGH] `components/brand/BrandModels.tsx:16`** — `<Magnetic>` wraps every model. Each instance attaches a `mousemove` listener on `window` and runs a per-frame `rAF` loop that calls `getBoundingClientRect()`. With 8–12 models this is 8–12 listeners + rAF loops persistently on. Even gated on coarse-pointer, desktop pays the full cost. **Fix:** delegate to a single shared `mousemove` handler in a context, or only attach the listener when the cursor is within a reasonable bounding box of the section.

**[HIGH] `components/brand/BrandServices.tsx:14–26`** — Capability cards have `hover:border-accent transition-colors` but aren't actionable. Less severe than `BrandModels` because there's no `data-cursor`, but the hover border still telegraphs interactivity. **Fix:** drop the `hover:border-accent` (cards are static informational); or wrap each in a `<Link>` to a relevant explainer (ADAS card → `/explainers/adas`, paint card → `/explainers/paint-match`, etc.).

**[HIGH] `app/contact/ContactForm.tsx`, `app/estimate/EstimateForm.tsx`** — Required fields are marked with the HTML `required` attribute but no visible indicator (asterisk or "Required" tag). `required-indicators` rule. **Fix:** add a small `<span aria-hidden className="text-ignite">*</span>` to required-field labels, with a single-line legend at the top (e.g. "*Required").

**[HIGH] `app/contact/ContactForm.tsx`, `app/estimate/EstimateForm.tsx`** — No inline validation. Email format isn't checked client-side until submit, despite `type="email"` providing free format validation if `noValidate` were removed. `noValidate` is set on both forms (`ContactForm.tsx:115`, `EstimateForm.tsx:115`). **Fix:** validate on blur, not keystroke; show errors only after a field has been touched and submit attempted; relax `noValidate` if you'd rather lean on the browser's `:invalid` styling for free.

**[HIGH] `app/contact/ContactForm.tsx:172–186`, `app/estimate/EstimateForm.tsx:159–173`** — On submit error, the form renders the message and leaves the user staring at the same disabled-no-longer button. No retry CTA, no "Edit your message" guidance. The fallback "Please call directly" is good copy but the user has to find the still-rendered phone CTA at the top of the page on their own. **Fix:** when status is `error`, render an explicit "Try again" button next to the message that re-triggers `handleSubmit`. Keep the inline phone link as a recovery path.

**[HIGH] `components/about/AboutStory.tsx:119,129,134`, `components/brand/BrandModels.tsx:19`, `components/brand/BrandServices.tsx:24`** — `text-text/85`, `text-text/90` use a back-compat token (`text-text` → bone) with Tailwind alpha modifiers. Fine functionally but couples 6+ files to the alias name. **Fix:** replace with `text-bone/85` etc. directly when migrating off the alias.

**[HIGH] Token migration scope.** Components below still reference back-compat tokens (`text-accent`, `bg-bg`, `text-text`, `text-muted`, `bg-surface`, `border-divider`, `border-accent`, `hover:text-accent`, `hover:border-accent`, `text-bg`). Migration list at the end of the report. The aliases are documented as transitional (`globals.css:18–28`), but until everything is migrated, any change to the alias map (e.g. someone "fixes" `--color-accent` to point at ignite to honor the brand-red comment) will turn dozens of headlines and link hovers red.

**[HIGH] `app/layout.tsx:58`** — Skip-link uses `focus:bg-accent focus:text-bg`. Functionally fine (bone background, ink text — high contrast). But the skip-link is one of the most visible accessibility surfaces and currently couples to back-compat tokens. **Fix:** change to `focus:bg-bone focus:text-ink` after migration.

**[HIGH] `components/effects/CustomCursor.tsx:167–174`** — Injected `<style>` tag forces `cursor: none !important` on every element except `input`/`textarea`/`select`/`[contenteditable]`. The `!important` overrides any browser-extension or assistive-tool override. The hook gates on `pointer: coarse` and `prefers-reduced-motion`, but if a user has a fine pointer with assistive tooling that depends on the system cursor (e.g., mouse-tracking utilities), they're forced into `cursor: none`. **Fix:** drop `!important` (the specificity rules already favor your selector); or expose a localStorage opt-out (`data-cursor-system="show"` → conditionally suppress the style).

**[HIGH] Mobile menu — `components/nav/Navigation.tsx:86–112`** — When open, the `<header>` underneath is not `inert` and the body keeps scrolling. **Fix:** apply `inert` to siblings or add `overflow: hidden` to `body` while open; both are one-line additions inside the existing `useState` flow.

**[HIGH] `components/effects/CustomCursor.tsx`** — On keyboard-only navigation, the custom cursor stays at its last position; the spotlight doesn't move with focus. Visually the user sees a stationary highlight. **Fix:** on `focusin`, recompute spotlight position from `event.target.getBoundingClientRect()` so the spotlight tracks tab order.

**[HIGH] `components/process/CraftCanvas.tsx:31–38`** — `useFallback = reduced || coarse` — *any* coarse pointer (touch laptops, Surface devices) skips the WebGL bundle entirely. Reasonable for perf, but the fallback (`CraftCanvasFallback`) is currently a placeholder block ("Assembled — pending"). Fine until launch, but on a launch-ready site the fallback should be a still photo of the assembled exotic, not a placeholder. **Fix:** ship a real photo of an assembled car for the fallback before launch (`/about/serge-portrait.webp`-style pattern would work — `EditorialImageSlot` falls back to the placeholder only if the file is missing).

---

## MEDIUM

**[MEDIUM] `app/explainers/adas/page.tsx:81`, `app/explainers/oem-parts/page.tsx:74`, `app/explainers/paint-match/page.tsx:78`** — `<h2>` uses `!mt-14` (Tailwind `!important`). The override is needed to push past the `space-y-7` spacing of the `.editorial` parent. **Fix:** wrap the prose in two separate blocks (one before each h2) instead of using `!important`. Or define a `.editorial-section-break` class in globals.css.

**[MEDIUM] `components/footer/Footer.tsx`** — No copyright/year line, no street address. JSON-LD has the structured address but the visible footer doesn't. For a brick-and-mortar service business this is a trust gap. **Fix:** add a `<small className="text-muted text-xs">© {new Date().getFullYear()} SP Automotive · 1234 Example Rd, Sarasota, FL 34233</small>` row; pull values from `lib/site.ts` to keep them DRY with the JSON-LD.

**[MEDIUM] `components/ui/PhoneCTA.tsx:24` vs `components/ui/SmsCTA.tsx:18`** — `PhoneCTA` renders a `<button>` and uses `window.location.replace("tel:…")`. `SmsCTA` renders an `<a href="sms:…">`. The reasoning for the button (avoid Chrome's hover card) is valid, but the asymmetry means the SMS link works without JS while the phone CTA doesn't. **Fix:** if the Chrome hover-card is the only blocker, render `<a>` everywhere and accept the hover-card on desktop (most users tap it on mobile, where the card doesn't appear). If keeping the button, render an `<a>` fallback inside `<noscript>`.

**[MEDIUM] `components/process/ProcessNarrativeMobile.tsx:22–28`, `components/testimonials/TestimonialsSection.tsx:27–43`** — `motion.article` / `motion.li` with `whileInView` rely on the global `prefers-reduced-motion` CSS reset (`globals.css:298–305`) to neutralize the animation. This works for `transition-duration` but Framer Motion writes `animate` props imperatively; the CSS override only catches CSS transitions/animations, not Framer's tween timing. The site-wide reset prevents jank but the entrance animation still runs at full speed for reduced-motion users. **Fix:** import and check `useReducedMotion()` (already used in `RevealWords.tsx`, `CornerSection.tsx`) and skip `whileInView` when reduced.

**[MEDIUM] `components/about/AboutHero.tsx:14–20`** — `existsSync` called per render, not at build time as the comment claims. AboutHero is a server component, so this runs on each request. Fast (microseconds) and Next.js caches the render, but the comment is wrong. **Fix:** update the comment to "checks at request time", or hoist `hasPortrait()` to the module scope so it's evaluated once at server boot.

**[MEDIUM] `components/nav/Navigation.tsx:54`** — `<Image className="invert">` flips a black logo to white via CSS filter. Works but breaks if the source SVG is later updated to a non-black asset. **Fix:** ship a white-on-transparent variant (e.g. `/logos/sp-mark-light.png` or SVG with `currentColor` fill) instead of relying on `filter: invert`.

**[MEDIUM] `components/about/AboutStrip.tsx:11`** — `Surface variant="solid"` wraps content with `bg-black/65 backdrop-blur-sm`. Inside, body text is `lead` (Hanken on bone). Bone on `rgba(0,0,0,0.65)` over the html gradient is fine. AboutStrip isn't on the home route, so the gradient is the backdrop and the scrim is solid enough. (Section-scoped `SectionScrubVideo` only mounts under hero + ch01, so AboutStrip never overlays a video frame.)

**[MEDIUM] `components/process/ProcessBeat.tsx:99`** — `<div className="md:col-span-8 relative hidden md:block">` — the entire overlay column is hidden on mobile. Fine because `ProcessNarrativeMobile` covers mobile separately, but worth flagging that desktop-tablet (md breakpoint at 768px) shows the overlay column while phones don't. iPad mini (744px) still falls into mobile; iPad regular (810px) falls into desktop ProcessBeat. The cinematic overlay was tuned for ≥1024px viewports; iPad-portrait may render the overlays awkwardly. **Fix:** consider gating ProcessBeat to `lg:` (1024px+) and routing iPad-portrait to the mobile shell.

**[MEDIUM] `app/contact/ContactForm.tsx:106`, `app/estimate/EstimateForm.tsx:106`** — Success state heading uses `text-accent` (bone). The system's brake-light discipline reserves ignite for "the single hero stat, page-progress hairline" — but a successful form submission is exactly the moment to reward the user. **Fix:** change to `text-ignite` (the only screen-level state where ignite reads as celebration, not warning).

**[MEDIUM] `app/contact/ContactForm.tsx:175–178`** — Upload progress is text-only ("Uploading photo X of Y…"). Photo upload to Vercel Blob can take 2–10s on slow connections. `progressive-loading` rule recommends a skeleton/shimmer over plain text for >1s operations. **Fix:** add a small progress bar (`<progress value={uploaded} max={total}>` or a div with `width: ${(uploaded/total)*100}%`).

**[MEDIUM] `components/footer/Footer.tsx:38`** — Footer link list doesn't visually separate site nav from explainer nav until the small "Explainers" eyebrow on line 47. On a vertical stack the eyebrow has weak visual weight. **Fix:** add `mt-4 pt-4 border-t border-divider` to the eyebrow so the explainer group is clearly demarcated.

**[MEDIUM] `app/explainers/adas/page.tsx`, `oem-parts`, `paint-match`** — No cross-linking between explainers (no "Read also: paint match" inside the ADAS article). **Fix:** add a small "Related" block above the FAQ link that points to the other two explainers.

---

## LOW

**[LOW] `components/effects/Magnetic.tsx`** — Even with no cursor activity in the radius, the `requestAnimationFrame` tick runs continuously to lerp the (already-zero) position. Negligible CPU but technically an idle rAF. **Fix:** stop the rAF when `targetX` and `curX` agree to within 0.1px; restart on next mousemove.

**[LOW] `components/process/ProcessBeat.tsx:107`** — The "scroll" indicator at the bottom uses `text-muted` (graphite) — same contrast caveat as the Critical row. Less impactful here because it's a transient hint. Will resolve when the graphite token is bumped.

**[LOW] `app/about/page.tsx`, `/process/page.tsx`** — No `Open Graph` image override per page; OG image is the default from `app/layout.tsx`. The brand pages override `metaDescription` but not `images`. Editorial pages get a generic share preview. Minor SEO/social polish.

**[LOW] `components/effects/SectionScrubVideo.tsx:154`** — `preload="metadata"` is a smart bandwidth optimization, but a very slow first scroll may stall briefly while data arrives. The comment acknowledges this. No fix needed; just confirm with QA that the first scroll on a 3G profile feels acceptable.

**[LOW] `components/editorial/EditorialImageSlot.tsx:51`** — Placeholder label uses `text-muted/60` (graphite × 60% on steel) — extremely low contrast (~1.9:1). Intentional softness for a "pending" indicator, but borderline invisible. **Fix:** raise to `text-muted/80` or accept that pending placeholders should read as ghosts.

**[LOW] `components/nav/Navigation.tsx:75`** — Mobile menu open button is `text-accent p-3 -mr-3`. The `-mr-3` negative margin extends the visual hit area off the right edge of the nav. Touch target measures `48×48px` (`p-3` ≈ 12px each side around 24px icon) — meets minimum. The `-mr-3` is a layout choice, not a touch concern.

---

## Backwards-compat token migration

Every file that references one of: `text-accent`, `bg-accent`, `border-accent`, `text-bg`, `bg-bg`, `text-text`, `text-muted`, `bg-surface`, `border-divider`, `border-hairline`, `var(--color-accent|surface|bg|text|muted)`. The "→" column shows the direct token to migrate to.

| File | Tokens used | → New token |
|---|---|---|
| `app/layout.tsx:58` | `bg-accent`, `text-bg` | `bg-bone`, `text-ink` |
| `app/contact/page.tsx:14` | `bg-bg` | `bg-ink` |
| `app/contact/ContactForm.tsx:26,28,105,106,107,162,166,176,181` | `text-muted`, `bg-surface`, `border-accent`, `focus:border-accent`, `focus-visible:outline-accent`, `text-text`, `placeholder:text-muted`, `text-accent`, `bg-accent`, `text-bg` | `text-graphite`, `bg-steel`, `border-bone` (or `border-ignite` for primary boundary), `text-bone`, `bg-bone`, `text-ink` |
| `app/estimate/page.tsx:16` | `bg-bg` | `bg-ink` |
| `app/estimate/EstimateForm.tsx:24,26,105,106,107,146,149,153,163,168` | same set as ContactForm | same as ContactForm |
| `app/not-found.tsx:11,21` | `bg-bg`, `border-accent`, `text-accent`, `hover:bg-accent`, `hover:text-bg`, `focus-visible:ring-accent`, `focus-visible:ring-offset-bg` | `bg-ink`, `border-bone`, `text-bone`, `hover:bg-bone`, `hover:text-ink`, `ring-ignite`, `ring-offset-ink` |
| `app/faq/page.tsx:41,60,75,80,83` | `bg-bg`, `border-divider`, `text-muted`, `text-accent` | `bg-ink`, `border-divider` (rename token to `border-mute` or `border-rule`), `text-graphite`, `text-bone` |
| `app/explainers/adas/page.tsx:42,50,81,102,121,126` | `bg-bg`, `border-divider`, `text-accent`, `text-muted`, `hover:text-accent` | `bg-ink`, `border-rule`, `text-bone`, `text-graphite`, `hover:text-bone` |
| `app/explainers/oem-parts/page.tsx:42,50,74,93,110,129,134` | same set | same |
| `app/explainers/paint-match/page.tsx:42,50,78,96,124,129` | same set | same |
| `components/ui/Button.tsx:15,17,18` | `ring-accent`, `ring-offset-bg`, `border-accent`, `text-accent`, `hover:bg-accent`, `hover:text-bg` | `ring-ignite`, `ring-offset-ink`, `border-bone`, `text-bone`, `hover:bg-bone`, `hover:text-ink` |
| `components/effects/CustomCursor.tsx:133,145,156` | `border-accent`, `text-bg`, `var(--color-accent)`, `bg-accent` | `border-bone`, `text-ink`, `var(--color-bone)`, `bg-bone` |
| `components/about/AboutHero.tsx:26,52,53` | `bg-bg`, `bg-surface`, `text-muted/60` | `bg-ink`, `bg-steel`, `text-graphite/60` |
| `components/about/AboutStory.tsx:12,119,129,134` | `bg-bg`, `border-divider`, `text-text`, `text-text/85`, `text-muted` | `bg-ink`, `border-rule`, `text-bone`, `text-bone/85`, `text-graphite` |
| `components/about/AboutStrip.tsx:19,20,21,27` | `text-accent`, `focus-visible:ring-accent`, `focus-visible:ring-offset-bg` | `text-bone`, `ring-ignite`, `ring-offset-ink` |
| `components/brand/BrandHero.tsx:8,17,21` | `bg-bg`, `text-muted`, `text-text`, `hover:text-accent` | `bg-ink`, `text-graphite`, `text-bone`, `hover:text-bone` |
| `components/brand/BrandServices.tsx:5,16,18,21,24` | `bg-bg`, `border-divider`, `hover:border-accent`, `text-muted`, `text-accent`, `text-text/85` | `bg-ink`, `border-rule`, `hover:border-bone`, `text-graphite`, `text-bone`, `text-bone/85` |
| `components/brand/BrandModels.tsx:6,19,28` | `bg-bg`, `border-divider`, `text-text/90`, `hover:border-accent`, `hover:text-accent`, `text-muted` | `bg-ink`, `border-rule`, `text-bone/90`, `hover:border-bone`, `hover:text-bone`, `text-graphite` |
| `components/process/ProcessNarrative.tsx:74` | `text-muted` | `text-graphite` |
| `components/process/ProcessNarrativeMobile.tsx:11,23,53,54,58,62,63,68,69,74,75` | `text-muted`, `border-divider`, `text-accent` | `text-graphite`, `border-rule`, `text-bone` |
| `components/process/CraftCanvas.tsx:91,110,124,134,135` | `bg-bg`, `border-divider`, `text-muted`, `bg-surface`, `text-muted/60` | `bg-ink`, `border-rule`, `text-graphite`, `bg-steel`, `text-graphite/60` |
| `components/process/ProcessBeat.tsx:86,107,132,133,166,170,193,215,218,238,239,242,244,254` | `bg-bg`, `text-muted`, `text-accent`, `bg-accent`, `ring-accent/15` | `bg-ink`, `text-graphite`, `text-bone`, `bg-bone` (or `bg-ignite` for the gap measurement rules — that's signature data and ignite reads as "this is the spec"), `ring-bone/15` |
| `components/editorial/PullQuote.tsx:18,19,23` | `border-accent`, `text-accent`, `text-muted` | `border-bone` (or `border-ignite` if you want the pull-quote rule to be a brake-light moment), `text-bone`, `text-graphite` |
| `components/editorial/SceneDivider.tsx:36,50,51,54` | `bg-bg`, `border-divider`, `text-accent` | `bg-ink`, `border-rule`, `text-bone` |
| `components/editorial/EditorialImageSlot.tsx:45,51` | `bg-surface`, `text-muted/60` | `bg-steel`, `text-graphite/60` |
| `components/footer/Footer.tsx:14,24,25,33,34,38,39–50` | `border-divider`, `text-muted`, `text-accent`, `hover:text-accent` | `border-rule`, `text-graphite`, `text-bone`, `hover:text-bone` |
| `components/nav/Navigation.tsx:44,64,75,86,92,103` | `bg-bg`, `border-divider`, `text-text`, `hover:text-accent`, `text-accent` | `bg-ink`, `border-rule`, `text-bone`, `hover:text-bone` (or `hover:text-ignite` for nav hover, which would be a stylistic decision worth making intentionally) |
| `components/positioning/PositioningTable.tsx:27,29,31,39,52,55,56,58,61,69,81` | `border-divider`, `text-accent`, `text-muted`, `bg-bg`, `border-accent` | `border-rule`, `text-bone`, `text-graphite`, `bg-ink`, `border-bone` |
| `components/testimonials/TestimonialsSection.tsx:20,34,38,39,40` | `border-divider`, `text-text/95`, `bg-accent`, `text-muted`, `text-accent` | `border-rule`, `text-bone/95`, `bg-bone`, `text-graphite`, `text-bone` |
| `components/testimonials/VideoTestimonials.tsx:23,77,93,96,97` | `border-divider`, `bg-surface`, `text-accent`, `text-muted` | `border-rule`, `bg-steel`, `text-bone`, `text-graphite` |
| `components/showroom/ShowroomSection.tsx:22,43,46` | `border-divider`, `text-accent`, `text-muted/60` | `border-rule`, `text-bone`, `text-graphite/60` |
| `components/gallery/BeforeAfterGallery.tsx:26,35,36,46` | `hover:border-accent`, `text-accent`, `text-muted` | `hover:border-bone`, `text-bone`, `text-graphite` |
| `components/hero/HeroVideo.tsx:46,97` | `text-text`, `hover:text-ignite` | `text-bone`, `hover:text-ignite` (this one is already on direct token — keep as-is) |

**Migration approach.** Either:
1. Rename the back-compat aliases in `globals.css:29–35` to neutral names (e.g., `--color-bg` → keep as alias for `--color-ink`), and remove the Tailwind utility shortcuts `text-accent`/`bg-bg`/etc. from any auto-generated theme. Forces every file to migrate.
2. Migrate file-by-file with a tracking checklist; remove `globals.css:18–35` once the grep returns no hits in `app/` and `components/`.

Option 2 is safer with the in-flight `fix/styling` work; option 1 risks a big-bang regression.

---

## Per-surface notes

### Forms — `/contact`, `/estimate`

Strong on:
- Visible labels with `htmlFor` ✓
- Semantic `type="tel"` / `type="email"`, `inputMode`, `autoComplete` ✓
- `role="alert"` on error, `aria-live="polite"` on progress, `role="status"` on success ✓
- `disabled` during in-flight ✓
- File size + count validation client-side ✓
- BotID guard on API routes ✓
- HEIC/HEIF accepted (iPhone-friendly) ✓

Weak on:
- Per-field error placement (Critical)
- Required-field indicators (High)
- Inline validation (High)
- `aria-invalid`/`aria-describedby` linking (Critical)
- Focus management on error (Critical)
- Retry CTA on submit failure (High)
- Error color hardcoded `text-red-400` (Critical)
- Upload progress is text-only (Medium)
- Heavy back-compat token usage (High)
- Success heading should be `text-ignite` for brand-discipline reward moment (Medium)

### Editorial pages — `/about`, `/process`, `/faq`, `/explainers/*`

Strong on:
- `<h1>` per page with proper hierarchy ✓
- JSON-LD `TechArticle` / `FAQPage` schema ✓
- Canonical URLs in metadata ✓
- `max-w-[65ch]` line-length on prose ✓
- `existsSync` placeholder pattern in `EditorialImageSlot` and `AboutHero` (server-side, ships structurally complete) ✓
- `prefers-reduced-motion` swaps `ProcessNarrative` to `ProcessNarrativeMobile` ✓
- WebGL `CraftCanvas` gated on `coarse pointer` and reduced-motion ✓
- IntersectionObserver mount-gate on WebGL (saves init cost) ✓
- DOM-mutation animation in `ProcessBeat` (no React re-renders per scroll tick) ✓

Weak on:
- `!important` Tailwind margins (`!mt-14`) for h2 spacing — Medium
- `motion.article` in `ProcessNarrativeMobile` doesn't use `useReducedMotion()` — Medium
- ProcessBeat tablet-portrait (744–1023px) gets desktop overlay treatment that was tuned for ≥1024px — Medium
- No cross-linking between explainer pages — Medium
- Heavy back-compat token usage — High

### Brand vehicle pages — `/audi-r8…`, `/mclaren…`, `/lamborghini…`

Strong on:
- Single source of truth (`brands-data.ts`) — consistency by construction ✓
- `<Service>` JSON-LD with full address ✓
- `<h1>` per page, `<h2>` per section ✓
- Per-page `metadataBase` + canonical via root layout ✓
- Brand testimonials gated on `PUBLISHED_TESTIMONIALS` count (no empty section) ✓

Weak on:
- `BrandModels` cards have `data-cursor="Open"` but aren't actionable (High — false affordance)
- `BrandServices` cards have `hover:border-accent` but aren't links (High)
- `<Magnetic>` per model card means N listeners per page (High)
- No alt-content cross-link (e.g. McLaren page → "Read about ADAS calibration on McLarens") — Low
- Heavy back-compat token usage — High

### System-wide

Strong on:
- Token system in `globals.css` is well-organized with clear comments ✓
- Reduced-motion baseline in `globals.css:298–305` (caps `*` animation/transition to 0.01ms) ✓
- Z-index scale defined ✓
- Skip-link present in `app/layout.tsx` ✓
- `LocalBusinessJsonLd` mounted at root ✓
- Hero poster preload ✓
- `font-display: swap` on both Anton and Hanken ✓

Weak on:
- Body-text contrast (graphite on ink/steel) — Critical
- Button hit area below 44pt — Critical
- Mobile menu missing focus trap, escape, body lock — Critical
- No active-page nav indicator — Critical
- Custom cursor's `cursor: none !important` is too aggressive — High
- Custom cursor doesn't track keyboard focus — High
- Footer missing copyright + address — Medium
- Logo `filter: invert` instead of a white-variant asset — Medium
- PhoneCTA (`<button>`) and SmsCTA (`<a>`) inconsistent semantics — Medium

---

## Verification

Every file in the original audit scope was opened and assessed:

- Forms: `app/contact/page.tsx`, `app/contact/ContactForm.tsx`, `app/estimate/page.tsx`, `app/estimate/EstimateForm.tsx`, `app/api/contact/route.ts`, `app/api/contact/upload/route.ts`, `app/api/estimate/route.ts`, `app/api/estimate/upload/route.ts` ✓
- Editorial: `app/about/page.tsx`, `components/about/{AboutHero,AboutStory,AboutStrip}.tsx`, `app/process/page.tsx`, `components/process/{ProcessNarrative,CraftCanvas,ProcessBeat,ProcessNarrativeMobile}.tsx`, `app/faq/page.tsx`, `app/explainers/{adas,oem-parts,paint-match}/page.tsx` ✓
- Brand: `app/{audi-r8,mclaren,lamborghini}-collision-repair-sarasota/page.tsx`, `components/brand/{BrandPage,BrandHero,BrandServices,BrandModels}.tsx` ✓
- System: `app/globals.css`, `app/layout.tsx`, `components/effects/{CustomCursor,Magnetic,ParticleField,RevealWords,SectionScrubVideo,SectionParallaxImage}.tsx`, `components/ui/{Button,Surface,PhoneCTA,SmsCTA}.tsx`, `components/nav/Navigation.tsx`, `components/footer/Footer.tsx`, plus `components/cta/FinalCTA.tsx`, `components/editorial/{PullQuote,EditorialImageSlot,SceneDivider}.tsx`, `components/positioning/PositioningTable.tsx` ✓

The token-migration list was built from a grep of `text-accent|bg-accent|border-accent|text-bg|bg-bg|text-text|bg-text|text-surface|bg-surface|text-muted|bg-muted|border-divider|border-hairline|var\(--color-(accent|surface|bg|text|muted|divider|hairline)\)` across `app/` and `components/`.

No code was modified by this audit. The recommended sequence for fixes:
1. Fix the **Critical** items first — they're accessibility blockers that should not ship.
2. Then the **token migration** — it's mechanical and unblocks future system changes.
3. Then **High** items — false affordances on brand pages, focus-ring inconsistency, custom-cursor opt-out.
4. **Medium** and **Low** as polish before launch.
