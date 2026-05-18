export const PHONE = "(941) 599-4025";
export const PHONE_HREF = "tel:+19415994025";
// SMS deep-link with a pre-filled body. Both iOS and Android honor `?body=`
// on `sms:` URIs; the encoded prefix keeps the text composer ready for the
// owner to attach photos.
export const SMS_HREF = `sms:+19415994025?body=${encodeURIComponent("Photos of damage:")}`;
// Resolved at build time. Set NEXT_PUBLIC_SITE_URL=https://<apex-domain>
// (e.g. https://sp-automotive.com) in Vercel production env settings.
// Preview deploys auto-fall-back to VERCEL_URL. Local dev → localhost.
// Production without an explicit URL throws — refusing to ship preview
// hostnames into canonicals, sitemap, JSON-LD, and OG metadata.
function resolveSiteUrl(): string {
  const override = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (override) return override;

  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Validation is server-only. Next.js's DefinePlugin only inlines
  // NEXT_PUBLIC_* env vars into the client bundle; VERCEL_ENV and CI
  // are both `undefined` in the browser. If we ran these checks on the
  // client in a production build with NEXT_PUBLIC_SITE_URL unset, the
  // !undefined CI guard would always be true and the throw would
  // crash every page that imports lib/site.ts via a "use client"
  // component (e.g. TrustStrip). The server-side build is the right
  // place to fail — whatever value the server saw at build time has
  // already been inlined into the override branch of the client bundle.
  if (typeof window === "undefined") {
    if (process.env.VERCEL_ENV === "production") {
      throw new Error(
        "NEXT_PUBLIC_SITE_URL is required in production. Set it to the apex domain (e.g. https://sp-automotive.com) in Vercel project settings.",
      );
    }
    // Non-Vercel production deploys (Railway, Render, bare Docker, etc.)
    // that omit NEXT_PUBLIC_SITE_URL would otherwise silently serve
    // localhost URLs in canonicals / OG / sitemap / JSON-LD.
    // NODE_ENV=production is the portable signal for "this is not a dev
    // machine" outside Vercel. The CI=true exception is for verification
    // builds (GitHub Actions, GitLab, CircleCI all set CI=true; Vercel
    // does not) — those builds just need to compile, not produce a
    // shippable artifact, and shouldn't be blocked by missing prod env.
    if (process.env.NODE_ENV === "production" && !process.env.CI) {
      throw new Error(
        "NEXT_PUBLIC_SITE_URL is required in production. Set it to the apex domain (e.g. https://sp-automotive.com).",
      );
    }
  }

  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();
export const SITE_NAME = "SP Automotive Collision & Repair";
export const CITY = "Sarasota";
export const REGION = "FL";
export const POSTAL_CODE = "34236";
export const TAGLINE = "Built where it broke.";

// Operating hours. By-appointment only — windows below are when calls/visits
// are scheduled, not walk-in hours. The HOURS_LABEL is the display string for
// the footer and other UI; the structured fields drive JSON-LD.
export const BY_APPOINTMENT = true;
export const HOURS_LABEL = "Mon–Sat 9am–5pm";
export const HOURS_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;
export const HOURS_OPEN = "09:00";
export const HOURS_CLOSE = "17:00";

// City-level geo (Sarasota center). Update if/when a precise location is
// published. Used for LocalBusiness JSON-LD geo coordinates.
export const GEO_LAT = 27.3364;
export const GEO_LNG = -82.5307;
