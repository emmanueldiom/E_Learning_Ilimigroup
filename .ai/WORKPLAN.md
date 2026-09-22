# Plan de Travail Backend — Plateforme E-Learning ILIMIGROUP (MVP)

> **Fichier source** : `Plan_Backend_ILIMIGROUP_v4.xlsx`

> **Usage Agent IA** : Suivi de projet, séquencement des tâches, gestion des dépendances et statut d'avancement du backend NestJS / MongoDB.

## 🤖 Règles obligatoires pour l'Agent IA

Lire ai/AI_CONTEXT.md, ai/ARCHITECTURE.md, ai/HANDOFF.md, ai/README.md et ce fichier ai/WORKPLAN.md avant toute modification importante.

Respecter strictement l'ordre des Sprints et leurs dépendances.

Ne jamais réintroduire une hiérarchie Formation → Course → Lesson. La hiérarchie métier est :
Formation → Discipline → Module → Leçon → Ressources / Exercices.

Le projet utilise MongoDB + Mongoose. Ne pas appliquer une modélisation SQL avec clés primaires/étrangères.

Avant de coder une tâche, vérifier l'architecture et les fichiers déjà présents afin d'éviter les doublons.

Après implémentation, tester la fonctionnalité concernée.

Une tâche ne doit passer à ✅ Validé qu'après implémentation et validation.

Mettre à jour ce WORKPLAN.md après chaque tâche validée.

Ne pas commencer une tâche dépendante si ses prérequis ne sont pas validés.

Pour la partie formation, toujours raisonner selon la hiérarchie métier définie dans ce fichier.

## 📊 Vue d'Ensemble du Projet & Métriques

- **Total des Tâches** : 224

- **Tâches Validées (Terminées)** : 62 (27.7%)

- **Tâches À faire** : 162 (72.3%)

- **Priorités** : 108 Critiques, 76 Hautes, 40 Moyennes

### 🔥 Prochaine Étape Immédiate pour l'Agent IA

Les Sprints **B0** (Architecture), **B1** (Auth & Users), **B2** (RBAC) et **B3** (Formations) sont **Validés**.

**Prochaine tâche à exécuter immédiatement** : `B4-01` (schéma Mongoose Discipline), puis enchaîner avec le Sprint B4.

---

## 🗺️ Roadmap Synthétique des Sprints

| Sprint | Nom du Sprint | Dépendances | Total Tâches | Statut Global |

|---|---|---|---|---|

| **Sprint B0** | Architecture & Configuration | Dépendance : — | 16 | ✅ Validé (100%) |

| **Sprint B1** | Authentification & Utilisateurs | Dépendance : B0 | 18 | ✅ Validé (100%) |

| **Sprint B2** | Rôles & Permissions (RBAC) | Dépendance : B1 | 12 | ✅ Validé (100%) |

| **Sprint B3** | Formations | Dépendance : B2 | 16 | ✅ Validé (100%) |

| **Sprint B4** | Disciplines / Modules / Leçons / Ressources | Dépendance : B3 | 14 | ⏳ À faire (0%) |

| **Sprint B5** | Inscriptions & Accès aux formations | Dépendance : B4 | 9 | ⏳ À faire (0%) |

| **Sprint B6** | Codes de sécurité | Dépendance : B5 | 11 | ⏳ À faire (0%) |

| **Sprint B7** | Accès aux formations via code | Dépendance : B6 | 11 | ⏳ À faire (0%) |

| **Sprint B8** | Quiz & Évaluations | Dépendance : B5 | 20 | ⏳ À faire (0%) |

| **Sprint B9** | Progression | Dépendance : B8 | 8 | ⏳ À faire (0%) |

| **Sprint B10** | Points / Gamification | Dépendance : B9 | 6 | ⏳ À faire (0%) |

| **Sprint B11** | Module Formateur | Dépendance : B5 | 15 | ⏳ À faire (0%) |

| **Sprint B12** | Administration | Dépendance : B11 | 11 | ⏳ À faire (0%) |

| **Sprint B13** | Notifications | Dépendance : B6,B7 | 10 | ⏳ À faire (0%) |

| **Sprint B14** | Journalisation / Audit | Dépendance : B11 | 8 | ⏳ À faire (0%) |

| **Sprint B15** | Statistiques & Dashboards Backend | Dépendance : B12 | 10 | ⏳ À faire (0%) |

| **Sprint B16** | Tests & Sécurité | Dépendance : Tous | 17 | ⏳ À faire (0%) |

---

## 📋 Découpage Détaillé des Sprints et Tâches

### Sprint B0 — Architecture & Configuration

**Dépendance : —** | **Avancement : 16/16 tâches validées**

| ID | Module | Description de la Tâche | Priorité | Dép. | Statut |

|---|---|---|---|---|---|

| `B0-01` | Setup | Initialiser le projet NestJS | Critique | — | ✅ Validé |

| `B0-02` | Setup | Configurer les environnements .env / .env.example | Critique | — | ✅ Validé |

| `B0-03` | Database | Configurer la connexion MongoDB (Atlas) | Critique | — | ✅ Validé |

| `B0-04` | Database | Configurer Mongoose (MongooseModule.forRootAsync) | Critique | — | ✅ Validé |

| `B0-05` | Architecture | Configurer la structure des modules (schemas/, dto/, public/, admin/, guards/) | Critique | — | ✅ Validé |

| `B0-06` | Config | Configurer ConfigModule (isGlobal) | Critique | — | ✅ Validé |

| `B0-07` | Sécurité | Configurer ValidationPipe global (whitelist: true) | Critique | — | ✅ Validé |

| `B0-08` | Erreurs | Configurer le filtre d'exception global (HttpExceptionFilter) | Critique | — | ✅ Validé |

| `B0-09` | Observabilité | Configurer le système de logs | Moyenne | — | ✅ Validé |

| `B0-10` | Doc API | Configurer Swagger (@nestjs/swagger) | Haute | — | ✅ Validé |

| `B0-11` | Sécurité | Configurer CORS (origine restreinte au frontend) | Critique | — | ✅ Validé |

| `B0-12` | Erreurs | Standardiser les réponses d'erreur API | Haute | — | ✅ Validé |

| `B0-13` | Conventions | Définir les conventions API (codes de statut, formats de réponse) | Haute | — | ✅ Validé |

| `B0-14` | Architecture | Créer les dossiers common/, config/, database/ | Critique | — | ✅ Validé |

| `B0-15` | Architecture | Créer les constantes et l'enum Role (SUPER_ADMIN, ADMIN, CONTENT_ADMIN, TUTOR, STUDENT) | Critique | — | ✅ Validé |

| `B0-16` | Architecture | Créer l'intercepteur de transformation de réponse | Moyenne | — | ✅ Validé |



### Sprint B1 — Authentification & Utilisateurs

**Dépendance : B0** | **Avancement : 18/18 tâches validées**

| ID | Module | Description de la Tâche | Priorité | Dép. | Statut |

|---|---|---|---|---|---|

| `B1-01` | Auth | Inscription étudiant (DTO + service + controller) | Critique | B0 | ✅ Validé |

| `B1-02` | Auth | Connexion (login, génération JWT access token) | Critique | B0 | ✅ Validé |

| `B1-03` | Auth | Déconnexion | Moyenne | B0 | ✅ Validé |

| `B1-04` | Auth | Refresh Token (rotation) | Haute | B0 | ✅ Validé |

| `B1-05` | Auth | Génération et envoi de l'email de vérification (lien magique, 24h, usage unique) | Critique | B0 | ✅ Validé |

| `B1-06` | Auth | Traitement du lien de vérification (endpoint GET /auth/verify-email) | Critique | B0 | ✅ Validé |

| `B1-07` | Auth | Mot de passe oublié (demande de réinitialisation) | Haute | B0 | ✅ Validé |

| `B1-08` | Auth | Réinitialisation du mot de passe | Haute | B0 | ✅ Validé |

| `B1-09` | Auth | Activation / désactivation du compte | Haute | B0 | ✅ Validé |

| `B1-10` | Auth | Protection des routes (AuthGuard de base) | Critique | B0 | ✅ Validé |

| `B1-11` | Users | Créer le schéma Mongoose User (nom, prénom, email, téléphone, mot de passe, rôle, statut) | Critique | B0 | ✅ Validé |

| `B1-12` | Users | CRUD utilisateur (service de base) | Critique | B0 | ✅ Validé |

| `B1-13` | Users | Gestion du profil (GET / PATCH /users/me) | Haute | B0 | ✅ Validé |

| `B1-14` | Users | Gestion des rôles (assignation à la création) | Critique | B0 | ✅ Validé |

| `B1-15` | Users | Gestion du statut du compte | Haute | B0 | ✅ Validé |

| `B1-16` | Users | Créer le schéma TutorProfile (userId, photo, présentation) | Haute | B0 | ✅ Validé |

| `B1-17` | Users | Endpoint profil Formateur (photo + présentation, visible élève) | Moyenne | B0 | ✅ Validé |

| `B1-18` | Tests | Tests unitaires AuthService | Haute | B0 | ✅ Validé |



### Sprint B2 — Rôles & Permissions (RBAC)

**Dépendance : B1** | **Avancement : 10/12 tâches validées**

> **Mise à jour v4 :** le paiement est effectué en personne auprès d'un Commercial. La plateforme ne traite aucun paiement en ligne ; les codes de sécurité et les droits du Commercial sont donc les prérequis du prochain développement.

| ID | Module | Description de la Tâche | Priorité | Dép. | Statut |

|---|---|---|---|---|---|

| `B2-01` | RBAC | Créer RolesGuard | Critique | B1 | ✅ Validé |

| `B2-02` | RBAC | Créer le décorateur @Roles() | Critique | B1 | ✅ Validé |

| `B2-03` | RBAC | Créer le décorateur @Public() (contourne le guard global) | Critique | B1 | ✅ Validé |

| `B2-04` | RBAC | Définir les permissions STUDENT (formations accessibles par code, cours, quiz, progression, points) | Critique | B1 | ✅ Validé |

| `B2-05` | RBAC | Définir les permissions TUTOR (élèves de ses formations, progression, résultats, notes, marqueurs, relances) | Critique | B1 | ✅ Validé |

| `B2-06` | RBAC | Définir les permissions CONTENT_ADMIN (formations, cours, leçons, documents, vidéos, quiz — aucun accès élève) | Critique | B1 | ✅ Validé |

| `B2-07` | RBAC | Définir les permissions ADMIN (utilisateurs, formations, assignation tutor, supervision) | Critique | B1 | ✅ Validé |

| `B2-08` | RBAC | Définir les permissions SUPER_ADMIN (droits ADMIN + gestion des comptes ADMIN) | Critique | B1 | ✅ Validé |

| `B2-09` | RBAC | Protéger tous les endpoints existants selon la matrice de permissions | Critique | B1 | ✅ Validé |

| `B2-10` | RBAC | Déclarer AuthGuard + RolesGuard comme APP_GUARD globaux | Critique | B1 | ✅ Validé |

| `B2-11` | RBAC | Mettre à jour l'enum Role : ajouter COMMERCIAL (v4) | Critique | B1 | ✅ Validé |

| `B2-12` | RBAC | Définir les permissions COMMERCIAL (consultation de ses codes, attribution à un élève, historique, demande de codes) | Critique | B1 | ✅ Validé |



### Sprint B3 — Formations

**Dépendance : B2** | **Avancement : 16/16 tâches validées**

| ID | Module | Description de la Tâche | Priorité | Dép. | Statut |

|---|---|---|---|---|---|

| `B3-01` | Formations | Créer le schéma Mongoose Formation (title, description, price, durationDays, status, createdBy, tutorId, maxInstallments, allowedInstallments) | Critique | B2 | ✅ Validé |

| `B3-02` | Formations | Créer une formation (Admin-Formateur) | Critique | B2 | ✅ Validé |

| `B3-03` | Formations | Modifier une formation | Critique | B2 | ✅ Validé |

| `B3-04` | Formations | Consulter le détail d'une formation | Critique | B2 | ✅ Validé |

| `B3-05` | Formations | Supprimer une formation (uniquement si aucun élève inscrit) | Haute | B2 | ✅ Validé |

| `B3-06` | Formations | Publier une formation | Critique | B2 | ✅ Validé |

| `B3-07` | Formations | Dépublier une formation (Administrateur, avec motif) | Haute | B2 | ✅ Validé |

| `B3-08` | Formations | Archiver une formation | Haute | B2 | ✅ Validé |

| `B3-09` | Formations | Gérer le prix de la formation | Critique | B2 | ✅ Validé |

| `B3-10` | Formations | Gérer la durée de la formation (durationDays) | Critique | B2 | ✅ Validé |

| `B3-11` | Formations | Calculer le nombre maximal de versements (floor(durée/30) + 1) | Critique | B2 | ✅ Validé |

| `B3-12` | Formations | Configurer le nombre de versements autorisés (≤ maximum) | Critique | B2 | ✅ Validé |

| `B3-13` | Formations | Assigner un Formateur à une formation (Administrateur) | Critique | B2 | ✅ Validé |

| `B3-14` | Formations | Endpoint : formations publiques (catalogue) | Critique | B2 | ✅ Validé |

| `B3-15` | Formations | Endpoint : formations accessibles par l'étudiant connecté | Critique | B2 | ✅ Validé |

| `B3-16` | Tests | Tests unitaires FormationsService | Haute | B2 | ✅ Validé |



### Sprint B4 — Disciplines / Modules / Leçons / Ressources

Dépendance : B3 | Avancement : 0/14 tâches validées

ID

Module

Description de la Tâche

Priorité

Dép.

Statut

B4-01

Disciplines

Créer le schéma Mongoose Discipline (title, description, order, formationId)

Critique

B3

⏳ À faire

B4-02

Disciplines

Créer une discipline dans une formation

Critique

B3

⏳ À faire

B4-03

Disciplines

Modifier une discipline

Haute

B3

⏳ À faire

B4-04

Disciplines

Supprimer une discipline

Haute

B3

⏳ À faire

B4-05

Disciplines

Consulter les disciplines d'une formation, dans l'ordre

Haute

B3

⏳ À faire

B4-06

Modules

Créer le schéma Mongoose Module (title, order, disciplineId)

Critique

B4

⏳ À faire

B4-07

Modules

CRUD Module (Créer, Modifier, Supprimer, Consulter)

Haute

B4

⏳ À faire

B4-08

Modules

Ordonner les modules au sein d'une discipline

Moyenne

B4

⏳ À faire

B4-09

Lessons

Créer le schéma Mongoose Lesson (title, order, durationMinutes, videoUrl, contentText, moduleId)

Critique

B4

⏳ À faire

B4-10

Lessons

CRUD Leçon (Créer, Modifier, Supprimer, Consulter)

Haute

B4

⏳ À faire

B4-11

Lessons

Ordonner les leçons au sein d'un module

Moyenne

B4

⏳ À faire

B4-12

Resources

Gérer les ressources d'une leçon (PDF, liens, code, archives)

Haute

B4

⏳ À faire

B4-13

Uploads

Upload et gestion locale des fichiers de ressources sur disque (MIME, taille, URL sécurisée)

Haute

B4

⏳ À faire

B4-14

Tests

Tests unitaires DisciplinesService, ModulesService et LessonsService

Haute

B4

⏳ À faire

Hiérarchie métier obligatoire : Formation → Discipline → Module → Leçon → Ressources / Exercices.

Une discipline appartient à une formation. Un module appartient à une discipline. Une leçon appartient à un module. Les ressources sont rattachées à une leçon. Les exercices sont également rattachés à une leçon et sont traités dans le Sprint B8.

MongoDB/Mongoose : ne pas reproduire la logique relationnelle SQL du PDF avec des clés primaires/étrangères. Utiliser les _id MongoDB et les références Mongoose lorsque nécessaire.

### Sprint B5 — Inscriptions & Accès aux formations

**Dépendance : B4** | **Avancement : 8/9 tâches validées**

| ID | Module | Description de la Tâche | Priorité | Dép. | Statut |

|---|---|---|---|---|---|

| `B5-01` | Enrollments | Créer le schéma Mongoose Enrollment (studentId, formationId, progress, status, marker, échéance du prochain versement) | Critique | B4 | ✅ Validé |

| `B5-02` | Enrollments | Inscrire un étudiant à une formation (après paiement) | Critique | B4 | ✅ Validé |

| `B5-03` | Enrollments | Vérifier l'inscription d'un étudiant à une formation | Critique | B4 | ✅ Validé |

| `B5-04` | Enrollments | Suspendre l'accès (retard de paiement) | Critique | B4 | ✅ Validé |

| `B5-05` | Enrollments | Restaurer l'accès (paiement régularisé) | Critique | B4 | ✅ Validé |

| `B5-06` | Enrollments | Endpoint : formations d'un étudiant | Critique | B4 | ✅ Validé |

| `B5-07` | Enrollments | Endpoint : étudiants d'une formation | Critique | B4 | ✅ Validé |

| `B5-08` | Access | Développer AccessControlService (inscription + paiement + statut + suspension) | Critique | B4 | ✅ Validé |





### Sprint B6 — Codes de sécurité — Génération & Distribution

**Dépendance : B5** | **Avancement : 10/11 tâches validées**

| ID | Module | Description de la Tâche | Priorité | Dép. | Statut |

|---|---|---|---|---|---|

| `B6-01` | CodeSecurite | Créer le schéma Mongoose CodeSecurite (formationId, numeroVersement, montant, statut, commercialId, infosEleveAvantUtilisation, dateExpiration, dateUtilisation, eleveId) | Critique | B5 | ✅ Validé |

| `B6-02` | PlanDeVersement | Créer le schéma Mongoose PlanDeVersement (studentId, formationId, nombreVersementsChoisi, versements[]) | Critique | B5 | ✅ Validé |

| `B6-03` | CodeSecurite | Génération d'un lot de codes par l'Administrateur (liés à une formation + un numéro de versement + un montant) | Critique | B5 | ✅ Validé |

| `B6-04` | CodeSecurite | Calcul automatique du nombre maximal de versements selon la durée de la formation | Critique | B5 | ✅ Validé |

| `B6-05` | CodeSecurite | Attribution d'un lot de codes à un Commercial | Critique | B5 | ✅ Validé |

| `B6-06` | CodeSecurite | Expiration automatique des codes non utilisés après 90 jours (job planifié) | Critique | B5 | ✅ Validé |

| `B6-07` | CodeSecurite | Endpoint : liste des codes d'un Commercial (les siens uniquement) | Critique | B5 | ✅ Validé |

| `B6-08` | CodeSecurite | Endpoint : liste globale de tous les codes, tous Commerciaux confondus (vue Administrateur) | Haute | B5 | ✅ Validé |

| `B6-09` | CodeSecurite | Association d'un code à un élève avant utilisation (nom, téléphone) — traçabilité | Haute | B5 | ✅ Validé |

| `B6-10` | CodeSecurite | Demande de codes supplémentaires par un Commercial | Moyenne | B5 | ✅ Validé |

| `B6-11` | Tests | Tests unitaires CodeSecuriteService | Haute | B5 | ⏳ À faire |



### Sprint B7 — Accès aux formations via code — Consommation & Échéancier élève

**Dépendance : B6** | **Avancement : 0/11 tâches validées**

| ID | Module | Description de la Tâche | Priorité | Dép. | Statut |

|---|---|---|---|---|---|

| `B7-01` | Access | Endpoint : entrer un code de sécurité (élève) | Critique | B6 | ⏳ À faire |

| `B7-02` | Access | Vérification du code (existe, non utilisé, non expiré, correspond à la formation) | Critique | B6 | ⏳ À faire |

| `B7-03` | Access | Consommation du code (marquage utilisé + rattachement à l'élève) | Critique | B6 | ⏳ À faire |

| `B7-04` | Access | Octroi immédiat de l'accès à la formation après validation du 1er code | Critique | B6 | ⏳ À faire |

| `B7-05` | PlanDeVersement | Création / mise à jour du PlanDeVersement de l'élève à chaque code validé | Critique | B6 | ⏳ À faire |

| `B7-06` | PlanDeVersement | Calcul de la prochaine échéance indicative (numéro de versement + 30 jours) | Critique | B6 | ⏳ À faire |

| `B7-07` | PlanDeVersement | Détection de retard (échéance dépassée + délai de grâce de 3 jours) | Critique | B6 | ⏳ À faire |

| `B7-08` | Access | Suspension automatique de l'accès en cas de retard | Critique | B6 | ⏳ À faire |

| `B7-09` | Access | Restauration immédiate de l'accès dès qu'un nouveau code valide est entré | Critique | B6 | ⏳ À faire |

| `B7-10` | PlanDeVersement | Endpoint « Mes versements » (élève) — historique et prochaine échéance | Haute | B6 | ⏳ À faire |

| `B7-11` | Tests | Tests unitaires PlanDeVersementService / AccessControlService | Haute | B6 | ⏳ À faire |



### Sprint B8 — Exercices / Quiz / Évaluations

Dépendance : B4, B5 | Avancement : 0/10 tâches validées

ID

Module

Description de la Tâche

Priorité

Dép.

Statut

B8-01

Exercises

Créer le schéma Mongoose Exercise (title, instructions, type, order, starterCode, language, minLength, lessonId, options[])

Critique

B4

⏳ À faire

B8-02

Exercises

Créer un exercice et le rattacher à une leçon

Critique

B4

⏳ À faire

B8-03

Exercises

Modifier, supprimer et consulter un exercice

Haute

B4

⏳ À faire

B8-04

Exercises

Supporter les 3 types d'exercices : quiz, coding, text_answer

Critique

B4

⏳ À faire

B8-05

Exercises

Gérer les options des exercices de type Quiz (label, isCorrect, order)

Haute

B4

⏳ À faire

B8-06

Submissions

Créer le schéma Mongoose ExerciseSubmission (userId, exerciseId, selectedOptionId, answerText, codeSubmitted, isCorrect, submittedAt)

Critique

B5

⏳ À faire

B8-07

Submissions

Créer l'endpoint de soumission d'un exercice

Critique

B5

⏳ À faire

B8-08

Submissions

Correction automatique des Quiz et enregistrement de la tentative

Haute

B5

⏳ À faire

B8-09

Submissions

Conserver l'historique des tentatives et calculer la meilleure tentative / note

Haute

B5

⏳ À faire

B8-10

Tests

Tests unitaires ExercisesService et SubmissionsService

Haute

B8

⏳ À faire

Règle métier : les exercices ne sont pas directement rattachés à une formation ou à une discipline. Ils sont rattachés à une Leçon.

Un exercice peut être de type quiz, coding ou text_answer. Les options sont des sous-documents de l'exercice lorsqu'il s'agit d'un Quiz.

### Sprint B9 — Progression

**Dépendance : B8** | **Avancement : 0/8 tâches validées**

| ID | Module | Description de la Tâche | Priorité | Dép. | Statut |

|---|---|---|---|---|---|

| `B9-01` | Progress | Enregistrer une leçon consultée | Haute | B8 | ⏳ À faire |

| `B9-02` | Progress | Enregistrer le pourcentage de vidéo visionnée | Haute | B8 | ⏳ À faire |

| `B9-03` | Progress | Marquer une vidéo comme terminée (seuil 80 %) | Haute | B8 | ⏳ À faire |

| `B9-04` | Progress | Calculer la progression d'un module | Haute | B8 | ⏳ À faire |

| `B9-05` | Progress | Calculer la progression globale d'une formation | Haute | B8 | ⏳ À faire |

| `B9-06` | Progress | Débloquer un module selon la progression / les quiz | Haute | B8 | ⏳ À faire |

| `B9-07` | Progress | Endpoint : progression d'un étudiant | Haute | B8 | ⏳ À faire |

| `B9-08` | Progress | Endpoint : progression par formation (vue Formateur / Admin) | Haute | B8 | ⏳ À faire |



### Sprint B10 — Points / Gamification

**Dépendance : B9** | **Avancement : 0/6 tâches validées**

| ID | Module | Description de la Tâche | Priorité | Dép. | Statut |

|---|---|---|---|---|---|

| `B10-01` | Points | Créer le système de points (pointsTotal sur User) | Moyenne | B9 | ⏳ À faire |

| `B10-02` | Points | Attribution automatique après un module terminé | Moyenne | B9 | ⏳ À faire |

| `B10-03` | Points | Attribution selon le score obtenu au quiz | Moyenne | B9 | ⏳ À faire |

| `B10-04` | Points | Enregistrer l'historique des points | Moyenne | B9 | ⏳ À faire |

| `B10-05` | Points | Calculer le total de points d'un étudiant | Moyenne | B9 | ⏳ À faire |

| `B10-06` | Points | Endpoint : total de points de l'étudiant connecté | Moyenne | B9 | ⏳ À faire |



### Sprint B11 — Module Formateur

**Dépendance : B5** | **Avancement : 0/15 tâches validées**

| ID | Module | Description de la Tâche | Priorité | Dép. | Statut |

|---|---|---|---|---|---|

| `B11-01` | Tutor | Endpoint : formations assignées au Formateur connecté | Haute | B5 | ⏳ À faire |

| `B11-02` | Tutor | Endpoint : étudiants d'une formation assignée | Haute | B5 | ⏳ À faire |

| `B11-03` | Tutor | Endpoint : progression d'un étudiant | Haute | B5 | ⏳ À faire |

| `B11-04` | Tutor | Calculer le score moyen d'un étudiant / d'une formation | Haute | B5 | ⏳ À faire |

| `B11-05` | Tutor | Récupérer la dernière activité d'un étudiant | Haute | B5 | ⏳ À faire |

| `B11-06` | Tutor | Filtrer les étudiants inactifs | Moyenne | B5 | ⏳ À faire |

| `B11-07` | Tutor | Filtrer les étudiants en difficulté | Moyenne | B5 | ⏳ À faire |

| `B11-08` | Tutor | Filtrer les étudiants à relancer | Moyenne | B5 | ⏳ À faire |

| `B11-09` | Tutor | Endpoint : fiche complète d'un étudiant | Haute | B5 | ⏳ À faire |

| `B11-10` | NoteDeSuivi | Créer le schéma Mongoose NoteDeSuivi (élève, formation, formateur, texte, date) | Haute | B5 | ⏳ À faire |

| `B11-11` | NoteDeSuivi | Ajouter une note de suivi privée | Haute | B5 | ⏳ À faire |

| `B11-12` | Tutor | Poser / modifier un marqueur (à relancer / en difficulté) | Haute | B5 | ⏳ À faire |

| `B11-13` | Tutor | Envoyer une relance email en un clic | Haute | B5 | ⏳ À faire |

| `B11-14` | ActivityLog | Créer le schéma Mongoose ActivityLog (formateur, action, cible, date) | Haute | B5 | ⏳ À faire |

| `B11-15` | ActivityLog | Journaliser chaque action de suivi du Formateur | Haute | B5 | ⏳ À faire |



### Sprint B12 — Administration

**Dépendance : B11** | **Avancement : 0/11 tâches validées**

| ID | Module | Description de la Tâche | Priorité | Dép. | Statut |

|---|---|---|---|---|---|

| `B12-01` | Admin | Gestion des étudiants (liste, activation/désactivation, suppression) | Haute | B11 | ⏳ À faire |

| `B12-02` | Admin | Gestion des Formateurs (création, activation/désactivation) | Haute | B11 | ⏳ À faire |

| `B12-03` | Admin | Gestion des Admin-Formateurs (création, activation/désactivation) | Haute | B11 | ⏳ À faire |

| `B12-04` | Admin | Création d'un compte Commercial | Haute | B11 | ⏳ À faire |

| `B12-05` | Admin | Activation / désactivation d'un compte Commercial | Haute | B11 | ⏳ À faire |

| `B12-06` | Admin | Assignation d'un Formateur à une formation | Critique | B11 | ⏳ À faire |

| `B12-07` | Admin | Tableau de bord de supervision de l'activité des Formateurs | Haute | B11 | ⏳ À faire |

| `B12-08` | Admin | Statistiques (vue Administrateur) | Moyenne | B11 | ⏳ À faire |

| `B12-09` | SuperAdmin | Créer un compte Administrateur | Critique | B11 | ⏳ À faire |

| `B12-10` | SuperAdmin | Activer / désactiver un compte Administrateur | Critique | B11 | ⏳ À faire |

| `B12-11` | SuperAdmin | Gérer les comptes Administrateur | Critique | B11 | ⏳ À faire |



### Sprint B13 — Notifications

**Dépendance : B6,B7** | **Avancement : 0/10 tâches validées**

| ID | Module | Description de la Tâche | Priorité | Dép. | Statut |

|---|---|---|---|---|---|

| `B13-01` | Notifications | Développer le service d'envoi d'email (mail.service.ts) | Haute | B6,B7 | ⏳ À faire |

| `B13-02` | Notifications | Email de vérification de compte (lien magique) | Critique | B6,B7 | ⏳ À faire |

| `B13-03` | Notifications | Email de réinitialisation de mot de passe | Haute | B6,B7 | ⏳ À faire |

| `B13-04` | Notifications | Email de confirmation d'accès (code de sécurité validé) | Haute | B6,B7 | ⏳ À faire |

| `B13-05` | Notifications | Email de rappel d'échéance (J-3) | Haute | B6,B7 | ⏳ À faire |

| `B13-06` | Notifications | Email de suspension d'accès | Haute | B6,B7 | ⏳ À faire |

| `B13-07` | Notifications | Email de restauration d'accès | Haute | B6,B7 | ⏳ À faire |

| `B13-08` | Notifications | Email de relance étudiant (Formateur) | Haute | B6,B7 | ⏳ À faire |

| `B13-09` | Notifications | Créer les templates email | Moyenne | B6,B7 | ⏳ À faire |

| `B13-10` | Notifications | Journaliser les emails envoyés | Moyenne | B6,B7 | ⏳ À faire |



### Sprint B14 — Journalisation / Audit

**Dépendance : B11** | **Avancement : 0/8 tâches validées**

| ID | Module | Description de la Tâche | Priorité | Dép. | Statut |

|---|---|---|---|---|---|

| `B14-01` | Audit | Logger une connexion | Moyenne | B11 | ⏳ À faire |

| `B14-02` | Audit | Logger la consultation d'une fiche étudiant | Moyenne | B11 | ⏳ À faire |

| `B14-03` | Audit | Logger l'ajout d'une note | Moyenne | B11 | ⏳ À faire |

| `B14-04` | Audit | Logger la pose d'un marqueur | Moyenne | B11 | ⏳ À faire |

| `B14-05` | Audit | Logger l'envoi d'une relance | Moyenne | B11 | ⏳ À faire |

| `B14-06` | Audit | Logger les actions administratives | Moyenne | B11 | ⏳ À faire |

| `B14-07` | Audit | Endpoint : consulter l'historique des logs | Moyenne | B11 | ⏳ À faire |

| `B14-08` | Audit | Filtrer les logs par utilisateur / action / date | Moyenne | B11 | ⏳ À faire |



### Sprint B15 — Statistiques & Dashboards Backend

**Dépendance : B12** | **Avancement : 0/10 tâches validées**

| ID | Module | Description de la Tâche | Priorité | Dép. | Statut |

|---|---|---|---|---|---|

| `B15-01` | Stats | Statistiques par formation | Moyenne | B12 | ⏳ À faire |

| `B15-02` | Stats | Nombre total d'étudiants | Moyenne | B12 | ⏳ À faire |

| `B15-03` | Stats | Progression moyenne | Moyenne | B12 | ⏳ À faire |

| `B15-04` | Stats | Score moyen aux quiz | Moyenne | B12 | ⏳ À faire |

| `B15-05` | Stats | Nombre d'étudiants inactifs | Moyenne | B12 | ⏳ À faire |

| `B15-06` | Stats | Statistiques d'activité des Formateurs | Moyenne | B12 | ⏳ À faire |

| `B15-07` | Stats | Nombre de formations (par statut) | Moyenne | B12 | ⏳ À faire |

| `B15-08` | Stats | Nombre de codes distribués | Moyenne | B12 | ⏳ À faire |

| `B15-09` | Stats | Nombre de codes utilisés / expirés | Moyenne | B12 | ⏳ À faire |

| `B15-10` | Stats | Élèves en retard sur leur versement | Moyenne | B12 | ⏳ À faire |



### Sprint B16 — Tests & Sécurité

**Dépendance : Tous** | **Avancement : 0/17 tâches validées**

| ID | Module | Description de la Tâche | Priorité | Dép. | Statut |

|---|---|---|---|---|---|

| `B16-01` | Tests unitaires | AuthService, UsersService, FormationsService, DisciplinesService, ModulesService, LessonsService | Critique | Tous | ⏳ À faire |

| `B16-02` | Tests unitaires | EnrollmentService, PaymentService, PaymentPlanService | Critique | Tous | ⏳ À faire |

| `B16-03` | Tests unitaires | QuizService, ProgressService, PointsService, TutorService | Critique | Tous | ⏳ À faire |

| `B16-04` | Tests intégration | Auth → User | Haute | Tous | ⏳ À faire |

| `B16-05` | Tests intégration | Payment → Enrollment | Haute | Tous | ⏳ À faire |

| `B16-06` | Tests intégration | PaymentPlan → Access | Haute | Tous | ⏳ À faire |

| `B16-07` | Tests intégration | Quiz → Progress | Haute | Tous | ⏳ À faire |

| `B16-08` | Tests intégration | Progress → Points | Haute | Tous | ⏳ À faire |

| `B16-09` | Tests E2E | Parcours complet : inscription → vérification → paiement → accès → cours → quiz → progression → points | Critique | Tous | ⏳ À faire |

| `B16-10` | Sécurité | Vérification JWT sur toutes les routes protégées | Critique | Tous | ⏳ À faire |

| `B16-11` | Sécurité | Tests RBAC — accès refusé selon le rôle (403 systématique) | Critique | Tous | ⏳ À faire |

| `B16-12` | Sécurité | Validation DTO sur tous les endpoints | Critique | Tous | ⏳ À faire |

| `B16-13` | Sécurité | Hash des mots de passe (bcrypt) | Critique | Tous | ⏳ À faire |

| `B16-14` | Sécurité | Rate limiting sur les endpoints sensibles | Haute | Tous | ⏳ À faire |

| `B16-15` | Sécurité | Validation des fichiers uploadés (type + taille + contenu réel) | Critique | Tous | ⏳ À faire |

| `B16-16` | Sécurité | Vérification des callbacks de paiement (signature) | Critique | Tous | ⏳ À faire |

| `B16-17` | Sécurité | Protection contre l'accès aux formations non payées | Critique | Tous | ⏳ À faire |

