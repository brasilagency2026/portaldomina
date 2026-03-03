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
   - `VITE_PAYPAL_CLIENT_ID`
   - `PAYPAL_CLIENT_ID`
   - `PAYPAL_CLIENT_SECRET`
   - `PAYPAL_API_BASE` (sandbox: `https://api-m.sandbox.paypal.com`, prod: `https://api-m.paypal.com`)
4. Cliquez sur **Deploy**.

## 4. Paiement Premium via PayPal
Le checkout PayPal est intégré sur la page `/premium`.

### Flux implémenté
1. L'utilisateur connecté clique sur le bouton PayPal.
2. `POST /api/paypal/create-order` crée une commande PayPal de `49.90 BRL`.
3. Après validation, `POST /api/paypal/capture-order` capture le paiement.
4. Le backend met à jour `public.perfis.is_premium = true` et enregistre une ligne dans `public.pagamentos`.

### Important
- Le paiement est actuellement un **paiement unique** (capture immédiate) de `R$ 49,90`.
- Si vous souhaitez un **abonnement mensuel récurrent**, il faudra passer au flux PayPal Subscriptions (plan PayPal + `intent=subscription`).

## Technologies
- React + Vite
- Tailwind CSS
- shadcn/ui
- Supabase
- Framer Motion