"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function TestimonialBlock() {
  const t = useTranslations("testimonials");
  const items = t.raw("items") as { name: string; role: string; initials: string; quote: string }[];
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI(p => (p + 1) % items.length), 6000);
    return () => clearInterval(id);
  }, [items.length]);

  const it = items[i];

  return (
    <section style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{
          fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--dim)",
          letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16,
        }}>
          {t("label")}
        </div>
        <h2 style={{
          fontFamily: "var(--font-geist-sans)", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 500,
          letterSpacing: "-0.04em", lineHeight: 1.0, margin: 0, marginBottom: 56, color: "var(--text)",
        }}>
          {t("h2")}
        </h2>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 24, padding: 48 }}>
          <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 18, color: "var(--accent)", marginBottom: 18 }}>"</div>
          <p style={{
            fontFamily: "var(--font-geist-sans)", fontSize: "clamp(18px, 2vw, 28px)", fontWeight: 500,
            letterSpacing: "-0.02em", lineHeight: 1.3, color: "var(--text)", margin: 0, maxWidth: 900,
          }}>
            {it.quote}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 36 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 999,
              background: "linear-gradient(135deg, var(--accent), var(--accent-soft))",
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-geist-sans)", fontSize: 14, fontWeight: 600, flexShrink: 0,
            }}>{it.initials}</div>
            <div>
              <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{it.name}</div>
              <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "var(--dim)" }}>{it.role}</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              {(["←", "→"] as const).map((arrow, idx) => (
                <button key={arrow} onClick={() => setI(p => (p + (idx === 0 ? -1 : 1) + items.length) % items.length)}
                  style={{
                    width: 40, height: 40, borderRadius: 999,
                    border: "1px solid var(--border-strong)",
                    background: "transparent", color: "var(--text)", cursor: "pointer", fontSize: 16,
                  }}>
                  {arrow}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 24 }}>
            {items.map((_, idx) => (
              <button key={idx} onClick={() => setI(idx)} style={{
                width: 24, height: 3, borderRadius: 2, border: "none",
                background: idx === i ? "var(--accent)" : "var(--border-strong)",
                cursor: "pointer", padding: 0,
              }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
