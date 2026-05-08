"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const start = performance.now();
        const dur = 1600;
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(Math.round(eased * value));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      }
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value]);

  return (
    <div ref={ref} style={{ padding: "24px 0", borderTop: "1px solid var(--border)" }}>
      <div style={{
        fontFamily: "var(--font-geist-sans)", fontSize: "clamp(48px, 6vw, 88px)",
        fontWeight: 500, letterSpacing: "-0.05em", lineHeight: 0.95, color: "var(--text)",
      }}>
        {n}<span style={{ color: "var(--accent)" }}>{suffix}</span>
      </div>
      <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: "var(--dim)", marginTop: 12 }}>{label}</div>
    </div>
  );
}

export default function StatsBlock() {
  const t = useTranslations("stats");
  const items = t.raw("items") as { value: number; suffix: string; label: string }[];

  return (
    <section id="resultats" style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{
          fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--dim)",
          letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16,
        }}>
          {t("label")}
        </div>
        <h2 style={{
          fontFamily: "var(--font-geist-sans)", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 500,
          letterSpacing: "-0.04em", lineHeight: 1.0, margin: 0, marginBottom: 56,
          color: "var(--text)", maxWidth: 800,
        }}>
          {t("h2_line1")}<br />{t("h2_line2")}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }} className="stats-grid">
          {items.map(s => <StatCounter key={s.label} {...s} />)}
        </div>
      </div>
    </section>
  );
}
