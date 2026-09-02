import { getTranslations } from "next-intl/server";

/**
 * Bandeau de trois repères, juste sous le hero.
 *
 * Il remplace l'ancien StatsBlock, qui animait des compteurs : « 0 », « 24/7 »
 * et « J+21 » ne se comptent pas, et faire monter un compteur jusqu'à zéro n'a
 * pas de sens. Les trois valeurs sont posées, sans mouvement.
 *
 * Le « 0 » se lit mal seul en gros corps — on croit à une valeur manquante.
 * Sa légende commence donc par le nom de la chose comptée, « relance
 * oubliée », pour que la ligne se lise d'un bloc.
 */
export default async function StatsBand() {
  const t = await getTranslations("band");
  const items = t.raw("items") as { big: string; cap: string }[];

  return (
    <section style={{ padding: "8px 28px 72px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          className="band-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 32 }}
        >
          {items.map(({ big, cap }) => (
            <div key={big} style={{ padding: "26px 0", borderTop: "1px solid var(--border-strong)" }}>
              <div style={{
                fontFamily: "var(--font-sans)", fontSize: "clamp(40px, 5vw, 72px)",
                fontWeight: 500, letterSpacing: "-0.05em", lineHeight: 0.95,
                color: "var(--accent)",
              }}>
                {big}
              </div>
              <p style={{
                fontFamily: "var(--font-sans)", fontSize: 14.5, lineHeight: 1.5,
                color: "var(--dim)", margin: 0, marginTop: 14, maxWidth: 320,
              }}>
                {cap}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
