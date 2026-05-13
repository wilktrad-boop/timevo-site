"use client";

import { useLocale, useTranslations } from "next-intl";

const SERVICE_SLUGS = ["automatisation", "agents-ia", "formation", "sites-web", "seo"] as const;
const SOLUTIONS_TITLES = new Set(["Solutions"]);

// For non-Solutions columns, fall back to a single anchor on the home
const COL_ANCHORS: Record<string, string> = {
  "Méthode": "#methode",
  "Method": "#methode",
};

export default function FooterDkdp() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const cols = t.raw("cols") as { title: string; items: string[] }[];

  function getItemHref(colTitle: string, itemIdx: number): string {
    if (SOLUTIONS_TITLES.has(colTitle)) {
      const slug = SERVICE_SLUGS[itemIdx] ?? "automatisation";
      return `/${locale}/solutions/${slug}`;
    }
    const anchor = COL_ANCHORS[colTitle] ?? "#contact";
    return `/${locale}${anchor}`;
  }

  return (
    <footer style={{ padding: "64px 28px 32px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 48, marginBottom: 48 }}
          className="footer-grid">
          <div>
            <div style={{
              fontFamily: "var(--font-geist-sans)", fontSize: 22, fontWeight: 600,
              letterSpacing: "-0.04em", marginBottom: 12, color: "var(--text)",
            }}>
              Timevo<span style={{ color: "var(--accent)" }}>.</span>
            </div>
            <p style={{
              fontFamily: "var(--font-geist-sans)", fontSize: 13, lineHeight: 1.5,
              color: "var(--dim)", margin: 0, maxWidth: 280,
              whiteSpace: "pre-line",
            }}>
              {t("tagline")}
            </p>
            <div style={{
              marginTop: 20, fontFamily: "var(--font-geist-mono)", fontSize: 12,
              color: "var(--dim)", lineHeight: 1.7,
            }}>
              {t("address")}<br />
              <a href="mailto:hello@timevo.fr" style={{ color: "var(--dim)", textDecoration: "none" }}>
                hello@timevo.fr
              </a>
            </div>
          </div>

          {cols.map(({ title, items }) => (
            <div key={title}>
              <div style={{
                fontFamily: "var(--font-geist-sans)", fontSize: 13, fontWeight: 600,
                color: "var(--text)", marginBottom: 16,
              }}>{title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {items.map((it, i) => (
                  <a key={it} href={getItemHref(title, i)} style={{
                    fontFamily: "var(--font-geist-sans)", fontSize: 13,
                    color: "var(--dim)", textDecoration: "none",
                    transition: "color .15s",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--dim)")}>
                    {it}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          borderTop: "1px solid var(--border)", paddingTop: 24,
          fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--dim-2)",
        }}>
          <span>{t("copyright")}</span>
        </div>
      </div>
    </footer>
  );
}
