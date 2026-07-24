import type {
  Call, DemoCopy, Invoice, KeyLabel, Lead, Locale, Quote, SectorData,
} from "./types";

/**
 * Tout ce qui se calcule à partir des enregistrements : formatage, filtres de
 * période, agrégats des graphiques.
 *
 * **Aucun appel à `Intl` ni à `Date` ici.** Les filtres recalculent côté client
 * ce que le serveur a déjà rendu ; la moindre différence de formatage entre
 * Node et le navigateur produirait une erreur d'hydratation. Les séparateurs
 * sont donc écrits en dur par locale, et les dates n'existent qu'en relatif
 * (`day` = ancienneté en jours) pour que la démo ne vieillisse pas toute seule.
 */

export type Range = 7 | 30 | 90;

const NNBSP = " "; // espace fine insécable — séparateur de milliers français
const NBSP = " ";  // espace insécable — devant le symbole €

// ── Formatage ─────────────────────────────────────────────────────

function groupDigits(n: number, separator: string): string {
  return String(Math.round(Math.abs(n))).replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

/** « 32 400 € » en français, « €32,400 » en anglais. */
export function money(amount: number, locale: Locale): string {
  const sign = amount < 0 ? "-" : "";
  return locale === "fr"
    ? `${sign}${groupDigits(amount, NNBSP)}${NBSP}€`
    : `${sign}€${groupDigits(amount, ",")}`;
}

export function count(n: number, locale: Locale): string {
  return groupDigits(n, locale === "fr" ? NNBSP : ",");
}

export function percent(ratio: number): string {
  return `${Math.round(ratio * 100)}%`;
}

/** « 14:35 » en français, « 2:35 pm » en anglais. */
export function timeOfDay(minute: number, locale: Locale): string {
  const h = Math.floor(minute / 60);
  const m = minute % 60;
  const mm = String(m).padStart(2, "0");
  if (locale === "fr") return `${String(h).padStart(2, "0")}:${mm}`;
  const suffix = h < 12 ? "am" : "pm";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mm}${NBSP}${suffix}`;
}

export function duration(seconds: number, locale: Locale): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return locale === "fr" ? `${m}${NBSP}min ${s}${NBSP}s` : `${m}m ${s}s`;
}

/** Ancienneté lisible, toujours relative. */
export function dayLabel(day: number, locale: Locale): string {
  if (day === 0) return locale === "fr" ? "Aujourd'hui" : "Today";
  if (day === 1) return locale === "fr" ? "Hier" : "Yesterday";
  return locale === "fr" ? `Il y a ${day}${NBSP}j` : `${day}d ago`;
}

/** Échéance d'une facture. Négatif = en retard. */
export function dueLabel(dueIn: number, locale: Locale): string {
  if (dueIn < 0) {
    const late = -dueIn;
    return locale === "fr" ? `${late}${NBSP}j de retard` : `${late}d overdue`;
  }
  if (dueIn === 0) return locale === "fr" ? "Échéance aujourd'hui" : "Due today";
  return locale === "fr" ? `Dans ${dueIn}${NBSP}j` : `In ${dueIn}d`;
}

export function labelFor(keys: KeyLabel[], key: string, locale: Locale): string {
  return keys.find(k => k.key === key)?.[locale] ?? key;
}

// ── Filtres de période ────────────────────────────────────────────

type Dated = { day: number };

export function withinRange<T extends Dated>(rows: T[], range: Range): T[] {
  return rows.filter(r => r.day <= range);
}

// ── Compteurs ─────────────────────────────────────────────────────

export type Kpi = { key: string; value: string; label: string; detail: string };

export function kpis(
  data: SectorData,
  copy: DemoCopy,
  range: Range,
  locale: Locale
): Kpi[] {
  const quotes = withinRange(data.quotes, range);
  const calls = withinRange(data.calls, range);
  const leads = withinRange(data.leads, range);

  const open = quotes.filter(q => q.outcome === "pending");
  const won = quotes.filter(q => q.outcome === "win");
  const wonTotal = won.reduce((sum, q) => sum + q.amount, 0);
  const escalated = calls.filter(c => c.outcome === "escalated");
  const accepted = leads.filter(l => l.accepted);
  const pendingWithReminder = open.filter(q => q.reminders > 0);

  return [
    {
      key: "openQuotes",
      value: count(open.length, locale),
      label: copy.kpis.openQuotes,
      detail: locale === "fr"
        ? `${pendingWithReminder.length} en relance programmée`
        : `${pendingWithReminder.length} in scheduled follow-up`,
    },
    {
      key: "signed",
      value: money(wonTotal, locale),
      label: copy.kpis.signed,
      detail: locale === "fr"
        ? `${won.length} devis`
        : `${won.length} ${won.length === 1 ? "quote" : "quotes"}`,
    },
    {
      key: "calls",
      value: count(calls.length, locale),
      label: copy.kpis.calls,
      detail: locale === "fr"
        ? `${escalated.length} escaladé${escalated.length > 1 ? "s" : ""} en SAV`
        : `${escalated.length} escalated to a human`,
    },
    {
      key: "leads",
      value: count(leads.length, locale),
      label: copy.kpis.leads,
      detail: locale === "fr"
        ? `${accepted.length} qualifiées · ${leads.length - accepted.length} écartées`
        : `${accepted.length} qualified · ${leads.length - accepted.length} discarded`,
    },
  ];
}

// ── Découpage temporel ────────────────────────────────────────────

export type Bucket = { label: string; value: number; /** Étiquette affichée sur l'axe ? */ tick: boolean };

/**
 * Taille de seau adaptée à la période, pour garder une dizaine de points quel
 * que soit le zoom : 1 jour sur 7 j, 2 jours sur 30 j, 1 semaine sur 90 j.
 */
function bucketPlan(range: Range): { size: number; n: number; every: number } {
  if (range === 7) return { size: 1, n: 7, every: 1 };
  if (range === 30) return { size: 2, n: 15, every: 3 };
  return { size: 7, n: 13, every: 2 };
}

function bucketLabel(range: Range, indexFromNow: number, locale: Locale): string {
  if (indexFromNow === 0) {
    if (range === 90) return locale === "fr" ? "Cette sem." : "This week";
    return locale === "fr" ? "Auj." : "Today";
  }
  if (range === 7) return locale === "fr" ? `J-${indexFromNow}` : `D-${indexFromNow}`;
  if (range === 30) return locale === "fr" ? `J-${indexFromNow * 2}` : `D-${indexFromNow * 2}`;
  return locale === "fr" ? `S-${indexFromNow}` : `W-${indexFromNow}`;
}

/** Somme d'une mesure par seau, du plus ancien au plus récent. */
function bucketize<T extends Dated>(
  rows: T[],
  range: Range,
  locale: Locale,
  measure: (row: T) => number
): Bucket[] {
  const { size, n, every } = bucketPlan(range);
  const totals = new Array(n).fill(0);

  for (const row of rows) {
    if (row.day > range) continue;
    const i = Math.min(n - 1, Math.floor(row.day / size));
    totals[i] += measure(row);
  }

  // `totals[0]` est le seau le plus récent : on inverse pour lire de gauche
  // (ancien) à droite (aujourd'hui), sens de lecture d'une série temporelle.
  return totals
    .map((value, i) => ({ label: bucketLabel(range, i, locale), value, tick: i % every === 0 }))
    .reverse();
}

/** CA signé par période. Série unique : pas de légende. */
export function signedOverTime(quotes: Quote[], range: Range, locale: Locale): Bucket[] {
  return bucketize(quotes.filter(q => q.outcome === "win"), range, locale, q => q.amount);
}

/** Devis envoyés et devis signés, en nombre. Deux séries. */
export function sentVsSigned(
  quotes: Quote[],
  range: Range,
  locale: Locale
): { sent: Bucket[]; signed: Bucket[] } {
  return {
    sent: bucketize(quotes, range, locale, () => 1),
    signed: bucketize(quotes.filter(q => q.outcome === "win"), range, locale, () => 1),
  };
}

// ── Répartition ───────────────────────────────────────────────────

export type Slice = { key: string; label: string; value: number };

/**
 * Répartition du CA signé par prestation.
 *
 * Plafonnée à trois parts nommées, le reste replié dans « Autres ». Ce n'est
 * pas un choix esthétique : le validateur de palette échoue au-delà de trois
 * teintes catégorielles sur ce fond (jaune et orange tombent à ΔE 13.7 en
 * vision normale, sous le plancher de 15). « Autres » est un gris neutre, pas
 * une quatrième teinte.
 */
export function revenueMix(
  quotes: Quote[],
  categories: KeyLabel[],
  range: Range,
  locale: Locale,
  otherLabel: string
): Slice[] {
  const totals = new Map<string, number>();
  for (const q of withinRange(quotes, range)) {
    if (q.outcome !== "win") continue;
    totals.set(q.category, (totals.get(q.category) ?? 0) + q.amount);
  }

  const sorted = [...totals.entries()]
    .map(([key, value]) => ({ key, label: labelFor(categories, key, locale), value }))
    .sort((a, b) => b.value - a.value);

  const named = sorted.slice(0, 3);
  const rest = sorted.slice(3).reduce((sum, s) => sum + s.value, 0);
  return rest > 0 ? [...named, { key: "other", label: otherLabel, value: rest }] : named;
}

/** Distribution des scores de qualification, par tranches de 20. */
export function scoreSpread(leads: Lead[], range: Range): { label: string; value: number }[] {
  const bands = [0, 0, 0, 0, 0];
  for (const l of withinRange(leads, range)) {
    bands[Math.min(4, Math.floor(l.score / 20))] += 1;
  }
  return bands.map((value, i) => ({ label: `${i * 20}–${i * 20 + 19}`, value }));
}

// ── Facturation ───────────────────────────────────────────────────

export type BillingTotals = {
  collected: number;
  vat: number;
  outstanding: number;
  overdue: number;
};

export function billingTotals(invoices: Invoice[], range: Range): BillingTotals {
  const rows = withinRange(invoices, range);
  let collected = 0, vat = 0, outstanding = 0, overdue = 0;

  for (const inv of rows) {
    if (inv.paid) {
      collected += inv.amount;
      vat += inv.amount * inv.vatRate;
    } else {
      outstanding += inv.amount;
      if (inv.dueIn < 0) overdue += inv.amount;
    }
  }
  return { collected, vat: Math.round(vat), outstanding, overdue };
}

/** Statut d'affichage d'une facture : payée, en attente, ou en retard. */
export function invoiceState(inv: Invoice): "paid" | "waiting" | "late" {
  if (inv.paid) return "paid";
  return inv.dueIn < 0 ? "late" : "waiting";
}

// ── Tri ───────────────────────────────────────────────────────────

export type SortDir = "asc" | "desc";

export function sortRows<T>(rows: T[], key: (row: T) => number | string, dir: SortDir): T[] {
  return [...rows].sort((a, b) => {
    const va = key(a), vb = key(b);
    const cmp = typeof va === "number" && typeof vb === "number"
      ? va - vb
      : String(va).localeCompare(String(vb));
    return dir === "asc" ? cmp : -cmp;
  });
}

/** Textes d'un enregistrement dans la locale courante. */
export function text<U>(row: { fr: U; en: U }, locale: Locale): U {
  return locale === "fr" ? row.fr : row.en;
}

export type { Call, Invoice, Lead, Quote };
