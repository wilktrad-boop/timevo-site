/**
 * Compteurs et cache de l'analyse d'avis. Chaque analyse coûte (données + IA) :
 * on compte par IP, par email vérifié et pour tout le site.
 * En production : Upstash Redis (Marketplace Vercel). En simulation et en test : mémoire.
 */
import { Redis } from "@upstash/redis";

export const JOUR_S = 86_400;
export const LIMITES = { recherchesParIp: 20, auditsParEmail: 3, auditsParJour: 50 };

export interface Magasin {
  /** Incrémente et pose l'expiration au premier incrément. Rend la nouvelle valeur. */
  incr(cle: string, ttlSec: number): Promise<number>;
  decr(cle: string): Promise<void>;
  lire<T>(cle: string): Promise<T | null>;
  ecrire(cle: string, valeur: unknown, ttlSec: number): Promise<void>;
  /** Pose la clé si elle n'existe pas (verrou). true si on l'a prise. */
  prendre(cle: string, ttlSec: number): Promise<boolean>;
}

export function magasinMemoire(maintenant: () => number = Date.now): Magasin {
  const valeurs = new Map<string, { v: unknown; fin: number }>();
  const vivant = (cle: string) => {
    const e = valeurs.get(cle);
    if (e && e.fin <= maintenant()) { valeurs.delete(cle); return undefined; }
    return e;
  };
  return {
    async incr(cle, ttlSec) {
      const e = vivant(cle);
      const n = (typeof e?.v === "number" ? e.v : 0) + 1;
      valeurs.set(cle, { v: n, fin: e?.fin ?? maintenant() + ttlSec * 1000 });
      return n;
    },
    async decr(cle) {
      const e = vivant(cle);
      if (e && typeof e.v === "number") e.v = Math.max(0, e.v - 1);
    },
    async lire<T>(cle: string) {
      const e = vivant(cle);
      return e ? (structuredClone(e.v) as T) : null;
    },
    async ecrire(cle, valeur, ttlSec) {
      valeurs.set(cle, { v: structuredClone(valeur), fin: maintenant() + ttlSec * 1000 });
    },
    async prendre(cle, ttlSec) {
      if (vivant(cle)) return false;
      valeurs.set(cle, { v: 1, fin: maintenant() + ttlSec * 1000 });
      return true;
    },
  };
}

/** Variables posées par l'intégration Upstash de Vercel (l'un ou l'autre jeu de noms). */
export function redisConfigure(): boolean {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const jeton = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return Boolean(url && jeton);
}

export function magasinRedis(): Magasin {
  const r = Redis.fromEnv();
  return {
    async incr(cle, ttlSec) {
      const n = await r.incr(cle);
      if (n === 1) await r.expire(cle, ttlSec);
      return n;
    },
    async decr(cle) {
      const n = await r.decr(cle);
      if (n < 0) await r.set(cle, 0, { keepTtl: true });
    },
    async lire<T>(cle: string) {
      return (await r.get<T>(cle)) ?? null;
    },
    async ecrire(cle, valeur, ttlSec) {
      await r.set(cle, valeur, { ex: ttlSec });
    },
    async prendre(cle, ttlSec) {
      return (await r.set(cle, 1, { nx: true, ex: ttlSec })) === "OK";
    },
  };
}

/** Compte un usage ; refuse (sans le compter) au-delà du maximum sur 24 h. */
export async function autoriser(m: Magasin, cle: string, max: number): Promise<boolean> {
  const n = await m.incr(cle, JOUR_S);
  if (n <= max) return true;
  await m.decr(cle);
  return false;
}

/** Rend un usage compté (analyse qui n'a pas abouti). */
export async function rendre(m: Magasin, cle: string): Promise<void> {
  await m.decr(cle);
}
