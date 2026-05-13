// Featured build pages — body-kit transformations. One entry per build.
// Pages compose BuildHero -> BeforeAfterSlider -> BuildSpecs -> FinalCTA.
//
// To add a build: add a Build entry below, drop stock.webp + kit.webp into
// /public/builds/{slug}/, add the route to app/sitemap.ts.
//
// Specs and copy are seeded from public kit-manufacturer info (1016, Mansory,
// Brabus, etc.) — review before launch. Image paths point at placeholders
// until the Higgsfield gen pass lands.

export type BuildSpec = {
  label: string;
  value: string;
};

export type Build = {
  /** URL slug — also the {slug} segment in /builds/{slug}. */
  slug: string;
  /** Display name of the donor car (e.g. "Lamborghini Urus"). */
  car: string;
  /** Body-kit brand (e.g. "1016 Industries", "Mansory"). */
  kit: string;
  /** Short eyebrow line above the H1. */
  eyebrow: string;
  /** Cinematic display headline. */
  title: string;
  /** 1–2 sentence lead under the headline. */
  description: string;
  /** 4–6 spec bullets shown in a 2-col grid below the slider. */
  specs: BuildSpec[];
  /** Path under /public/ for the stock-form image. */
  stockImage: string;
  /** Path under /public/ for the kit-installed image. */
  kitImage: string;
  /** SEO title (under 60 chars). */
  metaTitle: string;
  /** SEO description (under 160 chars). */
  metaDescription: string;
};

export const BUILDS: Build[] = [
  {
    slug: "urus-1016",
    car: "Lamborghini Urus",
    kit: "1016 Industries",
    eyebrow: "Featured build · Lamborghini Urus",
    title: "Urus, widened. 1016 Industries.",
    description:
      "Forged-carbon widebody from 1016 Industries — the Miami shop that built its name turning the Urus into something the showroom never offered. Hand-laid panels, factory paint match, no clearance compromises.",
    specs: [
      { label: "Kit", value: "1016 Industries Wide-body" },
      { label: "Material", value: "Forged carbon fiber" },
      { label: "Components", value: "Front splitter, fender flares, side skirts, rear diffuser, hood vents" },
      { label: "Install time", value: "~3 weeks (incl. paint match)" },
      { label: "Finish", value: "Color-matched body, exposed-weave accents" },
      { label: "Wheel fitment", value: "Designed for 23–24\" forged" },
    ],
    stockImage: "/builds/urus-1016/stock.webp",
    kitImage: "/builds/urus-1016/kit.webp",
    metaTitle: "1016 Industries Urus Widebody — SP Automotive",
    metaDescription:
      "Lamborghini Urus widebody build by SP Automotive in Sarasota, FL. 1016 Industries forged-carbon kit, factory paint match, full install.",
  },
  {
    slug: "urus-mansory",
    car: "Lamborghini Urus",
    kit: "Mansory",
    eyebrow: "Featured build · Lamborghini Urus",
    title: "Urus, Mansory-treated.",
    description:
      "Mansory's Venatus program rebodies the Urus from the A-pillar forward. Exposed carbon, redesigned aero, an interior re-stitched to taste. We install, paint-match, and finish to the spec the kit was photographed in.",
    specs: [
      { label: "Kit", value: "Mansory Venatus" },
      { label: "Material", value: "Visible carbon + composite" },
      { label: "Components", value: "Hood, front bumper, fenders, side skirts, rear bumper, wing, diffuser" },
      { label: "Install time", value: "~4–6 weeks (incl. paint and trim)" },
      { label: "Finish", value: "Glossy carbon-weave + color-coded accents" },
      { label: "Power option", value: "Mansory ECU calibration available" },
    ],
    stockImage: "/builds/urus-mansory/stock.webp",
    kitImage: "/builds/urus-mansory/kit.webp",
    metaTitle: "Mansory Venatus Urus — SP Automotive",
    metaDescription:
      "Mansory Venatus full body conversion for the Lamborghini Urus. Carbon panels, paint match, interior coordination. SP Automotive Sarasota.",
  },
  {
    slug: "huracan-mansory",
    car: "Lamborghini Huracán",
    kit: "Mansory",
    eyebrow: "Featured build · Lamborghini Huracán",
    title: "Huracán, Mansory aero.",
    description:
      "Mansory's Huracán program adds widened arches, redesigned bumpers, and a swan-neck rear wing in forged carbon. We coordinate the body install with paint match, ensuring the visible weave reads the same panel to panel.",
    specs: [
      { label: "Kit", value: "Mansory Huracán widebody" },
      { label: "Material", value: "Forged carbon fiber" },
      { label: "Components", value: "Front bumper, fenders, side skirts, rear bumper, wing, diffuser, hood" },
      { label: "Install time", value: "~4 weeks" },
      { label: "Finish", value: "Exposed-weave or color-coded options" },
      { label: "Power option", value: "Mansory exhaust + tune available" },
    ],
    stockImage: "/builds/huracan-mansory/stock.webp",
    kitImage: "/builds/huracan-mansory/kit.webp",
    metaTitle: "Mansory Huracán Widebody — SP Automotive",
    metaDescription:
      "Mansory full body conversion for the Lamborghini Huracán. Forged carbon panels, paint match, install. SP Automotive in Sarasota, FL.",
  },
  {
    slug: "huracan-sto",
    car: "Lamborghini Huracán",
    kit: "STO Conversion",
    eyebrow: "Featured build · Lamborghini Huracán",
    title: "Huracán EVO → STO.",
    description:
      "Full STO body conversion on a Huracán EVO donor: one-piece cofango, shark-fin rear, swan-neck wing, NACA roof scoop, and the STO-specific aero kit. Track-flavored from any angle.",
    specs: [
      { label: "Kit", value: "STO conversion (cofango, wing, splitter)" },
      { label: "Material", value: "Carbon fiber + composite" },
      { label: "Components", value: "Cofango (front clamshell), NACA roof scoop, shark-fin, swan-neck wing, rear diffuser" },
      { label: "Install time", value: "~5 weeks (heavy fitment + paint)" },
      { label: "Finish", value: "Bicolor STO livery or single-tone" },
      { label: "Donor", value: "Huracán EVO RWD or AWD" },
    ],
    stockImage: "/builds/huracan-sto/stock.webp",
    kitImage: "/builds/huracan-sto/kit.webp",
    metaTitle: "Lamborghini Huracán STO Conversion — SP Automotive",
    metaDescription:
      "Full Huracán EVO to STO body conversion. Cofango, wing, NACA scoop, paint match. SP Automotive Sarasota, FL.",
  },
  {
    slug: "g-wagon-brabus",
    car: "Mercedes-AMG G-Wagon",
    kit: "Brabus",
    eyebrow: "Featured build · Mercedes-AMG G-Wagon",
    title: "G-Wagon, Brabus 800 package.",
    description:
      "Brabus' signature widebody on a G63: bolt-on fender flares, hood scoops, redesigned bumpers, side-exit exhaust, and 24\" forged Monoblock wheels. Final fit + paint to factory tolerance.",
    specs: [
      { label: "Kit", value: "Brabus G800 / Widestar" },
      { label: "Material", value: "Composite + carbon trim" },
      { label: "Components", value: "Fender flares, hood scoop, front + rear bumpers, side-exit exhaust, roof spoiler" },
      { label: "Install time", value: "~3–4 weeks" },
      { label: "Finish", value: "Body-color or contrast-carbon accents" },
      { label: "Wheels", value: "Brabus Monoblock 24\" forged" },
    ],
    stockImage: "/builds/g-wagon-brabus/stock.webp",
    kitImage: "/builds/g-wagon-brabus/kit.webp",
    metaTitle: "Brabus G63 Widebody Build — SP Automotive",
    metaDescription:
      "Mercedes G63 Brabus widebody build by SP Automotive. Flares, hood scoops, exhaust, Monoblock wheels. Sarasota, FL.",
  },
  {
    slug: "g-wagon-mansory",
    car: "Mercedes-AMG G-Wagon",
    kit: "Mansory",
    eyebrow: "Featured build · Mercedes-AMG G-Wagon",
    title: "G-Wagon, Mansory Gronos.",
    description:
      "Mansory's Gronos program rebodies the G63 in forged carbon — widened arches, redesigned hood and grille, full carbon roof. The most aggressive G-class on the road.",
    specs: [
      { label: "Kit", value: "Mansory Gronos" },
      { label: "Material", value: "Forged + exposed carbon fiber" },
      { label: "Components", value: "Fender flares, hood, grille, bumpers, roof, side skirts" },
      { label: "Install time", value: "~5–6 weeks (full body + interior)" },
      { label: "Finish", value: "Exposed-weave with optional color tint" },
      { label: "Interior option", value: "Mansory-stitched leather + Alcantara available" },
    ],
    stockImage: "/builds/g-wagon-mansory/stock.webp",
    kitImage: "/builds/g-wagon-mansory/kit.webp",
    metaTitle: "Mansory Gronos G-Wagon Build — SP Automotive",
    metaDescription:
      "Mansory Gronos full carbon widebody for the Mercedes G63. Hand-laid panels, paint, install. SP Automotive Sarasota, FL.",
  },
  {
    slug: "911-gt3rs-gmg",
    car: "Porsche 911 GT3 RS",
    kit: "GMG Racing",
    eyebrow: "Featured build · Porsche 911 GT3 RS",
    title: "GT3 RS, GMG-treated.",
    description:
      "GMG Racing — the West-Coast Porsche tuner GT3 owners actually trust — adds a track-ready carbon aero package: front splitter extensions, dive planes, hood vents, and a redesigned swan-neck wing. Track-day weapon, street-legal finish.",
    specs: [
      { label: "Kit", value: "GMG WC-GT aero package" },
      { label: "Material", value: "Pre-preg carbon fiber" },
      { label: "Components", value: "Front splitter extensions, dive planes, hood vents, rear wing extensions" },
      { label: "Install time", value: "~2 weeks (incl. corner balance + alignment)" },
      { label: "Finish", value: "Exposed weave or color-matched" },
      { label: "Donor", value: "911 GT3 RS (992) or 991.2" },
    ],
    stockImage: "/builds/911-gt3rs-gmg/stock.webp",
    kitImage: "/builds/911-gt3rs-gmg/kit.webp",
    metaTitle: "Porsche 911 GT3 RS GMG Build — SP Automotive",
    metaDescription:
      "Porsche 911 GT3 RS with GMG Racing aero package. Carbon splitter, dive planes, swan-neck wing. SP Automotive Sarasota, FL.",
  },
  {
    slug: "488-novitec",
    car: "Ferrari 488",
    kit: "Novitec",
    eyebrow: "Featured build · Ferrari 488",
    title: "488, Novitec N-Largo.",
    description:
      "Novitec's N-Largo widebody program is the Mansory equivalent for Ferrari — wider by 9 cm, carbon-redesigned bumpers, and a tuned twin-turbo V8 if you want the matching power. The Maranello flagship, reimagined.",
    specs: [
      { label: "Kit", value: "Novitec N-Largo widebody" },
      { label: "Material", value: "Visible + clear-coated carbon" },
      { label: "Components", value: "Front bumper, fenders (+90mm wider), side skirts, rear bumper, rear wing, hood" },
      { label: "Install time", value: "~5 weeks (incl. paint and trim)" },
      { label: "Finish", value: "Exposed weave or color-coded" },
      { label: "Power option", value: "Novitec N-Largo S tune (772 hp) available" },
    ],
    stockImage: "/builds/488-novitec/stock.webp",
    kitImage: "/builds/488-novitec/kit.webp",
    metaTitle: "Ferrari 488 Novitec N-Largo Build — SP Automotive",
    metaDescription:
      "Ferrari 488 Novitec N-Largo widebody conversion. Carbon panels, paint match, optional tune. SP Automotive Sarasota, FL.",
  },
  {
    slug: "m4-3d-design",
    car: "BMW M4",
    kit: "3D Design",
    eyebrow: "Featured build · BMW M4",
    title: "M4, 3D Design carbon.",
    description:
      "3D Design — the Tokyo carbon house BMW M tuners revere — adds the most precisely-fit carbon aero in the game: front splitter, side skirts, rear diffuser, ducktail spoiler. Tasteful, OEM-finish carbon for the G82 chassis.",
    specs: [
      { label: "Kit", value: "3D Design carbon aero (G82)" },
      { label: "Material", value: "Pre-preg autoclave carbon fiber" },
      { label: "Components", value: "Front splitter, canards, side skirts, rear diffuser, ducktail spoiler, mirror caps" },
      { label: "Install time", value: "~2 weeks" },
      { label: "Finish", value: "Glossy clear-coat exposed weave" },
      { label: "Donor", value: "BMW M4 Competition (G82) or M3 Competition" },
    ],
    stockImage: "/builds/m4-3d-design/stock.webp",
    kitImage: "/builds/m4-3d-design/kit.webp",
    metaTitle: "BMW M4 3D Design Carbon Build — SP Automotive",
    metaDescription:
      "BMW M4 Competition with 3D Design pre-preg carbon aero. Splitter, diffuser, ducktail. SP Automotive Sarasota, FL.",
  },
  {
    slug: "720s-1016",
    car: "McLaren 720S",
    kit: "1016 Industries",
    eyebrow: "Featured build · McLaren 720S",
    title: "720S, 1016 widebody.",
    description:
      "1016 Industries' McLaren program — the same shop behind the Urus widebody — applies its trademark forged-carbon treatment to the 720S. Wider arches, redesigned aero, dihedral doors uncompromised.",
    specs: [
      { label: "Kit", value: "1016 Industries 720S widebody" },
      { label: "Material", value: "Forged carbon fiber" },
      { label: "Components", value: "Front bumper, fender flares, side skirts, rear bumper, swan-neck wing, hood vents" },
      { label: "Install time", value: "~4 weeks (dihedral re-alignment included)" },
      { label: "Finish", value: "Color-matched body, exposed-weave accents" },
      { label: "Donor", value: "McLaren 720S coupe or Spider" },
    ],
    stockImage: "/builds/720s-1016/stock.webp",
    kitImage: "/builds/720s-1016/kit.webp",
    metaTitle: "McLaren 720S 1016 Industries Widebody — SP Automotive",
    metaDescription:
      "McLaren 720S with 1016 Industries forged-carbon widebody kit. Full install, paint match. SP Automotive Sarasota, FL.",
  },
  {
    slug: "r8-libertywalk",
    car: "Audi R8",
    kit: "Liberty Walk",
    eyebrow: "Featured build · Audi R8",
    title: "R8, Liberty Walk widebody.",
    description:
      "Liberty Walk's signature widebody — riveted bolt-on overfenders, the polarizing JDM look that started the trend — applied to the V10 R8. Aggressive, deliberately overstated, unmistakably Liberty Walk.",
    specs: [
      { label: "Kit", value: "Liberty Walk LB-Silhouette Works R8" },
      { label: "Material", value: "FRP + carbon options" },
      { label: "Components", value: "Bolt-on overfenders (riveted), front lip, side skirts, rear diffuser, optional GT wing" },
      { label: "Install time", value: "~3 weeks" },
      { label: "Finish", value: "Body-color with exposed rivets, optional carbon accents" },
      { label: "Donor", value: "Audi R8 V10 (Gen 1 or Gen 2)" },
    ],
    stockImage: "/builds/r8-libertywalk/stock.webp",
    kitImage: "/builds/r8-libertywalk/kit.webp",
    metaTitle: "Audi R8 Liberty Walk Widebody — SP Automotive",
    metaDescription:
      "Audi R8 V10 with Liberty Walk LB-Silhouette widebody. Bolt-on overfenders, paint, install. SP Automotive Sarasota, FL.",
  },
];

export function getBuild(slug: string): Build | undefined {
  return BUILDS.find((b) => b.slug === slug);
}
