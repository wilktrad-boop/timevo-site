import { getTranslations } from "next-intl/server";
import { SECTION, SECTION_INNER, SectionHead, Punchline } from "./SectionParts";

type Bullet = string | { lead: string; rest: string };

/**
 * Bloc « titre + liste + punchline », partagé par Le problème, Pour qui et
 * Résultats. Les trois ont la même partition dans le copy v5 : ils ne
 * diffèrent que par leur contenu et par la présence d'un sous-titre.
 *
 * Les puces sont posées en rangées séparées par un filet plutôt qu'en liste à
 * tirets. À la taille de corps de la home, une liste serrée se lit comme une
 * note de bas de page ; les rangées tiennent le rythme des autres sections.
 */
export default async function BulletSection({
  ns, id, dimSecondLine = false,
}: {
  /** Espace de noms i18n : « pain », « pourqui » ou « results ». */
  ns: string;
  id?: string;
  dimSecondLine?: boolean;
}) {
  const t = await getTranslations(ns);
  const bullets = t.raw("bullets") as Bullet[];

  return (
    <section id={id} style={SECTION}>
      <div style={SECTION_INNER}>
        <SectionHead
          label={t("label")}
          lines={[t("h2_line1"), t("h2_line2")]}
          subtitle={t("subtitle")}
          dimSecondLine={dimSecondLine}
        />

        <div style={{ marginTop: 48 }}>
          {bullets.map((b, i) => {
            const lead = typeof b === "string" ? b : b.lead;
            const rest = typeof b === "string" ? null : b.rest;
            return (
              <div key={lead} style={{
                display: "grid", gridTemplateColumns: "28px 1fr", gap: 12,
                alignItems: "baseline",
                padding: "22px 0",
                borderTop: "1px solid var(--border)",
                borderBottom: i === bullets.length - 1 ? "1px solid var(--border)" : undefined,
              }}>
                <span aria-hidden="true" style={{
                  display: "inline-block", width: 14, height: 1.5,
                  background: "var(--accent)", borderRadius: 999,
                  transform: "translateY(-6px)",
                }} />
                <p style={{
                  fontFamily: "var(--font-sans)", fontSize: "clamp(17px, 1.7vw, 21px)",
                  fontWeight: 400, letterSpacing: "-0.015em", lineHeight: 1.35,
                  margin: 0, color: "var(--text)",
                }}>
                  {rest
                    ? <><span style={{ fontWeight: 600 }}>{lead}</span> <span style={{ color: "var(--dim)" }}>{rest}</span></>
                    : lead}
                </p>
              </div>
            );
          })}
        </div>

        <Punchline>{t("punch")}</Punchline>
      </div>
    </section>
  );
}
