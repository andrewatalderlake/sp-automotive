import Script from "next/script";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleTagManager } from "@next/third-parties/google";

// Each tracker is gated on its env var so missing IDs no-op cleanly in
// development and preview deploys before keys are issued.
//
// - NEXT_PUBLIC_GTM_ID: Google Tag Manager container (loads GA4 via tag).
// - NEXT_PUBLIC_CLARITY_ID: Microsoft Clarity project ID.

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

export default function Analytics() {
  return (
    <>
      <VercelAnalytics />
      <SpeedInsights />
      {GTM_ID ? <GoogleTagManager gtmId={GTM_ID} /> : null}
      {CLARITY_ID ? <ClarityScript projectId={CLARITY_ID} /> : null}
    </>
  );
}

function ClarityScript({ projectId }: { projectId: string }) {
  return (
    <Script
      id="ms-clarity"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${projectId}");`,
      }}
    />
  );
}
