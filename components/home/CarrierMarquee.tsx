import LogoMarquee, {
  type LogoMarqueeItem,
} from "@/components/home/LogoMarquee";

// Auto-scrolling carrier logo strip for §InsuranceHandling. Animation /
// a11y / masking / fallback rendering all live in LogoMarquee — this
// file is just the carrier data + a brand-aware wrapper.
//
// === Logo files ===
// Drop SVG (preferred) or PNG files into `/public/logos/carriers/`
// using the slug filename convention below, then set the matching
// `logo` field. Until a file exists, the carrier renders as an Anton
// uppercase wordmark at the same height.
//
// Brand-asset sourcing: each carrier publishes brand assets via their
// press / media-relations page; download the primary horizontal lockup
// in SVG when available. Confirm usage rights with Serge before launch
// (most carriers permit nominative use in a "carriers we work with"
// context; some require attribution).

// Filenames suffixed with -v2 are the paper-baked versions (2026-05-16)
// that eliminated the checker artifacts from the original sourced files.
// Renaming rather than using a `?v=N` query string because next/image
// doesn't handle query strings on local /public paths well. Bump the
// suffix (-v3, -v4, …) when the source files change again.
const CARRIERS: readonly LogoMarqueeItem[] = [
  { name: "State Farm", logo: "/logos/carriers/state-farm-v2.png" },
  { name: "Allstate", logo: "/logos/carriers/allstate-v2.png" },
  { name: "GEICO", logo: "/logos/carriers/geico-v2.png" },
  { name: "Progressive", logo: "/logos/carriers/progressive-v2.png" },
  { name: "USAA", logo: "/logos/carriers/usaa-v2.png" },
  { name: "Liberty Mutual", logo: "/logos/carriers/liberty-mutual-v2.png" },
  { name: "Chubb", logo: "/logos/carriers/chubb-v2.png" },
];

export default function CarrierMarquee() {
  return (
    <LogoMarquee
      items={CARRIERS}
      ariaLabel="Insurance carriers we work with"
      size="small"
    />
  );
}
