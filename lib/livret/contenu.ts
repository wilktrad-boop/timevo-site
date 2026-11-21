/**
 * Contenu du livret d'accueil, source unique du générateur en ligne
 * (/fr/ressources/livret-accueil-airbnb/creer) et du modèle Word
 * (scripts/livret-accueil/build-livret.mts).
 *
 * Ce fichier n'importe RIEN : le script Word le lit hors de Next.js.
 *
 * Gabarits : `{idDuChamp}` est remplacé par la valeur saisie. Une ligne de
 * tableau dont un champ référencé est vide disparaît du livret.
 * `exemple` sert de placeholder dans le générateur et de valeur dans
 * l'exemple PDF ; il n'est jamais imprimé dans le livret d'une conciergerie.
 * `sensible` : jamais envoyé à l'IA (étape 2 du chantier).
 */

export type ChampType = "court" | "long" | "liste";

export type Champ = {
  id: string;
  label: string;
  type: ChampType;
  exemple: string;
  defaut?: string;
  sensible?: boolean;
};

export type LigneTableau = { label: string; gabarit: string };

export type Bloc =
  | { type: "tableau"; titre?: string; lignes: LigneTableau[] }
  | { type: "texte"; titre?: string; champ: string }
  | { type: "liste"; titre?: string; champ: string; style: "puces" | "cases" };

/**
 * `sautAvant` : nouvelle page avant la section dans le modèle Word, au contenu fixe.
 * `sautAvantPdf` : idem dans le PDF du générateur, où la longueur du contenu varie ;
 * par défaut il suit `sautAvant`.
 */
export type Section = { titre: string; blocs: Bloc[]; sautAvant?: boolean; sautAvantPdf?: boolean };

export type Etape = { id: string; titre: string; intro: string; champs: Champ[]; sections: Section[] };

export const COULEUR_DEFAUT = "#2F5D50";

export const ETAPES: Etape[] = [
  {
    id: "conciergerie",
    titre: "Votre conciergerie",
    intro: "Ce qui apparaît en première page : qui vous êtes, le logement, et comment vous joindre.",
    champs: [
      { id: "nomConciergerie", label: "Nom de la conciergerie", type: "court", exemple: "Conciergerie Rive Gauche" },
      { id: "nomLogement", label: "Nom du logement", type: "court", exemple: "Le Loft du Marais" },
      { id: "adresse", label: "Adresse du logement", type: "court", exemple: "8 rue de l'Exemple, 75003 Paris", sensible: true },
      { id: "contactPrenom", label: "Prénom du contact", type: "court", exemple: "Camille" },
      { id: "contactTelephone", label: "Téléphone du contact", type: "court", exemple: "01 99 00 12 34", sensible: true },
      { id: "contactDispo", label: "Disponibilités", type: "court", exemple: "tous les jours de 8 h à 21 h" },
      {
        id: "intro", label: "Mot d'accueil", type: "long",
        exemple: "Merci d'avoir choisi notre logement…",
        defaut: "Merci d'avoir choisi notre logement. Ce livret rassemble tout ce qu'il faut savoir pendant votre séjour : l'arrivée, le logement, le quartier et le départ. Gardez-le à portée de main, et écrivez-nous au moindre doute : nous préférons une question de trop à un souci pendant votre séjour.",
      },
    ],
    sections: [],
  },
  {
    id: "arrivee",
    titre: "L'arrivée",
    intro: "Tout ce qu'il faut pour entrer dans le logement sans vous appeler.",
    champs: [
      { id: "heureArrivee", label: "Heure d'arrivée", type: "court", exemple: "16 h", sensible: true },
      { id: "codeImmeuble", label: "Code de l'immeuble", type: "court", exemple: "4815B", sensible: true },
      { id: "etagePorte", label: "Étage et porte", type: "court", exemple: "3e étage, porte de droite", sensible: true },
      { id: "cles", label: "Remise des clés", type: "long", exemple: "Boîte à clés à gauche de la porte, code envoyé le jour de l'arrivée.", sensible: true },
      { id: "parking", label: "Stationnement", type: "long", exemple: "Pas de place privée. Parking public à 4 minutes à pied ; stationnement en rue payant de 9 h à 20 h." },
      {
        id: "arriveeTardive", label: "Arrivée tardive", type: "long", exemple: "",
        defaut: "Vous arrivez tard ? Prévenez-nous la veille : l'accès autonome fonctionne à toute heure, mais nous préférons savoir que vous êtes bien arrivés.",
      },
    ],
    sections: [{
      titre: "Votre arrivée",
      blocs: [
        { type: "tableau", titre: "Accès au logement", lignes: [
          { label: "Adresse", gabarit: "{adresse}" },
          { label: "Arrivée", gabarit: "À partir de {heureArrivee}" },
          { label: "Code de l'immeuble", gabarit: "{codeImmeuble}" },
          { label: "Étage, porte", gabarit: "{etagePorte}" },
          { label: "Clés", gabarit: "{cles}" },
        ] },
        { type: "texte", titre: "Stationnement", champ: "parking" },
        { type: "texte", titre: "Arrivée tardive", champ: "arriveeTardive" },
      ],
    }],
  },
  {
    id: "logement",
    titre: "Le logement",
    intro: "Le Wi-Fi, les équipements et quoi faire en cas de souci.",
    champs: [
      { id: "wifiReseau", label: "Nom du réseau Wi-Fi", type: "court", exemple: "LoftMarais", sensible: true },
      { id: "wifiMotDePasse", label: "Mot de passe Wi-Fi", type: "court", exemple: "bienvenue-2026", sensible: true },
      { id: "television", label: "Télévision", type: "long", exemple: "Télécommande dans le tiroir du meuble TV. Applications de streaming via le bouton Accueil." },
      { id: "equipements", label: "Équipements", type: "liste", exemple: "Chauffage : thermostat dans l'entrée, à baisser en partant\nCuisine : plaques induction, four, lave-vaisselle, cafetière\nLinge : draps et serviettes fournis, lave-linge dans la salle de bains" },
      {
        id: "souci", label: "En cas de souci", type: "long", exemple: "",
        defaut: "Une panne, un équipement qui ne fonctionne pas : écrivez-nous ou appelez-nous. Nous intervenons au plus vite, et en priorité en cas d'urgence (fuite, coupure, serrure).",
      },
      { id: "compteur", label: "Compteur électrique", type: "court", exemple: "placard de l'entrée, en haut à droite" },
      { id: "arriveeEau", label: "Arrivée d'eau", type: "court", exemple: "sous l'évier de la cuisine" },
      { id: "extincteur", label: "Extincteur", type: "court", exemple: "à côté de la porte d'entrée" },
    ],
    sections: [{
      titre: "Le logement",
      blocs: [
        { type: "tableau", titre: "Wi-Fi et télévision", lignes: [
          { label: "Réseau Wi-Fi", gabarit: "{wifiReseau}" },
          { label: "Mot de passe", gabarit: "{wifiMotDePasse}" },
          { label: "Télévision", gabarit: "{television}" },
        ] },
        { type: "liste", titre: "Équipements", champ: "equipements", style: "puces" },
        { type: "texte", titre: "En cas de souci", champ: "souci" },
        { type: "tableau", lignes: [
          { label: "Compteur électrique", gabarit: "{compteur}" },
          { label: "Arrivée d'eau", gabarit: "{arriveeEau}" },
          { label: "Extincteur", gabarit: "{extincteur}" },
        ] },
      ],
    }],
  },
  {
    id: "regles",
    titre: "Les règles de la maison",
    intro: "Quelques règles, formulées sans ton de règlement.",
    champs: [
      {
        id: "reglesIntro", label: "Introduction", type: "long", exemple: "",
        defaut: "Le logement est un lieu de vie dans un immeuble habité. Quelques règles pour que votre séjour se passe bien, pour vous comme pour les voisins :",
      },
      { id: "capacite", label: "Capacité", type: "court", exemple: "4 personnes" },
      {
        id: "regles", label: "Règles", type: "liste", exemple: "",
        defaut: "Fêtes et événements : non autorisés\nCalme : à partir de 22 h, dans le logement comme dans les parties communes\nTabac : logement non-fumeur, y compris à la fenêtre\nAnimaux : non acceptés\nClés : à ne pas reproduire ni confier à des personnes extérieures à la réservation",
      },
      { id: "tri", label: "Tri et déchets", type: "long", exemple: "Poubelles dans la cour, à gauche en entrant. Bac jaune : emballages et papiers. Le verre se dépose dans la colonne au coin de la rue." },
    ],
    sections: [{
      titre: "Les règles de la maison",
      sautAvant: true,
      // Dans le PDF, « Le logement » déborde souvent de quelques lignes : un saut
      // forcé ici laissait une page presque vide.
      sautAvantPdf: false,
      blocs: [
        { type: "texte", champ: "reglesIntro" },
        { type: "tableau", lignes: [{ label: "Capacité", gabarit: "{capacite} maximum" }] },
        { type: "liste", champ: "regles", style: "puces" },
        { type: "texte", titre: "Tri et déchets", champ: "tri" },
      ],
    }],
  },
  {
    id: "quartier",
    titre: "Le quartier",
    intro: "Vos bonnes adresses : la rubrique que les voyageurs lisent le plus.",
    champs: [
      { id: "quartierIntro", label: "Introduction", type: "long", exemple: "", defaut: "Nos adresses préférées, testées par l'équipe." },
      { id: "manger", label: "Pour manger", type: "liste", exemple: "Le Petit Comptoir, à 3 minutes : cuisine de saison, réservez le week-end\nLa Fournée, en bas de la rue : boulangerie ouverte dès 7 h" },
      { id: "quotidien", label: "Au quotidien", type: "liste", exemple: "Supérette : au coin de la rue, ouverte jusqu'à 22 h\nPharmacie : à 2 minutes, place du marché" },
      { id: "transports", label: "Se déplacer", type: "liste", exemple: "Métro : à 4 minutes, ligne 11\nGare : 15 minutes en métro" },
    ],
    sections: [{
      titre: "Le quartier",
      blocs: [
        { type: "texte", champ: "quartierIntro" },
        { type: "liste", titre: "Pour manger", champ: "manger", style: "puces" },
        { type: "liste", titre: "Au quotidien", champ: "quotidien", style: "puces" },
        { type: "liste", titre: "Se déplacer", champ: "transports", style: "puces" },
      ],
    }],
  },
  {
    id: "depart",
    titre: "Le départ",
    intro: "L'heure, la liste à cocher et les numéros utiles.",
    champs: [
      { id: "heureDepart", label: "Heure de départ", type: "court", exemple: "11 h", sensible: true },
      {
        id: "departInfo", label: "Informations de départ", type: "long", exemple: "",
        defaut: "Besoin de plus de temps ? Demandez-nous la veille : selon les réservations, nous pouvons parfois décaler l'heure.",
      },
      {
        id: "checklist", label: "Avant de partir", type: "liste", exemple: "",
        defaut: "Fermer les fenêtres et baisser le chauffage\nLancer le lave-vaisselle avec la vaisselle utilisée\nSortir les poubelles\nLaisser les serviettes utilisées dans la salle de bains\nÉteindre les lumières et les appareils\nRemettre les clés dans la boîte à clés",
      },
      {
        id: "motFin", label: "Un dernier mot", type: "long", exemple: "",
        defaut: "Merci de votre séjour. Si quelque chose vous a manqué, dites-le-nous directement : c'est comme ça que le logement s'améliore. Et si vous avez aimé votre séjour, un avis sur la plateforme de réservation nous aide énormément.",
      },
      { id: "medecin", label: "Médecin le plus proche", type: "court", exemple: "cabinet médical, 20 rue de l'Exemple" },
    ],
    sections: [
      {
        titre: "Votre départ",
        sautAvant: true,
        blocs: [
          { type: "tableau", lignes: [{ label: "Départ", gabarit: "Avant {heureDepart}" }] },
          { type: "texte", champ: "departInfo" },
          { type: "liste", titre: "Avant de partir", champ: "checklist", style: "cases" },
          { type: "texte", titre: "Un dernier mot", champ: "motFin" },
        ],
      },
      {
        titre: "Numéros utiles",
        blocs: [{ type: "tableau", lignes: [
          { label: "Votre conciergerie", gabarit: "{contactPrenom}, {contactTelephone}" },
          { label: "Urgences (Europe)", gabarit: "112" },
          { label: "SAMU", gabarit: "15" },
          { label: "Police", gabarit: "17" },
          { label: "Pompiers", gabarit: "18" },
          { label: "Pharmacie de garde", gabarit: "3237" },
          { label: "Médecin le plus proche", gabarit: "{medecin}" },
        ] }],
      },
    ],
  },
];

export const COUVERTURE = {
  surtitre: "{nomConciergerie}",
  titre: "Bienvenue chez vous.",
  sousTitre: "Livret d'accueil · {nomLogement}",
  sousTitreSansLogement: "Livret d'accueil",
  lignes: [
    { label: "Adresse", gabarit: "{adresse}" },
    { label: "Arrivée", gabarit: "À partir de {heureArrivee}" },
    { label: "Départ", gabarit: "Avant {heureDepart}" },
    { label: "Wi-Fi", gabarit: "Réseau {wifiReseau} · mot de passe {wifiMotDePasse}" },
    { label: "Votre contact", gabarit: "{contactPrenom}, {contactTelephone}" },
    { label: "Disponibilités", gabarit: "{contactDispo}" },
  ] as LigneTableau[],
  intro: "intro",
  pied: "{nomConciergerie} · {contactTelephone}",
};

export const CHAMPS: Champ[] = ETAPES.flatMap(e => e.champs);
