"use client";

import React from "react";

// ── SVG Glyphs ────────────────────────────────────────────────────────

export const Arrow = ({ size = 14, color = "currentColor", stroke = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={{ flex: "0 0 auto" }}>
    <path d="M2 7h10M8 3l4 4-4 4" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ArrowDown = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path d="M7 2v10M3 8l4 4 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Check = ({ color, size = 18 }: { color: string; size?: number }) => (
  <span style={{
    width: size, height: size, flex: `0 0 ${size}px`, borderRadius: 999,
    background: color, display: "inline-flex", alignItems: "center", justifyContent: "center",
  }}>
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 10 10">
      <path d="M2 5l2 2 4-5" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);

export const Sparkle = ({ size = 10, color }: { size?: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 10 10" style={{ flex: "0 0 auto" }}>
    <path d="M5 0l1.2 3.8L10 5l-3.8 1.2L5 10l-1.2-3.8L0 5l3.8-1.2z" fill={color} />
  </svg>
);

// ── Eyebrow ───────────────────────────────────────────────────────────

/**
 * Intitulé de section, posé au-dessus du titre.
 *
 * Un libellé discret en casse normale, avec l'icône du bloc à sa gauche.
 * Pas de boîte, pas de point qui pulse : il introduit, il ne décore pas.
 */
export const Eyebrow = ({ children, icon }: {
  children: React.ReactNode;
  /** Icône du bloc, à la couleur du texte secondaire. */
  icon?: React.ReactNode;
}) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 8,
    color: "var(--dim)",
    fontSize: 14, fontWeight: 500,
    fontFamily: "var(--font-sans)",
    whiteSpace: "nowrap",
  }}>
    {icon}
    {children}
  </span>
);

// ── Buttons ───────────────────────────────────────────────────────────

/**
 * Bouton principal : aplat d'accent, texte sombre (≈8:1), un liseré clair en
 * haut pour la profondeur. Pas de halo, pas de dégradé.
 */
export const PillPrimary = ({
  children, large, fullWidth, href, onClick,
}: {
  children: React.ReactNode;
  large?: boolean;
  fullWidth?: boolean;
  href?: string;
  onClick?: () => void;
}) => {
  const style: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    height: large ? 48 : 40,
    padding: large ? "0 20px" : "0 16px",
    background: "var(--accent)",
    color: "var(--accent-ink)", borderRadius: 10,
    fontSize: large ? 15 : 14, fontWeight: 500,
    border: "none",
    fontFamily: "var(--font-sans)",
    cursor: "pointer",
    width: fullWidth ? "100%" : "auto",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
    transition: "background-color .15s var(--ease), transform .12s var(--ease)",
    textDecoration: "none",
    whiteSpace: "nowrap",
  };
  const enter = (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.background = "var(--accent-strong)"; };
  const leave = (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.background = "var(--accent)"; };
  const down = (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = "scale(0.98)"; };
  const up = (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = "scale(1)"; };
  if (href) {
    const external = /^https?:/i.test(href);
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        style={style}
        onMouseEnter={enter} onMouseLeave={leave} onMouseDown={down} onMouseUp={up}
      >
        {children}
      </a>
    );
  }
  return (
    <button style={style} onClick={onClick}
      onMouseEnter={enter} onMouseLeave={leave} onMouseDown={down} onMouseUp={up}>
      {children}
    </button>
  );
};

/** Bouton secondaire : surface relevée et filet, texte principal. */
export const PillGhost = ({
  children, large, href,
}: {
  children: React.ReactNode;
  large?: boolean;
  href?: string;
}) => {
  const style: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 8,
    height: large ? 48 : 40,
    padding: large ? "0 20px" : "0 16px",
    background: "var(--card-soft)", color: "var(--text)",
    borderRadius: 10,
    fontSize: large ? 15 : 14, fontWeight: 500,
    border: "1px solid var(--border-strong)",
    fontFamily: "var(--font-sans)",
    cursor: "pointer",
    textDecoration: "none",
    whiteSpace: "nowrap",
    transition: "border-color .15s var(--ease)",
  };
  if (href) return <a href={href} style={style}>{children}</a>;
  return <button style={style}>{children}</button>;
};

// ── Mono label ────────────────────────────────────────────────────────

export const MonoLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    fontFamily: "var(--font-mono)",
    fontSize: 12, color: "var(--dim-2)",
    marginBottom: 16,
  }}>
    {children}
  </div>
);
