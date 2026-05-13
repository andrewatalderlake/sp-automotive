import type { Metadata } from "next";
import ProcessNarrative from "@/components/process/ProcessNarrative";
import FinalCTA from "@/components/cta/FinalCTA";

export const metadata: Metadata = {
  title: "Our Process",
  description:
    "Six steps. One signature. How SP Automotive returns exotics to factory spec in Sarasota — forensic intake, disassembly, diagnosis, paint, reassembly, and final sign-off.",
};

export default function ProcessPage() {
  return (
    <>
      <ProcessNarrative />
      <FinalCTA />
    </>
  );
}
