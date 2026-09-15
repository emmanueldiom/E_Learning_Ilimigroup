# Contexte IA pour le backend

Ce document constitue la mémoire de travail pour les assistants IA qui codent sur ce projet. Il doit rester synchronisé avec `.ai/ARCHITECTURE.md` et le cahier des charges du projet (**version 2 — refonte des rôles**) — en cas de doute, le cahier des charges fait foi.

> Le planning Excel est en cours d'alignement sur la v2. En cas d'écart entre le planning et ce fichier, ce fichier prime.

## Identité du projet

- Projet : **E_Learning_Ilimigroup** — plateforme e-learning asynchrone pour ILIMIGROUP
- Runtime : Node.js + NestJS
- Langage : TypeScript
- Dossier principal de l'application backend : `Backend/`
- Stack actuelle : NestJS 11, TypeScript 5, MongoDB avec Mongoose, validation Joi (env) + class-validator (DTOs), Jest

## Portée du workspace

Ce fichier de contexte appartient au dossier actif du projet : `Backend/`.

Utilise ce dossier comme source de vérité pour les agents IA travaillant sur le backend. Ne mets pas les notes d'architecture backend dans un autre workspace sauf si tu veux volontairement isoler une application distincte (ex. le futur frontend Next.js).

## Le projet, en une phrase

Une plateforme web qui permet à un élève de payer en ligne une formation, de suivre ses cours (texte/vidéo) à son rythme, de passer des quiz pour valider ses acquis, et de gagner des points — pendant qu'un **Admin-Formateur** produit et publie le contenu pédagogique, qu'un **Formateur** assigné à chaque formation suit la progression des élèves, et qu'un **Administrateur** supervise l'ensemble (comptes, assignations, activité des Formateurs).

**Il n'y a pas de présentiel, pas d'emploi du temps, pas de présence à tracker.** Tout est asynchrone.

## Ce qui a changé en v2 — à lire si tu as connu la v1

La v1 reposait sur 3 rôles et sur un Formateur auteur de contenu soumis à validation. Tout cela a été remplacé. **Ne réintroduis aucun élément de la colonne de gauche**, même si tu le rencontres dans un vieux commentaire, un ancien planning ou un brouillon d'architecture.

| v1 (abandonné) | v2 (en vigueur) |
|---|---|
| 3 rôles : Élève / Formateur / Admin | 5 rôles : Élève / Formateur / Admin-Formateur / Administrateur / Super Admin |
| Le Formateur crée les cours et les quiz | L'**Admin-Formateur** crée tout le contenu ; le Formateur n'écrit rien |
| Workflow de validation `brouillon → en_attente → publié`, refus avec motif, version publiée conservée pendant la modification | **Publication directe** `DRAFT → PUBLISHED → ARCHIVED`, aucun statut « en attente », aucun versionnage. L'Admin contrôle a posteriori par **dépublication** |
| Le Formateur voit « ses » élèves (ceux de ses cours) | Le Formateur voit les élèves des formations qui lui sont **assignées** par l'Admin (une formation = un seul Formateur) |
| — | L'Admin-Formateur n'a accès à **aucune donnée élève** |
| — | Journal d'activité du Formateur + indicateurs de supervision pour l'Admin (**sans note**) |
| — | Profil public du Formateur visible par l'élève |
| — | Super Admin : compte unique créé par seed, seul à créer des Administrateurs |

## État actuel du codebase

Le backend est encore dans sa phase de scaffolding initial.

### Structure existante

- `src/main.ts` : démarrage de l'application Nest
- `src/app.module.ts` : module racine de l'application
- `src/app.controller.ts` : contrôleur racine avec `GET /`
- `src/app.service.ts` : service racine renvoyant Hello World
- `src/config/env.validation.ts` : schéma de validation Joi pour les variables d'environnement

### Conventions actuelles

- Utilise les modules, contrôleurs et services NestJS pour organiser les fonctionnalités.
- Favorise les dossiers de fonctionnalité sous `src/modules/...` au fur et à mesure de la croissance du projet.
- Centralise la validation des variables d'environnement dans `src/config/`.
- Utilise les valeurs du fichier `.env` avec validation plutôt que de coder en dur la configuration.
- Utilise les types TypeScript et les DTOs (`class-validator`) pour valider les requêtes et les données.

## Détails de la stack technique

- Framework : `@nestjs/core`, `@nestjs/common`
- Config : `@nestjs/config`
- Base de données : `@nestjs/mongoose` + `mongoose`
- Validation env : Joi — Validation DTOs : `class-validator` / `class-transformer`
- Auth : JWT (`@nestjs/jwt`), guards custom (`AuthGuard`, `RolesGuard`), enum `Role` à 5 valeurs (voir Contexte métier)
- Paiement : **PaiementPro** (agrégateur déjà utilisé par ILIMIGROUP — Orange Money, Wave CI, MTN MoMo, carte)
- Stockage fichiers : Cloudflare R2 (SDK compatible S3) — contenus pédagogiques et photos de profil des Formateurs
- Email : lien de vérification (magic link), réinitialisation de mot de passe, invitation des comptes créés par la hiérarchie, relances élèves envoyées par le Formateur (modèle prédéfini)
- Tests : Jest + ts-jest
- Build : Nest CLI
- Frontend (dossier séparé, hors scope de ce fichier) : Next.js, consomme cette API en REST

## Commandes importantes

```bash
cd Backend
npm install
npm run start
npm run start:dev
npm run build
npm run test
npm run test:e2e
npm run seed:super-admin   # à créer — crée le compte Super Admin s'il n'existe pas (idempotent)
```

## Règles de codage pour les assistants IA

1. Préserve l'architecture NestJS : module > contrôleur > service + repository/provider si nécessaire.
2. Ne crée pas de logique métier directement dans les contrôleurs.
3. Garde la validation dans des DTOs dédiés (`class-validator`) pour chaque endpoint recevant un body.
4. Active `ValidationPipe` globalement avec `whitelist: true` (rejette tout champ non déclaré dans le DTO — ex. empêche l'injection de `role: "ADMIN"` dans un body d'inscription).
5. Ne mets jamais de secrets, clés API ou URLs en dur ; utilise les variables d'environnement (`.env`, jamais commité).
6. Garde le code modulaire et orienté fonctionnalité — un module par domaine métier.
7. Quand tu ajoutes des modules, ajoute-les dans les imports du `AppModule` racine.
8. Privilégie des noms explicites et des conventions NestJS cohérentes.
9. **Toute route protégée passe par `AuthGuard` + `RolesGuard` + `@Roles(...)`.** Une route publique doit être explicitement marquée `@Public()` — jamais l'inverse (sécurisé par défaut). `@Roles(Role.ADMIN)` autorise implicitement `SUPER_ADMIN` (géré dans `RolesGuard`) ; `@Roles(Role.SUPER_ADMIN)` reste exclusif. **C'est la seule relation d'héritage entre rôles** : `ADMIN` n'hérite ni de `CONTENT_ADMIN` ni de `TUTOR`, et `TUTOR` / `CONTENT_ADMIN` sont disjoints.
10. **Le rôle ne suffit jamais pour les données rattachées à un périmètre** — vérifie en plus, dans le service ou un guard dédié :
    - `STUDENT` : uniquement ses propres inscriptions, progression, résultats, points.
    - `TUTOR` : uniquement les formations où `formation.formateurId === user.id`, et les élèves inscrits à ces formations. Toute route Formateur recevant un `formationId` ou un `studentId` vérifie ce rattachement.
    - `CONTENT_ADMIN` : pas de notion de propriété (catalogue partagé) — mais `createdBy` / `updatedBy` sont toujours renseignés.
    - Gestion des comptes : le rôle cible doit être strictement en dessous du rôle du demandeur (voir « Comptes non-élèves »).
11. **Aucun endpoint accessible à `CONTENT_ADMIN` ne renvoie de donnée élève** — ni liste, ni progression, ni résultats. Si une tâche te demande le contraire, signale l'incohérence.
12. Toute action de suivi d'un `TUTOR` (connexion, consultation d'une fiche élève, note, marqueur, relance) est journalisée via `ActivityLogService` depuis le service concerné — jamais depuis le contrôleur, jamais oubliée.

## Contexte métier — ce que fait réellement la plateforme

> Résumé du cahier des charges v2 validé. En cas de tâche ambiguë, relis cette section avant de coder.

### Vocabulaire cahier des charges ↔ code

| Cahier des charges | Code |
|---|---|
| Élève / Formateur / Admin-Formateur / Administrateur / Super Admin | `STUDENT` / `TUTOR` / `CONTENT_ADMIN` / `ADMIN` / `SUPER_ADMIN` |
| Brouillon / Publié / Archivé | `ContentStatus.DRAFT` / `PUBLISHED` / `ARCHIVED` |
| Inscription (élève × formation, accès payé) | `Enrollment` |
| Note de suivi | `TutoringNote` |
| Marqueur « à relancer » / « en difficulté » | `Enrollment.flag` = `TO_FOLLOW_UP` / `STRUGGLING` |
| Journal d'activité | `ActivityLog` |

### Les 5 rôles

| Rôle | Créé par | Peut faire | Ne peut pas |
|---|---|---|---|
| **`STUDENT`** — Élève | Lui-même (inscription publique + paiement) | Payer et accéder à ses formations, consulter cours/leçons, passer les quiz, voir sa progression et ses points, voir le profil public du Formateur de chaque formation suivie | Voir les autres élèves ; voir le contenu non publié |
| **`TUTOR`** — Formateur | `ADMIN` | Suivre les élèves des formations qui lui sont assignées : tableaux de bord, fiche élève, notes privées, marqueurs, relances email ; gérer son profil public | Créer ou modifier quoi que ce soit dans le contenu ; voir les élèves d'une formation non assignée |
| **`CONTENT_ADMIN`** — Admin-Formateur | `ADMIN` (ou `SUPER_ADMIN`) | Créer formations (titre, description, image, prix), cours, leçons, documents, quiz ; publier, modifier, archiver **directement, sans validation** ; catalogue partagé entre Admin-Formateurs | Accéder à la moindre donnée élève ; gérer des comptes |
| **`ADMIN`** — Administrateur | `SUPER_ADMIN` | Créer / activer / désactiver `CONTENT_ADMIN` et `TUTOR` ; gérer les élèves ; assigner un Formateur à chaque formation ; consulter l'activité des Formateurs ; dépublier un contenu ; vue globale de la progression et statistiques | Créer ou gérer des `ADMIN` ; créer du contenu ; noter un Formateur (ça n'existe pas) |
| **`SUPER_ADMIN`** — Super Admin | Script de seed au déploiement, compte **unique** | Tout ce que fait `ADMIN` + créer / activer / désactiver des `ADMIN` | Être créé via l'API ; être désactivé ou supprimé |

```text
SUPER ADMIN — compte unique (seed)
 ├── crée ─► ADMIN
 │             ├── crée ─► CONTENT_ADMIN ── crée et publie formations, cours, leçons, quiz
 │             ├── crée ─► TUTOR ────────── suit les élèves des formations assignées
 │             ├── assigne un TUTOR à chaque formation
 │             └── supervise l'activité des TUTOR (indicateurs, pas de note)
 └── crée ─► CONTENT_ADMIN (directement, comme tout ADMIN)

STUDENT — s'inscrit et paie lui-même
```

Trois règles structurantes :

- **Gestion des comptes hiérarchique** : un rôle ne crée et ne gère que les rôles situés sous lui. Aucun compte autre que `STUDENT` n'est créé par inscription publique.
- **Contenu et suivi sont séparés** : `CONTENT_ADMIN` produit le contenu et ne voit pas les élèves ; `TUTOR` voit les élèves et ne touche pas au contenu. Deux rôles frères, pas hiérarchisés.
- **Un Formateur par formation** : `Formation.formateurId` référence un seul `TUTOR` ; un `TUTOR` couvre autant de formations qu'on lui en assigne ; la plateforme compte autant de Formateurs que nécessaire.

Cinq rôles, mais **quatre espaces** côté frontend (Élève, Formateur, Admin-Formateur, Administration — le Super Admin utilise l'espace Administration avec un menu « Administrateurs » en plus). Côté API, cela donne quatre familles de routes (voir « Règle de décision pour l'architecture »).

**Il n'y a pas de rôle Commercial et pas de système de code de sécurité** — ces pistes ont été explorées puis abandonnées au profit d'un paiement en ligne direct. Ne pas les réintroduire.

### Inscription, authentification, accès aux formations (élève)

1. L'élève crée un compte (nom, prénom, email, téléphone, mot de passe) et choisit une formation (tarif affiché).
2. Un email de vérification est envoyé : **lien magique**, valable 24h, usage unique. **Pas d'OTP à saisir.**
3. Une fois l'email confirmé, l'élève est redirigé vers le paiement en ligne via **PaiementPro**.
4. Une fois le paiement confirmé (webhook PaiementPro), l'accès à **cette formation précise** est accordé — concrètement, création de l'`Enrollment` élève × formation.
5. Pour une formation supplémentaire, l'élève (déjà connecté) repaie pour celle-ci spécifiquement.
6. Un élève ne voit/n'accède **qu'aux formations qu'il a payées** — jamais le catalogue complet.
7. **Un prix unique par formation**, payé en une fois — pas de mensualités/échéancier.
8. `POST /auth/register` crée **toujours** un `STUDENT` (rôle forcé côté serveur, jamais lu depuis le body). Aucune inscription publique n'existe pour les autres rôles.

### Comptes non-élèves — création, activation, seed

- Création uniquement par la hiérarchie, depuis l'espace Administration (`POST /admin/users` avec le rôle cible) : `SUPER_ADMIN` → `ADMIN` ; `ADMIN` ou `SUPER_ADMIN` → `CONTENT_ADMIN`, `TUTOR`. Toute autre combinaison → `403`.
- Le compte créé reçoit un **email d'invitation** avec un lien de définition de mot de passe (même infra que le lien magique : 24h, usage unique). Aucun mot de passe n'est transmis en clair.
- Activation / désactivation : `isActive`. Un compte désactivé ne peut plus s'authentifier ni utiliser l'API. Mêmes règles hiérarchiques que la création. Les élèves peuvent en plus être supprimés par `ADMIN`+.
- Désactiver un Formateur ne retire pas ses assignations : les formations concernées apparaissent « sans Formateur effectif » dans le tableau de bord Admin, à réassigner.
- **Super Admin** : compte **unique**, créé par le script de seed (idempotent, identifiants lus dans `.env` : `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD`, à déclarer dans `env.validation.ts`). Jamais créé via l'API, jamais désactivable ni supprimable, pas de second `SUPER_ADMIN`.
- Profil public du Formateur : `photoUrl` (R2) + `bio`, modifiables par lui. **Seuls nom, prénom, photo et bio sont exposés aux élèves** — jamais l'email ni le téléphone.

### Gestion des formations et des cours — publication directe, pas de validation

Hiérarchie de contenu : **Formation** (payante : titre, description, image, `prix`, `formateurId`, `createdBy`) → **Cours** (modules ordonnés, un quiz de fin) → **Leçons** (texte, vidéo, document téléchargeable). Tout est créé par `CONTENT_ADMIN` dans un **catalogue partagé** : n'importe quel Admin-Formateur peut intervenir sur n'importe quelle formation, l'auteur est tracé.

`ContentStatus ∈ { DRAFT, PUBLISHED, ARCHIVED }` sur Formation, Cours, Leçon et Quiz. **Pas de statut « en attente », pas de soumission, pas de validation, pas de versionnage.**

| Transition | Qui | Effet |
|---|---|---|
| `DRAFT → PUBLISHED` (publier) | `CONTENT_ADMIN` | Immédiat. Formation → visible au catalogue d'achat ; Cours / Leçon / Quiz → visibles des élèves inscrits |
| Modifier un élément `PUBLISHED` | `CONTENT_ADMIN` | Immédiat, visible directement par les élèves — modification en place, pas de copie |
| `PUBLISHED → ARCHIVED` (archiver) | `CONTENT_ADMIN` | Immédiat, réversible (`ARCHIVED → PUBLISHED`). Formation archivée : retirée du catalogue, plus achetable, **les élèves déjà inscrits conservent l'accès**. Cours archivé : masqué aux élèves, progression conservée en base |
| Supprimer | `CONTENT_ADMIN` | Suppression définitive **uniquement si aucun élève n'est inscrit à la formation** ; sinon `409` avec invitation à archiver |
| `PUBLISHED → DRAFT` (dépublier) | `ADMIN` | Avec `unpublishReason`, `unpublishedBy`, `unpublishedAt` stockés sur l'entité et visibles dans l'espace Admin-Formateur (+ email au `createdBy`). **C'est la seule écriture de l'Administrateur sur le contenu** — il ne crée ni ne modifie rien d'autre |

Règle de visibilité élève : une `Enrollment` existe **et** la formation est `PUBLISHED` ou `ARCHIVED` **et** le cours / la leçon / le quiz est `PUBLISHED`. Conséquence assumée : une formation dépubliée redevient inaccessible à ses élèves jusqu'à republication — contrairement à l'archivage, la dépublication est une mesure de contrôle.

### Suivi des élèves — le Formateur

Le Formateur est un rôle de **lecture + annotation**. Périmètre : les formations où `formation.formateurId === user.id`, et rien d'autre.

- **Tableau de bord par formation** : élèves inscrits avec progression (%), dernière activité (`Enrollment.lastActivityAt`, mis à jour par le module `progress` à chaque leçon lue / vidéo avancée / tentative de quiz), score moyen aux quiz (notes officielles), marqueur. Filtres : inactifs depuis N jours, marqueur.
- **Fiche élève** : progression détaillée (leçons lues, vidéos terminées, modules débloqués), historique complet des quiz (note officielle **et** meilleure tentative), points. Chaque consultation est journalisée (`VIEW_STUDENT`).
- **Notes de suivi** : `TutoringNote { studentId, formationId, tutorId, text, createdAt }`. Privées : lisibles par le Formateur actuellement assigné à la formation et par l'Administration ; **jamais renvoyées par un endpoint élève**. Attachées au couple élève × formation, elles survivent à une réassignation.
- **Marqueur** : `Enrollment.flag ∈ { TO_FOLLOW_UP, STRUGGLING, null }`, posé et retiré par le Formateur.
- **Relance** : email à l'élève à partir d'un **modèle prédéfini** (pas de texte libre), via le module `mail` ; journalisé (`REMINDER_SENT`).
- Le Formateur n'a **aucune** route d'écriture sur le contenu, et ne voit ni note ni évaluation le concernant (il n'en existe pas).

### Assignation des Formateurs

- `Formation.formateurId : ObjectId | null` — **un seul** Formateur par formation, `null` tant que l'Admin n'a pas assigné. **Pas de table d'association, pas de tableau de Formateurs.**
- `PATCH /admin/formations/:id/tutor { tutorId | null }` : la cible doit être un `TUTOR` actif. Réassigner remplace : l'ancien Formateur perd l'accès immédiatement (le contrôle de périmètre lit toujours le `formateurId` courant), les notes de suivi restent.
- L'assignation ouvre le suivi de **tous** les élèves de la formation, présents et futurs.
- Le tableau de bord Admin signale les formations `PUBLISHED` sans Formateur (ou dont le Formateur est désactivé).

### Supervision de l'activité des Formateurs — journal, pas de notation

L'Administrateur ne **note** pas les Formateurs : il consulte des **indicateurs d'activité calculés automatiquement**. Aucune saisie, aucun commentaire, aucune entité `TutorEvaluation` — n'en crée pas.

- `ActivityLog { tutorId, action, targetType?, targetId?, formationId?, createdAt }`, actions : `LOGIN`, `VIEW_STUDENT`, `NOTE_CREATED`, `FLAG_SET`, `FLAG_CLEARED`, `REMINDER_SENT`. Journalise uniquement les `TUTOR` (la connexion est écrite par `AuthService` quand le rôle est `TUTOR`).
- Indicateurs exposés dans l'espace Administration, par Formateur, sur fenêtre glissante : formations assignées et total d'élèves ; dernière connexion et jours d'activité sur 30 j ; fiches consultées sur 30 j et part des élèves couverts ; notes, marqueurs, relances sur 30 j ; élèves inactifs depuis plus de 14 j jamais relancés, par formation. Liste des Formateurs triable par dernière connexion / niveau d'activité, signalement au-delà de 7 j sans connexion.
- Seuils 30 / 14 / 7 jours : valeurs par défaut centralisées dans la config, jamais en dur dans les services.
- Ces indicateurs ne sont visibles **que** dans l'espace Administration.

### Quiz — règle des tentatives (piège classique à ne pas rater)

- Les quiz sont créés par `CONTENT_ADMIN` (QCM, seuil de réussite par quiz) et rattachés à un cours.
- La **note officielle** (historique, points) est **toujours celle de la 1ère tentative**.
- Le **déblocage du module suivant** dépend de la **meilleure tentative** — l'élève peut retenter indéfiniment.
- Un élève qui échoue puis réussit à la 3ᵉ tentative débloque la suite, mais garde sa note initiale affichée.
- Correction automatique des QCM, restitution immédiate du score.
- L'endpoint qui sert un quiz à un élève **ne doit jamais renvoyer les bonnes réponses** avant soumission (les endpoints `content` les renvoient, évidemment).

### Suivi vidéo

Une vidéo est comptée comme « terminée » à partir de **80 % visionnés** (pas 100 %, pas d'accès simple).

### Gamification — points (MVP) / récompenses (Post-MVP)

- MVP : attribution automatique de points selon les cours complétés et les scores aux quiz.
- Post-MVP (pas encore à développer) : catalogue de récompenses/paliers convertissant les points.

### Fonctionnalités Post-MVP — ne pas développer avant le MVP, dans cet ordre de priorité

1. **Classement** — global + par formation
2. **Certificats** — éligibilité = tous les quiz réussis ; génération **manuelle groupée** déclenchée par l'**Administrateur** ; retardataires reçus individuellement plus tard
3. **Forum** — un forum par formation (pas de forum global, pas de distinction "apprenants"/"classe"), adhésion automatique dès l'accès payé, le **Formateur assigné** y est présent en permanence, l'Admin-Formateur n'y participe pas, modération **Administrateur uniquement** (le Formateur ne modère pas)
4. **Application mobile**

## Fonctionnalités à prioriser (ordre de développement MVP)

Développement dans cet ordre : **Élève → Admin-Formateur → Formateur → Administration** (le socle consommateur d'abord, puis la production de contenu, puis le suivi, puis la supervision).

Prérequis transverses dès l'étape 1 : enum `Role` à 5 valeurs et `RolesGuard` (avec la règle `SUPER_ADMIN ⊇ ADMIN`), seed du Super Admin, fixtures de formations publiées et assignées pour tester le parcours élève sans attendre les étapes 6 et 8.

1. Authentification, paiement PaiementPro (Élève)
2. Catalogue et accès aux formations (Élève)
3. Contenus pédagogiques — cours, leçons, vidéo, documents (Élève)
4. Quiz et évaluations (Élève)
5. Résultats, progression, points, profil public du Formateur (Élève)
6. Gestion des formations, cours, leçons, documents et quiz — publication directe, archivage, suppression conditionnelle (Admin-Formateur)
7. Suivi des élèves — tableaux de bord, fiche élève, notes, marqueurs, relances, journal d'activité (Formateur)
8. Gestion hiérarchique des comptes, invitation par email, assignation des Formateurs (Administration)
9. Supervision — formations et dépublication, activité des Formateurs, vue globale de la progression, statistiques (Administration)

Le détail complet (tâches, estimations) vit dans le planning Excel du projet — consulte-le pour la granularité tâche par tâche, en gardant en tête qu'il est en cours d'alignement sur la v2.

## Notes pour les futures sessions IA

Lorsqu'une nouvelle session assistée par IA commence :

- lis ce fichier en premier, puis `.ai/ARCHITECTURE.md`
- vérifie la tâche actuelle dans `.ai/tasks/current-task.md`
- ne recrée pas l'architecture du projet depuis zéro si un module existe déjà
- garde les changements limités au dossier du backend uniquement
- si une tâche demande quelque chose qui contredit ce fichier, signale l'incohérence avant de coder — ce fichier reflète des décisions déjà validées avec l'équipe. Exemples typiques : « ajoute une étape de validation avant publication », « le Formateur crée un cours », « affiche la progression aux Admin-Formateurs », « plusieurs Formateurs sur une formation », « l'Admin note le Formateur », « ajoute un code de sécurité »

## Règle de décision pour l'architecture

Un module NestJS par domaine métier, aligné sur les Epics du cahier des charges. Structure cible :

```text
src/
  main.ts
  app.module.ts
  common/
    enums/           # Role, ContentStatus, StudentFlag, ActivityAction
    guards/          # AuthGuard, RolesGuard (SUPER_ADMIN ⊇ ADMIN)
    decorators/      # @Roles(), @CurrentUser(), @Public()
    filters/         # HttpExceptionFilter
  config/
  database/
    seeds/           # super-admin.seed.ts — idempotent, identifiants depuis .env
  storage/           # infrastructure — upload/delete vers R2, ne connaît aucune notion métier
  mail/              # infrastructure — magic link, reset, invitation, relance élève (modèles)
  payments/          # infrastructure — intégration PaiementPro (init transaction + webhook)
  auth/              # register (STUDENT forcé), login, magic link, reset — journalise LOGIN des TUTOR
  users/             # comptes, hiérarchie de création/activation, profil public du Formateur
  formations/        # catalogue, prix, statut, formateurId (assignation), Enrollment (accès payé, flag, lastActivityAt)
  courses/           # cours d'une formation — DRAFT/PUBLISHED/ARCHIVED, dépublication admin
  lessons/
  quizzes/
  progress/
  tutoring/          # notes de suivi, marqueurs, relances, dashboards Formateur (lit progress + formations)
  activity-log/      # ActivityLog + agrégations pour les indicateurs de supervision
  gamification/
  # Post-MVP, à activer plus tard :
  leaderboard/
  forum/
  certificates/
```

**Aucun module Admin, Tutor ou Content séparé.** Chaque module métier expose un contrôleur par espace qui en a besoin, tous branchés sur le même service :

| Fichier | Préfixe de route | Rôles |
|---|---|---|
| `xxx.controller.ts` | `/xxx` | `STUDENT` (et routes `@Public()`) |
| `xxx-tutor.controller.ts` | `/tutor/xxx` | `TUTOR` |
| `xxx-content.controller.ts` | `/content/xxx` | `CONTENT_ADMIN` |
| `xxx-admin.controller.ts` | `/admin/xxx` | `ADMIN` (donc `SUPER_ADMIN`) — `@Roles(Role.SUPER_ADMIN)` seul sur la gestion des Administrateurs |

Un module sans routes élève n'a pas de `xxx.controller.ts` (ex. `tutoring/` n'a que `tutoring-tutor.controller.ts` et `tutoring-admin.controller.ts`). Exemple complet : `courses.controller.ts` (lecture élève) + `courses-content.controller.ts` (CRUD et publication) + `courses-admin.controller.ts` (supervision, dépublication), partageant `CoursesService` — évite un `AdminModule` qui dépendrait de tout le reste.