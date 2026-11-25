# Audit d'avis Google

Date : 2026-11-22
Statut : conception validée par Willy, à planifier

## Pourquoi

Deuxième outil gratuit d'appel (lead magnet) de timevo.io, après le générateur de livret
d'accueil. Toutes les PME locales ont des avis Google et la plupart n'y répondent pas.
« Répondre à un avis Google » et ses variantes font environ 1 000 recherches par mois en
France (Google Ads, via Cuik, le 22/11/2026), faible concurrence, et ceux qui cherchent
sont des commerçants et des dirigeants : la cible de Timevo.

Une première idée (rédiger une réponse à un avis collé à la main) a été écartée par Willy :
trop peu de valeur. L'audit complet de la fiche, comparé aux concurrents locaux, donne au
visiteur de quoi agir tout de suite et mène à l'offre : un agent IA qui rédige les
réponses chaque jour, que le client valide.

Page d'explication pour Maxime : https://claude.ai/artifact/5YprjRB8pUKJHropJNBVL9

## Décisions prises

| Question | Décision |
|---|---|
| Forme | **Audit de la fiche Google**, pas un rédacteur de réponse isolé. |
| Email | **Aperçu gratuit sans email** (note et nombre d'avis face à 3 concurrents), puis **email vérifié par code** pour l'audit complet. Même système que le livret. |
| Livrable | Rapport **à l'écran et en PDF envoyé par email** à l'adresse vérifiée. PDF généré dans le navigateur, avec l'habillage du livret. |
| Données | **DataForSEO** : Google Maps (fiche et concurrents) et Google Reviews (avis). **Compte actuel de Willy réutilisé**, choix assumé malgré la règle « une clé = un usage » (DataForSEO n'a pas de clés par projet). |
| IA | **Claude Sonnet** (`claude-sonnet-5-5`), clé dédiée `timevo-site-avis` avec plafond de dépense mensuel. |
| Abus | **Base Upstash Redis** (offre gratuite, via Vercel) pour compter : limites par email, par visiteur, plafond global, cache des avis. |
| Langue | Page et rapport en **français uniquement**, comme le livret (`/en/...` renvoie 404). Les réponses aux avis sont rédigées **dans la langue de l'avis**. |

Écarté : un compte DataForSEO dédié (choix de Willy) ; un fonctionnement sans base (une
seule personne pourrait épuiser le budget du mois) ; l'API Google Places (5 avis au
maximum par fiche).

## Parcours

1. **Page** `/fr/ressources/repondre-avis-google`. Elle vise la requête « répondre à un
   avis Google » : un vrai contenu éditorial (comment répondre à un avis positif, à un avis
   négatif, exemples, erreurs à éviter) et l'outil d'audit en haut de page.
2. **Recherche.** Le visiteur tape le nom de son entreprise et sa ville. On interroge
   Google Maps et on affiche au plus 5 fiches (nom, adresse, catégorie, note, nombre
   d'avis). Il choisit la sienne.
3. **Aperçu gratuit**, sans nouvel appel : sa note et son nombre d'avis, à côté de 3
   concurrents de la même catégorie tirés de la même recherche Maps (catégorie + ville).
   Barres à l'échelle de la note sur 5.
4. **Email et code.** Email professionnel, consentement, code à 6 chiffres envoyé par
   email. L'accès vérifié est gardé 30 jours dans le navigateur, comme pour le livret.
5. **Audit**, environ une minute, avec un indicateur d'avancement : récupération des avis,
   calculs, analyse par l'IA.
6. **Rapport à l'écran**, puis PDF généré dans le navigateur et envoyé en pièce jointe à
   l'adresse vérifiée. Fin du rapport : l'agent qui répond aux avis chaque jour, et le
   diagnostic gratuit (`lib/contact.ts`).

## Contenu du rapport

Calculé **sans IA** (aucun chiffre inventé) :
- note moyenne et nombre d'avis, comparés aux 3 concurrents ;
- **taux de réponse** : part des avis ayant une réponse du propriétaire ;
- **délai moyen de réponse**, quand la date de réponse est connue ;
- **note par trimestre** sur les 12 derniers mois ;
- liste des **avis sans réponse**.

Produit **par l'IA**, en une seule requête à réponse structurée :
- 3 à 5 **points forts** et 3 à 5 **reproches** récurrents, chacun avec 1 ou 2 citations
  exactes tirées des avis ;
- une **réponse rédigée** pour chaque avis sans réponse, les 20 plus récents au maximum,
  dans la langue de l'avis, signée avec le nom de l'entreprise ;
- **3 recommandations** concrètes, adaptées au métier.

Les citations sont vérifiées côté serveur : une citation qui ne figure pas mot pour mot dans
un avis est retirée.

## Architecture

Tout côté serveur passe par des **Server Actions** (vérification d'origine par Next,
limite de corps déjà portée à 4 Mo pour le PDF).

| Unité | Rôle |
|---|---|
| `lib/avis/dataforseo.ts` | Client DataForSEO : recherche Maps (`serp/google/maps/live/advanced`), création de la tâche d'avis (`business_data/google/reviews/task_post`, file prioritaire, profondeur 200) et lecture (`task_get`). Identifiants `DATAFORSEO_LOGIN` / `DATAFORSEO_PASSWORD`. |
| `lib/avis/calculs.ts` | Fonctions pures : taux de réponse, délai, note par trimestre, avis sans réponse, choix des 3 concurrents. Testées unitairement. |
| `lib/avis/analyse.ts` | Requête à Claude (SDK officiel `@anthropic-ai/sdk`), sortie structurée, vérification des citations. Clé `ANTHROPIC_API_KEY`. |
| `lib/avis/limites.ts` | Limites et cache sur Upstash Redis (`@upstash/redis`, `@upstash/ratelimit`). |
| `lib/livret/jeton.ts`, `lib/mail.ts` | Réutilisés : code par email, jeton d'accès, envoi. |
| `app/[locale]/ressources/repondre-avis-google/` | Page éditoriale, actions serveur (rechercher, demander un code, valider le code, lancer l'audit, suivre l'audit, envoyer le PDF). |
| `components/avis/` | Recherche, aperçu, écran d'email, suivi, rapport à l'écran, PDF (`@react-pdf/renderer`, Fraunces + Helvetica comme le livret). |

L'audit se fait en deux temps pour ne jamais dépasser la durée d'une fonction Vercel :
`lancerAudit` crée la tâche d'avis et renvoie son identifiant ; `suivreAudit`, appelée par
la page toutes les 5 secondes, renvoie « en cours » ou, quand les avis sont prêts, fait les
calculs et l'analyse et renvoie le rapport. Le rapport terminé est gardé 24 heures dans
Redis, pour qu'un rechargement de la page ne coûte rien.

## Limites et coûts

| Limite | Valeur |
|---|---|
| Aperçus (recherches Maps) par visiteur (IP) | 20 par jour |
| Audits complets par email vérifié | 3 par jour |
| Audits complets pour tout le site | 50 par jour |
| Cache des avis d'une fiche | 24 heures |

Au-delà, un message propose le diagnostic gratuit. Coût estimé par audit complet : 3 à
5 ct de données et 10 à 25 ct d'IA ; moins de 1 ct pour un aperçu. À confirmer au premier
essai.

Le contact est envoyé sur hello@ au lancement de l'audit : email vérifié, entreprise, note,
nombre d'avis, taux de réponse.

## Cas particuliers et erreurs

- **Aucune fiche trouvée** : message pour reformuler (nom exact, ville).
- **Moins de 3 concurrents** dans la catégorie : on affiche ceux qu'on a.
- **Fiche sans avis** : rapport réduit à des conseils pour obtenir les premiers avis, sans
  appel à l'IA.
- **Plus de 200 avis** : on analyse les 200 plus récents, et le rapport le précise.
- **DataForSEO en erreur ou tâche trop longue** (plus de 3 minutes) : message clair,
  l'audit n'est pas décompté de la limite de l'email, l'erreur est journalisée.
- **IA en erreur** : le rapport s'affiche avec les calculs seuls et un message.
- **Configuration absente** (identifiants, clé, Redis) : l'outil affiche « momentanément
  indisponible » au lieu de s'ouvrir sans limites. Différent du livret : ici chaque appel
  coûte.

## Confidentialité

Les avis Google sont publics. Le PDF transite par le serveur le temps de l'envoi, comme pour
le livret. La politique de confidentialité ajoute l'audit d'avis : données de la fiche
publique, email vérifié, envoi des avis à Anthropic pour l'analyse, conservation du rapport
24 heures.

## Tests

- Unitaires (`node --test`) : calculs, choix des concurrents, vérification des citations,
  limites (avec un Redis simulé).
- Bout en bout en local avec un faux DataForSEO, une fausse IA et le faux SMTP déjà
  utilisé pour le livret : recherche, aperçu, code, audit, rapport, PDF reçu.
- Un vrai audit en production avec l'adresse de Willy, comme pour le livret.

## Ce que Willy devra créer

- Une clé Claude `timevo-site-avis` avec plafond de dépense, dans `ANTHROPIC_API_KEY`.
- Une base Upstash Redis depuis le Marketplace Vercel (variables ajoutées automatiquement).
- `DATAFORSEO_LOGIN` et `DATAFORSEO_PASSWORD` dans Vercel, et l'alerte de solde bas dans
  DataForSEO.
