import type { DemoCopy } from "./types";

/**
 * Textes de la démo pisciniste.
 *
 * Séparé des enregistrements : `pisciniste.ts` porte les chiffres, ce fichier
 * porte la prose. Aucun total n'est écrit ici — tous les nombres cités dans la
 * lecture commentée ont été relevés sur la sortie réelle du module de calcul,
 * en période 30 jours (la période par défaut).
 */

export const PISCINISTE_FR: DemoCopy = {
  metaTitle: "Dashboard pisciniste — démo interactive",
  metaDescription:
    "Démo du tableau de bord livré à un pisciniste : suivi des devis, agent IA téléphonique, demandes qualifiées, facturation. Données fictives, interface réelle.",
  eyebrow: "DÉMONSTRATION · PISCINISTE",
  h1: "Le tableau de bord d'un pisciniste.",
  subtitle:
    "Voilà ce qu'un pisciniste de 12 personnes a sous les yeux le lundi matin, une fois les workflows en place. Devis, appels, demandes entrantes, facturation : tout au même endroit, mis à jour sans personne pour le faire.",

  demoBadge: "Démonstration — données fictives",
  demoNote:
    "Scénario type, pas un client existant. Toutes les données de cette page sont fictives : noms, montants, transcriptions. Les boutons réagissent mais n'envoient rien. L'interface, elle, est celle qu'on livre. Les chiffres réels sont établis pendant l'audit gratuit.",

  sections: {
    overview: "Vue d'ensemble",
    quotes: "Devis",
    calls: "Appels",
    leads: "Demandes",
    billing: "Facturation",
  },

  kpis: {
    openQuotes: "Devis en cours",
    signed: "Signé sur la période",
    calls: "Appels traités",
    leads: "Demandes reçues",
  },

  charts: {
    signedOverTime: "Chiffre signé par période",
    quotesSentVsSigned: "Devis envoyés et signés",
    revenueMix: "Répartition du chiffre signé",
    scoreSpread: "Distribution des scores",
    sent: "Envoyés",
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

  quotesH2: "Suivi des devis",
  quotesCols: {
    client: "Client & projet",
    amount: "Montant HT",
    follow: "Relances",
    outcome: "Statut",
    age: "Envoyé",
  },
  outcomes: { win: "Signé", loss: "Perdu", pending: "En attente" },
  quoteActions: { remind: "Relancer maintenant", markWon: "Marquer signé" },
  quoteToasts: {
    remind: "Relance programmée pour demain 9h00",
    markWon: "Devis marqué signé · séquence de relance arrêtée",
  },

  callsH2: "Appels",
  urgentLabel: "À rappeler",
  transcriptLabel: "Transcription",
  callOutcomes: { handled: "Traité par l'agent", escalated: "Escaladé" },
  callActions: { callBack: "Programmer un rappel" },
  callToasts: { callBack: "Rappel ajouté à l'agenda · aujourd'hui 17h30" },

  leadsH2: "Demandes du formulaire",
  scoreLabel: "Score",
  emailReadyLabel: "Réponse prête à envoyer",
  leadFilters: { accepted: "Qualifiées", rejected: "Écartées" },
  leadActions: { send: "Envoyer la réponse", edit: "Modifier" },
  leadToasts: { send: "Réponse envoyée · demande passée en suivi commercial" },

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
      tab: "Devis",
      text: "Chaque devis part avec sa séquence de relance. Personne ne la déclenche à la main, et personne n'oublie de la couper quand le client répond. Sur les 14 devis en cours, 9 sont déjà en relance programmée : c'est autant de dossiers qui avancent pendant que l'équipe est sur les chantiers.",
    },
    {
      tab: "Appels",
      text: "En saison, l'agent prend les appels que personne n'a le temps de prendre. Il qualifie, il résume, et il ne dérange un humain que quand ça le mérite : 14 appels traités sur la période, dont 4 escaladés au SAV — une eau verte, une fuite, un volet bloqué, une pompe sous contrat.",
    },
    {
      tab: "Demandes",
      text: "Chaque demande est notée avant d'arriver chez vous. Celles qui tiennent la route arrivent avec une réponse déjà écrite ; les autres ne vous font pas perdre de temps. Sur 15 demandes, 5 n'ont jamais atteint un commercial : un démarchage, un hors zone, un étudiant, deux messages vides.",
    },
    {
      tab: "Facturation",
      text: "Les factures partent, les relances aussi, et la TVA se calcule au fil de l'eau. Le comptable reçoit l'export sans le demander. C'est aussi ce qui fait remonter les 7 900 € en retard de règlement au lieu de les laisser dormir dans un tableur.",
    },
  ],

  ctaH2: "Le vôtre ressemblerait à quoi ?",
  ctaSubtitle:
    "En 30 minutes on regarde votre volume d'appels, votre délai de devis et votre récurrence d'entretien. Vous repartez avec la liste des workflows qui paient avant la prochaine saison.",
  ctaButton: "Réserver l'audit gratuit",
  ctaReassurance: "30 minutes · Gratuit · Sans engagement · Diagnostic écrit",
};

export const PISCINISTE_EN: DemoCopy = {
  metaTitle: "Pool builder dashboard — interactive demo",
  metaDescription:
    "Demo of the dashboard we ship to a pool builder: quote tracking, AI phone agent, scored enquiries, invoicing. Fictional data, real interface.",
  eyebrow: "DEMONSTRATION · POOL BUILDER",
  h1: "A pool builder's dashboard.",
  subtitle:
    "This is what a twelve-person pool builder sees on a Monday morning once the workflows are in place. Quotes, calls, incoming enquiries, invoicing: all in one place, kept up to date without anyone doing it.",

  demoBadge: "Demonstration — fictional data",
  demoNote:
    "Typical scenario, not an existing client. Every piece of data on this page is fictional: names, amounts, transcripts. The buttons respond but send nothing. The interface is the one we ship. Real figures are established during the free audit.",

  sections: {
    overview: "Overview",
    quotes: "Quotes",
    calls: "Calls",
    leads: "Enquiries",
    billing: "Invoicing",
  },

  kpis: {
    openQuotes: "Open quotes",
    signed: "Signed in period",
    calls: "Calls handled",
    leads: "Enquiries received",
  },

  charts: {
    signedOverTime: "Signed revenue by period",
    quotesSentVsSigned: "Quotes sent and signed",
    revenueMix: "Signed revenue mix",
    scoreSpread: "Score distribution",
    sent: "Sent",
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

  quotesH2: "Quote tracking",
  quotesCols: {
    client: "Client & project",
    amount: "Amount excl. VAT",
    follow: "Follow-ups",
    outcome: "Status",
    age: "Sent",
  },
  outcomes: { win: "Signed", loss: "Lost", pending: "Waiting" },
  quoteActions: { remind: "Follow up now", markWon: "Mark as signed" },
  quoteToasts: {
    remind: "Follow-up scheduled for tomorrow 9:00am",
    markWon: "Quote marked signed · follow-up sequence stopped",
  },

  callsH2: "Calls",
  urgentLabel: "Call back",
  transcriptLabel: "Transcript",
  callOutcomes: { handled: "Handled by the agent", escalated: "Escalated" },
  callActions: { callBack: "Schedule a call back" },
  callToasts: { callBack: "Call back added to the calendar · today 5:30pm" },

  leadsH2: "Website enquiries",
  scoreLabel: "Score",
  emailReadyLabel: "Reply ready to send",
  leadFilters: { accepted: "Qualified", rejected: "Discarded" },
  leadActions: { send: "Send the reply", edit: "Edit" },
  leadToasts: { send: "Reply sent · enquiry moved to sales follow-up" },

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
      tab: "Quotes",
      text: "Every quote ships with its follow-up sequence. Nobody triggers it by hand, and nobody forgets to stop it when the client replies. Of the 14 open quotes, 9 are already in a scheduled sequence — that many files moving forward while the team is on site.",
    },
    {
      tab: "Calls",
      text: "In season, the agent takes the calls nobody has time to take. It qualifies, it summarises, and it only interrupts a human when that's warranted: 14 calls handled over the period, 4 of them escalated — green water, a leak, a stuck cover, a pump under contract.",
    },
    {
      tab: "Enquiries",
      text: "Every enquiry is scored before it reaches you. The solid ones arrive with a reply already written; the rest don't cost you time. Of 15 enquiries, 5 never reached a salesperson: one cold pitch, one out of area, one student, two empty messages.",
    },
    {
      tab: "Invoicing",
      text: "Invoices go out, so do the reminders, and VAT adds up as it goes. The accountant gets the export without asking. It is also what surfaces the €7,900 in late payments instead of leaving them to sit in a spreadsheet.",
    },
  ],

  ctaH2: "What would yours look like?",
  ctaSubtitle:
    "In 30 minutes we look at your call volume, your quote turnaround and your maintenance recurrence. You leave with the list of workflows that pay for themselves before next season.",
  ctaButton: "Book the free audit",
  ctaReassurance: "30 minutes · Free · No commitment · Written diagnostic",
};
