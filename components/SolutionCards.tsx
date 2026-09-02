import { getTranslations } from "next-intl/server";
import { SECTION, SECTION_INNER, SectionHead, Punchline } from "./SectionParts";
import {
  IllustrationAutomatisation, IllustrationAgentsIA, IllustrationReseauxSociaux,
  IllustrationFrame,
} from "./PillarIllustrations";

/**
 * « La solution » : les trois familles de prestations que la home met en
 * avant. Les six piliers du site restent en place sur /solutions ; la home
 * n'en montre que trois, comme le veut le copy v5.
 *
 * Les cartes n'ont pas de lien : le copy les écrit comme un périmètre, pas
 * comme un menu. Le maillage vers les pages service passe par la navigation
 * et le pied de page.
 */
const illustrations = [
  <IllustrationAutomatisation key="auto" />,
  <IllustrationAgentsIA key="ia" />,
  <IllustrationReseauxSociaux key="acquisition" />,
];

export default async function SolutionCards() {
  const t = await getTranslations("solution");
  const items = t.raw("items") as { title: string; desc: string }[];

  return (
    <section id="solutions" style={SECTION}>
      <div style={SECTION_INNER}>
        <SectionHead label={t("label")} lines={[t("h2_line1"), t("h2_line2")]} />

        <div
          className="card-grid"
          style={{
            display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 16, marginTop: 48,
          }}
        >
          {items.map(({ title, desc }, i) => (
            <div key={title} style={{
              background: "var(--card)", border: "1px solid var(--border)",
              borderRadius: 24, overflow: "hidden",
              display: "flex", flexDirection: "column",
            }}>
              <IllustrationFrame height={168}>{illustrations[i]}</IllustrationFrame>
              <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 12 }}>
                <h3 style={{
                  fontFamily: "var(--font-sans)", fontSize: 23, fontWeight: 500,
                  letterSpacing: "-0.02em", lineHeight: 1.2, margin: 0, color: "var(--text)",
                }}>
                  {title}
                </h3>
                <p style={{
                  fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.55,
                  color: "var(--dim)", margin: 0,
                }}>
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Punchline>{t("punch")}</Punchline>
      </div>
    </section>
  );
}
