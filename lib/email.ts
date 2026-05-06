import { Resend } from "resend";

// Thin wrapper around Resend so callers don't see the SDK. Returns
// { ok: true } on success or { ok: false, error } on failure — never throws.
// Missing RESEND_API_KEY is treated as a configuration error rather than a
// runtime crash so preview deploys without keys still respond to submissions.

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL;

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export type ContactLead = {
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  description: string;
  photoUrls: string[];
};

// Estimate is the lighter funnel — phone + vehicle + photos only. No email, no
// description. Distinct shape so misuse fails type-check.
export type EstimateLead = {
  name: string;
  phone: string;
  vehicle: string;
  photoUrls: string[];
};

export async function sendContactEmail(
  to: string,
  lead: ContactLead,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!resend) return { ok: false, error: "RESEND_API_KEY missing" };
  if (!CONTACT_FROM_EMAIL) return { ok: false, error: "CONTACT_FROM_EMAIL missing" };

  const photoList = lead.photoUrls.length
    ? lead.photoUrls.map((url, i) => `<li><a href="${escapeHtml(url)}">Photo ${i + 1}</a></li>`).join("")
    : "<li>No photos uploaded.</li>";

  const html = `
    <h2 style="font-family: Georgia, serif;">New contact form submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
    <p><strong>Phone:</strong> <a href="tel:${escapeHtml(lead.phone)}">${escapeHtml(lead.phone)}</a></p>
    <p><strong>Email:</strong> <a href="mailto:${escapeHtml(lead.email)}">${escapeHtml(lead.email)}</a></p>
    <p><strong>Vehicle:</strong> ${escapeHtml(lead.vehicle)}</p>
    <p><strong>Description:</strong></p>
    <p style="white-space: pre-wrap;">${escapeHtml(lead.description)}</p>
    <p><strong>Photos:</strong></p>
    <ul>${photoList}</ul>
  `;

  try {
    const { error } = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to,
      replyTo: lead.email,
      subject: `New lead — ${lead.name} (${lead.vehicle})`,
      html,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "unknown" };
  }
}

export async function sendEstimateEmail(
  to: string,
  lead: EstimateLead,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!resend) return { ok: false, error: "RESEND_API_KEY missing" };
  if (!CONTACT_FROM_EMAIL) return { ok: false, error: "CONTACT_FROM_EMAIL missing" };

  const photoList = lead.photoUrls.length
    ? lead.photoUrls.map((url, i) => `<li><a href="${escapeHtml(url)}">Photo ${i + 1}</a></li>`).join("")
    : "<li>No photos attached.</li>";

  const html = `
    <h2 style="font-family: Georgia, serif;">New estimate request</h2>
    <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
    <p><strong>Phone:</strong> <a href="tel:${escapeHtml(lead.phone)}">${escapeHtml(lead.phone)}</a></p>
    <p><strong>Vehicle:</strong> ${escapeHtml(lead.vehicle)}</p>
    <p><strong>Photos:</strong></p>
    <ul>${photoList}</ul>
    <p style="color:#666;font-size:12px;">Lighter funnel — no email or description. Call back to scope the repair.</p>
  `;

  try {
    const { error } = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to,
      subject: `Estimate request — ${lead.name} (${lead.vehicle})`,
      html,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "unknown" };
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
