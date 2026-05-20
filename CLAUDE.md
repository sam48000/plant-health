# Plant Health — Règles permanentes Claude

## Vision du projet
Application web mobile-first permettant à des jardiniers amateurs de photographier leurs plantes et d'obtenir une analyse de santé avec des recommandations concrètes. Propulsé par Claude API (vision multimodale). Les utilisateurs ont un compte et accèdent à l'historique de leurs analyses.

## Ce que tu dois TOUJOURS faire
- Écrire les commits en français avec un message clair et descriptif
- Vérifier que les clés API (ANTHROPIC_API_KEY) ne sont JAMAIS commitées — elles vont dans `.env.local`
- Mettre à jour `ETAT.md` après chaque fonctionnalité terminée
- Ajouter les décisions importantes dans `DECISIONS.md` avec la date
- Tester les routes API avant de les considérer comme terminées
- Concevoir mobile-first (viewport 375px comme référence)
- Utiliser le modèle `claude-sonnet-4-6` pour les appels API Claude

## Ce que tu ne dois JAMAIS faire
- Commiter `.env.local` ou toute clé secrète
- Utiliser `rm -rf` — préférer `trash`
- Faire `git push --force` sur `main`
- Modifier les fichiers dans `dist/` ou `.next/` (générés)
- Utiliser `any` en TypeScript sans justification
- Exposer les clés API côté client (elles restent dans les Server Actions ou API routes)
- Ajouter des dépendances sans les justifier dans `DECISIONS.md`

## Stack technique
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript strict
- **Styling**: Tailwind CSS v4
- **Auth**: NextAuth.js v5
- **Base de données**: Prisma + PostgreSQL (ou SQLite en dev)
- **IA**: Claude API (claude-sonnet-4-6) via `@anthropic-ai/sdk`
- **Upload photos**: Next.js Server Actions + stockage local ou S3

## Structure des dossiers attendue
```
app/
  (auth)/         ← pages login/register
  (app)/          ← pages protégées (dashboard, analyse, historique)
  api/            ← routes API
components/       ← composants réutilisables
lib/              ← utilitaires, clients (prisma, anthropic)
prisma/           ← schéma BDD
public/           ← assets statiques
```

## Conventions de code
- Composants : PascalCase
- Fonctions utilitaires : camelCase
- Variables d'environnement : SCREAMING_SNAKE_CASE
- Fichiers : kebab-case
- Toujours typer les retours de fonction explicitement
