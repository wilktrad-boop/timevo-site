import { getTranslations, getLocale } from "next-intl/server";
import { Arrow } from "./primitives";
import { KpiRow, QuotesPanel } from "./demo/panels";
import { DEMO_DASHBOARDS } from "@/lib/demoDashboards";
import { demoLinks, sectorLink, type Locale } from "@/lib/links";

/**
 * Aperçu des dashboards de démo sur la home.
 *
 * Rejoue un vrai morceau de l'interface — barre de KPI et suivi des devis du
 * dashboard pisciniste — plutôt que d'en parler. Le visiteur voit l'outil
 * avant de cliquer.
 *
 * L'aperçu est statique : pas d'onglets, pas de JavaScript. Les trois liens
 * sous le cadre mènent aux pages complètes.
 *
 * Le signal « données fictives » est repris ici tel quel. Un extrait de
 * dashboard sur la home sans cette mention laisserait croire à de vrais
 * dossiers clients.
 */
export default async function DemoTeaser() {
  const t = await getTranslations("demo_teaser");
  const locale = (await getLocale()) as Locale;

  // Pisciniste : le secteur validé, et le prospect chaud de Max.
  const d = DEMO_DASHBOARDS.pisciniste[locale];
  const links = demoLinks(locale);

  return (
    <section id="demos" style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 12,
          fontFamily: "var(--font-mono)", fontSize: 11,
          color: "var(--accent-soft)", letterSpacing: "0.12em", textTransform: "uppercase",
          marginBottom: 28, padding: "6px 12px",
          background: "var(--accent-tint)", border: "1px solid var(--accent-tint)", borderRadius: 999,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--accent)" }} />
          <span>{t("eyebrow")}</span>
        </div>

        <h2 style={{
          fontFamily: "var(--font-sans)", fontSize: "clamp(32px, 4.5vw, 56px)",
          fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 1.0,
          margin: 0, marginBottom: 20, color: "var(--text)", maxWidth: 800,
        }}>
          {t("h2")}
        </h2>

        <p style={{
          fontFamily: "var(--font-sans)", fontSize: 17, lineHeight: 1.55,
          color: "var(--dim)", margin: 0, marginBottom: 48, maxWidth: 680,
        }}>
          {t("subtitle")}
        </p>

        {/* ── L'aperçu ─────────────────────────────────────── */}
        <div style={{
          border: "1px solid var(--border-strong)", borderRadius: 24,
          overflow: "hidden", background: "var(--bg)",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
            padding: "15px 24px",
            borderBottom: "1px solid var(--accent-tint)", background: "var(--accent-tint)",
          }}>
            <span aria-hidden="true" style={{
              width: 7, height: 7, borderRadius: 999, background: "var(--accent)", flex: "0 0 auto",
            }} />
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 11.5,
              color: "var(--accent-soft)", letterSpacing: "0.14em", textTransform: "uppercase",
            }}>
              {d.demoBadge}
            </span>
            <span style={{
              marginLeft: "auto",
              fontFamily: "var(--font-mono)", fontSize: 11,
              color: "var(--dim-2)", letterSpacing: "0.08em",
            }}>
              {t("sample")}
            </span>
          </div>

          <div style={{ padding: "32px 24px 36px" }}>
            <KpiRow d={d} />
            <QuotesPanel d={d} compact />
          </div>
        </div>

        <p style={{
          marginTop: 18, maxWidth: 820,
          fontFamily: "var(--font-sans)", fontSize: 13, lineHeight: 1.6, color: "var(--dim-2)",
        }}>
          {t("note")}
        </p>

        {/* ── Les trois démos ──────────────────────────────── */}
        <div style={{
          marginTop: 48,
          fontFamily: "var(--font-mono)", fontSize: 11,
          color: "var(--dim-2)", letterSpacing: "0.12em", textTransform: "uppercase",
          marginBottom: 20,
        }}>
          {t("pick")}
        </div>

        <div className="demo-links-grid" style={{
          display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16,
        }}>
          {links.map(link => {
            const slug = link.href.split("/").pop() as string;
            const sector = sectorLink(slug, locale);
            return (
              <a key={link.href} href={link.href} className="hover-card" style={{
                padding: "26px 24px",
                background: "var(--card)", border: "1px solid var(--border)",
                borderRadius: 20, textDecoration: "none", display: "block",
              }}>
                <div style={{
                  fontFamily: "var(--font-sans)", fontSize: 19, fontWeight: 500,
                  letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 10,
                }}>
                  {sector.label}
                </div>
                <p style={{
                  fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: 1.5,
                  color: "var(--dim)", margin: 0, marginBottom: 18,
                }}>
                  {sector.desc}
                </p>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
                  color: "var(--accent-soft)",
                }}>
                  {t("see")} <Arrow size={12} />
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
