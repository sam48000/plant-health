# Plant Health — État du projet

_Dernière mise à jour : 2026-05-20_

## Statut global : 🟢 Palier 2.1 terminé — prêt pour le Palier 2.2

## Palier en cours : Palier 2 — Fonctionnalité cœur (analyse de plante)

## Ce qui est fait — Palier 1 + 2.1 complets ✅
- [x] Fichiers de fondation (CLAUDE.md, PLAN.md, ETAT.md, DECISIONS.md, TODO.md)
- [x] Dépôt Git initialisé — commits propres
- [x] 1.1 Next.js 16 + TypeScript strict + Tailwind CSS v4 + App Router
- [x] 1.2 Prisma 7 + SQLite — modèles `User` et `Analysis`, migration appliquée, adapter better-sqlite3
- [x] 1.4 NextAuth.js v5 — login/register email+mot de passe, sessions JWT, proxy de protection
- [x] Pages `/login` et `/register` — mobile-first, visuellement vérifiées dans le navigateur
- [x] Page `/dashboard` — protégée, affiche le prénom + lien vers `/analyse`
- [x] **2.1 Page `/analyse`** — zone caméra/import, aperçu photo, bouton "Analyser ma plante" (désactivé sans photo)
- [x] Fix bug SQLite : `DATABASE_URL` aligné sur `prisma/dev.db` dans `.env`

## Prochaine action précise (Palier 2.2)
**Server Action `analyserPlante`** dans `lib/actions/analyse.ts` :
- Reçoit le `FormData` avec la photo
- Convertit l'image en base64
- Appelle Claude API (`claude-sonnet-4-6`) avec vision + prompt JSON
- Retourne `{ espece, score_sante, etat_general, problemes[], recommandations[], urgence }`

**Prérequis** : ajouter `ANTHROPIC_API_KEY` dans `.env.local` avant de coder l'appel API.

## Points à vérifier à la prochaine session
1. **Ajouter `ANTHROPIC_API_KEY`** dans `.env.local`
2. **Câbler la Server Action** dans `handleSubmit` de la page `/analyse`

## Bloquants actuels
_Aucun — auth OK, DB OK, page /analyse visible et fonctionnelle_
