import { getTranslations, getLocale } from "next-intl/server";
import {
  SERVICE_SLUGS,
  sectorLinks,
  cityLinks,
  LINK_LABELS,
  type Locale,
} from "@/lib/links";

const SOLUTIONS_TITLES = new Set(["Solutions"]);

// For non-Solutions columns, fall back to a single anchor on the home
const COL_ANCHORS: Record<string, string> = {
  "Méthode": "#methode",
  "Method": "#methode",
};

type Col = { title: string; items: { label: string; href: string }[] };

export default async function FooterDkdp() {
  const t = await getTranslations("footer");
  const locale = (await getLocale()) as Locale;
  const msgCols = t.raw("cols") as { title: string; items: string[] }[];
  const L = LINK_LABELS[locale];

  function getItemHref(colTitle: string, itemIdx: number): string {
    if (SOLUTIONS_TITLES.has(colTitle)) {
      const slug = SERVICE_SLUGS[itemIdx] ?? "automatisation";
      return `/${locale}/solutions/${slug}`;
    }
    const anchor = COL_ANCHORS[colTitle] ?? "#contact";
    return `/${locale}${anchor}`;
  }

  // Colonne « Par secteur » insérée après Solutions : c'est le seul lien entrant
  // sitewide vers les pages secteur, qui seraient orphelines sans lui.
  const sectorsCol: Col = {
    title: L.sectors,
    items: sectorLinks(locale).map(({ label, href }) => ({ label, href })),
  };

  const cols: Col[] = msgCols.map(({ title, items }) => ({
    title,
    items: items.map((label, i) => ({ label, href: getItemHref(title, i) })),
  }));

  const solutionsIdx = cols.findIndex(c => SOLUTIONS_TITLES.has(c.title));
  cols.splice(solutionsIdx >= 0 ? solutionsIdx + 1 : cols.length, 0, sectorsCol);

  const cities = cityLinks(locale);

  return (
    <footer style={{ padding: "64px 28px 32px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: `1.4fr repeat(${cols.length}, 1fr)`, gap: 48, marginBottom: 48 }}
          className="footer-grid">
          <div>
            <div style={{
              fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 600,
              letterSpacing: "-0.04em", marginBottom: 12, color: "var(--text)",
            }}>
              Timevo<span style={{ color: "var(--accent)" }}>.</span>
            </div>
            <p style={{
              fontFamily: "var(--font-sans)", fontSize: 13, lineHeight: 1.5,
              color: "var(--dim)", margin: 0, maxWidth: 280,
              whiteSpace: "pre-line",
            }}>
              {t("tagline")}
            </p>
            <div style={{
              marginTop: 20, fontFamily: "var(--font-mono)", fontSize: 12,
              color: "var(--dim)", lineHeight: 1.7,
            }}>
              {/* Les villes sont cliquables : second lien entrant vers les pages geo. */}
              {cities.map((c, i) => (
                <span key={c.href}>
                  {i > 0 && " · "}
                  <a href={c.href} className="footer-link" style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
                    {c.label}
                  </a>
                </span>
              ))}
              {" · France"}<br />
              <a href="mailto:hello@timevo.io" style={{ color: "var(--dim)", textDecoration: "none" }}>
                hello@timevo.io
              </a>
            </div>
          </div>

          {cols.map(({ title, items }) => (
            <div key={title}>
              <div style={{
                fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
                color: "var(--text)", marginBottom: 16,
              }}>{title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {items.map(({ label, href }) => (
                  <a key={label} href={href} className="footer-link" style={{
                    fontFamily: "var(--font-sans)", fontSize: 13,
                  }}>
                    {label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          borderTop: "1px solid var(--border)", paddingTop: 24,
          fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--dim-2)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          gap: 16, flexWrap: "wrap",
        }}>
          <span>{t("copyright")}</span>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <a href={`/${locale}/mentions-legales`} className="footer-link" style={{
              fontFamily: "var(--font-mono)", fontSize: 11,
            }}>
              {t("legal")}
            </a>
            <a href={`/${locale}/politique-de-confidentialite`} className="footer-link" style={{
              fontFamily: "var(--font-mono)", fontSize: 11,
            }}>
              {t("privacy")}
            </a>
            <a href={`/${locale}/cgv`} className="footer-link" style={{
              fontFamily: "var(--font-mono)", fontSize: 11,
            }}>
              CGV
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
