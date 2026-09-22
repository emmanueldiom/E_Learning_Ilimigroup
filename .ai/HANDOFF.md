# HANDOFF — État d'avancement du projet

> **Ce fichier doit être mis à jour à la fin de chaque session de travail.** Il permet à la prochaine session (toi ou un assistant IA) de reprendre exactement où on s'est arrêté, sans avoir à tout redemander.

**Dernière mise à jour :** 2026-09-22 — Sprint B6 avancé

---

## 1. Où en est le projet, en une phrase

Le cahier des charges et le planning des sprints sont finalisés. Les sprints B0, B1, B2 et B3 sont validés. Le Sprint B5 est implémenté à 8/9 tâches et le Sprint B6 à 10/11 tâches; les tests unitaires restent volontairement ouverts.

## 2. Ce qui est fait

- [x] Cahier des charges fonctionnel complet et validé (`Cahier_des_charges_ILIMIGROUP_ELearning.pdf`)
- [x] Planning détaillé des 14 sprints, ordonné Élève → Formateur → Admin → Post-MVP (`Planning_Sprints_ILIMIGROUP.xlsx`)
- [x] Repo GitHub créé, branche `main` protégée (ruleset : PR obligatoire, pas de push direct, pas de force-push)
- [x] Scaffold Nest.js initial : `main.ts`, `app.module.ts`, `app.controller.ts`, `app.service.ts`
- [x] `src/config/env.validation.ts` — validation Joi des variables d'environnement
- [x] Documentation IA : `AI_CONTEXT.md` et `ARCHITECTURE.md` rédigés et à jour

## 3. Ce qui est en cours

- [ ] Écrire les tests unitaires `SecurityCodesService` (`B6-11`)

## 4. Prochaine tâche (voir aussi `tasks/current-task.md`)

Terminer le **Sprint 0** :
- [ ] Créer les dossiers de la nouvelle convention : `src/schemas/`, `src/dto/`, `src/public/`, `src/admin/`, `src/guards/`
- [ ] Configurer la connexion MongoDB Atlas (`MongooseModule.forRootAsync`)
- [ ] Créer le dossier de stockage local `uploads/` et configurer le service de fichier local dans `src/storage/`
- [ ] Configurer ESLint / Prettier

Puis écrire `B6-11`, avant de démarrer le Sprint B7 — consommation des codes par l'élève. Le flux B7 devra appeler `AccessControlService.grantAccess()` après validation atomique d'un code; aucun paiement en ligne n'est ajouté.

## 5. Décisions actées à ne pas remettre en question sans raison

- Paiement exclusivement en personne auprès d'un Commercial ; aucun agrégateur, webhook ou traitement d'argent dans l'application
- Le Commercial reçoit des codes de sécurité et peut les attribuer ou les tracer ; l'élève consomme un code valide pour débloquer une formation
- Hiérarchie pédagogique obligatoire : **Formation → Discipline → Module → Leçon → Ressources / Exercices**
- Une ressource et un exercice appartiennent toujours à une leçon ; un module appartient à une discipline et une discipline à une formation
- Email de vérification = **lien magique**, pas d'OTP à saisir
- Prix et versements définis au niveau de la formation ; l'accès est débloqué par code, avec échéancier si nécessaire
- L'Admin-Formateur publie directement le contenu ; l'Administrateur intervient a posteriori pour dépublier avec un motif
- Quiz : note officielle = 1ère tentative, déblocage du module suivant = meilleure tentative (retries illimités)
- Vidéo comptée "terminée" à partir de **80 %** visionnés
- Convention de dossiers **par type** (`schemas/`, `dto/`, `public/`, `admin/`, `guards/`), pas un dossier par module métier
- Ordre de développement : **B3 Formation → B4 Discipline/Module/Leçon/Ressource → B5 Accès → B6-B7 Codes → B8 Exercices/Évaluations → B9 Progression → B10 Points**, puis Formateur, Administration et Post-MVP

*(Détail complet de chaque décision : voir `AI_CONTEXT.md` et le cahier des charges.)*

## 6. Points encore ouverts / à trancher plus tard

- Dates de début/fin et responsables à assigner dans le planning Excel (colonnes actuellement vides)
- Choix technique définitif pour l'app mobile (React Native vs Flutter) — Post-MVP, pas urgent

## 7. Comment reprendre une session

1. Lire `AI_CONTEXT.md` (contexte métier)
2. Lire ce fichier (`HANDOFF.md`) pour l'état actuel
3. Lire `tasks/current-task.md` pour la tâche précise du moment
4. Vérifier `ARCHITECTURE.md` avant de créer un fichier ou un module
5. Coder / avancer
6. **Avant de terminer la session : mettre à jour les sections 2, 3, 4 et 8 de ce fichier**

## 8. Journal des sessions précédentes

| Date | Ce qui a été fait |
|---|---|
| 2026-09-17 | Synchronisation v4 : abandon du paiement en ligne au profit du paiement en personne auprès d'un Commercial, ajout puis validation du rôle `COMMERCIAL` et des tâches RBAC `B2-11`/`B2-12`. |
| 2026-09-17 | Alignement documentaire sur la hiérarchie pédagogique du workplan : Formation → Discipline → Module → Leçon → Ressources / Exercices. |
| 2026-09-17 | Implémentation complète du Sprint B3 : schéma, règles de formation, publication, catalogue, accès étudiant, versements et assignation Formateur. Prochaine tâche : B4-01. |
| 2026-09-22 | Début du Sprint B5 : schéma Enrollment, service d'inscription, contrôle d'accès, suspension/restauration, endpoints de consultation et test ciblé. Reste B5-09. |
| 2026-09-22 | Sprint B6 avancé : schémas CodeSecurite/PlanDeVersement, génération de lots, attribution admin-commercial, listes, traçabilité, demandes commerciales et expiration planifiée à 90 jours. Reste B6-11. |