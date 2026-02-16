-- Extension pour la gestion des rôles
CREATE TYPE user_role AS ENUM ('admin', 'client');

-- Mise à jour de la table perfis pour lier à l'authentification Supabase
CREATE TABLE IF NOT EXISTS public.perfis (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telefone TEXT,
    bio TEXT,
    localizacao TEXT,
    servicos TEXT[] DEFAULT '{}',
    preco_min DECIMAL(10,2),
    preco_max DECIMAL(10,2),
    is_premium BOOLEAN DEFAULT false,
    role user_role DEFAULT 'client',
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table pour les paiements
CREATE TABLE IF NOT EXISTS public.pagamentos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    perfil_id UUID REFERENCES public.perfis(id),
    valor DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, completed, failed
    metodo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS (Row Level Security)
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;

-- Politiques pour les profils
CREATE POLICY "Tout le monde peut voir les profils approuvés" 
ON public.perfis FOR SELECT USING (status = 'approved');

CREATE POLICY "Les utilisateurs peuvent modifier leur propre profil" 
ON public.perfis FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Les admins ont un accès total" 
ON public.perfis FOR ALL USING (
  EXISTS (SELECT 1 FROM public.perfis WHERE id = auth.uid() AND role = 'admin')
);

-- Fonction pour créer automatiquement un profil à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.perfis (id, nome, email, role, status)
  VALUES (new.id, new.raw_user_meta_data->>'nome', new.email, 'client', 'pending');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour l'inscription
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();