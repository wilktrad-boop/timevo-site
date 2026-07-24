import { getTranslations, getLocale } from "next-intl/server";
import { Arrow } from "./primitives";
import type { Locale } from "@/lib/links";

/**
 * Encadré facturation électronique sur la home.
 *
 * Lien contextuel entrant, depuis la page la plus autoritaire du site, vers
 * l'offre à échéance légale. Reprend le prix affiché (890 € HT), seul prix
 * public assumé (cf. Timevo/CLAUDE.md).
 */
export default async function FacturationBanner() {
  const t = await getTranslations("facturation.home_banner");
  const locale = (await getLocale()) as Locale;
  const href = `/${locale}/facturation-electronique`;

  return (
    <section style={{ padding: "40px 28px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <a
          href={href}
          aria-label={t("title")}
          className="fe-banner"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 32,
            alignItems: "center",
            padding: "36px 40px",
            borderRadius: 24,
            border: "1px solid var(--border-strong)",
            background:
              "linear-gradient(135deg, var(--accent-tint), transparent 60%), var(--card)",
            textDecoration: "none",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontFamily: "var(--font-mono)", fontSize: 11,
              textTransform: "uppercase", letterSpacing: "0.1em",
              color: "var(--accent-soft)", marginBottom: 14,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: 999,
                background: "var(--accent)", flexShrink: 0,
              }} />
              {t("eyebrow")}
            </div>

            <div style={{
              display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap",
              marginBottom: 10,
            }}>
              <h2 style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 500,
                letterSpacing: "-0.03em", lineHeight: 1.1,
                margin: 0, color: "var(--text)",
              }}>
                {t("title")}
              </h2>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 500,
                color: "var(--accent-soft)",
                background: "var(--accent-tint)",
                padding: "5px 12px", borderRadius: 999,
                whiteSpace: "nowrap",
              }}>
                {t("price")}
              </span>
            </div>

            <p style={{
              fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.55,
              color: "var(--dim)", margin: 0, maxWidth: 620,
            }}>
              {t("desc")}
            </p>
          </div>

          <span
            className="fe-banner-cta"
            style={{
              position: "relative", zIndex: 1,
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "14px 24px",
              background: "var(--accent-gradient)",
              color: "#fff", borderRadius: 999,
              fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600,
              whiteSpace: "nowrap",
              boxShadow: "0 0 0 1px var(--accent), 0 12px 32px var(--accent-glow)",
            }}
          >
            {t("cta")} <Arrow size={13} color="#fff" />
          </span>
        </a>
      </div>
    </section>
  );
}
