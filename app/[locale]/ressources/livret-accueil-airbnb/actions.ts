"use server";

import nodemailer from "nodemailer";
import { LOGEMENTS_OPTIONS } from "@/lib/ressources";

/**
 * Reçoit le formulaire du livret d'accueil et envoie le contact par mail.
 *
 * Variables d'environnement (Vercel, jamais dans le dépôt) :
 *   SMTP_USER      boîte d'envoi dédiée à ce formulaire, ex. site@timevo.io
 *   SMTP_PASSWORD  son mot de passe
 *   SMTP_HOST      facultatif, smtp.hostinger.com par défaut
 *   SMTP_PORT      facultatif, 465 par défaut (SSL)
 *   LEAD_TO        facultatif, hello@timevo.io par défaut
 *
 * Sans SMTP_USER / SMTP_PASSWORD, le visiteur reçoit quand même ses fichiers
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Une ligne, sans retour chariot, bornée : rien ne déborde dans l'en-tête du mail. */
function clean(value: FormDataEntryValue | null, max: number): string {
  return String(value ?? "").replace(/[\r\n\t]+/g, " ").trim().slice(0, max);
}

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

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  if (!user || !pass) {
    console.error("[livret] SMTP_USER / SMTP_PASSWORD absents : contact non transmis (fichiers servis quand même).");
    return { status: "ok" };
  }

  const port = Number(process.env.SMTP_PORT || 465);
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.hostinger.com",
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const when = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
  try {
    await transport.sendMail({
      from: `"Site Timevo" <${user}>`,
      to: process.env.LEAD_TO || "hello@timevo.io",
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
