import type { ReactNode } from "react";
import { teinte, type BlocRendu, type LivretRendu } from "@/lib/livret/livret";

/**
 * Aperçu HTML du livret : mêmes blocs et même habillage que le PDF (LivretPdf).
 * Papier blanc, quel que soit le thème du site ; titres en Fraunces (@font-face « Livret Serif »).
 */
const INK = "#1F2A2E", DIM = "#66707A", LINE = "#E3E7E5";
const SERIF = "'Livret Serif', Georgia, serif";
const papier = {
  background: "#ffffff", color: INK, borderRadius: 12, overflow: "hidden",
  boxShadow: "0 1px 0 rgba(0,0,0,.04)", fontFamily: "Helvetica, Arial, sans-serif", fontSize: 13, lineHeight: 1.55,
} as const;
const surtitre = { fontWeight: 700, fontSize: 10.5, letterSpacing: ".14em", textTransform: "uppercase" } as const;

function Bloc({ b, couleur }: { b: BlocRendu; couleur: string }) {
  const titre = b.titre && <div style={{ ...surtitre, color: couleur, margin: "16px 0 8px" }}>{b.titre}</div>;
  if (b.type === "texte" && b.encadre) {
    return (
      <div style={{ background: teinte(couleur, 0.07), borderLeft: `3px solid ${couleur}`, borderRadius: 6, padding: "11px 14px", margin: "14px 0 10px" }}>
        {b.titre && <div style={{ ...surtitre, color: couleur, marginBottom: 4 }}>{b.titre}</div>}
        <p style={{ margin: 0, whiteSpace: "pre-line" }}>{b.texte}</p>
      </div>
    );
  }
  if (b.type === "tableau") {
    const carte = b.style === "carte";
    return (
      <div style={{ marginBottom: 10 }}>
        {titre}
        <table style={{ width: "100%", borderCollapse: "collapse", ...(carte ? { background: teinte(couleur, 0.07), borderRadius: 8 } : {}) }}>
          <tbody>
            {b.lignes.map((l, i) => (
              <tr key={`${i}-${l.label}`} style={carte ? undefined : { borderBottom: `1px solid ${LINE}` }}>
                <th style={{ textAlign: "left", width: "34%", fontWeight: 400, fontSize: 12, color: DIM, padding: carte ? "8px 10px 8px 16px" : "7px 10px 7px 0", verticalAlign: "top" }}>{l.label}</th>
                <td style={{ padding: carte ? "6px 16px 6px 0" : "6px 0", ...(carte && l.valeur.length <= 40 ? { fontWeight: 700, fontSize: 16 } : {}) }}>{l.valeur}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (b.type === "texte") return <div>{titre}<p style={{ margin: "0 0 8px", whiteSpace: "pre-line" }}>{b.texte}</p></div>;
  return (
    <div style={{ marginBottom: 6 }}>
      {titre}
      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {b.items.map((item, i) => (
          <li key={`${i}-${item}`} style={{ display: "flex", gap: 10, marginBottom: 4 }}>
            <span aria-hidden="true" style={b.style === "cases"
              ? { flex: "none", width: 11, height: 11, border: `1.5px solid ${couleur}`, borderRadius: 2, marginTop: 4 }
              : { flex: "none", width: 5, height: 5, borderRadius: 3, background: couleur, marginTop: 8 }} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Une rubrique de l'aperçu : un clic n'importe où ouvre l'étape où on la remplit
 * (le bouton « Modifier » porte la même action pour le clavier et les lecteurs d'écran).
 * La rubrique de l'étape en cours est mise en valeur.
 */
function Rubrique({ etape, active, nomEtape, couleur, onModifier, children }: {
  etape: number; active: boolean; nomEtape: string; couleur: string;
  onModifier: (etape: number) => void; children: ReactNode;
}) {
  return (
    <div className="apercu-rubrique" data-active={active} data-etape={etape} onClick={() => onModifier(etape)}
      style={{ ["--rubrique" as string]: couleur }}>
      <button type="button" className="apercu-modifier" onClick={ev => { ev.stopPropagation(); onModifier(etape); }}
        aria-label={`Modifier : étape ${nomEtape}`} style={{ color: couleur }}>
        {active ? "En cours" : "Modifier"}
      </button>
      {children}
    </div>
  );
}

export default function Apercu({ livret, etapeActive, nomsEtapes, onModifier }: {
  livret: LivretRendu; etapeActive: number; nomsEtapes: string[]; onModifier: (etape: number) => void;
}) {
  const { couverture: c, couleur } = livret;
  const props = (etape: number) => ({ etape, active: etape === etapeActive, nomEtape: nomsEtapes[etape], couleur, onModifier });
  return (
    <div data-apercu style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={papier}>
        {/* eslint-disable-next-line @next/next/no-img-element -- photo locale (data URL), jamais envoyée */}
        {livret.photo ? <img src={livret.photo} alt="Photo du logement" data-photo-couverture
          style={{ display: "block", width: "100%", aspectRatio: "595 / 300", objectFit: "cover" }} />
          : <div style={{ height: 120, background: couleur }} />}
        <div style={{ padding: "0 32px 32px" }}>
          <Rubrique {...props(0)}>
            {livret.logo && (
              <div style={{ width: 64, height: 64, marginTop: -42, padding: 7, boxSizing: "border-box", background: "#fff", borderRadius: 10, border: `1px solid ${LINE}` }}>
                {/* eslint-disable-next-line @next/next/no-img-element -- logo local (data URL), jamais envoyé */}
                <img src={livret.logo} alt="Logo de la conciergerie" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              </div>
            )}
            {c.surtitre && <div style={{ ...surtitre, color: couleur, margin: "18px 0 6px" }}>{c.surtitre}</div>}
            <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 30, lineHeight: 1.1, margin: c.surtitre ? "0 0 6px" : "18px 0 6px" }}>{c.titre}</div>
            <div style={{ color: DIM, fontSize: 15, marginBottom: 18 }}>{c.sousTitre}</div>
            {c.tableau.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", columnGap: 16, marginBottom: 16 }}>
                {c.tableau.map((l, i) => (
                  <div key={`${i}-${l.label}`} style={{ borderTop: `1px solid ${LINE}`, padding: "8px 0 10px" }}>
                    <div style={{ ...surtitre, fontSize: 9.5, color: DIM, marginBottom: 2 }}>{l.label}</div>
                    <div style={{ fontSize: 13, lineHeight: 1.4, overflowWrap: "anywhere" }}>{l.valeur}</div>
                  </div>
                ))}
              </div>
            )}
            {c.intro && <p style={{ margin: 0, fontStyle: "italic", whiteSpace: "pre-line", borderLeft: `2px solid ${couleur}`, paddingLeft: 12 }}>{c.intro}</p>}
          </Rubrique>
        </div>
      </div>
      {livret.sections.length > 0 && (
        <div style={{ ...papier, padding: "26px 32px 30px" }}>
          {livret.sections.map((sec, si) => (
            <Rubrique key={`${si}-${sec.titre}`} {...props(sec.etape)}>
              <section>
                <div style={{ ...surtitre, fontSize: 10, color: couleur, marginBottom: 2 }}>{String(si + 1).padStart(2, "0")}</div>
                <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 22, lineHeight: 1.2, borderBottom: `1px solid ${LINE}`, paddingBottom: 8, marginBottom: 6 }}>{sec.titre}</div>
                {sec.blocs.map((b, i) => <Bloc key={i} b={b} couleur={couleur} />)}
              </section>
            </Rubrique>
          ))}
        </div>
      )}
    </div>
  );
}
