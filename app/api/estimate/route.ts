import { checkBotId } from "botid/server";
import { NextResponse } from "next/server";
import { sendEstimateEmail, type EstimateLead } from "@/lib/email";
import { appendEstimateToSheet } from "@/lib/sheets";

const RECIPIENT = process.env.CONTACT_RECIPIENT_EMAIL;

const MAX_LEN = {
  name: 120,
  phone: 40,
  vehicle: 120,
};
const MAX_PHOTOS = 3;

// Lighter sibling of /api/contact. No email, no description — just enough to
// trigger a callback. Same BotID gate, same Resend + Sheet plumbing, distinct
// subject line and `kind: estimate` so Serge can triage at a glance.

export async function POST(request: Request) {
  const verification = await checkBotId();
  if (verification.isBot) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  if (!RECIPIENT) {
    return NextResponse.json(
      { error: "Recipient not configured" },
      { status: 500 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const lead = parseEstimate(payload);
  if (!lead) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const [emailResult, sheetResult] = await Promise.all([
    sendEstimateEmail(RECIPIENT, lead),
    appendEstimateToSheet(lead),
  ]);

  if (!emailResult.ok) {
    console.error("Estimate email failed:", emailResult.error);
    return NextResponse.json(
      { error: "Could not send. Please call us directly." },
      { status: 502 },
    );
  }

  if (!sheetResult.ok) {
    console.warn("Estimate sheet append failed:", sheetResult.error);
  }

  return NextResponse.json({ ok: true });
}

function parseEstimate(input: unknown): EstimateLead | null {
  if (!input || typeof input !== "object") return null;
  const o = input as Record<string, unknown>;

  const name = trimString(o.name, MAX_LEN.name);
  const phone = trimString(o.phone, MAX_LEN.phone);
  const vehicle = trimString(o.vehicle, MAX_LEN.vehicle);

  if (!name || !phone || !vehicle) return null;

  const rawPhotos = Array.isArray(o.photoUrls) ? o.photoUrls : [];
  const photoUrls = rawPhotos
    .filter((u): u is string => typeof u === "string")
    .filter((u) => u.startsWith("https://"))
    .slice(0, MAX_PHOTOS);

  return { name, phone, vehicle, photoUrls };
}

function trimString(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  const trimmed = v.trim();
  return trimmed.length > max ? trimmed.slice(0, max) : trimmed;
}
