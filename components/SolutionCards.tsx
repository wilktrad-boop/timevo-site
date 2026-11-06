import { getTranslations } from "next-intl/server";
import { SECTION, SECTION_INNER, SectionHead, Punchline, type Punch } from "./SectionParts";
import { IconNetwork } from "./SectionIcons";
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
  const punch = t.raw("punch") as Punch;

  return (
    <section id="solutions" style={SECTION}>
      <div style={SECTION_INNER}>
        <SectionHead label={t("label")} icon={<IconNetwork />} lines={[t("h2_line1"), t("h2_line2")]} />

        <div
          className="card-grid"
          style={{
            display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 12,
          }}
        >
          {items.map(({ title, desc }, i) => (
            <div key={title} style={{
              background: "var(--card)", border: "1px solid var(--border)",
              borderRadius: 16, overflow: "hidden",
              display: "flex", flexDirection: "column",
            }}>
              <IllustrationFrame height={168}>{illustrations[i]}</IllustrationFrame>
              <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 8 }}>
                <h3 style={{
                  fontFamily: "var(--font-sans)", fontSize: 20, fontWeight: 500,
                  lineHeight: 1.25, margin: 0, color: "var(--text)",
                }}>
                  {title}
                </h3>
                <p style={{
                  fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: "20px",
                  color: "var(--dim)", margin: 0,
                }}>
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Punchline lead={punch.lead} accent={punch.accent} />
      </div>
    </section>
  );
}
