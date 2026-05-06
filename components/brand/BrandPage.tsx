import BrandHero from "./BrandHero";
import BrandServices from "./BrandServices";
import BrandModels from "./BrandModels";
import TestimonialsSection from "@/components/testimonials/TestimonialsSection";
import FinalCTA from "@/components/cta/FinalCTA";
import BrandPageView from "@/components/analytics/BrandPageView";
import { PUBLISHED_TESTIMONIALS } from "@/components/testimonials/testimonials-data";
import { SITE_NAME, SITE_URL, PHONE, CITY, REGION } from "@/lib/site";
import type { Brand } from "./brands-data";

// Reusable composition for every brand-specific landing page. One Brand entry
// in brands-data.ts produces the full page; the per-brand page.tsx files just
// import this with their Brand object.

export default function BrandPage({ brand }: { brand: Brand }) {
  const hasBrandTestimonials = PUBLISHED_TESTIMONIALS.some((t) => t.brand === brand.brandKey);

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${brand.name} Collision Repair`,
    description: brand.metaDescription,
    provider: {
      "@type": "AutoBodyShop",
      name: SITE_NAME,
      url: SITE_URL,
      telephone: PHONE,
      address: {
        "@type": "PostalAddress",
        addressLocality: CITY,
        addressRegion: REGION,
        addressCountry: "US",
      },
    },
    areaServed: { "@type": "City", name: CITY },
    serviceType: `${brand.name} collision repair, paint, frame, and ADAS recalibration`,
    url: `${SITE_URL}/${brand.slug}`,
    brand: { "@type": "Brand", name: brand.name },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <BrandPageView brand={brand.brandKey} />
      <BrandHero brand={brand} />
      <BrandServices brand={brand} />
      <BrandModels brand={brand} />
      {hasBrandTestimonials && (
        <TestimonialsSection
          brand={brand.brandKey}
          heading={`From ${brand.name} owners.`}
        />
      )}
      <FinalCTA />
    </>
  );
}
