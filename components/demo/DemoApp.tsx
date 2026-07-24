"use client";

import { useEffect, useRef, useState } from "react";
import { Billing, Calls, Leads, Overview, Quotes, Tone, type SectionKey } from "./sections";
import { dayLabel, duration, money, timeOfDay, type Range, type SortDir } from "@/lib/demo/compute";
import type { DemoCopy, Locale, SectorData } from "@/lib/demo/types";

/**
 * Le cadre applicatif d'une page de démo.
 *
 * Tout est calculé côté client à partir des enregistrements, mais le composant
 * est rendu par le serveur : le HTML servi contient déjà la vue par défaut
 * (vue d'ensemble, 30 jours). Les filtres ne font que recalculer par-dessus.
 *
 * **Indexabilité.** Les cinq sections et tous les panneaux de détail restent
 * dans le DOM, masqués par l'attribut `hidden` — la même règle que l'ancien
 * système d'onglets. `hidden` sort l'élément de l'arbre d'accessibilité sans le
 * retirer du HTML : le contenu est indexable et n'est pas dupliqué pour un
 * lecteur d'écran.
 *
 * **Garde-fous.** Les actions ne partent nulle part : elles changent l'état
 * local de la ligne et affichent un toast rédigé en langage d'application. La
 * barre « données fictives » reste collée en haut du cadre pendant qu'on
 * scrolle dedans, et le panneau de détail la reprend.
 */

const RANGES: Range[] = [7, 30, 90];
const TOAST_MS = 3200;

type Selection = { kind: SectionKey; id: string };

export default function DemoApp({
  data,
  copy,
  locale,
}: {
  data: SectorData;
  copy: DemoCopy;
  locale: Locale;
}) {
  const [section, setSection] = useState<SectionKey>("overview");
  const [range, setRange] = useState<Range>(30);
  const [selected, setSelected] = useState<Selection | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  /** id → action jouée. Les actions ne sortent pas d'ici. */
  const [overrides, setOverrides] = useState<Record<string, string>>({});

  const [quoteSort, setQuoteSort] = useState<{ k: string; d: SortDir }>({ k: "day", d: "asc" });
  const [leadSort, setLeadSort] = useState<{ k: string; d: SortDir }>({ k: "score", d: "desc" });
  const [filters, setFilters] = useState({ quotes: "all", calls: "all", leads: "all", billing: "all" });

  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function fire(message: string, id?: string, key?: string) {
    if (id && key) setOverrides(o => ({ ...o, [id]: key }));
    setToast(message);
    if (timer.current) clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), TOAST_MS);
  }

  function toggleSort(
    current: { k: string; d: SortDir },
    set: (v: { k: string; d: SortDir }) => void,
    k: string
  ) {
    set(current.k === k ? { k, d: current.d === "asc" ? "desc" : "asc" } : { k, d: "desc" });
  }

  const sections: { key: SectionKey; label: string }[] = [
    { key: "overview", label: copy.sections.overview },
    { key: "quotes", label: copy.sections.quotes },
    { key: "calls", label: copy.sections.calls },
    { key: "leads", label: copy.sections.leads },
    { key: "billing", label: copy.sections.billing },
  ];

  const open = (kind: SectionKey) => (id: string) =>
    setSelected(s => (s && s.kind === kind && s.id === id ? null : { kind, id }));

  return (
    <div style={{
      position: "relative",
      border: "1px solid var(--border-strong)",
      borderRadius: 20,
      overflow: "hidden",
      background: "var(--card)",
      boxShadow: "var(--shadow)",
    }}>
      {/* Barre « données fictives » — collante, pour rester lisible pendant le scroll. */}
      <div style={{
        position: "sticky", top: 0, zIndex: 3,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 16, flexWrap: "wrap",
        padding: "12px 20px",
        borderBottom: "1px solid var(--accent-tint)",
        background: "var(--accent-tint)",
        backdropFilter: "blur(8px)",
      }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <span aria-hidden="true" style={{
            width: 7, height: 7, borderRadius: 999, background: "var(--accent)", flexShrink: 0,
          }} />
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 11,
            color: "var(--accent-soft)", letterSpacing: "0.12em", textTransform: "uppercase",
          }}>
            {copy.demoBadge}
          </span>
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--dim-2)" }}>
          {data.company}
        </span>
      </div>

      <div className="demo-app" style={{ display: "grid", gridTemplateColumns: "212px minmax(0, 1fr)" }}>
        {/* Barre latérale */}
        <nav aria-label={copy.sections.overview} className="demo-side" style={{
          borderRight: "1px solid var(--border)",
          padding: "18px 12px",
          background: "var(--card-soft)",
        }}>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 2 }}>
            {sections.map(s => (
              <li key={s.key}>
                <button
                  type="button"
                  aria-current={section === s.key ? "page" : undefined}
                  onClick={() => { setSection(s.key); setSelected(null); }}
                  style={{
                    width: "100%", textAlign: "left", cursor: "pointer",
                    padding: "9px 12px", borderRadius: 9, border: "none",
                    background: section === s.key ? "var(--bg)" : "transparent",
                    color: section === s.key ? "var(--text)" : "var(--dim)",
                    fontFamily: "var(--font-sans)", fontSize: 13.5,
                    fontWeight: section === s.key ? 500 : 400,
                    boxShadow: section === s.key ? "var(--shadow)" : undefined,
                  }}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contenu */}
        <div style={{ minWidth: 0 }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 16, flexWrap: "wrap",
            padding: "16px 20px", borderBottom: "1px solid var(--border)",
          }}>
            <h2 style={{
              fontFamily: "var(--font-sans)", fontSize: 17, fontWeight: 500,
              color: "var(--text)", margin: 0, letterSpacing: "-0.01em",
            }}>
              {sections.find(s => s.key === section)?.label}
            </h2>
            <div role="group" aria-label={copy.ui.rangeLabel} style={{
              display: "flex", gap: 4, padding: 4, borderRadius: 999,
              background: "var(--card-soft)", border: "1px solid var(--border)",
            }}>
              {RANGES.map(r => (
                <button key={r} type="button" onClick={() => setRange(r)}
                  aria-pressed={range === r}
                  style={{
                    padding: "5px 12px", borderRadius: 999, border: "none", cursor: "pointer",
                    background: range === r ? "var(--text)" : "transparent",
                    color: range === r ? "var(--bg)" : "var(--dim)",
                    fontFamily: "var(--font-mono)", fontSize: 11.5, whiteSpace: "nowrap",
                  }}>
                  {r === 7 ? copy.ui.range7 : r === 30 ? copy.ui.range30 : copy.ui.range90}
                </button>
              ))}
            </div>
          </div>

          <div style={{ padding: 20 }}>
            <div hidden={section !== "overview"}>
              <Overview data={data} copy={copy} range={range} locale={locale} />
            </div>
            <div hidden={section !== "quotes"}>
              <Quotes
                data={data} copy={copy} range={range} locale={locale}
                sort={quoteSort.k} dir={quoteSort.d}
                onSort={k => toggleSort(quoteSort, setQuoteSort, k)}
                filter={filters.quotes} onFilter={f => setFilters(v => ({ ...v, quotes: f }))}
                onOpen={open("quotes")}
                selectedId={selected?.kind === "quotes" ? selected.id : null}
                overrides={overrides}
              />
            </div>
            <div hidden={section !== "calls"}>
              <Calls
                data={data} copy={copy} range={range} locale={locale}
                filter={filters.calls} onFilter={f => setFilters(v => ({ ...v, calls: f }))}
                onOpen={open("calls")}
                selectedId={selected?.kind === "calls" ? selected.id : null}
              />
            </div>
            <div hidden={section !== "leads"}>
              <Leads
                data={data} copy={copy} range={range} locale={locale}
                sort={leadSort.k} dir={leadSort.d}
                onSort={k => toggleSort(leadSort, setLeadSort, k)}
                filter={filters.leads} onFilter={f => setFilters(v => ({ ...v, leads: f }))}
                onOpen={open("leads")}
                selectedId={selected?.kind === "leads" ? selected.id : null}
              />
            </div>
            <div hidden={section !== "billing"}>
              <Billing
                data={data} copy={copy} range={range} locale={locale}
                filter={filters.billing} onFilter={f => setFilters(v => ({ ...v, billing: f }))}
                onOpen={open("billing")}
                selectedId={selected?.kind === "billing" ? selected.id : null}
                overrides={overrides}
              />
            </div>
          </div>
        </div>
      </div>

      <Drawer
        data={data} copy={copy} locale={locale}
        selected={selected} onClose={() => setSelected(null)}
        overrides={overrides} onAct={fire}
      />

      {/* Ancré à la fenêtre et non au cadre : le cadre dépasse largement la
          hauteur d'écran, un toast en bas de cadre s'affichait hors champ. */}
      {toast && (
        <div role="status" aria-live="polite" style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          zIndex: 40, maxWidth: "min(420px, calc(100vw - 36px))",
          padding: "11px 18px", borderRadius: 999,
          background: "var(--text)", color: "var(--bg)",
          fontFamily: "var(--font-sans)", fontSize: 13,
          boxShadow: "var(--shadow-lg)",
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}

// ── Panneau de détail ─────────────────────────────────────────────

/**
 * Tous les panneaux sont rendus, seul l'actif est visible. C'est ce qui garde
 * les transcriptions et les emails prérédigés dans le HTML servi, donc
 * indexables, comme dans la version à onglets.
 */
function Drawer({
  data, copy, locale, selected, onClose, overrides, onAct,
}: {
  data: SectorData; copy: DemoCopy; locale: Locale;
  selected: Selection | null; onClose: () => void;
  overrides: Record<string, string>;
  onAct: (message: string, id?: string, key?: string) => void;
}) {
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, onClose]);

  const panels: { kind: SectionKey; id: string; node: React.ReactNode }[] = [
    ...data.quotes.map(q => ({
      kind: "quotes" as SectionKey, id: q.id,
      node: <QuoteDetail q={q} copy={copy} locale={locale} overrides={overrides} onAct={onAct} />,
    })),
    ...data.calls.map(c => ({
      kind: "calls" as SectionKey, id: c.id,
      node: <CallDetail c={c} copy={copy} locale={locale} overrides={overrides} onAct={onAct} />,
    })),
    ...data.leads.map(l => ({
      kind: "leads" as SectionKey, id: l.id,
      node: <LeadDetail l={l} copy={copy} locale={locale} overrides={overrides} onAct={onAct} />,
    })),
    ...data.invoices.map(inv => ({
      kind: "billing" as SectionKey, id: inv.id,
      node: <InvoiceDetail inv={inv} copy={copy} locale={locale} overrides={overrides} onAct={onAct} />,
    })),
  ];

  return (
    <aside
      aria-label={copy.ui.detail}
      hidden={!selected}
      className="demo-drawer"
      style={{
        position: "absolute", top: 0, right: 0, bottom: 0, zIndex: 4,
        width: "min(420px, 100%)",
        background: "var(--bg)",
        borderLeft: "1px solid var(--border-strong)",
        boxShadow: "var(--shadow-lg)",
      }}
    >
      {/* Collé à la fenêtre dans les limites du cadre : sur un tableau long, un
          panneau ancré en haut du cadre se retrouvait au-dessus de l'écran. */}
      <div style={{
        position: "sticky", top: 0,
        maxHeight: "100vh",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 12, padding: "12px 16px 12px 18px", flexShrink: 0,
          borderBottom: "1px solid var(--border)", background: "var(--accent-tint)",
        }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.1em",
            textTransform: "uppercase", color: "var(--accent-soft)",
          }}>
            {copy.ui.fictionalReminder}
          </span>
          <button type="button" onClick={onClose} style={{
            padding: "5px 12px", borderRadius: 999, cursor: "pointer",
            border: "1px solid var(--border-strong)", background: "var(--bg)",
            color: "var(--dim)", fontFamily: "var(--font-sans)", fontSize: 12,
          }}>
            {copy.ui.close}
          </button>
        </div>

        <div style={{ overflowY: "auto", padding: 18 }}>
          {panels.map(p => (
            <div key={`${p.kind}-${p.id}`} hidden={!(selected?.kind === p.kind && selected.id === p.id)}>
              {p.node}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

const detailLabel: React.CSSProperties = {
  fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.1em",
  textTransform: "uppercase", color: "var(--dim-2)", marginBottom: 6,
};

const detailTitle: React.CSSProperties = {
  fontFamily: "var(--font-sans)", fontSize: 17, fontWeight: 500,
  color: "var(--text)", margin: "0 0 4px", letterSpacing: "-0.01em",
};

function Action({
  label, done, onClick,
}: { label: string; done: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} disabled={done} style={{
      padding: "9px 16px", borderRadius: 999, cursor: done ? "default" : "pointer",
      border: done ? "1px solid var(--border)" : "1px solid transparent",
      background: done ? "transparent" : "var(--accent-gradient)",
      color: done ? "var(--dim-2)" : "#fff",
      fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500,
    }}>
      {done ? `✓ ${label}` : label}
    </button>
  );
}

function QuoteDetail({
  q, copy, locale, overrides, onAct,
}: {
  q: SectorData["quotes"][number]; copy: DemoCopy; locale: Locale;
  overrides: Record<string, string>; onAct: (m: string, id?: string, k?: string) => void;
}) {
  const t = q[locale];
  const done = overrides[q.id];
  return (
    <div>
      <div style={detailLabel}>{copy.sections.quotes}</div>
      <h3 style={detailTitle}>{t.client}</h3>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, color: "var(--dim)", margin: "0 0 16px" }}>
        {t.project}
      </p>
      <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "8px 16px", margin: "0 0 20px" }}>
        <Def label={copy.quotesCols.amount} value={money(q.amount, locale)} />
        <Def label={copy.quotesCols.age} value={dayLabel(q.day, locale)} />
        <Def label={copy.quotesCols.follow} value={`${q.reminders}/3`} />
      </dl>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Action label={copy.quoteActions.remind} done={done === "reminded"}
          onClick={() => onAct(copy.quoteToasts.remind, q.id, "reminded")} />
        <Action label={copy.quoteActions.markWon} done={done === "win" || q.outcome === "win"}
          onClick={() => onAct(copy.quoteToasts.markWon, q.id, "win")} />
      </div>
    </div>
  );
}

function CallDetail({
  c, copy, locale, overrides, onAct,
}: {
  c: SectorData["calls"][number]; copy: DemoCopy; locale: Locale;
  overrides: Record<string, string>; onAct: (m: string, id?: string, k?: string) => void;
}) {
  const t = c[locale];
  return (
    <div>
      <div style={detailLabel}>{copy.sections.calls}</div>
      <h3 style={{ ...detailTitle, fontFamily: "var(--font-mono)", fontSize: 15 }}>{t.from}</h3>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--dim-2)", marginBottom: 14 }}>
        {dayLabel(c.day, locale)} · {timeOfDay(c.minute, locale)} · {duration(c.durationSec, locale)}
      </div>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, color: "var(--dim)", margin: "0 0 18px", lineHeight: 1.5 }}>
        {t.summary}
      </p>

      <div style={detailLabel}>{copy.transcriptLabel}</div>
      <div style={{ display: "grid", gap: 8, margin: "0 0 18px" }}>
        {t.transcript.map((line, i) => (
          <div key={i} style={{
            padding: "10px 12px", borderRadius: 10,
            background: line.who === "ia" ? "var(--accent-tint)" : "var(--card)",
            border: "1px solid var(--border)",
          }}>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: 9.5, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "var(--dim-2)", marginBottom: 4,
            }}>
              {line.who === "ia" ? "Agent" : "Client"}
            </div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--text)", lineHeight: 1.45 }}>
              {line.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 16 }}>
        <Tone
          label={t.action}
          tone={c.outcome === "escalated" ? "late" : "win"}
        />
      </div>
      <Action label={copy.callActions.callBack} done={overrides[c.id] === "called"}
        onClick={() => onAct(copy.callToasts.callBack, c.id, "called")} />
    </div>
  );
}

function LeadDetail({
  l, copy, locale, overrides, onAct,
}: {
  l: SectorData["leads"][number]; copy: DemoCopy; locale: Locale;
  overrides: Record<string, string>; onAct: (m: string, id?: string, k?: string) => void;
}) {
  const t = l[locale];
  return (
    <div>
      <div style={detailLabel}>{copy.sections.leads}</div>
      <h3 style={detailTitle}>{t.name}</h3>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, color: "var(--dim)", margin: "0 0 16px", lineHeight: 1.5 }}>
        {t.request}
      </p>
      <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "8px 16px", margin: "0 0 18px" }}>
        <Def label={copy.scoreLabel} value={String(l.score)} />
        <Def label={copy.quotesCols.age} value={dayLabel(l.day, locale)} />
      </dl>

      <div style={{
        padding: "12px 14px", borderRadius: 10, marginBottom: 18,
        background: "var(--card)", border: "1px solid var(--border)",
      }}>
        <div style={detailLabel}>{copy.emailReadyLabel}</div>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--dim)", margin: 0, lineHeight: 1.5 }}>
          {t.verdict}
        </p>
      </div>

      {t.email ? (
        <>
          <div style={{
            padding: "14px 16px", borderRadius: 10, marginBottom: 16,
            background: "var(--bg)", border: "1px solid var(--border-strong)",
          }}>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 500, color: "var(--text)", marginBottom: 8 }}>
              {t.email.subject}
            </div>
            <p style={{
              fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--dim)",
              margin: 0, whiteSpace: "pre-line", lineHeight: 1.55,
            }}>
              {t.email.body}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Action label={copy.leadActions.send} done={overrides[l.id] === "sent"}
              onClick={() => onAct(copy.leadToasts.send, l.id, "sent")} />
          </div>
        </>
      ) : (
        <p style={{
          fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--dim)",
          margin: 0, padding: "12px 14px", borderRadius: 10,
          background: "var(--card)", border: "1px solid var(--border)", lineHeight: 1.5,
        }}>
          {t.rejected}
        </p>
      )}
    </div>
  );
}

function InvoiceDetail({
  inv, copy, locale, overrides, onAct,
}: {
  inv: SectorData["invoices"][number]; copy: DemoCopy; locale: Locale;
  overrides: Record<string, string>; onAct: (m: string, id?: string, k?: string) => void;
}) {
  const t = inv[locale];
  const vat = Math.round(inv.amount * inv.vatRate);
  return (
    <div>
      <div style={detailLabel}>{copy.sections.billing}</div>
      <h3 style={{ ...detailTitle, fontFamily: "var(--font-mono)", fontSize: 15 }}>{t.ref}</h3>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, color: "var(--dim)", margin: "0 0 16px" }}>
        {t.client}
      </p>
      <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "8px 16px", margin: "0 0 20px" }}>
        <Def label={copy.invoicesCols.amount} value={money(inv.amount, locale)} />
        <Def label={copy.billingStats.vat} value={`${money(vat, locale)} · ${Math.round(inv.vatRate * 100)}%`} />
        <Def label={copy.invoicesCols.due} value={dayLabel(inv.day, locale)} />
      </dl>
      {!inv.paid && (
        <Action label={copy.invoiceActions.remind} done={overrides[inv.id] === "reminded"}
          onClick={() => onAct(copy.invoiceToasts.remind, inv.id, "reminded")} />
      )}
    </div>
  );
}

function Def({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt style={{
        fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--dim-2)",
        letterSpacing: "0.04em", whiteSpace: "nowrap",
      }}>
        {label}
      </dt>
      <dd style={{
        fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text)",
        margin: 0, fontVariantNumeric: "tabular-nums",
      }}>
        {value}
      </dd>
    </>
  );
}
