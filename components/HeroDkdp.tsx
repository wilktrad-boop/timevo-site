import { getTranslations, getLocale } from "next-intl/server";
import { Arrow, PillPrimary, PillGhost } from "./primitives";
import HeroActivityCard, { type ActivityRow } from "./HeroActivityCard";
import { DEMO_DASHBOARDS } from "@/lib/demoDashboards";
import { kpis } from "@/lib/demo/compute";
import { type Locale } from "@/lib/links";

const CONTACT_HREF = "https://calendly.com/hello-timevo/30min";

/**
 * Hero en deux colonnes : la déclaration typographique à gauche, une preuve
 * visuelle à droite.
 *
 * Le badge, la source et les compteurs de la carte viennent des données du
 * dashboard pisciniste plutôt que d'une copie dans les messages : si les
 * chiffres de la démo changent, le hero suit. Seul le fil d'activité, qui
 * n'existe nulle part ailleurs, vit dans `hero.card`.
 *
 * Le H1 descend de clamp(48px, 8vw, 116px) à clamp(38px, 5.2vw, 72px) : il
 * n'occupe plus la pleine largeur mais une colonne d'environ 640 px.
 */
export default async function HeroDkdp() {
  const t = await getTranslations("hero");
  const tDemo = await getTranslations("demo_teaser");
  const locale = (await getLocale()) as Locale;

  const sector = DEMO_DASHBOARDS.pisciniste;
  const copy = sector[locale];
  const rows = t.raw("card.rows") as ActivityRow[];
  // Les deux premiers compteurs de la démo pisciniste, calculés sur 30 jours —
  // la même période que la page de démo elle-même.
  const cardKpis = kpis(sector.data, copy, 30, locale).slice(0, 2);

  return (
    <section style={{ padding: "72px 28px 80px", position: "relative" }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "grid", gridTemplateColumns: "minmax(0, 1.25fr) minmax(0, 1fr)",
        gap: 56, alignItems: "start",
      }} className="hero-grid">

        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 12,
            fontFamily: "var(--font-mono)", fontSize: 11,
            color: "var(--dim)", letterSpacing: "0.12em", textTransform: "uppercase",
            marginBottom: 24,
          }}>
            <span>{t("eyebrow")}</span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(38px, 5.2vw, 72px)",
            fontWeight: 500,
            letterSpacing: "-0.045em",
            lineHeight: 0.98,
            margin: 0,
            color: "var(--text)",
          }}>
            {t("h1_line1")}<br />
            {t("h1_line2")}<br />
            {t("h1_line3")}
          </h1>

          <p style={{
            fontFamily: "var(--font-sans)", fontSize: 18, lineHeight: 1.5,
            color: "var(--dim)", margin: 0, marginTop: 28, maxWidth: 520,
          }}>
            {t("subtitle")}
          </p>

          <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }} className="hero-ctas">
            <PillPrimary href={CONTACT_HREF} large>
              {t("cta_primary")} <Arrow color="#fff" size={14} />
            </PillPrimary>
            <PillGhost href="#solutions" large>
              {t("cta_secondary")}
            </PillGhost>
          </div>
        </div>

        <HeroActivityCard
          badge={copy.demoBadge}
          source={tDemo("sample")}
          kpis={cardKpis.map(k => ({ value: k.value, label: k.label }))}
          rows={rows}
        />
      </div>
    </section>
  );
}
