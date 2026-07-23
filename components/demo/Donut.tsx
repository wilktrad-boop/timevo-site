/**
 * Donut SVG écrit à la main. Pas de Chart.js : rendu côté serveur, aucune
 * dépendance, aucun décalage de mise en page au chargement.
 *
 * Les segments sont tracés avec un seul cercle par part, en jouant sur
 * stroke-dasharray et stroke-dashoffset.
 */
export default function Donut({
  segments,
  size = 168,
  thickness = 18,
}: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  if (total <= 0) return null;

  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  let consumed = 0;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap" }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={segments.map(s => `${s.label} ${s.value}%`).join(", ")}
        style={{ flex: "0 0 auto" }}
      >
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth={thickness}
          />
          {segments.map(seg => {
            const length = (seg.value / total) * circumference;
            const offset = -(consumed / total) * circumference;
            consumed += seg.value;
            return (
              <circle
                key={seg.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={thickness}
                // Le petit retrait laisse un filet de fond entre deux parts.
                strokeDasharray={`${Math.max(length - 2, 0)} ${circumference}`}
                strokeDashoffset={offset}
                strokeLinecap="butt"
              />
            );
          })}
        </g>
      </svg>

      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        {segments.map(seg => (
          <li key={seg.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              aria-hidden="true"
              style={{ width: 10, height: 10, borderRadius: 3, background: seg.color, flex: "0 0 auto" }}
            />
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text)" }}>
              {seg.label}
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--dim)" }}>
              {seg.value}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
