"use client";

import { useEffect, useRef, useState } from "react";
import { contactEmbedSrc } from "@/lib/contact";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget(opts: { url: string; parentElement: HTMLElement }): void;
    };
  }
}

const WIDGET_SRC = "https://assets.calendly.com/assets/external/widget.js";

/**
 * Agenda Calendly intégré au bloc « Commencer ».
 *
 * Rien n'est chargé tant que le visiteur n'a pas cliqué : Calendly dépose ses
 * propres cookies, et un chargement automatique reviendrait à poser un traceur
 * tiers avant consentement. Le clic vaut consentement, et c'est aussi ce qui
 * évite de payer une ressource tierce dans le temps de chargement de la home.
 *
 * Trois choses ont dû être apprises à l'usage, chacune donnant un cadre blanc
 * et vide quand elle manquait :
 *
 *   - le script officiel est nécessaire. Une iframe posée à la main se charge
 *     bien, mais reste vide : le widget attend le dialogue `postMessage` que
 *     seul `widget.js` établit ;
 *   - le conteneur a besoin d'une hauteur explicite, pas d'un `min-height` :
 *     le widget dimensionne son iframe en pourcentage et retombe sinon à
 *     150 px ;
 *   - `widget.js` initialise lui-même, à son chargement, tout élément portant
 *     la classe `calendly-inline-widget` et un `data-url`. Appeler en plus
 *     `initInlineWidget` sur le même élément fait échouer les deux. On laisse
 *     donc faire l'auto-initialisation, et on n'appelle la méthode que si le
 *     script était déjà en mémoire — auquel cas son événement `load` ne se
 *     reproduira pas.
 *
 * L'URL a besoin du domaine de la page hôte, sans quoi Calendly sert une page
 * vide ; elle est donc construite à l'affichage.
 */
export default function CalendlyInline({
  intro, load, note,
}: {
  intro: string;
  load: string;
  note: string;
}) {
  const [shown, setShown] = useState(false);
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shown || !host.current) return;

    if (window.Calendly) {
      window.Calendly.initInlineWidget({
        url: contactEmbedSrc(window.location.hostname),
        parentElement: host.current,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = WIDGET_SRC;
    script.async = true;
    document.body.appendChild(script);
  }, [shown]);

  if (!shown) {
    return (
      <div style={{ marginTop: 48, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <p style={{
          fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--dim)", margin: 0,
        }}>
          {intro}
        </p>
        <button
          type="button"
          onClick={() => setShown(true)}
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
    <div
      ref={host}
      className="calendly-inline-widget"
      data-url={contactEmbedSrc(typeof window === "undefined" ? "www.timevo.io" : window.location.hostname)}
      style={{
        marginTop: 48, height: 780, minWidth: 320,
        border: "1px solid var(--border)", borderRadius: 20,
        overflow: "hidden", background: "#ffffff",
      }}
    />
  );
}
