// Curated exotic paint library used by the swatch wall on /paint-work.
// Hex values are approximations rendered at sRGB — chosen to read as
// recognizably the manufacturer color at swatch size. The whole point of
// the page is that hex codes are insufficient (variant cards + dry-film
// thickness do the actual work), so an approximation here is on-message.

export type ColorFamily =
  | "tri-coat"
  | "pearl"
  | "metallic"
  | "single-stage"
  | "matte";

export type ColorSwatch = {
  hex: string;
  manufacturer: string;
  name: string;
  code: string;
  family: ColorFamily;
  /** Number of approved factory variants — the drift range we mix across. */
  variants: number;
  /** One-line technical handle. Should read like an owner's-manual note. */
  note: string;
};

export const COLORS: ColorSwatch[] = [
  // ─── Lamborghini ────────────────────────────────────────────────────
  {
    hex: "#3D4D2A",
    manufacturer: "Lamborghini",
    name: "Verde Mantis",
    code: "LZA0",
    family: "tri-coat",
    variants: 5,
    note: "Mid-coat thickness shifts visible hue ±2 ΔE. Sample card on a hidden panel before any visible panel goes in the booth.",
  },
  {
    hex: "#F08A1D",
    manufacturer: "Lamborghini",
    name: "Arancio Borealis",
    code: "LX2K",
    family: "single-stage",
    variants: 3,
    note: "Reads warmer in tungsten light than booth fluorescent. Verify under three light sources before sign-off.",
  },
  {
    hex: "#6E7378",
    manufacturer: "Lamborghini",
    name: "Grigio Telesto",
    code: "LR7G",
    family: "metallic",
    variants: 4,
    note: "Flake orientation matters more than hue. Spray pressure and flash time control the visible sparkle density.",
  },
  {
    hex: "#F3D11A",
    manufacturer: "Lamborghini",
    name: "Giallo Orion",
    code: "LX1L",
    family: "single-stage",
    variants: 3,
    note: "Highest-saturation yellow in the lineup. Drifts toward green if clear-coat is thin; verify total film thickness.",
  },
  {
    hex: "#1D3F70",
    manufacturer: "Lamborghini",
    name: "Blu Cepheus",
    code: "LZ5L",
    family: "metallic",
    variants: 4,
    note: "Dark base + heavy metallic — masks panel-prep imperfections poorly. Substrate sanding has to be flat to 1500 grit.",
  },

  // ─── Ferrari ────────────────────────────────────────────────────────
  {
    hex: "#D40000",
    manufacturer: "Ferrari",
    name: "Rosso Corsa",
    code: "300/9",
    family: "single-stage",
    variants: 4,
    note: "The reference red. Variants drift with batch — match to the panel itself, not the catalog chip.",
  },
  {
    hex: "#8A0F1F",
    manufacturer: "Ferrari",
    name: "Rosso Mugello",
    code: "325",
    family: "metallic",
    variants: 3,
    note: "Deep red with fine flake. Reads almost black at low-angle; gloss reading at the booth + after-bake is non-negotiable.",
  },
  {
    hex: "#FCDB00",
    manufacturer: "Ferrari",
    name: "Giallo Modena",
    code: "102",
    family: "single-stage",
    variants: 3,
    note: "Coverage is the challenge — yellow over a dark primer needs 2 extra base coats. Plan film thickness accordingly.",
  },
  {
    hex: "#B0B2B5",
    manufacturer: "Ferrari",
    name: "Argento Nürburgring",
    code: "703",
    family: "metallic",
    variants: 4,
    note: "Light silver flake — panel flatness is unforgiving. Any ripple in the substrate reads as a wave under direct light.",
  },
  {
    hex: "#5D5F62",
    manufacturer: "Ferrari",
    name: "Grigio Silverstone",
    code: "713",
    family: "metallic",
    variants: 4,
    note: "Darker sibling of Argento. Flake count is lower, so reads more solid; still flatness-sensitive.",
  },

  // ─── McLaren ────────────────────────────────────────────────────────
  {
    hex: "#FFCB1F",
    manufacturer: "McLaren",
    name: "Volcano Yellow",
    code: "MSO-VY",
    family: "pearl",
    variants: 5,
    note: "Pearl mid-coat gives the depth. Spray window is narrow — temperature and humidity inside the booth matter more than the gun setup.",
  },
  {
    hex: "#E66A1F",
    manufacturer: "McLaren",
    name: "Papaya Spark",
    code: "MSO-PS",
    family: "pearl",
    variants: 4,
    note: "Signature MSO orange. The pearl is what separates it from a flat orange — under-spray and it reads as a knock-off.",
  },
  {
    hex: "#0A4985",
    manufacturer: "McLaren",
    name: "MSO Burton Blue",
    code: "MSO-BB",
    family: "pearl",
    variants: 3,
    note: "Deep base + restrained pearl. Mixed to the build sheet, not the catalog — MSO commissions vary panel-to-panel.",
  },
  {
    hex: "#14161A",
    manufacturer: "McLaren",
    name: "Onyx Black",
    code: "MSO-OB",
    family: "single-stage",
    variants: 2,
    note: "Looks easy, isn't. Black telegraphs every orange-peel artefact — flow-coat clear is mandatory for show finish.",
  },

  // ─── Porsche ────────────────────────────────────────────────────────
  {
    hex: "#7DB0DA",
    manufacturer: "Porsche",
    name: "Gulf Blue",
    code: "PTS-3A",
    family: "single-stage",
    variants: 7,
    note: "PTS color — mixed to VIN, not catalog. Seven approved variants account for batch drift across the production run.",
  },
  {
    hex: "#1A78B5",
    manufacturer: "Porsche",
    name: "Riviera Blue",
    code: "M5W",
    family: "single-stage",
    variants: 6,
    note: "Classic Porsche blue. Reads accurate only under D65 booth lighting — incandescent shop bulbs misread by 4–5 ΔE.",
  },
  {
    hex: "#6B8A2C",
    manufacturer: "Porsche",
    name: "Python Green",
    code: "PTS-2X",
    family: "single-stage",
    variants: 5,
    note: "Rare PTS — half the requests come from one Atlanta dealer. Drift is asymmetric; mix slightly warm to land at the variant center.",
  },
  {
    hex: "#9C9486",
    manufacturer: "Porsche",
    name: "Crayon",
    code: "M9X",
    family: "single-stage",
    variants: 4,
    note: "Earth-tone neutral. Edge reflections drift warm; bake schedule controls final cast more than the mix.",
  },
  {
    hex: "#C90019",
    manufacturer: "Porsche",
    name: "Guards Red",
    code: "G1",
    family: "single-stage",
    variants: 4,
    note: "The classic. Fades unevenly with UV exposure — surrounding-panel age matters as much as the new mix.",
  },

  // ─── Audi ───────────────────────────────────────────────────────────
  {
    hex: "#52555A",
    manufacturer: "Audi",
    name: "Daytona Grey Pearl",
    code: "LZ7S",
    family: "pearl",
    variants: 5,
    note: "Effect pearl over grey base — pearl thickness controls the cool/warm shift. Variant cards required, no exceptions.",
  },
  {
    hex: "#FFD500",
    manufacturer: "Audi",
    name: "Vegas Yellow",
    code: "LY1H",
    family: "single-stage",
    variants: 3,
    note: "R8 signature yellow. Coverage and clear depth determine the final read — under-clear and the surface reads chalky.",
  },
  {
    hex: "#E15914",
    manufacturer: "Audi",
    name: "Solar Orange",
    code: "LY2H",
    family: "pearl",
    variants: 4,
    note: "Audi pearl over orange base. Mid-coat is the variable; over-spray and it reads brown, under-spray and it reads neon.",
  },

  // ─── Mercedes-AMG ───────────────────────────────────────────────────
  {
    hex: "#1B6FB5",
    manufacturer: "Mercedes-AMG",
    name: "AMG Hyper Blue",
    code: "899",
    family: "metallic",
    variants: 4,
    note: "Metal-flake density is what reads as 'hyper'. Spray-pattern overlap controls the flake landing — single-pass coverage is wrong.",
  },
  {
    hex: "#F5C500",
    manufacturer: "Mercedes-AMG",
    name: "AMG Solarbeam",
    code: "190U",
    family: "single-stage",
    variants: 3,
    note: "Vivid yellow used on GT and SL spec orders. Reads warmer than the chip suggests — sample before any visible panel.",
  },

  // ─── Matte / satin ──────────────────────────────────────────────────
  {
    hex: "#3F4145",
    manufacturer: "Mercedes-AMG",
    name: "Selenite Grey Magno",
    code: "799",
    family: "matte",
    variants: 3,
    note: "Designo matte program. Clear is satin-flatted, not omitted — the surface needs flat read without going chalky.",
  },
  {
    hex: "#6B6E72",
    manufacturer: "Audi",
    name: "Nardo Grey",
    code: "LX7J",
    family: "matte",
    variants: 2,
    note: "RS/R8 signature. Reads green in shade, blue in direct sun. Substrate prep matters as much as the mix — any waviness telegraphs through.",
  },
  {
    hex: "#E8E5DE",
    manufacturer: "Lamborghini",
    name: "Bianco Opaco",
    code: "LY9C",
    family: "matte",
    variants: 3,
    note: "Matte white. Hardest of the lineup to keep clean in process — fingerprint oils transfer through the clear before cure.",
  },
];
