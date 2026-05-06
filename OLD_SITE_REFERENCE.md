# OLD_SITE_REFERENCE — pre-wipe snapshot

This file is for **future Claude** to scan when the user asks "can we bring back X from the old site?" It is gitignored. The actual old code lives in git history — use the recovery commands at the bottom.

## Identity

- **Project**: SP Automotive Collision & Repair
- **Domain**: exotic-car collision repair, Sarasota, FL
- **Tagline**: "Built where it broke."
- **Phone**: (941) 599-4025
- **Pre-wipe URL**: https://sp-automotive.vercel.app (placeholder Vercel domain)
- **Brands featured**: Lamborghini, McLaren, Audi R8, BMW M

## Last live commit (pre-wipe)

```
SHA:     f03cb68b41492b51ba83ad4b949c91a0ac40f0fb
Date:    2026-04-29 17:39:59 -0400
Subject: Merge pull request #4 from ampaiservices/develop
```

Anything below references this commit. To inspect any file as it existed pre-wipe:
```
git show f03cb68:<path>
```

## Stack snapshot

| Layer | Choice |
| --- | --- |
| Framework | Next.js **16.2.4** (App Router, Turbopack `root: __dirname`) |
| React | **19.2.4** |
| Language | TypeScript 5 (strict, target ES2017, path alias `@/*`) |
| Styling | Tailwind CSS **v4** with `@theme` block in `app/globals.css` (no `tailwind.config.*` file) |
| Animation | Framer Motion 12.38.0 + GSAP 3.15.0 (dual libs — Framer for React, GSAP for complex effects) |
| Icons | Lucide React 1.12.0 |
| Analytics | `@vercel/analytics` 2 + `@vercel/speed-insights` 2 |
| Image processing | `sharp` 0.34.5 (devDep, used by build scripts) |
| Package manager | Bun 1.3.6 (committed `bun.lock`, `engines.bun: ">=1.3.0"`) |
| Fonts | Google: **Anton** (display, weight 400) + **Manrope** (body, weights 400+500 — 600/700 dropped to save ~36KB) |
| CI | `.github/workflows/ci.yml` — lint, build, typecheck on push/PR |

`next.config.ts` was minimal — only `turbopack.root` was set.

## Routes (App Router)

```
app/
├── page.tsx                                            (home)
├── layout.tsx                                          (root layout — fonts, JsonLd, CustomCursor, Analytics, Navigation, Footer)
├── globals.css                                         (Tailwind v4 + design system)
├── favicon.ico
├── robots.ts                                           (generates robots.txt)
├── sitemap.ts                                          (generates sitemap.xml)
├── opengraph-image.tsx                                 (dynamic OG image)
├── not-found.tsx                                       (404 page)
├── about/page.tsx
├── contact/page.tsx
├── process/page.tsx
├── audi-r8-collision-repair-sarasota/page.tsx
├── lamborghini-collision-repair-sarasota/page.tsx
└── mclaren-collision-repair-sarasota/page.tsx
```

7 user-facing routes. The 3 brand-specific landers were SEO/PPC landing pages keyed by exact-match search intent.

## Components catalog

```
components/
├── about/         AboutHero, AboutStory, AboutStrip
├── analytics/     Analytics                            (wraps @vercel/analytics + speed-insights)
├── brand/         BrandPage, BrandHero, BrandServices, BrandModels, brands-data.ts
├── cta/           FinalCTA
├── effects/       CustomCursor, Magnetic, ParticleField, RevealWords
├── footer/        Footer
├── gallery/       BeforeAfterGallery
├── hero/          HeroVideo
├── nav/           Navigation
├── process/       ProcessBeat, ProcessNarrative, ProcessNarrativeMobile
├── seo/           LocalBusinessJsonLd                  (LocalBusiness JSON-LD schema injected in <head>)
├── showroom/      ShowroomSection
├── testimonials/  TestimonialsSection, testimonials-data.ts
└── ui/            Button, PhoneCTA
```

**27 component files across 16 subdirs.** Notable patterns:
- **Data-driven content**: `brand/brands-data.ts` and `testimonials/testimonials-data.ts` held all content as TS objects, components rendered them.
- **Custom-built effects** (in `effects/`):
  - `CustomCursor` — replaces native cursor; reads `data-cursor="..."` attribute on hover targets to swap label
  - `Magnetic` — element pulled toward cursor on hover
  - `ParticleField` — canvas-based particle background
  - `RevealWords` — text reveal animation, word-by-word
- **Mobile-specific**: `ProcessNarrativeMobile` was a separate component (not just media-query CSS) for performance/UX reasons on touch.
- `BrandPage` was the shared template — the 3 brand routes all rendered `<BrandPage brand={...} />`.

## `lib/` files

- `lib/site.ts` — site constants: `SITE_NAME`, `SITE_URL`, `TAGLINE`, `PHONE`, `PHONE_HREF`, `CITY="Sarasota"`, `REGION="FL"`. The TODO note said "replace with real domain once Serge approves v1 and DNS is set."
- `lib/process-narrative.ts` — ~5KB structured content for the process page (the 6-step narrative). Plain TS data export.
- `lib/hooks/useMediaQuery.ts` — responsive hook used by `ProcessNarrativeMobile`.

## Design tokens (from old `app/globals.css`)

**Palette** (dark theme):
- `--color-bg: #000000`
- `--color-surface: #0A0A0A`
- `--color-text: #F5F5F5`
- `--color-muted: #737373`
- `--color-divider: #1A1A1A`
- `--color-hairline: rgba(255, 255, 255, 0.10)`
- `--color-accent: #FFFFFF`

**Type families**:
- `--font-display: var(--font-anton), "Anton", "Impact", sans-serif`
- `--font-body: var(--font-manrope), "Manrope", system-ui, ...`

**Type scale** (1.333 perfect-fourth ratio, fluid via `clamp()`):
- `--text-eyebrow: 0.75rem` (12px)
- `--text-caption: 0.875rem` (14px)
- `--text-body: 1.0625rem` (17px — note: deliberately above the 16px floor for "premium feel")
- `--text-lead: 1.1875rem` (19px)
- `--text-display-sm: clamp(1.75rem, 3vw + 0.5rem, 2.75rem)`
- `--text-display-md: clamp(2.5rem, 6vw + 0.5rem, 5rem)`
- `--text-display-lg: clamp(3.25rem, 9vw, 7.5rem)`
- `--text-display-xl: clamp(4rem, 13vw, 10rem)`

**Tracking / leading**: `--tracking-eyebrow: 0.3em`, `--tracking-display: -0.02em`, `--leading-display: 0.95`

**Z-index scale**: `--z-base:0, --z-overlay:10, --z-section:30, --z-nav:50, --z-cursor:70, --z-modal:80, --z-toast:90, --z-skip:100`

**Semantic CSS classes** (defined globally, used instead of stacked Tailwind utilities):
- `.eyebrow` — uppercase 12px label with 0.3em tracking, muted color
- `.display-xl/.display-lg/.display-md/.display-sm` — Anton headlines
- `.lead` — 19px lead paragraph at 85% opacity
- `.link-underline` — left-to-right wipe underline on hover/focus, with `prefers-reduced-motion` fallback
- `.film-grain::before` — fixed-position SVG turbulence overlay at 0.06 opacity (0.04 with reduced motion), `mix-blend-mode: overlay`. Applied via `<body className="film-grain">`.

**Other**: smooth scroll with `prefers-reduced-motion` fallback, white selection on black bg, 2px white focus ring with 2px offset, tabular-nums + antialiased rendering, `font-size: 17px` on body.

## Public assets

| Path | Files |
| --- | --- |
| `public/hero-clips/` | `cinematic.mp4` + `cinematic-poster.webp` (LCP-critical poster preloaded in `<head>`) |
| `public/hero-frames/` | `01-wreck.webp` … `06-reveal.webp` (6 frames, collision narrative) |
| `public/process-narrative/` | `01-assessment.webp` … `06-return.webp` (6 frames, repair workflow) |
| `public/before-after/` | 8 jpg pairs `01..04` × `before/after` |
| `public/logos/` | `sp-mark.png`, `sp-mark.jpeg`, `sp-illustration.png`, `sp-illustration.svg` |
| `public/` (root) | `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` (Next default starter SVGs) |

Total ~32 files, ~2.5MB.

## `scripts/` (asset pipeline, all TS, all run via Bun)

| Script | Purpose |
| --- | --- |
| `gen-gallery-placeholders.ts` | Generate placeholder before/after images |
| `gen-hero-placeholders.ts` | Generate hero-frame placeholders |
| `import-hero-frames.ts` | Import a hero-frame sequence from source |
| `jpg-to-webp.ts` | Convert jpg to webp |
| `process-logo.ts` | Process brand logos |
| `strokeify-svg.ts` | Convert SVG fills to strokes |
| `vectorize-illustration.ts` | Vectorize raster illustrations |

If you ever need similar utilities again, check `git show f03cb68:scripts/<file>.ts`.

## Behavioral notes / gotchas

- **`PhoneCTA` cursor label**: there is a persistent feedback memory (`feedback_phone_cta_no_hover_label.md`) — **do NOT reintroduce `data-cursor="Call"` on the phone CTA wrapper.** Removal was intentional. If a new site has a phone CTA, this still applies.
- **LCP optimization**: the layout deliberately preloaded only `cinematic-poster.webp`, NOT the video itself — explicit `<video preload>` was tanking LCP at 9.8MB.
- **Manrope weight pruning**: only 400 + 500 were loaded. 600/700 were unused after a typography sweep, saving ~36KB. If a designer asks for bold Manrope, weights need adding.
- **Sharp**: was in `ignoreScripts` + `trustedDependencies` because of Bun postinstall semantics. If `sharp` is reintroduced, those entries need to come back.
- **Turbopack root**: was explicitly set in `next.config.ts` because the project sits under a parent `amp/` directory and Next was misdetecting the workspace root.

## `docs/copy-options.md`

A 5.9KB content file with copy variations (likely A/B alternatives for headlines and CTAs). If the new site needs voice/tone reference for the same business, retrieve via `git show f03cb68:docs/copy-options.md`.

## Recovery commands

```bash
# Find the last pre-wipe commit
git log --oneline -- app components lib public scripts docs | head

# View any file as it was pre-wipe
git show f03cb68:components/effects/CustomCursor.tsx

# Restore a single file to the working tree (does NOT change history)
git checkout f03cb68 -- components/effects/CustomCursor.tsx

# Restore an entire directory
git checkout f03cb68 -- components/

# View the full pre-wipe tree
git ls-tree -r --name-only f03cb68
```
