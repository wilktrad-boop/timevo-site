"use client";

import { useActionState } from "react";
import { requestLivret, type LivretState } from "@/app/[locale]/ressources/livret-accueil-airbnb/actions";
import { LIVRET, LIVRET_FILES, LOGEMENTS_OPTIONS } from "@/lib/ressources";
import { Arrow } from "./primitives";

const F = LIVRET.form;

const label = {
  display: "block", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
  color: "var(--text)", marginBottom: 8,
} as const;

const input = {
  width: "100%", boxSizing: "border-box", padding: "12px 14px",
  background: "var(--bg)", color: "var(--text)",
  border: "1px solid var(--border-strong)", borderRadius: 12,
  fontFamily: "var(--font-sans)", fontSize: 15,
} as const;

const errorText = {
  fontFamily: "var(--font-sans)", fontSize: 13, color: "#ff8a8a", margin: "8px 0 0",
} as const;

export default function LivretForm() {
  const [state, action, pending] = useActionState<LivretState, FormData>(requestLivret, { status: "idle" });

  if (state.status === "ok") {
    return (
      <div role="status">
        <h3 style={{
          fontFamily: "var(--font-sans)", fontSize: 26, fontWeight: 500, letterSpacing: "-0.03em",
          margin: "0 0 12px", color: "var(--text)",
        }}>{F.successTitle}</h3>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.55, color: "var(--dim)", margin: "0 0 24px" }}>
          {F.successText}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {Object.values(LIVRET_FILES).map(file => (
            <a key={file.href} href={file.href} download className="hover-card" style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
              padding: "16px 20px", borderRadius: 14,
              border: "1px solid var(--border-strong)", background: "var(--card-soft)",
              color: "var(--text)", textDecoration: "none", fontFamily: "var(--font-sans)",
            }}>
              <span>
                <span style={{ display: "block", fontSize: 15, fontWeight: 600 }}>{file.label}</span>
                <span style={{ display: "block", fontSize: 12, color: "var(--dim)", marginTop: 2, fontFamily: "var(--font-mono)" }}>{file.meta}</span>
              </span>
              <Arrow size={14} />
            </a>
          ))}
        </div>
      </div>
    );
  }

  const err = state.status === "error" ? state : null;
  const v = err?.values;
  const msg = (field: "email" | "consent" | "logements") =>
    err?.field === field
      ? <p id={`livret-${field}-error`} style={errorText}>
          {field === "email" ? F.errorEmail : field === "consent" ? F.errorConsent : F.errorLogements}
        </p>
      : null;

  return (
    // La clé change à chaque erreur : le formulaire se remonte avec les valeurs renvoyées.
    <form key={err ? JSON.stringify(err.values) + err.field : "vide"} action={action} noValidate
      style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Champ piège pour les robots : hors écran, ignoré par les lecteurs d'écran. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label>Site web <input type="text" name="site" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div>
        <label htmlFor="livret-email" style={label}>{F.email}</label>
        <input id="livret-email" name="email" type="email" required autoComplete="email" inputMode="email"
          defaultValue={v?.email}
          aria-invalid={err?.field === "email"} aria-describedby={err?.field === "email" ? "livret-email-error" : undefined}
          style={input} />
        {msg("email")}
      </div>

      <div className="livret-row" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)", gap: 16 }}>
        <div>
          <label htmlFor="livret-company" style={label}>
            {F.company} <span style={{ fontWeight: 400, color: "var(--dim)" }}>· {F.companyHint}</span>
          </label>
          <input id="livret-company" name="company" type="text" autoComplete="organization" maxLength={120}
            defaultValue={v?.company} style={input} />
        </div>
        <div>
          <label htmlFor="livret-logements" style={label}>{F.logements}</label>
          <select id="livret-logements" name="logements" required defaultValue={v?.logements ?? ""}
            aria-invalid={err?.field === "logements"} aria-describedby={err?.field === "logements" ? "livret-logements-error" : undefined}
            style={input}>
            <option value="" disabled>{F.logementsPlaceholder}</option>
            {LOGEMENTS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          {msg("logements")}
        </div>
      </div>

      <div>
        <label style={{ display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}>
          <input name="consent" type="checkbox" required defaultChecked={v?.consent}
            aria-invalid={err?.field === "consent"} aria-describedby={err?.field === "consent" ? "livret-consent-error" : undefined}
            style={{ marginTop: 3, width: 16, height: 16, accentColor: "var(--accent)", flexShrink: 0 }} />
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, lineHeight: 1.5, color: "var(--dim)" }}>
            {F.consent}{" "}
            <a href="/fr/politique-de-confidentialite" style={{ color: "var(--accent-soft)" }}>{F.privacy}</a>.
          </span>
        </label>
        {msg("consent")}
      </div>

      <button type="submit" disabled={pending} style={{
        alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 10,
        padding: "14px 24px", borderRadius: 999, border: "none", cursor: pending ? "wait" : "pointer",
        background: "var(--accent-gradient)", color: "#fff",
        fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, opacity: pending ? 0.7 : 1,
      }}>
        {pending ? F.pending : F.submit} {!pending && <Arrow color="#fff" size={14} />}
      </button>
    </form>
  );
}
