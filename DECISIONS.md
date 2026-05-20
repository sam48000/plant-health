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
