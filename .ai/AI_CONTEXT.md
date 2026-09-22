# Contexte IA pour le backend

Ce document constitue la mémoire de travail pour les assistants IA qui codent sur ce projet. Il doit rester synchronisé avec `.ai/ARCHITECTURE.md`, `.ai/HANDOFF.md` et le cahier des charges du projet (actuellement **v4**) — en cas de doute, le cahier des charges fait foi.

> **Ce fichier a été réécrit pour la v4.** Si tu retrouves une référence à PaiementPro, à un paiement en ligne, ou à seulement 3 ou 5 rôles ailleurs dans le code ou dans d'anciennes notes, c'est un reliquat d'une version antérieure — non valable.

## Identité du projet

- Projet : **E_Learning_Ilimigroup** — plateforme e-learning asynchrone pour ILIMIGROUP
- Runtime : Node.js + NestJS
- Langage : TypeScript
- Dossier principal de l'application backend : `Backend/`
- Stack actuelle : NestJS 11, TypeScript 5, MongoDB avec Mongoose, validation Joi (env) + class-validator (DTOs), Jest

## Portée du workspace

Ce fichier de contexte appartient au dossier actif du projet : `Backend/`. Utilise ce dossier comme source de vérité pour les agents IA travaillant sur le backend.

## Le projet, en une phrase

Une plateforme web où un élève **s'inscrit et vérifie son compte en ligne**, mais où l'**accès à une formation ne s'obtient qu'en personne** : il paie un Commercial de l'entreprise (comptant ou en plusieurs versements), reçoit un **code de sécurité**, et l'entre sur la plateforme pour débloquer la formation. Le contenu suit obligatoirement la hiérarchie **Formation → Discipline → Module → Leçon → Ressources / Exercices**. Un Admin-Formateur crée et publie librement ce contenu ; un Formateur (rôle distinct) suit uniquement la progression des élèves ; un Administrateur supervise l'ensemble.

**Il n'y a pas de présentiel pour suivre les cours** (tout est asynchrone, texte/vidéo/quiz), **mais le paiement, lui, est volontairement 100% en personne** — la plateforme ne traite jamais d'argent. C'est un choix délibéré de la direction (voir §"Historique" plus bas), pas un oubli.

## État actuel du codebase

- Sprints **B0** (Infrastructure), **B1** (Authentification & Utilisateurs) et **B2** (Rôles & Permissions RBAC) sont **validés**, y compris `B2-11` et `B2-12` pour le rôle `COMMERCIAL`.
- Le Sprint **B3** (Formations) est validé. La prochaine étape est le Sprint **B4** : Disciplines, Modules, Leçons et Ressources.
- Les exercices sont rattachés aux Leçons et seront développés au Sprint **B8**.

### Structure existante (issue de B0/B1/B2)
- `src/main.ts`, `src/app.module.ts`
- `src/config/env.validation.ts` — validation Joi des variables d'environnement
- `src/guards/auth.guard.ts` — **appliqué automatiquement par route** (`@UseGuards(AuthGuard)`), **guard global**. Présence de `@Public()` dans ce projet —
- `src/decorators/current-user.decorator.ts`
- `src/schemas/user.schema.ts`, `src/mail/`, `src/dto/auth/`, `src/auth/` (module, controller, service — inscription, vérification email par lien magique, connexion, refresh token, mot de passe oublié, déconnexion)

### Conventions actuelles
- Organisation **par type de fichier**, pas par module métier : `schemas/`, `dto/<feature>/`, un dossier plat par feature à la racine de `src/` pour les controllers/services (ex. `auth/`, à terme `formations/`, `codes/`...), `guards/`, `decorators/`. Voir `.ai/ARCHITECTURE.md` pour le détail — ne recrée pas de dossier `modules/<feature>/` avec ses propres sous-dossiers.
- Validation des variables d'environnement centralisée dans `src/config/`.
- DTOs + `class-validator` pour toute requête avec un body.

## Détails de la stack technique

- Framework : `@nestjs/core`, `@nestjs/common`
- Config : `@nestjs/config`
- Base de données : `@nestjs/mongoose` + `mongoose`
- Validation env : Joi — Validation DTOs : `class-validator` / `class-transformer`
- Auth : JWT (`@nestjs/jwt`), `AuthGuard` manuel (pas global)
- Email : `mail/mail.service.ts` (nodemailer) — lien de vérification, réinitialisation de mot de passe, rappels d'échéance
- Stockage fichiers : stockage local sur disque du serveur (dossier uploads dédié)
- Tests : Jest + ts-jest
- Frontend (dossier séparé) : Next.js, consomme cette API en REST

> **PaiementPro n'existe plus dans ce projet.** Aucune dépendance, aucune variable d'environnement, aucun webhook lié à un agrégateur de paiement n'est à prévoir.

## Commandes importantes

```bash
cd Backend
npm install
npm run start:dev
npm run build
npm run test
npm run test:e2e
```

## Règles de codage pour les assistants IA

1. Préserve l'architecture NestJS : module > contrôleur > service.
2. Ne crée pas de logique métier directement dans les contrôleurs.
3. DTOs dédiés (`class-validator`) pour chaque endpoint recevant un body ; `ValidationPipe({ whitelist: true })` déjà actif globalement dans `main.ts`.
4. Ne mets jamais de secrets en dur ; utilise les variables d'environnement.

5. Pour les actions réservées au propriétaire d'une ressource (ex. un Admin-Formateur sur son propre contenu — en réalité le catalogue est partagé entre Admin-Formateurs, donc peu de cas de "propriétaire strict" ici, contrairement à l'ancien modèle v1), vérifie toujours le rôle ET la logique métier exacte plutôt que de supposer.

## Contexte métier — ce que fait réellement la plateforme (v4)

### Les 6 rôles

| Rôle | Créé par | Fait quoi |
|---|---|---|
| **Élève** | Lui-même | S'inscrit en ligne, vérifie son email, entre un code de sécurité pour accéder à une formation, suit les cours, passe les quiz, voit sa progression et ses points |
| **Formateur** | Administrateur | Suit la progression des élèves des formations qui lui sont **assignées**. Ne crée et ne publie **aucun** contenu. Rôle 100% suivi. |
| **Commercial** | Administrateur | Reçoit des codes de sécurité, collecte le paiement **en personne**, remet le code à l'élève. Ne gère jamais d'argent dans l'app, aucun accès au contenu ni aux données de progression. |
| **Admin-Formateur** | Administrateur | Seul auteur du contenu pédagogique (formations, disciplines, modules, leçons, ressources, exercices). Publie **directement, sans validation**. Aucun accès aux données élève. |
| **Administrateur** | Super Admin | Supervise tout : crée Formateurs/Commerciaux/Admin-Formateurs, **génère et attribue les codes de sécurité**, assigne les Formateurs aux formations, gère les élèves, supervise. |
| **Super Admin** | Compte unique, créé au déploiement | Tous les droits de l'Administrateur + gestion des comptes Administrateur |

**Formateur et Admin-Formateur sont des rôles frères, pas hiérarchisés** : contenu vs suivi, jamais les deux. **Le Commercial ne touche jamais à l'argent dans l'application.**

### Historique important — pourquoi pas de paiement en ligne

Le projet a eu un paiement en ligne (PaiementPro) en v3. La direction est revenue dessus en v4 : elle ne veut **pas** d'un modèle self-service comme Udemy, et préfère garder tout paiement **hors de l'application**, géré par un humain (le Commercial), pour éliminer le risque de sécurité/financier lié à une transaction en ligne dans une app encore en développement. **Ne propose jamais de réintroduire un agrégateur de paiement** sans que ce soit explicitement redemandé.

### Inscription et accès — le flux exact

1. L'élève crée un compte en ligne (nom, prénom, email, téléphone, mot de passe) .
2. Email de vérification — **lien magique**, 24h, usage unique. Cette étape est indépendante du paiement.
3. L'élève paie **en personne** un Commercial — comptant, ou premier versement.
4. Le Commercial lui remet un **code de sécurité**. L'élève l'entre sur la plateforme.
5. Code validé (existe, non utilisé, non expiré, correspond à la formation) → accès accordé immédiatement.
6. Formation supplémentaire ou versement suivant → nouveau code à entrer.

### Le code de sécurité — règles précises

- Un code est rattaché à **(formation, numéro de versement, montant)** — **jamais pré-assigné à un élève** au moment de sa création par l'Admin. Il est "consommé" par le premier élève qui l'entre valablement ; c'est le Commercial qui choisit physiquement à qui le remettre.
- Le Commercial peut associer un code à un élève (nom, téléphone) **avant** utilisation, à titre de traçabilité seulement — ça n'empêche pas techniquement un autre usage.
- **Expire après 90 jours si non utilisé.** (Toutes les formations durent actuellement 3 mois, donc ce délai coïncide avec la durée d'une formation — mais code ce calcul comme une constante configurable, pas en dur, au cas où des formations plus longues arrivent.)
- Un code utilisé devient **définitivement invalide**.

### Versements — règles précises (inchangées depuis la v3, juste le déclencheur qui change)

- **Nombre maximum de versements** = `floor(dureeFormationEnJours / 30) + 1`
- **Espacement fixe** : 30 jours entre chaque versement
- **Montant** : prix total ÷ nombre de versements choisi (égaux)
- Le **1er versement/code débloque l'accès immédiatement**
- **3 jours de grâce** après l'échéance indicative du versement suivant, puis **suspension automatique** de l'accès
- **Reprise immédiate** dès qu'un nouveau code valide est entré — pas d'intervention manuelle admin nécessaire
- Rappel email à **J-3** avant l'échéance, et **le jour de la suspension**
- Hors scope volontaire : remboursement, renégociation d'échéancier, pénalité de retard

### Hiérarchie obligatoire du contenu pédagogique

- Une **Formation** contient des **Disciplines** ordonnées.
- Une **Discipline** contient des **Modules** ordonnés.
- Un **Module** contient des **Leçons** ordonnées.
- Une **Leçon** contient son contenu texte/vidéo, ses **Ressources** (PDF, liens, code, archives) et ses **Exercices**.
- Les **Exercices** ne sont jamais rattachés directement à une formation ou à un module ; ils appartiennent à une leçon. Les règles de tentative et d'évaluation sont traitées dans B8.
- Ne jamais réintroduire une hiérarchie `Formation → Course → Lesson` ni modéliser cette structure avec des clés SQL ; utiliser les identifiants MongoDB et les références Mongoose nécessaires.

### Gestion des formations et du contenu (inchangé depuis v2)

- Statuts : `brouillon` → `publié` → `archivé`. **Pas** de statut "en attente", **pas** de validation admin a priori.
- L'Admin-Formateur publie/modifie/archive **directement**.
- Contrôle de l'Administrateur uniquement **a posteriori** : dépublication (retour brouillon + motif transmis à l'Admin-Formateur).
- Suppression définitive seulement si aucun élève inscrit, sinon archivage.

### Suivi par le Formateur (inchangé depuis v2)

- Un seul Formateur par formation (assigné par l'Administrateur), un Formateur peut couvrir plusieurs formations.
- Notes de suivi privées (élève + formation), visibles par le Formateur assigné et l'Administrateur — **jamais l'élève**.
- Marqueurs "à relancer" / "en difficulté", relance email en un clic, tout journalisé (`ActivityLog`) pour alimenter les indicateurs de supervision de l'Administrateur.
- **Pas de notation formelle du Formateur** — uniquement des indicateurs automatiques (régularité de connexion, couverture des fiches consultées, actions sur 30 jours).

### Quiz — règle des tentatives (piège classique, ne pas rater)

- **Note officielle** (historique, points) = **toujours la 1ère tentative**.
- **Déblocage du module suivant** = **meilleure tentative** — l'élève peut retenter indéfiniment.
- L'endpoint qui sert un exercice évalué à un élève ne renvoie **jamais** les bonnes réponses avant soumission.

### Suivi vidéo

Vidéo comptée "terminée" à partir de **80% visionnés**.

### Gamification

MVP = accumulation automatique de points (cours complétés + score quiz). Catalogue de récompenses/paliers = Post-MVP.

### Fonctionnalités Post-MVP — ordre de priorité (ne pas développer avant le MVP)

1. **Classement** (global + par formation)
2. **Certificats** (éligibilité = tous quiz réussis ; génération manuelle groupée par l'Administrateur ; retardataires servis individuellement ensuite)
3. **Forum** (un par formation, adhésion auto à l'accès validé, Formateur présent en permanence, **Admin-Formateur et Commercial absents**, modération Administrateur uniquement)
4. **Application mobile**

## Ordre de développement (aligné sur le planning du projet)

1. ~~Infrastructure (B0)~~ ✅ ~~Authentification (B1)~~ ✅ ~~RBAC (B2)~~ ✅ ~~Formations (B3)~~ ✅
2. Disciplines / Modules / Leçons / Ressources (B4) → Inscriptions & accès (B5)
3. **Codes de sécurité** — génération/distribution (B6) → **consommation par l'élève + échéancier** (B7)
4. Exercices et évaluations (B8) → Progression (B9) → Points (B10)
5. Module Formateur (B11) → Administration (B12, inclut la gestion des comptes Commerciaux)
6. Notifications (B13) → Audit (B14) → Statistiques (B15)
7. Tests & Sécurité (B16)
8. Post-MVP (B17+, dans l'ordre Classement → Certificats → Forum → App mobile)

Le détail tâche par tâche vit dans le planning Excel du projet (`Plan_Backend_ILIMIGROUP`) — consulte-le pour la granularité fine et le statut réel à jour.

## Notes pour les futures sessions IA

- Lis ce fichier en premier, puis `.ai/ARCHITECTURE.md`, puis `.ai/HANDOFF.md` pour l'état du moment, puis `.ai/tasks/current-task.md`.
- Ne recrée pas ce qui existe déjà (B0-B2 sont faits).
- Si une tâche demandée contredit ce fichier — par exemple "ajoute un paiement en ligne", "laisse le formateur publier des cours", "ajoute un guard global" — **signale l'incohérence avant de coder**, ce fichier reflète des décisions déjà validées avec l'équipe, y compris des retours en arrière volontaires (le code de sécurité a été abandonné puis réintroduit — ce n'est pas une erreur si tu le vois mentionné deux fois dans l'historique du projet).
- Garde les modifications limitées au dossier `Backend/` sauf tâche explicitement transverse.