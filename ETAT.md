# Plant Health — État du projet

_Dernière mise à jour : 2026-05-20_

## Statut global : 🟢 Palier 1 terminé — prêt pour le Palier 2

## Palier en cours : Palier 2 — Fonctionnalité cœur (analyse de plante)

## Ce qui est fait — Palier 1 complet ✅
- [x] Fichiers de fondation (CLAUDE.md, PLAN.md, ETAT.md, DECISIONS.md, TODO.md)
- [x] Dépôt Git initialisé — 5 commits propres
- [x] 1.1 Next.js 16 + TypeScript strict + Tailwind CSS v4 + App Router
- [x] 1.2 Prisma 7 + SQLite — modèles `User` et `Analysis`, migration appliquée, adapter better-sqlite3
- [x] 1.4 NextAuth.js v5 — login/register email+mot de passe, sessions JWT, proxy de protection
- [x] Pages `/login` et `/register` — mobile-first, visuellement vérifiées dans le navigateur
- [x] Page `/dashboard` — protégée, affiche le prénom de l'utilisateur connecté

## Prochaine action précise (Palier 2.1)
**Page `/analyse`** — formulaire d'upload de photo avec :
- `<input type="file" accept="image/*" capture="environment">` → ouvre la caméra sur mobile
- Aperçu de la photo sélectionnée avant envoi
- Bouton "Analyser ma plante" qui déclenche la Server Action

## Points à vérifier à la prochaine session
1. **Tester le register/login en vrai** : créer un compte de test et vérifier la redirection vers `/dashboard`
2. **Vérifier la session** sur `/dashboard` (prénom affiché correctement)
3. **Ajouter `ANTHROPIC_API_KEY`** dans `.env.local` avant d'attaquer le Palier 2.2

## Bloquants actuels
_Aucun — socle stable, build OK, 0 erreur TypeScript_
