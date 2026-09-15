# HANDOFF — État d'avancement du projet

> **Ce fichier doit être mis à jour à la fin de chaque session de travail.** Il permet à la prochaine session (toi ou un assistant IA) de reprendre exactement où on s'est arrêté, sans avoir à tout redemander.

**Dernière mise à jour :** 2026-09-02 — par Emmanuel

---

## 1. Où en est le projet, en une phrase

Le cahier des charges et le planning des sprints sont finalisés. Le backend est scaffoldé (Nest.js de base) mais aucun module métier n'est encore développé. On est au tout début du **Sprint 0 — Infrastructure & Initialisation**.

## 2. Ce qui est fait

- [x] Cahier des charges fonctionnel complet et validé (`Cahier_des_charges_ILIMIGROUP_ELearning.pdf`)
- [x] Planning détaillé des 14 sprints, ordonné Élève → Formateur → Admin → Post-MVP (`Planning_Sprints_ILIMIGROUP.xlsx`)
- [x] Repo GitHub créé, branche `main` protégée (ruleset : PR obligatoire, pas de push direct, pas de force-push)
- [x] Scaffold Nest.js initial : `main.ts`, `app.module.ts`, `app.controller.ts`, `app.service.ts`
- [x] `src/config/env.validation.ts` — validation Joi des variables d'environnement
- [x] Documentation IA : `AI_CONTEXT.md` et `ARCHITECTURE.md` rédigés et à jour

## 3. Ce qui est en cours

*(rien en ce moment — prochaine session = attaquer les tâches ci-dessous)*

## 4. Prochaine tâche (voir aussi `tasks/current-task.md`)

Terminer le **Sprint 0** :
- [ ] Créer les dossiers de la nouvelle convention : `src/schemas/`, `src/dto/`, `src/public/`, `src/admin/`, `src/guards/`
- [ ] Configurer la connexion MongoDB Atlas (`MongooseModule.forRootAsync`)
- [ ] Créer le bucket Cloudflare R2 + configurer le SDK compatible S3 dans `src/storage/`
- [ ] Créer le compte marchand PaiementPro (sandbox) et noter les clés API dans `.env.example` (sans les valeurs réelles)
- [ ] Configurer ESLint / Prettier

Puis démarrer le **Sprint 1 — Élève : Inscription, Authentification & Paiement** (détail complet dans le planning Excel).

## 5. Décisions actées à ne pas remettre en question sans raison

- Pas de code de sécurité, pas de rôle Commercial — paiement en ligne direct via **PaiementPro**
- Email de vérification = **lien magique**, pas d'OTP à saisir
- **Un prix unique par formation**, pas de mensualités
- Toute publication/modification/suppression de cours par un formateur passe par une **validation Admin**
- Quiz : note officielle = 1ère tentative, déblocage du module suivant = meilleure tentative (retries illimités)
- Vidéo comptée "terminée" à partir de **80 %** visionnés
- Convention de dossiers **par type** (`schemas/`, `dto/`, `public/`, `admin/`, `guards/`), pas un dossier par module métier
- Ordre de développement : **Élève → Formateur → Admin**, puis Post-MVP dans l'ordre Classement → Certificats → Forum → App mobile

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
| 2026-09-02 | Finalisation du cahier des charges (paiement PaiementPro, workflow validation Admin, règles quiz/vidéo/gamification). Création du planning Excel (14 sprints, 89 tâches). Rédaction de `AI_CONTEXT.md` et `ARCHITECTURE.md`. |