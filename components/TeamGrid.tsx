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

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, maxWidth: 720 }} className="team-grid">
          {members.map((m, idx) => (
            <div key={m.name} style={{
              background: "var(--card)", border: "1px solid var(--border)",
              borderRadius: 20, overflow: "hidden",
            }}>

              {/* Human cards — photo placeholder */}
              {idx < 2 && (
                <div style={{
                  aspectRatio: "1 / 1.1",
                  background: "linear-gradient(135deg, var(--accent-tint), var(--card-soft))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-geist-sans)", fontSize: 64, fontWeight: 600,
                  color: "var(--dim-2)",
                }}>
                  {m.initials}
                </div>
              )}

              {/* AI card */}
              {idx === 2 && (
                <div style={{
                  aspectRatio: "1 / 1.1",
                  background: "linear-gradient(160deg, #080d1a 0%, #111827 100%)",
                  borderBottom: "1px solid var(--border)",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 20,
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "radial-gradient(ellipse at 50% 40%, rgba(95,168,255,0.18) 0%, transparent 65%)",
                  }} />
                  <div style={{
                    fontSize: 52, lineHeight: 1,
                    color: "#5fa8ff",
                    textShadow: "0 0 24px rgba(95,168,255,0.8)",
                    position: "relative",
                  }}>◉</div>
                  <div style={{
                    display: "flex", gap: 5, flexWrap: "wrap",
                    justifyContent: "center", padding: "0 24px",
                    position: "relative",
                  }}>
                    {[1,0,1,1,0,1,0,1,0,1,1,0,1,0,1,1,1,1,0,1,1,0,1,0].map((on, i) => (
                      <div key={i} style={{
                        width: 6, height: 6, borderRadius: 999,
                        background: on ? "#5fa8ff" : "var(--border-strong)",
                        opacity: on ? 0.3 + (i % 5) * 0.12 : 0.2,
                      }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Freelancers card */}
              {idx === 3 && (
                <div style={{
                  aspectRatio: "1 / 1.1",
                  background: "linear-gradient(160deg, #100f1a 0%, #111118 100%)",
                  borderBottom: "1px solid var(--border)",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 20,
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "radial-gradient(ellipse at 50% 45%, rgba(169,138,255,0.14) 0%, transparent 65%)",
                  }} />
                  {/* Stacked avatar circles */}
                  <div style={{ display: "flex", position: "relative" }}>
                    {[
                      { l: "D", c: "#c084fc" },
                      { l: "W", c: "#4ec3ff" },
                      { l: "C", c: "#fb923c" },
                      { l: "+", c: "#8a8a8a" },
                    ].map((r, i) => (
                      <div key={r.l} style={{
                        width: 48, height: 48, borderRadius: 999,
                        background: "var(--card-soft)",
                        border: "2.5px solid #0a0a0a",
                        marginLeft: i === 0 ? 0 : -14,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "var(--font-geist-sans)", fontSize: 16, fontWeight: 600,
                        color: r.c,
                        position: "relative", zIndex: 4 - i,
                      }}>
                        {r.l}
                      </div>
                    ))}
                  </div>
                  {/* Role pills */}
                  <div style={{ display: "flex", gap: 6, position: "relative" }}>
                    {["Design", "Web", "Copy"].map(label => (
                      <span key={label} style={{
                        fontFamily: "var(--font-geist-mono)", fontSize: 10,
                        color: "var(--dim)", letterSpacing: "0.06em",
                        padding: "3px 9px", borderRadius: 999,
                        border: "1px solid var(--border-strong)",
                      }}>
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

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
