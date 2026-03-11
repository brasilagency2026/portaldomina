# Skill: Portail Motels Brésil (Next.js, Supabase, PayPal, UX Brésil)

## Stack et bonnes pratiques
- Next.js App Router (TypeScript, SSR/CSR)
- React strict, composants modulaires, hooks personnalisés
- Supabase pour auth, DB, et gestion des utilisateurs/motels
- Tailwind CSS pour UI moderne, responsive et rapide
- Intégration PayPal (bouton abonnement, locale pt_BR, plans dynamiques)
- GitHub + Vercel pour CI/CD, déploiement, rollback rapide
- Gestion des erreurs et feedback utilisateur (loading, erreurs, redirections)
- Localisation complète (tous les textes et boutons en portugais du Brésil)

## Patterns et points clés
- Dashboard propriétaire :
  - Affichage dynamique selon plan (gratuit/premium)
  - Limites techniques (1 photo gratuit, 10 premium)
  - Boutons d’action : édition, upgrade premium, retour
  - Aucune stat avancée visible si non premium
- Page d’upgrade premium :
  - Explication claire des avantages (10 fotos, boost 20km, badge, etc.)
  - Prix affiché (R$ 199/mês)
  - Bouton PayPal intégré (locale pt_BR)
- Séparation stricte des responsabilités (lib/paypal.ts, composants, pages)
- Vérification et feedback PayPal (succès, erreur, redirection)
- Utilisation de variables d’environnement pour config PayPal
- Navigation fluide (Link Next.js, router.push, feedback visuel)
- Code et UI testés pour éviter toute erreur de structure JSX

## Conseils pour nouveaux projets
- Toujours localiser l’UI et les boutons de paiement selon le public cible
- Prévoir des pages d’upgrade/plan claires, avec avantages et prix visibles
- Utiliser des hooks pour la gestion d’état utilisateur/auth
- Modulariser les composants d’action (édition, paiement, feedback)
- Vérifier la cohérence des balises JSX et la simplicité des layouts
- Intégrer le paiement (PayPal, Stripe) en mode abonnement avec feedback
- Utiliser le commit/push à chaque étape clé pour rollback facile
- Tester le parcours complet utilisateur (gratuit → premium → dashboard)

---
Skill généré le 11/03/2026, optimisé pour Next.js, Supabase, PayPal, UX Brésil.
