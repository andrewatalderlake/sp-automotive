// FAQ entries — drafted from the brand voice on /about and /process. Plain
// text only in `answer`: it's both rendered into the page body and emitted as
// the schema.org FAQPage `acceptedAnswer.text`, so any HTML or smart quotes
// would corrupt the JSON-LD. Keep entries factual, calm, owner-voice.
//
// Per-question gate: flip `published: false` on any entry that needs Serge to
// re-read it before it goes live. Hidden questions vanish from the page AND
// from the JSON-LD.

export type FAQ = {
  id: string;
  question: string;
  answer: string;
  published: boolean;
};

export const FAQS: FAQ[] = [
  {
    id: "timeline",
    question: "How long will my repair take?",
    answer:
      "Most exotic collision jobs run three to eight weeks once parts are in hand. The variable is parts — OEM body panels for Lamborghini, McLaren, and Audi R8 routinely ship from Europe and can sit on a manifest for weeks. We start the forensic intake the day you bring the car in, then give you a written timeline once disassembly is complete and the real damage is documented. We do not pad estimates. We do not promise dates we cannot hold.",
    published: true,
  },
  {
    id: "oem-parts",
    question: "Do you only use OEM parts?",
    answer:
      "Yes. Every body panel, every fastener, every clip is OEM. Aftermarket panels do not match factory gap tolerances on these cars and they do not hold paint correctly. If a part is genuinely unavailable from the manufacturer — which is rare on cars under fifteen years old — we tell you the options before we order anything.",
    published: true,
  },
  {
    id: "paint-match",
    question: "How do you match factory paint?",
    answer:
      "We mix paint in-house using the manufacturer's color code, then verify the match on a hidden test panel under shop lighting and natural daylight before any panel goes into the booth. Tri-coat finishes — pearl, metallic, candy — get an extra round of layer-by-layer verification because the under-color shifts the visible result. We measure final paint depth against factory data with a dry-film thickness gauge. The full breakdown is on our paint-match explainer page.",
    published: true,
  },
  {
    id: "adas",
    question: "Do you handle ADAS recalibration in-house?",
    answer:
      "Yes. Adaptive cruise, blind-spot, lane-keep, automatic emergency braking, and surround-view cameras are all recalibrated on our equipment before the car leaves. Most network shops outsource this step, which adds days to your repair and creates a gap in liability. We do it on premises with manufacturer-grade scan tools. The full breakdown is on our ADAS explainer page.",
    published: true,
  },
  {
    id: "warranty",
    question: "What warranty do you offer?",
    answer:
      "Lifetime warranty on workmanship and refinishing for as long as you own the car. Parts carry their own manufacturer warranties. Warranty paperwork is signed by the person who did the work — Serge — and goes home with you when the car does.",
    published: true,
  },
  {
    id: "insurance-routing",
    question: "Do you work with insurance?",
    answer:
      "We work with every major carrier. We are not a direct-repair-program shop, which means we do not take a commission to use the carrier's preferred parts and labor rates. We document the full damage, write the supplement, and negotiate the file directly so the repair gets done correctly and you do not get caught between us and your adjuster. If the carrier resists paying for OEM parts or factory procedures on your specific car, we will tell you what your options are.",
    published: true,
  },
  {
    id: "rental",
    question: "Can you arrange a rental car?",
    answer:
      "Yes. If your policy includes rental coverage, we coordinate the dates with Enterprise or your preferred provider so you are not paying for days the car is sitting waiting on parts. If your policy does not include rental, we can recommend a few exotic-friendly rental sources locally — but we will be honest with you about the cost.",
    published: true,
  },
  {
    id: "towing",
    question: "I cannot drive the car. Can you arrange a tow?",
    answer:
      "Call first. We will dispatch a flatbed that knows how to load a low-clearance exotic without scraping the splitter. Do not let a roadside-assistance contract tow truck pick up the car — they wheel-lift it and damage the front lip. If your insurance provider is sending the tow, ask them to specify a flatbed and to deliver to our address.",
    published: true,
  },
  {
    id: "secure-storage",
    question: "Where is my car stored during the repair?",
    answer:
      "Inside, on our shop floor, behind a locked roll-up. The lot is monitored. Keys stay with Serge — they do not hang on a board. If you want to come check on the car during the repair, we welcome it. Call ahead so we can pull it out for you.",
    published: true,
  },
  {
    id: "total-loss",
    question: "What if my car is declared a total loss?",
    answer:
      "If the carrier decides the repair cost exceeds the threshold for total loss, you have options. You can take the settlement, you can negotiate the value, or — on rare occasion with the right car — you can buy the car back as a salvage title and have us repair it anyway. We do not push you toward any of those choices. We give you the data so you can decide with your wallet open.",
    published: true,
  },
  {
    id: "photo-updates",
    question: "Will I get updates while you have the car?",
    answer:
      "Yes. You get photos at the major checkpoints — intake, full disassembly, paint, reassembly, final sign-off — and you can text Serge for an update at any point. We do not have a customer portal. The number on the contact page reaches the man holding the torque wrench.",
    published: true,
  },
  {
    id: "delivery",
    question: "How do I pick up the car when it is finished?",
    answer:
      "We schedule a final walkthrough with you. Every panel, every gap, every paint seam — we go over it together with the original intake photos so you can see what was repaired and confirm the result. You sign the warranty, you get the complete repair record, and you drive home in a car that looks the way it did the day it left the factory.",
    published: true,
  },
  {
    id: "models",
    question: "What models do you work on?",
    answer:
      "Lamborghini, McLaren, Audi R8, BMW M, Ferrari, Porsche. Aluminum, carbon fiber, and steel construction. If your car is not on that list, call — we have worked on cars older and rarer than the list suggests, and we will tell you honestly whether we are the right shop for it.",
    published: true,
  },
];

export const PUBLISHED_FAQS = FAQS.filter((f) => f.published);
