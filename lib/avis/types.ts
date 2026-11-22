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
  recommandations: string[];
};

export type Trimestre = { libelle: string; note: number | null; nb: number };

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
