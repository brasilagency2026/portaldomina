-- Création de la table des profils
CREATE TABLE IF NOT EXISTS public.perfis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telefone TEXT,
    bio TEXT,
    localizacao TEXT,
    servicos TEXT[] DEFAULT '{}',
    preco_min DECIMAL(10,2),
    preco_max DECIMAL(10,2),
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Activation de Row Level Security (RLS)
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;

-- Politique de lecture publique
CREATE POLICY "Lecture publique des profils" 
ON public.perfis FOR SELECT 
USING (true);

-- Insertion de données de test (optionnel)
-- INSERT INTO public.perfis (nome, email, bio, localizacao, servicos, preco_min, preco_max)
-- VALUES ('Lady Victoria', 'victoria@example.com', 'Dominatrix professionnelle...', 'São Paulo, SP', ARRAY['Dominação', 'BDSM'], 200, 500);