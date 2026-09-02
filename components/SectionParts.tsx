import React from "react";

/**
 * Briques communes aux blocs de la home.
 *
 * La v5 du copy répète la même partition d'un bloc à l'autre : un intitulé en
 * mono, un titre sur une ou deux lignes, parfois un sous-titre, un corps, et
 * une punchline qui ferme. Ces deux composants portent l'en-tête et la chute,
 * les blocs ne portent plus que leur corps.
 */

export const SECTION: React.CSSProperties = {
  padding: "96px 28px",
  borderTop: "1px solid var(--border)",
};

export const SECTION_INNER: React.CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
};

export function SectionHead({
  label,
  lines,
  subtitle,
  dimSecondLine = false,
}: {
  label: string;
  /** Une ou deux lignes ; les lignes vides sont ignorées. */
  lines: string[];
  subtitle?: string;
  /** Passe la seconde ligne en gris, comme le fait déjà le bloc « expertises ». */
  dimSecondLine?: boolean;
}) {
  const kept = lines.filter(Boolean);

  return (
    <>
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--dim)",
        letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16,
      }}>
        {label}
      </div>
      <h2 style={{
        fontFamily: "var(--font-sans)", fontSize: "clamp(32px, 4.4vw, 58px)", fontWeight: 500,
        letterSpacing: "-0.04em", lineHeight: 1.04, margin: 0, color: "var(--text)",
        maxWidth: 1000,
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
          fontFamily: "var(--font-sans)", fontSize: 16, color: "var(--dim)",
          maxWidth: 640, marginTop: 16, marginBottom: 0,
        }}>
          {subtitle}
        </p>
      ) : null}
    </>
  );
}

/**
 * La chute de section. Le filet en dégradé reprend la signature des images de
 * partage : il annonce qu'on change de registre, sans encadrer la phrase.
 */
export function Punchline({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 56, maxWidth: 880 }}>
      <div style={{
        width: 48, height: 2, borderRadius: 999,
        background: "var(--accent-gradient)", marginBottom: 22,
      }} />
      <p style={{
        fontFamily: "var(--font-sans)", fontSize: "clamp(21px, 2.5vw, 32px)", fontWeight: 500,
        letterSpacing: "-0.03em", lineHeight: 1.18, color: "var(--text)", margin: 0,
      }}>
        {children}
      </p>
    </div>
  );
}
