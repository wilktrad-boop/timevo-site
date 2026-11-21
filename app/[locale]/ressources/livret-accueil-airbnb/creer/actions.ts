"use server";

import { LOGEMENTS_OPTIONS, LIVRET_PATH } from "@/lib/ressources";
import { boiteEnvoi, clean, EMAIL_RE } from "@/lib/mail";
import { creerCode, jetonCode, verifierCode, jetonAcces, verifierAcces } from "@/lib/livret/jeton";

/**
 * Accès au générateur de livret : email, code reçu par email, puis PDF envoyé
 * à cette adresse (voir lib/livret/jeton.ts pour les jetons signés).
 *
 * Il faut LIVRET_SECRET et la boîte d'envoi (lib/mail.ts) sur Vercel. Sans
 * eux, l'outil s'ouvre après le formulaire, sans code ni envoi du PDF : on
 * ne bloque pas un prospect pour un problème de configuration de notre côté.
 */

const PDF_MAX = 4 * 1024 * 1024; // sous la limite des Server Actions (next.config.ts)
const OUTIL_URL = `https://www.timevo.io${LIVRET_PATH}/creer`;

export type AccesValeurs = { email: string; conciergerie: string; logements: string; consent: boolean };

export type AccesState =
  | { status: "idle" }
  | { status: "erreur"; champ: "email" | "logements" | "consent" | "envoi"; valeurs: AccesValeurs }
  | { status: "code"; email: string; jeton: string }
  | { status: "ouvert"; email: string; acces: string | null };

export type CodeState =
  | { status: "idle" }
  | { status: "erreur"; message: string }
  | { status: "ouvert"; email: string; acces: string };

function config() {
  const secret = process.env.LIVRET_SECRET;
  const boite = boiteEnvoi();
  return secret && secret.length >= 32 && boite ? { secret, boite } : null;
}

export async function demanderCode(_prev: AccesState, formData: FormData): Promise<AccesState> {
  const email = clean(formData.get("email"), 200).toLowerCase();
  const conciergerie = clean(formData.get("conciergerie"), 120);
  const logements = clean(formData.get("logements"), 40);
  const consent = formData.get("consent") === "on";
  const valeurs = { email, conciergerie, logements, consent };

  // Champ piège : invisible pour un humain, rempli par les robots.
  if (clean(formData.get("site"), 200)) return { status: "erreur", champ: "envoi", valeurs };
  if (!EMAIL_RE.test(email)) return { status: "erreur", champ: "email", valeurs };
  if (!(LOGEMENTS_OPTIONS as readonly string[]).includes(logements)) return { status: "erreur", champ: "logements", valeurs };
  if (!consent) return { status: "erreur", champ: "consent", valeurs };

  const c = config();
  if (!c) {
    console.error("[livret-outil] LIVRET_SECRET ou SMTP absents : outil ouvert sans code, contact non transmis.");
    return { status: "ouvert", email, acces: null };
  }

  const code = creerCode();
  try {
    await c.boite.transport.sendMail({
      from: `"Timevo" <${c.boite.user}>`,
      to: email,
      subject: `Votre code : ${code}`,
      text: [
        `Votre code pour créer votre livret d'accueil sur timevo.io : ${code}`,
        "",
        "Il est valable 15 minutes. Une fois votre livret terminé, le PDF vous sera envoyé à cette adresse.",
        "",
        "Si vous n'avez rien demandé, ignorez ce message.",
        "",
        "L'équipe Timevo",
      ].join("\n"),
    });
  } catch (err) {
    console.error("[livret-outil] envoi du code en échec :", err instanceof Error ? err.message : err);
    return { status: "erreur", champ: "envoi", valeurs };
  }
  return { status: "code", email, jeton: jetonCode({ email, conciergerie, logements }, code, c.secret) };
}

export async function validerCode(_prev: CodeState, formData: FormData): Promise<CodeState> {
  const c = config();
  if (!c) return { status: "erreur", message: "Le service est momentanément indisponible. Réessayez plus tard." };
  const infos = verifierCode(clean(formData.get("jeton"), 2000), clean(formData.get("code"), 12).replace(/\s/g, ""), c.secret);
  if (!infos) return { status: "erreur", message: "Ce code ne correspond pas, ou il a expiré. Vérifiez-le ou demandez-en un nouveau." };

  // Le contact n'est transmis qu'une fois l'adresse vérifiée.
  const when = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
  try {
    await c.boite.transport.sendMail({
      from: `"Site Timevo" <${c.boite.user}>`,
      to: c.boite.leadTo,
      replyTo: infos.email,
      subject: `Générateur de livret ouvert : ${infos.conciergerie || infos.email}`,
      text: [
        "Nouvel utilisateur du générateur de livret d'accueil (adresse vérifiée par code).",
        "",
        `Email : ${infos.email}`,
        `Conciergerie : ${infos.conciergerie || "(non renseignée)"}`,
        `Logements gérés : ${infos.logements}`,
        `Date : ${when}`,
        "Consentement au recontact : oui",
        "",
        "Répondre à ce mail écrit directement au prospect.",
      ].join("\n"),
    });
  } catch (err) {
    console.error("[livret-outil] contact non transmis :", err instanceof Error ? err.message : err);
  }
  return { status: "ouvert", email: infos.email, acces: jetonAcces(infos.email, c.secret) };
}

/** Envoie le PDF du livret à l'adresse vérifiée du jeton d'accès, et à elle seule. */
export async function envoyerPdf(formData: FormData): Promise<{ ok: boolean }> {
  const c = config();
  if (!c) return { ok: false };
  const email = verifierAcces(clean(formData.get("acces"), 2000), c.secret);
  const fichier = formData.get("pdf");
  if (!email || !(fichier instanceof File) || fichier.size === 0 || fichier.size > PDF_MAX) return { ok: false };
  const contenu = Buffer.from(await fichier.arrayBuffer());
  if (contenu.subarray(0, 5).toString("latin1") !== "%PDF-") return { ok: false };
  const nom = /^[a-z0-9-]{1,80}\.pdf$/.test(fichier.name) ? fichier.name : "livret-accueil.pdf";

  try {
    await c.boite.transport.sendMail({
      from: `"Timevo" <${c.boite.user}>`,
      to: email,
      subject: "Votre livret d'accueil",
      text: [
        "Bonjour,",
        "",
        "Voici votre livret d'accueil, en pièce jointe.",
        "",
        `Pour le modifier, revenez sur ${OUTIL_URL} depuis le même navigateur : votre brouillon y est enregistré.`,
        "",
        "L'équipe Timevo",
      ].join("\n"),
      attachments: [{ filename: nom, content: contenu, contentType: "application/pdf" }],
    });
    return { ok: true };
  } catch (err) {
    console.error("[livret-outil] envoi du PDF en échec :", err instanceof Error ? err.message : err);
    return { ok: false };
  }
}
