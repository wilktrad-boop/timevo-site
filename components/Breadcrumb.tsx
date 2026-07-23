/**
 * Fil d'Ariane visible. Reprend exactement la même chaîne que le JSON-LD
 * `BreadcrumbList` déjà émis par les pages profondes, et ajoute des liens
 * remontants vers l'accueil et les pages intermédiaires.
 *
 * Server Component : hover en CSS (`.crumb-link`).
 */
export default function Breadcrumb({
  items,
  label,
}: {
  /** Le dernier élément est la page courante : pas de href. */
  items: { href?: string; label: string }[];
  label: string;
}) {
  return (
    <nav aria-label={label} style={{ padding: "20px 28px 0" }}>
      <ol style={{
        maxWidth: 1200, margin: "0 auto", padding: 0,
        listStyle: "none",
        display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8,
        fontFamily: "var(--font-mono)", fontSize: 11,
        color: "var(--dim-2)", letterSpacing: "0.06em",
      }}>
        {items.map((item, i) => (
          <li key={item.label} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            {i > 0 && <span aria-hidden="true" style={{ color: "var(--border-strong)" }}>/</span>}
            {item.href ? (
              <a href={item.href} className="crumb-link" style={{ textDecoration: "none" }}>
                {item.label}
              </a>
            ) : (
              <span aria-current="page" style={{ color: "var(--dim)" }}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
