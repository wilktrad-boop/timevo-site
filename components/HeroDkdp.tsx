import { getTranslations } from "next-intl/server";
import { Arrow, Eyebrow, PillPrimary, PillGhost } from "./primitives";
import HeroActivityCard, { type ActivityRow } from "./HeroActivityCard";
import { CONTACT_HREF } from "@/lib/contact";

/**
 * Hero en deux temps : le texte, court et centré, puis la carte d'activité
 * qui occupe toute la largeur utile en dessous.
 *
 * La carte est le seul moment coloré de la page : elle montre des workflows
 * qui tournent (devis envoyé, relance à J+7, appel qualifié, rapport du
 * lundi), avec le signal « données fictives » lisible avant les données.
 * Tout le reste du hero reste en neutres : le titre ne porte plus de
 * dégradé, l'œil se pose sur la carte.
 */
export default async function HeroDkdp() {
  const t = await getTranslations("hero");
  const rows = t.raw("card.rows") as ActivityRow[];

  return (
    <section style={{ padding: "96px 28px 0", position: "relative" }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "flex", flexDirection: "column", alignItems: "center",
        textAlign: "center",
      }}>
        <Eyebrow>{t("eyebrow")}</Eyebrow>

        <h1 style={{
          fontFamily: "var(--font-sans)",
          fontSize: "clamp(36px, 5.2vw, 64px)",
          fontWeight: 500,
          letterSpacing: "-0.03em",
          lineHeight: 1.06,
          margin: "24px 0 0",
          maxWidth: 880,
          color: "var(--text)",
        }}>
          {t("h1_line1")}<br />
          {t("h1_line2")} {t("h1_accent")}
        </h1>

        <p style={{
          fontFamily: "var(--font-sans)", fontSize: 18, lineHeight: 1.55,
          color: "var(--dim)", margin: 0, marginTop: 24, maxWidth: 576,
        }}>
          {t("subtitle")}
        </p>

        <div style={{
          display: "flex", gap: 12, marginTop: 32,
          flexWrap: "wrap", justifyContent: "center",
        }}>
          <PillPrimary href={CONTACT_HREF} large>
            {t("cta_primary")} <Arrow size={14} />
          </PillPrimary>
          <PillGhost href="#solutions" large>
            {t("cta_secondary")}
          </PillGhost>
        </div>

        <div style={{ width: "100%", maxWidth: 880, marginTop: 64, textAlign: "left" }}>
          <HeroActivityCard
            badge={t("card.badge")}
            source={t("card.source")}
            status={t("card.status")}
            rows={rows}
          />
        </div>
      </div>
    </section>
  );
}
