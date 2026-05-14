# SP Automotive — Design System (MASTER)

> **Source of truth.** When a page-specific file in `design-system/pages/` overrides a rule here, the page file wins. Otherwise this document is canonical.
>
> Derived from `AGENTS.md` + `app/globals.css` + the actual component implementations. Last reconciled: 2026-05-14.
>
> Validated against the ui-ux-pro-max skill's Quick Reference §1–§10 and Common Rules for App UI. The skill's generic palette/font recommendation (Inter + Liquid Glass + blue/orange) is **explicitly rejected** for this product — sp-auto's bespoke Anton/Hanken + ink/bone/ignite system is more considered and stays authoritative.

---

## 1. Voice

**Workshop cinema × owner's manual.** Concrete, evidentiary, no marketing-speak. Short paragraphs. Tabular figures over vague claims. The brand sounds like a senior tech walking an owner around their car, not a billboard.

Examples of voice in the wild:
- §02: *"We fight the file. You stay out of it."*
- §05: *"Four steps. One phone number."*
- §07: *"One shop. One signature. Every weld."*
- Final CTA: *"Photos by text. Estimate by phone. Insurance by us."*

When in doubt: pick the line a lead tech would actually say standing at the bench. Strip adjectives. Keep verbs.

---

## 2. Color Tokens

All tokens are CSS variables under `@theme` in `app/globals.css`. Tailwind utilities work directly off them (`bg-ink`, `text-bone`, `border-hairline`, etc.).

### Backgrounds
| Token | Value | Role |
|---|---|---|
| `--color-ink` | `#0E0F11` | Default dark canvas. Cold near-black — **not pure black** (pure black reads as void; near-black holds presence). |
| `--color-ink-deep` | `#0A0B0D` | Bottom of the atmospheric vertical gradient on `<html>`. |
| `--color-paper` | `#F4F2EE` | Light surface for editorial sections (§01, §02, §03, §04, §06, §07, §08, §09). Warm off-white — never pure white. |
| `--color-steel` | `#2A2D32` | Elevated dark surface (cards, panels) when glass is not appropriate. Rarely used; most cards prefer `Surface variant="glass"`. |

### Text
| Token | Value | Role |
|---|---|---|
| `--color-bone` | `#C9C4BB` | Headlines, strong text on dark. Soft, not stark — pure white on ink is too harsh for the editorial register. |
| `--color-graphite` | `#6E727A` | Body text on dark, secondary copy, captions, eyebrows. Mid-tone — reads as "voice", not announcement. |
| `--color-chrome` | `#D4D2CD` | Metallic highlight — rarely used in copy; reserved for inline reflective accents. |

### Accent — used like a brake light
| Token | Value | Role |
|---|---|---|
| `--color-ignite` | `#C8281D` | **THE accent.** Single-use per section maximum. Reserved for: primary CTA (Call button), focus rings (`:focus-visible` outline), `::selection` highlight, the single hero stat that closes a beat, page-progress hairline. **Never on hover. Never on body copy. Never as a structural color.** |

**Where ignite legitimately appears today** (one per section, max):
- Call buttons in StickyContactBar + PhoneCTA (when used in dark contexts)
- Focus outlines globally (`:focus-visible { outline: 2px solid var(--color-ignite); }`)
- `::selection` background
- §04 "Step 03" red dot (single 1.5×1.5 dot, decorative)
- §06 background breathing radial (decorative atmospheric glow only — peak rgba 0.18, never above 50% opacity)
- Hero "send 3 photos" hover state on the inline link
- Footer ambient video (red-tinted footage — atmospheric, not a color token)

If you reach for ignite and one of those slots is already in the section, **find a different way to draw attention** (size, position, weight, motion).

### Structure
| Token | Value | Role |
|---|---|---|
| `--color-measure` | `rgba(110,114,122,0.40)` | Ruled lines, grids, schematic blueprint markings. Mid-graphite at 40%. |
| `--color-divider` | `#1A1B1E` | Soft horizontal rule between dark sections. |
| `--color-hairline` | `rgba(201,196,187,0.10)` | Very faint 10%-opacity bone tint for schematic edge accents. **Never full-strength borders** — that reads as a flat-design boundary, not an Owner's Manual ruling. |

---

## 3. Typography

### Families
| Variable | Family | Role |
|---|---|---|
| `--font-display` | Anton (free Druk-alike, single weight 400, condensed) | Headlines, numerals, big tracked-uppercase labels. |
| `--font-editorial` / `--font-body` | Hanken Grotesk (weights 400 / 500 / 600) | Paragraphs, leads, editorial, eyebrows, UI labels. |
| `--font-mono` / `--font-spec` | Hanken Grotesk (aliased today) | `.spec` callouts. Add JetBrains Mono later if true mono is needed for torque/paint depth callouts — leave `--font-body` / `--font-editorial` on Hanken. |

Loaded via `next/font/google` in `app/layout.tsx:15-31` with `display: "swap"`. CSS variables `--font-anton` and `--font-hanken` are injected on `<html>`.

### Scale (fluid, clamp-based)
| Token | Size | Use |
|---|---|---|
| `--text-eyebrow` | 11px (`0.6875rem`) | `.eyebrow`, `.annotation`. |
| `--text-caption` | 13px (`0.8125rem`) | Small captions, dense rows. |
| `--text-body` | 17px (`1.0625rem`) | Default `<p>`. Slightly above the 16px floor for premium feel. |
| `--text-lead` | 20px (`1.25rem`) | Opening paragraph after a headline. |
| `--text-display-sm` | `clamp(1.75rem, 3vw + 0.5rem, 2.75rem)` | Sub-display headings. |
| `--text-display-md` | `clamp(2.5rem, 6vw + 0.5rem, 5rem)` | Section headlines (e.g. §02 "We fight the file"). |
| `--text-display-lg` | `clamp(3.25rem, 9vw, 7.5rem)` | Large page heroes (e.g. FAQ "Straight answers."). |
| `--text-display-xl` | `clamp(4rem, 13vw, 10rem)` | Reserved for once-per-page emphasis. |
| `--text-display-bleed` | `clamp(3.5rem, 14vw, 14rem)` | Hero edge-bleed compositions — the word physically exceeds the viewport. No upper cap below ultra-wide. |

### Tracking + leading
| Token | Value | Use |
|---|---|---|
| `--tracking-eyebrow` | `0.18em` | Eyebrows, tracked-uppercase labels. |
| `--tracking-display` | `-0.025em` | Display sizes (negative — condensed display faces want it). |
| `--tracking-mono` | `0.04em` | Mono callouts (positive — breathing room). |
| `--leading-display` | `0.95` | Display headlines. |
| `--leading-body` | `1.55` | Default body. |
| `--leading-editorial` | `1.65` | Long-form prose (`.editorial`). |

### Tabular numerals — **mandatory**
`html, body` sets `font-variant-numeric: tabular-nums` globally. All numbers — stats, prices, timers, ratios, dates — must render tabular. In components, set `style={{ fontVariantNumeric: "tabular-nums" }}` on stat blocks for belt-and-suspenders (see `AboutStrip.tsx:53` and `TheMath.tsx:110`).

### Semantic classes
Use these classes instead of stacked utilities so a role looks identical everywhere.

| Class | Definition | Use |
|---|---|---|
| `.eyebrow` | 11px Hanken uppercase, `--tracking-eyebrow`, graphite | Small-caps labels above content. **Prefix with `//` for in-content callouts** (`// We work with`, `// The path`). |
| `.annotation` | 11px Hanken 300 uppercase, `--tracking-mono`, graphite | Leader-line labels, callout pins. |
| `.display-sm` / `.display-md` / `.display-lg` / `.display-xl` | Anton + size token + display tracking/leading. Color inherits from parent. | Section headlines. Set color via parent (`text-ink` on paper, `text-bone` on dark). |
| `.display-bleed` | Anton, bone color, `--text-display-bleed`, `nowrap` | Hero edge-bleed phrases ("Totaled.", "Paid in Full."). The word renders as one horizontal stroke clipped by the viewport. |
| `.display-bleed--shine` | `.display-bleed` + animated per-character gradient sweep | Hero only. Honors `prefers-reduced-motion` (gradient holds static). |
| `.lead` | 20px Hanken editorial, bone, 1.65 leading | Opening paragraph after a display headline. |
| `.spec` | Hanken 300 mono small-caps, tabular | Technical numbers (torques, paint depths, ΔE). |
| `.editorial` | 18px Hanken editorial, bone, 1.65 leading, kern + liga | Long-form prose (`/explainers`, owner letters). `p + p` margin 1.25em. |
| `.hairline` | 1px tall, `--color-measure` bg | Horizontal ruled line. |
| `.hairline-vertical` | 1px wide, `--color-measure` bg | Vertical ruling. |
| `.link-underline` | Animated underline drawn in from left on hover, retracts to right on out. Honors `prefers-reduced-motion`. | All in-content links. Active state via `aria-current="page"`. |

### Color × class pairings (contrast quick-check)

| Surface | Headline | Body | Notes |
|---|---|---|---|
| `bg-ink` | `text-bone` | `text-graphite` for secondary, `text-bone/80` for primary | Default dark sections. |
| `bg-paper` | `text-ink` | `text-graphite` for secondary, `text-ink/80` for primary | Paper-flipped sections (§01–§04, §06–§09). |
| `Surface variant="glass"` (dark) | `text-bone` | `text-bone/80` | Don't drop to graphite on glass — the blurred backdrop already dims contrast. |
| `Surface variant="light"` (white card on paper) | `text-ink` | `text-ink/80` | The §09 paper card lives here — `text-ink`, not bone. Verified `FinalCTA.tsx:31`. |

**Forbidden pairings** (these fail WCAG AA):
- `text-bone` on `bg-paper` (~1.3:1, would happen if someone reuses dark-section classes on a light section)
- `text-graphite` on `bg-steel` (~2.5:1)
- Pure white text on ignite (use bone or off-white for warmth)

---

## 4. Motion

| Token | Curve | Use |
|---|---|---|
| `--motion-cinema` | `1200ms cubic-bezier(0.22, 1, 0.36, 1)` | Slow atmospheric fades. Hero entrance, paper-flip page transitions. |
| `--motion-shutter` | `600ms cubic-bezier(0.83, 0, 0.17, 1)` | Mechanical reveals — clip-path, card stagger, hairline draw. Most section reveals land here. |
| `--motion-manual` | `420ms cubic-bezier(0.83, 0, 0.17, 1)` | Precise micro-motion — leader lines, annotation pins, the §01 measurement rule. |
| `--motion-quick` | `200ms cubic-bezier(0.4, 0, 0.2, 1)` | Hover, focus, button state changes. |

### Canonical reveal pattern (IntersectionObserver + `data-revealed`)

The site reveals scrolled-in sections by flipping `section.dataset.revealed = "1"` once the section's center crosses the viewport. Child transitions key off `[data-revealed="1"]` in styled-jsx. **Use `components/home/HowItWorks.tsx:45-176` as the exemplar.**

Required structure:
```tsx
"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

export default function Section() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    if (reduced) {
      section.dataset.revealed = "1"; // skip animation, land at final state
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) section.dataset.revealed = "1";
      },
      { rootMargin: "-15% 0px -15% 0px", threshold: 0 },
    );
    io.observe(section);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <section ref={ref} className="my-section ...">
      {/* child elements key off [data-revealed="1"] */}
      <style jsx>{`
        :global(.my-section__card) {
          opacity: 0;
          transform: translateY(16px);
          transition:
            opacity var(--motion-shutter, 600ms) cubic-bezier(0.83, 0, 0.17, 1),
            transform var(--motion-shutter, 600ms) cubic-bezier(0.83, 0, 0.17, 1);
          transition-delay: calc(240ms + var(--i) * 80ms);
        }
        :global(.my-section[data-revealed="1"] .my-section__card) {
          opacity: 1;
          transform: translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
          :global(.my-section__card) { transition: none; }
        }
      `}</style>
    </section>
  );
}
```

### Reduced-motion contract (mandatory)

Every animation must check reduced-motion **two ways**:
1. **JS path**: `const reduced = useReducedMotion()` from `framer-motion`. If `reduced`, write the final state immediately and return.
2. **CSS path**: `@media (prefers-reduced-motion: reduce) { transition: none; }` on every transition declaration.

The global baseline at `globals.css:438-445` already neutralizes all `animation-*` and `transition-*` to `0.01ms` for reduced-motion users, but per-component CSS should still scope its own override so the section is self-contained.

### Per-character / per-word reveals
- `components/effects/RevealWords.tsx` — word-by-word fade + rise (24px), framer-motion driven, `useReducedMotion()` returns plain text on reduced.
- `components/effects/SplitText.tsx` — character-level stagger driven by a single `--st` CSS variable transitioning 0→1. Uses `@property --st` (registered as `<number>`) so the browser can interpolate. Reduced-motion renders plain children, no per-char DOM.

Pick `SplitText` for character-level effects (hero, display headlines with `.display-bleed--shine`). Pick `RevealWords` for body-pace reveals where word-by-word reads more cinematic than character-by-character.

---

## 5. Spacing & Layout

### Spacing rhythm
Tailwind v4 default (4px base) is used; no `--spacing-*` tokens are declared in `@theme`. Stick to 4/8 multiples (`p-2`, `p-3`, `p-6`, `p-8`, `gap-4`, `gap-6`, `mt-10`, `mt-16`, `py-20`, `py-28`).

Section-level vertical padding standard:
- Mobile: `py-20`
- Desktop: `md:py-28` (or `md:py-32` for the FAQ hero)

Horizontal padding standard:
- Mobile: `px-6`
- Desktop: `md:px-10`

### Container widths
| Context | Max width |
|---|---|
| Editorial copy (FAQ, About, explainers) | `max-w-3xl` (~768px) |
| Mid-density sections (FinalCTA, AboutStrip card) | `max-w-4xl` (~896px) |
| Standard section grids | `max-w-6xl` / `max-w-7xl` (1152–1280px) |
| Full-bleed gallery / hero | no max-w; padding only |

### Viewport-fill vs content-fit
- `min-h-[110svh]` — sections meant to fill the viewport (hero, §05 HowItWorks, §03 StorageBlock). `svh` (small viewport height) avoids mobile browser-chrome jump.
- `min-h-screen` — alternative when 110% isn't needed.
- `auto` — content-fit sections (TrustStrip, FAQ rows, FinalCTA).

### Z-index scale (from `@theme`)
| Token | Value | Use |
|---|---|---|
| `--z-base` | 0 | Default. |
| `--z-overlay` | 10 | In-section overlays (gradients, scrims). |
| `--z-section` | 30 | Section content above its own video/scrim. |
| `--z-nav` | 50 | Top nav. |
| `--z-modal` | 80 | Mobile nav dialog. |
| `--z-toast` | 90 | Toasts. |
| `--z-skip` | 100 | Skip-to-content link (must trump everything). |

---

## 6. Component Primitives

### `Surface` — translucent scrim wrapper (`components/ui/Surface.tsx`)

Six variants, each tuned to a specific legibility need. **Don't double-stack glass on glass** — one surface per element.

| Variant | Style | Use |
|---|---|---|
| `solid` | `bg-black/65 backdrop-blur-sm` | Dense copy areas (testimonials, gallery, about, final CTA, footer when not using glass). |
| `veil` | `bg-black/40` | Light-touch scrim for marquees / strips where the video should still feel present. |
| `edge` | `bg-gradient-to-b from-black/75 via-black/25 to-black/75` | Top-and-bottom gradient — lets a single hero frame breathe in the middle. |
| `glass` | `bg-black/55 backdrop-blur-xl backdrop-saturate-[1.10] + border-white/[0.10] + ring-inset white/[0.06] + shadow` | Liquid-glass card. Used by §05 step cards, footer, FAQ row containers. Pair with `rounded-2xl` + padding on caller. |
| `glass-dense` | Like glass but 75% black, larger blur, heavier border/ring/shadow | **Chapter 01 only** (TotalLossPlay), because video is moving behind it. |
| `light` | `bg-white + border-ink/10 + shadow` | White card with hairline ink border + subtle shadow. For paper-cream sections. The mirror of `glass`: lighter plate on lighter bg, vs darker plate on darker bg. No blur. |

Usage:
```tsx
<Surface variant="glass" className="rounded-2xl p-7 md:p-8">
  ...
</Surface>
```

### `Button` — primary/ghost in dark + light themes (`components/ui/Button.tsx`)

Four variants. Always renders with `min-h-[44px]` to meet touch-target rules.

| Variant | Style | Use |
|---|---|---|
| `primary` | Border bone, text bone, hover invert to ink-on-bone | Dark sections. |
| `ghost` | Bone, hover underline-offset-4 | Dark sections, secondary action. |
| `primary-light` | Border ink, text ink, hover invert to paper-on-ink | Paper-cream sections. |
| `ghost-light` | Ink, hover underline | Paper sections, secondary action. |

Props: `variant`, `href`, `type`, `disabled`, `onClick`, `className`, `ariaLabel`, `children`.

Renders `<a>` if `href` provided, else `<button type={type}>`.

### `PhoneCTA` / `SmsCTA` — wrappers for the two primary actions

`PhoneCTA` (`components/ui/PhoneCTA.tsx`): renders a `<button>` (intentionally **not** `<a href="tel:">` — Chrome's Click-to-Call hover card on `tel:` links can't be suppressed; we use `window.location.replace(PHONE_HREF)` on click). Tracks `phone_cta_click` with a `location` tag. `theme: "light" | "dark"` selects `primary-light` vs `primary`.

`SmsCTA` (`components/ui/SmsCTA.tsx`): renders `<a href={SMS_HREF}>` (SMS links don't have the same hover-card issue). Ghost variant — quieter sibling, never competing with PhoneCTA. Tracks `sms_cta_click`.

Both have `aria-label`s and accept `location`, `size`, `theme`, `className`.

### `StickyContactBar` — global sticky footer (`components/cta/StickyContactBar.tsx`)

**One of the cleanest implementations in the codebase. Don't change without good reason.**

- Slides up after `window.scrollY > window.innerHeight * 0.9` (past the hero)
- Hidden on `/estimate` and `/contact` (already action-focused)
- **Section-aware theme**: IntersectionObserver watches `[data-theme="dark"]` sections; bar flips to dark treatment when one overlaps the bottom 12vh strip
- **CALL button stays ignite red in both themes** — urgency color reads on either surface (this is the one place ignite is allowed to live persistently as a button background)
- Uses `inert` attribute when hidden — removes from tab order AND pointer interaction; without it, focused-and-hidden Enter on the Call button would dial unintentionally
- Tagline `"Totaled? Talk to Serge."` is `hidden md:block` — invisible on mobile by design (space)
- Honors `motion-reduce:transition-none` on the slide-up

### `RevealWords` (`components/effects/RevealWords.tsx`)
Word-by-word fade + rise (24px), framer-motion `whileInView`. Returns plain text if `useReducedMotion()`. Pass a string (or anything that flattens to a string) as `children`. Props: `stagger` (default 0.06s), `duration` (default 0.7s), `once` (default true).

### `SplitText` (`components/effects/SplitText.tsx`)
Character-level reveal. Two modes:
- `reveal="mount"` — wrapper sets `--st = 1` once after `mountDelayMs`. CSS transition on `--st` (registered via `@property`) carries the reveal.
- `reveal="controlled"` — parent writes `--st` externally on every scroll frame (e.g., CornerSection).

Words are grouped into `inline-block` spans so the browser only breaks BETWEEN words, never inside one. Reduced-motion renders plain children with no per-char DOM. Always provides an `sr-only` mirror of the original string for screen readers.

### `ShineBorder` (`components/ui/shine-border.tsx`)
Rotating conic-gradient border ring, driven by `--shine-angle` registered via `@property` as `<angle>`. Used on the cars carousel (`CardStack` in §06). Per-instance `--duration`.

---

## 7. Section Conventions

### Section labels — single canonical form

Every homepage section opens with one Anton uppercase label. **No chapter numerals** (the giant "01" / "02" pattern was retired 2026-05-14 — it read as editorial-magazine and felt disconnected from the service voice). One label, then the display headline.

```tsx
<p className="font-display uppercase tracking-[0.10em] text-left text-ink text-3xl md:text-5xl leading-none">
  Carrier-side advocacy
</p>
```

Color: `text-ink` on paper sections, `text-bone` on dark sections. Size: `text-3xl md:text-5xl` (30px / 48px). Tracking: `0.10em`. Leading: `leading-none`. Always `text-left`. Same for every section — keeps rhythm consistent across the scroll.

Section labels in use today:
- §01 TheMath → "The numbers"
- §02 InsuranceHandling → "Carrier-side advocacy"
- §03 StorageBlock → "Climate-controlled storage"
- §04 BodyworkAndEstimates → "Estimate without the haul"
- §05 HowItWorks → "How it works" (dark, text-bone)
- §06 BeforeAfterGallery → "Before + after"
- §07 AboutStrip → "The signature"
- §08 HomeFAQ → "Common questions"
- §09 FinalCTA (homepage only, via `homepage` prop) → "Next move"

### Unnumbered utility sections (TrustStrip, FeaturedBuilds)
Smaller tracked-uppercase label only. `// We work with` / `// Selected work` style — the `//` prefix marks them as in-content callouts (tech's marginal note), distinct from the proper section labels above.

### Reveal pattern
See §4 above. All sections, `TrustStrip`, and `FeaturedBuilds` use the canonical `data-revealed` pattern. Hero uses timeout-driven entry choreography (200/600/950/1100 ms milestones).

### Voice tags
Use `// Phrase` (eyebrow with the double-slash prefix) for in-content callouts that read like a tech's marginal note (`// The path`, `// Next move`, `// Climate`). Pure tracked-uppercase (without `//`) at the larger `text-lg md:text-2xl` size reads as a section label (the §7.1 form above). Pure tracked-uppercase at smaller `.eyebrow` size reads as a section badge (`SELECTED WORK`, `QUESTIONS OWNERS ASK`).

---

## 8. Accessibility (mandatory)

### Focus
Global rule in `globals.css:428-431`:
```css
:focus-visible { outline: 2px solid var(--color-ignite); outline-offset: 3px; }
```
**Don't override this with `outline: none` on interactive elements.** If you need a different look, add `focus-visible:ring-2 focus-visible:ring-bone focus-visible:ring-offset-4 focus-visible:ring-offset-ink` (or `-paper`) and keep the outline.

### Skip link
`app/layout.tsx:57-62` provides `<a href="#main" class="sr-only focus:not-sr-only ...">`. The `<main id="main">` wraps page content.

### Touch targets
**Minimum 44pt × 44pt** on every interactive element. Sources today:
- `Button.tsx:21` — `min-h-[44px]` baked into base styles
- `StickyContactBar.tsx:29` — `min-h-[44px]` on `BTN_BASE`
- `Navigation.tsx:186` — `p-3` on mobile menu button (24px icon + 12px each side = 48px square)

**Known violations** (see audit): the FAQ chip jump-nav buttons (`FAQAccordionList.tsx:118-124`) use `px-3 py-1.5 text-xs` and render ~28px tall. Fix in upcoming follow-up.

### Heading hierarchy
- Pages have exactly one `<h1>`. Homepage uses `<h1 className="sr-only">` in `HeroVideo.tsx:83-85` — semantic h1 present, visual hero is the display-bleed phrase. This is intentional.
- Section headlines are `<h2>` (with `id` for the aria-labelledby on the wrapping `<section>`).
- Sub-step / card titles are `<h3>`.
- Stat dt/dd pairs use `<dl>` semantics (`AboutStrip.tsx:51-67`).

### aria patterns in use
- Every `<section>` has either `aria-label` or `aria-labelledby` pointing at its `<h2 id>`.
- Mobile nav dialog (`Navigation.tsx:196`): `role="dialog" aria-modal="true" aria-label="Menu"`.
- Focus trap (Tab/Shift+Tab clamp inside dialog) + Esc to close + restore focus to opener.
- FAQ rows use `aria-expanded`, `aria-controls`, and `<motion.div role="region" aria-labelledby={buttonId}>` on the panel.
- `<details>`-based FAQ on homepage gets keyboard + SR for free; custom `+` indicator is `aria-hidden`.

### Body scroll lock (iOS-safe)
Mobile nav dialog uses the position:fixed + negative top trick, not `overflow: hidden` on `<body>`. See `Navigation.tsx:52-65, 94-104`.

### Reduced-motion
Global CSS baseline at `globals.css:438-445` neutralizes all animation/transition. Components additionally check `useReducedMotion()` and write final state. See §4 above.

---

## 9. Performance

Verified good:
- `next/font/google` with `display: "swap"` — no FOIT.
- `<link rel="preload" as="image" href="/hero-clips/cinematic-poster.jpg" fetchPriority="high">` — hero poster is the LCP candidate, not the video (video preload was tanking LCP at 9.8MB).
- Most images use `next/image` with `fill` + `sizes`. Aspect ratios reserved via `aspect-[16/10]` etc — no CLS.
- Scroll listeners gated by `requestAnimationFrame` in `StickyContactBar`, `HeroVideo`.

Watch:
- `BeforeAfterGallery` (§06) runs an 8s breathing animation on two fixed-position decorative gradient layers — `animation: bag-breathing` keeps the layout on the compositor but burns continuous frames even when offscreen. Honors reduced-motion. Acceptable for now; if INP regresses, gate with `IntersectionObserver` so it pauses out-of-view.
- `SmoothScroll` uses Lenis; coordinate any new scroll-coupled effect with the Lenis rAF loop so we don't end up with two competing scroll writers.

---

## 10. Anti-patterns (do not do)

| Anti-pattern | Why | Do instead |
|---|---|---|
| Emoji as structural icons (🚗, 🔧) | Inconsistent across platforms, can't be controlled via design tokens | Lucide icons (`lucide-react`) at the standard 16/20/24 sizes |
| Full-strength borders (`border-ink`, `border-bone`) | Reads as flat-design boundary, not Owner's Manual ruling | `border-ink/10`, `border-bone/10`, or `--color-hairline` |
| Glass on glass (`Surface variant="glass"` inside another glass surface) | Double-blur muddies legibility | One surface per element. If you need stacking, pick `solid` for the inner. |
| Hex literals in components | Bypasses the token system | Use `bg-ink`, `text-bone`, etc., or read `var(--color-ignite)` in inline `style` |
| Ignite as a structural / hover color | Dilutes the brake-light rule | Reserve ignite for primary CTA, focus, selection. Use size/position/weight for hover affordance. |
| Animating `width`/`height`/`top`/`left` | Triggers layout, jank | Animate `transform` + `opacity` only |
| Hover-only interactions | Doesn't work on touch | Tap-first; treat hover as enhancement |
| Placeholder-only form labels | A11y / floats away when typing | Visible label per input |
| `outline: none` on focusable elements without a replacement | Breaks keyboard nav | Keep the global outline OR add `focus-visible:ring-*` |
| `<a href="tel:...">` for primary phone CTAs | Chrome Click-to-Call hover card | `<button onClick={() => window.location.replace(PHONE_HREF)}>` (see `PhoneCTA.tsx`) |

---

## 11. Voice anti-patterns (copy)

Don't write:
- *"Industry-leading", "world-class", "premium experience"* — marketing-speak
- Vague claims without a number (*"fast turnaround"*) — give the number
- Headlines longer than 8 words
- Body paragraphs longer than 4 lines on desktop

Do write:
- Numbers with units (`+30%`, `48 hours`, `200+`)
- The verb a tech would use (*"document"*, *"supplement"*, *"negotiate"* — not *"manage"*)
- The named action (*"Talk to Serge"*, *"Call Serge"* — not *"Contact us"*)

---

## 12. Pre-delivery checklist

Run this before opening a PR. Anything not green is either fixed or explicitly noted in the PR description.

### Visual (sp-auto-specific)
- [ ] No emojis as icons
- [ ] Ignite appears at most once per section
- [ ] No glass-on-glass stacking
- [ ] All borders use the hairline scale (`/10`, `/15`, `/20`)
- [ ] Tabular-nums on every numeric block
- [ ] `text-ink` on paper surfaces, `text-bone` on dark — never crossed
- [ ] Eyebrows use `.eyebrow` class, not stacked utilities

### Interaction (ui-ux §1–§2)
- [ ] All clickable elements ≥44×44pt (verify chip rows, icon buttons)
- [ ] 8pt+ spacing between adjacent touch targets
- [ ] Focus-visible outline preserved (or replaced with equivalent ring)
- [ ] Disabled states use reduced opacity AND `disabled` attribute, not just opacity
- [ ] Hover state has a separate tap path (no hover-only interactions)
- [ ] Loading states for async actions (button disable + spinner OR inert state)

### Motion (ui-ux §7)
- [ ] Every animating component has `useReducedMotion()` check OR `@media (prefers-reduced-motion)` CSS — preferably both
- [ ] Animations on `transform` + `opacity` only — never `width`/`height`/`top`/`left`
- [ ] Duration in 150–300ms (micro) or 420–600ms (section) range; >800ms only for `--motion-cinema` hero fades

### Accessibility (ui-ux §1, §8)
- [ ] All `<Image>` have `alt` (decorative ones have `alt=""` + `aria-hidden`)
- [ ] Icon-only buttons have `aria-label`
- [ ] Heading hierarchy sequential (h1 → h2 → h3, no skips)
- [ ] Form inputs have visible `<label>` (placeholder-only is forbidden)
- [ ] Errors announced via `aria-live="polite"` or `role="alert"`
- [ ] Lighthouse Accessibility ≥95 on `/` and `/faq`

### Color contrast
- [ ] Body text ≥4.5:1 on its surface
- [ ] Display headlines ≥3:1 (large text threshold) — verify any time `text-bone` lands near a light gradient or `text-ink/X` with X<80
- [ ] Focus outlines visible against both dark and paper surfaces
- [ ] §06 breathing radial doesn't drop card text below 4.5:1 at peak opacity

### Performance (ui-ux §3)
- [ ] No `loading="eager"` on below-the-fold images
- [ ] No new third-party scripts loaded synchronously
- [ ] LCP stays under 2.5s on 4G (verify in Vercel Speed Insights or Lighthouse mobile run)
- [ ] CLS under 0.1 (every async block reserves space via aspect-ratio or fixed height)

### Mobile (ui-ux §5)
- [ ] No horizontal scroll at 375px width
- [ ] Sticky bar visible after 1 viewport scroll, hidden on `/estimate` and `/contact`
- [ ] Touch targets and spacing verified on real device or DevTools mobile emulation
- [ ] Safe-area-inset honored where the sticky bar lands (verify on iPhone with home indicator)

---

## 13. Where to find what

| Need | File |
|---|---|
| Tokens | `app/globals.css:1-91` (`@theme` block) |
| Semantic classes | `app/globals.css:131-419` |
| Reduced-motion baseline | `app/globals.css:438-445` |
| Root chrome (nav, footer, sticky, fonts) | `app/layout.tsx` |
| Section conventions | `AGENTS.md` (canonical reference; this MASTER.md is a strict superset) |
| Canonical reveal pattern | `components/home/HowItWorks.tsx` |
| Surface primitives | `components/ui/Surface.tsx`, `components/ui/Button.tsx` |
| CTA primitives | `components/ui/PhoneCTA.tsx`, `components/ui/SmsCTA.tsx` |
| Sticky bar (section-aware theme + `inert` pattern) | `components/cta/StickyContactBar.tsx` |
| Mobile nav (focus trap, iOS-safe scroll lock) | `components/nav/Navigation.tsx` |
| FAQ accordion (deep linking, Lenis-aware scroll) | `components/faq/FAQAccordionList.tsx` |
| Word reveal | `components/effects/RevealWords.tsx` |
| Character reveal | `components/effects/SplitText.tsx` |
| Page-specific overrides | `design-system/pages/<page>.md` |
| Most recent audit | `audits/ui-ux-audit-<date>.md` (current: `audits/ui-ux-audit-2026-05-14.md`) |

---

## 14. Hierarchical retrieval contract

When implementing or auditing a specific page:

1. Open `design-system/pages/<page-name>.md` if it exists. Its rules **override** this MASTER.md.
2. If no page file exists, this MASTER.md is the sole authority.
3. If both exist and contradict, the page file wins **for that page only**. Other pages still follow MASTER.md.

Existing page files:
- `design-system/pages/home.md`
- `design-system/pages/faq.md`

---

## 15. What this document is not

- **Not** a Storybook. There is no component playground.
- **Not** a marketing brand book. Voice rules live in §1 + §11; logo / wordmark / photography guidelines live elsewhere (if at all).
- **Not** auto-generated. Updated by hand when token values, primitives, or conventions change.
- **Not** the place for tactical fix lists. Those live in `audits/ui-ux-audit-<date>.md`. This document captures *what should be true*; the audit captures *what isn't yet*.
