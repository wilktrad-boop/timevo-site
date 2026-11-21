"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ETAPES, type Champ } from "@/lib/livret/contenu";
import {
  brouillonVide, restaurerBrouillon, construireLivret, nomFichier, couleurValide,
  CLE_BROUILLON, type LivretData,
} from "@/lib/livret/livret";
import Apercu from "./Apercu";
import { Arrow } from "../primitives";
import { CONTACT_HREF } from "@/lib/contact";

const LOGO_MAX = 1024 * 1024;

const label = { display: "block", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 6 } as const;
const champStyle = {
  width: "100%", boxSizing: "border-box", padding: "11px 13px", background: "var(--bg)", color: "var(--text)",
  border: "1px solid var(--border-strong)", borderRadius: 12, fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.5,
} as const;
const bouton = {
  display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 999, cursor: "pointer",
  fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600,
} as const;

function lire(): LivretData {
  try {
    const brut = window.localStorage.getItem(CLE_BROUILLON);
    return brut ? restaurerBrouillon(JSON.parse(brut)) : brouillonVide();
  } catch {
    return brouillonVide();
  }
}

const VIDE_JSON = JSON.stringify(brouillonVide());

function ecrire(data: LivretData) {
  try {
    const json = JSON.stringify(data);
    if (json === VIDE_JSON) window.localStorage.removeItem(CLE_BROUILLON);
    else window.localStorage.setItem(CLE_BROUILLON, json);
  } catch { /* stockage indisponible : pas de brouillon */ }
}

function ChampSaisie({ c, valeur, onChange }: { c: Champ; valeur: string; onChange: (v: string) => void }) {
  const id = `livret-${c.id}`;
  const commun = { id, name: c.id, value: valeur, placeholder: c.exemple, onChange: (e: { target: { value: string } }) => onChange(e.target.value), style: champStyle };
  return (
    <div>
      <label htmlFor={id} style={label}>
        {c.label}
        {c.type === "liste" && <span style={{ fontWeight: 400, color: "var(--dim)" }}> · une ligne par élément</span>}
      </label>
      {c.type === "court" ? <input type="text" maxLength={300} {...commun} /> : <textarea rows={c.type === "liste" ? 5 : 3} maxLength={4000} {...commun} />}
    </div>
  );
}

export default function Generateur() {
  const [data, setData] = useState<LivretData>(brouillonVide);
  const [charge, setCharge] = useState(false);
  const [etape, setEtape] = useState(0);
  const [onglet, setOnglet] = useState<"saisie" | "apercu">("saisie");
  const [erreurLogo, setErreurLogo] = useState("");
  const [pdfEtat, setPdfEtat] = useState<"idle" | "encours" | "erreur" | "ok">("idle");
  const [confirmeEffacer, setConfirmeEffacer] = useState(false);
  const haut = useRef<HTMLDivElement>(null);
  const logoInput = useRef<HTMLInputElement>(null);
  const viderLogoInput = () => { if (logoInput.current) logoInput.current.value = ""; };

  // Le brouillon n'est lu qu'après le montage : le rendu serveur reste identique au premier rendu client.
  useEffect(() => { setData(lire()); setCharge(true); }, []);
  useEffect(() => { if (charge) ecrire(data); }, [data, charge]);

  const livret = useMemo(() => construireLivret(data), [data]);
  const e = ETAPES[etape];
  const derniere = etape === ETAPES.length - 1;

  const maj = (id: string, v: string) => { setData(d => ({ ...d, valeurs: { ...d.valeurs, [id]: v } })); setConfirmeEffacer(false); };
  const aller = (i: number) => { setEtape(i); setPdfEtat("idle"); setConfirmeEffacer(false); haut.current?.scrollIntoView({ block: "start" }); };
  // Depuis l'aperçu : sur mobile, l'aperçu est un onglet, on revient au formulaire.
  const modifier = (i: number) => { setOnglet("saisie"); aller(i); };

  async function choisirLogo(fichier: File | undefined) {
    setErreurLogo("");
    if (!fichier) return;
    if (!["image/png", "image/jpeg"].includes(fichier.type)) { setErreurLogo("Format accepté : PNG ou JPG."); viderLogoInput(); return; }
    if (fichier.size > LOGO_MAX) { setErreurLogo("Le logo doit faire moins de 1 Mo."); viderLogoInput(); return; }
    // Le type déclaré vient du nom du fichier : on vérifie la signature réelle (PNG ou JPEG).
    const o = new Uint8Array(await fichier.slice(0, 4).arrayBuffer());
    const png = o[0] === 0x89 && o[1] === 0x50 && o[2] === 0x4e && o[3] === 0x47;
    const jpeg = o[0] === 0xff && o[1] === 0xd8 && o[2] === 0xff;
    if (!png && !jpeg) { setErreurLogo("Format accepté : PNG ou JPG."); viderLogoInput(); return; }
    const lecteur = new FileReader();
    lecteur.onload = () => {
      const dataUrl = String(lecteur.result);
      const img = new window.Image();
      img.onload = () => {
        if (img.naturalWidth > 0) setData(d => ({ ...d, marque: { ...d.marque, logo: dataUrl } }));
        else setErreurLogo("Le logo n'a pas pu être lu.");
      };
      img.onerror = () => setErreurLogo("Le logo n'a pas pu être lu.");
      img.src = dataUrl;
    };
    lecteur.onerror = () => setErreurLogo("Le logo n'a pas pu être lu.");
    lecteur.readAsDataURL(fichier);
    viderLogoInput();
  }

  async function telecharger() {
    setPdfEtat("encours");
    try {
      const { genererPdf } = await import("./LivretPdf");
      const blob = await genererPdf(livret);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = nomFichier(data);
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      setPdfEtat("ok");
    } catch (err) {
      console.error("[livret] génération PDF :", err);
      setPdfEtat("erreur");
    }
  }

  function effacer() {
    if (!confirmeEffacer) { setConfirmeEffacer(true); return; }
    try { window.localStorage.removeItem(CLE_BROUILLON); } catch { /* rien à effacer */ }
    setData(brouillonVide()); setErreurLogo(""); setPdfEtat("idle"); viderLogoInput(); setConfirmeEffacer(false); aller(0);
  }

  return (
    <div ref={haut} className="livret-gen rr-block" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 40, alignItems: "start" }}>
      <div className="livret-tabs" role="tablist" aria-label="Affichage" style={{ display: "none", gap: 8 }}>
        {(["saisie", "apercu"] as const).map(o => (
          <button key={o} type="button" role="tab" aria-selected={onglet === o} onClick={() => setOnglet(o)} style={{
            ...bouton, padding: "9px 16px", border: "1px solid var(--border-strong)",
            background: onglet === o ? "var(--card-soft)" : "transparent", color: "var(--text)",
          }}>{o === "saisie" ? "Remplir" : "Aperçu"}</button>
        ))}
      </div>

      <div className="livret-saisie" data-visible={onglet === "saisie"} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 24, padding: 28 }}>
        <ol aria-label="Étapes" style={{ display: "flex", flexWrap: "wrap", gap: 6, listStyle: "none", padding: 0, margin: "0 0 24px" }}>
          {ETAPES.map((x, i) => (
            <li key={x.id}>
              <button type="button" onClick={() => aller(i)} aria-current={i === etape ? "step" : undefined} style={{
                ...bouton, padding: "6px 12px", fontSize: 12, fontWeight: 500,
                border: `1px solid ${i === etape ? "var(--accent)" : "var(--border-strong)"}`,
                background: i === etape ? "var(--accent-tint)" : "transparent", color: "var(--text)",
              }}>{i + 1}. {x.titre}</button>
            </li>
          ))}
        </ol>

        <h2 style={{ fontFamily: "var(--font-sans)", fontSize: 26, fontWeight: 500, letterSpacing: "-0.03em", margin: "0 0 6px", color: "var(--text)" }}>{e.titre}</h2>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--dim)", margin: "0 0 24px" }}>{e.intro}</p>

        <form data-etape={e.id} onSubmit={ev => ev.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {etape === 0 && (
            <div className="livret-marque" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 140px", gap: 16 }}>
              <div>
                <label htmlFor="livret-logo" style={label}>Logo <span style={{ fontWeight: 400, color: "var(--dim)" }}>· PNG ou JPG, 1 Mo maximum</span></label>
                <input ref={logoInput} id="livret-logo" name="logo" type="file" accept="image/png,image/jpeg" onChange={ev => choisirLogo(ev.target.files?.[0])}
                  style={{ ...champStyle, padding: 9, fontSize: 13 }} />
                {erreurLogo && <p role="alert" style={{ color: "#ff8a8a", fontSize: 13, margin: "6px 0 0" }}>{erreurLogo}</p>}
                {data.marque.logo && (
                  <button type="button" onClick={() => { setData(d => ({ ...d, marque: { ...d.marque, logo: null } })); viderLogoInput(); }}
                    style={{ ...bouton, padding: "6px 0", border: "none", background: "none", color: "var(--accent-soft)", fontSize: 13 }}>Retirer le logo</button>
                )}
              </div>
              <div>
                <label htmlFor="livret-couleur" style={label}>Couleur</label>
                <input id="livret-couleur" name="couleur" type="color" value={data.marque.couleur}
                  onChange={ev => setData(d => ({ ...d, marque: { ...d.marque, couleur: couleurValide(ev.target.value) } }))}
                  style={{ ...champStyle, padding: 4, height: 46 }} />
              </div>
            </div>
          )}
          {e.champs.map(c => <ChampSaisie key={c.id} c={c} valeur={data.valeurs[c.id] ?? ""} onChange={v => maj(c.id, v)} />)}
        </form>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28, alignItems: "center" }}>
          {etape > 0 && (
            <button type="button" data-action="precedent" onClick={() => aller(etape - 1)}
              style={{ ...bouton, border: "1px solid var(--border-strong)", background: "transparent", color: "var(--text)" }}>Précédent</button>
          )}
          {!derniere ? (
            <button type="button" data-action="suivant" onClick={() => aller(etape + 1)}
              style={{ ...bouton, border: "none", background: "var(--accent-gradient)", color: "#fff" }}>Suivant <Arrow color="#fff" size={13} /></button>
          ) : (
            <button type="button" data-action="telecharger" onClick={telecharger} disabled={pdfEtat === "encours"}
              style={{ ...bouton, border: "none", background: "var(--accent-gradient)", color: "#fff", opacity: pdfEtat === "encours" ? 0.7 : 1 }}>
              {pdfEtat === "encours" ? "Préparation du PDF…" : "Télécharger mon livret (PDF)"}
            </button>
          )}
        </div>
        {pdfEtat === "erreur" && (
          <p role="alert" style={{ color: "#ff8a8a", fontSize: 14, margin: "14px 0 0" }}>
            Le PDF n&apos;a pas pu être généré. <button type="button" onClick={telecharger} style={{ background: "none", border: "none", color: "var(--accent-soft)", cursor: "pointer", padding: 0, fontSize: 14 }}>Réessayer</button>
          </p>
        )}
        {pdfEtat === "ok" && (
          <>
            <p role="status" style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--dim)", margin: "14px 0 0" }}>
              Votre livret est téléchargé. Il reste enregistré dans ce navigateur : vous pouvez revenir le modifier.
            </p>
            <div data-apres-telechargement style={{ background: "var(--card-soft)", border: "1px solid var(--border)", borderRadius: 16, padding: 20, marginTop: 16 }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.5, color: "var(--text)", margin: "0 0 14px" }}>
                Ce livret, chez les conciergeries qu&apos;on accompagne, devient un guide voyageur digital avec un assistant qui répond aux voyageurs. On en parle en 30 minutes ?
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
                <a href="/fr/automatisation-pour/conciergerie" style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: "var(--accent-soft)" }}>Voir l&apos;offre conciergerie</a>
                <a href={CONTACT_HREF} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: "var(--accent-soft)" }}>Réserver un diagnostic gratuit</a>
              </div>
            </div>
          </>
        )}
        <button type="button" data-action="effacer" onClick={effacer}
          style={{ ...bouton, marginTop: 20, padding: 0, border: "none", background: "none", color: "var(--dim)", fontSize: 13, fontWeight: 500 }}>
          {confirmeEffacer ? "Confirmer : tout effacer" : "Effacer mon brouillon"}
        </button>
      </div>

      <div className="livret-apercu" data-visible={onglet === "apercu"} style={{ position: "sticky", top: 96 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--dim-2)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
          Aperçu
        </div>
        <p data-aide-apercu style={{ fontFamily: "var(--font-sans)", fontSize: 13, lineHeight: 1.5, color: "var(--dim)", margin: "0 0 12px" }}>
          Le livret entier, toutes étapes confondues. En couleur : ce que vous remplissez à cette étape. Cliquez sur une rubrique pour la modifier.
        </p>
        <Apercu livret={livret} etapeActive={etape} nomsEtapes={ETAPES.map(x => x.titre)} onModifier={modifier} />
      </div>
    </div>
  );
}
