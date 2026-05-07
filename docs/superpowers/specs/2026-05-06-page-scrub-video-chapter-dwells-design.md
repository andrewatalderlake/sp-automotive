# Page-scrub video — chapter dwells

**Status:** approved
**Date:** 2026-05-06
**Touches:** `components/effects/PageScrubVideo.tsx`, `components/home/CornerSection.tsx`, `components/home/TotalLossPlay.tsx`, `components/home/InsuranceHandling.tsx`, `components/home/StorageBlock.tsx`

## Context

`PageScrubVideo` is a fixed-position background video on the landing page. Currently it maps total document scroll progress linearly to `video.currentTime` — every pixel of scroll advances the clip by the same amount of video time. The result is a continuous play-while-scroll effect with no rest points.

The home page is composed of four numbered "chapter" sections (`CornerSection` instances with `chapterNumber="01"…"04"`) plus three unnumbered sections (Hero, AboutStrip, FinalCTA). Each chapter has a piece of clip footage that the chapter is "about" — the engine bay, the carbon-fiber piece, the wheel — and we want the clip to *come to rest on those frames* when the chapter is on-screen, then continue scrubbing toward the next one.

After the last numbered chapter, the clip should play through to its end as the user scrolls past the unnumbered final sections.

## Requirements

- Chapter 01 (`TotalLossPlay`) dwells on **t = 7s** (engine bay).
- Chapter 02 (`InsuranceHandling`) dwells on **t = 11s** (carbon-fiber piece).
- Chapter 03 (`StorageBlock`) dwells on **t = 18s** (wheel).
- Chapter 04 (`BodyworkAndEstimates`) does **not** dwell — clip scrubs through its scroll range.
- AboutStrip + FinalCTA (sections 6 & 7) — clip continues scrubbing to its end (~29.35s).
- The dwell window is centered on the scroll position at which the chapter visually fills the viewport, with a configurable padding before and after ("a little before, a little after").
- Reduced-motion behavior preserved (poster only, no scroll listener).
- Mobile parity — same logic, same dwell behavior.

## Approach: piecewise-linear scroll → time mapping

Replace the linear formula

```
time = (scrolled / total) * duration
```

with piecewise-linear interpolation across an array of `(scrollY, time)` waypoints. The crucial trick: **two consecutive waypoints with the same `time` produce a dwell** — `scrollY` moves through the segment but `time` stays fixed.

### Waypoint construction

On mount, after resize, and when the document height changes (existing `ResizeObserver`), build an ordered waypoint array:

```ts
const DWELL_PAD_VH = 0.25; // half-width of dwell window, in viewport heights

waypoints = [
  { scrollY: 0,                                time: 0 },

  // Per chapter with a scrubTime, two waypoints with identical time = dwell.
  ...chapters.flatMap(({ el, time }) => {
    const center = el.offsetTop + el.offsetHeight / 2 - vh / 2;
    const pad = DWELL_PAD_VH * vh;
    return [
      { scrollY: center - pad, time },
      { scrollY: center + pad, time },
    ];
  }),

  { scrollY: maxScroll, time: duration - 0.05 },
];
```

Where `maxScroll = documentElement.scrollHeight - vh` and `vh = window.innerHeight`.

### Apply function

`apply()` (called from rAF inside `onScroll`) becomes:

1. Read `scrolled = clamp(window.scrollY, 0, maxScroll)`.
2. Find the segment `[i, i+1]` such that `waypoints[i].scrollY ≤ scrolled ≤ waypoints[i+1].scrollY`. Linear scan is fine — at most ~8 waypoints.
3. Lerp: `t = (scrolled − wp[i].scrollY) / (wp[i+1].scrollY − wp[i].scrollY)`. Clamp `t` in `[0, 1]`.
4. `time = lerp(wp[i].time, wp[i+1].time, t)`.
5. Apply existing seek-threshold gate (`Math.abs(time − lastTarget) < 0.03`) before writing `video.currentTime`.

If two adjacent waypoints have the same `time`, step 4 returns that `time` regardless of `t` — that's the dwell.

### Section discovery

`PageScrubVideo` discovers chapters via a DOM contract, not via React props/context — it already operates outside the React tree (raw event listeners, refs, ResizeObserver), so a DOM contract is the smaller-footprint match.

```ts
// In PageScrubVideo
const els = Array.from(
  document.querySelectorAll<HTMLElement>("[data-scrub-time]")
);
const chapters = els
  .map(el => ({ el, time: Number(el.dataset.scrubTime) }))
  .filter(c => Number.isFinite(c.time))
  .sort((a, b) => a.el.offsetTop - b.el.offsetTop);
```

Re-discover chapters inside the same callback that already handles resize-driven height recomputation, so the waypoint array refreshes whenever layout changes.

### CornerSection wiring

`CornerSection` accepts an optional `scrubTime?: number` prop and renders it as a data attribute:

```tsx
<section
  aria-labelledby={headingId}
  data-scrub-time={scrubTime}
  className="..."
>
```

When `scrubTime` is `undefined`, React omits the attribute, so non-dwelling chapters (chapter 04) and other sections aren't picked up. The three dwelling chapters pass `scrubTime={7 | 11 | 18}` respectively.

`CornerSection` itself learns nothing about the scrub mechanism — it just forwards a number into the DOM.

## Tuning

- **`DWELL_PAD_VH`** controls how long the video sits on each frame. `0.25` gives a 50vh dwell window centered on the chapter's "fills viewport" scroll position, which leaves 50vh of scroll between dwells for the inter-chapter scrub. Adjustable in one place.
- The three chapter timestamps live in their respective component files (one number each), not inside `PageScrubVideo`, so writers can re-tune narrative beats without touching the scrub engine.

## Edge cases & failure modes

- **Tall content** — if a chapter section grows past `100svh` because of long copy, `el.offsetTop + el.offsetHeight/2 − vh/2` correctly picks the scroll position where the section's center aligns with the viewport center. Dwell width remains `2 * DWELL_PAD_VH * vh`.
- **Document height changes after mount** (font swap, hero clip metadata loaded, image lazy-loads) — the existing `ResizeObserver` already triggers `recacheHeight`; we extend it to also rebuild waypoints.
- **Chapters discovered before metadata** — the existing flow already gates `currentTime` writes on `video.duration` being defined; the final waypoint's `time` is `duration − 0.05`, so we just defer building until `loadedmetadata` fires (mirrors the current `onMeta` path).
- **Cross-chapter scrub through small time delta** — the existing `0.03` seek threshold prevents excessive seeks.
- **Reduced-motion** — the early `if (reduced) return` continues to short-circuit. Static poster path is untouched.
- **Mobile / small viewports** — `DWELL_PAD_VH` is in viewport-heights, so dwell width scales with the device. Section heights are `100svh` so layout math is identical.

## Out of scope

- Re-encoding or trimming the video clip.
- Adding new chapters or rearranging section order.
- Per-chapter custom easing curves (the design uses straight lerp between waypoints — a chapter that wants a non-linear scrub would need an explicit ease function; we'll add it only if the linear feel is wrong in practice).
- A scrim/fade for AboutStrip + FinalCTA.

## Verification

1. **Visual scroll check (dev server)**
   - `bun dev`, open `/` in a desktop viewport.
   - Slowly scroll: clip starts at the cinematic-poster frame; as the user enters chapter 01 (TotalLossPlay), the engine-bay frame settles in and stays for the duration that chapter fills the viewport (and a touch on either side).
   - Same behavior for chapters 02 (carbon-fiber piece) and 03 (wheel).
   - Past chapter 03 (BodyworkAndEstimates → AboutStrip → FinalCTA), the clip plays through smoothly to its final frame.
   - Reverse scroll exhibits the same dwells.

2. **Reduced motion**
   - Toggle "Reduce motion" in OS settings; reload `/`.
   - Confirm static poster shows and no scroll listener fires (the existing branch handles this — sanity check it still does).

3. **Resize / orientation**
   - Resize the window mid-scroll; dwells stay aligned with their chapters (waypoints rebuild on `ResizeObserver`).

4. **Type / lint**
   - `bun run typecheck` and `bun run lint` clean.
