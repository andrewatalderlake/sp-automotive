// Brand-specific landing page data. One entry per brand. Pages compose
// BrandHero -> BrandServices -> BrandModels -> Testimonials -> FinalCTA.
//
// To add a brand: add a Brand entry below, create app/{slug}/page.tsx, add the
// route to app/sitemap.ts.

export type Brand = {
  /** URL slug — also the route folder name. */
  slug: string;
  /** Display name (used in headlines + structured data). */
  name: string;
  /** Lowercase key matching Testimonial.brand for filtering. */
  brandKey: string;
  /** SEO title (under 60 chars). */
  metaTitle: string;
  /** SEO description (under 160 chars). */
  metaDescription: string;
  /** Cinematic display-font line that headlines the brand hero. */
  headline: string;
  /** 80-120 word lead paragraph below the headline. */
  intro: string;
  /** Short eyebrow line above the H1. */
  eyebrow: string;
  /** Models we work on for this brand. */
  models: string[];
  /** 4-6 brand-specific specialty cards. */
  specialties: { title: string; copy: string }[];
};

export const BRANDS: Brand[] = [
  {
    slug: "lamborghini-collision-repair-sarasota",
    name: "Lamborghini",
    brandKey: "lamborghini",
    metaTitle: "Lamborghini Collision Repair — Sarasota, FL",
    metaDescription:
      "Factory-correct collision repair for Aventador, Huracán, Urus, Revuelto, and SVJ. Tri-coat paint match, carbon-fiber repair, ADAS recalibration. Sarasota, FL.",
    eyebrow: "Sarasota, FL · Authorized-grade body work",
    headline: "Lamborghini collision repair, factory-correct.",
    intro:
      "An Aventador isn't a body-shop car. The tri-coat paint takes three booth runs to match under Sarasota sun. The carbon panels need primer thickness controlled to the micron. The frame won't tolerate eyeballed alignment. We've spent the last decade making cars like yours come home looking like the day they left Sant'Agata. If your car's been hit, this is the shop the dealer should have sent you to.",
    models: [
      "Aventador",
      "Aventador SVJ",
      "Huracán",
      "Huracán Performante",
      "Huracán STO",
      "Urus",
      "Urus Performante",
      "Revuelto",
      "Gallardo",
      "Murciélago",
    ],
    specialties: [
      {
        title: "Tri-coat paint match",
        copy: "Lamborghini's signature paints — Arancio Atlas, Verde Mantis, Blu Eleos — take three booth runs and a paint-thickness gauge to get right. We mix to the factory code, layer to factory depth, and verify under booth daylight before sign-off.",
      },
      {
        title: "Carbon-fiber repair",
        copy: "The Aventador is mostly carbon. Huracán Performante adds forged composite panels. Damaged carbon doesn't get filled — it gets relayered, weave-matched, and clear-coated to factory gloss. We see the weave; you don't see the repair.",
      },
      {
        title: "Frame & spaceframe alignment",
        copy: "Aventador uses a CFRP monocoque. Huracán is aluminum spaceframe. Both are unforgiving of bent body mounts and out-of-spec subframes. We measure to factory tolerances on a Spanesi machine and document it.",
      },
      {
        title: "ADAS recalibration",
        copy: "Huracán EVO and Revuelto carry forward-facing radar, parking cameras, and lane-keep sensors. Every collision throws calibration. We recalibrate to OEM procedure with the original target boards — nothing aftermarket.",
      },
      {
        title: "V12 cooling system integrity",
        copy: "A wrecked clamshell often hides cracked radiators, bent intercoolers, and stressed coolant lines on the naturally-aspirated V12. We pressure-test every line, replace anything outside spec, and re-fill with the right glycol blend.",
      },
      {
        title: "Owner-direct communication",
        copy: "You'll talk to Serge — not a service writer. Photos at every milestone. Estimate revisions in writing. Final walkthrough before delivery. No subcontractors, no surprises.",
      },
    ],
  },
  {
    slug: "mclaren-collision-repair-sarasota",
    name: "McLaren",
    brandKey: "mclaren",
    metaTitle: "McLaren Collision Repair — Sarasota, FL",
    metaDescription:
      "MonoCage carbon-tub-correct repair for 720S, 765LT, Artura, GT, and 750S. Hydraulic suspension, dihedral door alignment, factory paint. Sarasota, FL.",
    eyebrow: "Sarasota, FL · Authorized-grade body work",
    headline: "McLaren collision repair, MonoCage-correct.",
    intro:
      "McLaren built the 720S around a carbon tub the dealer's body shop is not equipped to repair. The dihedral doors don't tolerate misaligned hinges. The hydraulic suspension lines run through panels the average tech won't track. The paint code is famously hard to match. We've worked on enough McLarens to know where the damage hides, and we have the equipment, the patience, and the procedure to bring yours back to factory spec.",
    models: [
      "570S",
      "570GT",
      "600LT",
      "650S",
      "675LT",
      "720S",
      "750S",
      "765LT",
      "Artura",
      "GT",
      "P1",
      "Senna",
    ],
    specialties: [
      {
        title: "MonoCage carbon-tub safety",
        copy: "The 720S, 765LT, and Artura all use a one-piece carbon monocoque. Damage to the tub itself is McLaren-only territory — we know what's repairable and what triggers a structural inspection. We won't paint over a problem.",
      },
      {
        title: "Dihedral door alignment",
        copy: "Dihedral doors lift up and forward on a single hinge mechanism. Misalignment after collision is common and the gap tolerance is tight. We adjust to factory spec on a leveled lift and verify the seal under spray test.",
      },
      {
        title: "Hydraulic suspension repair",
        copy: "McLaren's Proactive Chassis Control runs hydraulic lines through the body. A clipped panel can mean a leaking accumulator. We pressure-test the system before reassembly and replace any line that's compromised.",
      },
      {
        title: "Twin-turbo V8 cooling system",
        copy: "Front-end damage on a 720S almost always involves the front-mounted radiators and intercoolers. We replace OEM, pressure-test, and verify the active aero shutters cycle correctly before the car leaves.",
      },
      {
        title: "Factory paint match",
        copy: "McLaren Orange. Volcano Yellow. Ceramic Grey. Each has a known ΔE drift problem after collision repair if mixed wrong. We mix to McLaren's PPG codes and verify under booth daylight, color-match camera, and side-by-side panel test.",
      },
      {
        title: "MQA-procedural workflow",
        copy: "We follow McLaren Quality Assurance procedures end-to-end — from the documented intake walkthrough to the post-repair scan-tool verification. You get the report; the carfax stays clean.",
      },
    ],
  },
  {
    slug: "audi-r8-collision-repair-sarasota",
    name: "Audi R8",
    brandKey: "audi",
    metaTitle: "Audi R8 Collision Repair — Sarasota, FL",
    metaDescription:
      "Aluminum spaceframe-correct repair for R8 V10, V10 Plus, GT, and Performance. Quattro alignment, magnetic ride suspension, factory paint. Sarasota, FL.",
    eyebrow: "Sarasota, FL · Authorized-grade body work",
    headline: "Audi R8 collision repair, spaceframe-correct.",
    intro:
      "The R8 is built on the same Audi Space Frame as the Lamborghini Huracán — aluminum, mid-engine, unforgiving of bent body mounts. Quattro AWD adds alignment complexity most shops don't budget for. Factory paints like Ara Blue Crystal and Suzuka Grey have a known ΔE drift problem if you don't mix to spec. We treat the R8 like the engineered exotic it is — not the &ldquo;practical Audi&rdquo; the dealer&apos;s body shop sees.",
    models: [
      "R8 V10",
      "R8 V10 Plus",
      "R8 V10 Performance",
      "R8 V10 Spyder",
      "R8 GT",
      "R8 e-tron (rare)",
    ],
    specialties: [
      {
        title: "Aluminum spaceframe repair",
        copy: "The R8 uses an aluminum and CFRP space frame — joining methods are spot-welded, riveted, and bonded. We follow the Audi Spaceframe-Repair certification process and have the equipment to do it right.",
      },
      {
        title: "V10 mid-engine integrity",
        copy: "The naturally-aspirated 5.2L V10 sits where the rear seats would be on a regular car. Frame damage near the engine bay needs checking against factory tolerances. We measure and document.",
      },
      {
        title: "Quattro AWD alignment",
        copy: "Front and rear alignment on a Quattro-equipped R8 is tighter than RWD. We align on a Hunter machine and verify the toe + camber against R8-specific factory specs, not generic Audi specs.",
      },
      {
        title: "Magnetic ride suspension",
        copy: "Magnetic dampers don't tolerate bent control arms or compromised mounts. We inspect every component, replace what's out of spec, and re-zero the ride-height calibration via VCDS.",
      },
      {
        title: "Factory paint match — Ara Blue, Suzuka Grey, Tango Red",
        copy: "R8 paints are tri-coat with metallic flakes that catch light differently per booth setup. We mix to Audi's PPG codes, layer to factory depth, and verify under matched booth lighting before clear-coat.",
      },
      {
        title: "ADAS recalibration",
        copy: "R8 V10 Performance carries radar, lane-keep, and parking sensors that all throw calibration after collision. We recalibrate via VAS 6131 with original target boards — to OEM procedure.",
      },
    ],
  },
];

export function getBrand(slug: string): Brand | undefined {
  return BRANDS.find((b) => b.slug === slug);
}
