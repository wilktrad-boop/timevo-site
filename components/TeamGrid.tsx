"use client";

import { useTranslations } from "next-intl";

// Deterministic dot pattern for AI card (40 dots, 0 = off, 1 = on)
const AI_DOTS = [
  1,0,1,1,0,1,0,1,
  0,1,1,0,1,0,1,1,
  1,1,0,1,1,0,1,0,
  0,1,0,1,0,1,1,1,
  1,0,1,0,1,1,0,1,
];

const FREELANCER_ROLES = [
  { letter: "D", color: "#c084fc" },
  { letter: "W", color: "#4ec3ff" },
  { letter: "C", color: "#fb923c" },
  { letter: "+", color: "var(--dim)" },
];

function AICardHeader() {
  return (
    <div style={{
      aspectRatio: "1 / 1.1",
      background: "linear-gradient(160deg, #0d0d1a 0%, var(--card-soft) 100%)",
      borderBottom: "1px solid var(--border)",
      position: "relative", overflow: "hidden",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 18,
    }}>
      {/* Radial glow */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(ellipse at 50% 40%, rgba(95,168,255,0.18) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      {/* Central symbol */}
      <div style={{
        fontFamily: "var(--font-geist-sans)", fontSize: 56, lineHeight: 1,
        color: "var(--accent)",
        filter: "drop-shadow(0 0 14px rgba(95,168,255,0.7))",
        position: "relative",
      }}>◉</div>

      {/* Activity matrix */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(8, 6px)", gap: 5,
        position: "relative",
      }}>
        {AI_DOTS.map((on, i) => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: 999,
            background: on ? "var(--accent)" : "var(--border-strong)",
            opacity: on ? 0.35 + (i % 7) * 0.09 : 0.25,
          }} />
        ))}
      </div>
    </div>
  );
}

function FreelancersCardHeader() {
  return (
    <div style={{
      aspectRatio: "1 / 1.1",
      background: "linear-gradient(160deg, var(--card-soft) 0%, #0f0f14 100%)",
      borderBottom: "1px solid var(--border)",
      position: "relative", overflow: "hidden",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 20,
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(ellipse at 50% 55%, rgba(169,138,255,0.12) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      {/* Stacked avatars */}
      <div style={{ position: "relative", width: 126, height: 52 }}>
        {FREELANCER_ROLES.map((r, i) => (
          <div key={r.letter} style={{
            position: "absolute",
            left: i * 30,
            top: 0,
            width: 52, height: 52, borderRadius: 999,
            background: "var(--card)",
            border: "2px solid var(--bg)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-geist-sans)", fontSize: 17, fontWeight: 600,
            color: r.color,
            zIndex: FREELANCER_ROLES.length - i,
            boxShadow: "0 0 0 1px var(--border)",
          }}>
            {r.letter}
          </div>
        ))}
      </div>

      {/* Role labels */}
      <div style={{
        display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center",
        padding: "0 20px",
      }}>
        {["Design", "Web", "Copy"].map(label => (
          <span key={label} style={{
            fontFamily: "var(--font-geist-mono)", fontSize: 10,
            color: "var(--dim)", letterSpacing: "0.08em",
            padding: "3px 8px", borderRadius: 999,
            border: "1px solid var(--border)",
          }}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

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
          {members.map((m, idx) => (
            <div key={m.name} style={{
              background: "var(--card)", border: "1px solid var(--border)",
              borderRadius: 20, overflow: "hidden",
            }}>
              {idx === 2 ? <AICardHeader /> :
               idx === 3 ? <FreelancersCardHeader /> : (
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
