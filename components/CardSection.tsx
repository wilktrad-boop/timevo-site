import React from "react";
import { getTranslations } from "next-intl/server";
import { SECTION, SECTION_INNER, SectionHead, Punchline, type Punch } from "./SectionParts";

/**
 * Bloc « titre + grille de cartes + punchline », partagé par Cas d'usage et
 * Pourquoi nous. Cartes de texte, sans illustration : les six cas d'usage et
 * les six arguments se lisent en balayage, une image par carte les
 * ralentirait.
 */
export default async function CardSection({
  ns, id, icon, columns = 3, dimSecondLine = true,
}: {
  /** Espace de noms i18n : « usecases » ou « why ». */
  ns: string;
  id?: string;
  icon?: React.ReactNode;
  columns?: number;
  dimSecondLine?: boolean;
}) {
  const t = await getTranslations(ns);
  const items = t.raw("items") as { title: string; desc: string }[];
  const punch = t.raw("punch") as Punch;

  return (
    <section id={id} style={SECTION}>
      <div style={SECTION_INNER}>
        <SectionHead
          label={t("label")}
          icon={icon}
          lines={[t("h2_line1"), t("h2_line2")]}
          dimSecondLine={dimSecondLine}
        />

        <div
          className="card-grid"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            gap: 16,
          }}
        >
          {items.map(({ title, desc }) => (
            <div key={title} style={{
              background: "var(--card)", border: "1px solid var(--border)",
              borderRadius: 20, padding: 26,
              display: "flex", flexDirection: "column", gap: 10,
            }}>
              <h3 style={{
                fontFamily: "var(--font-sans)", fontSize: 19, fontWeight: 600,
                letterSpacing: "-0.02em", lineHeight: 1.25, margin: 0, color: "var(--text)",
              }}>
                {title}
              </h3>
              <p style={{
                fontFamily: "var(--font-sans)", fontSize: 14.5, lineHeight: 1.55,
                color: "var(--dim)", margin: 0,
              }}>
                {desc}
              </p>
            </div>
          ))}
        </div>

        <Punchline lead={punch.lead} accent={punch.accent} />
      </div>
    </section>
  );
}
