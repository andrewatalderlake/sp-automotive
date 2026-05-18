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
    eyebrow: "Sarasota, FL · OEM-procedure body work",
    headline: "Lamborghini collision repair, factory-correct.",
    intro:
      "An Aventador isn't a body-shop car. The tri-coat paint takes three booth runs to match under Sarasota sun. The carbon panels need primer thickness controlled to the micron. The frame won't tolerate eyeballed alignment. I've spent the last 4 years making cars like yours come home looking like the day they left Sant'Agata. If your car's been hit, this is the shop the dealer should have sent you to.",
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
    eyebrow: "Sarasota, FL · OEM-procedure body work",
    headline: "McLaren collision repair, MonoCage-correct.",
    intro:
      "McLaren built the 720S around a carbon tub the dealer's body shop is not equipped to repair. The dihedral doors don't tolerate misaligned hinges. The hydraulic suspension lines run through panels the average tech won't track. The paint code is famously hard to match. I've worked on enough McLarens to know where the damage hides, and I have the equipment, the patience, and the procedure to bring yours back to factory spec.",
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
    eyebrow: "Sarasota, FL · OEM-procedure body work",
    headline: "Audi R8 collision repair, spaceframe-correct.",
    intro:
      "The R8 is built on the same Audi Space Frame as the Lamborghini Huracán — aluminum, mid-engine, unforgiving of bent body mounts. Quattro AWD adds alignment complexity most shops don't budget for. Factory paints like Ara Blue Crystal and Suzuka Grey have a known ΔE drift problem if you don't mix to spec. I treat the R8 like the engineered exotic it is — not the &ldquo;practical Audi&rdquo; the dealer&apos;s body shop sees.",
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
  {
    slug: "bmw-m-collision-repair-sarasota",
    name: "BMW M",
    brandKey: "bmw-m",
    metaTitle: "BMW M Collision Repair — Sarasota, FL",
    metaDescription:
      "Factory-correct collision repair for M3, M4, M5, M8, X5M, X6M, and M2. Carbon roof repair, xDrive alignment, S58/S63 cooling, ADAS recalibration. Sarasota, FL.",
    eyebrow: "Sarasota, FL · OEM-procedure body work",
    headline: "BMW M collision repair, factory-correct.",
    intro:
      "An M car isn't a regular 3-Series with a body kit. The carbon roof on an M4 CSL is structural. The S58 in an M3 Competition runs at thermal limits the dealer body shop won't pressure-test. xDrive on an M5 Competition has its own alignment spec the network shops don't bother looking up. Frozen-series paints fade unevenly when matched against generic BMW codes. I treat M cars like the track-grade machines they are — every panel torque-checked, every damper verified, every sensor recalibrated to OEM procedure.",
    models: [
      "M2",
      "M3",
      "M3 Competition",
      "M3 CS",
      "M4",
      "M4 Competition",
      "M4 CSL",
      "M5",
      "M5 Competition",
      "M5 CS",
      "M8",
      "M8 Competition",
      "X3 M",
      "X4 M",
      "X5 M",
      "X6 M",
    ],
    specialties: [
      {
        title: "Carbon roof + CFRP panel repair",
        copy: "The M3, M4, M4 CSL and the X5/X6 M Competition carry CFRP roof panels that are weight-engineered. Damage doesn't get filler — it gets relayered, weave-matched, and clear-coated to factory gloss. We see the carbon weave; you don't see the repair.",
      },
      {
        title: "xDrive AWD alignment",
        copy: "M5 Competition, X5 M, and X6 M alignment specs are tighter than the standard xDrive lineup. We align on a Hunter machine to M-specific factory tolerances — not generic 5-Series numbers — and re-calibrate the variable-front-bias actuator.",
      },
      {
        title: "S58 / S63 / S65 cooling integrity",
        copy: "BMW M turbo motors run at high thermal load. A wrecked clamshell often hides cracked aux radiators, bent intercoolers, and stressed coolant lines. We pressure-test every line, replace anything outside spec, and re-fill with the right LL-04 coolant.",
      },
      {
        title: "Adaptive M Suspension calibration",
        copy: "Adaptive M dampers don't tolerate bent control arms or compromised mounts. We inspect every link, replace what's out of spec, and re-zero the ride-height calibration via ISTA so the active damping reads true.",
      },
      {
        title: "Frozen + Individual paint match",
        copy: "Frozen Brilliant White, Frozen Dark Silver, and the BMW Individual range have known matching variability if you mix from generic BMW codes. We mix to M-specific build sheet codes, layer to factory depth, and verify under matched booth lighting.",
      },
      {
        title: "ADAS recalibration",
        copy: "M cars carry forward radar, lane-keep, parking, and surround cameras that all throw calibration after collision. We recalibrate via ISTA with the original target boards — to OEM procedure.",
      },
    ],
  },
  {
    slug: "ferrari-collision-repair-sarasota",
    name: "Ferrari",
    brandKey: "ferrari",
    metaTitle: "Ferrari Collision Repair — Sarasota, FL",
    metaDescription:
      "Factory-correct collision repair for 488, F8, 296, SF90, Roma, 812, Portofino, and Purosangue. Aluminum-chassis welding, tri-coat Rosso match, hybrid HV systems. Sarasota, FL.",
    eyebrow: "Sarasota, FL · OEM-procedure body work",
    headline: "Ferrari collision repair, factory-correct.",
    intro:
      "A Ferrari isn't a body-shop car. The aluminum chassis is TIG-welded by procedure; one wrong heat cycle and you've compromised it. The Rosso family of paints — Rosso Corsa, Rosso Mugello, Rosso Maranello — drift visibly if mixed from generic codes. The SF90 and 296 carry high-voltage hybrid systems that need their own safety procedure before a panel comes off. I've spent the last 4 years working on Maranello's cars — every rivet replaced to spec, every damper measured, every Manettino sensor recalibrated to OEM. If yours has been hit, bring it here before anyone else opens a panel.",
    models: [
      "488 GTB",
      "488 Pista",
      "488 Spider",
      "F8 Tributo",
      "F8 Spider",
      "296 GTB",
      "296 GTS",
      "SF90 Stradale",
      "SF90 Spider",
      "Roma",
      "812 Superfast",
      "812 GTS",
      "Portofino",
      "Portofino M",
      "Purosangue",
      "Daytona SP3",
    ],
    specialties: [
      {
        title: "Aluminum chassis welding",
        copy: "Ferrari's aluminum spaceframe (488, F8, 296, SF90) is TIG-welded by procedure with controlled heat input. We follow the Ferrari aluminum-repair certification process and document every weld for the records package.",
      },
      {
        title: "Rosso paint match — Corsa, Mugello, Maranello",
        copy: "The Rosso family has a documented ΔE drift problem when matched from generic codes. We mix to Ferrari's PPG / Standox build-sheet codes, layer to factory depth, and verify under matched booth lighting before clear-coat.",
      },
      {
        title: "Carbon-fiber panel repair",
        copy: "488 Pista, F8 Tributo, SF90 carry CFRP panels — bumpers, splitters, rear hatches. Damaged carbon doesn't get filler — it gets relayered, weave-matched, and clear-coated to factory gloss with the right primer thickness.",
      },
      {
        title: "Hybrid HV system safety (SF90, 296)",
        copy: "The SF90 and 296 PHEV carry 800V hybrid traction systems. Before a panel touches the body, we follow the Ferrari de-energization procedure: HV disconnect, lockout-tagout, and verify with an insulated meter. No shortcuts on hybrid Ferraris.",
      },
      {
        title: "Carbon-ceramic brake handling",
        copy: "Ferrari's CCM brakes can't be machined or contaminated. We protect them through the entire repair, verify pad transfer-film integrity, and re-bed only as the OEM procedure specifies.",
      },
      {
        title: "ADAS + Manettino recalibration",
        copy: "Forward radar, parking cameras, lane-keep on the Roma and Purosangue all throw calibration after collision. We recalibrate via the Ferrari diagnostic platform with original target boards — to OEM procedure.",
      },
    ],
  },
  {
    slug: "porsche-collision-repair-sarasota",
    name: "Porsche",
    brandKey: "porsche",
    metaTitle: "Porsche Collision Repair — Sarasota, FL",
    metaDescription:
      "Factory-correct collision repair for 911, GT3, GT3 RS, Taycan, Cayenne, Panamera, and 718. PASM dampers, carbon-ceramic, EV high-voltage, factory paint. Sarasota, FL.",
    eyebrow: "Sarasota, FL · OEM-procedure body work",
    headline: "Porsche collision repair, factory-correct.",
    intro:
      "Porsche's lineup runs from a base 718 to a 911 GT3 RS to a tri-motor Taycan Turbo S — and the body-shop discipline scales with it. PASM dampers don't tolerate bent control arms. Carbon-ceramic brakes can't be contaminated. The Taycan's 800V architecture needs an HV de-energization procedure before a clip comes out. PTS (Paint to Sample) colors require the original build sheet to match. I treat every Porsche like an engineered exotic — torque to spec, gap to factory, sensors recalibrated to OEM. The way it left Stuttgart.",
    models: [
      "911 Carrera",
      "911 Carrera S / 4S",
      "911 Turbo",
      "911 Turbo S",
      "911 GT3",
      "911 GT3 RS",
      "911 GT3 Touring",
      "911 GT2 RS",
      "911 Targa",
      "718 Cayman",
      "718 Cayman GT4",
      "718 Cayman GT4 RS",
      "718 Boxster",
      "Taycan",
      "Taycan Turbo S",
      "Taycan Cross Turismo",
      "Cayenne",
      "Cayenne Turbo GT",
      "Panamera",
      "Panamera Turbo",
    ],
    specialties: [
      {
        title: "PASM damper alignment",
        copy: "Porsche Active Suspension Management dampers don't tolerate bent control arms or compromised mounts. We inspect every link, replace what's out of spec, and re-zero the ride-height calibration via PIWIS so active damping reads true.",
      },
      {
        title: "GT3 RS aero panel repair",
        copy: "GT3 RS, GT4 RS, and 911 GT2 RS carry CFRP aero — splitters, swan-neck wings, hood vents. Damaged carbon doesn't get filler — it gets relayered, weave-matched, and clear-coated to factory gloss. The aerodynamics survive the repair.",
      },
      {
        title: "Taycan HV system safety",
        copy: "Taycan's 800V architecture requires the Porsche de-energization procedure before any panel comes off near the battery. HV disconnect, lockout-tagout, verify with insulated meter. No bypassing the procedure on EVs.",
      },
      {
        title: "Carbon-ceramic brake handling",
        copy: "PCCB rotors can't be machined or contaminated. We protect them through the entire repair, verify pad transfer-film integrity, and re-bed only as the OEM procedure specifies.",
      },
      {
        title: "PTS + factory paint match",
        copy: "Crayon, Gulf Blue, GT Silver, and the full Paint-to-Sample range require the original build-sheet code — generic Porsche codes drift visibly. We mix to spec, layer to factory depth, and verify under matched booth lighting.",
      },
      {
        title: "ADAS + PCM recalibration",
        copy: "911 (992-gen), Taycan, and Cayenne carry radar, lane-keep, parking, and surround sensors that throw calibration after collision. We recalibrate via PIWIS with original target boards — to OEM procedure.",
      },
    ],
  },
];

export function getBrand(slug: string): Brand | undefined {
  return BRANDS.find((b) => b.slug === slug);
}
