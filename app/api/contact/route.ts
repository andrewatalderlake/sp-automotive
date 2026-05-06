import { checkBotId } from "botid/server";
import { NextResponse } from "next/server";
import { sendContactEmail, type ContactLead } from "@/lib/email";
import { appendLeadToSheet } from "@/lib/sheets";

const RECIPIENT = process.env.CONTACT_RECIPIENT_EMAIL;

const MAX_LEN = {
  name: 120,
  phone: 40,
  email: 200,
  vehicle: 120,
  description: 4000,
};
const MAX_PHOTOS = 10;

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

  const lead = parseLead(payload);
  if (!lead) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const [emailResult, sheetResult] = await Promise.all([
    sendContactEmail(RECIPIENT, lead),
    appendLeadToSheet(lead),
  ]);

  if (!emailResult.ok) {
    console.error("Contact email failed:", emailResult.error);
    return NextResponse.json(
      { error: "Could not send. Please call us directly." },
      { status: 502 },
    );
  }

  if (!sheetResult.ok) {
    // Non-fatal — email already sent. Log for later replay.
    console.warn("Sheet append failed:", sheetResult.error);
  }

  return NextResponse.json({ ok: true });
}

function parseLead(input: unknown): ContactLead | null {
  if (!input || typeof input !== "object") return null;
  const o = input as Record<string, unknown>;

  const name = trimString(o.name, MAX_LEN.name);
  const phone = trimString(o.phone, MAX_LEN.phone);
  const email = trimString(o.email, MAX_LEN.email);
  const vehicle = trimString(o.vehicle, MAX_LEN.vehicle);
  const description = trimString(o.description, MAX_LEN.description);

  if (!name || !phone || !email || !vehicle || !description) return null;
  if (!isLikelyEmail(email)) return null;

  const rawPhotos = Array.isArray(o.photoUrls) ? o.photoUrls : [];
  const photoUrls = rawPhotos
    .filter((u): u is string => typeof u === "string")
    .filter((u) => u.startsWith("https://"))
    .slice(0, MAX_PHOTOS);

  return { name, phone, email, vehicle, description, photoUrls };
}

function trimString(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  const trimmed = v.trim();
  return trimmed.length > max ? trimmed.slice(0, max) : trimmed;
}

function isLikelyEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
