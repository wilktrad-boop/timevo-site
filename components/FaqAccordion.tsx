"use client";

import { useState } from "react";

// Client island: the only interactive part of every FAQ block.
// Lets the surrounding page/section stay a Server Component.
export default function FaqAccordion({
  items,
  idPrefix,
  defaultOpen = 0,
}: {
  items: [string, string][];
  idPrefix: string;
  defaultOpen?: number;
}) {
  const [open, setOpen] = useState<number>(defaultOpen);

  return (
    <div>
      {items.map(([q, a], idx) => {
        const isOpen = open === idx;
        return (
          <div key={idx} style={{
            borderTop: "1px solid var(--border)",
            borderBottom: idx === items.length - 1 ? "1px solid var(--border)" : "none",
          }}>
            <h3 style={{ margin: 0 }}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : idx)}
                aria-expanded={isOpen}
                aria-controls={`${idPrefix}-panel-${idx}`}
                id={`${idPrefix}-trigger-${idx}`}
                style={{
                  width: "100%", padding: "24px 0", cursor: "pointer",
                  background: "transparent", border: "none",
                  display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24,
                  fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 500,
                  letterSpacing: "-0.01em", color: "var(--text)", textAlign: "left",
                }}>
                <span style={{ flex: 1 }}>{q}</span>
                <span aria-hidden="true" style={{
                  width: 32, height: 32, borderRadius: 999, flexShrink: 0,
                  border: "1px solid var(--border-strong)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: isOpen ? "var(--accent)" : "var(--dim)",
                  fontSize: 16,
                  transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                  transition: "transform .2s ease, color .2s ease",
                }}>+</span>
              </button>
            </h3>
            {isOpen && (
              <p id={`${idPrefix}-panel-${idx}`} role="region" aria-labelledby={`${idPrefix}-trigger-${idx}`}
                style={{
                  fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--dim)",
                  margin: "0 56px 24px 0", lineHeight: 1.6,
                }}>{a}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
