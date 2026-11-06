import React from "react";
import { Eyebrow } from "./primitives";

/**
 * Briques communes aux blocs de la home.
 *
 * La v5 du copy répète la même partition d'un bloc à l'autre : un intitulé,
 * un titre sur une ou deux lignes, parfois un sous-titre, un corps, et une
 * punchline qui ferme. Ces deux composants portent l'en-tête et la chute.
 *
 * Tout est centré, les titres sont en 500 avec leur seconde ligne en gris, et
 * la punchline coupe en deux : l'amorce en gris, la chute en blanc. La
 * hiérarchie vient de la taille et de la couleur, pas de la graisse ni d'un
 * dégradé.
 */

export const SECTION: React.CSSProperties = {
  padding: "96px 28px",
  borderTop: "1px solid var(--border)",
};

export const SECTION_INNER: React.CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
};

/** Colonne centrée pour un en-tête de section. */
const HEAD: React.CSSProperties = {
  display: "flex", flexDirection: "column", alignItems: "center",
  textAlign: "center", marginBottom: 48,
};

export function SectionHead({
  label,
  icon,
  lines,
  subtitle,
  dimSecondLine = true,
}: {
  label: string;
  /** Icône du bloc, propre à l'intitulé. */
  icon?: React.ReactNode;
  /** Une ou deux lignes ; les lignes vides sont ignorées. */
  lines: string[];
  subtitle?: string;
  /** Seconde ligne en gris. */
  dimSecondLine?: boolean;
}) {
  const kept = lines.filter(Boolean);
  return (
    <div style={HEAD}>
      <Eyebrow icon={icon}>{label}</Eyebrow>
      <h2 style={{
        fontFamily: "var(--font-sans)", fontSize: "clamp(28px, 3.6vw, 44px)", fontWeight: 500,
        letterSpacing: "-0.02em", lineHeight: 1.12, margin: "16px 0 0", color: "var(--text)",
        maxWidth: 820,
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
          color: "var(--dim)", maxWidth: 576, margin: "16px 0 0",
        }}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

/**
 * La chute de section : une phrase centrée, coupée en deux. L'amorce en gris,
 * la chute en blanc. Le point de coupure est écrit dans les messages plutôt
 * que déduit — il tombe tantôt sur un point, tantôt sur un deux-points,
 * tantôt sur une virgule.
 */
export function Punchline({ lead, accent }: { lead: string; accent: string }) {
  return (
    <p style={{
      fontFamily: "var(--font-sans)", fontSize: "clamp(20px, 2.4vw, 30px)", fontWeight: 500,
      letterSpacing: "-0.01em", lineHeight: 1.3, color: "var(--dim)",
      textAlign: "center", maxWidth: 820, margin: "56px auto 0",
    }}>
      {lead}{" "}
      <span style={{ color: "var(--text)" }}>{accent}</span>
    </p>
  );
}

/** Forme d'une punchline dans les messages. */
export type Punch = { lead: string; accent: string };
