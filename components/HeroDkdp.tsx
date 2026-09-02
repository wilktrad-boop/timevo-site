import { getTranslations } from "next-intl/server";
import { Arrow, Eyebrow, PillPrimary, PillGhost } from "./primitives";
import { CONTACT_HREF } from "@/lib/contact";

/**
 * Hero centré, sur une seule colonne.
 *
 * La carte d'activité qui occupait la colonne de droite est retirée : elle
 * montrait des données de démonstration, pas une preuve. Son fil d'activité
 * reste dans `hero.card` côté messages, en attendant de savoir ce qui prendra
 * sa place.
 *
 * Le H1 dispose de la pleine largeur, ce qui laisse remonter le corps. Sa
 * borne haute reste dictée par la seconde ligne, la plus longue des deux :
 * au-delà elle se casse et la césure imposée par le copy ne veut plus rien
 * dire. Sa fin passe en dégradé d'accent — c'est là que se trouve le
 * différenciateur, et une page entièrement en noir et blanc n'a nulle part
 * où poser l'œil.
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
        <Eyebrow>{t("eyebrow")}</Eyebrow>

        <h1 style={{
          fontFamily: "var(--font-sans)",
          fontSize: "clamp(32px, 5.6vw, 70px)",
          fontWeight: 700,
          letterSpacing: "-0.04em",
          lineHeight: 1.04,
          margin: "28px 0 0",
          color: "var(--text)",
        }}>
          {t("h1_line1")}<br />
          {t("h1_line2")}{" "}
          <span style={{
            background: "var(--accent-gradient)",
            WebkitBackgroundClip: "text", backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            {t("h1_accent")}
          </span>
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
