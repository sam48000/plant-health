# Plant Health — Améliorations futures (backlog)

_Idées à implémenter après que le MVP soit validé. Ne pas y toucher avant le Palier 3 complet._

## Fonctionnalités utilisateur
- [ ] **Suivi temporel** : analyser la même plante plusieurs fois et voir l'évolution du score de santé
- [ ] **Galerie par espèce** : regrouper les analyses par type de plante identifiée
- [ ] **Rappels d'entretien** : notifications push "Il est temps d'arroser ta fougère !"
- [ ] **Partage** : générer un lien public pour partager une analyse (ex. demander conseil à un ami)
- [ ] **Mode hors-ligne** : cache des dernières analyses pour consultation sans réseau
- [ ] **Multilingue** : anglais en priorité, puis espagnol

## Auth & Social
- [ ] **OAuth Google** : connexion en 1 clic
- [ ] **OAuth Apple** : obligatoire si soumission App Store
- [ ] **Profil public** : partager sa collection de plantes

## IA & Analyse
- [ ] **Analyse multi-photos** : envoyer 2-3 angles pour un meilleur diagnostic
- [ ] **Historique de prompt** : permettre à l'utilisateur de poser des questions de suivi sur une analyse
- [ ] **Confiance du diagnostic** : afficher un score de confiance si l'image est floue ou hors sujet
- [ ] **Mode expert** : réponse détaillée avec termes botaniques pour les professionnels

## Technique
- [ ] **Tests E2E** : Playwright pour les parcours critiques (upload → analyse → sauvegarde)
- [ ] **Monitoring** : Sentry pour les erreurs, suivi du coût API Anthropic
- [ ] **Rate limiting** : limiter les analyses par utilisateur (quota journalier) pour contrôler les coûts
- [ ] **CDN images** : déplacer le stockage photos vers S3 + CloudFront en prod
- [ ] **Mise en cache des analyses** : éviter de ré-analyser une photo identique (hash MD5)
