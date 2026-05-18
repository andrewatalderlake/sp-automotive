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

type FieldKey = "name" | "phone" | "email" | "vehicle" | "description" | "files";
type FieldErrors = Partial<Record<FieldKey, string>>;

// DOM order — used to focus the first invalid field on submit failure.
const FIELD_ORDER: FieldKey[] = ["name", "phone", "email", "vehicle", "description", "files"];

export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const labelCls = "block text-xs uppercase tracking-[0.22em] text-graphite mb-2";
  const inputCls =
    "w-full bg-steel border border-white/10 focus:border-bone px-4 py-3 text-bone placeholder:text-graphite transition-colors";

  function clearError(field: FieldKey) {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function validate(): FieldErrors {
    const errs: FieldErrors = {};
    if (!name.trim()) errs.name = "Required.";
    if (!phone.trim()) errs.phone = "Required.";
    if (!email.trim()) errs.email = "Required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      errs.email = "Doesn't look like an email address.";
    if (!vehicle.trim()) errs.vehicle = "Required.";
    if (!description.trim()) errs.description = "Required.";
    return errs;
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.files ? Array.from(e.target.files) : [];
    const oversized = next.find((f) => f.size > MAX_FILE_BYTES);
    if (oversized) {
      setFieldErrors((prev) => ({
        ...prev,
        files: `${oversized.name} is over 10MB. Try compressing or fewer photos.`,
      }));
      return;
    }
    if (next.length > MAX_FILES) {
      setFieldErrors((prev) => ({
        ...prev,
        files: `Up to ${MAX_FILES} photos. Pick your best ones.`,
      }));
      return;
    }
    clearError("files");
    setFiles(next);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    track("contact_submit_attempt");

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      track("contact_submit_error", { reason: "validation" });
      // Move focus to the first invalid field for screen-reader and
      // keyboard users — DOM order via FIELD_ORDER.
      const first = FIELD_ORDER.find((k) => errs[k]);
      if (first) {
        const el = document.getElementById(first) as HTMLElement | null;
        el?.focus();
      }
      return;
    }
    setFieldErrors({});

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
      <div className="mt-16 border border-bone p-8" role="status" aria-live="polite">
        <p className="font-display text-2xl text-ignite">We got it.</p>
        <p className="mt-3 text-bone/85">Serge will be in touch — usually inside the hour, always within 24.</p>
      </div>
    );
  }

  const inFlight = status.kind === "uploading" || status.kind === "submitting";

  function ariaErr(field: FieldKey) {
    const has = !!fieldErrors[field];
    return {
      "aria-invalid": has || undefined,
      "aria-describedby": has ? `${field}-error` : undefined,
    };
  }
  const errBorder = (field: FieldKey) => (fieldErrors[field] ? "border-ignite" : "");

  return (
    <form className="mt-16 space-y-6" onSubmit={handleSubmit} noValidate>
      <p className="text-xs text-bone/85">
        <span aria-hidden className="text-ignite">*</span> Required.
      </p>

      <div>
        <label htmlFor="name" className={labelCls}>Name<span aria-hidden className="text-ignite ml-1">*</span></label>
        <input
          id="name" name="name" autoComplete="name" required
          {...ariaErr("name")}
          className={`${inputCls} ${errBorder("name")}`}
          placeholder="Your name"
          value={name}
          onChange={(e) => { setName(e.target.value); clearError("name"); }}
          disabled={inFlight}
        />
        {fieldErrors.name && (
          <p id="name-error" className="mt-2 text-xs text-ignite">{fieldErrors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className={labelCls}>Phone<span aria-hidden className="text-ignite ml-1">*</span></label>
        <input
          id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required
          {...ariaErr("phone")}
          className={`${inputCls} ${errBorder("phone")}`}
          placeholder="(941) 555-0123"
          value={phone}
          onChange={(e) => { setPhone(e.target.value); clearError("phone"); }}
          disabled={inFlight}
        />
        {fieldErrors.phone && (
          <p id="phone-error" className="mt-2 text-xs text-ignite">{fieldErrors.phone}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className={labelCls}>Email<span aria-hidden className="text-ignite ml-1">*</span></label>
        <input
          id="email" name="email" type="email" inputMode="email" autoComplete="email" required
          {...ariaErr("email")}
          className={`${inputCls} ${errBorder("email")}`}
          placeholder="you@domain.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
          disabled={inFlight}
        />
        {fieldErrors.email && (
          <p id="email-error" className="mt-2 text-xs text-ignite">{fieldErrors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="vehicle" className={labelCls}>Vehicle (year / make / model)<span aria-hidden className="text-ignite ml-1">*</span></label>
        <input
          id="vehicle" name="vehicle" autoComplete="off" required
          {...ariaErr("vehicle")}
          className={`${inputCls} ${errBorder("vehicle")}`}
          placeholder="e.g., 2022 Aventador SVJ"
          value={vehicle}
          onChange={(e) => { setVehicle(e.target.value); clearError("vehicle"); }}
          disabled={inFlight}
        />
        {fieldErrors.vehicle && (
          <p id="vehicle-error" className="mt-2 text-xs text-ignite">{fieldErrors.vehicle}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className={labelCls}>Brief description<span aria-hidden className="text-ignite ml-1">*</span></label>
        <textarea
          id="description" name="description" rows={5} required
          {...ariaErr("description")}
          className={`${inputCls} ${errBorder("description")}`}
          placeholder="What happened? Where's the damage?"
          value={description}
          onChange={(e) => { setDescription(e.target.value); clearError("description"); }}
          disabled={inFlight}
        />
        {fieldErrors.description && (
          <p id="description-error" className="mt-2 text-xs text-ignite">{fieldErrors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="files" className={labelCls}>
          Photos (optional, up to {MAX_FILES})
        </label>
        <input
          id="files" name="files" type="file" accept="image/*" multiple
          {...ariaErr("files")}
          className={`${inputCls} ${errBorder("files")} file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-bone file:text-ink file:cursor-pointer`}
          onChange={handleFileSelect}
          disabled={inFlight}
        />
        {fieldErrors.files && (
          <p id="files-error" className="mt-2 text-xs text-ignite">{fieldErrors.files}</p>
        )}
        {!fieldErrors.files && files.length > 0 && (
          <p className="mt-2 text-xs text-bone/85">
            {files.length} file{files.length === 1 ? "" : "s"} selected
          </p>
        )}
      </div>

      {status.kind === "error" && (
        <p className="text-sm text-ignite" role="alert">{status.message}</p>
      )}
      {status.kind === "uploading" && (
        <p className="text-sm text-bone/85" aria-live="polite">
          Uploading photo {status.uploaded} of {status.total}…
        </p>
      )}
      {status.kind === "submitting" && (
        <p className="text-sm text-bone/85" aria-live="polite">Sending to Serge…</p>
      )}

      <Button variant="primary" type="submit" disabled={inFlight}>
        {inFlight ? "Sending…" : status.kind === "error" ? "Try again" : "Send to Serge"}
      </Button>
    </form>
  );
}
