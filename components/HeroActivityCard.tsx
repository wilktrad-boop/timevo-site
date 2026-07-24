"use client";

import { useEffect, useRef, useState } from "react";

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
 * La motion joue une fois au chargement puis se fige — la DA demande une motion
 * subtile, pas une boucle. `prefers-reduced-motion` affiche l'état final sans
 * animation.
 */

export type ActivityRow = { label: string; detail: string; badge: string };
export type CardKpi = { value: string; label: string };

const COUNT_MS = 1000;
const ROW_DELAY_MS = 380;
const ROW_START_MS = 400;

/**
 * Chiffres d'une valeur affichée, avec ce qui les entoure : « 8 400 € », « €8,400 ».
 *
 * Le séparateur de milliers varie selon la locale : espace insécable ou fine
 * insécable en français, virgule en anglais. On l'écrit en échappement plutôt
 * qu'en littéral, ces caractères étant invisibles à la relecture.
 */
const NUMBER_RE = /\d[\d\s\u00a0\u202f.,]*/;
const TRAILING_SEPARATORS_RE = /[\s\u00a0\u202f.,]+$/;

function parseValue(value: string) {
  const match = value.match(NUMBER_RE);
  if (!match || match.index === undefined) return null;

  // La classe est gourmande et avale le séparateur qui précède le suffixe
  // (« 8 400 » puis l'espace avant « € ») : on le rend au suffixe.
  const raw = match[0].replace(TRAILING_SEPARATORS_RE, "");
  const target = Number(raw.replace(/\D/g, ""));
  if (!Number.isFinite(target)) return null;

  return {
    target,
    prefix: value.slice(0, match.index),
    suffix: value.slice(match.index + raw.length),
    separator: raw.replace(/\d/g, "").charAt(0),
  };
}

function group(n: number, separator: string) {
  const s = String(n);
  return separator ? s.replace(/\B(?=(\d{3})+(?!\d))/g, separator) : s;
}

export default function HeroActivityCard({
  badge,
  source,
  kpis,
  rows,
}: {
  badge: string;
  source: string;
  kpis: CardKpi[];
  rows: ActivityRow[];
}) {
  // 0 → 1. Pilote les compteurs. Démarre à 1 si l'animation est refusée.
  const [progress, setProgress] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const frame = useRef<number | undefined>(undefined);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setProgress(1);
      setRevealed(rows.length);
      return;
    }

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_MS);
      setProgress(1 - Math.pow(1 - t, 3)); // ease-out cubique
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);

    const timers = rows.map((_, i) =>
      window.setTimeout(() => setRevealed(n => Math.max(n, i + 1)), ROW_START_MS + i * ROW_DELAY_MS)
    );

    return () => {
      if (frame.current !== undefined) cancelAnimationFrame(frame.current);
      timers.forEach(clearTimeout);
    };
  }, [rows]);

  return (
    <div style={{
      background: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: 20,
      overflow: "hidden",
      boxShadow: "var(--shadow)",
    }}>
      {/* Barre de titre : le signal « données fictives » se lit avant les données. */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
        padding: "13px 18px",
        borderBottom: "1px solid var(--border)",
        background: "var(--accent-tint)",
      }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 9,
          fontFamily: "var(--font-mono)", fontSize: 10.5,
          color: "var(--accent-soft)", letterSpacing: "0.1em", textTransform: "uppercase",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--accent)", flexShrink: 0 }} />
          {badge}
        </span>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 10.5,
          color: "var(--dim-2)", letterSpacing: "0.06em", whiteSpace: "nowrap",
        }}>
          {source}
        </span>
      </div>

      {/* Compteurs */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        borderBottom: "1px solid var(--border)",
      }}>
        {kpis.map((k, i) => {
          const parsed = parseValue(k.value);
          const shown = parsed
            ? parsed.prefix +
              group(Math.round(parsed.target * progress), parsed.separator) +
              parsed.suffix
            : k.value;
          return (
            <div key={k.label} style={{
              padding: "18px 18px 16px",
              borderLeft: i === 0 ? "none" : "1px solid var(--border)",
            }}>
              <div style={{
                fontFamily: "var(--font-sans)", fontSize: 30, fontWeight: 500,
                letterSpacing: "-0.03em", color: "var(--text)",
                fontVariantNumeric: "tabular-nums",
              }}>
                {shown}
              </div>
              <div style={{
                fontFamily: "var(--font-sans)", fontSize: 12.5,
                color: "var(--dim)", marginTop: 3,
              }}>
                {k.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Fil d'activité */}
      <div>
        {rows.map((r, i) => (
          <div
            key={r.label}
            style={{
              display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14,
              padding: "13px 18px",
              borderBottom: i === rows.length - 1 ? "none" : "1px solid var(--border)",
              opacity: i < revealed ? 1 : 0,
              transform: i < revealed ? "translateY(0)" : "translateY(6px)",
              transition: "opacity .35s ease, transform .35s ease",
            }}
          >
            <div style={{ display: "flex", gap: 10, minWidth: 0 }}>
              <span style={{
                width: 6, height: 6, borderRadius: 999, background: "var(--accent)",
                flexShrink: 0, marginTop: 6,
              }} />
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 500,
                  color: "var(--text)", lineHeight: 1.35,
                }}>
                  {r.label}
                </div>
                <div style={{
                  fontFamily: "var(--font-sans)", fontSize: 12,
                  color: "var(--dim)", marginTop: 2, lineHeight: 1.35,
                }}>
                  {r.detail}
                </div>
              </div>
            </div>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 10,
              color: "var(--accent-soft)", letterSpacing: "0.06em",
              padding: "4px 9px", borderRadius: 999, whiteSpace: "nowrap",
              background: "var(--accent-tint)", border: "1px solid var(--accent-tint)",
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
