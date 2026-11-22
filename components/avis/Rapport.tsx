"use client";

import { useState } from "react";
import type { Fiche, Rapport as RapportType } from "@/lib/avis/types";
import { CONTACT_HREF } from "@/lib/contact";

const carte = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, padding: 24 } as const;
const h3 = { fontFamily: "var(--font-sans)", fontSize: 20, fontWeight: 500, letterSpacing: "-0.02em", margin: "0 0 14px", color: "var(--text)" } as const;
const petit = { fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--dim)" } as const;
const virgule = (n: number) => n.toLocaleString("fr-FR", { maximumFractionDigits: 1 });

/** Conseil affiché (écran et PDF) quand la fiche n'a encore aucun avis. */
export const CONSEIL_SANS_AVIS =
  "Votre fiche n'a pas encore d'avis. Demandez-en un à chaque client satisfait, au moment où il vous remercie : un lien direct vers votre fiche, envoyé par SMS ou par email, suffit. Répondez ensuite à chacun, même brièvement.";

/** Titre des recommandations, accordé à leur nombre. */
export const titreRecommandations = (n: number) => (n >= 3 ? "Trois choses à faire" : n === 2 ? "Deux choses à faire" : "À faire");

/** Note sur 5 et nombre d'avis, en barres à l'échelle de la note. */
export function Comparaison({ fiche, concurrents }: { fiche: Fiche; concurrents: Fiche[] }) {
  const lignes = [{ f: fiche, moi: true }, ...concurrents.map(f => ({ f, moi: false }))];
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {lignes.map(({ f, moi }) => (
        <div key={f.placeId} data-comparaison-ligne className="avis-comparaison-ligne" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.4fr) auto", gap: 12, alignItems: "center", fontFamily: "var(--font-sans)", fontSize: 14 }}>
          <span style={{ color: moi ? "var(--text)" : "var(--dim)", fontWeight: moi ? 600 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{moi ? `${f.nom} (vous)` : f.nom}</span>
          <span aria-hidden="true" style={{ height: 10, borderRadius: 999, background: "var(--border)", overflow: "hidden" }}>
            <span style={{ display: "block", height: "100%", width: `${((f.note ?? 0) / 5) * 100}%`, borderRadius: 999, background: moi ? "var(--accent)" : "var(--dim)" }} />
          </span>
          <span style={{ color: moi ? "var(--text)" : "var(--dim)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
            {f.note === null ? "sans note" : `${virgule(f.note)} / 5`} · {f.nbAvis} avis
          </span>
        </div>
      ))}
    </div>
  );
}

function Copier({ texte, libelle }: { texte: string; libelle: string }) {
  const [etat, setEtat] = useState<"" | "ok" | "ko">("");
  async function copier() {
    try {
      await navigator.clipboard.writeText(texte);
      setEtat("ok");
    } catch {
      setEtat("ko");
    }
  }
  return (
    <button type="button" onClick={copier} aria-label={libelle} aria-live="polite"
      style={{ background: "none", border: "1px solid var(--border-strong)", borderRadius: 999, padding: "5px 12px", color: "var(--text)", fontFamily: "var(--font-sans)", fontSize: 13, cursor: "pointer" }}>
      {etat === "ok" ? "Copié" : etat === "ko" ? "Sélectionnez le texte pour le copier" : "Copier"}
    </button>
  );
}

export default function Rapport({ rapport: r }: { rapport: RapportType }) {
  const a = r.analyse;
  const reponses = new Map(a?.reponses.map(x => [x.avisId, x.texte]) ?? []);
  const chiffres = [
    { l: "Note Google", v: r.fiche.note === null ? "sans note" : `${virgule(r.fiche.note)} / 5` },
    { l: "Avis analysés", v: `${r.nbAvisAnalyses}${r.tronque ? " (les plus récents)" : ""}` },
    { l: "Taux de réponse", v: r.tauxReponse === null ? "sans objet" : `${r.tauxReponse} %` },
    { l: "Délai moyen de réponse", v: r.delaiMoyenJours === null ? "sans objet" : `${virgule(r.delaiMoyenJours)} j` },
  ];
  return (
    <div data-rapport style={{ display: "grid", gap: 16 }}>
      <div style={carte}>
        <div style={{ ...petit, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>Analyse de vos avis Google</div>
        <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(26px, 3.4vw, 36px)", fontWeight: 500, letterSpacing: "-0.03em", margin: "0 0 6px", color: "var(--text)" }}>{r.fiche.nom}</h2>
        <p style={{ ...petit, margin: "0 0 20px" }}>{r.fiche.adresse}</p>
        <div className="avis-chiffres" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 }}>
          {chiffres.map(c => (
            <div key={c.l} style={{ background: "var(--card-soft)", borderRadius: 14, padding: "14px 16px" }}>
              <div style={petit}>{c.l}</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 20, fontWeight: 500, color: "var(--text)", marginTop: 4 }}>{c.v}</div>
            </div>
          ))}
        </div>
      </div>

      {r.concurrents.length > 0 && (
        <div style={carte}><h3 style={h3}>Face à vos concurrents</h3><Comparaison fiche={r.fiche} concurrents={r.concurrents} /></div>
      )}

      {r.nbAvisAnalyses === 0 ? (
        <div style={carte}>
          <h3 style={h3}>Pas encore d&apos;avis à analyser</h3>
          <p style={{ ...petit, fontSize: 15, lineHeight: 1.6, margin: 0 }}>
            {CONSEIL_SANS_AVIS}
          </p>
        </div>
      ) : (
        <>
          <div style={carte}>
            <h3 style={h3}>Votre note sur les quatre derniers trimestres</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8 }}>
              {r.trimestres.map(t => (
                <div key={t.libelle} style={{ textAlign: "center", background: "var(--card-soft)", borderRadius: 12, padding: "10px 4px" }}>
                  <div style={petit}>{t.libelle}</div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 18, color: "var(--text)" }}>{t.note === null ? "–" : virgule(t.note)}</div>
                  <div style={{ ...petit, fontSize: 12 }}>{t.nb} avis</div>
                </div>
              ))}
            </div>
          </div>

          {a ? (
            <div className="avis-themes" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
              {[{ titre: "Ce que vos clients apprécient", themes: a.pointsForts }, { titre: "Ce qu'ils vous reprochent", themes: a.reproches }].map(bloc => (
                <div key={bloc.titre} style={carte}>
                  <h3 style={h3}>{bloc.titre}</h3>
                  {bloc.themes.length === 0 ? <p style={petit}>Rien de récurrent.</p> : bloc.themes.map((t, i) => (
                    <div key={`${i}-${t.titre}`} style={{ marginBottom: 14 }}>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{t.titre}</div>
                      {t.citations.map((c, j) => <p key={`${j}-${c}`} style={{ ...petit, fontStyle: "italic", margin: "4px 0 0" }}>« {c} »</p>)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div style={carte}><p style={{ ...petit, margin: 0 }}>L&apos;analyse détaillée n&apos;a pas pu être produite cette fois. Les chiffres ci-dessus restent exacts.</p></div>
          )}

          {r.sansReponse.length > 0 && (
            <div style={carte}>
              <h3 style={h3}>Vos avis sans réponse, avec une réponse prête</h3>
              <div style={{ display: "grid", gap: 14 }}>
                {r.sansReponse.map(av => (
                  <div key={av.id} data-avis-sans-reponse style={{ background: "var(--card-soft)", borderRadius: 14, padding: 16 }}>
                    <div style={{ ...petit, marginBottom: 6 }}>{av.note} / 5{av.date ? ` · ${new Date(av.date).toLocaleDateString("fr-FR")}` : ""}</div>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--dim)", fontStyle: "italic", margin: "0 0 10px" }}>{av.texte ? `« ${av.texte} »` : "(note sans commentaire)"}</p>
                    {reponses.get(av.id) && (
                      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap" }}>
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.55, color: "var(--text)", margin: 0, flex: "1 1 260px" }}>{reponses.get(av.id)}</p>
                        <Copier texte={reponses.get(av.id)!} libelle={`Copier la réponse à l'avis noté ${av.note} sur 5`} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {a && a.recommandations.length > 0 && (
            <div style={carte}>
              <h3 style={h3}>{titreRecommandations(a.recommandations.length)}</h3>
              <ol style={{ margin: 0, paddingLeft: 20, fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.6, color: "var(--text)" }}>
                {a.recommandations.map((x, i) => <li key={`${i}-${x}`} style={{ marginBottom: 8 }}>{x}</li>)}
              </ol>
            </div>
          )}
        </>
      )}

      <div data-rapport-offre style={{ ...carte, background: "var(--card-soft)" }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 16, lineHeight: 1.55, color: "var(--text)", margin: "0 0 14px" }}>
          Un agent IA peut rédiger chaque jour la réponse à chaque nouvel avis ; vous la validez en un clic. On en parle en 30 minutes ?
        </p>
        <a href={CONTACT_HREF} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "var(--accent-soft)" }}>Réserver un diagnostic gratuit</a>
      </div>
    </div>
  );
}
