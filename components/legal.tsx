import NavDkdp from "@/components/NavDkdp";
import FooterDkdp from "@/components/FooterDkdp";

/* Primitives partagées par les pages légales (CGV, mentions légales, confidentialité). */

export function LegalShell({
  title,
  lastUpdate,
  intro,
  children,
}: {
  title: string;
  lastUpdate: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <NavDkdp />
      <main>
        <div style={{ maxWidth: 820, margin: "0 auto", padding: "72px 28px 96px" }}>
          <p
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: 12,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--dim-2)",
              margin: "0 0 16px",
            }}
          >
            Document légal
          </p>
          <h1
            style={{
              fontFamily: "var(--font-geist-sans)",
              fontSize: "clamp(30px, 5vw, 44px)",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "var(--text)",
              margin: "0 0 16px",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: 12,
              color: "var(--dim-2)",
              margin: 0,
            }}
          >
            Dernière mise à jour : {lastUpdate}
          </p>

          {intro && (
            <div
              style={{
                marginTop: 32,
                padding: "20px 22px",
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 14,
              }}
            >
              {intro}
            </div>
          )}

          {children}

          <p
            style={{
              marginTop: 56,
              paddingTop: 24,
              borderTop: "1px solid var(--border)",
              fontFamily: "var(--font-geist-mono)",
              fontSize: 12,
              color: "var(--dim-2)",
            }}
          >
            Une question ?{" "}
            <a href="mailto:hello@timevo.io" style={{ color: "var(--dim)", textDecoration: "none" }}>
              hello@timevo.io
            </a>
          </p>
        </div>
      </main>
      <FooterDkdp />
    </>
  );
}

export function Article({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginTop: 48 }}>
      <h2
        style={{
          fontFamily: "var(--font-geist-sans)",
          fontSize: 20,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          color: "var(--text)",
          margin: "0 0 16px",
        }}
      >
        {n && (
          <span
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: 13,
              color: "var(--accent)",
              marginRight: 10,
            }}
          >
            {n}
          </span>
        )}
        {title}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{children}</div>
    </section>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-geist-sans)",
        fontSize: 15,
        lineHeight: 1.75,
        color: "var(--dim)",
        margin: 0,
      }}
    >
      {children}
    </p>
  );
}

export function Strong({ children }: { children: React.ReactNode }) {
  return <strong style={{ color: "var(--text)", fontWeight: 600 }}>{children}</strong>;
}

export function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} style={{ color: "var(--accent)", textDecoration: "none" }}>
      {children}
    </a>
  );
}

export function Ul({ children }: { children: React.ReactNode }) {
  return (
    <ul
      style={{
        fontFamily: "var(--font-geist-sans)",
        fontSize: 15,
        lineHeight: 1.7,
        color: "var(--dim)",
        margin: "2px 0 0",
        paddingLeft: 22,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {children}
    </ul>
  );
}
