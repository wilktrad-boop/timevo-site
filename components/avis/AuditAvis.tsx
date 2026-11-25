"use client";

import { useEffect, useRef, useState } from "react";
import {
  rechercherFiches, comparerFiche, demanderCodeAvis, validerCodeAvis, lancerAudit, suivreAudit, envoyerRapportPdf,
} from "@/app/[locale]/ressources/repondre-avis-google/actions";
import type { Fiche, Rapport as RapportType } from "@/lib/avis/types";
import RapportVue, { Comparaison } from "./Rapport";
import { Arrow } from "../primitives";

const CLE_ACCES = "timevo-avis-acces-v1";
type Acces = { email: string; acces: string };
type Etape = "recherche" | "choix" | "apercu" | "email" | "code" | "analyse" | "rapport";

const label = { display: "block", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 8 } as const;
const input = {
  width: "100%", boxSizing: "border-box", padding: "12px 14px", background: "var(--bg)", color: "var(--text)",
  border: "1px solid var(--border-strong)", borderRadius: 12, fontFamily: "var(--font-sans)", fontSize: 15,
} as const;
const bouton = {
  alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 24px", borderRadius: 999,
  border: "none", cursor: "pointer", background: "var(--accent-gradient)", color: "#fff",
  fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600,
} as const;
const lien = { background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--accent-soft)" } as const;
const erreurStyle = { fontFamily: "var(--font-sans)", fontSize: 14, color: "#ff8a8a", margin: 0 } as const;
const cadre = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: 24, padding: 28 } as const;

const MESSAGES = {
  indisponible: "L'analyse est momentanément indisponible. Réessayez plus tard.",
  limite: "Vous avez atteint la limite d'analyses pour aujourd'hui. Réessayez demain, ou parlons-en lors d'un diagnostic gratuit.",
  erreur: "Une erreur est survenue. Réessayez dans un instant.",
};

function lireAcces(): Acces | null {
  try {
    const a = JSON.parse(window.localStorage.getItem(CLE_ACCES) ?? "null");
    return a && typeof a.email === "string" && typeof a.acces === "string" ? a : null;
  } catch { return null; }
}
function ecrireAcces(a: Acces | null) {
  try { if (a) window.localStorage.setItem(CLE_ACCES, JSON.stringify(a)); else window.localStorage.removeItem(CLE_ACCES); } catch { /* accès redemandé */ }
}

export default function AuditAvis() {
  const [etape, setEtape] = useState<Etape>("recherche");
  const [nom, setNom] = useState("");
  const [ville, setVille] = useState("");
  const [fiches, setFiches] = useState<Fiche[]>([]);
  const [fiche, setFiche] = useState<Fiche | null>(null);
  const [concurrents, setConcurrents] = useState<Fiche[]>([]);
  const [acces, setAcces] = useState<Acces | null>(null);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [jeton, setJeton] = useState("");
  const [code, setCode] = useState("");
  const [erreur, setErreur] = useState("");
  const [occupe, setOccupe] = useState(false);
  const [debut, setDebut] = useState(0);
  const [secondes, setSecondes] = useState(0);
  const [rapport, setRapport] = useState<RapportType | null>(null);
  const [envoi, setEnvoi] = useState<"aucun" | "encours" | "ok" | "echec">("aucun");
  const pdf = useRef<Blob | null>(null);
  // Analyse en cours : le serveur n'envoie le PDF qu'une fois par analyse terminée.
  const auditEnCours = useRef("");
  const haut = useRef<HTMLDivElement>(null);
  const tourEnCours = useRef(0);

  useEffect(() => { setAcces(lireAcces()); }, []);
  useEffect(() => () => { tourEnCours.current++; }, []);

  async function rechercher(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    if (nom.trim().length < 2 || ville.trim().length < 2) { setErreur("Indiquez le nom de votre entreprise et sa ville."); return; }
    setOccupe(true);
    const r = await rechercherFiches(nom, ville).catch(() => ({ etat: "erreur" as const }));
    setOccupe(false);
    if (r.etat !== "ok") { setErreur(MESSAGES[r.etat]); return; }
    if (!r.fiches.length) { setErreur("Aucune fiche trouvée. Vérifiez le nom exact de votre entreprise sur Google et la ville."); return; }
    setFiches(r.fiches);
    setEtape("choix");
  }

  async function choisir(f: Fiche) {
    setErreur("");
    setOccupe(true);
    const r = await comparerFiche(f, ville).catch(() => ({ etat: "erreur" as const }));
    setOccupe(false);
    if (r.etat !== "ok") { setErreur(MESSAGES[r.etat]); return; }
    setFiche(f);
    setConcurrents(r.concurrents);
    setEtape("apercu");
  }

  async function lancer(a: Acces) {
    if (!fiche) return;
    setErreur("");
    setOccupe(true);
    const r = await lancerAudit(a.acces, fiche, concurrents).catch(() => ({ etat: "erreur" as const }));
    setOccupe(false);
    if (r.etat === "acces") { ecrireAcces(null); setAcces(null); setEtape("email"); return; }
    if (r.etat !== "lance") { setEtape("apercu"); setErreur(MESSAGES[r.etat]); return; }
    const jeton = ++tourEnCours.current;
    auditEnCours.current = r.auditId;
    setDebut(Date.now());
    setEtape("analyse");
    haut.current?.scrollIntoView({ block: "start" });
    suivre(a, r.auditId, jeton);
  }

  function suivre(a: Acces, auditId: string, jeton: number) {
    const limite = Date.now() + 5 * 60 * 1000;
    let echecs = 0;
    const abandon = () => {
      setErreur("L'analyse ne répond pas. Vérifiez votre connexion et réessayez dans quelques minutes.");
      setEtape(fiche ? "apercu" : "recherche");
    };
    const tour = async () => {
      if (jeton !== tourEnCours.current) return;
      if (Date.now() > limite) { abandon(); return; }
      let reseau = true;
      const r = await suivreAudit(a.acces, auditId).then(x => { reseau = false; return x; }).catch(() => ({ etat: "encours" as const }));
      if (jeton !== tourEnCours.current) return;
      if (reseau) {
        echecs++;
        if (echecs >= 6) { abandon(); return; }
      } else echecs = 0;
      if (r.etat === "encours") { setTimeout(tour, 5000); return; }
      if (r.etat === "pret") { setRapport(r.rapport); setEtape("rapport"); envoyer(a, r.rapport, jeton); return; }
      setErreur(r.etat === "indisponible" ? MESSAGES.indisponible : r.message);
      setEtape(fiche ? "apercu" : "recherche");
    };
    setTimeout(tour, 3000);
  }

  async function envoyer(a: Acces, r: RapportType, jeton: number) {
    setEnvoi("encours");
    try {
      const { genererPdfRapport, nomFichierRapport } = await import("./RapportPdf");
      if (jeton !== tourEnCours.current) return;
      const blob = await genererPdfRapport(r);
      if (jeton !== tourEnCours.current) return;
      pdf.current = blob;
      const fd = new FormData();
      fd.append("acces", a.acces);
      fd.append("auditId", auditEnCours.current);
      fd.append("pdf", new File([blob], nomFichierRapport(r), { type: "application/pdf" }));
      const res = await envoyerRapportPdf(fd);
      if (jeton !== tourEnCours.current) return;
      setEnvoi(res.ok ? "ok" : "echec");
    } catch (err) {
      console.error("[avis] PDF :", err);
      if (jeton !== tourEnCours.current) return;
      setEnvoi("echec");
    }
  }

  async function telecharger() {
    if (!rapport) return;
    try {
      const { genererPdfRapport, nomFichierRapport } = await import("./RapportPdf");
      const blob = pdf.current ?? (await genererPdfRapport(rapport));
      const url = URL.createObjectURL(blob);
      const lienDl = document.createElement("a");
      lienDl.href = url; lienDl.download = nomFichierRapport(rapport);
      document.body.appendChild(lienDl); lienDl.click(); lienDl.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch (err) {
      console.error("[avis] PDF :", err);
      setErreur("Le PDF n'a pas pu être généré. Réessayez.");
    }
  }

  async function demanderCode(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    setOccupe(true);
    const r = await demanderCodeAvis(email, consent, fiche?.nom ?? "").catch(() => ({ etat: "erreur" as const, champ: "envoi" as const }));
    setOccupe(false);
    if (r.etat === "indisponible") { setErreur(MESSAGES.indisponible); return; }
    if (r.etat === "erreur") {
      if (r.champ === "limite") { setErreur("Vous avez demandé trop de codes aujourd'hui. Réessayez demain, ou parlons-en lors d'un diagnostic gratuit."); return; }
      setErreur(r.champ === "email" ? "Indiquez une adresse email valide." : r.champ === "consent" ? "Cochez la case pour recevoir votre analyse." : "Le code n'a pas pu être envoyé. Vérifiez votre adresse, ou réessayez dans un instant.");
      return;
    }
    setJeton(r.jeton);
    setCode("");
    setErreur("");
    setEtape("code");
  }

  async function validerCode(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    setOccupe(true);
    const r = await validerCodeAvis(jeton, code).catch(() => ({ etat: "erreur" as const, message: MESSAGES.erreur }));
    setOccupe(false);
    if (r.etat === "indisponible") { setErreur(MESSAGES.indisponible); return; }
    if (r.etat === "erreur") { setErreur(r.message); return; }
    const a = { email: r.email, acces: r.acces };
    ecrireAcces(a);
    setAcces(a);
    await lancer(a);
  }

  useEffect(() => {
    if (etape !== "analyse") return;
    const t = setInterval(() => setSecondes(Math.round((Date.now() - debut) / 1000)), 1000);
    return () => clearInterval(t);
  }, [etape, debut]);

  const recommencer = () => {
    tourEnCours.current++;
    setEtape("recherche"); setFiche(null); setFiches([]); setConcurrents([]); setRapport(null); setErreur("");
    setEnvoi("aucun"); setJeton(""); setCode(""); setOccupe(false); pdf.current = null; auditEnCours.current = "";
    haut.current?.scrollIntoView({ block: "start" });
  };
  const erreurBloc = erreur ? <p role="alert" style={erreurStyle}>{erreur}</p> : null;

  return (
    <div ref={haut} className="rr-block" style={{ display: "grid", gap: 16 }}>
      {etape === "recherche" && (
        <form data-avis-recherche onSubmit={rechercher} noValidate style={{ ...cadre, display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="livret-row" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)", gap: 16 }}>
            <div>
              <label htmlFor="avis-nom" style={label}>Nom de votre entreprise</label>
              <input id="avis-nom" name="nom" value={nom} onChange={e => setNom(e.target.value)} placeholder="Atelier Cuisines" maxLength={120} autoComplete="organization" style={input} />
            </div>
            <div>
              <label htmlFor="avis-ville" style={label}>Ville</label>
              <input id="avis-ville" name="ville" value={ville} onChange={e => setVille(e.target.value)} placeholder="Annecy" maxLength={80} autoComplete="address-level2" style={input} />
            </div>
          </div>
          {erreurBloc}
          <button type="submit" disabled={occupe} style={{ ...bouton, opacity: occupe ? 0.7 : 1 }}>
            {occupe ? "Recherche…" : "Trouver ma fiche Google"} {!occupe && <Arrow color="#fff" size={14} />}
          </button>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--dim)", margin: 0 }}>Gratuit. L&apos;aperçu s&apos;affiche sans inscription.</p>
        </form>
      )}

      {etape === "choix" && (
        <div style={{ ...cadre, display: "grid", gap: 12 }}>
          <h2 style={{ fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 500, margin: 0, color: "var(--text)" }}>Quelle est votre fiche ?</h2>
          {fiches.map(f => (
            <button key={f.placeId} type="button" data-fiche onClick={() => choisir(f)} disabled={occupe} className="hover-card" style={{
              textAlign: "left", padding: "14px 18px", borderRadius: 14, border: "1px solid var(--border-strong)", background: "var(--card-soft)", color: "var(--text)", cursor: "pointer", fontFamily: "var(--font-sans)",
            }}>
              <span style={{ display: "block", fontSize: 15, fontWeight: 600 }}>{f.nom}</span>
              <span style={{ display: "block", fontSize: 13, color: "var(--dim)" }}>{f.adresse}{f.categorie ? ` · ${f.categorie}` : ""}</span>
            </button>
          ))}
          {erreurBloc}
          <button type="button" onClick={recommencer} style={lien}>Ce n&apos;est aucune de celles-ci</button>
        </div>
      )}

      {etape === "apercu" && fiche && (
        <div data-apercu-avis style={{ ...cadre, display: "grid", gap: 18 }}>
          <h2 style={{ fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 500, margin: 0, color: "var(--text)" }}>
            {concurrents.length ? "Votre note face à vos concurrents" : "Votre note Google"}
          </h2>
          <Comparaison fiche={fiche} concurrents={concurrents} />
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.55, color: "var(--dim)", margin: 0 }}>
            L&apos;analyse complète lit tous vos avis : ce que vos clients apprécient et vous reprochent, votre taux de réponse, et une réponse prête pour chaque avis resté sans réponse. Vous la recevez aussi en PDF.
          </p>
          {erreurBloc}
          <button type="button" data-action="analyser" disabled={occupe} onClick={() => (acces ? lancer(acces) : setEtape("email"))} style={{ ...bouton, opacity: occupe ? 0.7 : 1 }}>
            {occupe ? "Lancement…" : "Obtenir l'analyse complète"} {!occupe && <Arrow color="#fff" size={14} />}
          </button>
          {acces && (
            <p data-avis-adresse style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--dim)", margin: 0 }}>
              Analyse envoyée à <strong style={{ color: "var(--text)" }}>{acces.email}</strong>.{" "}
              <button type="button" onClick={() => { ecrireAcces(null); setAcces(null); }} disabled={occupe} style={lien}>Changer d&apos;adresse</button>
            </p>
          )}
          <button type="button" onClick={recommencer} style={lien}>Chercher une autre entreprise</button>
        </div>
      )}

      {(etape === "email" || etape === "code") && (
        <div data-avis-acces style={{ ...cadre, display: "grid", gap: 18, maxWidth: 640 }}>
          <h2 style={{ fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 500, margin: 0, color: "var(--text)" }}>
            {etape === "email" ? "Où envoyer votre analyse ?" : "Votre code."}
          </h2>
          {etape === "email" ? (
            <form onSubmit={demanderCode} noValidate style={{ display: "grid", gap: 18 }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.55, color: "var(--dim)", margin: 0 }}>Vous y recevrez un code pour lancer l&apos;analyse, puis le rapport en PDF.</p>
              <div>
                <label htmlFor="avis-email" style={label}>Email professionnel</label>
                <input id="avis-email" name="email" type="email" inputMode="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} style={input} />
              </div>
              <label style={{ display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}>
                <input name="consent" type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} style={{ marginTop: 3, width: 16, height: 16, accentColor: "var(--accent)", flexShrink: 0 }} />
                <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, lineHeight: 1.5, color: "var(--dim)" }}>
                  J&apos;accepte que Timevo utilise ces informations pour m&apos;envoyer mon analyse et me recontacter au sujet de mon entreprise. Je peux m&apos;y opposer à tout moment.{" "}
                  <a href="/fr/politique-de-confidentialite" style={{ color: "var(--accent-soft)" }}>Politique de confidentialité</a>.
                </span>
              </label>
              {erreurBloc}
              <button type="submit" disabled={occupe} style={{ ...bouton, opacity: occupe ? 0.7 : 1 }}>{occupe ? "Envoi…" : "Recevoir mon code"} {!occupe && <Arrow color="#fff" size={14} />}</button>
            </form>
          ) : (
            <form onSubmit={validerCode} noValidate style={{ display: "grid", gap: 18 }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.55, color: "var(--dim)", margin: 0 }}>
                Nous venons d&apos;envoyer un code à 6 chiffres à <strong style={{ color: "var(--text)" }}>{email}</strong>. Pensez à regarder dans les indésirables.
              </p>
              <div>
                <label htmlFor="avis-code" style={label}>Code reçu par email</label>
                <input id="avis-code" name="code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={e => setCode(e.target.value)} autoFocus style={{ ...input, maxWidth: 220, fontSize: 22, letterSpacing: "0.3em" }} />
              </div>
              {erreurBloc}
              <button type="submit" disabled={occupe} style={{ ...bouton, opacity: occupe ? 0.7 : 1 }}>{occupe ? "Vérification…" : "Lancer l'analyse"} {!occupe && <Arrow color="#fff" size={14} />}</button>
              <button type="button" onClick={() => { setErreur(""); setEtape("email"); }} style={lien}>Changer d&apos;adresse ou recevoir un nouveau code</button>
            </form>
          )}
        </div>
      )}

      {etape === "analyse" && (
        <div data-avis-progression role="status" style={{ ...cadre, display: "grid", gap: 12 }}>
          <h2 style={{ fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 500, margin: 0, color: "var(--text)" }}>Analyse en cours</h2>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--dim)", margin: 0 }}>
            {secondes < 20 ? "Récupération de vos avis Google…" : secondes < 60 ? "Lecture de vos avis…" : "Rédaction des réponses…"} Cela prend environ une minute.
          </p>
          <div style={{ height: 6, borderRadius: 999, background: "var(--border)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min(95, (secondes / 90) * 100)}%`, background: "var(--accent-gradient)", transition: "width 1s linear" }} />
          </div>
        </div>
      )}

      {etape === "rapport" && rapport && (
        <>
          <div data-avis-envoi data-etat={envoi} role="status" style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between", fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--dim)" }}>
            <span>
              {envoi === "encours" && "Préparation du PDF et envoi par email…"}
              {envoi === "ok" && <>Le rapport vous a été envoyé en PDF à <strong style={{ color: "var(--text)" }}>{acces?.email}</strong>.</>}
              {envoi === "echec" && "L'envoi par email n'a pas abouti : téléchargez le PDF ci-contre."}
            </span>
            <span style={{ display: "flex", gap: 16 }}>
              <button type="button" onClick={telecharger} style={lien}>Télécharger le PDF</button>
              <button type="button" onClick={recommencer} style={lien}>Analyser une autre entreprise</button>
            </span>
          </div>
          {erreurBloc}
          <RapportVue rapport={rapport} />
        </>
      )}
    </div>
  );
}
