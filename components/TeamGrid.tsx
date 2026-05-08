"use client";

import { useTranslations } from "next-intl";

export default function TeamGrid() {
  const t = useTranslations("team");
  const members = t.raw("members") as { name: string; role: string; initials: string; bio: string }[];

  return (
    <section id="equipe" style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }} className="team-grid">
          {members.map(m => (
            <div key={m.name} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden" }}>
              <div style={{
                aspectRatio: "1 / 1.1",
                background: "linear-gradient(135deg, var(--accent-tint), var(--card-soft))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-geist-sans)", fontSize: 64, fontWeight: 600, color: "var(--dim)",
              }}>{m.initials}</div>
              <div style={{ padding: 20 }}>
                <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 20, fontWeight: 500, color: "var(--text)" }}>{m.name}</div>
                <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 12, color: "var(--accent-soft)", marginBottom: 10 }}>{m.role}</div>
                <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, lineHeight: 1.5, color: "var(--dim)", margin: 0 }}>{m.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
