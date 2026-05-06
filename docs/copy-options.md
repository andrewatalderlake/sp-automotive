# SP Automotive — Copy Options

Pick one variant per section by marking with **✅**. I'll lock the picks into the codebase in the same task.

The three voice columns are intentionally distinct so the difference is real:

- **Voice A — Declarative (current):** Anaphora, terse, line-break-heavy. Premium-magazine feel. ("Every flaw — found.")
- **Voice B — Technical:** Specific vocabulary an exotic owner would use. Numbers, materials, procedures. ("Carbon-tub safety. ADAS recalibration. Factory-correct.")
- **Voice C — Owner-emotional:** Speaks to the owner who just crashed their dream. Warmer, present-tense, second person. ("You called. We're already on it.")

You can also mix — pick Voice A for the hero, Voice C for the About strip, etc.

---

## 1. Tagline

A two- or three-word lockup that goes in the metadata description, possibly above the FinalCTA, and possibly under the logo in the footer.

| | Option |
|---|---|
| ✅ | **A1.** Built where it broke. |
| ☐ | **A2.** Factory-correct. Owner-obsessed. |
| ☐ | **A3.** Where exotics come home. |
| ☐ | **A4.** Sarasota's exotic body shop. *(more literal — better for SEO, less premium)* |
| ☐ | **A5.** Restored to spec. Returned to you. |

---

## 2. Hero beats (the 6 lines that fade in over the scroll)

Current beats are Voice A. The B/C columns rewrite each beat in the alternate voice. Pick a row, OR pick a single voice column and apply across all 6.

| Beat | Voice A — Declarative (current) | Voice B — Technical | Voice C — Owner-emotional |
|---|---|---|---|
| **0** | It happens to the best of us. | 200 mph cars find walls. | You weren't expecting this call. |
| **1** | Then it comes to us. | Then it comes to Sarasota. | Now it comes to us. |
| **2** | Every flaw — found. | Forensic intake. Documented. | We see what insurance misses. |
| **3** | Every detail — restored. | Factory-correct repair. | We rebuild it the way it left the factory. |
| **4** | Every panel — perfect. | Torque-spec. Gap-measured. | Right down to the gap between the doors. |
| **5** | Welcome home. | Returned to spec. | Welcome home. |

**My pick:**
- ☐ All Voice A (keep current)
- ✅ All Voice B
- ☐ All Voice C
- ☐ Custom mix (note row picks below):

> **Note (2026-05-05):** This selection is **superseded by Section 6 below**. The live `HeroVideo.tsx` runs a single-frame Voice C composition (not the 6-beat Voice B sequence above). Section 6 reframes the hero decision around format + copy together — pick there.

---

## 3. Final CTA section (the section above the footer)

Currently:
- Eyebrow: *"Got photos of the damage?"*
- Headline: *"Send them. We'll tell you what it'll take."*
- Footer: *"Or text photos to the same number."*

| | Variant |
|---|---|
| ☐ | **C1 — Current.** Eyebrow: "Got photos of the damage?" / Headline: "Send them. We'll tell you what it'll take." / Footer: "Or text photos to the same number." |
| ✅ | **C2 — Direct.** Eyebrow: "Tell us what happened." / Headline: "We'll handle the rest." / Footer: "Photos by text. Estimate by phone. Insurance by us." |
| ☐ | **C3 — Owner.** Eyebrow: "Your car deserves better than the dealer's body shop." / Headline: "Bring it home." / Footer: "Call Serge. Text photos to the same number." |
| ☐ | **C4 — Numbers.** Eyebrow: "One call. One shop. One signature on the work." / Headline: "Serge picks up the phone." / Footer: "Or text photos. He'll text you back." |

---

## 4. About strip (the strip on the home page that links to /about)

Currently: *"Built by Serge in Sarasota. After years restoring exotics for private collectors, Serge opened SP Automotive to bring factory-grade collision repair to the cars most shops won't touch. Lamborghinis, McLarens, Audi R8s, BMW M-series. If it costs more than a house, it belongs here."*

| | Variant |
|---|---|
| ☐ | **D1 — Current.** As above. |
| ✅ | **D2 — Owner-letter.** "If your car is worth more than most houses, the dealer's body shop is not the answer. Serge built SP Automotive in Sarasota for the cars they won't touch — Lamborghinis, McLarens, R8s, M-series. Forensic intake, factory-spec repair, one signature on the work: his." |
| ☐ | **D3 — Tight.** "Serge built SP Automotive in Sarasota for the exotics most shops won't touch. Lamborghinis. McLarens. Audi R8s. BMW M. One owner. One signature on every job." |

> **v1 note (2026-05-05, updated):** Earlier draft proposed dropping R8 and adding Porsche. **Reversed.** Live brand pages stay at the current three (Lamborghini, McLaren, Audi R8) and the AboutStrip marque list now reads "Lamborghinis, McLarens, R8s" — no BMW M, no Porsche, until those pages exist.

---

## 5. About page bio — voice direction

Pick the framing first. I'll then expand to a full 4-6 paragraph bio (~600-800 words) in your chosen voice. You'll edit before lock.

| | Framing | Sample opener |
|---|---|---|
| ☐ | **E1 — Founder story (chronological).** Traces the path: cars in his blood → years of private restoration → why he opened SP. | *"Serge has been around exotic cars for as long as he can remember. The first time he held a torque wrench, it was on a Ferrari Testarossa in his uncle's garage…"* |
| ☐ | **E2 — Craft obsession.** Opens on a single moment of obsession (e.g., matching tri-coat paint at midnight). The bio is a portrait of how he works, not a timeline. | *"At 11 PM on a Tuesday, Serge is still in the booth. He's mixing tri-coat for a Huracán Performante — a color that takes three layers to look right under Sarasota sun. He'll mix it four more times tonight before he calls it."* |
| ✅ | **E3 — Owner letter.** Bio is written in second person to the owner who just crashed. Less about Serge's history, more about what the owner is about to experience. | *"Your insurance company is going to push you toward the cheapest shop on their list. We're not on that list. Here's what's different about how this works…"* |

---

## 6. Hero — final implementation pick

**Why this section exists:** Section 2 marked "All Voice B" but the live `HeroVideo.tsx` runs a different format entirely — a single-frame Voice C composition ("Totaled. / Paid in Full." + insurance lead). That's not a Voice C variant from Section 2's table — it's a sharper hook drawn from Serge's insurance/total-loss angle. Before swapping anything in code, pick the **format and copy** below.

The three options use different formats. They are not interchangeable line-for-line.

---

### Option H1 — Single-frame Voice C (refined current)

Keeps the live hero structure: huge "Totaled. / Paid in Full." display type with a single lead beneath, CTAs, and a secondary text-photos link. One moment, no scroll-driven beats.

| Element | Copy |
|---|---|
| Display, line 1 | **Totaled.** |
| Display, line 2 | **Paid in Full.** |
| Lead (current) | We deal with the insurance. You walk away whole — sometimes ahead. |
| Lead (alt — sharper) | We **fight the carrier**. You walk away whole — sometimes ahead. |
| CTAs | Phone · SMS |
| Tertiary | Or send 3 photos for a callback |

**Why it works:** Four words deliver the entire offer. "Sometimes ahead" foreshadows the $10–20k total-loss upside Serge mentions in his SMS — which the new "Total-loss play" section below the hero will then explain. Emotionally direct, no scroll required to get the point.

**Why "fight" is sharper:** Matches Serge's actual word choice in his SMS notes ("our shop fights to make sure the owner gets paid out in full"). "Deal with" is passive; "fight" is the brand promise.

**Trade-off:** Doesn't carry the forensic vocabulary the rest of the site leans into. The owner-emotional register lives only in the hero; the page transitions immediately into Voice B once you scroll.

---

### Option H2 — Voice B six-beat scroll sequence (per Section 2 pick)

Replaces the single-frame hero entirely. The cinematic video plays full-bleed; the six beats from Section 2 fade in over it sequentially as the user scrolls past the first viewport.

| Beat | Copy | Trigger |
|---|---|---|
| 0 | 200 mph cars find walls. | 0–15% scroll |
| 1 | Then it comes to Sarasota. | 15–30% |
| 2 | Forensic intake. Documented. | 30–45% |
| 3 | Factory-correct repair. | 45–60% |
| 4 | Torque-spec. Gap-measured. | 60–75% |
| 5 | Returned to spec. | 75–100% |

CTAs sit below the sequence in their own composed strip after the last beat resolves.

**Why it works:** Aligns the hero with the rest of the site's forensic vocabulary. The cinematic video gets the visual stage; copy plays a supporting, technical role. Premium-magazine cadence.

**Trade-off:** Loses the immediate, devastating emotional hook of "Totaled. Paid in Full." The total-loss insurance angle — which is your sharpest commercial differentiator — gets demoted to a sub-section instead of being the brand's opening line.

---

### Option H3 — Hybrid (single-frame Voice C → Voice B reveal on scroll)

Keep the single-frame Voice C exactly as it is in the live site (H1). Then **after** the user scrolls past the first viewport, the Voice B six beats reveal sequentially over the continuing cinematic video — acting as the narrative bridge into the new "Total-loss play" section that follows.

This is the only option that actually uses both voices for what they're each best at:
- Voice C does the emotional kill shot up top
- Voice B does the technical credibility build as the user commits to scrolling

**Trade-off:** More complex to build (the existing `PageScrubVideo` component would need to coordinate with a new beat-reveal layer), but no copy is lost.

---

### My pick

- ☐ **H1 — Single-frame Voice C** (sub-pick: current lead "deal with" / alt lead "fight")
- ☐ **H2 — Voice B six-beat sequence**
- ☐ **H3 — Hybrid (H1 above the fold + H2 on scroll)**

---

## What I need from you

Mark **one ✅ per section** above (or note custom edits inline). When you reply, I'll:

1. Lock the tagline into `lib/site.ts` and `app/layout.tsx` metadata.
2. Update hero beat copy in `components/hero/HeroVideo.tsx` per the Section 6 pick.
3. Update FinalCTA in `components/cta/FinalCTA.tsx`.
4. Update AboutStrip in `components/about/AboutStrip.tsx`.
5. Use the chosen About bio framing as the brief when I draft the long-form bio in Task 4.

After this, we move to **Task 2: Process scroll narrative**.
