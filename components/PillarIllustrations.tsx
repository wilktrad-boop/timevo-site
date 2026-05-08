// SVG schématiques abstraits pour les headers de cartes piliers
// Accent couleur, semi-transparent, pas de pictogrammes clichés

export function IllustrationAutomatisation() {
  return (
    <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.55 }}>
      {/* Nodes */}
      <rect x="28" y="80" width="72" height="40" rx="8" stroke="#5fa8ff" strokeWidth="1.5" />
      <rect x="164" y="48" width="72" height="40" rx="8" stroke="#5fa8ff" strokeWidth="1.5" />
      <rect x="164" y="112" width="72" height="40" rx="8" stroke="#5fa8ff" strokeWidth="1.5" />
      <rect x="300" y="80" width="72" height="40" rx="8" stroke="#7c4dff" strokeWidth="1.5" fill="rgba(124,77,255,0.08)" />

      {/* Arrows top path */}
      <path d="M100 88 L164 68" stroke="#5fa8ff" strokeWidth="1.2" strokeDasharray="4 3" />
      {/* Arrows bottom path */}
      <path d="M100 112 L164 132" stroke="#5fa8ff" strokeWidth="1.2" strokeDasharray="4 3" />
      {/* Top → right */}
      <path d="M236 68 L300 96" stroke="#7c4dff" strokeWidth="1.2" strokeDasharray="4 3" />
      {/* Bottom → right */}
      <path d="M236 132 L300 104" stroke="#7c4dff" strokeWidth="1.2" strokeDasharray="4 3" />

      {/* Arrow heads */}
      <path d="M160 65 l4 3 -4 3" stroke="#5fa8ff" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M160 129 l4 3 -4 3" stroke="#5fa8ff" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M296 93 l4 3 -4 3" stroke="#7c4dff" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M296 101 l4 3 -4 3" stroke="#7c4dff" strokeWidth="1.2" strokeLinecap="round" />

      {/* Node labels */}
      <rect x="36" y="93" width="48" height="6" rx="3" fill="#5fa8ff" opacity="0.3" />
      <rect x="172" y="61" width="40" height="6" rx="3" fill="#5fa8ff" opacity="0.3" />
      <rect x="172" y="125" width="48" height="6" rx="3" fill="#5fa8ff" opacity="0.3" />
      <rect x="308" y="93" width="40" height="6" rx="3" fill="#7c4dff" opacity="0.5" />

      {/* Dot indicator on final node */}
      <circle cx="316" cy="108" r="3" fill="#7c4dff" opacity="0.7" />
      <circle cx="328" cy="108" r="3" fill="#7c4dff" opacity="0.5" />
      <circle cx="340" cy="108" r="3" fill="#7c4dff" opacity="0.3" />
    </svg>
  );
}

export function IllustrationAgentsIA() {
  return (
    <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.55 }}>
      {/* Bulle gauche (utilisateur) */}
      <rect x="28" y="30" width="180" height="48" rx="12" stroke="#5fa8ff" strokeWidth="1.5" />
      <path d="M48 78 L40 92 L60 78" stroke="#5fa8ff" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="40" y="44" width="120" height="7" rx="3.5" fill="#5fa8ff" opacity="0.35" />
      <rect x="40" y="57" width="80" height="7" rx="3.5" fill="#5fa8ff" opacity="0.2" />

      {/* Bulle droite (agent) */}
      <rect x="192" y="96" width="180" height="64" rx="12" stroke="#7c4dff" strokeWidth="1.5" fill="rgba(124,77,255,0.06)" />
      <path d="M352 160 L360 174 L340 160" stroke="#7c4dff" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="204" y="110" width="140" height="7" rx="3.5" fill="#7c4dff" opacity="0.4" />
      <rect x="204" y="123" width="110" height="7" rx="3.5" fill="#7c4dff" opacity="0.25" />
      <rect x="204" y="136" width="60" height="7" rx="3.5" fill="#7c4dff" opacity="0.15" />

      {/* Typing indicator — bulle courte gauche */}
      <rect x="28" y="116" width="72" height="36" rx="12" stroke="#5fa8ff" strokeWidth="1.2" opacity="0.5" />
      <circle cx="52" cy="134" r="4" fill="#5fa8ff" opacity="0.5" />
      <circle cx="64" cy="134" r="4" fill="#5fa8ff" opacity="0.35" />
      <circle cx="76" cy="134" r="4" fill="#5fa8ff" opacity="0.2" />
    </svg>
  );
}

export function IllustrationConseil() {
  return (
    <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.55 }}>
      {/* Ligne de timeline */}
      <line x1="40" y1="100" x2="360" y2="100" stroke="#5fa8ff" strokeWidth="1.5" />

      {/* Points et étapes */}
      {[60, 140, 220, 300, 360].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy="100" r={i === 4 ? 10 : 7}
            stroke={i === 4 ? "#7c4dff" : "#5fa8ff"}
            strokeWidth="1.5"
            fill={i === 4 ? "rgba(124,77,255,0.15)" : "rgba(10,10,10,0.8)"} />
          {i < 4 && <circle cx={x} cy="100" r="3" fill="#5fa8ff" opacity="0.6" />}
          {i === 4 && <circle cx={x} cy="100" r="4" fill="#7c4dff" opacity="0.8" />}
          {/* Labels alternés haut/bas */}
          <rect x={x - 24} y={i % 2 === 0 ? 64 : 116} width="48" height="7" rx="3.5"
            fill={i === 4 ? "#7c4dff" : "#5fa8ff"}
            opacity={i === 4 ? 0.5 : 0.3} />
          {i < 3 && (
            <rect x={x - 16} y={i % 2 === 0 ? 76 : 128} width="32" height="5" rx="2.5"
              fill="#5fa8ff" opacity="0.15" />
          )}
          {/* Trait vertical */}
          <line x1={x} y1="100" x2={x} y2={i % 2 === 0 ? 71 : 123}
            stroke={i === 4 ? "#7c4dff" : "#5fa8ff"}
            strokeWidth="1" opacity="0.4" strokeDasharray="3 2" />
        </g>
      ))}
    </svg>
  );
}

export function IllustrationSitesWeb() {
  return (
    <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.55 }}>
      {/* Fenêtre browser */}
      <rect x="40" y="24" width="320" height="152" rx="10" stroke="#5fa8ff" strokeWidth="1.5" />
      {/* Barre du haut */}
      <line x1="40" y1="52" x2="360" y2="52" stroke="#5fa8ff" strokeWidth="1" opacity="0.5" />
      {/* Dots */}
      <circle cx="58" cy="38" r="4" fill="#5fa8ff" opacity="0.5" />
      <circle cx="74" cy="38" r="4" fill="#5fa8ff" opacity="0.3" />
      <circle cx="90" cy="38" r="4" fill="#5fa8ff" opacity="0.2" />
      {/* Barre URL */}
      <rect x="108" y="30" width="200" height="16" rx="8" stroke="#5fa8ff" strokeWidth="1" opacity="0.3" />
      <rect x="116" y="35" width="80" height="6" rx="3" fill="#5fa8ff" opacity="0.2" />

      {/* Contenu — Hero block */}
      <rect x="56" y="68" width="180" height="32" rx="6" fill="#5fa8ff" opacity="0.12" stroke="#5fa8ff" strokeWidth="1" />
      <rect x="64" y="76" width="100" height="8" rx="4" fill="#5fa8ff" opacity="0.35" />
      <rect x="64" y="88" width="64" height="6" rx="3" fill="#5fa8ff" opacity="0.2" />

      {/* CTA pill */}
      <rect x="56" y="108" width="80" height="24" rx="12" fill="rgba(124,77,255,0.2)" stroke="#7c4dff" strokeWidth="1.2" />
      <rect x="72" y="116" width="48" height="7" rx="3.5" fill="#7c4dff" opacity="0.5" />

      {/* Image placeholder */}
      <rect x="252" y="64" width="92" height="76" rx="8" stroke="#5fa8ff" strokeWidth="1" opacity="0.3"
        fill="rgba(95,168,255,0.04)" />
      <line x1="252" y1="64" x2="344" y2="140" stroke="#5fa8ff" strokeWidth="0.8" opacity="0.2" />
      <line x1="344" y1="64" x2="252" y2="140" stroke="#5fa8ff" strokeWidth="0.8" opacity="0.2" />

      {/* Bottom nav links */}
      {[56, 100, 144, 188].map(x => (
        <rect key={x} x={x} y="152" width="36" height="6" rx="3" fill="#5fa8ff" opacity="0.15" />
      ))}
    </svg>
  );
}

export function IllustrationSEO() {
  return (
    <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.55 }}>
      {/* Grille de fond */}
      {[0, 1, 2, 3].map(i => (
        <line key={`h${i}`} x1="40" y1={160 - i * 36} x2="360" y2={160 - i * 36}
          stroke="#5fa8ff" strokeWidth="0.6" opacity="0.15" />
      ))}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <line key={`v${i}`} x1={40 + i * 64} y1="52" x2={40 + i * 64} y2="160"
          stroke="#5fa8ff" strokeWidth="0.6" opacity="0.15" />
      ))}

      {/* Barres */}
      {[
        { x: 56, h: 60, color: "#5fa8ff", op: 0.25 },
        { x: 120, h: 80, color: "#5fa8ff", op: 0.3 },
        { x: 184, h: 56, color: "#5fa8ff", op: 0.25 },
        { x: 248, h: 96, color: "#7c4dff", op: 0.35 },
        { x: 312, h: 120, color: "#7c4dff", op: 0.5 },
      ].map(({ x, h, color, op }) => (
        <rect key={x} x={x} y={160 - h} width="32" height={h} rx="4"
          fill={color} opacity={op} />
      ))}

      {/* Courbe de tendance */}
      <path d="M72 148 C120 140, 152 130, 200 124 C248 118, 280 100, 328 68"
        stroke="#7c4dff" strokeWidth="2" strokeLinecap="round" opacity="0.7" />

      {/* Point final avec halo */}
      <circle cx="328" cy="68" r="10" fill="rgba(124,77,255,0.15)" />
      <circle cx="328" cy="68" r="5" fill="#7c4dff" opacity="0.8" />

      {/* Flèche vers le haut */}
      <path d="M328 52 L328 44 M322 50 L328 44 L334 50"
        stroke="#7c4dff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
    </svg>
  );
}
