"use server";

import { LOGEMENTS_OPTIONS } from "@/lib/ressources";
import { boiteEnvoi, clean, EMAIL_RE } from "@/lib/mail";

/**
 * Reçoit le formulaire du livret d'accueil et envoie le contact par mail.
 *
 * Boîte d'envoi : lib/mail.ts. Sans SMTP_USER / SMTP_PASSWORD, le visiteur reçoit quand même ses fichiers
 * et l'absence de configuration est journalisée : on ne bloque pas un
 * prospect pour un problème de notre côté.
 */

export type LivretValues = { email: string; company: string; logements: string; consent: boolean };

// React réinitialise le formulaire après chaque soumission : en cas d'erreur, on
// renvoie les valeurs saisies pour que le visiteur n'ait pas tout à retaper.
export type LivretState =
  | { status: "idle" }
  | { status: "error"; field: "email" | "consent" | "logements"; values: LivretValues }
  | { status: "ok" };

export async function requestLivret(_prev: LivretState, formData: FormData): Promise<LivretState> {
  // Champ piège : invisible pour un humain, rempli par les robots.
  if (clean(formData.get("site"), 200)) return { status: "ok" };

  const email = clean(formData.get("email"), 200);
  const company = clean(formData.get("company"), 120);
  const logements = clean(formData.get("logements"), 40);
  const consent = formData.get("consent") === "on";

  const values = { email, company, logements, consent };
  if (!EMAIL_RE.test(email)) return { status: "error", field: "email", values };
  if (!(LOGEMENTS_OPTIONS as readonly string[]).includes(logements)) {
    return { status: "error", field: "logements", values };
  }
  if (!consent) return { status: "error", field: "consent", values };

  const boite = boiteEnvoi();
  if (!boite) {
    console.error("[livret] SMTP_USER / SMTP_PASSWORD absents : contact non transmis (fichiers servis quand même).");
    return { status: "ok" };
  }
  const { transport, user } = boite;

  const when = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
  try {
    await transport.sendMail({
      from: `"Site Timevo" <${user}>`,
      to: boite.leadTo,
      replyTo: email,
      subject: `Livret d'accueil téléchargé : ${company || email}`,
      text: [
        "Nouveau téléchargement du livret d'accueil Airbnb.",
        "",
        `Email : ${email}`,
        `Conciergerie : ${company || "(non renseignée)"}`,
        `Logements gérés : ${logements}`,
        `Date : ${when}`,
        "Consentement au recontact : oui",
        "",
        "Répondre à ce mail écrit directement au prospect.",
      ].join("\n"),
    });
  } catch (err) {
    // Même règle que sans configuration : le visiteur a ses fichiers, l'échec est journalisé.
    console.error("[livret] envoi SMTP en échec, contact non transmis :", err instanceof Error ? err.message : err);
  }

  return { status: "ok" };
}
