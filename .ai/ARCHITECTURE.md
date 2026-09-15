# Architecture du backend

> Contexte métier complet (rôles, règles, publication directe, quiz, paiement...) : voir `.ai/AI_CONTEXT.md`. Ce fichier-ci se concentre sur la structure technique.

## 1. Principe de découpage : pourquoi cette arborescence

Convention retenue pour ce projet : **organisation par type de fichier** (schémas, DTOs, controllers publics, controllers admin, guards) plutôt que par module métier classique NestJS (où chaque domaine aurait son propre dossier avec ses propres sous-dossiers `dto/`, `schemas/`, etc.).

Concrètement :
- **`schemas/`** — tous les schémas Mongoose de l'application, au même endroit.
- **`dto/`** — tous les DTOs, sous-dossiers par fonctionnalité pour rester lisible (pas un mur de fichiers plats).
- **`public/`** — tous les modules/controllers/services accessibles aux utilisateurs authentifiés (élève, formateur) selon leur rôle.
- **`admin/`** — tous les controllers réservés aux rôles d'administration (Admin-Formateur, Administrateur, Super Admin), regroupés au même endroit plutôt qu'éclatés dans chaque module métier.
- **`guards/`** — tous les guards de sécurité, au même endroit.

**Un seul point d'attention à garder en tête** : les controllers admin réutilisent les services définis dans `public/` (ex. `CoursesAdminController` appelle `CoursesService`, le même que `CoursesController`) — il ne faut jamais dupliquer la logique métier entre les deux. `AdminModule` importe les modules `public/` dont il a besoin (voir §5).

> ⚠️ **Note terminologique importante** : le dossier `admin/` regroupe les controllers des **trois** rôles d'administration, qui ont des périmètres différents :
> - **Admin-Formateur** → création/publication de contenu (cours, leçons, quiz)
> - **Administrateur** → gestion des comptes, assignation des Formateurs, supervision
> - **Super Admin** → tous les droits Admin + création des Administrateurs
>
> Ces trois rôles sont distingués par `@Roles(...)` sur chaque route, pas par des dossiers séparés.

## 2. Arborescence complète

```text
Backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   │
│   ├── config/
│   │   ├── configuration.ts          # centralise la lecture des variables d'env
│   │   └── env.validation.ts         # valide .env au démarrage (Joi)
│   │
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── roles.decorator.ts        # @Roles('eleve', 'formateur', 'admin_formateur', 'admin', 'super_admin')
│   │   │   ├── current-user.decorator.ts # @CurrentUser() dans les controllers
│   │   │   └── public.decorator.ts       # @Public() — contourne le guard global
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts  # uniformise les réponses d'erreur
│   │   ├── interceptors/
│   │   │   └── transform-response.interceptor.ts
│   │   └── enums/
│   │       └── role.enum.ts              # ELEVE / FORMATEUR / ADMIN_FORMATEUR / ADMIN / SUPER_ADMIN
│   │
│   ├── guards/
│   │   ├── auth.guard.ts             # vérifie le JWT
│   │   └── roles.guard.ts            # vérifie le rôle vs @Roles()
│   │
│   ├── schemas/
│   │   ├── user.schema.ts            # un seul schéma pour les 5 rôles (champ `role`)
│   │   ├── course.schema.ts
│   │   ├── lesson.schema.ts
│   │   ├── quiz.schema.ts
│   │   ├── assignment.schema.ts      # rattachement Formateur ↔ formation
│   │   ├── progress.schema.ts
│   │   ├── payment.schema.ts
│   │   ├── forum-post.schema.ts      # Post-MVP
│   │   └── certificate.schema.ts     # Post-MVP
│   │
│   ├── dto/
│   │   ├── auth/
│   │   │   ├── register.dto.ts
│   │   │   ├── login.dto.ts
│   │   │   ├── forgot-password.dto.ts
│   │   │   └── reset-password.dto.ts
│   │   ├── users/
│   │   │   ├── update-user.dto.ts
│   │   │   ├── create-admin.dto.ts        # créé par le Super Admin
│   │   │   ├── create-admin-formateur.dto.ts  # créé par l'Admin
│   │   │   └── create-formateur.dto.ts        # créé par l'Admin
│   │   ├── courses/
│   │   │   ├── create-course.dto.ts
│   │   │   └── update-course.dto.ts
│   │   ├── lessons/
│   │   │   ├── create-lesson.dto.ts
│   │   │   └── update-lesson.dto.ts
│   │   ├── quizzes/
│   │   │   ├── create-quiz.dto.ts
│   │   │   └── submit-quiz.dto.ts
│   │   ├── assignments/
│   │   │   └── assign-formateur.dto.ts    # { formateurId, courseId }
│   │   └── payments/
│   │       └── init-payment.dto.ts
│   │
│   ├── storage/                      # infrastructure — ne connaît aucune notion métier
│   │   ├── storage.module.ts
│   │   └── r2-storage.service.ts     # upload/delete via SDK compatible S3
│   │
│   ├── mail/                         # infrastructure
│   │   ├── mail.module.ts
│   │   └── mail.service.ts           # email de vérification (lien magique), notifications
│   │
│   ├── public/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts        # /auth/register, /login, /verify-email, /refresh...
│   │   │   ├── auth.service.ts
│   │   │   └── auth.service.spec.ts
│   │   │
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts       # /users/me
│   │   │   ├── users.service.ts
│   │   │   └── users.service.spec.ts
│   │   │
│   │   ├── courses/
│   │   │   ├── courses.module.ts
│   │   │   ├── courses.controller.ts     # catalogue élève (lecture seule côté élève)
│   │   │   ├── courses.service.ts
│   │   │   └── courses.service.spec.ts
│   │   │
│   │   ├── lessons/
│   │   │   ├── lessons.module.ts         # importe CoursesModule + StorageModule
│   │   │   ├── lessons.controller.ts
│   │   │   ├── lessons.service.ts
│   │   │   └── lessons.service.spec.ts
│   │   │
│   │   ├── quizzes/
│   │   │   ├── quizzes.module.ts         # importe LessonsModule + ProgressModule + GamificationModule
│   │   │   ├── quizzes.controller.ts
│   │   │   ├── quizzes.service.ts
│   │   │   └── quizzes.service.spec.ts
│   │   │
│   │   ├── assignments/
│   │   │   ├── assignments.module.ts     # importe CoursesModule + UsersModule
│   │   │   ├── assignments.service.ts    # exporté, consommé par ProgressModule et AdminModule
│   │   │   └── assignments.service.spec.ts
│   │   │
│   │   ├── progress/
│   │   │   ├── progress.module.ts        # importe AssignmentsModule (filtrage par formation assignée)
│   │   │   ├── progress.controller.ts    # élève : sa progression / formateur : celle de ses élèves assignés
│   │   │   ├── progress.service.ts       # exporté, consommé par QuizzesModule
│   │   │   └── progress.service.spec.ts
│   │   │
│   │   ├── gamification/
│   │   │   ├── gamification.module.ts    # importe UsersModule (met à jour pointsTotal)
│   │   │   ├── gamification.controller.ts
│   │   │   └── gamification.service.ts
│   │   │
│   │   ├── payments/
│   │   │   ├── payments.module.ts        # importe CoursesModule + UsersModule
│   │   │   ├── payments.controller.ts    # init transaction + webhook PaiementPro
│   │   │   └── payments.service.ts
│   │   │
│   │   ├── leaderboard/                  # Post-MVP — priorité 1
│   │   │   ├── leaderboard.module.ts
│   │   │   ├── leaderboard.controller.ts
│   │   │   └── leaderboard.service.ts
│   │   │
│   │   ├── certificates/                 # Post-MVP — priorité 2
│   │   │   ├── certificates.module.ts
│   │   │   ├── certificates.controller.ts
│   │   │   └── certificates.service.ts
│   │   │
│   │   └── forum/                        # Post-MVP — priorité 3
│   │       ├── forum.module.ts
│   │       ├── forum.controller.ts
│   │       └── forum.service.ts
│   │
│   └── admin/
│       ├── admin.module.ts               # regroupe tous les controllers admin ci-dessous
│       ├── admins-admin.controller.ts    # POST/GET/PATCH /admin/admins — RÉSERVÉ Super Admin
│       ├── users-admin.controller.ts     # GET/PATCH/DELETE /admin/users (gestion élèves) — Admin
│       ├── formateurs-admin.controller.ts# POST/GET/PATCH /admin/formateurs + /admin/admin-formateurs — Admin
│       ├── courses-admin.controller.ts   # création/publication/édition/suppression cours — RÉSERVÉ Admin-Formateur
│       ├── assignments-admin.controller.ts # POST/DELETE /admin/assignments — Admin (assigne Formateur ↔ formation)
│       ├── supervision-admin.controller.ts # GET /admin/formateurs/:id/stats — Admin (stats d'activité, pas de note)
│       ├── progress-admin.controller.ts  # GET /admin/progress (vue globale) — Admin
│       └── certificates-admin.controller.ts # Post-MVP — déclenchement groupé — Admin
│
├── test/                              # tests E2E (convention Nest CLI)
│   ├── auth.e2e-spec.ts
│   ├── courses.e2e-spec.ts
│   └── quizzes.e2e-spec.ts
│
├── .env
├── .env.example
├── .gitignore
├── nest-cli.json
├── package.json
└── tsconfig.json

## 3. Graphe de dépendances entre modules (qui importe qui)

Un import circulaire (Module A importe B qui importe A) fait planter le démarrage de l'application — voici l'ordre à respecter, dans le sens des flèches :

| Module (`public/`) | Importe | Raison |
|---|---|---|
| `AuthModule` | `UsersModule`, `MailModule` | crée/vérifie l'utilisateur, envoie l'email de vérification |
| `UsersModule` | `MailModule` | email de création de compte formateur |
| `CoursesModule` | — | autonome, référence `users` uniquement par `ObjectId` |
| `PaymentsModule` | `CoursesModule`, `UsersModule` | vérifie la formation payée, accorde l'accès à l'élève |
| `LessonsModule` | `CoursesModule`, `StorageModule` | vérifie que le formateur est propriétaire du cours ; upload vers R2 |
| `QuizzesModule` | `LessonsModule`, `ProgressModule`, `GamificationModule` | vérifie la leçon parente ; crée un `Progress` et attribue les points |
| `ProgressModule` | — | autonome, exporté pour `QuizzesModule` et `CertificatesModule` |
| `GamificationModule` | `UsersModule` | met à jour `pointsTotal` |
| `LeaderboardModule` *(Post-MVP)* | `UsersModule` | lecture du classement par points |
| `ForumModule` *(Post-MVP)* | `CoursesModule` | rattache les discussions à une formation |
| `CertificatesModule` *(Post-MVP)* | `ProgressModule`, `CoursesModule`, `StorageModule` | détecte l'éligibilité, génère et stocke le PDF |
| `AdminModule` | tous les modules `public/` dont il expose un controller admin | réutilise leurs services, n'a aucune logique propre |

**Règle à retenir** : un module ne doit jamais importer un module qui se trouve « au-dessus » de lui dans cette table. Si `CoursesModule` semblait avoir besoin de connaître `Quizzes`, c'est le signal que cette logique doit vivre ailleurs (un service qui orchestre les deux), pas dans l'un des deux modules.

## 4. Conventions par dossier

- **`schemas/`** : un fichier par schéma Mongoose, nommé `<entité>.schema.ts`. Rien d'autre dans ce dossier (pas de DTO, pas de logique).
- **`dto/<feature>/`** : un DTO par action (`create-x.dto.ts`, `update-x.dto.ts`), avec `class-validator`. `update-x.dto.ts` étend généralement `PartialType(CreateXDto)` de `@nestjs/mapped-types`.
- **`public/<feature>/`** : contient `module`, `controller`, `service`, et les tests unitaires `*.service.spec.ts` juste à côté (convention Nest par défaut). Le controller y importe ses DTOs depuis `dto/<feature>/` et ses schémas depuis `schemas/`.
- **`admin/`** : un fichier controller par domaine ayant des actions admin (`<feature>-admin.controller.ts`), tous déclarés dans `admin.module.ts`. Pas de service propre — appelle le service du module `public/` correspondant.
- **`guards/`** : `auth.guard.ts` et `roles.guard.ts` uniquement — toute nouvelle règle de garde générique va ici, une règle spécifique à une seule feature (ex. "propriétaire du cours") reste dans le service concerné.

## 5. `app.module.ts` — assemblage final

```ts
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    MongooseModule.forRootAsync({ /* lecture depuis ConfigService */ }),

    StorageModule,
    MailModule,

    // public/
    AuthModule,
    UsersModule,
    CoursesModule,
    PaymentsModule,
    LessonsModule,
    QuizzesModule,
    ProgressModule,
    GamificationModule,
    LeaderboardModule,     // Post-MVP — priorité 1
    CertificatesModule,    // Post-MVP — priorité 2
    ForumModule,           // Post-MVP — priorité 3

    // admin/
    AdminModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {}
```

`AdminModule` importe et réexpose les modules `public/` nécessaires pour accéder à leurs services :

```ts
@Module({
  imports: [UsersModule, CoursesModule, ProgressModule], // + CertificatesModule quand actif
  controllers: [
    UsersAdminController,
    FormateursAdminController,
    CoursesAdminController,
    ProgressAdminController,
  ],
})
export class AdminModule {}
```

Déclarer `AuthGuard` et `RolesGuard` comme `APP_GUARD` globaux évite de les rappeler avec `@UseGuards()` sur chaque controller. Les routes publiques (`/auth/register`, `/auth/login`, `GET /courses` catalogue) utilisent `@Public()` pour contourner explicitement le guard global — plus sûr par défaut : une route oubliée reste protégée au lieu de rester ouverte par erreur.

## 6. Ordre de développement recommandé

Aligné sur le planning Excel du projet — **Élève d'abord, puis Formateur, puis Administrateur** :

1. `config` + connexion MongoDB + `schemas/user.schema.ts` (Sprint 0)
2. `guards/` de base (même minimaux au départ), `common/`
3. `mail`, `public/auth`, `public/users` (Sprint 1 — inscription, vérification email)
4. `public/payments` — intégration PaiementPro (Sprint 1)
5. `storage`, `public/courses`, `public/lessons` (Sprint 2-3 — catalogue élève, contenus)
6. `public/quizzes`, `public/progress`, `public/gamification` (Sprint 4-5 — dans cet ordre car `quizzes` dépend des deux autres)
7. Compléter `public/courses`, `public/lessons`, `public/quizzes` côté **création formateur** (Sprint 6-7)
8. `admin/` — tous les controllers admin (Sprint 8-9)
9. `public/leaderboard`, `public/certificates`, `public/forum` (Sprint 10-12, Post-MVP)

Coder un module qui dépend d'un module pas encore écrit oblige à écrire des mocks ou interrompt le flux — respecter cet ordre l'évite.

## 7. Modèle de données — rappel rapide

Détail complet dans le cahier des charges. Points de vigilance à ne pas oublier lors de l'écriture des schémas :

- `courses.formateurId`, `progress.userId`, `progress.quizId` → **reference** (`ObjectId`), jamais embed (volume non borné ou interrogé indépendamment).
- `quizzes.questions`, `progress.reponsesDonnees`, `lessons.fichier` → **embed** (bornés, jamais interrogés seuls).
- `quizzes` : l'API qui sert un quiz à un élève (`GET /lessons/:lessonId/quiz`) doit **exclure `reponseCorrecteIndex`** de la réponse.
- `progress` garde une trace de **chaque tentative** (pas seulement la meilleure) — nécessaire pour respecter la règle « note = 1ère tentative, déblocage = meilleure tentative ».
- `courses.statut` : `brouillon` / `en_attente` / `publié` — jamais de passage direct `brouillon` → `publié` sans validation Admin.
- `payment` : conserve la référence de transaction PaiementPro, le statut (`en_attente` / `confirmé` / `échoué`), la formation et l'élève concernés.

## 8. Sécurité — rappel rapide

- JWT stateless (access token signé), pas de session stockée côté serveur.
- Mot de passe hashé avec `bcrypt`, jamais en clair en base ni en log.
- `ValidationPipe` global avec `whitelist: true` — rejette tout champ non déclaré dans le DTO.
- Sanitation anti-injection NoSQL (`express-mongo-sanitize`) sur toutes les entrées.
- Rate limiting (`@nestjs/throttler`) sur `/auth/login` et les endpoints sensibles.
- CORS restreint à l'origine du frontend Next.js — jamais de wildcard `*`.
- Vérification « propriétaire » sur toute route `PATCH`/`DELETE` d'une ressource formateur (le rôle seul ne suffit pas).
- Le webhook PaiementPro doit vérifier la signature/l'authenticité de la requête avant de créditer un accès — jamais faire confiance à un simple appel entrant non authentifié.

## 9. Conventions API

- Chemins descriptifs, codes de statut HTTP cohérents (`201` création, `200` lecture/mise à jour, `204` suppression, `401`/`403` selon guard/rôle, `404` ressource absente, `409` conflit — ex. quiz déjà soumis d'une façon qui viole une contrainte métier).
- Valide tous les payloads entrants avec les DTOs de `dto/<feature>/`.
- Gère les erreurs centralement via `common/filters/http-exception.filter.ts` — jamais de stack trace renvoyée au client en production.

## 10. Règles de qualité

- Les controllers restent fins : ils appellent le service, ne contiennent pas de logique métier.
- Les services contiennent la logique métier ; ils sont les seuls à manipuler les modèles Mongoose directement.
- Ajoute un test (`*.service.spec.ts`) pour chaque comportement métier important et chaque cas limite (ex. double soumission de quiz, formateur non-propriétaire).
- Garde les modules `public/` indépendants et peu couplés — respecte le graphe de dépendances (§3).
- Un DTO par action, jamais un DTO générique réutilisé pour create ET update sans `PartialType`.

## 11. Guide d'utilisation de l'IA

Quand un nouvel assistant IA commence à travailler sur ce backend :

- lis `.ai/AI_CONTEXT.md` en premier (contexte métier), puis ce fichier (structure technique)
- vérifie la tâche actuelle dans `.ai/tasks/current-task.md`
- respecte la convention de dossiers **par type** (`schemas/`, `dto/`, `public/`, `admin/`, `guards/`) — ne crée pas de dossier `src/modules/<feature>/` avec ses propres sous-dossiers `dto`/`schemas`, ce n'est pas la convention de ce projet
- regarde les fichiers existants d'un dossier avant d'en créer un nouveau, pour rester cohérent avec le style déjà en place
- évite de dupliquer de la logique entre un controller `public/` et son équivalent `admin/` — passe toujours par le même service
- garde les modifications limitées au dossier `Backend/` sauf tâche explicitement transverse
- si une tâche contredit le contexte métier validé (ex. « ajoute un code de sécurité », « le formateur peut publier librement sans validation »), signale l'incohérence avant de coder