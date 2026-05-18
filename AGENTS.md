<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:design-system -->
# Design system reference

**Tokens** (all in `app/globals.css` under `@theme`):
- Backgrounds: `--color-ink` #0E0F11, `--color-ink-deep` #0A0B0D, `--color-steel` #2A2D32, `--color-paper` #F4F2EE
- Text: `--color-bone` #C9C4BB (headlines + body on dark), `--color-graphite` #6E727A — **labels only** (eyebrows, `.spec`/`.annotation` mono, uppercase tracked captions, `text-[10px]` annotations, placeholders, decorative `text-graphite/X` opacity variants). Do not use `text-graphite` for body prose: it sits at ~3.9–4.3:1 on both ink and paper which fails WCAG AA. Body prose on dark → `text-bone/85` (~8.3:1); body prose on paper → `text-ink/80` (~9.9:1).
- Accent: `--color-ignite` #C8281D — **brake-light reserved**, use exactly once per section maximum
- Structure: `--color-hairline` rgba(201,196,187,0.10) for borders; never full-strength borders
- Tailwind utilities work directly off these tokens: `bg-ink`, `text-bone`, `border-hairline`, `bg-steel`, etc.

**Type**:
- Display: Anton (single weight, condensed). Use for numerals, headlines, big tracked-uppercase labels.
- Body: Hanken Grotesk (7 weights). Use for paragraphs, eyebrows, UI.
- Always `tabular-nums` for numbers, especially in cards/stats.
- Eyebrows: `.eyebrow` class — 11px Hanken uppercase, tracking 0.18em. Prefix with `//` for in-content callouts (`// We work with`, `// Supplement ledger`).

**Section conventions** (homepage `app/page.tsx`):
- Every section opens with a single Anton uppercase label: `font-display uppercase tracking-[0.10em] text-left text-3xl md:text-5xl leading-none` (text-ink on paper, text-bone on dark). No chapter numerals — that pattern was retired 2026-05-14. See `InsuranceHandling.tsx`, `TheMath.tsx`, `HomeFAQ.tsx`.
- Unnumbered utility sections (TrustStrip, FeaturedBuilds) use a smaller tracked-uppercase label only ("SELECTED WORK", "// WE WORK WITH"). The `//` prefix marks an in-content callout (tech's marginal note); plain uppercase reads as a section badge.
- Sections meant to fill the viewport use `min-h-[110svh]`. Content-fit sections use `min-h-screen` or `auto`.
- Reveal animations driven by `IntersectionObserver` flipping `section.dataset.revealed = "1"`, then styled-jsx transitions on child elements keyed off `[data-revealed="1"]`. See `HowItWorks.tsx` for the canonical pattern.
- Glass cards: `<Surface variant="glass">` with `rounded-2xl`. Don't double-stack glass on glass — one surface per element.

**Voice**: "Workshop cinema × owner's manual". Concrete, evidentiary. No marketing-speak. Short paragraphs. Tabular figures over vague claims.

**Reduced motion**: every animation must check `useReducedMotion()` (framer-motion) or `prefers-reduced-motion` CSS — fall back to final state with no animation.
<!-- END:design-system -->
