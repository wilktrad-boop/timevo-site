/**
 * Client DataForSEO (v3) pour l'analyse d'avis : recherche Google Maps et avis Google.
 * Identifiants : DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD (Vercel). Compte partagé avec
 * les outils SEO de Willy (choix assumé, cf. spec) : les limites de lib/avis/limites.ts
 * protègent son solde.
 */
import type { Avis, Donnees, EtatTache, Fiche } from "./types.ts";
import { AVIS_MAX, dateDfs } from "./calculs.ts";

const BASE = "https://api.dataforseo.com/v3";
const PAS_PRET = new Set([40601, 40602]);

type Brut = Record<string, unknown>;
type Tache = { id?: unknown; status_code?: unknown; result?: unknown };

const obj = (x: unknown): Brut => (x && typeof x === "object" ? (x as Brut) : {});
const str = (x: unknown): string | null => (typeof x === "string" && x.trim() ? x : null);
const num = (x: unknown): number | null => (typeof x === "number" && Number.isFinite(x) ? x : null);

export function donneesDataForSEO(login: string, motDePasse: string, f: typeof fetch = fetch): Donnees {
  const auth = "Basic " + Buffer.from(`${login}:${motDePasse}`).toString("base64");

  async function tache(chemin: string, corps?: unknown): Promise<Tache> {
    const r = await f(`${BASE}${chemin}`, {
      method: corps === undefined ? "GET" : "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: corps === undefined ? undefined : JSON.stringify(corps),
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });
    if (!r.ok) throw new Error(`DataForSEO HTTP ${r.status}`);
    const json = obj(await r.json());
    const taches = Array.isArray(json.tasks) ? json.tasks : [];
    return obj(taches[0]) as Tache;
  }

  const premierResultat = (t: Tache): Brut | null =>
    Array.isArray(t.result) && t.result.length ? obj(t.result[0]) : null;

  return {
    async rechercher(motCle) {
      const t = await tache("/serp/google/maps/live/advanced", [
        { keyword: motCle, location_name: "France", language_code: "fr", depth: 20 },
      ]);
      const items = Array.isArray(premierResultat(t)?.items) ? (premierResultat(t)!.items as unknown[]) : [];
      return items.map(obj).flatMap((i): Fiche[] => {
        const placeId = str(i.place_id);
        const nom = str(i.title);
        if (i.type !== "maps_search" || !placeId || !nom) return [];
        const rating = obj(i.rating);
        return [{ placeId, nom, adresse: str(i.address) ?? "", categorie: str(i.category) ?? "", note: num(rating.value), nbAvis: num(rating.votes_count) ?? 0 }];
      });
    },

    async lancer(placeId) {
      const t = await tache("/business_data/google/reviews/task_post", [
        { place_id: placeId, location_name: "France", language_code: "fr", depth: AVIS_MAX, sort_by: "newest", priority: 2 },
      ]);
      const id = str(t.id);
      if (t.status_code !== 20100 || !id) throw new Error(`DataForSEO tâche non créée (${String(t.status_code)})`);
      return id;
    },

    async lire(tacheId): Promise<EtatTache> {
      const t = await tache(`/business_data/google/reviews/task_get/${encodeURIComponent(tacheId)}`);
      const code = num(t.status_code);
      if (code !== null && PAS_PRET.has(code)) return { etat: "encours" };
      const res = premierResultat(t);
      if (code !== 20000) return { etat: "erreur" };
      if (!res) return { etat: "encours" };
      const items = Array.isArray(res.items) ? (res.items as unknown[]) : [];
      const avis = items.map(obj).map((i, n): Avis => ({
        id: str(i.review_id) ?? `avis-${n}`,
        note: num(obj(i.rating).value) ?? 0,
        texte: str(i.review_text),
        date: dateDfs(str(i.timestamp)),
        reponse: str(i.owner_answer),
        dateReponse: dateDfs(str(i.owner_timestamp)),
      }));
      return { etat: "pret", avis, total: num(res.reviews_count) ?? avis.length };
    },
  };
}
