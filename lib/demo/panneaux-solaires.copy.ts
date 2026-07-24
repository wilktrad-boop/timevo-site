import type { DemoCopy } from "./types";

/**
 * Textes de la démo photovoltaïque.
 *
 * Les nombres cités dans la lecture commentée proviennent de la sortie réelle
 * du module de calcul en période 30 jours, pas d'une estimation.
 */

export const SOLAIRE_FR: DemoCopy = {
  metaTitle: "Dashboard installateur photovoltaïque — démo interactive",
  metaDescription:
    "Démo du tableau de bord livré à un installateur solaire : qualification des leads, suivi d'installation, monitoring de production, facturation. Données fictives, interface réelle.",
  eyebrow: "DÉMONSTRATION · PHOTOVOLTAÏQUE",
  h1: "Le tableau de bord d'un installateur solaire.",
  subtitle:
    "Voilà ce qu'un installateur de 25 personnes a sous les yeux le matin. Les simulations entrantes deviennent une liste courte, les dossiers en cours ont chacun leur jalon, et la production des installations posées se surveille toute seule.",

  demoBadge: "Démonstration — données fictives",
  demoNote:
    "Scénario type, pas un client existant. Toutes les données de cette page sont fictives : noms, montants, transcriptions. Les boutons réagissent mais n'envoient rien. L'interface, elle, est celle qu'on livre. Les chiffres réels sont établis pendant l'audit gratuit.",

  sections: {
    overview: "Vue d'ensemble",
    quotes: "Dossiers",
    calls: "Qualification",
    leads: "Leads",
    billing: "Facturation",
  },

  kpis: {
    openQuotes: "Dossiers en cours",
    signed: "Signé sur la période",
    calls: "Appels qualifiés",
    leads: "Leads reçus",
  },

  charts: {
    signedOverTime: "Chiffre signé par période",
    quotesSentVsSigned: "Dossiers ouverts et signés",
    revenueMix: "Répartition du chiffre signé",
    scoreSpread: "Distribution des scores d'éligibilité",
    sent: "Ouverts",
    signed: "Signés",
    other: "Autres",
  },

  ui: {
    rangeLabel: "Période",
    range7: "7 jours",
    range30: "30 jours",
    range90: "90 jours",
    all: "Tous",
    empty: "Aucune ligne sur cette période.",
    close: "Fermer",
    detail: "Détail",
    fictionalReminder: "Données fictives",
    rowHint: "Cliquez une ligne pour le détail",
  },

  quotesH2: "Dossiers en cours",
  quotesCols: {
    client: "Client & installation",
    amount: "Montant HT",
    follow: "Relances",
    outcome: "Statut",
    age: "Ouvert",
  },
  outcomes: { win: "En service", loss: "Abandonné", pending: "En cours" },
  quoteActions: { remind: "Relancer maintenant", markWon: "Marquer en service" },
  quoteToasts: {
    remind: "Relance programmée pour demain 9h00",
    markWon: "Dossier marqué en service · monitoring activé",
  },

  callsH2: "Qualification",
  urgentLabel: "Rappel prioritaire",
  transcriptLabel: "Transcription",
  callOutcomes: { handled: "Qualifié par l'agent", escalated: "Escaladé au SAV" },
  callActions: { callBack: "Programmer un rappel" },
  callToasts: { callBack: "Rappel ajouté à l'agenda · aujourd'hui 17h30" },

  leadsH2: "Leads du simulateur",
  scoreLabel: "Éligibilité",
  emailReadyLabel: "Étude prête à envoyer",
  leadFilters: { accepted: "Éligibles", rejected: "Non éligibles" },
  leadActions: { send: "Envoyer l'étude", edit: "Modifier" },
  leadToasts: { send: "Étude envoyée · lead passé en suivi commercial" },

  billingH2: "Facturation & TVA",
  billingStats: {
    collected: "Encaissé",
    vat: "TVA collectée",
    outstanding: "En attente de règlement",
    overdue: "Dont en retard",
  },
  invoicesCols: {
    ref: "Référence",
    client: "Client",
    amount: "Montant HT",
    status: "Statut",
    due: "Échéance",
  },
  invoiceStatus: { paid: "Réglée", waiting: "En attente", late: "En retard" },
  invoiceActions: { remind: "Relancer le règlement" },
  invoiceToasts: { remind: "Relance de règlement envoyée · copie au comptable" },

  readingH2: "Ce que l'automatisation fait dans cet écran.",
  readingSubtitle:
    "Le tableau ci-dessus n'affiche que des données. Voilà ce qui les produit, section par section. Les chiffres cités sont ceux de la vue 30 jours.",
  readings: [
    {
      tab: "Dossiers",
      text: "Matériel, pose, Consuel, mise en service : quatre acteurs, quatre plannings, et jusqu'ici quatre sources de vérité. Chaque jalon franchi met la ligne à jour et prévient le client. Les 9 dossiers en cours sont lisibles sans que personne ait à faire le point.",
    },
    {
      tab: "Qualification",
      text: "L'agent appelle les simulations entrantes et collecte les six paramètres d'éligibilité avant qu'un commercial y touche. Le locataire en copropriété sort du pipeline en trois minutes au lieu d'occuper un rendez-vous. Sur 10 appels, 2 seulement ont été escaladés — et les deux étaient des pannes détectées par le monitoring avant l'appel du client.",
    },
    {
      tab: "Leads",
      text: "12 leads sur la période, 7 réellement exploitables. Les dossiers complets arrivent avec le reste à charge après aides déjà calculé, donc le commercial ouvre la conversation sur un chiffre net plutôt que sur un questionnaire. Les 5 écartés le sont pour un motif écrit : toiture ombragée, fibrociment, locataire.",
    },
    {
      tab: "Facturation",
      text: "Les factures suivent les jalons, les relances partent seules, et la TVA réduite s'applique selon l'éligibilité du dossier. C'est aussi ce qui fait apparaître les 18 500 € en retard de règlement, sur 85 700 € encore en attente.",
    },
  ],

  ctaH2: "Le vôtre ressemblerait à quoi ?",
  ctaSubtitle:
    "En 30 minutes on regarde votre volume de leads, votre process de qualification et votre suivi d'installation. Vous repartez avec les points où l'automatisation rend le plus de marge.",
  ctaButton: "Réserver l'audit gratuit",
  ctaReassurance: "30 minutes · Gratuit · Sans engagement · Diagnostic écrit",
};

export const SOLAIRE_EN: DemoCopy = {
  metaTitle: "Solar installer dashboard — interactive demo",
  metaDescription:
    "Demo of the dashboard we ship to a solar installer: lead qualification, installation tracking, output monitoring, invoicing. Fictional data, real interface.",
  eyebrow: "DEMONSTRATION · SOLAR",
  h1: "A solar installer's dashboard.",
  subtitle:
    "This is what a twenty-five-person installer sees in the morning. Incoming simulations become a short list, each open case has its milestone, and output from installed systems watches itself.",

  demoBadge: "Demonstration — fictional data",
  demoNote:
    "Typical scenario, not an existing client. Every piece of data on this page is fictional: names, amounts, transcripts. The buttons respond but send nothing. The interface is the one we ship. Real figures are established during the free audit.",

  sections: {
    overview: "Overview",
    quotes: "Cases",
    calls: "Qualification",
    leads: "Leads",
    billing: "Invoicing",
  },

  kpis: {
    openQuotes: "Open cases",
    signed: "Signed in period",
    calls: "Qualification calls",
    leads: "Leads received",
  },

  charts: {
    signedOverTime: "Signed revenue by period",
    quotesSentVsSigned: "Cases opened and signed",
    revenueMix: "Signed revenue mix",
    scoreSpread: "Eligibility score distribution",
    sent: "Opened",
    signed: "Signed",
    other: "Other",
  },

  ui: {
    rangeLabel: "Period",
    range7: "7 days",
    range30: "30 days",
    range90: "90 days",
    all: "All",
    empty: "No rows in this period.",
    close: "Close",
    detail: "Detail",
    fictionalReminder: "Fictional data",
    rowHint: "Click a row for the detail",
  },

  quotesH2: "Open cases",
  quotesCols: {
    client: "Client & installation",
    amount: "Amount excl. VAT",
    follow: "Follow-ups",
    outcome: "Status",
    age: "Opened",
  },
  outcomes: { win: "Commissioned", loss: "Dropped", pending: "In progress" },
  quoteActions: { remind: "Follow up now", markWon: "Mark commissioned" },
  quoteToasts: {
    remind: "Follow-up scheduled for tomorrow 9:00am",
    markWon: "Case marked commissioned · monitoring switched on",
  },

  callsH2: "Qualification",
  urgentLabel: "Priority call back",
  transcriptLabel: "Transcript",
  callOutcomes: { handled: "Qualified by the agent", escalated: "Escalated to service" },
  callActions: { callBack: "Schedule a call back" },
  callToasts: { callBack: "Call back added to the calendar · today 5:30pm" },

  leadsH2: "Simulator leads",
  scoreLabel: "Eligibility",
  emailReadyLabel: "Study ready to send",
  leadFilters: { accepted: "Eligible", rejected: "Not eligible" },
  leadActions: { send: "Send the study", edit: "Edit" },
  leadToasts: { send: "Study sent · lead moved to sales follow-up" },

  billingH2: "Invoicing & VAT",
  billingStats: {
    collected: "Collected",
    vat: "VAT collected",
    outstanding: "Awaiting payment",
    overdue: "Of which overdue",
  },
  invoicesCols: {
    ref: "Reference",
    client: "Client",
    amount: "Amount excl. VAT",
    status: "Status",
    due: "Due",
  },
  invoiceStatus: { paid: "Paid", waiting: "Awaiting", late: "Overdue" },
  invoiceActions: { remind: "Chase payment" },
  invoiceToasts: { remind: "Payment reminder sent · copied to the accountant" },

  readingH2: "What the automation does in this screen.",
  readingSubtitle:
    "The dashboard above only shows data. Here is what produces it, section by section. The figures quoted are those of the 30-day view.",
  readings: [
    {
      tab: "Cases",
      text: "Equipment, installation, compliance inspection, commissioning: four parties, four schedules, and until now four sources of truth. Each milestone passed updates the row and tells the client. The 9 open cases are readable without anyone having to take stock.",
    },
    {
      tab: "Qualification",
      text: "The agent calls incoming simulations and collects the six eligibility parameters before a salesperson touches them. The tenant in a block of flats leaves the pipeline in three minutes instead of taking up a meeting. Of 10 calls, only 2 were escalated — and both were faults the monitoring caught before the client rang.",
    },
    {
      tab: "Leads",
      text: "12 leads over the period, 7 genuinely workable. Complete files arrive with the net cost after grants already calculated, so the salesperson opens the conversation on a number rather than a questionnaire. The 5 discarded each carry a written reason: shaded roof, fibre cement, tenant.",
    },
    {
      tab: "Invoicing",
      text: "Invoices follow the milestones, reminders go out on their own, and reduced VAT applies according to each case's eligibility. It is also what surfaces the €18,500 in late payments, out of €85,700 still outstanding.",
    },
  ],

  ctaH2: "What would yours look like?",
  ctaSubtitle:
    "In 30 minutes we look at your lead volume, your qualification process and your installation tracking. You leave with the points where automation returns the most margin.",
  ctaButton: "Book the free audit",
  ctaReassurance: "30 minutes · Free · No commitment · Written diagnostic",
};
