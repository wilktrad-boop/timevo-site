import { theme } from "@/lib/theme";

/**
 * Primitives de graphiques des dashboards de démo. SVG inline, aucune
 * dépendance, rendues côté serveur.
 *
 * Palette catégorielle passée au validateur avant d'être retenue :
 * indigo / orange / vert d'eau passent tous les seuils en paires adjacentes,
 * mais une quatrième teinte échoue (jaune contre orange tombe à ΔE 13.7 en
 * vision normale, sous le plancher de 15). D'où le plafond à trois teintes
 * nommées, tout le reste étant replié dans un « Autres » gris — jamais une
 * quatrième couleur.
 *
 * Le vert d'eau est sous 3:1 sur le fond clair : la règle de relief impose des
 * étiquettes visibles. Le donut porte donc systématiquement sa légende chiffrée,
 * et jamais la couleur seule pour identifier une part.
 *
 * Les formes suivent la nature de la donnée. Le chiffre signé par période est
 * une suite de totaux discrets, souvent nuls : ce sont des barres, pas une
 * courbe — une aire suggérerait une continuité qui n'existe pas.
 */

export const SERIES = [theme.accent, "#eb6834", "#1baf7a"] as const;
export const SERIES_OTHER = "#9aa0ac";

const W = 640;
const H = 190;
const PAD_BOTTOM = 24;
const PAD_TOP = 16;
const GAP = 2;
const RADIUS = 4;

/** Barre à extrémité haute arrondie, ancrée sur la ligne de base. */
function barPath(x: number, y: number, w: number, baseline: number): string {
  const h = baseline - y;
  if (h <= 0) return "";
  const r = Math.min(RADIUS, w / 2, h);
  return [
    `M${x},${baseline}`,
    `L${x},${y + r}`,
    `Q${x},${y} ${x + r},${y}`,
    `L${x + w - r},${y}`,
    `Q${x + w},${y} ${x + w},${y + r}`,
    `L${x + w},${baseline}`,
    "Z",
  ].join(" ");
}

function Grid({ baseline, max, format }: { baseline: number; max: number; format: (v: number) => string }) {
  const lines = [0.5, 1];
  return (
    <>
      {lines.map(f => {
        const y = baseline - (baseline - PAD_TOP) * f;
        return (
          <line key={f} x1={0} y1={y} x2={W} y2={y}
            stroke="var(--border)" strokeWidth={1} strokeDasharray="3 4" />
        );
      })}
      <line x1={0} y1={baseline} x2={W} y2={baseline} stroke="var(--border-strong)" strokeWidth={1} />
      <text x={0} y={PAD_TOP - 5} fill="var(--dim-2)"
        style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}>
        {format(max)}
      </text>
    </>
  );
}

function Ticks({ points, baseline }: { points: { label: string; tick: boolean }[]; baseline: number }) {
  const slot = W / points.length;
  return (
    <>
      {points.map((p, i) =>
        p.tick ? (
          <text key={i} x={i * slot + slot / 2} y={baseline + 15} textAnchor="middle"
            fill="var(--dim-2)" style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}>
            {p.label}
          </text>
        ) : null
      )}
    </>
  );
}

/**
 * Série unique de totaux par période. Pas de légende : le titre nomme la série.
 * La barre la plus haute porte son étiquette, les autres non — un chiffre sur
 * chaque barre serait du bruit.
 */
export function BarSeries({
  points,
  format,
  title,
}: {
  points: { label: string; value: number; tick: boolean }[];
  format: (v: number) => string;
  title: string;
}) {
  const baseline = H - PAD_BOTTOM;
  const max = Math.max(1, ...points.map(p => p.value));
  const slot = W / points.length;
  const barW = Math.max(2, slot - GAP);
  const peak = points.reduce((best, p, i) => (p.value > points[best].value ? i : best), 0);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label={title}
      style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}>
      <Grid baseline={baseline} max={max} format={format} />
      {points.map((p, i) => {
        const h = (baseline - PAD_TOP) * (p.value / max);
        const x = i * slot + GAP / 2;
        const y = baseline - h;
        return (
          <g key={i}>
            {p.value > 0 && <path d={barPath(x, y, barW, baseline)} fill={SERIES[0]} />}
            <rect x={i * slot} y={PAD_TOP} width={slot} height={baseline - PAD_TOP} fill="transparent">
              <title>{`${p.label} · ${format(p.value)}`}</title>
            </rect>
            {i === peak && p.value > 0 && (
              <text x={x + barW / 2} y={y - 6} textAnchor="middle" fill="var(--text)"
                style={{ fontFamily: "var(--font-mono)", fontSize: 10.5 }}>
                {format(p.value)}
              </text>
            )}
          </g>
        );
      })}
      <Ticks points={points} baseline={baseline} />
    </svg>
  );
}

/** Deux séries de comptages par période. Légende obligatoire à partir de deux séries. */
export function GroupedBarSeries({
  a,
  b,
  labelA,
  labelB,
  title,
}: {
  a: { label: string; value: number; tick: boolean }[];
  b: { label: string; value: number }[];
  labelA: string;
  labelB: string;
  title: string;
}) {
  const baseline = H - PAD_BOTTOM;
  const max = Math.max(1, ...a.map(p => p.value), ...b.map(p => p.value));
  const slot = W / a.length;
  const barW = Math.max(2, (slot - GAP * 2) / 2);

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label={title}
        style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}>
        <Grid baseline={baseline} max={max} format={v => String(Math.round(v))} />
        {a.map((p, i) => {
          const x0 = i * slot + GAP / 2;
          const hA = (baseline - PAD_TOP) * (p.value / max);
          const hB = (baseline - PAD_TOP) * ((b[i]?.value ?? 0) / max);
          return (
            <g key={i}>
              {p.value > 0 && (
                <path d={barPath(x0, baseline - hA, barW, baseline)} fill={SERIES[0]}>
                  <title>{`${p.label} · ${labelA} ${p.value}`}</title>
                </path>
              )}
              {(b[i]?.value ?? 0) > 0 && (
                <path d={barPath(x0 + barW + GAP, baseline - hB, barW, baseline)} fill={SERIES[1]}>
                  <title>{`${p.label} · ${labelB} ${b[i].value}`}</title>
                </path>
              )}
            </g>
          );
        })}
        <Ticks points={a} baseline={baseline} />
      </svg>
      <Legend items={[{ color: SERIES[0], label: labelA }, { color: SERIES[1], label: labelB }]} />
    </div>
  );
}

export function Legend({ items }: { items: { color: string; label: string; value?: string }[] }) {
  return (
    <ul style={{
      display: "flex", flexWrap: "wrap", gap: "8px 20px",
      listStyle: "none", margin: "14px 0 0", padding: 0,
    }}>
      {items.map(it => (
        <li key={it.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span aria-hidden="true" style={{
            width: 10, height: 10, borderRadius: 3, background: it.color, flexShrink: 0,
          }} />
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--dim)" }}>
            {it.label}
          </span>
          {it.value && (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text)" }}>
              {it.value}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

/**
 * Répartition en anneau. La légende chiffrée est obligatoire, pas décorative :
 * le vert d'eau passe sous 3:1 sur ce fond, donc l'identité d'une part ne peut
 * jamais reposer sur la couleur seule.
 */
export function Donut({
  slices,
  format,
  title,
}: {
  slices: { key: string; label: string; value: number }[];
  format: (v: number) => string;
  title: string;
}) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  const size = 190;
  const r = 74;
  const stroke = 26;
  const c = size / 2;
  const circumference = 2 * Math.PI * r;
  // Écart de surface entre segments : 2 unités, comme entre deux barres.
  const gapLen = total > 0 && slices.length > 1 ? 2 : 0;

  let offset = 0;
  const colorFor = (i: number, key: string) =>
    key === "other" ? SERIES_OTHER : SERIES[Math.min(i, SERIES.length - 1)];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label={title}
        style={{ display: "block" }}>
        <circle cx={c} cy={c} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        {total > 0 && slices.map((s, i) => {
          const len = (s.value / total) * circumference;
          const dash = Math.max(0, len - gapLen);
          const el = (
            <circle key={s.key} cx={c} cy={c} r={r} fill="none"
              stroke={colorFor(i, s.key)} strokeWidth={stroke}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${c} ${c})`}>
              <title>{`${s.label} · ${format(s.value)}`}</title>
            </circle>
          );
          offset += len;
          return el;
        })}
        <text x={c} y={c - 2} textAnchor="middle" fill="var(--text)"
          style={{ fontFamily: "var(--font-sans)", fontSize: 20, fontWeight: 500 }}>
          {format(total)}
        </text>
        <text x={c} y={c + 16} textAnchor="middle" fill="var(--dim-2)"
          style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em" }}>
          TOTAL
        </text>
      </svg>
      <Legend items={slices.map((s, i) => ({
        color: colorFor(i, s.key),
        label: s.label,
        value: format(s.value),
      }))} />
    </div>
  );
}

/** Histogramme de scores. Même forme que BarSeries, sans notion de période. */
export function Histogram({
  bands,
  title,
}: {
  bands: { label: string; value: number }[];
  title: string;
}) {
  const h = 130;
  const baseline = h - PAD_BOTTOM;
  const max = Math.max(1, ...bands.map(b => b.value));
  const slot = W / bands.length;
  // Marques fines : on plafonne la largeur, sinon cinq tranches sur 640 unités
  // donnent des barres beaucoup trop épaisses.
  const barW = Math.min(54, slot - GAP * 6);

  return (
    <svg viewBox={`0 0 ${W} ${h}`} width={W} height={h} role="img" aria-label={title}
      style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}>
      <line x1={0} y1={baseline} x2={W} y2={baseline} stroke="var(--border-strong)" strokeWidth={1} />
      {bands.map((b, i) => {
        const bh = (baseline - PAD_TOP) * (b.value / max);
        const x = i * slot + (slot - barW) / 2;
        return (
          <g key={b.label}>
            {b.value > 0 && (
              <path d={barPath(x, baseline - bh, barW, baseline)} fill={SERIES[0]}>
                <title>{`${b.label} · ${b.value}`}</title>
              </path>
            )}
            {b.value > 0 && (
              <text x={x + barW / 2} y={baseline - bh - 6} textAnchor="middle" fill="var(--text)"
                style={{ fontFamily: "var(--font-mono)", fontSize: 10.5 }}>
                {b.value}
              </text>
            )}
            <text x={x + barW / 2} y={baseline + 15} textAnchor="middle" fill="var(--dim-2)"
              style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}>
              {b.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
