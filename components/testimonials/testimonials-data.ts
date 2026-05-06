// PLACEHOLDER testimonials. Replace with real owner quotes.
// Keep quotes 60-180 chars. `brand` is lowercase + hyphen-free for filtering on
// brand-specific landing pages (e.g. 'lamborghini', 'mclaren', 'audi').
//
// `published` gates whether an entry renders on the site. Keep false until the
// quote is verified, attributable, and approved. PUBLISHED_TESTIMONIALS is the
// only export consumers should read for rendering.

export type Testimonial = {
  quote: string;
  author: string;   // First name + last initial, e.g. "Mark P."
  car: string;      // Year + make + model, e.g. "'22 Aventador SVJ"
  brand: string;    // Lowercase brand key for filtering
  published: boolean;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "I dropped off a wreck and picked up the car I bought new. Serge knows what factory means.",
    author: "PLACEHOLDER — Mark P.",
    car: "'22 Aventador SVJ",
    brand: "lamborghini",
    published: false,
  },
  {
    quote: "Three shops told me to total it. Serge brought it back better than the day I drove it home.",
    author: "PLACEHOLDER — David R.",
    car: "'21 720S",
    brand: "mclaren",
    published: false,
  },
  {
    quote: "Dealer's body shop wanted six months. Serge had it back in six weeks — and you cannot tell it was ever touched.",
    author: "PLACEHOLDER — Anthony K.",
    car: "'19 R8 V10 Plus",
    brand: "audi",
    published: false,
  },
  {
    quote: "Forensic. That's the only word for how he works. He found damage three other shops missed.",
    author: "PLACEHOLDER — Mike S.",
    car: "'23 M4 Competition",
    brand: "bmw",
    published: false,
  },
];

export const PUBLISHED_TESTIMONIALS: Testimonial[] = TESTIMONIALS.filter(
  (t) => t.published,
);
