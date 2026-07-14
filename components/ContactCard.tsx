import { getTranslations } from "next-intl/server";
import { Arrow, PillPrimary } from "./primitives";

const CONTACT_HREF = "https://calendly.com/hello-timevo/30min";

export default async function ContactCard() {
  const t = await getTranslations("contact");

  return (
    <section id="contact" style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", padding: "80px 32px" }}>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--dim)",
            letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 24,
          }}>
            {t("label")}
          </div>
          <h2 style={{
            fontFamily: "var(--font-sans)", fontSize: "clamp(40px, 7vw, 88px)", fontWeight: 500,
            letterSpacing: "-0.05em", lineHeight: 0.95, margin: 0, marginBottom: 28, color: "var(--text)",
          }}>
            {t("h2")}
          </h2>
          <p style={{
            fontFamily: "var(--font-sans)", fontSize: 18, lineHeight: 1.5,
            color: "var(--dim)", margin: "0 auto 40px", maxWidth: 600,
          }}>
            {t("subtitle")}
          </p>
          <div style={{ marginBottom: 40 }}>
            <PillPrimary href={CONTACT_HREF} large>
              {t("cta")} <Arrow color="#fff" />
            </PillPrimary>
          </div>
          <div style={{
            display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap",
            fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--dim)", letterSpacing: "0.04em",
          }}>
            <a href={`mailto:${t("email")}`} style={{ color: "var(--dim)", textDecoration: "none" }}>{t("email")}</a>
            <span>·</span>
            <span>{t("city")}</span>
            <span>·</span>
            <span>{t("response")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
