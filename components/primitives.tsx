"use client";

import React from "react";

// ── SVG Glyphs ────────────────────────────────────────────────────────

export const Arrow = ({ size = 14, color = "currentColor", stroke = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={{ flex: "0 0 auto" }}>
    <path d="M2 7h10M8 3l4 4-4 4" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ArrowDown = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path d="M7 2v10M3 8l4 4 4-4" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
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
 * Pastille d'intitulé de section, posée au-dessus du titre.
 *
 * Elle remplace le label mono en capitales espacées : à côté d'un titre en
 * 700, un label technique tenait le second rôle sans le dire. La pastille
 * l'assume — fond de carte, bordure, casse normale, et un point d'accent qui
 * pulse pour rappeler que la page est vivante.
 */
export const Eyebrow = ({ children, icon }: {
  children: React.ReactNode;
  /** Icône du bloc. Sans elle, la pastille retombe sur le point qui pulse. */
  icon?: React.ReactNode;
}) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 9,
    padding: "7px 15px",
    background: "var(--card)",
    color: "var(--dim)",
    borderRadius: 999,
    border: "1px solid var(--border)",
    fontSize: 13, fontWeight: 500,
    fontFamily: "var(--font-sans)",
    letterSpacing: "-0.005em",
    whiteSpace: "nowrap",
  }}>
    {icon ?? (
      <span className="eyebrow-dot" style={{
        width: 7, height: 7, borderRadius: 999,
        background: "var(--accent)", flexShrink: 0,
      }} />
    )}
    {children}
  </span>
);

// ── Buttons ───────────────────────────────────────────────────────────

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
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
    padding: large ? "16px 26px" : "13px 22px",
    background: "var(--accent-gradient)",
    color: "#fff", borderRadius: 999,
    fontSize: large ? 14 : 13, fontWeight: 600,
    border: "none",
    fontFamily: "var(--font-sans)",
    cursor: "pointer",
    width: fullWidth ? "100%" : "auto",
    boxShadow: "0 0 0 1px var(--accent), 0 12px 32px var(--accent-glow), inset 0 1px 0 rgba(255,255,255,0.18)",
    letterSpacing: "-0.01em",
    transition: "transform .15s ease, box-shadow .15s ease",
    textDecoration: "none",
    whiteSpace: "nowrap",
  };
  if (href) {
    const external = /^https?:/i.test(href);
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        style={style}
        onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-1px)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
      >
        {children}
      </a>
    );
  }
  return (
    <button style={style} onClick={onClick}
      onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-1px)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>
      {children}
    </button>
  );
};

export const PillGhost = ({
  children, large, href,
}: {
  children: React.ReactNode;
  large?: boolean;
  href?: string;
}) => {
  const style: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 10,
    padding: large ? "15px 25px" : "12px 21px",
    background: "transparent", color: "var(--text)",
    borderRadius: 999,
    fontSize: large ? 14 : 13, fontWeight: 600,
    border: "1px solid var(--border-strong)",
    fontFamily: "var(--font-sans)",
    cursor: "pointer",
    letterSpacing: "-0.01em",
    textDecoration: "none",
    whiteSpace: "nowrap",
  };
  if (href) return <a href={href} style={style}>{children}</a>;
  return <button style={style}>{children}</button>;
};

// ── Mono label ────────────────────────────────────────────────────────

export const MonoLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    fontFamily: "var(--font-mono)",
    fontSize: 11, color: "var(--dim)",
    letterSpacing: "0.12em", textTransform: "uppercase",
    marginBottom: 16,
  }}>
    {children}
  </div>
);
