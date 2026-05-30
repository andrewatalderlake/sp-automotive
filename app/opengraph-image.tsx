import { ImageResponse } from "next/og";

// 1200×630 social card. Built to read on a phone preview at thumb size:
// big Anton headline (matches the real site headline treatment), bone-on-ink
// like every primary section, and a `// Selected work`-style eyebrow tag
// for shop voice. Fonts are pulled from Google at build time; failure
// degrades to system sans-serif rather than crashing the build.

export const alt = "SP Automotive Collision & Repair — Built where it broke.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Loads a Google webfont and returns the raw woff2 bytes for Satori.
// Returns null on any failure (network blip, format drift) so the OG
// still renders with system fallback rather than failing the build.
async function loadGoogleFont(
  family: string,
  weight = 400,
): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}`,
      {
        // A modern-browser UA nudges Google to serve woff2; without it we
        // get a TTF fallback. Satori parses both, so either is fine — but
        // the regex below matches whichever format comes back so we
        // don't silently lose the font and ship an OG with no text.
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      },
    ).then((r) => r.text());
    // Match any url(...) regardless of format() — Satori handles
    // woff2 and TTF, and Google has shipped both in different responses.
    const m = css.match(/src:\s*url\((https?:\/\/[^)]+)\)/);
    if (!m) return null;
    return await fetch(m[1]).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OG() {
  const [anton, hanken] = await Promise.all([
    loadGoogleFont("Anton", 400),
    loadGoogleFont("Hanken Grotesk", 500),
  ]);

  // Brand tokens — kept inline so the OG renderer doesn't need to read
  // app/globals.css (Satori can't evaluate Tailwind / @theme).
  const ink = "#0E0F11";
  const bone = "#C9C4BB";
  const graphite = "#6E727A";
  const hairline = "rgba(201,196,187,0.22)";

  // `next/og`'s ImageResponse second arg is `(ImageOptions & ResponseInit) | undefined`;
  // narrow the fonts array type from the non-nullable form so push() validates.
  type Fonts = NonNullable<
    NonNullable<ConstructorParameters<typeof ImageResponse>[1]>["fonts"]
  >;
  const fonts: Fonts = [];
  if (anton)
    fonts.push({
      name: "Anton",
      data: anton,
      style: "normal",
      weight: 400,
    });
  if (hanken)
    fonts.push({
      name: "Hanken Grotesk",
      data: hanken,
      style: "normal",
      weight: 500,
    });

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          width: "100%",
          height: "100%",
          background: ink,
          padding: 80,
          fontFamily: "Hanken Grotesk, sans-serif",
        }}
      >
        {/* Eyebrow — Hanken uppercase tracked, in graphite per design system. */}
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 5,
            color: graphite,
            textTransform: "uppercase",
          }}
        >
          {"// Sarasota, FL · Exotic collision"}
        </div>
        {/* Hairline divider — never full-strength borders per design rules. */}
        <div
          style={{
            display: "flex",
            width: 220,
            height: 1,
            background: hairline,
            marginTop: 22,
          }}
        />
        {/* Display headline — Anton condensed, matches the real homepage hero. */}
        <div
          style={{
            display: "flex",
            fontSize: 156,
            letterSpacing: -4,
            lineHeight: 0.9,
            marginTop: 32,
            color: bone,
            fontFamily: "Anton, sans-serif",
            textTransform: "uppercase",
          }}
        >
          Built where it broke.
        </div>
        {/* Sub-deck — bone at 85% per AGENTS.md (body prose on dark). */}
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: bone,
            opacity: 0.85,
            marginTop: 26,
            maxWidth: 960,
            lineHeight: 1.25,
          }}
        >
          Factory-correct collision repair for Lamborghini, McLaren, Porsche, Audi R8.
        </div>
        {/* Top-right SP wordmark — Anton tracked, mirrors the favicon mark. */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 80,
            right: 80,
            fontSize: 30,
            color: bone,
            letterSpacing: 6,
            textTransform: "uppercase",
            fontFamily: "Anton, sans-serif",
          }}
        >
          SP Automotive
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
