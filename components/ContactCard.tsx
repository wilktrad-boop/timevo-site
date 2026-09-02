import { getTranslations } from "next-intl/server";
import { Arrow, Eyebrow, PillPrimary } from "./primitives";
import CalendlyInline from "./CalendlyInline";
import { IconArrow } from "./SectionIcons";
import { CONTACT_HREF } from "@/lib/contact";

export default async function ContactCard() {
  const t = await getTranslations("contact");

  return (
    <section id="contact" style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", padding: "80px 32px" }}>
          <Eyebrow icon={<IconArrow />}>{t("label")}</Eyebrow>
          <h2 style={{
            fontFamily: "var(--font-sans)", fontSize: "clamp(32px, 4.8vw, 62px)", fontWeight: 700,
            letterSpacing: "-0.04em", lineHeight: 1.06, margin: "26px auto 28px", maxWidth: 900,
            color: "var(--text)",
          }}>
            {t("h2")}
          </h2>
          <p style={{
            fontFamily: "var(--font-sans)", fontSize: 18, lineHeight: 1.5,
            color: "var(--dim)", margin: "0 auto 40px", maxWidth: 600,
          }}>
            {t("subtitle")}
          </p>
          <div style={{ marginBottom: 20 }}>
            <PillPrimary href={CONTACT_HREF} large>
              {t("cta")} <Arrow color="#fff" />
            </PillPrimary>
          </div>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--dim)",
            letterSpacing: "0.04em", margin: 0,
          }}>
            {t("reassurance")}
          </p>

          <CalendlyInline
            intro={t("agenda_intro")}
            load={t("agenda_load")}
            note={t("agenda_note")}
          />

          <div style={{
            display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap",
            fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--dim)",
            letterSpacing: "0.04em", marginTop: 48,
          }}>
            <a href={`mailto:${t("email")}`} style={{ color: "var(--dim)", textDecoration: "none" }}>{t("email")}</a>
            <span>·</span>
            <span>{t("city")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
