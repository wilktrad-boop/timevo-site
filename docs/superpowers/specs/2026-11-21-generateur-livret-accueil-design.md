# Générateur de livret d'accueil en ligne

Date : 2026-11-21
Statut : conception validée par Willy, à planifier

## Pourquoi

La ressource « livret d'accueil Airbnb » (`/fr/ressources/livret-accueil-airbnb`, en ligne
depuis le 21/11) donne un modèle Word à compléter. Max prospecte les conciergeries sur
LinkedIn et veut une ressource de nurturing plus forte : que la conciergerie puisse
**produire son livret de A à Z** et repartir avec un fichier prêt à envoyer à ses voyageurs.

Le générateur sert aussi de démonstration : l'option IA montre concrètement ce que Timevo
met en place, et mène à l'offre `/fr/automatisation-pour/conciergerie`.

## Décisions prises

| Question | Décision |
|---|---|
| Livrable | Un **PDF à la marque** de la conciergerie (logo, couleur), prêt à envoyer ou imprimer. Pas de lien web hébergé. |
| Rédaction | Formulaire guidé, avec **IA en option** : pré-remplissage depuis la description de l'annonce. |
| Email | Demandé **seulement avant la première utilisation de l'IA**. Le formulaire et le PDF sont libres. |
| Langues | **Français + anglais.** La version anglaise des textes libres est traduite par l'IA ; les titres et textes fixes sont traduits une fois pour toutes et relus par Willy. |
| Architecture | **Tout dans le navigateur** : brouillon et PDF générés chez la conciergerie. Seuls l'email et les textes envoyés à l'IA transitent par le serveur. |

Écarté : livret en ligne avec lien et QR code (il faudrait stocker et héberger chaque livret),
comptes utilisateurs (une petite application avec base de données), génération du PDF côté
serveur (les codes d'accès et mots de passe Wi-Fi transiteraient chez nous).

## Parcours

1. **Vitrine.** La page actuelle `/fr/ressources/livret-accueil-airbnb` garde son contenu.
   Son bouton principal devient « Créer mon livret en ligne » vers
   `/fr/ressources/livret-accueil-airbnb/creer`. Le formulaire du modèle Word (contre un
   email) reste proposé en second.
2. **Générateur**, en six étapes, une par rubrique :
   1. Votre conciergerie : nom, logo (PNG ou JPG, 1 Mo maximum), couleur, nom du logement,
      adresse, contact.
   2. L'arrivée : horaires, accès, clés, stationnement, arrivée tardive.
   3. Le logement : Wi-Fi, télévision, équipements, en cas de souci, emplacements utiles.
   4. Les règles de la maison : capacité, calme, tabac, animaux, tri.
   5. Le quartier : restaurants, quotidien, transports.
   6. Le départ et les numéros utiles.
3. Chaque champ affiche un exemple ; les textes courants (règles, check-list de départ,
   numéros d'urgence) sont déjà rédigés et modifiables. Un champ laissé vide fait
   disparaître sa ligne du PDF, une rubrique entièrement vide disparaît aussi.
4. **Aperçu en direct** : à droite en desktop, dans un onglet « Aperçu » sur mobile. Il
   reprend la structure du PDF en HTML ; il n'est pas le PDF lui-même.
5. **Téléchargement** : « Télécharger mon livret (PDF) », sans email. Après l'ajout de la
   version anglaise, un second bouton « Télécharger la version anglaise ».
6. **Brouillon** gardé dans le navigateur (`localStorage`, lectures et écritures protégées
   par try/catch). Bouton « Effacer mon brouillon ». Sans stockage disponible (navigation
   privée), le générateur fonctionne sans sauvegarde.
7. Après le téléchargement : un encart vers l'offre conciergerie et le diagnostic gratuit.

## L'IA

**Déblocage.** Au premier clic sur une fonction IA, une fenêtre demande : email,
nombre de logements (mêmes choix que le formulaire actuel), nom de la conciergerie
(facultatif), consentement. Le contact part à hello@timevo.io par le SMTP déjà en place
(même mail que le modèle Word, objet « Générateur de livret : … »). Le serveur pose alors un
cookie `httpOnly` signé qui débloque l'IA dans ce navigateur.

**Rédiger depuis l'annonce.** À l'étape 1, un encart « Gagnez du temps : collez la
description de votre annonce » (texte libre, 6 000 caractères maximum). L'IA renvoie
uniquement les champs qu'elle peut déduire du texte. Elle ne remplit **jamais** :
codes, mots de passe, horaires, numéros de téléphone, adresse exacte. Ces champs sont
absents du schéma de sortie, donc impossibles à produire. Les champs pré-remplis sont
signalés « pré-rempli par l'IA, à vérifier » jusqu'à ce que la conciergerie les modifie.
Un champ déjà rempli à la main n'est jamais écrasé.

**Traduire en anglais.** À la fin, « Ajouter la version anglaise » envoie les seuls textes
libres saisis par la conciergerie (pas les codes, mots de passe, téléphones ni adresse) et
reçoit leur traduction. La version anglaise est modifiable avant téléchargement.

**Appel à l'API.**
- SDK officiel `@anthropic-ai/sdk`, modèle `claude-opus-5-5`, `output_config.effort: "low"`,
  sortie structurée (`output_config.format`, schéma JSON), réponse revalidée côté serveur
  avant d'être renvoyée au navigateur.
- Repli serveur en cas de refus : beta `server-side-fallback-2026-07-01`, `fallbacks: "default"`.
- Prompt système fixe : rôle, règles (ne rien inventer, laisser vide ce qui n'est pas dans le
  texte, ton chaleureux et sobre), schéma. La description de l'annonce est traitée comme
  donnée, pas comme instruction.

**Garde-fous de coût.**
- Le cookie signé porte un compteur journalier : 15 appels IA par navigateur et par jour.
- La protection réelle est le **plafond de dépenses mensuel** de la clé dédiée dans la
  console Anthropic : un cookie peut être effacé.
- Variables Vercel : `ANTHROPIC_API_KEY` (clé dédiée nommée `timevo-site-livret`, créée par
  Willy, utilisée nulle part ailleurs) et `LIVRET_SECRET` (signature du cookie). Sans elles,
  les boutons IA sont masqués et le générateur reste utilisable sans IA.

## Le PDF

- Généré dans le navigateur avec `@react-pdf/renderer` 4.9.0, chargé dynamiquement au clic
  sur « Télécharger » (pas de poids ajouté au chargement de la page).
- Mise en page du modèle actuel : A4, page de couverture (nom de la conciergerie, « Bienvenue
  chez vous. », tableau récapitulatif), puis les rubriques. Logo en tête de couverture,
  couleur de la conciergerie sur les titres et filets.
- Police Helvetica intégrée au moteur PDF (accents français couverts, aucun fichier de
  police à charger).
- Aucune mention Timevo dans les pages : la conciergerie envoie ce livret à ses voyageurs.
  Timevo figure seulement dans les métadonnées du fichier (`creator`).
- Nom du fichier : `livret-accueil-<logement>.pdf` (et `-en` pour l'anglais).

## Découpage du code

| Fichier | Rôle |
|---|---|
| `lib/livret/contenu.ts` | Source unique du livret : rubriques, champs, textes par défaut, libellés fixes FR et EN, liste des champs jamais envoyés à l'IA. |
| `lib/livret/types.ts` | Type `LivretData` (toutes les valeurs saisies) et fonctions pures : brouillon vide, fusion d'une réponse IA sans écraser la saisie, sélection des textes à traduire. |
| `components/livret/Generateur.tsx` | Client : étapes, état, brouillon, aperçu, fenêtre de déblocage. |
| `components/livret/Apercu.tsx` | Aperçu HTML du livret. |
| `components/livret/LivretPdf.tsx` | Document `@react-pdf/renderer`, importé dynamiquement. |
| `app/[locale]/ressources/livret-accueil-airbnb/creer/page.tsx` | Page du générateur, français uniquement (`/en/...` en 404), dans le sitemap. |
| `app/[locale]/ressources/livret-accueil-airbnb/ia-actions.ts` | Actions serveur `debloquerIa`, `redigerDepuisAnnonce`, `traduireEnAnglais`. |
| `lib/livret/cookie.ts` | Signature et lecture du cookie (HMAC SHA-256 avec `LIVRET_SECRET`), compteur journalier. |
| `lib/leads.ts` | Envoi SMTP extrait de l'action actuelle, partagé par le modèle Word et le générateur. |

Le script `scripts/livret-accueil/build-livret.cjs` passe en `.mts` et lit
`lib/livret/contenu.ts` (Node 24 exécute le TypeScript sans compilation) : le modèle Word et
le générateur partagent le même texte. `scripts/livret-accueil/contenu.cjs` disparaît.
Contrainte qui en découle : `lib/livret/contenu.ts` n'importe rien (ni alias `@/`, ni module
du site), pour rester lisible par le script hors de Next.js.

## Données personnelles

- Transitent par le serveur : email, nombre de logements, nom de la conciergerie, description
  de l'annonce collée, textes envoyés à la traduction. Rien n'est stocké par Timevo hormis le
  mail de contact.
- Ne transitent jamais : codes, mots de passe, téléphones, adresse, logo, PDF.
- Politique de confidentialité : ajout d'Anthropic comme sous-traitant (traitement des textes
  envoyés à l'IA), mention du générateur dans « Données collectées ».

## Erreurs

- IA indisponible, refus, délai dépassé ou réponse invalide : message « La rédaction
  automatique n'a pas abouti, vous pouvez continuer à la main. » Le formulaire reste intact.
- Limite journalière atteinte : message explicite, le reste du générateur fonctionne.
- Logo trop lourd ou format refusé : message sous le champ, logo ignoré.
- Échec de génération du PDF : message et bouton « Réessayer ».
- Échec SMTP au déblocage : l'IA est quand même débloquée, l'échec est journalisé (même règle
  que le formulaire du modèle Word).

## Vérification

Pas de framework de test dans le projet ; vérification par scénarios Playwright, comme pour
la ressource actuelle :
- parcours complet sans IA jusqu'au PDF téléchargé, contenu du PDF relu (texte extrait) ;
- champ vide absent du PDF, logo et couleur appliqués ;
- brouillon retrouvé après rechargement, puis effacé ;
- déblocage IA avec un faux serveur SMTP local, cookie posé, compteur respecté ;
- affichage à 375 px sans défilement horizontal, et en desktop ;
- appels IA réels : seulement avec l'accord de Willy (ils coûtent), sur 2 ou 3 descriptions
  d'annonce fictives, en vérifiant qu'aucun code ni horaire n'est inventé.

## Livraison en deux temps

1. **Générateur sans IA** : vitrine mise à jour, générateur, aperçu, PDF français, source
   unique du contenu, script Word migré. Mis en ligne dès qu'il est vérifié.
2. **IA et anglais** : déblocage par email, rédaction depuis l'annonce, libellés fixes anglais
   (relus par Willy), traduction, PDF anglais, politique de confidentialité. Mis en ligne une
   fois `ANTHROPIC_API_KEY` et `LIVRET_SECRET` posées dans Vercel.

## Hors périmètre

Livret en ligne hébergé et QR code, comptes et livrets enregistrés, autres langues que
l'anglais, séquence de nurturing automatique, version anglaise de la page vitrine.
