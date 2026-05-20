# Plant Health — Historique des décisions

## Format
`[DATE] — Décision — Pourquoi`

---

## 2026-05-20 — Choix de Next.js comme framework principal
**Contexte** : App mobile-first avec analyse IA, besoin d'auth et d'un backend léger.  
**Décision** : Next.js 15 App Router avec Server Actions.  
**Pourquoi** : Full-stack en un seul repo, Server Actions idéales pour l'upload de photos (pas de route API séparée), bon support PWA, déploiement Vercel simple.  
**Alternative rejetée** : React + Express séparés — surcharge de configuration pour un MVP.

---

## 2026-05-20 — Claude claude-sonnet-4-6 pour l'analyse visuelle
**Contexte** : Besoin d'analyser une photo et de retourner un diagnostic structuré.  
**Décision** : `claude-sonnet-4-6` via `@anthropic-ai/sdk` avec réponse JSON forcée.  
**Pourquoi** : Capacité vision multimodale, excellente compréhension du langage naturel pour des conseils accessibles, output JSON fiable avec le bon prompt.  
**Alternative rejetée** : Plant.id API — payant, moins flexible pour les recommandations textuelles.

---

## 2026-05-20 — SQLite en développement, PostgreSQL en production
**Contexte** : Besoin d'une BDD pour stocker utilisateurs et historique d'analyses.  
**Décision** : Prisma comme ORM, SQLite en dev (fichier local), PostgreSQL en prod.  
**Pourquoi** : Zéro config pour démarrer, migration transparente grâce à Prisma, pas besoin de Docker pour le dev local.  
**Alternative rejetée** : MongoDB — schéma trop flexible pour des données structurées.

---

## 2026-05-20 — NextAuth.js v5 pour l'authentification
**Contexte** : Comptes utilisateurs nécessaires pour l'historique des analyses.  
**Décision** : NextAuth.js v5 (Auth.js) avec credentials (email/mot de passe) en MVP.  
**Pourquoi** : Intégration native App Router, facile d'ajouter Google/Apple OAuth en V2.  
**Alternative rejetée** : Clerk — payant au-delà du free tier, moins de contrôle.

---

## 2026-05-20 — Séparation auth.config.ts / auth.ts pour le proxy Edge
**Contexte** : Next.js 16 exécute le proxy (ex-middleware) dans l'Edge Runtime, incompatible avec Prisma et Node.js.  
**Décision** : `auth.config.ts` sans Prisma pour le proxy Edge, `auth.ts` complet avec Prisma pour les Server Actions et composants serveur.  
**Pourquoi** : Pattern officiel NextAuth v5 pour éviter l'erreur "Node.js module not supported in Edge Runtime".  
**Alternative rejetée** : Désactiver l'Edge Runtime — perd les avantages de performance du proxy.

---

## 2026-05-20 — Migration de middleware.ts vers proxy.ts (Next.js 16)
**Contexte** : Next.js 16 déprécie `middleware.ts` au profit de `proxy.ts` avec export nommé `proxy`.  
**Décision** : Utiliser `proxy.ts` avec `export const proxy = auth`.  
**Pourquoi** : Next.js 16.x impose cette nouvelle convention — l'ancienne bloque le build.

---

## 2026-05-20 — DATABASE_URL pointe vers prisma/dev.db (pas ./dev.db)
**Contexte** : Prisma CLI créait les tables dans `./dev.db` (racine) tandis que `lib/prisma.ts` connectait l'app à `./prisma/dev.db` — deux fichiers distincts, tables introuvables.  
**Décision** : `DATABASE_URL="file:./prisma/dev.db"` dans `.env`, `lib/prisma.ts` garde `path.join(process.cwd(), "prisma/dev.db")`.  
**Pourquoi** : Cohérence CLI ↔ runtime, convention Prisma standard (DB dans le dossier `prisma/`).

---

## 2026-05-20 — Prisma 7 avec adapter better-sqlite3
**Contexte** : Prisma 7 supprime la connexion directe via `url` dans schema.prisma — nécessite un adapter.  
**Décision** : `@prisma/adapter-better-sqlite3` pour le dev SQLite local.  
**Pourquoi** : Seul adapter officiel Prisma 7 compatible SQLite sans Turso/LibSQL.  
**Note** : En production avec PostgreSQL, remplacer par `@prisma/adapter-pg`.
