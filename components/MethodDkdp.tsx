"use client";

import { useTranslations } from "next-intl";

export default function MethodDkdp() {
  const t = useTranslations("method");
  const steps = t.raw("steps") as string[][];

  return (
    <section id="methode" style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
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
        <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 16, color: "var(--dim)", maxWidth: 640, marginBottom: 56 }}>
          {t("subtitle")}
        </p>
        <div>
          {steps.map(([n, title, desc]) => (
            <div key={n} style={{
              display: "grid", gridTemplateColumns: "120px 1fr 2fr",
              gap: 32, padding: "36px 0",
              borderTop: "1px solid var(--border)", alignItems: "baseline",
            }} className="method-row">
              <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 14, color: "var(--accent)" }}>{n}</div>
              <h3 style={{
                fontFamily: "var(--font-geist-sans)", fontSize: 28, fontWeight: 500,
                letterSpacing: "-0.02em", margin: 0, color: "var(--text)",
              }}>{title}</h3>
              <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 15, color: "var(--dim)", margin: 0, lineHeight: 1.55 }}>{desc}</p>
            </div>
          ))}
          <div style={{ borderTop: "1px solid var(--border)" }} />
        </div>
      </div>
    </section>
  );
}
