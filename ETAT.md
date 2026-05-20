# Plant Health — État du projet

_Dernière mise à jour : 2026-05-20_

## Statut global : 🟢 En développement

## Palier en cours : Palier 1 — Socle technique

## Ce qui est fait
- [x] Fichiers de fondation créés (CLAUDE.md, PLAN.md, ETAT.md, DECISIONS.md, TODO.md)
- [x] Dépôt Git initialisé
- [x] 1.1 Next.js 15 + TypeScript strict + Tailwind CSS + App Router — build OK
- [x] 1.2 Prisma 7 + SQLite (dev.db) — modèles User et Analysis créés, migration appliquée

## En cours
- [ ] 1.3 Schéma BDD déjà fait — passer à 1.4 : setup NextAuth.js v5

## Bloquants actuels
_Aucun_

## Dernière fonctionnalité validée
**1.2 — Prisma + BDD** (2026-05-20) : base SQLite créée, modèles User et Analysis migrés, client Prisma opérationnel avec adapter better-sqlite3, build TypeScript OK.

## Prochaine action
Installer et configurer NextAuth.js v5 (Auth.js) avec login email/mot de passe.
