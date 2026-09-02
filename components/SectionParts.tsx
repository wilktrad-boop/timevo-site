import React from "react";
import { Eyebrow } from "./primitives";

/**
 * Briques communes aux blocs de la home.
 *
 * La v5 du copy répète la même partition d'un bloc à l'autre : un intitulé,
 * un titre sur une ou deux lignes, parfois un sous-titre, un corps, et une
 * punchline qui ferme. Ces deux composants portent l'en-tête et la chute.
 *
 * La mise en page suit celle de vista-solutions.eu, prise comme référence :
 * tout est centré, les titres sont en 700 avec leur seconde ligne en gris, et
 * la punchline coupe en deux — l'amorce en blanc, la chute en accent. C'est
 * cette coupure qui fait respirer la page : sans elle, une home entièrement
 * en noir et blanc se lit comme un document, pas comme un site.
 */

export const SECTION: React.CSSProperties = {
  padding: "104px 28px",
  borderTop: "1px solid var(--border)",
};

export const SECTION_INNER: React.CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
};

/** Colonne centrée pour un en-tête de section. */
const HEAD: React.CSSProperties = {
  display: "flex", flexDirection: "column", alignItems: "center",
  textAlign: "center", marginBottom: 56,
};

export function SectionHead({
  label,
  icon,
  lines,
  subtitle,
  dimSecondLine = true,
}: {
  label: string;
  /** Icône de la pastille, propre au bloc. */
  icon?: React.ReactNode;
  /** Une ou deux lignes ; les lignes vides sont ignorées. */
  lines: string[];
  subtitle?: string;
  /** Seconde ligne en gris. Vista le fait systématiquement, d'où le défaut. */
  dimSecondLine?: boolean;
}) {
  const kept = lines.filter(Boolean);

  return (
    <div style={HEAD}>
      <Eyebrow icon={icon}>{label}</Eyebrow>

      <h2 style={{
        fontFamily: "var(--font-sans)", fontSize: "clamp(29px, 4vw, 52px)", fontWeight: 700,
        letterSpacing: "-0.035em", lineHeight: 1.1, margin: "22px 0 0", color: "var(--text)",
        maxWidth: 900,
      }}>
        {kept.map((line, i) => (
          <React.Fragment key={line}>
            {i > 0 && <br />}
            {i === 1 && dimSecondLine
              ? <span style={{ color: "var(--dim)" }}>{line}</span>
              : line}
          </React.Fragment>
        ))}
      </h2>

      {subtitle ? (
        <p style={{
          fontFamily: "var(--font-sans)", fontSize: 17, lineHeight: 1.55,
          color: "var(--dim)", maxWidth: 620, margin: "20px 0 0",
        }}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

/**
 * La chute de section : une phrase centrée, coupée en deux, la seconde
 * moitié en accent. Le point de coupure est écrit dans les messages plutôt
 * que déduit — il tombe tantôt sur un point, tantôt sur un deux-points,
 * tantôt sur une virgule.
 */
export function Punchline({ lead, accent }: { lead: string; accent: string }) {
  return (
    <p style={{
      fontFamily: "var(--font-sans)", fontSize: "clamp(21px, 2.6vw, 34px)", fontWeight: 700,
      letterSpacing: "-0.03em", lineHeight: 1.22, color: "var(--text)",
      textAlign: "center", maxWidth: 900, margin: "64px auto 0",
    }}>
      {lead}{" "}
      <span style={{
        background: "var(--accent-gradient)",
        WebkitBackgroundClip: "text", backgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}>
        {accent}
      </span>
    </p>
  );
}

/** Forme d'une punchline dans les messages. */
export type Punch = { lead: string; accent: string };
