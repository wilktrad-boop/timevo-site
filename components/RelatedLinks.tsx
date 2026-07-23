import { Arrow, MonoLabel } from "./primitives";
import type { LinkGroup } from "@/lib/links";

/**
 * Bloc de maillage interne en fin de page.
 *
 * Server Component : le hover passe par les classes CSS `.related-link` et
 * `.hover-card` (cf. globals.css), pas par des handlers React.
 */
export default function RelatedLinks({
  eyebrow,
  h2,
  groups,
}: {
  eyebrow: string;
  h2: string;
  groups: LinkGroup[];
}) {
  const visible = groups.filter(g => g.items.length > 0);
  if (visible.length === 0) return null;

  return (
    <section style={{ padding: "96px 28px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <MonoLabel>{eyebrow}</MonoLabel>
        <h2 style={{
          fontFamily: "var(--font-sans)", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 500,
          letterSpacing: "-0.04em", lineHeight: 1.05, margin: 0, marginBottom: 48,
          color: "var(--text)",
        }}>
          {h2}
        </h2>

        <div className="related-grid" style={{
          display: "grid",
          gridTemplateColumns: `repeat(${visible.length}, minmax(0, 1fr))`,
          gap: 40,
        }}>
          {visible.map(group => (
            <div key={group.title}>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: 11,
                color: "var(--dim-2)", letterSpacing: "0.12em", textTransform: "uppercase",
                paddingBottom: 14, marginBottom: 6,
                borderBottom: "1px solid var(--border)",
              }}>
                {group.title}
              </div>

              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {group.items.map(item => (
                  <li key={item.href}>
                    <a href={item.href} className="related-link" style={{
                      display: "block",
                      padding: "16px 0",
                      borderBottom: "1px solid var(--border)",
                      textDecoration: "none",
                    }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 500,
                        color: "var(--text)",
                      }}>
                        {item.label}
                        <span className="related-arrow" style={{ display: "inline-flex", opacity: 0, transition: "opacity .15s" }}>
                          <Arrow size={12} />
                        </span>
                      </span>
                      <span style={{
                        display: "block", marginTop: 4,
                        fontFamily: "var(--font-sans)", fontSize: 13, lineHeight: 1.45,
                        color: "var(--dim)",
                      }}>
                        {item.desc}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
