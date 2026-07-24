"use client";

import {
  BarSeries, Donut, GroupedBarSeries, Histogram, SERIES,
} from "./charts";
import {
  billingTotals, count, dayLabel, dueLabel, duration, invoiceState, kpis,
  labelFor, money, revenueMix, scoreSpread, signedOverTime, sortRows,
  timeOfDay, withinRange, type Range, type SortDir,
} from "@/lib/demo/compute";
import type {
  Call, DemoCopy, Invoice, Lead, Locale, Quote, SectorData,
} from "@/lib/demo/types";

/**
 * Les cinq sections du dashboard de démo. Purement présentationnelles : tout
 * l'état vit dans DemoApp.
 *
 * Règle éditoriale : ici, uniquement du langage d'application. Aucun
 * argumentaire, aucune formule de vente. La lecture commentée, sous le cadre,
 * est le seul endroit où Timevo parle.
 */

export type SectionKey = "overview" | "quotes" | "calls" | "leads" | "billing";

const cell: React.CSSProperties = {
  padding: "13px 16px",
  fontFamily: "var(--font-sans)",
  fontSize: 13.5,
  color: "var(--text)",
  textAlign: "left",
  verticalAlign: "top",
};

const head: React.CSSProperties = {
  padding: "0 16px 10px",
  fontFamily: "var(--font-mono)",
  fontSize: 10.5,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--dim-2)",
  textAlign: "left",
  whiteSpace: "nowrap",
};

const num: React.CSSProperties = { fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" };

export function Tone({ label, tone }: { label: string; tone: "win" | "loss" | "pending" | "late" }) {
  const color =
    tone === "win" ? "#15803d" : tone === "loss" ? "#b91c1c" : tone === "late" ? "#b45309" : "var(--accent)";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      padding: "4px 10px", borderRadius: 999, whiteSpace: "nowrap",
      border: `1px solid ${color}33`, background: `${color}14`, color,
      fontFamily: "var(--font-sans)", fontSize: 12,
    }}>
      <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: 999, background: color }} />
      {label}
    </span>
  );
}

function SortHead({
  label, active, dir, onSort,
}: { label: string; active: boolean; dir: SortDir; onSort: () => void }) {
  return (
    <th scope="col" style={head}>
      <button type="button" onClick={onSort} style={{
        all: "unset", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5,
        color: active ? "var(--text)" : "inherit",
      }}>
        {label}
        <span aria-hidden="true" style={{ opacity: active ? 1 : 0.35, fontSize: 9 }}>
          {active && dir === "asc" ? "▲" : "▼"}
        </span>
      </button>
    </th>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "var(--bg)", border: "1px solid var(--border)",
      borderRadius: 16, padding: 20,
    }}>
      <h3 style={{
        fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500,
        color: "var(--text)", margin: "0 0 18px",
      }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <p style={{
      fontFamily: "var(--font-sans)", fontSize: 13.5, color: "var(--dim)",
      padding: "28px 16px", margin: 0,
    }}>
      {label}
    </p>
  );
}

function Table({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620 }}>{children}</table>
    </div>
  );
}

function Row({
  onOpen, selected, children,
}: { onOpen: () => void; selected: boolean; children: React.ReactNode }) {
  return (
    <tr
      onClick={onOpen}
      tabIndex={0}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(); } }}
      className="demo-row"
      style={{
        borderTop: "1px solid var(--border)", cursor: "pointer",
        background: selected ? "var(--accent-tint)" : undefined,
      }}
    >
      {children}
    </tr>
  );
}

// ── Vue d'ensemble ────────────────────────────────────────────────

export function Overview({
  data, copy, range, locale,
}: { data: SectorData; copy: DemoCopy; range: Range; locale: Locale }) {
  const tiles = kpis(data, copy, range, locale);
  const signed = signedOverTime(data.quotes, range, locale);
  const mix = revenueMix(data.quotes, data.categories, range, locale, copy.charts.other);
  const inRange = withinRange(data.quotes, range);
  // Comptages par seau : même découpage temporel que la courbe du chiffre signé.
  const counts = {
    sent: bucketCounts(inRange, range, locale),
    signed: bucketCounts(inRange.filter(q => q.outcome === "win"), range, locale),
  };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div className="demo-kpi-grid" style={{
        display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12,
      }}>
        {tiles.map(k => (
          <div key={k.key} style={{
            background: "var(--bg)", border: "1px solid var(--border)",
            borderRadius: 14, padding: "18px 18px 16px",
          }}>
            <div style={{
              fontFamily: "var(--font-sans)", fontSize: 28, fontWeight: 500,
              letterSpacing: "-0.03em", color: "var(--text)", ...num,
            }}>
              {k.value}
            </div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--text)", marginTop: 4 }}>
              {k.label}
            </div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--dim)", marginTop: 2 }}>
              {k.detail}
            </div>
          </div>
        ))}
      </div>

      <div className="demo-charts-grid" style={{
        display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)", gap: 20,
      }}>
        <Card title={copy.charts.signedOverTime}>
          <BarSeries points={signed} format={v => money(v, locale)} title={copy.charts.signedOverTime} />
        </Card>
        <Card title={copy.charts.revenueMix}>
          <Donut slices={mix} format={v => money(v, locale)} title={copy.charts.revenueMix} />
        </Card>
      </div>

      <Card title={copy.charts.quotesSentVsSigned}>
        <GroupedBarSeries
          a={counts.sent}
          b={counts.signed}
          labelA={copy.charts.sent}
          labelB={copy.charts.signed}
          title={copy.charts.quotesSentVsSigned}
        />
      </Card>
    </div>
  );
}

/** Comptage par seau, aligné sur le découpage temporel des graphiques. */
function bucketCounts(rows: { day: number }[], range: Range, locale: Locale) {
  const template = signedOverTime([], range, locale);
  const size = range === 7 ? 1 : range === 30 ? 2 : 7;
  const n = template.length;
  const totals = new Array(n).fill(0);
  for (const r of rows) {
    if (r.day > range) continue;
    totals[Math.min(n - 1, Math.floor(r.day / size))] += 1;
  }
  return totals.map((value, i) => ({ ...template[n - 1 - i], value })).reverse();
}

// ── Devis ─────────────────────────────────────────────────────────

export function Quotes({
  data, copy, range, locale, sort, dir, onSort, filter, onFilter, onOpen, selectedId, overrides,
}: {
  data: SectorData; copy: DemoCopy; range: Range; locale: Locale;
  sort: string; dir: SortDir; onSort: (k: string) => void;
  filter: string; onFilter: (f: string) => void;
  onOpen: (id: string) => void; selectedId: string | null;
  overrides: Record<string, string>;
}) {
  const outcomeOf = (q: Quote) => (overrides[q.id] === "win" ? "win" : q.outcome);
  let rows = withinRange(data.quotes, range);
  if (filter !== "all") rows = rows.filter(q => outcomeOf(q) === filter);
  rows = sortRows(rows, q => (sort === "amount" ? q.amount : sort === "day" ? -q.day : q[locale].client), dir);

  return (
    <div>
      <Filters
        options={[
          { key: "all", label: copy.ui.all },
          { key: "pending", label: copy.outcomes.pending },
          { key: "win", label: copy.outcomes.win },
          { key: "loss", label: copy.outcomes.loss },
        ]}
        active={filter}
        onPick={onFilter}
        hint={copy.ui.rowHint}
      />
      {rows.length === 0 ? <Empty label={copy.ui.empty} /> : (
        <Table>
          <thead>
            <tr>
              <SortHead label={copy.quotesCols.client} active={sort === "client"} dir={dir} onSort={() => onSort("client")} />
              <SortHead label={copy.quotesCols.amount} active={sort === "amount"} dir={dir} onSort={() => onSort("amount")} />
              <th scope="col" style={head}>{copy.quotesCols.follow}</th>
              <SortHead label={copy.quotesCols.age} active={sort === "day"} dir={dir} onSort={() => onSort("day")} />
              <th scope="col" style={head}>{copy.quotesCols.outcome}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(q => {
              const t = q[locale];
              const outcome = outcomeOf(q);
              return (
                <Row key={q.id} onOpen={() => onOpen(q.id)} selected={selectedId === q.id}>
                  <td style={cell}>
                    <div style={{ fontWeight: 500 }}>{t.client}</div>
                    <div style={{ color: "var(--dim)", fontSize: 12.5, marginTop: 2 }}>{t.project}</div>
                  </td>
                  <td style={{ ...cell, ...num, whiteSpace: "nowrap" }}>{money(q.amount, locale)}</td>
                  <td style={cell}>
                    <span aria-hidden="true" style={{ display: "inline-flex", gap: 4 }}>
                      {[0, 1, 2].map(i => (
                        <span key={i} style={{
                          width: 18, height: 4, borderRadius: 2,
                          background: i < q.reminders ? SERIES[0] : "var(--border-strong)",
                        }} />
                      ))}
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--dim-2)", marginLeft: 8 }}>
                      {q.reminders}/3
                    </span>
                  </td>
                  <td style={{ ...cell, color: "var(--dim)", fontSize: 12.5, whiteSpace: "nowrap" }}>
                    {dayLabel(q.day, locale)}
                  </td>
                  <td style={cell}>
                    <Tone label={copy.outcomes[outcome]} tone={outcome} />
                  </td>
                </Row>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
}

// ── Appels ────────────────────────────────────────────────────────

export function Calls({
  data, copy, range, locale, filter, onFilter, onOpen, selectedId,
}: {
  data: SectorData; copy: DemoCopy; range: Range; locale: Locale;
  filter: string; onFilter: (f: string) => void;
  onOpen: (id: string) => void; selectedId: string | null;
}) {
  let rows = withinRange(data.calls, range);
  if (filter !== "all") rows = rows.filter(c => c.outcome === filter);
  rows = sortRows(rows, c => c.day * 1440 - c.minute, "asc");

  return (
    <div>
      <Filters
        options={[
          { key: "all", label: copy.ui.all },
          { key: "handled", label: copy.callOutcomes.handled },
          { key: "escalated", label: copy.callOutcomes.escalated },
        ]}
        active={filter}
        onPick={onFilter}
        hint={copy.ui.rowHint}
      />
      {rows.length === 0 ? <Empty label={copy.ui.empty} /> : (
        <div>
          {rows.map(c => {
            const t = c[locale];
            return (
              <div
                key={c.id}
                onClick={() => onOpen(c.id)}
                tabIndex={0}
                onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(c.id); } }}
                className="demo-row"
                style={{
                  borderTop: "1px solid var(--border)", cursor: "pointer",
                  padding: "15px 16px", display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) auto", gap: 16, alignItems: "start",
                  background: selectedId === c.id ? "var(--accent-tint)" : undefined,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text)" }}>
                      {t.from}
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--dim-2)" }}>
                      {dayLabel(c.day, locale)} · {timeOfDay(c.minute, locale)} · {duration(c.durationSec, locale)}
                    </span>
                    {c.urgent && <Tone label={copy.urgentLabel} tone="late" />}
                  </div>
                  <p style={{
                    fontFamily: "var(--font-sans)", fontSize: 13.5, color: "var(--dim)",
                    margin: "6px 0 0", lineHeight: 1.45,
                  }}>
                    {t.summary}
                  </p>
                </div>
                <Tone
                  label={c.outcome === "escalated" ? copy.callOutcomes.escalated : copy.callOutcomes.handled}
                  tone={c.outcome === "escalated" ? "loss" : "win"}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Demandes ──────────────────────────────────────────────────────

export function Leads({
  data, copy, range, locale, sort, dir, onSort, filter, onFilter, onOpen, selectedId,
}: {
  data: SectorData; copy: DemoCopy; range: Range; locale: Locale;
  sort: string; dir: SortDir; onSort: (k: string) => void;
  filter: string; onFilter: (f: string) => void;
  onOpen: (id: string) => void; selectedId: string | null;
}) {
  let rows = withinRange(data.leads, range);
  if (filter === "accepted") rows = rows.filter(l => l.accepted);
  if (filter === "rejected") rows = rows.filter(l => !l.accepted);
  rows = sortRows(rows, l => (sort === "score" ? l.score : -l.day), dir);

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <Card title={copy.charts.scoreSpread}>
        <Histogram bands={scoreSpread(data.leads, range)} title={copy.charts.scoreSpread} />
      </Card>

      <div>
        <Filters
          options={[
            { key: "all", label: copy.ui.all },
            { key: "accepted", label: copy.leadFilters.accepted },
            { key: "rejected", label: copy.leadFilters.rejected },
          ]}
          active={filter}
          onPick={onFilter}
          hint={copy.ui.rowHint}
        />
        {rows.length === 0 ? <Empty label={copy.ui.empty} /> : (
          <Table>
            <thead>
              <tr>
                <th scope="col" style={head}>{copy.quotesCols.client}</th>
                <SortHead label={copy.scoreLabel} active={sort === "score"} dir={dir} onSort={() => onSort("score")} />
                <th scope="col" style={head}>{copy.quotesCols.age}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(l => {
                const t = l[locale];
                return (
                  <Row key={l.id} onOpen={() => onOpen(l.id)} selected={selectedId === l.id}>
                    <td style={cell}>
                      <div style={{ fontWeight: 500 }}>{t.name}</div>
                      <div style={{ color: "var(--dim)", fontSize: 12.5, marginTop: 2, maxWidth: 520 }}>
                        {t.request}
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--dim-2)", marginTop: 6 }}>
                        {labelFor(data.sources, l.source, locale)}
                      </div>
                    </td>
                    <td style={cell}>
                      <ScoreBar score={l.score} accepted={l.accepted} />
                    </td>
                    <td style={{ ...cell, color: "var(--dim)", fontSize: 12.5, whiteSpace: "nowrap" }}>
                      {dayLabel(l.day, locale)}
                    </td>
                  </Row>
                );
              })}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
}

function ScoreBar({ score, accepted }: { score: number; accepted: boolean }) {
  const color = accepted ? SERIES[0] : "#b91c1c";
  return (
    <div style={{ minWidth: 120 }}>
      <div style={{ ...num, fontSize: 13, color: "var(--text)", marginBottom: 6 }}>{score}</div>
      <div style={{ height: 5, borderRadius: 3, background: "var(--border)", overflow: "hidden" }}>
        <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: 3 }} />
      </div>
    </div>
  );
}

// ── Facturation ───────────────────────────────────────────────────

export function Billing({
  data, copy, range, locale, filter, onFilter, onOpen, selectedId, overrides,
}: {
  data: SectorData; copy: DemoCopy; range: Range; locale: Locale;
  filter: string; onFilter: (f: string) => void;
  onOpen: (id: string) => void; selectedId: string | null;
  overrides: Record<string, string>;
}) {
  const totals = billingTotals(data.invoices, range);
  let rows = withinRange(data.invoices, range);
  const stateOf = (inv: Invoice) => (overrides[inv.id] === "reminded" ? "waiting" : invoiceState(inv));
  if (filter !== "all") rows = rows.filter(inv => stateOf(inv) === filter);
  rows = sortRows(rows, inv => -inv.day, "asc");

  const stats = [
    { label: copy.billingStats.collected, value: money(totals.collected, locale) },
    { label: copy.billingStats.vat, value: money(totals.vat, locale) },
    { label: copy.billingStats.outstanding, value: money(totals.outstanding, locale) },
    { label: copy.billingStats.overdue, value: money(totals.overdue, locale) },
  ];

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div className="demo-kpi-grid" style={{
        display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12,
      }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 14, padding: "16px 18px",
          }}>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 500, color: "var(--text)", ...num }}>
              {s.value}
            </div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--dim)", marginTop: 4 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div>
        <Filters
          options={[
            { key: "all", label: copy.ui.all },
            { key: "paid", label: copy.invoiceStatus.paid },
            { key: "waiting", label: copy.invoiceStatus.waiting },
            { key: "late", label: copy.invoiceStatus.late },
          ]}
          active={filter}
          onPick={onFilter}
          hint={copy.ui.rowHint}
        />
        {rows.length === 0 ? <Empty label={copy.ui.empty} /> : (
          <Table>
            <thead>
              <tr>
                <th scope="col" style={head}>{copy.invoicesCols.ref}</th>
                <th scope="col" style={head}>{copy.invoicesCols.client}</th>
                <th scope="col" style={head}>{copy.invoicesCols.amount}</th>
                <th scope="col" style={head}>{copy.invoicesCols.due}</th>
                <th scope="col" style={head}>{copy.invoicesCols.status}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(inv => {
                const t = inv[locale];
                const st = stateOf(inv);
                return (
                  <Row key={inv.id} onOpen={() => onOpen(inv.id)} selected={selectedId === inv.id}>
                    <td style={{ ...cell, ...num, fontSize: 12.5, whiteSpace: "nowrap" }}>{t.ref}</td>
                    <td style={cell}>{t.client}</td>
                    <td style={{ ...cell, ...num, whiteSpace: "nowrap" }}>{money(inv.amount, locale)}</td>
                    <td style={{ ...cell, color: st === "late" ? "#b45309" : "var(--dim)", fontSize: 12.5, whiteSpace: "nowrap" }}>
                      {dueLabel(inv.dueIn, locale)}
                    </td>
                    <td style={cell}>
                      <Tone
                        label={copy.invoiceStatus[st]}
                        tone={st === "paid" ? "win" : st === "late" ? "late" : "pending"}
                      />
                    </td>
                  </Row>
                );
              })}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
}

// ── Barre de filtres ──────────────────────────────────────────────

export function Filters({
  options, active, onPick, hint,
}: {
  options: { key: string; label: string }[];
  active: string;
  onPick: (k: string) => void;
  hint: string;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 16, flexWrap: "wrap", marginBottom: 14,
    }}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {options.map(o => (
          <button key={o.key} type="button" onClick={() => onPick(o.key)} style={{
            padding: "6px 13px", borderRadius: 999, cursor: "pointer",
            border: `1px solid ${active === o.key ? "transparent" : "var(--border-strong)"}`,
            background: active === o.key ? "var(--text)" : "transparent",
            color: active === o.key ? "var(--bg)" : "var(--dim)",
            fontFamily: "var(--font-sans)", fontSize: 12.5, whiteSpace: "nowrap",
          }}>
            {o.label}
          </button>
        ))}
      </div>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--dim-2)" }}>
        {hint}
      </span>
    </div>
  );
}

export type { Call, Invoice, Lead, Quote };
