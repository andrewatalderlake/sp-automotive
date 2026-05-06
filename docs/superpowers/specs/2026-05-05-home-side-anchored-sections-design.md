# Home page — side-anchored cinematic sections

**Date:** 2026-05-05
**Status:** Design ratified via visual companion. Awaiting written-spec approval before implementation plan.

## Context

Yesterday we shipped four new home-page copy sections (Total-loss play, Insurance handling, Storage, Bodywork & estimates) on top of the existing `PageScrubVideo` cinematic background. They render as centered Surface scrim cards. Andrew's reaction:

> "I don't like that the sections are literally right on the frames so I'd want it off to the side and kind of like an animation to it. I'll use some tools from 21st.dev. I kind of want around the corners a lot more and then bring them all to the side."

The centered-scrim composition kills the cinematic intent — the scrim card sits dead-center over the video subject matter and forces the viewer to read through a blur. The redesign moves copy to the corners and out of the video's path, lets the cinematic clip play through the diagonal, and adds slide-in motion so each section feels like it arrives.

A scroll-direction bug from the same conversation (going down then back up) was raised separately and parked — Andrew confirmed it's not a current priority. The scrim change in this spec is also expected to reduce compositor strain (no more `backdrop-blur-sm` over a fixed video on five surfaces), so the bug may resolve as a side effect.

## Decisions

All four picks were validated through visual mockups in the brainstorming companion (`/.superpowers/brainstorm/68300-1778035585/content/`).

| Dimension | Pick | What it means |
|---|---|---|
| **Layout** | C — Corner labels + diagonal floating body | Chapter mark pinned top-left of the section frame; body copy floats in a constrained column anchored to the bottom-right. The diagonal between them is uninterrupted video bleed. |
| **Animation** | C — Slide in from corner + edge | Chapter number slides in diagonally from off-screen top-left; body slides in from off-screen right edge. Both anchor at final position. ~800ms total, snappy ease (`cubic-bezier(0.65, 0, 0.35, 1)`). Triggers on enter-viewport. |
| **Scrim** | B — Corner radial gradients | Soft dark radial gradients fade in from the top-left and bottom-right corners only. The diagonal video bleed stays untouched and bright. Pure CSS gradients — no `backdrop-filter`. |
| **About + CTA** | Y — Sections corner-anchored, About + CTA stay centered | The four substantive sections adopt the new pattern. `AboutStrip` and `FinalCTA` remain as centered scrim cards (acting as "checkpoint" punctuation that signals "stop and act"). No changes ripple to other pages where these components are used. |
| **Implementation** | Approach 1 — Primitive + thin wrappers | One new `<CornerSection>` primitive owns layout + motion + scrim. The four existing section components become props-only wrappers. |

## Architecture

### New primitive

**`components/home/CornerSection.tsx`** — single file owns the layout grid, corner vignettes, motion, and slot positioning.

```tsx
type CornerSectionProps = {
  /** Two-digit chapter number, displayed monospace top-left ("01", "02"…) */
  chapterNumber: string;
  /** Eyebrow text below the chapter number (uppercase, tracked) */
  eyebrow: string;
  /** Headline (display face, two-line max recommended) */
  headline: ReactNode;
  /** Body copy — accepts paragraphs, optional muted variant */
  body: ReactNode;
  /** Optional CTA row beneath the body (used by section 04) */
  cta?: ReactNode;
  /** Section heading id for aria-labelledby */
  headingId: string;
};
```

The primitive renders a `<section>` with:
- `min-h-[100svh]` and `relative` — so it provides one viewport of scroll runway and stacks above the fixed `PageScrubVideo`
- Two pseudo-element radial gradients pinned to top-left and bottom-right (CSS `::before` and `::after`)
- A grid that places chapter mark in `top-left`, body in `bottom-right`
- A `motion.div` wrapper for each animated element (chapter mark + body) with the slide-in variants

**Sizing tokens (desktop, ≥768px):**
- Section padding: `px-10 py-20`
- Chapter mark: monospace, `text-5xl` (~48px) for the number, `text-[10px] tracking-[0.3em] uppercase` for the eyebrow
- Body block: anchored bottom-right with `max-w-md` (~28rem / 448px); headline `display-md`, body paragraphs `lead`
- Vignette spread: top-left ellipse `45% × 45%`, bottom-right ellipse `60% × 55%`, both with `rgba(0,0,0,0.78)` core fading to transparent at 70%

### Wrappers (refactor, no API change to consumers)

**`components/home/TotalLossPlay.tsx`**, **`InsuranceHandling.tsx`**, **`StorageBlock.tsx`**, **`BodyworkAndEstimates.tsx`** become 8-line files that render `<CornerSection {...props} />`. The home page (`app/page.tsx`) keeps its current import structure and ordering — no changes to `app/page.tsx`.

### Unchanged

- `app/page.tsx` — composition stays the same
- `components/about/AboutStrip.tsx` — remains the centered Surface scrim card
- `components/cta/FinalCTA.tsx` — remains the centered Surface scrim card
- `components/effects/PageScrubVideo.tsx` — unchanged (the redesign just changes what renders above it)
- All other pages that use `AboutStrip` or `FinalCTA` — unchanged

## Animation contract

Motion lives inside `CornerSection` via `framer-motion` (already in deps from `RevealWords`). Two animated elements per section, both triggered by `useInView` with `margin: "-15% 0px -15% 0px"` and `once: true`.

```tsx
// chapter mark (top-left)
const chapterMarkVariants = {
  hidden: { opacity: 0, x: -40, y: -40 },
  visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.55, ease: [0.65, 0, 0.35, 1] } },
};

// body (bottom-right)
const bodyVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.15, ease: [0.65, 0, 0.35, 1] } },
};
```

Both honor `useReducedMotion` — when reduced, render at the final position with no transform.

### 21st.dev plug-in point

The motion variants live as named constants at the top of `CornerSection.tsx`. To swap to a 21st.dev component, replace the two `<motion.div>` wrappers with the chosen 21st.dev primitive — single-file change, four sections update together. Variants stay co-located so the substitution is obvious.

If per-section motion becomes a requirement later, refactor to Approach 2 (motion render-prop). Not premature today.

## Scrim treatment

Two pseudo-element radial gradients on the section container:

```css
&::before {
  /* top-left vignette */
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse 45% 45% at top left, rgba(0,0,0,0.78), transparent 70%);
}
&::after {
  /* bottom-right vignette */
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse 60% 55% at bottom right, rgba(0,0,0,0.78), transparent 70%);
}
```

No `backdrop-blur`, no `backdrop-filter`. Pure painted gradients — cheap on the compositor, no Safari quirks, doesn't add to the scroll-direction bug surface area.

## Mobile fallback (< 768px)

Corner anchoring breaks at narrow widths. On mobile:

- Section padding shrinks to `px-6 py-16`
- Chapter mark scales down to `text-3xl` (~30px) for the number and pins top-left at the smaller padding
- Body copy moves below the chapter mark, **left-aligned, max-width none** (full content-width minus padding) — no longer bottom-right anchored, no longer right-aligned
- Vignettes shift from corners to top + bottom: `radial-gradient(ellipse 100% 40% at top, rgba(0,0,0,0.78), transparent 70%)` and `… at bottom`
- Motion simplifies — no horizontal slide (feels janky on narrow screens):
  - Chapter mark: `hidden: { opacity: 0, y: -16 }` → `visible: { opacity: 1, y: 0 }` (~500ms)
  - Body: `hidden: { opacity: 0, y: 16 }` → `visible: { opacity: 1, y: 0 }` (~600ms, 150ms delay)

Switch via `useMediaQuery("(min-width: 768px)")` (already in the codebase as `lib/hooks/useMediaQuery.ts`). Server-side render the mobile variant as the safe default — same pattern `ProcessNarrative` uses today.

The cinematic video stays full-bleed underneath on mobile too. Section height stays `min-h-[100svh]` to preserve the scroll runway for `PageScrubVideo`.

## Migration steps

1. Build `components/home/CornerSection.tsx` with full layout + motion + scrim + mobile fallback
2. Refactor `TotalLossPlay.tsx` → 8-line wrapper passing copy props
3. Refactor `InsuranceHandling.tsx` → wrapper
4. Refactor `StorageBlock.tsx` → wrapper
5. Refactor `BodyworkAndEstimates.tsx` → wrapper (this one passes a `cta` prop with `<PhoneCTA />` + `<SmsCTA />`)
6. Verify `bun run build` passes
7. `bun dev` walkthrough — desktop (1440px) + mobile (375px) — confirm corner anchoring, vignette legibility on light frames, motion on enter, no regression to scroll behavior
8. (Optional) After Andrew lives with it: revisit the parked scroll-direction bug if it persists

No changes to `app/page.tsx`, `AboutStrip`, `FinalCTA`, `PageScrubVideo`, or any other file.

## Out of scope

- Changing `AboutStrip` on `/about` or anywhere else
- Changing `FinalCTA` copy or layout on the 8+ pages it appears (the C2 copy update from yesterday stands)
- Adding new sections beyond the existing four
- Resolving the parked scroll-direction bug (separate triage when/if Andrew sees it again)
- Choosing or installing specific 21st.dev components (Andrew will do this and may swap the motion wrapper later)
- Building brand pages for BMW M / Ferrari / Porsche / Mercedes-AMG / Aston Martin (out of scope yesterday too)

## Verification

After implementation:
- `bun run build` passes with no TypeScript errors and all routes prerender
- Desktop walkthrough at 1440px: each of the four sections shows chapter mark top-left, body bottom-right, video bleed visible through the diagonal
- Mobile walkthrough at 375px: chapter mark scales down, body left-aligns below it, no horizontal scroll
- Scroll all four sections into view and back: motion plays once on enter, doesn't re-trigger on scroll-back (`once: true`)
- Test with `prefers-reduced-motion: reduce` (Chrome devtools → Rendering): copy renders at final position without motion
- Stress legibility: pause the cinematic video on its brightest frame (paint booth / weld spark) and confirm copy is still readable
