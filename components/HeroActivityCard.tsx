"use client";

import { useEffect, useState } from "react";

/**
 * Carte d'activité du hero.
 *
 * Montre que les workflows tournent, là où DemoTeaser montre l'écran lui-même.
 * Les deux ne doivent pas afficher la même chose : le teaser rejoue la barre de
 * KPI et le tableau des devis, cette carte rejoue un fil d'automatisations qui
 * se déclenchent.
 *
 * Règle éditoriale héritée des dashboards de démo
 * (docs/superpowers/specs/2026-07-23-dashboards-demo-design.md) : dans le cadre,
 * uniquement du langage d'application. Aucun argumentaire, aucune formule de
 * vente, et le signal « données fictives » se lit avant les données.
 *
 * La pastille d'état en haut à droite (point d'accent + « En cours · … ») est
 * la signature du site : elle dit que ça tourne tout seul. On la retrouve sur
 * l'étape « Optimisation continue » du process, et nulle part ailleurs.
 *
 * La motion joue une fois au chargement puis se fige. `prefers-reduced-motion`
 * affiche l'état final sans animation.
 */

export type ActivityRow = { label: string; detail: string; badge: string };

const ROW_DELAY_MS = 50;
const ROW_START_MS = 200;

export default function HeroActivityCard({
  badge,
  source,
  status,
  rows,
}: {
  badge: string;
  source: string;
  status: string;
  rows: ActivityRow[];
}) {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setRevealed(rows.length);
      return;
    }
    const timers = rows.map((_, i) =>
      window.setTimeout(() => setRevealed(n => Math.max(n, i + 1)), ROW_START_MS + i * ROW_DELAY_MS)
    );
    return () => { timers.forEach(clearTimeout); };
  }, [rows]);

  return (
    <div style={{
      background: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: 16,
      overflow: "hidden",
    }}>
      {/* Barre de titre : le signal « données fictives » se lit avant les données. */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
        padding: "12px 20px",
        borderBottom: "1px solid var(--border)",
        background: "var(--card-soft)",
      }}>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 12,
          color: "var(--dim-2)", whiteSpace: "nowrap",
        }}>
          {badge} · {source}
        </span>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          fontFamily: "var(--font-mono)", fontSize: 12,
          color: "var(--dim)", whiteSpace: "nowrap",
        }}>
          <span aria-hidden="true" style={{
            width: 6, height: 6, borderRadius: 999, background: "var(--accent)", flexShrink: 0,
          }} />
          {status}
        </span>
      </div>

      {/* Fil d'activité */}
      <div>
        {rows.map((r, i) => (
          <div
            key={r.label}
            style={{
              display: "grid", gridTemplateColumns: "1fr auto", alignItems: "start", gap: 16,
              padding: "16px 20px",
              borderBottom: i === rows.length - 1 ? "none" : "1px solid var(--border)",
              opacity: i < revealed ? 1 : 0,
              transform: i < revealed ? "translateY(0)" : "translateY(6px)",
              transition: "opacity .3s var(--ease), transform .3s var(--ease)",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500,
                color: "var(--text)", lineHeight: "20px",
              }}>
                {r.label}
              </div>
              <div style={{
                fontFamily: "var(--font-sans)", fontSize: 13,
                color: "var(--dim)", marginTop: 2, lineHeight: "20px",
                fontVariantNumeric: "tabular-nums",
              }}>
                {r.detail}
              </div>
            </div>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 12,
              color: "var(--dim)", lineHeight: "20px",
              padding: "0 8px", borderRadius: 6, whiteSpace: "nowrap",
              background: "var(--card-soft)", border: "1px solid var(--border)",
              flexShrink: 0,
            }}>
              {r.badge}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
