import { getTranslations } from "next-intl/server";
import { Arrow, PillPrimary, PillGhost } from "./primitives";
import { CONTACT_HREF } from "@/lib/contact";

/**
 * Hero centré, sur une seule colonne.
 *
 * La carte d'activité qui occupait la colonne de droite est retirée : elle
 * montrait des données de démonstration, pas une preuve. Son fil d'activité
 * reste dans `hero.card` côté messages, en attendant de savoir ce qui prendra
 * sa place.
 *
 * Le H1 dispose maintenant de la pleine largeur, ce qui laisse remonter le
 * corps. Sa borne haute reste dictée par la seconde ligne, « On la fait vivre
 * avec vous. », la plus longue des deux : au-delà elle se casse et la césure
 * imposée par le copy ne veut plus rien dire.
 *
 * Les boutons ne portent pas la classe `hero-ctas` : elle les repasse à gauche
 * sous 900 px, ce qui a du sens pour les hero alignés à gauche des pages ville
 * et secteur, pas ici.
 */
export default async function HeroDkdp() {
  const t = await getTranslations("hero");

  return (
    <section style={{ padding: "104px 28px 88px", position: "relative" }}>
      <div style={{
        maxWidth: 1000, margin: "0 auto",
        display: "flex", flexDirection: "column", alignItems: "center",
        textAlign: "center",
      }}>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 11,
          color: "var(--dim)", letterSpacing: "0.12em", textTransform: "uppercase",
          marginBottom: 26,
        }}>
          {t("eyebrow")}
        </div>

        <h1 style={{
          fontFamily: "var(--font-sans)",
          fontSize: "clamp(32px, 5.8vw, 72px)",
          fontWeight: 500,
          letterSpacing: "-0.045em",
          lineHeight: 1.0,
          margin: 0,
          color: "var(--text)",
        }}>
          {t("h1_line1")}<br />
          {t("h1_line2")}
        </h1>

        <p style={{
          fontFamily: "var(--font-sans)", fontSize: 18, lineHeight: 1.55,
          color: "var(--dim)", margin: 0, marginTop: 28, maxWidth: 640,
        }}>
          {t("subtitle")}
        </p>

        <div style={{
          display: "flex", gap: 12, marginTop: 36,
          flexWrap: "wrap", justifyContent: "center",
        }}>
          <PillPrimary href={CONTACT_HREF} large>
            {t("cta_primary")} <Arrow color="#fff" size={14} />
          </PillPrimary>
          <PillGhost href="#solutions" large>
            {t("cta_secondary")}
          </PillGhost>
        </div>
      </div>
    </section>
  );
}
