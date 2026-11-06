import { getTranslations } from "next-intl/server";
import { SECTION, SECTION_INNER, SectionHead, Punchline, type Punch } from "./SectionParts";
import { IconSteps } from "./SectionIcons";

/**
 * Le process, en étapes numérotées.
 *
 * L'en-tête et la punchline passent par les briques communes ; les rangées
 * gardent leur mise en page propre — numéro, titre, description — parce
 * qu'une étape se lit de gauche à droite, pas centrée.
 *
 * La dernière étape porte la signature du site, le point d'accent « en
 * cours » de la carte d'activité : c'est celle qui ne s'arrête pas.
 */
export default async function MethodDkdp() {
  const t = await getTranslations("method");
  const steps = t.raw("steps") as string[][];
  const punch = t.raw("punch") as Punch;
  const last = steps.length - 1;

  return (
    <section id="process" style={SECTION}>
      <div style={SECTION_INNER}>
        <SectionHead
          label={t("label")}
          icon={<IconSteps />}
          lines={[t("h2")]}
          subtitle={t("subtitle")}
        />

        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          {steps.map(([n, title, desc], i) => (
            <div key={n} style={{
              display: "grid", gridTemplateColumns: "80px 1fr 2fr",
              gap: 32, padding: "24px 0",
              borderTop: "1px solid var(--border)", alignItems: "baseline",
            }} className="method-row">
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--dim-2)",
                fontVariantNumeric: "tabular-nums",
              }}>{n}</div>
              <h3 style={{
                fontFamily: "var(--font-sans)", fontSize: 20, fontWeight: 500,
                margin: 0, color: "var(--text)",
                display: "inline-flex", alignItems: "center", gap: 10,
              }}>
                {i === last && (
                  <span aria-hidden="true" style={{
                    width: 6, height: 6, borderRadius: 999, background: "var(--accent)", flexShrink: 0,
                  }} />
                )}
                {title}
              </h3>
              <p className="method-desc" style={{
                fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--dim)",
                margin: 0, lineHeight: 1.55,
              }}>{desc}</p>
            </div>
          ))}
          <div style={{ borderTop: "1px solid var(--border)" }} />
        </div>

        <Punchline lead={punch.lead} accent={punch.accent} />
      </div>
    </section>
  );
}
