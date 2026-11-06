import { getTranslations } from "next-intl/server";

/**
 * Bandeau de trois repères, juste sous le hero.
 *
 * « 0 », « 24/7 » et « J+21 » ne se comptent pas : les trois valeurs sont
 * posées, sans mouvement, en texte principal. Le « 0 » se lit mal seul en gros
 * corps — sa légende commence donc par le nom de la chose comptée.
 */
export default async function StatsBand() {
  const t = await getTranslations("band");
  const items = t.raw("items") as { big: string; cap: string }[];

  return (
    <section style={{ padding: "64px 28px 80px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          className="band-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 32 }}
        >
          {items.map(({ big, cap }) => (
            <div key={big} style={{
              padding: "24px 8px 0", borderTop: "1px solid var(--border-strong)",
              display: "flex", flexDirection: "column", alignItems: "center",
              textAlign: "center",
            }}>
              <div style={{
                fontFamily: "var(--font-sans)", fontSize: "clamp(36px, 4vw, 56px)",
                fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1,
                color: "var(--text)", fontVariantNumeric: "tabular-nums",
              }}>
                {big}
              </div>
              <p style={{
                fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: "20px",
                color: "var(--dim)", margin: 0, marginTop: 12, maxWidth: 300,
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
