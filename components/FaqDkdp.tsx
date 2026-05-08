"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function FaqDkdp() {
  const t = useTranslations("faq");
  const items = t.raw("items") as string[][];
  const [open, setOpen] = useState<number>(0);

  return (
    <section id="faq" style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{
          fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--dim)",
          letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16,
        }}>
          {t("label")}
        </div>
        <h2 style={{
          fontFamily: "var(--font-geist-sans)", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 500,
          letterSpacing: "-0.04em", lineHeight: 1.0, margin: 0, marginBottom: 48, color: "var(--text)",
        }}>
          {t("h2")}
        </h2>
        <div>
          {items.map(([q, a], idx) => (
            <div key={idx} onClick={() => setOpen(open === idx ? -1 : idx)}
              style={{
                borderTop: "1px solid var(--border)",
                borderBottom: idx === items.length - 1 ? "1px solid var(--border)" : "none",
                padding: "24px 0", cursor: "pointer",
              }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
                <h3 style={{
                  fontFamily: "var(--font-geist-sans)", fontSize: 18, fontWeight: 500,
                  letterSpacing: "-0.01em", margin: 0, color: "var(--text)", flex: 1,
                }}>{q}</h3>
                <span style={{
                  width: 32, height: 32, borderRadius: 999, flexShrink: 0,
                  border: "1px solid var(--border-strong)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: open === idx ? "var(--accent)" : "var(--dim)",
                  fontSize: 16,
                  transform: open === idx ? "rotate(45deg)" : "rotate(0deg)",
                  transition: "transform .2s ease, color .2s ease",
                }}>+</span>
              </div>
              {open === idx && (
                <p style={{
                  fontFamily: "var(--font-geist-sans)", fontSize: 15, color: "var(--dim)",
                  margin: "14px 56px 0 0", lineHeight: 1.6,
                }}>{a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
