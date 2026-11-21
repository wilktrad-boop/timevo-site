"use client";

import { useActionState, useEffect, useState } from "react";
import {
  demanderCode, validerCode, type AccesState, type CodeState,
} from "@/app/[locale]/ressources/livret-accueil-airbnb/creer/actions";
import { LIVRET, LOGEMENTS_OPTIONS, GENERATEUR } from "@/lib/ressources";
import { Arrow } from "../primitives";

/** Ce que le générateur garde dans le navigateur une fois l'accès ouvert. */
export type Acces = { email: string; acces: string | null };

const F = LIVRET.form;
const A = GENERATEUR.acces;

const label = { display: "block", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 8 } as const;
const input = {
  width: "100%", boxSizing: "border-box", padding: "12px 14px", background: "var(--bg)", color: "var(--text)",
  border: "1px solid var(--border-strong)", borderRadius: 12, fontFamily: "var(--font-sans)", fontSize: 15,
} as const;
const erreur = { fontFamily: "var(--font-sans)", fontSize: 13, color: "#ff8a8a", margin: "8px 0 0" } as const;
const bouton = (pending: boolean) => ({
  alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 24px", borderRadius: 999,
  border: "none", cursor: pending ? "wait" : "pointer", background: "var(--accent-gradient)", color: "#fff",
  fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, opacity: pending ? 0.7 : 1,
}) as const;

function EtapeCode({ email, jeton, onOuvert, onRecommencer }: {
  email: string; jeton: string; onOuvert: (a: Acces) => void; onRecommencer: () => void;
}) {
  const [state, action, pending] = useActionState<CodeState, FormData>(validerCode, { status: "idle" });
  useEffect(() => { if (state.status === "ouvert") onOuvert({ email: state.email, acces: state.acces }); }, [state, onOuvert]);
  return (
    <form action={action} noValidate style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.55, color: "var(--dim)", margin: 0 }}>
        {A.codeEnvoye} <strong style={{ color: "var(--text)" }}>{email}</strong>. {A.codeAide}
      </p>
      <input type="hidden" name="jeton" value={jeton} />
      <div>
        <label htmlFor="livret-code" style={label}>{A.codeLabel}</label>
        <input id="livret-code" name="code" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6}
          pattern="[0-9]{6}" required autoFocus aria-invalid={state.status === "erreur"}
          aria-describedby={state.status === "erreur" ? "livret-code-error" : undefined}
          style={{ ...input, maxWidth: 220, fontSize: 22, letterSpacing: "0.3em" }} />
        {state.status === "erreur" && <p id="livret-code-error" role="alert" style={erreur}>{state.message}</p>}
      </div>
      <button type="submit" disabled={pending} style={bouton(pending)}>
        {pending ? F.pending : A.ouvrir} {!pending && <Arrow color="#fff" size={14} />}
      </button>
      <button type="button" onClick={onRecommencer} style={{
        alignSelf: "flex-start", background: "none", border: "none", padding: 0, cursor: "pointer",
        fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--accent-soft)",
      }}>{A.autreAdresse}</button>
    </form>
  );
}

/** Écran d'entrée du générateur : email, puis code reçu à cette adresse. */
export default function AccesGenerateur({ onOuvert }: { onOuvert: (a: Acces) => void }) {
  const [state, action, pending] = useActionState<AccesState, FormData>(demanderCode, { status: "idle" });
  const [recommencer, setRecommencer] = useState(false);

  useEffect(() => { if (state.status === "ouvert") onOuvert({ email: state.email, acces: state.acces }); }, [state, onOuvert]);

  const err = state.status === "erreur" ? state : null;
  const v = err?.valeurs;
  const message = (champ: "email" | "logements" | "consent") => err?.champ === champ
    ? <p id={`acces-${champ}-error`} style={erreur}>{champ === "email" ? F.errorEmail : champ === "consent" ? A.errorConsent : F.errorLogements}</p>
    : null;

  return (
    <div data-acces style={{ maxWidth: 640, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 24, padding: 32 }}>
      <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(24px, 3vw, 30px)", fontWeight: 500, letterSpacing: "-0.03em", margin: "0 0 10px", color: "var(--text)" }}>
        {state.status === "code" && !recommencer ? A.codeH2 : A.h2}
      </h2>
      {state.status === "code" && !recommencer ? (
        <EtapeCode email={state.email} jeton={state.jeton} onOuvert={onOuvert} onRecommencer={() => setRecommencer(true)} />
      ) : (
        <form key={err ? JSON.stringify(err.valeurs) + err.champ : "vide"} action={fd => { setRecommencer(false); action(fd); }} noValidate
          style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.55, color: "var(--dim)", margin: 0 }}>{A.texte}</p>
          {/* Champ piège pour les robots : hors écran, ignoré par les lecteurs d'écran. */}
          <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
            <label>Site web <input type="text" name="site" tabIndex={-1} autoComplete="off" /></label>
          </div>
          <div>
            <label htmlFor="acces-email" style={label}>{F.email}</label>
            <input id="acces-email" name="email" type="email" required autoComplete="email" inputMode="email" defaultValue={v?.email}
              aria-invalid={err?.champ === "email"} aria-describedby={err?.champ === "email" ? "acces-email-error" : undefined} style={input} />
            {message("email")}
          </div>
          <div className="livret-row" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)", gap: 16 }}>
            <div>
              <label htmlFor="acces-conciergerie" style={label}>{F.company} <span style={{ fontWeight: 400, color: "var(--dim)" }}>· {F.companyHint}</span></label>
              <input id="acces-conciergerie" name="conciergerie" type="text" autoComplete="organization" maxLength={120} defaultValue={v?.conciergerie} style={input} />
            </div>
            <div>
              <label htmlFor="acces-logements" style={label}>{F.logements}</label>
              <select id="acces-logements" name="logements" required defaultValue={v?.logements ?? ""}
                aria-invalid={err?.champ === "logements"} aria-describedby={err?.champ === "logements" ? "acces-logements-error" : undefined} style={input}>
                <option value="" disabled>{F.logementsPlaceholder}</option>
                {LOGEMENTS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              {message("logements")}
            </div>
          </div>
          <div>
            <label style={{ display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}>
              <input name="consent" type="checkbox" required defaultChecked={v?.consent}
                aria-invalid={err?.champ === "consent"} aria-describedby={err?.champ === "consent" ? "acces-consent-error" : undefined}
                style={{ marginTop: 3, width: 16, height: 16, accentColor: "var(--accent)", flexShrink: 0 }} />
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, lineHeight: 1.5, color: "var(--dim)" }}>
                {A.consent}{" "}<a href="/fr/politique-de-confidentialite" style={{ color: "var(--accent-soft)" }}>{F.privacy}</a>.
              </span>
            </label>
            {message("consent")}
          </div>
          {err?.champ === "envoi" && <p role="alert" style={erreur}>{A.errorEnvoi}</p>}
          <button type="submit" disabled={pending} style={bouton(pending)}>
            {pending ? F.pending : A.submit} {!pending && <Arrow color="#fff" size={14} />}
          </button>
        </form>
      )}
    </div>
  );
}
