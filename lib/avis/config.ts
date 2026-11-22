/**
 * Choisit les fournisseurs de l'analyse d'avis selon l'environnement.
 * null = non configuré : l'outil s'affiche « momentanément indisponible »
 * (jamais ouvert sans limites, chaque appel coûtant de l'argent).
 */
import Anthropic from "@anthropic-ai/sdk";
import { boiteEnvoi } from "../mail.ts";
import type { Donnees, Ia } from "./types.ts";
import { donneesDataForSEO } from "./dataforseo.ts";
import { iaClaude } from "./analyse.ts";
import { donneesSimulation, iaSimulation } from "./simulation.ts";
import { magasinMemoire, magasinRedis, redisConfigure, type Magasin } from "./limites.ts";

export type ConfigAvis = {
  donnees: Donnees;
  ia: Ia;
  magasin: Magasin;
  secret: string;
  boite: NonNullable<ReturnType<typeof boiteEnvoi>>;
};

// Un seul magasin mémoire par processus en simulation : les compteurs survivent entre deux actions.
const memoire = magasinMemoire();

export function configAvis(): ConfigAvis | null {
  const secret = process.env.LIVRET_SECRET;
  const boite = boiteEnvoi();
  if (!secret || secret.length < 32 || !boite) return null;

  if (process.env.AVIS_SIMULATION === "1" && process.env.NODE_ENV !== "production") {
    return { donnees: donneesSimulation(), ia: iaSimulation(), magasin: memoire, secret, boite };
  }

  const login = process.env.DATAFORSEO_LOGIN;
  const motDePasse = process.env.DATAFORSEO_PASSWORD;
  const cle = process.env.ANTHROPIC_API_KEY;
  if (!login || !motDePasse || !cle || !redisConfigure()) return null;
  return {
    donnees: donneesDataForSEO(login, motDePasse),
    ia: iaClaude(new Anthropic({ apiKey: cle, timeout: 240_000, maxRetries: 1 })),
    magasin: magasinRedis(),
    secret,
    boite,
  };
}
