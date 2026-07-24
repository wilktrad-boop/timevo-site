"use client";

import { useEffect, useState } from "react";

/**
 * Compte à rebours jusqu'à l'obligation de réception des factures électroniques.
 *
 * L'échéance est ancrée sur Europe/Paris via un décalage explicite (+02:00,
 * heure d'été en vigueur au 1er septembre). Sans ça, un visiteur hors de France
 * verrait un décompte faux de plusieurs heures.
 *
 * Le rendu serveur affiche des tirets : calculer une durée pendant le SSR
 * produirait un écart d'hydratation à chaque chargement.
 */
const DEADLINE = Date.parse("2026-09-01T00:00:00+02:00");

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function remaining(now: number): Parts | null {
  const diff = DEADLINE - now;
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
  };
}

export default function DeadlineCountdown({
  labels,
  passedLabel,
}: {
  labels: { days: string; hours: string; minutes: string; seconds: string };
  passedLabel: string;
}) {
  const [parts, setParts] = useState<Parts | null | undefined>(undefined);

  useEffect(() => {
    setParts(remaining(Date.now()));
    const id = setInterval(() => setParts(remaining(Date.now())), 1000);
    return () => clearInterval(id);
  }, []);

  if (parts === null) {
    return (
      <p style={{
        fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--accent-soft)",
        margin: 0, letterSpacing: "0.02em",
      }}>
        {passedLabel}
      </p>
    );
  }

  const units: [string, string][] = [
    [parts ? String(parts.days) : "—", labels.days],
    [parts ? String(parts.hours).padStart(2, "0") : "—", labels.hours],
    [parts ? String(parts.minutes).padStart(2, "0") : "—", labels.minutes],
    [parts ? String(parts.seconds).padStart(2, "0") : "—", labels.seconds],
  ];

  return (
    <div style={{ display: "flex", gap: 8 }}>
      {units.map(([value, label]) => (
        <div key={label} style={{
          flex: 1,
          background: "var(--bg)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: "14px 4px",
          textAlign: "center",
        }}>
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(20px, 4vw, 26px)",
            fontWeight: 500,
            color: "var(--text)",
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1.1,
          }}>
            {value}
          </div>
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--dim-2)",
            marginTop: 6,
          }}>
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
