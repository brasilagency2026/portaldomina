import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Header from "@/components/layout/Header";

export default function Dashboard() {
  const [perfil, setPerfil] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerfil();
  }, []);

  const fetchPerfil = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from("perfis").select("*").eq("id", user.id).single();
      setPerfil(data);
    }
    setLoading(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("perfis").update(perfil).eq("id", perfil.id);
    if (error) toast.error("Erreur lors de la mise à jour");
    else toast.success("Profil mis à jour !");
  };

  if (loading) return <div className="text-center pt-32">Chargement...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto pt-32 px-4">
        <h1 className="text-3xl font-bold mb-8 text-gradient-gold">Mon Espace Professionnel</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="glass-dark">
            <CardHeader><CardTitle>Modifier ma fiche</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleUpdate} className="space-y-4">
                <Input 
                  placeholder="Nom de scène" 
                  value={perfil?.nome || ""} 
                  onChange={e => setPerfil({...perfil, nome: e.target.value})}
                />
                <Textarea 
                  placeholder="Ma biographie" 
                  value={perfil?.bio || ""} 
                  onChange={e => setPerfil({...perfil, bio: e.target.value})}
                />
                <Input 
                  placeholder="Localisation" 
                  value={perfil?.localizacao || ""} 
                  onChange={e => setPerfil({...perfil, localizacao: e.target.value})}
                />
                <Button type="submit" className="w-full bg-gradient-gold">Enregistrer les modifications</Button>
              </form>
            </CardContent>
          </Card>
          
          <Card className="glass-dark">
            <CardHeader><CardTitle>Statut de mon compte</CardTitle></CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-sm text-muted-foreground">Statut actuel :</p>
                <p className="text-xl font-bold uppercase">{perfil?.status}</p>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Votre profil doit être approuvé par un administrateur pour apparaître dans les recherches.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}