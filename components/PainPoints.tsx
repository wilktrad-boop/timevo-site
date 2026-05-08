"use client";

import { useTranslations } from "next-intl";

export default function PainPoints() {
  const t = useTranslations("pain");
  const items = t.raw("items") as { n: string; title: string; desc: string }[];

  return (
    <section id="solutions" style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{
          fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--dim)",
          letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16,
        }}>
          {t("label")}
        </div>
        <h2 style={{
          fontFamily: "var(--font-geist-sans)", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 500,
          letterSpacing: "-0.04em", lineHeight: 1.0, margin: 0, marginBottom: 16, color: "var(--text)",
        }}>
          {t("h2")}
        </h2>
        <p style={{
          fontFamily: "var(--font-geist-sans)", fontSize: 16, color: "var(--dim)",
          maxWidth: 640, marginBottom: 56,
        }}>
          {t("subtitle")}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderTop: "1px solid var(--border)" }}
          className="pain-grid">
          {items.map(({ n, title, desc }) => (
            <div key={n} style={{
              padding: "36px 28px",
              borderRight: "1px solid var(--border)",
              borderBottom: "1px solid var(--border)",
            }}>
              <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "var(--accent)", marginBottom: 24 }}>{n}</div>
              <h3 style={{
                fontFamily: "var(--font-geist-sans)", fontSize: 22, fontWeight: 500,
                letterSpacing: "-0.02em", lineHeight: 1.2, margin: 0, marginBottom: 12, color: "var(--text)",
              }}>{title}</h3>
              <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, lineHeight: 1.5, color: "var(--dim)", margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>

        <p style={{
          fontFamily: "var(--font-geist-sans)", fontSize: 24, fontWeight: 500,
          letterSpacing: "-0.02em", color: "var(--text)", marginTop: 40,
        }}>
          {t("closing")}{" "}
          <span style={{ color: "var(--dim)" }}>{t("closing_dim")}</span>
        </p>
      </div>
    </section>
  );
}
