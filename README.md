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
4. Cliquez sur **Deploy**.

## Technologies
- React + Vite
- Tailwind CSS
- shadcn/ui
- Supabase
- Framer Motion