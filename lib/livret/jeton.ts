/**
 * Jetons signés de l'accès au générateur de livret, sans base de données.
 *
 * 1. Le visiteur donne son email : on lui envoie un code à 6 chiffres et on
 *    renvoie au navigateur un « jeton de code » signé. Il porte l'email, une
 *    expiration et un HMAC du code : le code lui-même n'y figure pas, et sans
 *    le secret on ne peut pas le retrouver en essayant le million de codes.
 * 2. Le visiteur saisit le code : s'il correspond, on délivre un « jeton
 *    d'accès » signé (email + expiration), gardé dans son navigateur.
 * 3. Le PDF n'est envoyé qu'à l'email d'un jeton d'accès valide : on n'envoie
 *    jamais rien à une adresse dont le visiteur n'a pas prouvé qu'elle est à lui.
 *
 * Le secret est LIVRET_SECRET (Vercel, jamais dans le dépôt).
 */
import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

export const CODE_DUREE_MS = 15 * 60 * 1000;
export const ACCES_DUREE_MS = 30 * 24 * 60 * 60 * 1000;

/** Champs portés par un jeton de code : l'email, plus ce que le formulaire veut retrouver après le code. */
export type InfosCode = { email: string; [cle: string]: string };

type Charge =
  | { t: "code"; exp: number; c: string; infos: InfosCode }
  | { t: "acces"; email: string; exp: number };

const b64 = (s: string) => Buffer.from(s, "utf8").toString("base64url");
const hmac = (secret: string, texte: string) => createHmac("sha256", secret).update(texte).digest("base64url");

function egal(a: string, b: string): boolean {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

function signer(charge: Charge, secret: string): string {
  const corps = b64(JSON.stringify(charge));
  return `${corps}.${hmac(secret, corps)}`;
}

function lire(jeton: string, secret: string, maintenant: number): Charge | null {
  const [corps, signature, ...reste] = String(jeton).split(".");
  if (!corps || !signature || reste.length || !egal(signature, hmac(secret, corps))) return null;
  try {
    const charge = JSON.parse(Buffer.from(corps, "base64url").toString("utf8")) as Charge;
    return typeof charge.exp === "number" && charge.exp > maintenant ? charge : null;
  } catch {
    return null;
  }
}

export function creerCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export function jetonCode(infos: InfosCode, code: string, secret: string, maintenant = Date.now()): string {
  return signer({ t: "code", infos, exp: maintenant + CODE_DUREE_MS, c: hmac(secret, `code:${infos.email}:${code}`) }, secret);
}

/** Les infos du formulaire si le code est le bon et n'a pas expiré, sinon null. */
export function verifierCode(jeton: string, code: string, secret: string, maintenant = Date.now()): InfosCode | null {
  const charge = lire(jeton, secret, maintenant);
  if (!charge || charge.t !== "code") return null;
  if (!egal(charge.c, hmac(secret, `code:${charge.infos.email}:${String(code).trim()}`))) return null;
  return charge.infos;
}

export function jetonAcces(email: string, secret: string, maintenant = Date.now()): string {
  return signer({ t: "acces", email, exp: maintenant + ACCES_DUREE_MS }, secret);
}

/** L'email vérifié du jeton d'accès, ou null. */
export function verifierAcces(jeton: string, secret: string, maintenant = Date.now()): string | null {
  const charge = lire(jeton, secret, maintenant);
  return charge && charge.t === "acces" ? charge.email : null;
}
