# Dossier `.ai/` — mémoire de travail du projet

Ce dossier remplace le besoin de tout réexpliquer à chaque nouvelle session de chat IA (Claude, Claude Code, Cursor, Copilot...). N'importe quel assistant qui commence à travailler sur ce backend doit lire ces fichiers **avant** d'écrire la moindre ligne de code.

## Contenu du dossier

| Fichier | Rôle | À relire quand |
|---|---|---|
| **`AI_CONTEXT.md`** | Le contexte métier complet : ce que fait la plateforme, les 3 rôles, les règles validées (paiement, workflow de validation des cours, tentatives de quiz, suivi vidéo...). | En tout début de session, systématiquement. |
| **`ARCHITECTURE.md`** | La structure technique : arborescence des dossiers, graphe de dépendances entre modules, conventions de code, ordre de développement. | Avant de créer un fichier ou un module, pour respecter la convention déjà en place. |
| **`HANDOFF.md`** | L'état d'avancement réel du projet à l'instant présent : ce qui est fait, ce qui est en cours, ce qui bloque, la prochaine tâche. | En tout début de session, juste après `AI_CONTEXT.md`. **Ce fichier doit être mis à jour à la fin de chaque session de travail.** |
| **`tasks/current-task.md`** | La tâche précise sur laquelle on travaille en ce moment (plus fin grain que `HANDOFF.md`). | Avant de commencer à coder, pour savoir exactement quoi faire. |

## Comment utiliser ce dossier

**En tant qu'humain (Emmanuel) :**
- Avant de lancer une session avec un assistant IA, jette un œil à `HANDOFF.md` — s'il n'est pas à jour avec ce que tu as fait la dernière fois, mets-le à jour toi-même en 2 minutes.
- À la fin d'une session (que tu aies codé toi-même ou avec un assistant), mets à jour `HANDOFF.md` et `tasks/current-task.md` avant de fermer.

**En tant qu'assistant IA démarrant une session :**
1. Lire `AI_CONTEXT.md` — comprendre le métier
2. Lire `HANDOFF.md` — comprendre où en est le projet concrètement
3. Lire `tasks/current-task.md` — savoir quelle tâche précise est demandée
4. Consulter `ARCHITECTURE.md` pour les conventions avant de créer ou modifier un fichier
5. Si une instruction contredit ce qui est écrit dans ces fichiers, le signaler avant d'agir plutôt que de trancher seul

## Règle d'or

**Ces fichiers sont la source de vérité — pas la mémoire d'une conversation de chat.** Si une décision change (ex. un nouveau choix technique, une fonctionnalité repoussée), elle doit être répercutée ici, sinon la prochaine session repartira sur une base obsolète.

Le cahier des charges complet du projet (fonctionnel, hors code) reste le document de référence en cas de doute sur une règle métier non couverte ici.