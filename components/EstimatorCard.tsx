"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Arrow, PillPrimary } from "./primitives";

const CALENDLY_URL = "https://calendly.com/timevo/audit";

// Logical values behind each option index
const TEAM_SIZE  = [3, 10, 30];      // people
const QUOTES     = [10, 40, 100];    // quotes/month
const HOURS      = [3, 10, 20];      // hours/week/person on repetitive tasks
const CRM_MULT   = [0.7, 1.0, 1.3]; // efficiency multiplier
const HOURLY     = [30, 50, 80];     // € value of an hour (based on ticket size)

function calcResult(ans: number[]) {
  const team     = TEAM_SIZE[ans[0]];
  const quotes   = QUOTES[ans[1]];
  const hrs      = HOURS[ans[2]];
  const mult     = CRM_MULT[ans[3]];
  const rate     = HOURLY[ans[4]];

  const repetitive  = hrs * team * 4.3 * 0.6;          // 60% recoverable
  const quoteSaving = quotes * 0.4;                      // 24 min saved per quote
  const totalHours  = Math.round((repetitive + quoteSaving) * mult);
  const monthlyGain = Math.round((totalHours * rate) / 100) * 100;
  const roiWeeks    = Math.max(1, Math.ceil(1800 / (monthlyGain / 4.3)));

  return { totalHours, monthlyGain, roiWeeks };
}

export default function EstimatorCard() {
  const t = useTranslations("estimator");
  const questions = t.raw("questions") as { q: string; opts: string[] }[];

  const [step, setStep]       = useState(0);          // 0–4 = questions, 5 = results
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);

  function choose(idx: number) {
    setSelected(idx);
    // short delay so selection is visible before advancing
    setTimeout(() => {
      const next = [...answers, idx];
      if (step < 4) {
        setAnswers(next);
        setStep(step + 1);
        setSelected(null);
      } else {
        setAnswers(next);
        setStep(5);
      }
    }, 280);
  }

  function restart() {
    setStep(0);
    setSelected(null);
    setAnswers([]);
  }

  const result = step === 5 ? calcResult(answers) : null;

  return (
    <section style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <div style={{
          fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--dim)",
          letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16,
        }}>
          {t("label")}
        </div>
        <h2 style={{
          fontFamily: "var(--font-geist-sans)", fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 500,
          letterSpacing: "-0.04em", lineHeight: 1.05, margin: 0, marginBottom: 12, color: "var(--text)",
          maxWidth: 720,
        }}>
          {t("h2")}
        </h2>
        <p style={{
          fontFamily: "var(--font-geist-sans)", fontSize: 16, color: "var(--dim)",
          maxWidth: 560, marginBottom: 48,
        }}>
          {t("subtitle")}
        </p>

        {/* Card */}
        <div style={{ maxWidth: 680, margin: "0 auto" }}>

          {step < 5 ? (
            <div style={{
              background: "var(--card)", border: "1px solid var(--border)",
              borderRadius: 24, padding: "40px 40px 36px",
              position: "relative", overflow: "hidden",
            }}>

              {/* Glow */}
              <div style={{
                position: "absolute", top: -80, right: -60, width: 280, height: 280,
                borderRadius: 999, background: "var(--accent-glow)", filter: "blur(60px)",
                pointerEvents: "none",
              }} />

              {/* Progress */}
              <div style={{ display: "flex", gap: 6, marginBottom: 32 }}>
                {questions.map((_, i) => (
                  <div key={i} style={{
                    flex: 1, height: 3, borderRadius: 2,
                    background: i < step
                      ? "var(--accent)"
                      : i === step
                        ? "var(--border-strong)"
                        : "var(--border)",
                    transition: "background 0.3s",
                  }} />
                ))}
              </div>

              {/* Counter */}
              <div style={{
                fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--accent)",
                letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 18,
              }}>
                {t("counter", { n: step + 1 })}
              </div>

              {/* Question */}
              <div style={{
                fontFamily: "var(--font-geist-sans)", fontSize: "clamp(18px, 2.5vw, 24px)",
                fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.25,
                color: "var(--text)", marginBottom: 28,
              }}>
                {questions[step].q}
              </div>

              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {questions[step].opts.map((opt, idx) => {
                  const isSelected = selected === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => choose(idx)}
                      disabled={selected !== null}
                      style={{
                        padding: "16px 20px",
                        border: `1px solid ${isSelected ? "var(--accent)" : "var(--border-strong)"}`,
                        borderRadius: 12,
                        background: isSelected ? "var(--accent-tint)" : "transparent",
                        cursor: selected !== null ? "default" : "pointer",
                        fontFamily: "var(--font-geist-sans)", fontSize: 15,
                        color: isSelected ? "var(--text)" : "var(--dim)",
                        textAlign: "left", display: "flex", justifyContent: "space-between",
                        alignItems: "center",
                        transition: "border-color 0.15s, background 0.15s, color 0.15s",
                      }}
                      onMouseEnter={e => {
                        if (selected === null) {
                          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-strong)";
                          (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
                        }
                      }}
                      onMouseLeave={e => {
                        if (selected === null && selected !== idx) {
                          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-strong)";
                          (e.currentTarget as HTMLButtonElement).style.color = "var(--dim)";
                        }
                      }}
                    >
                      <span>{opt}</span>
                      {isSelected && (
                        <span style={{
                          width: 20, height: 20, borderRadius: 999,
                          background: "var(--accent)",
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          fontSize: 11, color: "#fff", flexShrink: 0,
                        }}>✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

          ) : result && (
            /* Results */
            <div style={{
              background: "var(--card)", border: "1px solid var(--accent)",
              borderRadius: 24, padding: "40px 40px 36px",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: -80, right: -60, width: 320, height: 320,
                borderRadius: 999, background: "var(--accent-glow)", filter: "blur(60px)",
                pointerEvents: "none",
              }} />

              <div style={{
                fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "var(--accent)",
                letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 28,
              }}>
                {t("result_label")}
              </div>

              {/* 3 stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 36 }}
                className="estimator-result-grid">
                <ResultStat value={`${result.totalHours}h`} label={t("result_hours_label")} accent />
                <ResultStat value={`${result.monthlyGain.toLocaleString("fr-FR")}€`} label={t("result_value_label")} />
                <ResultStat value={`${result.roiWeeks}`} label={t("result_roi_label")} />
              </div>

              {/* CTA */}
              <div style={{ marginBottom: 20 }}>
                <PillPrimary href={CALENDLY_URL} large>
                  {t("result_cta")} <Arrow color="#fff" />
                </PillPrimary>
              </div>

              <p style={{
                fontFamily: "var(--font-geist-sans)", fontSize: 12, color: "var(--dim-2)",
                margin: 0, lineHeight: 1.5, marginBottom: 20,
              }}>
                {t("result_disclaimer")}
              </p>

              <button onClick={restart} style={{
                background: "transparent", border: "none", cursor: "pointer",
                fontFamily: "var(--font-geist-sans)", fontSize: 13,
                color: "var(--dim)", textDecoration: "underline",
                padding: 0,
              }}>
                {t("restart")}
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

function ResultStat({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <div style={{
      background: "var(--bg)", border: "1px solid var(--border)",
      borderRadius: 16, padding: "20px 16px",
    }}>
      <div style={{
        fontFamily: "var(--font-geist-sans)",
        fontSize: "clamp(28px, 4vw, 40px)",
        fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 1,
        color: accent ? "var(--accent)" : "var(--text)",
        marginBottom: 8,
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: "var(--font-geist-sans)", fontSize: 12,
        color: "var(--dim)", lineHeight: 1.4,
      }}>
        {label}
      </div>
    </div>
  );
}
