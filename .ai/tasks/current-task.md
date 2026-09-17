# Tâche actuelle

## Statut
Terminé — B2-11 et B2-12 validées

## Objectif actuel
Définir et maintenir le contexte de travail du projet backend pendant le développement assisté par IA.

## Notes
- Le projet est un backend NestJS pour une plateforme d’e-learning.
- Les sprints B0 et B1 ainsi que B2-01 à B2-10 sont validés.
- Le rôle `COMMERCIAL` et ses permissions RBAC sont implémentés et testés.
- Le paiement est effectué hors application, en personne ; aucun module d'agrégateur de paiement ne doit être créé.
- L'architecture de référence est celle décrite dans `AI_CONTEXT.md` et `ARCHITECTURE.md`.
- La configuration et la validation doivent rester centralisées dans src/config/.

## Checklist
- [x] Examiner l’architecture actuelle du backend
- [x] Confirmer les besoins fonctionnels v4
- [x] Implémenter le rôle `COMMERCIAL` et ses permissions RBAC minimales
- [ ] Ajouter ou mettre à jour la validation
- [ ] Ajouter des tests pour les changements
- [ ] Vérifier le build et les tests

## Dernière mise à jour
- Contexte v4 synchronisé avec le paiement en personne, le Commercial et les codes de sécurité ; B2-11/B2-12 validées.
- Portée : backend uniquement.

## Étape suivante
Commencer `B4-01` (schéma Mongoose Discipline).
