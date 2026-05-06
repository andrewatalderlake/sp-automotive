import type { ContactLead, EstimateLead } from "./email";

// POSTs lead JSON to a Google Apps Script webhook deployed in the shared
// agency workspace. The Apps Script reads the `kind` field and appends the
// row to the matching tab — `Leads` for contact, `Estimates` for estimate.
// See docs/apps-script-contact.md for the deployment script and setup steps.
//
// Failure is non-fatal — a sheet append failing should not block the email
// to Serge. Logged for later replay if needed.

const SHEET_WEBHOOK_URL = process.env.SHEET_WEBHOOK_URL;

export async function appendLeadToSheet(
  lead: ContactLead,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!SHEET_WEBHOOK_URL) return { ok: false, error: "SHEET_WEBHOOK_URL missing" };

  return postWebhook({
    kind: "contact",
    timestamp: new Date().toISOString(),
    ...lead,
    photoUrls: lead.photoUrls.join(", "),
  });
}

export async function appendEstimateToSheet(
  lead: EstimateLead,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!SHEET_WEBHOOK_URL) return { ok: false, error: "SHEET_WEBHOOK_URL missing" };

  return postWebhook({
    kind: "estimate",
    timestamp: new Date().toISOString(),
    ...lead,
    photoUrls: lead.photoUrls.join(", "),
  });
}

async function postWebhook(
  body: Record<string, unknown>,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch(SHEET_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      return { ok: false, error: `sheet webhook ${res.status}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "unknown" };
  }
}
