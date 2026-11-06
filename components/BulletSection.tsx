import React from "react";
import { getTranslations } from "next-intl/server";
import { SECTION, SECTION_INNER, SectionHead, Punchline, type Punch } from "./SectionParts";

type Bullet = string | { lead: string; rest: string };

/**
 * Bloc « titre + liste + punchline », partagé par Le problème, Pour qui et
 * Résultats. Les trois ont la même partition dans le copy v5 : ils ne
 * diffèrent que par leur contenu et par la présence d'un sous-titre.
 *
 * Les puces sont des lignes séparées par des filets, dans une colonne de
 * lecture, sans carte ni pastille : à cette taille de corps, c'est le texte
 * qui porte, pas le cadre.
 */
export default async function BulletSection({
  ns, id, icon, dimSecondLine = true,
}: {
  /** Espace de noms i18n : « pain », « pourqui » ou « results ». */
  ns: string;
  id?: string;
  icon?: React.ReactNode;
  dimSecondLine?: boolean;
}) {
  const t = await getTranslations(ns);
  const bullets = t.raw("bullets") as Bullet[];
  const punch = t.raw("punch") as Punch;

  return (
    <section id={id} style={SECTION}>
      <div style={SECTION_INNER}>
        <SectionHead
          label={t("label")}
          icon={icon}
          lines={[t("h2_line1"), t("h2_line2")]}
          subtitle={t("subtitle")}
          dimSecondLine={dimSecondLine}
        />

        <div style={{ maxWidth: 720, margin: "0 auto", borderTop: "1px solid var(--border)" }}>
          {bullets.map((b) => {
            const lead = typeof b === "string" ? b : b.lead;
            const rest = typeof b === "string" ? null : b.rest;
            return (
              <p key={lead} style={{
                fontFamily: "var(--font-sans)", fontSize: 17,
                fontWeight: 500, lineHeight: 1.45,
                margin: 0, padding: "16px 0", color: "var(--text)",
                borderBottom: "1px solid var(--border)",
              }}>
                {rest
                  ? <>{lead} <span style={{ color: "var(--dim)", fontWeight: 400 }}>{rest}</span></>
                  : lead}
              </p>
            );
          })}
        </div>

        <Punchline lead={punch.lead} accent={punch.accent} />
      </div>
    </section>
  );
}
