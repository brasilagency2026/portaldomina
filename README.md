# BDSMBRAZIL - Guide de Déploiement Indépendant

Ce projet est prêt à être hébergé de manière autonome.

## 1. Configuration Supabase
1. Créez un projet sur [Supabase](https://supabase.com/).
2. Allez dans **Project Settings > API** pour récupérer votre `URL` et votre `anon key`.
3. Exécutez vos scripts SQL (tables `perfis`, etc.) dans le **SQL Editor** de Supabase.

## 2. GitHub & Local
1. Créez un nouveau dépôt sur GitHub.
2. Clonez ce projet localement.
3. Créez un fichier `.env` à la racine en copiant `.env.example` et remplissez vos clés Supabase.
4. Poussez le code sur votre dépôt GitHub.

## 3. Déploiement Vercel
1. Connectez votre compte GitHub à [Vercel](https://vercel.com/).
2. Importez votre dépôt.
3. **Important** : Dans les paramètres du projet sur Vercel, ajoutez les variables d'environnement suivantes :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `PAYPAL_CLIENT_ID`
   - `PAYPAL_CLIENT_SECRET`
   - `PAYPAL_ENV` (`sandbox` ou `live`)
   - `PAYPAL_API_BASE` (optionnel, sandbox: `https://api-m.sandbox.paypal.com`, prod: `https://api-m.paypal.com`)
   - `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
   - `NEXT_PUBLIC_PAYPAL_PREMIUM_PLAN_ID`
   - (optionnel fallback) `VITE_PAYPAL_CLIENT_ID`, `VITE_PAYPAL_PREMIUM_PLAN_ID`
4. Cliquez sur **Deploy**.

## 4. Paiement Premium via PayPal
Le checkout PayPal est intégré sur la page `/premium`.

### Flux implémenté
1. L'utilisateur connecté clique sur le bouton PayPal.
2. Le SDK PayPal ouvre le checkout d'abonnement avec `NEXT_PUBLIC_PAYPAL_PREMIUM_PLAN_ID`.
3. `POST /api/paypal/activate-subscription` vérifie l'abonnement côté serveur.
4. Le backend met à jour `public.perfis.is_premium = true` et enregistre une ligne dans `public.pagamentos`.

### Important
- Le paiement Premium est en **abonnement mensuel récurrent** via plan PayPal.

## Technologies
- React + Vite
- Tailwind CSS
- shadcn/ui
- Supabase
- Framer Motion