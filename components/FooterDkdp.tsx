"use client";

import { useTranslations } from "next-intl";

export default function FooterDkdp() {
  const t = useTranslations("footer");
  const cols = t.raw("cols") as { title: string; items: string[] }[];

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
              +33 1 XX XX XX XX<br />
              hello@timevo.fr
            </div>
          </div>
          {cols.map(({ title, items }) => (
            <div key={title}>
              <div style={{
                fontFamily: "var(--font-geist-sans)", fontSize: 13, fontWeight: 600,
                color: "var(--text)", marginBottom: 16,
              }}>{title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {items.map(it => (
                  <span key={it} style={{
                    fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "var(--dim)", cursor: "pointer",
                  }}>{it}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{
          borderTop: "1px solid var(--border)", paddingTop: 24,
          display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
          fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--dim-2)",
        }}>
          <span>{t("copyright")}</span>
          <div style={{ display: "flex", gap: 20 }}>
            <span style={{ cursor: "pointer" }}>{t("legal")}</span>
            <span style={{ cursor: "pointer" }}>{t("privacy")}</span>
            <span style={{ cursor: "pointer" }}>{t("gdpr")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
