import CornerSection from "./CornerSection";
import PhoneCTA from "@/components/ui/PhoneCTA";
import SmsCTA from "@/components/ui/SmsCTA";

export default function BodyworkAndEstimates() {
  return (
    <CornerSection
      chapterNumber="04"
      eyebrow="Estimate without the haul"
      headingId="bodywork-estimates-heading"
      headline={<>We come to you.</>}
      body={
        <>
          <p>
            Cars that can&apos;t move don&apos;t have to. We bring the estimate
            to your driveway, your garage, your storage unit — wherever the
            car is. One to two days from the call to the written number.
          </p>
          <p className="mt-6 text-muted">
            Monday through Saturday.
          </p>
        </>
      }
      cta={
        <>
          <PhoneCTA size="lg" location="bodywork-estimates" />
          <SmsCTA location="bodywork-estimates" />
        </>
      }
    />
  );
}
