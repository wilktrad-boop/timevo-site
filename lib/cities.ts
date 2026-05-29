export type CityContent = {
  slug: string;
  city: string;
  region: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  subtitle: string;
  audienceLabel: string;
  audience: string[];
  whyH2: string;
  whyItems: { n: string; title: string; desc: string }[];
  whatH2: string;
  whatSubtitle: string;
  whatItems: { title: string; desc: string; href: string }[];
  caseH2: string;
  before: string[];
  after: string[];
  roiLabel: string;
  roiValue: string;
  caseFootnote: string;
  faqH2: string;
  faqs: [string, string][];
  ctaH2: string;
  ctaSubtitle: string;
  // LocalBusiness JSON-LD
  geo: {
    latitude: number;
    longitude: number;
    streetAddress?: string;
    postalCode: string;
    addressCountry: "FR";
    areaServed: string[];
  };
};

const SERVICES = (locale = "fr") => ({
  automatisation: `/${locale}/solutions/automatisation`,
  agentsIa: `/${locale}/solutions/agents-ia`,
  formation: `/${locale}/solutions/formation`,
  sitesWeb: `/${locale}/solutions/sites-web`,
  seo: `/${locale}/solutions/seo`,
  reseauxSociaux: `/${locale}/solutions/reseaux-sociaux`,
});

export const CITIES: Record<string, CityContent> = {
  "thonon-les-bains": {
    slug: "thonon-les-bains",
    city: "Thonon-les-Bains",
    region: "Haute-Savoie",
    metaTitle:
      "Agence d'automatisation à Thonon-les-Bains — n8n, agents IA, sites web",
    metaDescription:
      "Agence d'automatisation à Thonon-les-Bains. Workflows n8n, agents IA, sites web et SEO pour PME du bassin lémanique. Déplacements Évian, Annecy, Genève.",
    eyebrow: "AGENCE AUTOMATISATION · BASSIN LÉMANIQUE",
    h1: "Agence d'automatisation à Thonon-les-Bains.",
    subtitle:
      "PME haut-savoyardes et frontalières : on automatise vos process pour vous rendre du temps. Présentiel sur Thonon, Évian, Annecy et Genève. Distanciel partout ailleurs.",
    audienceLabel: "Pour qui",
    audience: [
      "Artisans habitat & rénovation",
      "Services aux frontaliers",
      "PME tourisme & loisirs",
    ],
    whyH2: "Pourquoi une agence locale au bord du Léman.",
    whyItems: [
      {
        n: "01",
        title: "On connaît le tissu frontalier",
        desc: "Clientèle suisse, attentes service haut de gamme, particularités fiscales : on a déjà travaillé avec ce bassin. Pas de courbe d'apprentissage à vos frais.",
      },
      {
        n: "02",
        title: "Présentiel sur tout le Chablais et au-delà",
        desc: "Thonon, Évian, Publier, Annemasse, Annecy, Genève : on se déplace pour les audits et les jalons critiques. Le reste se fait en distanciel.",
      },
      {
        n: "03",
        title: "Réseau pro local",
        desc: "Chambre de commerce Haute-Savoie, French Tech Alpes, écosystème CCI : on connaît les bonnes portes pour vos clients comme pour vos partenaires.",
      },
    ],
    whatH2: "Ce qu'on fait à Thonon comme ailleurs.",
    whatSubtitle:
      "Quatre expertises couplées : on automatise vos process internes et on travaille votre visibilité externe. Sur place ou à distance.",
    whatItems: [
      {
        title: "Automatisation des process",
        desc: "Devis, relances, reporting, synchros CRM, onboarding. Workflows n8n sur mesure, livrés en 2-3 semaines.",
        href: SERVICES().automatisation,
      },
      {
        title: "Agents IA",
        desc: "Chatbot SAV, pré-qualification leads, standard téléphonique. Disponibles 24/7, dans le ton de votre marque.",
        href: SERVICES().agentsIa,
      },
      {
        title: "Création de sites",
        desc: "Vitrine, landing, e-commerce, refonte. Code propre, hébergement chez vous, aucune dépendance.",
        href: SERVICES().sitesWeb,
      },
      {
        title: "SEO local & national",
        desc: "Google Business Profile, SEO technique, contenu. Visibilité sur les requêtes qui rapportent — pas du volume vide.",
        href: SERVICES().seo,
      },
    ],
    caseH2: "Un artisan rénovation haut de gamme du Chablais.",
    before: [
      "60 devis/mois rédigés à la main, en soirée",
      "Relances oubliées sur 1 prospect sur 3",
      "Suivi chantier en SMS, plusieurs appels client par jour",
      "Pas de présence locale sur Google Maps",
    ],
    after: [
      "Devis envoyé en 30 min après la visite",
      "Relances multi-canal 30 jours, taux de signature +30%",
      "Dashboard chantier auto, satisfaction client en hausse",
      "Top 3 Google Maps sur Thonon + Évian sur 6 mots-clés",
    ],
    roiLabel: "Retour sur investissement",
    roiValue: "10 semaines",
    caseFootnote:
      "Scénario type, pas un client existant. Les chiffres réels sont validés lors de l'audit gratuit.",
    faqH2: "Avant d'en parler.",
    faqs: [
      [
        "Vous vous déplacez côté Suisse ?",
        "Oui. Genève et Lausanne sont à portée. On adapte la facturation (TVA, devises) selon votre montage. Les visites se font selon votre besoin.",
      ],
      [
        "Distanciel ou présentiel ?",
        "Les deux. Audit et points de jalon en présentiel sur Thonon, Évian, Annecy. Build, itérations et maintenance en distanciel pour aller vite.",
      ],
      [
        "Vous connaissez les outils du tissu local ?",
        "Oui pour les classiques (Sage, Pennylane, Sellsy, HubSpot, Pipedrive) et pour les outils métier (logiciels rénovation, devis bâtiment, planning chantier).",
      ],
      [
        "Combien de clients en Haute-Savoie ?",
        "On lance Timevo. Notre premier client signé est un pisciniste du bassin — on en parle volontiers en RDV. On est en phase d'acquisition active sur le Chablais.",
      ],
    ],
    ctaH2: "30 minutes pour cartographier votre semaine.",
    ctaSubtitle:
      "Audit gratuit en visio ou sur place à Thonon. On vous dit honnêtement où votre temps part et ce qu'on peut récupérer — que vous bossiez avec nous ou pas.",
    geo: {
      latitude: 46.3719,
      longitude: 6.4769,
      postalCode: "74200",
      addressCountry: "FR",
      areaServed: [
        "Thonon-les-Bains",
        "Évian-les-Bains",
        "Annemasse",
        "Annecy",
        "Genève",
        "Haute-Savoie",
      ],
    },
  },

  montpellier: {
    slug: "montpellier",
    city: "Montpellier",
    region: "Hérault",
    metaTitle:
      "Agence d'automatisation à Montpellier — n8n, agents IA, sites web",
    metaDescription:
      "Agence d'automatisation à Montpellier. Workflows n8n, agents IA, sites web et SEO pour PME et SaaS de l'Hérault. Déplacements Béziers, Nîmes, Sète.",
    eyebrow: "AGENCE AUTOMATISATION · HÉRAULT",
    h1: "Agence d'automatisation à Montpellier.",
    subtitle:
      "PME, cabinets et SaaS du bassin montpelliérain : on automatise vos process pour vous rendre du temps. Présentiel à Montpellier, Béziers, Nîmes, Sète. Distanciel partout ailleurs.",
    audienceLabel: "Pour qui",
    audience: [
      "Cabinets immobilier & conseil",
      "SaaS & start-ups French Tech",
      "PME services premium",
    ],
    whyH2: "Pourquoi une agence locale dans l'Hérault.",
    whyItems: [
      {
        n: "01",
        title: "On parle aux PME et aux SaaS dans leur langue",
        desc: "L'écosystème montpelliérain est dense en tech-savvy. On adapte la profondeur technique selon votre maturité — n8n pour les uns, sans-code pour les autres.",
      },
      {
        n: "02",
        title: "Présentiel sur Montpellier et l'arc Languedoc",
        desc: "Audit et jalons critiques sur place à Montpellier, Sète, Béziers, Nîmes. Le reste en distanciel pour accélérer la livraison.",
      },
      {
        n: "03",
        title: "Couplage automatisation + SEO + sites",
        desc: "Pour les PME locales qui cherchent à monter en visibilité, on couvre les deux faces : pipeline interne automatisé et acquisition externe travaillée.",
      },
    ],
    whatH2: "Ce qu'on fait à Montpellier comme ailleurs.",
    whatSubtitle:
      "Quatre expertises couplées, calibrées pour PME haut ticket et SaaS en croissance.",
    whatItems: [
      {
        title: "Automatisation des process",
        desc: "Devis, relances, reporting, synchros CRM, onboarding. Workflows n8n sur mesure, livrés en 2-3 semaines.",
        href: SERVICES().automatisation,
      },
      {
        title: "Agents IA",
        desc: "Chatbot SAV, pré-qualification leads, standard téléphonique. Disponibles 24/7, formés sur vos données.",
        href: SERVICES().agentsIa,
      },
      {
        title: "Création de sites",
        desc: "Vitrine, landing, e-commerce, refonte. Stack moderne (Next.js, Shopify Hydrogen), code chez vous.",
        href: SERVICES().sitesWeb,
      },
      {
        title: "SEO local & national",
        desc: "Google Business Profile pour Montpellier, SEO technique, contenu. Trafic qualifié, pas du volume vide.",
        href: SERVICES().seo,
      },
    ],
    caseH2: "Un cabinet immobilier de prestige sur Montpellier.",
    before: [
      "70% des appels sur des questions répétitives (dispo, prix, suivi)",
      "Devis envoyés à J+5 en moyenne",
      "Pas de relance structurée des prospects froids",
      "Faible visibilité sur Google sur les requêtes locales clés",
    ],
    after: [
      "Agent IA absorbe 60% des appels triviaux 24/7",
      "Devis envoyé à J+1 systématiquement",
      "Relances multi-canal 30 jours, taux de réactivation +25%",
      "Top 3 Google Maps sur Montpellier sur 8 requêtes",
    ],
    roiLabel: "Retour sur investissement",
    roiValue: "12 semaines",
    caseFootnote:
      "Scénario type, pas un client existant. Les chiffres réels sont validés lors de l'audit gratuit.",
    faqH2: "Avant d'en parler.",
    faqs: [
      [
        "Vous vous déplacez sur l'Hérault et le Gard ?",
        "Oui. Montpellier, Sète, Béziers, Nîmes : les visites se font selon le besoin. Audit et jalons critiques en présentiel, le reste en distanciel.",
      ],
      [
        "Vous travaillez avec des SaaS et des start-ups ?",
        "Oui. On adapte la livraison à votre rythme (cycles courts, intégrations API, monitoring). Le n8n s'intègre bien aux stacks modernes.",
      ],
      [
        "Vous connaissez le tissu French Tech montpelliérain ?",
        "On suit l'écosystème (BIC Cap Omega, French Tech Mediterranean). Les outils utilisés à Montpellier sont les mêmes qu'ailleurs — la différence est dans le rythme de décision, qu'on adapte.",
      ],
      [
        "Combien de clients sur Montpellier ?",
        "On lance Timevo. Notre acquisition est active sur le bassin — on en parle volontiers en RDV pour cadrer ce qui vous concerne.",
      ],
    ],
    ctaH2: "30 minutes pour cartographier votre semaine.",
    ctaSubtitle:
      "Audit gratuit en visio ou sur place à Montpellier. On vous dit honnêtement où votre temps part et ce qu'on peut récupérer — que vous bossiez avec nous ou pas.",
    geo: {
      latitude: 43.6109,
      longitude: 3.8772,
      postalCode: "34000",
      addressCountry: "FR",
      areaServed: ["Montpellier", "Béziers", "Sète", "Nîmes", "Hérault", "Gard"],
    },
  },
};

export const CITY_SLUGS = Object.keys(CITIES);
