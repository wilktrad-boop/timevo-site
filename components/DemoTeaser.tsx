import { getTranslations, getLocale } from "next-intl/server";
import { Arrow } from "./primitives";
import { DEMO_DASHBOARDS } from "@/lib/demoDashboards";
import { dayLabel, kpis, money, withinRange } from "@/lib/demo/compute";
import type { DemoCopy, SectorData } from "@/lib/demo/types";
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
            <StaticExtract data={DEMO_DASHBOARDS.pisciniste.data} copy={d} locale={locale} />
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

/**
 * Extrait statique du dashboard pisciniste : quatre compteurs et trois devis.
 *
 * Volontairement sans interactivité — pas de filtres, pas de panneau de détail,
 * aucun JavaScript. La page de démo complète porte tout ça ; ici l'aperçu doit
 * seulement montrer à quoi ressemble l'écran. Les compteurs sont calculés à
 * partir des mêmes enregistrements que la démo, sur la même période de 30 jours.
 */
function StaticExtract({
  data,
  copy,
  locale,
}: {
  data: SectorData;
  copy: DemoCopy;
  locale: "fr" | "en";
}) {
  const tiles = kpis(data, copy, 30, locale);
  const rows = withinRange(data.quotes, 30).slice(0, 3);

  const cell: React.CSSProperties = {
    padding: "13px 0", fontFamily: "var(--font-sans)", fontSize: 13.5,
    color: "var(--text)", textAlign: "left", verticalAlign: "top",
  };

  return (
    <div>
      <div className="demo-kpi-grid" style={{
        display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12, marginBottom: 32,
      }}>
        {tiles.map(k => (
          <div key={k.key} style={{
            background: "var(--card)", border: "1px solid var(--border)",
            borderRadius: 14, padding: "18px 18px 16px",
          }}>
            <div style={{
              fontFamily: "var(--font-sans)", fontSize: 28, fontWeight: 500,
              letterSpacing: "-0.03em", color: "var(--text)", fontVariantNumeric: "tabular-nums",
            }}>
              {k.value}
            </div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--text)", marginTop: 4 }}>
              {k.label}
            </div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--dim)", marginTop: 2 }}>
              {k.detail}
            </div>
          </div>
        ))}
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
          <caption style={{
            captionSide: "top", textAlign: "left", paddingBottom: 12,
            fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 500, color: "var(--text)",
          }}>
            {copy.quotesH2}
          </caption>
          <thead>
            <tr>
              {[copy.quotesCols.client, copy.quotesCols.amount, copy.quotesCols.age, copy.quotesCols.outcome].map(h => (
                <th key={h} scope="col" style={{
                  padding: "0 0 10px", fontFamily: "var(--font-mono)", fontSize: 10.5,
                  letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--dim-2)",
                  textAlign: "left", whiteSpace: "nowrap",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(q => {
              const txt = q[locale];
              return (
                <tr key={q.id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={cell}>
                    <div style={{ fontWeight: 500 }}>{txt.client}</div>
                    <div style={{ color: "var(--dim)", fontSize: 12.5, marginTop: 2 }}>{txt.project}</div>
                  </td>
                  <td style={{ ...cell, fontFamily: "var(--font-mono)", whiteSpace: "nowrap" }}>
                    {money(q.amount, locale)}
                  </td>
                  <td style={{ ...cell, color: "var(--dim)", fontSize: 12.5, whiteSpace: "nowrap" }}>
                    {dayLabel(q.day, locale)}
                  </td>
                  <td style={{ ...cell, color: "var(--dim)", fontSize: 12.5, whiteSpace: "nowrap" }}>
                    {copy.outcomes[q.outcome]}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
