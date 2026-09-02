"use client";

import { useState } from "react";
import { contactEmbedSrc } from "@/lib/contact";

/**
 * Agenda Calendly intégré au bloc « Commencer ».
 *
 * Rien n'est chargé tant que le visiteur n'a pas cliqué : Calendly dépose ses
 * propres cookies, et un chargement automatique reviendrait à un traceur tiers
 * posé avant consentement. Le clic vaut consentement, et c'est aussi ce qui
 * évite de payer une iframe tierce dans le temps de chargement de la home.
 *
 * L'intégration passe par une iframe plutôt que par le script widget.js de
 * Calendly, qui s'injecte dans la page entière. En contrepartie l'iframe ne
 * s'auto-dimensionne pas : sa hauteur est fixée, avec assez de marge pour le
 * calendrier et le formulaire.
 *
 * L'URL est construite au clic parce qu'elle a besoin du domaine de la page :
 * sans `embed_domain`, Calendly répond une iframe vide.
 */
export default function CalendlyInline({
  intro, load, note,
}: {
  intro: string;
  load: string;
  note: string;
}) {
  const [src, setSrc] = useState<string | null>(null);

  if (!src) {
    return (
      <div style={{ marginTop: 48, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <p style={{
          fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--dim)", margin: 0,
        }}>
          {intro}
        </p>
        <button
          type="button"
          onClick={() => setSrc(contactEmbedSrc(window.location.hostname))}
          style={{
            padding: "12px 21px",
            background: "transparent", color: "var(--text)",
            border: "1px solid var(--border-strong)", borderRadius: 999,
            fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
            letterSpacing: "-0.01em", cursor: "pointer",
          }}
        >
          {load}
        </button>
        <p style={{
          fontFamily: "var(--font-sans)", fontSize: 12.5, lineHeight: 1.5,
          color: "var(--dim-2)", margin: 0, maxWidth: 460, textAlign: "center",
        }}>
          {note}
        </p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 48 }}>
      <iframe
        src={src}
        title="Calendly"
        loading="lazy"
        style={{
          width: "100%", height: 760, border: "1px solid var(--border)",
          borderRadius: 20, background: "var(--card)", display: "block",
        }}
      />
    </div>
  );
}
