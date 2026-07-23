"use client";

import { useState } from "react";

/**
 * Onglets du dashboard de démo. Seul composant client de la page.
 *
 * Les panneaux arrivent déjà rendus côté serveur en `children` et restent TOUS
 * dans le DOM : les inactifs sont masqués en `display: none`, pas démontés.
 * Le contenu complet est donc présent dans le HTML servi, donc indexable.
 */
export default function DemoTabs({
  labels,
  children,
}: {
  labels: string[];
  children: React.ReactNode[];
}) {
  const [active, setActive] = useState(0);
  const panels = Array.isArray(children) ? children : [children];

  return (
    <div>
      <div
        role="tablist"
        aria-label={labels.join(", ")}
        className="demo-tablist"
        style={{
          display: "flex", gap: 6, marginBottom: 32,
          padding: 6, borderRadius: 999,
          background: "var(--card)", border: "1px solid var(--border)",
          width: "fit-content", maxWidth: "100%", overflowX: "auto",
        }}
      >
        {labels.map((label, i) => (
          <button
            key={label}
            type="button"
            role="tab"
            id={`demo-tab-${i}`}
            aria-selected={active === i}
            aria-controls={`demo-panel-${i}`}
            onClick={() => setActive(i)}
            style={{
              padding: "9px 18px", borderRadius: 999, border: "none", cursor: "pointer",
              background: active === i ? "var(--text)" : "transparent",
              color: active === i ? "var(--bg)" : "var(--dim)",
              fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 500,
              whiteSpace: "nowrap", transition: "background .15s, color .15s",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {panels.map((panel, i) => (
        <div
          key={i}
          role="tabpanel"
          id={`demo-panel-${i}`}
          aria-labelledby={`demo-tab-${i}`}
          hidden={active !== i}
          style={{ display: active === i ? "block" : "none" }}
        >
          {panel}
        </div>
      ))}
    </div>
  );
}
