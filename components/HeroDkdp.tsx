"use client";

import { useTranslations } from "next-intl";
import { Arrow, PillPrimary, PillGhost } from "./primitives";

const CALENDLY_URL = "https://calendly.com/timevo/audit";

export default function HeroDkdp() {
  const t = useTranslations("hero");

  return (
    <section style={{ padding: "72px 28px 80px", position: "relative" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 12,
          fontFamily: "var(--font-geist-mono)", fontSize: 11,
          color: "var(--dim)", letterSpacing: "0.12em", textTransform: "uppercase",
          marginBottom: 28,
        }}>
          <span>{t("eyebrow")}</span>
          <span style={{ width: 4, height: 4, borderRadius: 999, background: "var(--border-strong)" }} />
          <span>{t("eyebrow2")}</span>
        </div>

        <h1 style={{
          fontFamily: "var(--font-geist-sans)",
          fontSize: "clamp(48px, 8vw, 116px)",
          fontWeight: 500,
          letterSpacing: "-0.05em",
          lineHeight: 0.95,
          margin: 0,
          maxWidth: 1100,
          color: "var(--text)",
        }}>
          {t("h1_line1")}<br />
          {t("h1_line2")}<br />
          {t("h1_line3")}
        </h1>

        <div style={{
          marginTop: 32,
          display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 64, alignItems: "end",
        }} className="hero-subrow">
          <p style={{
            fontFamily: "var(--font-geist-sans)", fontSize: 18, lineHeight: 1.5,
            color: "var(--dim)", margin: 0, maxWidth: 560,
          }}>
            {t("subtitle")}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }} className="hero-ctas">
            <PillPrimary href={CALENDLY_URL} large>
              {t("cta_primary")} <Arrow color="#fff" size={14} />
            </PillPrimary>
            <PillGhost href="#solutions" large>
              {t("cta_secondary")}
            </PillGhost>
          </div>
        </div>
      </div>
    </section>
  );
}
