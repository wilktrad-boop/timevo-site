import type { BlocRendu, LivretRendu } from "@/lib/livret/livret";

/** Aperçu HTML du livret : mêmes blocs que le PDF (construireLivret). Papier blanc, quel que soit le thème du site. */
const papier = {
  background: "#ffffff", color: "#1F2A2E", borderRadius: 12, padding: "36px 32px",
  boxShadow: "0 1px 0 rgba(0,0,0,.04)", fontFamily: "Helvetica, Arial, sans-serif", fontSize: 13, lineHeight: 1.5,
} as const;

function Bloc({ b, couleur }: { b: BlocRendu; couleur: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      {b.titre && <div style={{ fontWeight: 700, color: couleur, margin: "12px 0 6px" }}>{b.titre}</div>}
      {b.type === "tableau" && (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <tbody>
            {b.lignes.map((l, i) => (
              <tr key={`${i}-${l.label}`}>
                <th style={{ textAlign: "left", width: "34%", background: "#F1F4F3", border: "1px solid #D5DCD9", padding: "6px 8px", verticalAlign: "top" }}>{l.label}</th>
                <td style={{ border: "1px solid #D5DCD9", padding: "6px 8px" }}>{l.valeur}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {b.type === "texte" && <p style={{ margin: "0 0 6px", whiteSpace: "pre-line" }}>{b.texte}</p>}
      {b.type === "liste" && (
        <ul style={{ margin: 0, paddingLeft: b.style === "cases" ? 0 : 18, listStyle: b.style === "cases" ? "none" : "disc" }}>
          {b.items.map((item, i) => (
            <li key={`${i}-${item}`} style={{ marginBottom: 3 }}>
              {b.style === "cases" && <span aria-hidden="true" style={{ display: "inline-block", width: 10, height: 10, border: "1px solid #1F2A2E", marginRight: 8 }} />}
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Apercu({ livret }: { livret: LivretRendu }) {
  const { couverture: c, couleur } = livret;
  return (
    <div data-apercu style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={papier}>
        {/* eslint-disable-next-line @next/next/no-img-element -- logo local (data URL), jamais envoyé */}
        {livret.logo && <img src={livret.logo} alt="Logo de la conciergerie" style={{ maxWidth: 140, maxHeight: 56, objectFit: "contain", marginBottom: 24 }} />}
        {c.surtitre && <div style={{ fontWeight: 700, fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: couleur, marginBottom: 8 }}>{c.surtitre}</div>}
        <div style={{ fontWeight: 700, fontSize: 28, lineHeight: 1.1, marginBottom: 8 }}>{c.titre}</div>
        <div style={{ color: "#5B6670", fontSize: 15, marginBottom: 20 }}>{c.sousTitre}</div>
        {c.tableau.length > 0 && <Bloc b={{ type: "tableau", lignes: c.tableau }} couleur={couleur} />}
        {c.intro && <p style={{ margin: "14px 0 0", whiteSpace: "pre-line" }}>{c.intro}</p>}
      </div>
      {livret.sections.length > 0 && (
        <div style={papier}>
          {livret.sections.map((sec, si) => (
            <section key={`${si}-${sec.titre}`} style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 18, borderBottom: `2px solid ${couleur}`, paddingBottom: 4, marginBottom: 8 }}>{sec.titre}</div>
              {sec.blocs.map((b, i) => <Bloc key={i} b={b} couleur={couleur} />)}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
