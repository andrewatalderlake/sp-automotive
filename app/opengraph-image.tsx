import { ImageResponse } from "next/og";

export const alt = "SP Automotive Collision & Repair";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          width: "100%",
          height: "100%",
          background: "linear-gradient(180deg, #0a0a0a 0%, #000 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
          padding: 80,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 4,
            color: "#a0a0a0",
            textTransform: "uppercase",
          }}
        >
          Sarasota, FL · Exotic Collision
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 132,
            fontWeight: 800,
            letterSpacing: -3,
            lineHeight: 0.95,
            marginTop: 22,
          }}
        >
          Built where it broke.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#cfcfcf",
            marginTop: 20,
            maxWidth: 920,
          }}
        >
          Factory-correct collision repair for Lamborghini, McLaren, Audi R8, BMW M.
        </div>
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 80,
            right: 80,
            fontSize: 24,
            color: "#fff",
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          SP Automotive
        </div>
      </div>
    ),
    { ...size }
  );
}
