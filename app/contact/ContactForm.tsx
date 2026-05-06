"use client";
import { useState } from "react";
import { upload } from "@vercel/blob/client";
import Button from "@/components/ui/Button";
import { track } from "@/lib/analytics";

const MAX_FILES = 10;
const MAX_FILE_BYTES = 10 * 1024 * 1024;

type Status =
  | { kind: "idle" }
  | { kind: "uploading"; uploaded: number; total: number }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const labelCls = "block text-xs uppercase tracking-[0.22em] text-muted mb-2";
  const inputCls =
    "w-full bg-surface border border-white/10 focus:border-accent focus-visible:outline-2 focus-visible:outline focus-visible:outline-accent focus-visible:outline-offset-2 px-4 py-3 text-text placeholder:text-muted transition-colors";

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.files ? Array.from(e.target.files) : [];
    const oversized = next.find((f) => f.size > MAX_FILE_BYTES);
    if (oversized) {
      setStatus({
        kind: "error",
        message: `${oversized.name} is over 10MB. Try compressing or fewer photos.`,
      });
      return;
    }
    if (next.length > MAX_FILES) {
      setStatus({
        kind: "error",
        message: `Up to ${MAX_FILES} photos. Pick your best ones.`,
      });
      return;
    }
    setFiles(next);
    setStatus({ kind: "idle" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    track("contact_submit_attempt");

    if (!name.trim() || !phone.trim() || !email.trim() || !vehicle.trim() || !description.trim()) {
      setStatus({ kind: "error", message: "Fill in every field except photos." });
      track("contact_submit_error", { reason: "validation" });
      return;
    }

    try {
      let photoUrls: string[] = [];
      if (files.length > 0) {
        setStatus({ kind: "uploading", uploaded: 0, total: files.length });
        photoUrls = [];
        for (let i = 0; i < files.length; i++) {
          const f = files[i];
          const safeName = f.name.replace(/[^a-zA-Z0-9._-]/g, "_");
          const blob = await upload(`contact/${Date.now()}-${safeName}`, f, {
            access: "public",
            handleUploadUrl: "/api/contact/upload",
          });
          photoUrls.push(blob.url);
          setStatus({ kind: "uploading", uploaded: i + 1, total: files.length });
        }
      }

      setStatus({ kind: "submitting" });
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, vehicle, description, photoUrls }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        const message = data.error || "Something went wrong. Please call directly.";
        setStatus({ kind: "error", message });
        track("contact_submit_error", { reason: `http_${res.status}` });
        return;
      }

      setStatus({ kind: "success" });
      track("contact_submit_success");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please call directly.";
      setStatus({ kind: "error", message });
      track("contact_submit_error", { reason: "exception" });
    }
  }

  if (status.kind === "success") {
    return (
      <div className="mt-16 border border-accent p-8" role="status" aria-live="polite">
        <p className="font-display text-2xl text-accent">We got it.</p>
        <p className="mt-3 text-muted">Serge will be in touch within 24 hours.</p>
      </div>
    );
  }

  const inFlight = status.kind === "uploading" || status.kind === "submitting";

  return (
    <form className="mt-16 space-y-6" onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="name" className={labelCls}>Name</label>
        <input
          id="name" name="name" autoComplete="name" required
          className={inputCls} placeholder="Your name"
          value={name} onChange={(e) => setName(e.target.value)} disabled={inFlight}
        />
      </div>
      <div>
        <label htmlFor="phone" className={labelCls}>Phone</label>
        <input
          id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required
          className={inputCls} placeholder="(941) 555-0123"
          value={phone} onChange={(e) => setPhone(e.target.value)} disabled={inFlight}
        />
      </div>
      <div>
        <label htmlFor="email" className={labelCls}>Email</label>
        <input
          id="email" name="email" type="email" inputMode="email" autoComplete="email" required
          className={inputCls} placeholder="you@domain.com"
          value={email} onChange={(e) => setEmail(e.target.value)} disabled={inFlight}
        />
      </div>
      <div>
        <label htmlFor="vehicle" className={labelCls}>Vehicle (year / make / model)</label>
        <input
          id="vehicle" name="vehicle" autoComplete="off" required
          className={inputCls} placeholder="e.g., 2022 Aventador SVJ"
          value={vehicle} onChange={(e) => setVehicle(e.target.value)} disabled={inFlight}
        />
      </div>
      <div>
        <label htmlFor="description" className={labelCls}>Brief description</label>
        <textarea
          id="description" name="description" rows={5} required
          className={inputCls} placeholder="What happened? Where's the damage?"
          value={description} onChange={(e) => setDescription(e.target.value)} disabled={inFlight}
        />
      </div>
      <div>
        <label htmlFor="files" className={labelCls}>
          Photos (optional, up to {MAX_FILES})
        </label>
        <input
          id="files" name="files" type="file" accept="image/*" multiple
          className={`${inputCls} file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-accent file:text-bg file:cursor-pointer`}
          onChange={handleFileSelect} disabled={inFlight}
        />
        {files.length > 0 && (
          <p className="mt-2 text-xs text-muted">
            {files.length} file{files.length === 1 ? "" : "s"} selected
          </p>
        )}
      </div>

      {status.kind === "error" && (
        <p className="text-sm text-red-400" role="alert">{status.message}</p>
      )}
      {status.kind === "uploading" && (
        <p className="text-sm text-muted" aria-live="polite">
          Uploading photo {status.uploaded} of {status.total}…
        </p>
      )}
      {status.kind === "submitting" && (
        <p className="text-sm text-muted" aria-live="polite">Sending to Serge…</p>
      )}

      <Button variant="primary" type="submit" disabled={inFlight}>
        {inFlight ? "Sending…" : "Send to Serge"}
      </Button>
    </form>
  );
}
