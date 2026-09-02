import React from "react";
import { getTranslations } from "next-intl/server";
import { SECTION, SECTION_INNER, SectionHead, Punchline, type Punch } from "./SectionParts";

type Bullet = string | { lead: string; rest: string };

/**
 * Bloc « titre + liste + punchline », partagé par Le problème, Pour qui et
 * Résultats. Les trois ont la même partition dans le copy v5 : ils ne
 * diffèrent que par leur contenu et par la présence d'un sous-titre.
 *
 * Les puces sont des cartes empilées, comme chez Vista, et non une liste à
 * tirets : à la taille de corps de la home, une liste serrée se lit comme une
 * note de bas de page. Chaque carte porte à gauche une pastille d'accent qui
 * tient le rôle de puce.
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

        <div style={{
          display: "flex", flexDirection: "column", gap: 12,
          maxWidth: 860, margin: "0 auto",
        }}>
          {bullets.map((b) => {
            const lead = typeof b === "string" ? b : b.lead;
            const rest = typeof b === "string" ? null : b.rest;
            return (
              <div key={lead} style={{
                display: "grid", gridTemplateColumns: "auto 1fr", gap: 16,
                alignItems: "center",
                background: "var(--card)", border: "1px solid var(--border)",
                borderRadius: 14, padding: "18px 22px",
              }}>
                <span aria-hidden="true" style={{
                  width: 30, height: 30, borderRadius: 9,
                  background: "var(--accent-tint)",
                  border: "1px solid var(--border)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: 999,
                    background: "var(--accent-gradient)",
                  }} />
                </span>
                <p style={{
                  fontFamily: "var(--font-sans)", fontSize: "clamp(15px, 1.5vw, 17px)",
                  fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1.4,
                  margin: 0, color: "var(--text)",
                }}>
                  {rest
                    ? <>{lead} <span style={{ color: "var(--dim)", fontWeight: 400 }}>{rest}</span></>
                    : lead}
                </p>
              </div>
            );
          })}
        </div>

        <Punchline lead={punch.lead} accent={punch.accent} />
      </div>
    </section>
  );
}
