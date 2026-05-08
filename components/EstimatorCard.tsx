"use client";

import { useTranslations } from "next-intl";
import { Arrow, Check, PillPrimary } from "./primitives";

const CALENDLY_URL = "https://calendly.com/timevo/audit";

export default function EstimatorCard() {
  const t = useTranslations("estimator");
  const options = t.raw("options") as string[];

  return (
    <section style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{
          background: "linear-gradient(135deg, var(--accent-tint), var(--card))",
          border: "1px solid var(--accent)", borderRadius: 28, padding: 56,
          display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 48, alignItems: "center",
          position: "relative", overflow: "hidden",
        }} className="estimator-inner">
          <div style={{
            position: "absolute", top: -100, right: -80, width: 360, height: 360,
            borderRadius: 999, background: "var(--accent-glow)", filter: "blur(60px)", pointerEvents: "none",
          }} />
          <div style={{ position: "relative" }}>
            <div style={{
              fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--accent-soft)",
              letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16,
            }}>
              {t("label")}
            </div>
            <h3 style={{
              fontFamily: "var(--font-geist-sans)", fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 500,
              letterSpacing: "-0.03em", lineHeight: 1.05, margin: 0, marginBottom: 16, color: "var(--text)",
            }}>
              {t("h3")}
            </h3>
            <p style={{
              fontFamily: "var(--font-geist-sans)", fontSize: 15, lineHeight: 1.5,
              color: "var(--dim)", margin: 0, marginBottom: 24, maxWidth: 480,
            }}>
              {t("subtitle")}
            </p>
            <div style={{
              display: "flex", gap: 16, alignItems: "center",
              fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "var(--dim)",
              marginBottom: 28, flexWrap: "wrap",
            }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--accent)" }} />
                {t("meta_time")}
              </span>
              <span>·</span><span>{t("meta_no_commitment")}</span>
              <span>·</span><span>{t("meta_instant")}</span>
            </div>
            <PillPrimary href={CALENDLY_URL}>
              {t("cta")} <Arrow color="#fff" />
            </PillPrimary>
          </div>

          <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 18, padding: 24, position: "relative" }}>
            <div style={{
              fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "var(--dim)",
              letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16,
            }}>
              {t("question_label")}
            </div>
            <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 18, color: "var(--text)", marginBottom: 18, lineHeight: 1.3 }}>
              {t("question")}
            </div>
            {options.map((opt, idx) => (
              <div key={opt} style={{
                padding: "14px 16px",
                border: `1px solid ${idx === 1 ? "var(--accent)" : "var(--border)"}`,
                borderRadius: 12, marginBottom: 8,
                fontFamily: "var(--font-geist-sans)", fontSize: 14,
                color: idx === 1 ? "var(--text)" : "var(--dim)",
                background: idx === 1 ? "var(--accent-tint)" : "transparent",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span>{opt}</span>
                {idx === 1 && <Check color="var(--accent)" size={16} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
