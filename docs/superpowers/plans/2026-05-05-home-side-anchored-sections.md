# Home page side-anchored cinematic sections — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the four home-page copy sections (Total-loss play, Insurance handling, Storage, Bodywork & estimates) from centered Surface scrim cards to corner-anchored compositions with slide-in motion and corner-radial-gradient vignettes — letting the cinematic `PageScrubVideo` play through the diagonal.

**Architecture:** One new `<CornerSection>` primitive at `components/home/CornerSection.tsx` owns the layout grid, vignette gradients, motion variants, and mobile fallback. The four existing section components become thin prop-passing wrappers. `app/page.tsx`, `AboutStrip`, `FinalCTA`, and `PageScrubVideo` are unchanged. Spec at `docs/superpowers/specs/2026-05-05-home-side-anchored-sections-design.md`.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind v4, framer-motion v12 (already in deps), Bun runtime. Verification: `bun run typecheck`, `bun run build`, manual `bun dev` walkthrough. No unit test framework in the repo; static component refactor is verified by typecheck + visual confirmation.

---

## File structure

**Create (1 file):**
- `components/home/CornerSection.tsx` — primitive: layout + vignettes + motion + mobile fallback

**Modify (4 files — full rewrite of each, ~12 lines each post-refactor):**
- `components/home/TotalLossPlay.tsx`
- `components/home/InsuranceHandling.tsx`
- `components/home/StorageBlock.tsx`
- `components/home/BodyworkAndEstimates.tsx`

**Unchanged (do not touch):**
- `app/page.tsx` — composition stays as-is
- `components/about/AboutStrip.tsx`
- `components/cta/FinalCTA.tsx`
- `components/effects/PageScrubVideo.tsx`
- `lib/site.ts` and the JSON-LD it feeds
- `lib/hooks/useMediaQuery.ts` (already exists, used as-is)

---

## Task 1: Build the CornerSection primitive

**Files:**
- Create: `components/home/CornerSection.tsx`

This is the only non-trivial file in the plan. It owns the layout responsibility (corner anchoring + diagonal video bleed), the vignette CSS gradients, the framer-motion variants, and the desktop/mobile branching. The four section wrappers in tasks 2–5 just pass props.

- [ ] **Step 1: Write `components/home/CornerSection.tsx`**

```tsx
"use client";
import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

// Corner-anchored cinematic section primitive used by the four home-page copy
// blocks. Chapter mark pins to the top-left, body floats anchored bottom-right
// on desktop / stacks below the chapter mark on mobile. The diagonal between
// them is uninterrupted PageScrubVideo bleed; vignette gradients in the two
// occupied corners keep copy legible on bright video frames.
//
// Motion: chapter mark slides in diagonally from off-screen top-left, body
// slides in from off-screen right edge. Honors prefers-reduced-motion.

type Props = {
  /** Two-digit chapter number, displayed monospace top-left ("01", "02"...). */
  chapterNumber: string;
  /** Eyebrow text below the chapter number — uppercase, tracked. */
  eyebrow: string;
  /** Headline (display face). Two short lines reads best. */
  headline: ReactNode;
  /** Body copy — accepts paragraphs/markup. */
  body: ReactNode;
  /** Optional CTA row beneath the body. Used by section 04. */
  cta?: ReactNode;
  /** id for aria-labelledby; the headline renders with this id. */
  headingId: string;
};

const EASE = [0.65, 0, 0.35, 1] as const;

const chapterDesktop: Variants = {
  hidden: { opacity: 0, x: -40, y: -40 },
  visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.55, ease: EASE } },
};
const bodyDesktop: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.15, ease: EASE } },
};
const chapterMobile: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};
const bodyMobile: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.15, ease: EASE } },
};

const VIGNETTE_DESKTOP =
  "radial-gradient(ellipse 45% 45% at top left, rgba(0,0,0,0.78), transparent 70%)," +
  "radial-gradient(ellipse 60% 55% at bottom right, rgba(0,0,0,0.78), transparent 70%)";
const VIGNETTE_MOBILE =
  "radial-gradient(ellipse 100% 40% at top, rgba(0,0,0,0.78), transparent 70%)," +
  "radial-gradient(ellipse 100% 40% at bottom, rgba(0,0,0,0.78), transparent 70%)";

export default function CornerSection({
  chapterNumber,
  eyebrow,
  headline,
  body,
  cta,
  headingId,
}: Props) {
  const reduced = useReducedMotion();
  // SSR fallback `false` = render mobile shell on server (safe default for slow
  // hydration on real mobile). Matches the convention in ProcessNarrative.
  const isDesktop = useMediaQuery("(min-width: 768px)", false);

  const chapterVariants = isDesktop ? chapterDesktop : chapterMobile;
  const bodyVariants = isDesktop ? bodyDesktop : bodyMobile;

  // Reduced motion: skip the slide-in entirely; render at final position.
  const motionProps = reduced
    ? { initial: false as const, animate: "visible" as const }
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, margin: "-15% 0px -15% 0px" },
      };

  return (
    <section
      aria-labelledby={headingId}
      className={`relative min-h-[100svh] w-full overflow-hidden ${
        isDesktop ? "px-10 py-20" : "px-6 py-16"
      }`}
    >
      {/* Vignette gradients — pure CSS, no backdrop-filter (cheap on compositor). */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: isDesktop ? VIGNETTE_DESKTOP : VIGNETTE_MOBILE }}
      />

      {/* Chapter mark — pinned top-left via section padding (document flow). */}
      <motion.div
        variants={chapterVariants}
        {...motionProps}
        className="relative z-10"
      >
        <div
          className={`font-display text-accent leading-none tracking-[-0.02em] ${
            isDesktop ? "text-5xl" : "text-3xl"
          }`}
        >
          {chapterNumber}
        </div>
        <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-accent/85">
          / {eyebrow}
        </p>
      </motion.div>

      {/* Body block — absolute bottom-right on desktop, in-flow below chapter on mobile. */}
      <motion.div
        variants={bodyVariants}
        {...motionProps}
        className={
          isDesktop
            ? "absolute right-10 bottom-20 z-10 max-w-md text-right"
            : "relative z-10 mt-12 max-w-none text-left"
        }
      >
        <h2 id={headingId} className="display-md text-bone leading-[1.05]">
          {headline}
        </h2>
        <div className="mt-6 lead text-bone/85">{body}</div>
        {cta && (
          <div
            className={`mt-10 flex flex-wrap gap-4 ${
              isDesktop ? "justify-end" : "justify-start"
            }`}
          >
            {cta}
          </div>
        )}
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Run typecheck to verify the new file compiles**

Run: `bun run typecheck`

Expected: exits 0, no output. If you see an error referencing `framer-motion` `Variants` type, the import is wrong — confirm the file uses `import { motion, useReducedMotion, type Variants } from "framer-motion"`.

- [ ] **Step 3: Run the dev server and visually verify (no consumer yet)**

This step confirms the file isn't broken in isolation; the visible result still requires Task 2.

Run: `bun dev`

Expected: dev server starts on http://localhost:3000 without errors. Stop with Ctrl-C after confirming the server is up.

- [ ] **Step 4: Commit**

```bash
git add components/home/CornerSection.tsx
git commit -m "feat(home): add CornerSection primitive for corner-anchored cinematic sections"
```

---

## Task 2: Refactor TotalLossPlay to use CornerSection

**Files:**
- Modify: `components/home/TotalLossPlay.tsx`

- [ ] **Step 1: Replace the entire contents of `components/home/TotalLossPlay.tsx`**

```tsx
import CornerSection from "./CornerSection";

export default function TotalLossPlay() {
  return (
    <CornerSection
      chapterNumber="01"
      eyebrow="The total-loss play"
      headingId="total-loss-heading"
      headline={
        <>
          70% of value.
          <br />
          The math turns.
        </>
      }
      body={
        <>
          <p>
            When the cost to repair crosses 70% of what the car is worth, the
            carrier owes you the car — not a patched copy of it. Settled in
            full. And on cars that have appreciated since you bought them,
            often $10–20k above what you paid.
          </p>
          <p className="mt-6 text-muted">
            We document the damage. We make the case. The carrier writes the
            check.
          </p>
        </>
      }
    />
  );
}
```

- [ ] **Step 2: Run typecheck**

Run: `bun run typecheck`

Expected: exits 0, no output.

- [ ] **Step 3: Visual verification — desktop**

Run: `bun dev` and open http://localhost:3000 in a 1440px-wide window.

Scroll past the hero. Section 01 should appear with:
- "01" in red display type pinned top-left
- "/ The total-loss play" eyebrow below it in tracked uppercase
- The headline "70% of value. The math turns." anchored bottom-right, right-aligned
- Body text below the headline, also right-aligned, max ~28rem wide
- Visible cinematic video bleed through the diagonal between corners
- Soft dark vignettes in the top-left and bottom-right corners only

Scroll the section back out and back in. The slide-in motion should play once and not retrigger.

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add components/home/TotalLossPlay.tsx
git commit -m "refactor(home): TotalLossPlay uses CornerSection primitive"
```

---

## Task 3: Refactor InsuranceHandling to use CornerSection

**Files:**
- Modify: `components/home/InsuranceHandling.tsx`

- [ ] **Step 1: Replace the entire contents of `components/home/InsuranceHandling.tsx`**

```tsx
import CornerSection from "./CornerSection";

export default function InsuranceHandling() {
  return (
    <CornerSection
      chapterNumber="02"
      eyebrow="We handle the carrier"
      headingId="insurance-handling-heading"
      headline={<>We fight the file. You stay out of it.</>}
      body={
        <>
          <p>
            Most body shops file the claim, take the margin, hand you the keys.
            Different math here. We document, supplement, negotiate — adjuster
            to estimator, line item to line item — until the carrier pays for
            the car you actually own.
          </p>
          <p className="mt-6 text-muted">
            You don&apos;t see the friction. You see the result.
          </p>
        </>
      }
    />
  );
}
```

- [ ] **Step 2: Run typecheck**

Run: `bun run typecheck`

Expected: exits 0, no output.

- [ ] **Step 3: Visual verification — desktop**

Run: `bun dev`. Scroll to section 02 ("We handle the carrier").

Confirm same corner-anchored layout as Task 2's verification, but with the new copy. Both sections should now match in form and feel.

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add components/home/InsuranceHandling.tsx
git commit -m "refactor(home): InsuranceHandling uses CornerSection primitive"
```

---

## Task 4: Refactor StorageBlock to use CornerSection

**Files:**
- Modify: `components/home/StorageBlock.tsx`

- [ ] **Step 1: Replace the entire contents of `components/home/StorageBlock.tsx`**

```tsx
import CornerSection from "./CornerSection";

export default function StorageBlock() {
  return (
    <CornerSection
      chapterNumber="03"
      eyebrow="Indoor storage"
      headingId="storage-heading"
      headline={<>Inside. Always.</>}
      body={
        <>
          <p>
            Every car lives behind a locked roll-up — totaled, mid-job,
            awaiting parts, ready for pickup. Climate controlled. Monitored.
            Keys with Serge, not on a board.
          </p>
          <p className="mt-6 text-muted">
            If overflow ever forces a different arrangement, you&apos;ll know
            before it happens.
          </p>
        </>
      }
    />
  );
}
```

- [ ] **Step 2: Run typecheck**

Run: `bun run typecheck`

Expected: exits 0, no output.

- [ ] **Step 3: Visual verification — desktop**

Run: `bun dev`. Scroll to section 03 ("Indoor storage").

Confirm corner anchoring and motion match the previous two sections.

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add components/home/StorageBlock.tsx
git commit -m "refactor(home): StorageBlock uses CornerSection primitive"
```

---

## Task 5: Refactor BodyworkAndEstimates to use CornerSection (with CTA)

**Files:**
- Modify: `components/home/BodyworkAndEstimates.tsx`

This section uses the optional `cta` prop on `CornerSection` for the inline Phone + SMS row beneath the body.

- [ ] **Step 1: Replace the entire contents of `components/home/BodyworkAndEstimates.tsx`**

```tsx
import CornerSection from "./CornerSection";
import PhoneCTA from "@/components/ui/PhoneCTA";
import SmsCTA from "@/components/ui/SmsCTA";

export default function BodyworkAndEstimates() {
  return (
    <CornerSection
      chapterNumber="04"
      eyebrow="Estimate without the haul"
      headingId="bodywork-estimates-heading"
      headline={<>We come to you.</>}
      body={
        <>
          <p>
            Cars that can&apos;t move don&apos;t have to. We bring the estimate
            to your driveway, your garage, your storage unit — wherever the
            car is. One to two days from the call to the written number.
          </p>
          <p className="mt-6 text-muted">
            Six days a week. Monday through Saturday.
          </p>
        </>
      }
      cta={
        <>
          <PhoneCTA size="lg" location="bodywork-estimates" />
          <SmsCTA location="bodywork-estimates" />
        </>
      }
    />
  );
}
```

- [ ] **Step 2: Run typecheck**

Run: `bun run typecheck`

Expected: exits 0, no output.

- [ ] **Step 3: Visual verification — desktop**

Run: `bun dev`. Scroll to section 04 ("Estimate without the haul").

Confirm:
- Same corner-anchored layout as sections 01–03
- A row of two buttons (Phone CTA + SMS CTA) appears below the body, right-aligned (matching the body's text-right), with `gap-4` between them
- Buttons are clickable; hovering them shows the magnetic interaction (PhoneCTA wraps in `<Magnetic>`)

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add components/home/BodyworkAndEstimates.tsx
git commit -m "refactor(home): BodyworkAndEstimates uses CornerSection primitive with CTA slot"
```

---

## Task 6: Final verification — full build + walkthrough + reduced-motion + mobile

**Files:** No code changes. Verification + commit if any housekeeping needed.

- [ ] **Step 1: Run full build**

Run: `bun run build`

Expected: build succeeds, all 23 routes prerender, no TypeScript errors, no warnings about new files. The summary table should show `/` as a static (`○`) route.

If the build fails: do not proceed. Read the error, fix the offending file, re-run build until clean.

- [ ] **Step 2: Run lint**

Run: `bun run lint`

Expected: exits 0 with no errors (warnings on pre-existing files are acceptable; new errors on the modified files are not).

- [ ] **Step 3: Desktop walkthrough at 1440px**

Run: `bun dev`. Open http://localhost:3000 in a 1440px-wide window.

Scroll top to bottom. In order, you should see:
1. **Hero** ("Totaled. Paid in Full.") — unchanged from before
2. **Section 01** (Total-loss play) — corner-anchored
3. **Section 02** (Insurance handling) — corner-anchored
4. **Section 03** (Indoor storage) — corner-anchored
5. **Section 04** (Bodywork & estimates) — corner-anchored, with Phone + SMS CTA row right-aligned beneath the body
6. **AboutStrip** — still a centered scrim card with `RevealWords` headline and "Read more about Serge →" link
7. **FinalCTA** — still a centered scrim card with the C2 copy ("Tell us what happened." / "We'll handle the rest." / "Photos by text. Estimate by phone. Insurance by us.")

Confirm the cinematic video plays through the diagonal of every corner-anchored section. Confirm AboutStrip and FinalCTA visibly differ in shape from the corner sections (they should — they're the punctuation).

- [ ] **Step 4: Mobile walkthrough at 375px**

Resize the window to 375px wide (or use Chrome DevTools device emulation → iPhone SE).

Sections 01–04 should now show:
- Chapter number at smaller scale (`text-3xl`) pinned top-left
- Body copy stacked below it, **left-aligned**, full content-width
- CTA row in section 04 stacks left-aligned (`justify-start`)
- Vignettes shifted to top + bottom edges (not corners)
- No horizontal scroll
- Section height stays a full viewport (`min-h-[100svh]`)

The cinematic video continues to play full-bleed underneath. Hero, AboutStrip, FinalCTA unaffected by the mobile changes.

- [ ] **Step 5: Reduced-motion check**

In Chrome DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion" → "reduce".

Reload the page. Scroll through sections 01–04. Slide-in motion should NOT play — chapter marks and body blocks render at their final positions immediately. AboutStrip's `RevealWords` already honors this; confirm no regressions.

Stop the dev server.

- [ ] **Step 6: Bright-frame legibility stress test**

Run `bun dev` again. Pause the cinematic video at its brightest frame:

1. Open Chrome DevTools → Console
2. Run: `document.querySelector('video').pause()`
3. Use the timeline scrubber on the video element (find via Inspect → Elements) or run `document.querySelector('video').currentTime = N` to step through values from 0 to the duration

Stop on the brightest frames (paint booth white, weld sparks, headlight beam). Confirm the chapter mark and body copy in the visible section are still readable. The vignettes should darken those corners enough that no text disappears against the bright video.

If a frame breaks legibility: increase the vignette alpha in `CornerSection.tsx` from `rgba(0,0,0,0.78)` to `rgba(0,0,0,0.88)` and re-test. (Spec target was 0.78; 0.88 is the fallback if real video frames are brighter than expected.)

Stop the dev server.

- [ ] **Step 7: Final commit (only if step 6 required a vignette adjustment)**

If you tightened the vignette alpha in step 6:

```bash
git add components/home/CornerSection.tsx
git commit -m "tune(home): increase corner vignette alpha for bright-frame legibility"
```

If no adjustment needed: nothing to commit, plan is complete.

---

## Self-review

**Spec coverage check** — every spec section maps to a task:

| Spec section | Implemented in |
|---|---|
| Layout C (corner labels + diagonal float) | Task 1 (CornerSection layout grid) |
| Animation C (slide from corner + edge) | Task 1 (`chapterDesktop` / `bodyDesktop` variants) |
| Scrim B (corner radial gradients) | Task 1 (`VIGNETTE_DESKTOP` / `VIGNETTE_MOBILE`) |
| About+CTA Y (sections corner, About+CTA centered) | Tasks 2–5 only touch the four section files; AboutStrip + FinalCTA explicitly unchanged |
| Approach 1 (primitive + thin wrappers) | Task 1 builds primitive; Tasks 2–5 are wrappers |
| Sizing tokens (text-5xl mark, max-md body, etc.) | Task 1 (inline in className) |
| Animation contract (`useInView`, margin -15%, once) | Task 1 (`motionProps.viewport`) |
| 21st.dev plug-in point | Task 1 (motion variants are named constants at top of file — single-edit swap) |
| Pure CSS scrim, no backdrop-filter | Task 1 (`background:` CSS property only) |
| Mobile fallback (text-3xl, left-aligned, top+bottom vignettes, vertical motion) | Task 1 (`isDesktop` branching) |
| Migration steps 1–8 from spec | Tasks 1–6 cover all eight steps |
| Verification: build, desktop, mobile, reduced-motion, bright-frame | Task 6 (steps 1, 3, 4, 5, 6) |

No gaps.

**Type consistency check** — `CornerSection` props (`chapterNumber`, `eyebrow`, `headline`, `body`, `cta`, `headingId`) are used identically in Tasks 2–5. The `headingId` value differs per section but is a string — no type drift. Motion variants use the imported `Variants` type from framer-motion.

**Placeholder scan** — no TBDs, no "implement later", no "similar to Task N" without code. Every code-touching step shows the actual code or the actual command + expected output.

**Scope check** — single primitive + four wrappers + verification. One implementation session.
