"use client";

import { useTranslations } from "next-intl";

const logos = [
  "Aquaviva", "Berney & Cie", "Vergers SAS", "Mobilier&Co", "Pool France",
  "IMRO", "Habitat Plus", "Concorde", "Polomarco", "Leman Immo", "Solid SA", "Strike",
];
const repeated = [...logos, ...logos, ...logos];

export default function LogoWall() {
  const t = useTranslations("logowall");

  return (
    <section style={{
      padding: "60px 0",
      borderTop: "1px solid var(--border)",
      borderBottom: "1px solid var(--border)",
      overflow: "hidden",
    }}>
      <div style={{
        textAlign: "center", marginBottom: 36, padding: "0 28px",
        fontFamily: "var(--font-geist-mono)", fontSize: 11,
        color: "var(--dim)", letterSpacing: "0.12em", textTransform: "uppercase",
      }}>
        {t("label")}
      </div>
      <div style={{ overflow: "hidden" }}>
        <div className="ticker-track-slow" style={{
          display: "inline-flex", whiteSpace: "nowrap",
          maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        }}>
          {repeated.map((l, i) => (
            <div key={i} style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              height: 56, padding: "0 36px",
              fontFamily: "var(--font-geist-sans)", fontSize: 18, fontWeight: 600,
              color: "var(--dim)", letterSpacing: "-0.02em", opacity: 0.7, whiteSpace: "nowrap",
            }}>
              {l}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
