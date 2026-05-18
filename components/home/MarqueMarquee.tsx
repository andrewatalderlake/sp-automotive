import LogoMarquee, {
  type LogoMarqueeItem,
} from "@/components/home/LogoMarquee";

// Auto-scrolling marque (car-brand) strip for §FeaturedBuilds. Same
// machinery as CarrierMarquee — animation / a11y / masking / fallback
// rendering all live in LogoMarquee. This file is just the marque data
// + a brand-aware wrapper.
//
// Marque list is aligned with the Footer nav and `lib/faq-data.ts`
// "models we work on" answer. Keep these three in sync.
//
// === Logo files ===
// Drop SVG (preferred) or PNG files into `/public/logos/marques/` using
// the slug filename below, then set the matching `logo` field. Until a
// file exists, the marque renders as an Anton uppercase wordmark at
// the same height — which is also on-brand with the rest of the page,
// so the wordmark fallback is a defensible long-term option if you'd
// rather not introduce competing visual marks here.

const MAKES: readonly LogoMarqueeItem[] = [
  // Ferrari and Lamborghini are tall heraldic shields — at full container
  // height they read visually larger than the wider wordmarks (BMW M,
  // McLaren speedmark). Scaling them to 0.5 brings the row into balance.
  { name: "Ferrari", logo: "/logos/marques/ferrari.png", scale: 0.5 },
  { name: "Lamborghini", logo: "/logos/marques/lamborghini.png", scale: 0.5 },
  { name: "McLaren", logo: "/logos/marques/mclaren.png" },
  { name: "Porsche", logo: "/logos/marques/porsche.png" },
  { name: "Audi R8", logo: "/logos/marques/audi-r8.png" },
  { name: "BMW M", logo: "/logos/marques/bmw-m.png" },
];

export default function MarqueMarquee() {
  return (
    <LogoMarquee
      items={MAKES}
      ariaLabel="Marques we restore"
      size="large"
    />
  );
}
