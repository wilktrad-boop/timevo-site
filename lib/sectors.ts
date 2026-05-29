import type { Locale } from "./pageLabels";

export type SectorContent = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  subtitle: string;
  audienceLabel: string;
  audience: string[];
  problemH2: string;
  problems: { n: string; title: string; desc: string }[];
  workflowsH2: string;
  workflowsSubtitle: string;
  workflows: { title: string; desc: string }[];
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
};

export const SECTORS: Record<string, Record<Locale, SectorContent>> = {
  cuisiniste: {
    fr: {
      metaTitle: "Automatisation pour cuisiniste — Devis, suivi chantier, relances",
      metaDescription:
        "Automatisation pour cuisinistes : devis post-showroom en 12 min, relances multi-canal, suivi chantier auto. Workflows n8n compatibles avec vos outils métier.",
      eyebrow: "AUTOMATISATION · CUISINISTE",
      h1: "Automatisation pour cuisiniste.",
      subtitle:
        "Devis 30 min, relances oubliées, suivi chantier en SMS perpétuel. On automatise les tâches qui pèsent vraiment dans la journée d'un cuisiniste — sans toucher au métier.",
      audienceLabel: "Pour qui",
      audience: [
        "Cuisinistes indépendants",
        "Réseaux & franchisés",
        "Concept stores haut de gamme",
      ],
      problemH2: "Ce qui ronge vos semaines.",
      problems: [
        {
          n: "01",
          title: "30 à 45 min par devis configuré",
          desc: "Chaque devis cuisine implique 40+ paramètres : caissons, façades, plans, électroménager, pose. Vos commerciaux y passent leurs soirées.",
        },
        {
          n: "02",
          title: "60% des prospects ne reviennent pas",
          desc: "Sans relance structurée après le showroom, plus d'un visiteur sur deux signe ailleurs. Vos commerciaux n'ont pas le temps d'appeler J+2, J+7, J+15.",
        },
        {
          n: "03",
          title: "Le chantier déclenche 20 SMS par jour",
          desc: "Plombier, électricien, marbrier, livreur : le client demande à chaque étape « où en êtes-vous ? ». Vos chargés de projet répondent au lieu de piloter.",
        },
      ],
      workflowsH2: "Ce qu'on automatise chez un cuisiniste.",
      workflowsSubtitle:
        "Cinq workflows pensés pour le métier, déployés en 2 à 3 semaines selon vos priorités.",
      workflows: [
        {
          title: "Devis en 12 min après le showroom",
          desc: "Le commercial capture les specs sur tablette en RDV. Le devis est généré, mis en page, signé et envoyé avant le départ du client.",
        },
        {
          title: "Relances post-showroom 30 jours",
          desc: "Email + SMS aux J+2, J+7, J+15. Ton de marque préservé. Le commercial est notifié dès que le prospect répond.",
        },
        {
          title: "Dashboard chantier auto",
          desc: "Synchronisation avec votre planning : le client reçoit étapes + photos à chaque jalon. Moins d'appels, plus de satisfaction.",
        },
        {
          title: "Synchro logiciel métier",
          desc: "KitchenDraw, Vectorworks, MMS, MyCuisine : on branche votre outil de conception à votre CRM et votre comptabilité. Plus de double saisie.",
        },
        {
          title: "Sondage NPS post-livraison",
          desc: "Email automatique 15 jours après la pose. Les notes 9-10 deviennent des avis Google demandés au bon moment.",
        },
      ],
      caseH2: "Un cuisiniste de 8 personnes.",
      before: [
        "80 devis/mois, 2h chacun le soir",
        "1 relance sur 3 oubliée, perte estimée 6 000 €/mois",
        "5h/semaine de SMS par chargé de projet sur les chantiers",
        "0 avis Google demandé de manière systématique",
      ],
      after: [
        "Devis envoyé dans les 15 min après le RDV",
        "Relances multi-canal 30 jours, taux de signature +25%",
        "Suivi chantier automatique, 80% des SMS supprimés",
        "20 à 30 avis Google par mois en pilote",
      ],
      roiLabel: "Retour sur investissement",
      roiValue: "8 semaines",
      caseFootnote:
        "Scénario type, pas un client existant. Les chiffres réels sont validés lors de l'audit gratuit.",
      faqH2: "Avant d'en parler.",
      faqs: [
        [
          "Compatible avec KitchenDraw, Vectorworks ou notre logiciel maison ?",
          "Oui. On branche ce qui existe. Pour les logiciels métier qui n'ont pas d'API publique, on passe par export/import automatisé ou par scrapping en lecture seule. On vous dit dès l'audit si votre stack est compatible.",
        ],
        [
          "Vos automatisations remplacent nos commerciaux ?",
          "Non. On les libère du temps administratif pour qu'ils passent plus de temps en showroom et en RDV. Un commercial bien équipé fait 50% de RDV en plus.",
        ],
        [
          "Pour une boutique solo, c'est rentable ?",
          "Oui dès 30 devis/mois. Une boutique unique paie le setup en 6 à 10 semaines, principalement sur le gain de devis + relances.",
        ],
        [
          "Et les chantiers complexes à 6 corps de métier ?",
          "Plus c'est complexe, plus l'automatisation rapporte. On modélise votre process pendant l'audit, puis on cale le suivi sur vos jalons réels.",
        ],
      ],
      ctaH2: "30 minutes pour cartographier votre process cuisine.",
      ctaSubtitle:
        "On regarde votre flux devis → showroom → chantier et on identifie les 2 ou 3 points où l'automatisation rend du temps tout de suite.",
    },
    en: {
      metaTitle: "Automation for kitchen installers — Quotes, project tracking, follow-up",
      metaDescription:
        "Automation for kitchen installers: showroom-to-quote in 12 minutes, multi-channel follow-up, automated project tracking. n8n workflows compatible with your industry tools.",
      eyebrow: "AUTOMATION · KITCHEN INSTALLERS",
      h1: "Automation for kitchen installers.",
      subtitle:
        "30-minute quotes, missed follow-ups, endless SMS during installs. We automate the tasks that actually weigh on a kitchen installer's day — without touching the craft.",
      audienceLabel: "For",
      audience: [
        "Independent kitchen installers",
        "Networks & franchises",
        "High-end concept stores",
      ],
      problemH2: "What eats your weeks.",
      problems: [
        {
          n: "01",
          title: "30 to 45 minutes per custom quote",
          desc: "Every kitchen quote has 40+ parameters: cabinets, fronts, layouts, appliances, installation. Your sales team spends evenings on it.",
        },
        {
          n: "02",
          title: "60% of prospects never come back",
          desc: "Without structured follow-up after the showroom visit, more than half sign elsewhere. Your team has no time for D+2, D+7, D+15 calls.",
        },
        {
          n: "03",
          title: "Installation triggers 20 SMS a day",
          desc: "Plumber, electrician, marble setter, delivery: clients ask at every step. Your project managers reply instead of running the project.",
        },
      ],
      workflowsH2: "What we automate for a kitchen installer.",
      workflowsSubtitle:
        "Five workflows built for the craft, deployed in 2 to 3 weeks based on your priorities.",
      workflows: [
        {
          title: "Quotes in 12 minutes after the showroom",
          desc: "Your salesperson captures specs on a tablet during the meeting. The quote is generated, formatted, signed and sent before the client leaves.",
        },
        {
          title: "30-day post-showroom follow-up",
          desc: "Email + SMS at D+2, D+7, D+15. Brand voice preserved. Your salesperson is notified only when the prospect replies.",
        },
        {
          title: "Automated install dashboard",
          desc: "Syncs with your scheduling: clients receive milestones + photos at each step. Fewer calls, higher satisfaction.",
        },
        {
          title: "Industry software sync",
          desc: "KitchenDraw, Vectorworks, MMS, MyCuisine: we connect your design tool to your CRM and accounting. No more double entry.",
        },
        {
          title: "Post-delivery NPS survey",
          desc: "Automatic email 15 days after install. 9-10 scores become Google reviews requested at the right moment.",
        },
      ],
      caseH2: "An 8-person kitchen installer.",
      before: [
        "80 quotes/month, 2h each in the evening",
        "1 in 3 follow-ups missed, estimated loss €6,000/month",
        "5h/week of SMS per project manager on installs",
        "No systematic Google review requests",
      ],
      after: [
        "Quote sent within 15 min after the meeting",
        "30-day multi-channel follow-up, signing rate +25%",
        "Automated install tracking, 80% of SMS removed",
        "20-30 Google reviews per month on auto-pilot",
      ],
      roiLabel: "Return on investment",
      roiValue: "8 weeks",
      caseFootnote:
        "Typical scenario, not an existing client. Real figures are validated during the free audit.",
      faqH2: "Before we talk.",
      faqs: [
        [
          "Compatible with KitchenDraw, Vectorworks, or our in-house tool?",
          "Yes. We connect what's there. For industry tools without a public API, we use automated import/export or read-only scraping. We confirm compatibility during the audit.",
        ],
        [
          "Does automation replace our salespeople?",
          "No. It frees them from admin time so they can spend more time in the showroom and on visits. A well-equipped salesperson runs 50% more meetings.",
        ],
        [
          "Is it worth it for a solo studio?",
          "Yes from 30 quotes/month. A single store pays back the setup in 6 to 10 weeks, mostly on the quote + follow-up gain.",
        ],
        [
          "What about complex installs with 6 trades?",
          "The more complex, the more automation pays off. We map your process during the audit, then build the tracking on your real milestones.",
        ],
      ],
      ctaH2: "30 minutes to map your kitchen process.",
      ctaSubtitle:
        "We look at your quote → showroom → install flow and identify the 2 or 3 points where automation gives you time back right away.",
    },
  },

  pisciniste: {
    fr: {
      metaTitle: "Automatisation pour pisciniste — Devis, relances, entretien",
      metaDescription:
        "Automatisation pour piscinistes : qualif appels saison haute, devis sur site, planning entretien et hivernage. Workflows n8n et agent IA téléphonique.",
      eyebrow: "AUTOMATISATION · PISCINISTE",
      h1: "Automatisation pour pisciniste.",
      subtitle:
        "Saison qui sature, devis qui partent à J+10, hivernages oubliés. On automatise ce qui pèse au pisciniste — devis, relances, entretien — sans toucher au métier.",
      audienceLabel: "Pour qui",
      audience: [
        "Piscinistes indépendants",
        "Constructeurs régionaux",
        "SAV & entretien dédié",
      ],
      problemH2: "Ce qui pèse, surtout entre mars et juillet.",
      problems: [
        {
          n: "01",
          title: "200 appels par jour en pleine saison",
          desc: "Sur 4 mois, votre équipe gère un volume d'appels insoutenable. 70% sont des questions répétitives (disponibilités, devis, suivi) qui éloignent du métier.",
        },
        {
          n: "02",
          title: "Devis envoyés à J+10",
          desc: "Entre la visite, la prise de mesures et la rédaction du chiffrage, le prospect attend. Et 30% partent à la concurrence pendant ce délai.",
        },
        {
          n: "03",
          title: "Entretien & hivernage : 30% oubliés",
          desc: "Vous avez 400 clients récurrents. Sans système, l'hivernage d'octobre est planifié à la main, et un tiers passe entre les mailles. Du chiffre perdu sec.",
        },
      ],
      workflowsH2: "Ce qu'on automatise chez un pisciniste.",
      workflowsSubtitle:
        "Cinq workflows calibrés pour la saisonnalité du métier, livrés en 2 à 3 semaines.",
      workflows: [
        {
          title: "Pré-qualification téléphonique IA",
          desc: "En saison haute, un agent IA prend les appels, qualifie en 60 secondes (besoin, budget, urgence) et notifie le bon technicien avec un résumé propre.",
        },
        {
          title: "Devis en J+1 après visite",
          desc: "Le commercial capture photos + métré sur tablette. Le devis est généré le soir même, mis en forme, envoyé par email + SMS.",
        },
        {
          title: "Relances financement multi-acteurs",
          desc: "Devis 15-50 k€ : 60% des clients passent par un prêt. On automatise les relances client + banque + courtier sur 30 jours.",
        },
        {
          title: "Planning entretien & hivernage",
          desc: "Tous les clients récurrents sont planifiés automatiquement. Email de pré-RDV + SMS de rappel. Plus aucun hivernage oublié.",
        },
        {
          title: "SAV saisonnier",
          desc: "Pompe qui fait du bruit, eau verte, robot bloqué : l'agent IA filtre, propose un check-list, et n'escalade que les vrais SAV.",
        },
      ],
      caseH2: "Un pisciniste régional, 12 personnes.",
      before: [
        "200 appels/jour avril-juillet, 4 personnes saturées",
        "Devis envoyés à J+10 en moyenne",
        "30% des hivernages oubliés ou tardifs",
        "Pas de relance financement structurée",
      ],
      after: [
        "40% des appels absorbés par l'agent IA",
        "Devis envoyé à J+1 systématiquement",
        "100% des hivernages planifiés, +60 k€ de récurrent récupéré",
        "Taux de signature financement +35%",
      ],
      roiLabel: "Retour sur investissement",
      roiValue: "1 saison",
      caseFootnote:
        "Scénario type, pas un client existant. Les chiffres réels sont validés lors de l'audit gratuit.",
      faqH2: "Avant d'en parler.",
      faqs: [
        [
          "Vous absorbez vraiment le pic de saison ?",
          "Oui, c'est l'argument principal. L'agent IA est dimensionné pour gérer 200 à 500 appels par jour sans rupture. Vos équipes ne traitent que les dossiers chauds qualifiés.",
        ],
        [
          "Compatible avec Sofatec, Hydra Soft, ou un Excel maison ?",
          "Oui pour les logiciels métier qui exposent une API, et oui via import/export pour les autres. On valide la compatibilité dès l'audit.",
        ],
        [
          "Vous touchez à notre relation client ?",
          "Non. L'agent IA est dans le ton de votre marque, filtre les appels triviaux, mais bascule sur un humain dès qu'il y a doute ou demande spécifique. Vous gardez la main.",
        ],
        [
          "Et pour l'entretien hors saison, vous automatisez quoi ?",
          "Le calendrier (hivernage, mise en route, contrôles), les rappels clients, la planification des techniciens. Octobre-mars, l'équipe pilote au lieu de planifier.",
        ],
      ],
      ctaH2: "30 minutes pour préparer la prochaine saison.",
      ctaSubtitle:
        "On regarde votre flux d'appels, votre devis moyen et votre récurrence d'entretien. On identifie les workflows qui paient avant la prochaine saison.",
    },
    en: {
      metaTitle: "Automation for pool builders — Quotes, follow-up, maintenance",
      metaDescription:
        "Automation for pool builders: peak-season call qualification, on-site quotes, maintenance and winterization scheduling. n8n workflows and AI voice agent.",
      eyebrow: "AUTOMATION · POOL BUILDERS",
      h1: "Automation for pool builders.",
      subtitle:
        "Peak-season saturation, quotes sent at D+10, missed winterizations. We automate what weighs on a pool builder — quotes, follow-up, maintenance — without touching the craft.",
      audienceLabel: "For",
      audience: [
        "Independent pool builders",
        "Regional installers",
        "Dedicated maintenance & service",
      ],
      problemH2: "What weighs, especially between March and July.",
      problems: [
        {
          n: "01",
          title: "200 calls a day in peak season",
          desc: "Over 4 months your team handles an unbearable call volume. 70% are repetitive questions (availability, quotes, follow-up) pulling you away from the craft.",
        },
        {
          n: "02",
          title: "Quotes sent at D+10",
          desc: "Between the visit, measurements and pricing, prospects wait. And 30% go to the competition during that delay.",
        },
        {
          n: "03",
          title: "Maintenance & winterization: 30% missed",
          desc: "You have 400 recurring clients. Without a system, October winterization is planned by hand and a third slips through. Pure lost revenue.",
        },
      ],
      workflowsH2: "What we automate for a pool builder.",
      workflowsSubtitle:
        "Five workflows calibrated for the craft's seasonality, delivered in 2 to 3 weeks.",
      workflows: [
        {
          title: "AI phone pre-qualification",
          desc: "In peak season, an AI agent takes calls, qualifies in 60 seconds (need, budget, urgency) and notifies the right technician with a clean summary.",
        },
        {
          title: "Quotes within D+1 after the visit",
          desc: "Your salesperson captures photos + measurements on tablet. The quote is generated that evening, formatted, sent by email + SMS.",
        },
        {
          title: "Multi-actor financing follow-up",
          desc: "Quotes €15-50k: 60% of clients use a loan. We automate follow-up across client + bank + broker over 30 days.",
        },
        {
          title: "Maintenance & winterization scheduling",
          desc: "All recurring clients planned automatically. Pre-appointment email + SMS reminder. No more missed winterizations.",
        },
        {
          title: "Seasonal service desk",
          desc: "Pump making noise, green water, robot stuck: the AI agent filters, suggests a checklist, and only escalates real service calls.",
        },
      ],
      caseH2: "A regional pool builder, 12 people.",
      before: [
        "200 calls/day April-July, 4 people saturated",
        "Quotes sent at D+10 on average",
        "30% of winterizations forgotten or late",
        "No structured financing follow-up",
      ],
      after: [
        "40% of calls absorbed by the AI agent",
        "Quote sent within D+1 systematically",
        "100% of winterizations planned, +€60k of recurring recovered",
        "Financing sign rate +35%",
      ],
      roiLabel: "Return on investment",
      roiValue: "1 season",
      caseFootnote:
        "Typical scenario, not an existing client. Real figures are validated during the free audit.",
      faqH2: "Before we talk.",
      faqs: [
        [
          "Do you really absorb peak season?",
          "Yes, that's the main argument. The AI agent is sized to handle 200 to 500 calls per day without breaking. Your team only handles qualified hot leads.",
        ],
        [
          "Compatible with Sofatec, Hydra Soft, or an in-house Excel?",
          "Yes for industry software exposing an API, and yes via import/export for the rest. We confirm compatibility during the audit.",
        ],
        [
          "Do you touch our client relationship?",
          "No. The AI agent matches your brand voice, filters trivial calls, but hands off to a human as soon as there's doubt or a specific request. You stay in control.",
        ],
        [
          "And off-season maintenance, what do you automate?",
          "The calendar (winterization, start-up, checks), client reminders, technician scheduling. October to March, your team manages instead of planning.",
        ],
      ],
      ctaH2: "30 minutes to prep the next season.",
      ctaSubtitle:
        "We look at your call volume, average quote and maintenance recurrence. We identify the workflows that pay before the next season.",
    },
  },

  "panneaux-solaires": {
    fr: {
      metaTitle:
        "Automatisation pour installateur panneaux solaires — Leads, qualif, suivi",
      metaDescription:
        "Automatisation pour installateurs photovoltaïques : qualif leads MaPrimeRénov, suivi installation, monitoring post-pose. Workflows n8n et agents IA.",
      eyebrow: "AUTOMATISATION · PHOTOVOLTAÏQUE",
      h1: "Automatisation pour installateur panneaux solaires.",
      subtitle:
        "Leads en masse, qualif manuelle, suivi installation chronophage. On automatise le tunnel de la qualification au monitoring post-pose — sans rogner sur la conformité.",
      audienceLabel: "Pour qui",
      audience: [
        "Installateurs RGE photovoltaïque",
        "Réseaux nationaux",
        "Mandataires & courtiers en énergie",
      ],
      problemH2: "Ce qui plombe la rentabilité.",
      problems: [
        {
          n: "01",
          title: "500 leads/mois, 70% non-qualifiés",
          desc: "Vos simulateurs et formulaires génèrent un volume énorme. Vos commerciaux passent leurs journées à filtrer manuellement avant le premier appel utile.",
        },
        {
          n: "02",
          title: "Qualif MaPrimeRénov à la main",
          desc: "Revenus, type de logement, fiscalité : l'éligibilité aux aides change selon 8 paramètres. Sans outil, c'est 20 min de check par dossier avant même de chiffrer.",
        },
        {
          n: "03",
          title: "Suivi installation morcelé",
          desc: "Matériel, technicien, Consuel, mise en service : 4 acteurs, 4 outils, 4 plannings. Le client appelle tous les 3 jours pour avoir une visibilité.",
        },
      ],
      workflowsH2: "Ce qu'on automatise chez un installateur photovoltaïque.",
      workflowsSubtitle:
        "Cinq workflows calibrés sur le cycle de vente long et la conformité, livrés en 2 à 3 semaines.",
      workflows: [
        {
          title: "Qualification IA en 24h",
          desc: "L'agent IA prend les nouveaux leads, qualifie (type toit, surface, conso, budget, éligibilité MPR) et notifie uniquement les vrais prospects au commercial.",
        },
        {
          title: "Pré-étude éligibilité MaPrimeRénov",
          desc: "Calcul automatique des aides sur la base des données collectées. Le commercial arrive en RDV avec le chiffre net de poche déjà calculé.",
        },
        {
          title: "Relances financement",
          desc: "Devis envoyé, client, banque, courtier : on relance chaque acteur sur 30 jours, jusqu'à signature. Plus aucun dossier qui dort.",
        },
        {
          title: "Suivi installation centralisé",
          desc: "Matériel en commande, technicien planifié, Consuel demandé, mise en service confirmée : le client a un dashboard, vos équipes ont la même vue.",
        },
        {
          title: "Monitoring production post-pose",
          desc: "Alerte automatique si la production réelle baisse. Le SAV devient proactif au lieu d'être déclenché par un client mécontent.",
        },
      ],
      caseH2: "Un installateur régional, 25 personnes.",
      before: [
        "500 leads/mois, 70% traités à la main",
        "3 semaines entre premier lead et signature",
        "Suivi installation par téléphone et email manuel",
        "SAV déclenché par appel client, jamais proactif",
      ],
      after: [
        "Agent IA qualifie en 24h, commerciaux sur 30% des leads",
        "Signature en 8 jours en moyenne",
        "Dashboard installation auto, appels client -60%",
        "Monitoring proactif, SAV préventif sur 80% des cas",
      ],
      roiLabel: "Retour sur investissement",
      roiValue: "10 semaines",
      caseFootnote:
        "Scénario type, pas un client existant. Les chiffres réels sont validés lors de l'audit gratuit.",
      faqH2: "Avant d'en parler.",
      faqs: [
        [
          "Vous gérez vraiment l'éligibilité MaPrimeRénov ?",
          "Oui. On modélise la grille d'aide en vigueur et on l'applique automatiquement à chaque dossier. Vos commerciaux savent le reste à charge avant le RDV.",
        ],
        [
          "Compatible avec votre logiciel d'étude (Archelios, PVCalc, AutoCalSol) ?",
          "Oui pour ceux qui exposent une API ou un export structuré. On branche, on synchronise, vous gardez votre outil de chiffrage.",
        ],
        [
          "Et le suivi post-installation, vous touchez à l'onduleur ?",
          "On lit la production via l'API constructeur (Enphase, SolarEdge, Huawei). On ne touche pas au matériel, juste à la couche données + alertes.",
        ],
        [
          "Combien de leads par mois pour que ce soit rentable ?",
          "À partir de 80 leads/mois, le ROI est mesurable en 3 mois. En dessous, on regarde si le pain est plutôt sur le suivi installation que sur la qualif.",
        ],
      ],
      ctaH2: "30 minutes pour cartographier votre tunnel solaire.",
      ctaSubtitle:
        "On regarde votre volume de leads, votre process de qualification et votre suivi installation. On identifie où l'automatisation rend le plus de marge.",
    },
    en: {
      metaTitle: "Automation for solar installers — Leads, qualification, tracking",
      metaDescription:
        "Automation for photovoltaic installers: lead qualification, install tracking, post-install monitoring. n8n workflows and AI agents tailored to the long sales cycle.",
      eyebrow: "AUTOMATION · PHOTOVOLTAIC",
      h1: "Automation for solar panel installers.",
      subtitle:
        "Massive lead flow, manual qualification, time-consuming install tracking. We automate the funnel from qualification to post-install monitoring — without cutting corners on compliance.",
      audienceLabel: "For",
      audience: [
        "Certified photovoltaic installers",
        "National networks",
        "Energy brokers & intermediaries",
      ],
      problemH2: "What kills margins.",
      problems: [
        {
          n: "01",
          title: "500 leads/month, 70% unqualified",
          desc: "Your simulators and forms generate huge volume. Your sales team spends days filtering manually before the first useful call.",
        },
        {
          n: "02",
          title: "Subsidy eligibility done by hand",
          desc: "Income, housing type, taxation: eligibility for energy subsidies depends on 8 parameters. Without a tool, that's 20 min of checks per file before even pricing.",
        },
        {
          n: "03",
          title: "Fragmented install tracking",
          desc: "Hardware, technician, grid certification, commissioning: 4 actors, 4 tools, 4 schedules. Clients call every 3 days for visibility.",
        },
      ],
      workflowsH2: "What we automate for a solar installer.",
      workflowsSubtitle:
        "Five workflows calibrated for the long sales cycle and compliance, delivered in 2 to 3 weeks.",
      workflows: [
        {
          title: "AI qualification in 24h",
          desc: "AI agent takes new leads, qualifies (roof type, surface, consumption, budget, subsidy eligibility) and only notifies real prospects to the sales team.",
        },
        {
          title: "Subsidy eligibility pre-study",
          desc: "Automatic subsidy calculation based on collected data. Sales arrive at the meeting with the net out-of-pocket already calculated.",
        },
        {
          title: "Financing follow-up",
          desc: "Quote sent, client, bank, broker: we follow up with each actor over 30 days, until signature. No more dormant files.",
        },
        {
          title: "Centralized install tracking",
          desc: "Hardware ordered, technician scheduled, certification requested, commissioning confirmed: client has a dashboard, your team has the same view.",
        },
        {
          title: "Post-install production monitoring",
          desc: "Automatic alert if real production drops. Service becomes proactive instead of triggered by an unhappy client.",
        },
      ],
      caseH2: "A regional installer, 25 people.",
      before: [
        "500 leads/month, 70% processed by hand",
        "3 weeks between first lead and signature",
        "Install tracking by phone and manual email",
        "Service triggered by client call, never proactive",
      ],
      after: [
        "AI agent qualifies in 24h, sales on 30% of leads",
        "Signature in 8 days on average",
        "Auto install dashboard, client calls -60%",
        "Proactive monitoring, preventive service on 80% of cases",
      ],
      roiLabel: "Return on investment",
      roiValue: "10 weeks",
      caseFootnote:
        "Typical scenario, not an existing client. Real figures are validated during the free audit.",
      faqH2: "Before we talk.",
      faqs: [
        [
          "Do you really handle subsidy eligibility?",
          "Yes. We model the current subsidy grid and apply it automatically to each file. Your sales team knows the remaining cost before the meeting.",
        ],
        [
          "Compatible with your study software (Archelios, PVCalc, AutoCalSol)?",
          "Yes for those exposing an API or structured export. We connect, sync, you keep your pricing tool.",
        ],
        [
          "Post-install tracking, do you touch the inverter?",
          "We read production via the manufacturer API (Enphase, SolarEdge, Huawei). We don't touch the hardware, only the data + alert layer.",
        ],
        [
          "How many leads per month to make it worthwhile?",
          "From 80 leads/month, ROI is measurable in 3 months. Below that, we look if the pain is more on install tracking than on qualification.",
        ],
      ],
      ctaH2: "30 minutes to map your solar funnel.",
      ctaSubtitle:
        "We look at your lead volume, qualification process and install tracking. We identify where automation returns the most margin.",
    },
  },
};

export const SECTOR_SLUGS = Object.keys(SECTORS);
