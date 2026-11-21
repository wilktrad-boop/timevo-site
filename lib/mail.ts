import nodemailer from "nodemailer";

/**
 * Boîte d'envoi du site (formulaires des ressources).
 *
 * Variables d'environnement (Vercel, jamais dans le dépôt) :
 *   SMTP_USER      boîte d'envoi dédiée au site, ex. site@timevo.io
 *   SMTP_PASSWORD  son mot de passe
 *   SMTP_HOST      facultatif, smtp.hostinger.com par défaut
 *   SMTP_PORT      facultatif, 465 par défaut (SSL)
 *   LEAD_TO        facultatif, hello@timevo.io par défaut
 *
 * Renvoie null sans configuration : chaque appelant décide alors quoi faire.
 */
export function boiteEnvoi() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  if (!user || !pass) return null;
  const port = Number(process.env.SMTP_PORT || 465);
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.hostinger.com",
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return { transport, user, leadTo: process.env.LEAD_TO || "hello@timevo.io" };
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Une ligne, sans retour chariot, bornée : rien ne déborde dans l'en-tête du mail. */
export function clean(value: FormDataEntryValue | null, max: number): string {
  return String(value ?? "").replace(/[\r\n\t]+/g, " ").trim().slice(0, max);
}
