# Plant Health — Plan d'architecture & fonctionnalités

## Architecture globale

```
[Utilisateur mobile]
       │
       ▼
[Next.js App Router]  ←→  [NextAuth.js]
       │                        │
  Server Actions           [PostgreSQL]
       │                  (users, sessions,
       ▼                   analyses)
[Claude API Vision]
(analyse la photo,
 retourne JSON structuré)
```

## Ordre de construction (par palier)

### Palier 1 — Socle technique
- [ ] 1.1 Init Next.js 15 + TypeScript strict + Tailwind CSS
- [ ] 1.2 Configurer Prisma + base SQLite (dev) → PostgreSQL (prod)
- [ ] 1.3 Schéma BDD : `User`, `Analysis` (photo_url, résultat JSON, date)
- [ ] 1.4 Setup NextAuth.js v5 (email/mot de passe en MVP)
- [ ] 1.5 Pages auth : `/login`, `/register`, middleware de protection

### Palier 2 — Fonctionnalité cœur : analyse de plante
- [ ] 2.1 Page d'analyse `/analyse` : upload ou capture photo (input file + caméra)
- [ ] 2.2 Server Action : réception photo → envoi à Claude API avec prompt structuré
- [ ] 2.3 Prompt Claude : identifier l'espèce, état de santé (1-10), problèmes détectés, recommandations
- [ ] 2.4 Réponse Claude → parsing JSON → sauvegarde en BDD
- [ ] 2.5 Page de résultat : affichage structuré (score, problèmes, conseils)

### Palier 3 — Historique & profil
- [ ] 3.1 Page `/historique` : liste des analyses passées avec miniatures
- [ ] 3.2 Page détail analyse `/analyse/[id]`
- [ ] 3.3 Page profil `/profil` : stats (nb analyses, plantes les plus analysées)

### Palier 4 — Polish mobile & UX
- [ ] 4.1 Loading states (skeleton, spinner pendant l'appel IA)
- [ ] 4.2 Gestion des erreurs utilisateur (photo invalide, erreur API)
- [ ] 4.3 PWA : manifest + icônes pour "Ajouter à l'écran d'accueil"
- [ ] 4.4 Dark mode
- [ ] 4.5 Accessibilité (alt text, contrastes, navigation clavier)

### Palier 5 — Fonctionnalités avancées (backlog)
- [ ] 5.1 Notifications push (rappels d'entretien)
- [ ] 5.2 Suivi d'évolution d'une plante dans le temps
- [ ] 5.3 Galerie par espèce
- [ ] 5.4 Partage d'une analyse (lien public)

## Choix techniques justifiés

| Choix | Justification |
|-------|--------------|
| Next.js App Router | Server Actions pour l'upload → plus simple, pas de route API séparée pour les mutations |
| SQLite en dev | Zéro config, facilement remplacé par PostgreSQL en prod via Prisma |
| NextAuth.js v5 | Intégration native Next.js, support App Router, facile à étendre (OAuth plus tard) |
| Tailwind CSS v4 | Mobile-first par défaut, pas de CSS custom à maintenir |
| Claude claude-sonnet-4-6 | Multimodal (vision photo), qualité d'analyse élevée, bon rapport coût/performance |
| TypeScript strict | Évite les bugs silencieux, meilleure DX avec l'autocomplétion |

## Prompt Claude (gabarit)
```
Tu es un expert en botanique et en santé des plantes.
Analyse cette photo de plante et réponds en JSON avec cette structure :
{
  "espece": "nom de l'espèce (ou 'inconnue')",
  "score_sante": 8, // de 1 (mourante) à 10 (parfaite santé)
  "etat_general": "résumé en 1 phrase",
  "problemes": ["problème 1", "problème 2"],
  "recommandations": ["conseil 1", "conseil 2", "conseil 3"],
  "urgence": "faible" | "modérée" | "élevée"
}
Réponds uniquement avec le JSON, sans texte autour.
```
