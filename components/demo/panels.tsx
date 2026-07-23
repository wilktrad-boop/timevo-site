import Donut from "./Donut";
import type { DemoDashboard } from "@/lib/demoDashboards";

/**
 * Les quatre panneaux du dashboard de démo, plus la barre de KPI.
 *
 * Tous des Server Components : aucun handler React ici, le hover passe par les
 * classes CSS de globals.css (cf. le 500 corrigé dans GeoPage, commit 8688f89).
 */

// ── Primitives locales ───────────────────────────────────────────────

/**
 * En-tête de panneau. Volontairement sec : un titre et une ligne de contexte
 * comme en afficherait une vraie application. L'argumentaire Timevo est sous
 * le cadre, dans la lecture commentée.
 */
function PanelTitle({ h2, meta }: { h2: string; meta: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "baseline", justifyContent: "space-between",
      gap: 20, flexWrap: "wrap",
      marginBottom: 28, paddingBottom: 16, borderBottom: "1px solid var(--border)",
    }}>
      <h2 style={{
        fontFamily: "var(--font-sans)", fontSize: 19, fontWeight: 500,
        letterSpacing: "-0.02em", margin: 0, color: "var(--text)",
      }}>
        {h2}
      </h2>
      <span style={{
        fontFamily: "var(--font-mono)", fontSize: 11,
        color: "var(--dim-2)", letterSpacing: "0.06em",
      }}>
        {meta}
      </span>
    </div>
  );
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <th scope="col" style={{
      textAlign: align,
      fontFamily: "var(--font-mono)", fontSize: 10.5, fontWeight: 400,
      color: "var(--dim-2)", letterSpacing: "0.12em", textTransform: "uppercase",
      padding: "0 16px 14px", whiteSpace: "nowrap",
    }}>
      {children}
    </th>
  );
}

const TONE_COLOR: Record<string, string> = {
  win: "#4ade80",
  loss: "#f87171",
  pending: "var(--accent)",
  ok: "#4ade80",
  wait: "#fbbf24",
};

function StatusPill({ label, tone }: { label: string; tone: string }) {
  const color = TONE_COLOR[tone] ?? "var(--dim)";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      padding: "5px 11px", borderRadius: 999,
      border: `1px solid ${color}33`, background: `${color}14`,
      fontFamily: "var(--font-sans)", fontSize: 12.5, fontWeight: 500,
      color, whiteSpace: "nowrap",
    }}>
      <span aria-hidden="true" style={{ width: 5, height: 5, borderRadius: 999, background: color }} />
      {label}
    </span>
  );
}

// ── Barre de KPI ─────────────────────────────────────────────────────

export function KpiRow({ d }: { d: DemoDashboard }) {
  return (
    <div className="demo-kpi-grid" style={{
      display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16, marginBottom: 40,
    }}>
      {d.kpis.map(kpi => (
        <div key={kpi.label} style={{
          padding: "24px 22px",
          background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16,
        }}>
          <div style={{
            fontFamily: "var(--font-sans)", fontSize: "clamp(28px, 3.4vw, 40px)", fontWeight: 500,
            letterSpacing: "-0.04em", lineHeight: 1, color: "var(--text)", marginBottom: 12,
          }}>
            {kpi.value}
          </div>
          <div style={{
            fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 500,
            color: "var(--text)", marginBottom: 4,
          }}>
            {kpi.label}
          </div>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--dim)", lineHeight: 1.4 }}>
            {kpi.detail}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── 1. Devis ─────────────────────────────────────────────────────────

const STEP_STYLE = {
  done: { bg: "var(--accent)", border: "var(--accent)", color: "var(--bg)" },
  active: { bg: "var(--accent-tint)", border: "var(--accent)", color: "var(--accent)" },
  pending: { bg: "transparent", border: "var(--border-strong)", color: "var(--dim-2)" },
} as const;

export function QuotesPanel({ d }: { d: DemoDashboard }) {
  return (
    <>
      <PanelTitle h2={d.quotesH2} meta={d.quotesMeta} />
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth: 720, borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <Th>{d.quotesCols.client}</Th>
              <Th align="right">{d.quotesCols.amount}</Th>
              <Th>{d.quotesCols.follow}</Th>
              <Th align="right">{d.quotesCols.outcome}</Th>
            </tr>
          </thead>
          <tbody>
            {d.quotes.map(q => (
              <tr key={q.client} className="demo-row">
                <td style={{ padding: "18px 16px", borderTop: "1px solid var(--border)" }}>
                  <div style={{
                    fontFamily: "var(--font-sans)", fontSize: 14.5, fontWeight: 500,
                    color: "var(--text)", marginBottom: 3,
                  }}>
                    {q.client}
                  </div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--dim)" }}>
                    {q.project}
                  </div>
                </td>
                <td style={{
                  padding: "18px 16px", borderTop: "1px solid var(--border)", textAlign: "right",
                  fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--text)", whiteSpace: "nowrap",
                }}>
                  {q.amount}
                </td>
                <td style={{ padding: "18px 16px", borderTop: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {q.steps.map((step, i) => {
                      const s = STEP_STYLE[step.state];
                      return (
                        <span key={step.label} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                          {i > 0 && (
                            <span aria-hidden="true" style={{ width: 14, height: 1, background: "var(--border-strong)" }} />
                          )}
                          <span style={{
                            padding: "3px 9px", borderRadius: 999,
                            background: s.bg, border: `1px solid ${s.border}`, color: s.color,
                            fontFamily: "var(--font-mono)", fontSize: 10.5, whiteSpace: "nowrap",
                          }}>
                            {step.label}
                          </span>
                        </span>
                      );
                    })}
                  </div>
                </td>
                <td style={{ padding: "18px 16px", borderTop: "1px solid var(--border)", textAlign: "right" }}>
                  <StatusPill label={q.outcome.label} tone={q.outcome.tone} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ── 2. Appels ────────────────────────────────────────────────────────

export function CallsPanel({ d }: { d: DemoDashboard }) {
  return (
    <>
      <PanelTitle h2={d.callsH2} meta={d.callsMeta} />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {d.calls.map(call => (
          <div key={call.from + call.at} style={{
            background: "var(--card)",
            border: `1px solid ${call.urgent ? "#f8717144" : "var(--border)"}`,
            borderRadius: 16, padding: "22px 24px",
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 12,
            }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text)" }}>
                {call.from}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--dim-2)" }}>
                {call.at}
              </span>
              {call.urgent && <StatusPill label={d.urgentLabel} tone="loss" />}
            </div>

            <p style={{
              fontFamily: "var(--font-sans)", fontSize: 14.5, lineHeight: 1.55,
              color: "var(--dim)", margin: 0, marginBottom: 16, maxWidth: 720,
            }}>
              {call.summary}
            </p>

            {/* <details> natif : contenu présent dans le HTML, zéro JavaScript. */}
            <details>
              <summary className="demo-summary" style={{
                fontFamily: "var(--font-mono)", fontSize: 11.5,
                color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase",
                cursor: "pointer", listStyle: "none", display: "inline-block",
              }}>
                {d.transcriptLabel}
              </summary>
              <div style={{
                marginTop: 18, paddingTop: 18, borderTop: "1px solid var(--border)",
                display: "flex", flexDirection: "column", gap: 14,
              }}>
                {call.transcript.map((line, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <span style={{
                      flex: "0 0 auto", marginTop: 2,
                      padding: "2px 8px", borderRadius: 999,
                      background: line.who === "ia" ? "var(--accent-tint)" : "var(--card-soft)",
                      border: `1px solid ${line.who === "ia" ? "var(--accent)" : "var(--border-strong)"}33`,
                      color: line.who === "ia" ? "var(--accent)" : "var(--dim)",
                      fontFamily: "var(--font-mono)", fontSize: 10,
                      letterSpacing: "0.08em", textTransform: "uppercase",
                    }}>
                      {line.who === "ia" ? "IA" : "Client"}
                    </span>
                    <p style={{
                      fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: 1.55,
                      color: line.who === "ia" ? "var(--dim)" : "var(--text)", margin: 0,
                    }}>
                      {line.text}
                    </p>
                  </div>
                ))}
              </div>
            </details>

            <div style={{
              marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--border)",
              fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--dim-2)",
              letterSpacing: "0.06em",
            }}>
              → {call.action}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── 3. Demandes ──────────────────────────────────────────────────────

function ScoreBar({ score, label }: { score: number; label: string }) {
  const color = score >= 70 ? "#4ade80" : score >= 40 ? "#fbbf24" : "#f87171";
  return (
    <div style={{ minWidth: 148 }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        marginBottom: 8, gap: 12,
      }}>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--dim-2)",
          letterSpacing: "0.12em", textTransform: "uppercase",
        }}>
          {label}
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 15, color }}>{score}</span>
      </div>
      <div
        role="img"
        aria-label={`${label} ${score}/100`}
        style={{ height: 5, borderRadius: 999, background: "var(--border)", overflow: "hidden" }}
      >
        <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: 999 }} />
      </div>
    </div>
  );
}

export function LeadsPanel({ d }: { d: DemoDashboard }) {
  return (
    <>
      <PanelTitle h2={d.leadsH2} meta={d.leadsMeta} />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {d.leads.map(lead => (
          <div key={lead.name} style={{
            background: "var(--card)", border: "1px solid var(--border)",
            borderRadius: 16, padding: "22px 24px",
            opacity: lead.rejected ? 0.72 : 1,
          }}>
            <div className="demo-lead-head" style={{
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
              gap: 24, marginBottom: 14,
            }}>
              <div>
                <div style={{
                  fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 500,
                  color: "var(--text)", marginBottom: 6,
                }}>
                  {lead.name}
                </div>
                <p style={{
                  fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: 1.55,
                  color: "var(--dim)", margin: 0, maxWidth: 620,
                }}>
                  {lead.request}
                </p>
              </div>
              <ScoreBar score={lead.score} label={d.scoreLabel} />
            </div>

            <div style={{
              fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--dim-2)",
              letterSpacing: "0.04em", marginBottom: lead.email ? 18 : 0,
            }}>
              {lead.verdict}
            </div>

            {lead.rejected && (
              <div style={{
                marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)",
                fontFamily: "var(--font-sans)", fontSize: 13.5, color: "var(--dim)", lineHeight: 1.5,
              }}>
                {lead.rejected}
              </div>
            )}

            {lead.email && (
              <div style={{
                background: "var(--card-soft)", border: "1px solid var(--border)",
                borderRadius: 12, padding: "18px 20px",
              }}>
                <div style={{
                  fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--accent)",
                  letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12,
                }}>
                  {d.emailReadyLabel}
                </div>
                <div style={{
                  fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500,
                  color: "var(--text)", marginBottom: 10,
                }}>
                  {lead.email.subject}
                </div>
                <p style={{
                  fontFamily: "var(--font-sans)", fontSize: 13.5, lineHeight: 1.6,
                  color: "var(--dim)", margin: 0, whiteSpace: "pre-line",
                }}>
                  {lead.email.body}
                </p>
                <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
                  {/* Boutons décoratifs : c'est une démonstration, ils n'agissent pas. */}
                  <span className="demo-btn demo-btn-primary" aria-hidden="true">{d.sendLabel}</span>
                  <span className="demo-btn" aria-hidden="true">{d.editLabel}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

// ── 4. Facturation ───────────────────────────────────────────────────

export function BillingPanel({ d }: { d: DemoDashboard }) {
  return (
    <>
      <PanelTitle h2={d.billingH2} meta={d.billingMeta} />

      <div className="demo-kpi-grid" style={{
        display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16, marginBottom: 32,
      }}>
        {d.billingStats.map(stat => (
          <div key={stat.label} style={{
            padding: "20px 22px", background: "var(--card)",
            border: "1px solid var(--border)", borderRadius: 16,
          }}>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--dim-2)",
              letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12,
            }}>
              {stat.label}
            </div>
            <div style={{
              fontFamily: "var(--font-sans)", fontSize: 26, fontWeight: 500,
              letterSpacing: "-0.03em", color: "var(--text)",
            }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: "var(--card)", border: "1px solid var(--border)",
        borderRadius: 16, padding: "26px 24px", marginBottom: 32,
      }}>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--dim-2)",
          letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 22,
        }}>
          {d.splitLabel}
        </div>
        <Donut segments={d.split} />
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth: 640, borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <Th>{d.invoicesCols.ref}</Th>
              <Th>{d.invoicesCols.client}</Th>
              <Th align="right">{d.invoicesCols.amount}</Th>
              <Th align="right">{d.invoicesCols.status}</Th>
            </tr>
          </thead>
          <tbody>
            {d.invoices.map(inv => (
              <tr key={inv.ref} className="demo-row">
                <td style={{
                  padding: "16px", borderTop: "1px solid var(--border)",
                  fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--dim)", whiteSpace: "nowrap",
                }}>
                  {inv.ref}
                </td>
                <td style={{
                  padding: "16px", borderTop: "1px solid var(--border)",
                  fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text)",
                }}>
                  {inv.client}
                </td>
                <td style={{
                  padding: "16px", borderTop: "1px solid var(--border)", textAlign: "right",
                  fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--text)", whiteSpace: "nowrap",
                }}>
                  {inv.amount}
                </td>
                <td style={{ padding: "16px", borderTop: "1px solid var(--border)", textAlign: "right" }}>
                  <StatusPill label={inv.status} tone={inv.tone} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
