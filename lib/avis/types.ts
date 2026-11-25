/** Types partagés de l'analyse d'avis Google. Aucune dépendance. */

/** Une fiche Google Maps (entreprise). */
export type Fiche = {
  placeId: string;
  nom: string;
  adresse: string;
  categorie: string;
  note: number | null;
  nbAvis: number;
};

/** Un avis Google. Dates en ISO 8601, null si inconnues. */
export type Avis = {
  id: string;
  note: number;
  texte: string | null;
  date: string | null;
  reponse: string | null;
  dateReponse: string | null;
};

export type Theme = { titre: string; citations: string[] };
export type ReponseRedigee = { avisId: string; texte: string };

/** Ce que produit l'IA. */
export type Analyse = {
  pointsForts: Theme[];
  reproches: Theme[];
  reponses: ReponseRedigee[];
};

export type Trimestre = { libelle: string; note: number | null; nb: number };

/** Indicateurs calculés sur les avis récupérés (jamais par l'IA). */
export type Indicateurs = {
  /** Avis reçus sur les 365 derniers jours, et moyenne mensuelle (une décimale). */
  douzeMois: number;
  parMois: number;
  /** Nombre d'avis par note, index 0 = 5 étoiles … index 4 = 1 étoile. */
  repartition: [number, number, number, number, number];
  /** Part des avis sans texte, en pourcent entier. */
  partSansTexte: number | null;
  /** Tous les avis récupérés restés sans réponse. */
  sansReponseTotal: number;
  /** Avis de 3 étoiles ou moins sur 12 mois, ceux sans réponse, et l'attente du plus ancien (jours). */
  negatifs: { douzeMois: number; sansReponse: number; plusAncienJours: number | null };
  /** Avis 5 étoiles nécessaires pour atteindre la note cible, null si sans objet. */
  objectif: { cible: number; avisNecessaires: number; concurrent: string | null } | null;
};

/** Le rapport complet, tel qu'affiché et mis en PDF. */
export type Rapport = {
  fiche: Fiche;
  concurrents: Fiche[];
  genereLe: string;
  nbAvisAnalyses: number;
  tronque: boolean;
  tauxReponse: number | null;
  delaiMoyenJours: number | null;
  trimestres: Trimestre[];
  sansReponse: Avis[];
  indicateurs: Indicateurs;
  analyse: Analyse | null;
};

/** État d'une tâche de récupération d'avis. */
export type EtatTache =
  | { etat: "encours" }
  | { etat: "pret"; avis: Avis[]; total: number }
  | { etat: "erreur" };

/** Source des données (DataForSEO ou simulation). */
export interface Donnees {
  rechercher(motCle: string): Promise<Fiche[]>;
  lancer(placeId: string): Promise<string>;
  lire(tacheId: string): Promise<EtatTache>;
}

export type EntreeAnalyse = { entreprise: string; categorie: string; avis: Avis[]; sansReponse: Avis[] };

/** Analyse par l'IA (Claude ou simulation). null si l'analyse a échoué. */
export interface Ia {
  analyser(e: EntreeAnalyse): Promise<Analyse | null>;
}
