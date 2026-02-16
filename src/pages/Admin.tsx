import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import { Check, X, ShieldAlert } from "lucide-react";

export default function Admin() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdmin();
    fetchPendingProfiles();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from("perfis").select("role").eq("id", user.id).single();
      if (data?.role === 'admin') setIsAdmin(true);
    }
  };

  const fetchPendingProfiles = async () => {
    const { data } = await supabase.from("perfis").select("*").eq("status", "pending");
    setProfiles(data || []);
    setLoading(false);
  };

  const handleStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("perfis").update({ status }).eq("id", id);
    if (error) toast.error("Erreur lors de la mise à jour");
    else {
      toast.success(`Profil ${status === 'approved' ? 'approuvé' : 'rejeté'}`);
      fetchPendingProfiles();
    }
  };

  if (loading) return <div className="text-center pt-32">Vérification des accès...</div>;
  if (!isAdmin) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <ShieldAlert className="w-16 h-16 text-destructive mx-auto" />
        <h1 className="text-2xl font-bold">Accès Refusé</h1>
        <p>Vous n'avez pas les droits pour accéder à cette page.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto pt-32 px-4">
        <h1 className="text-3xl font-bold mb-8 text-gradient-gold">Modération des Profils</h1>
        <div className="grid gap-6">
          {profiles.length === 0 ? (
            <p className="text-muted-foreground">Aucun profil en attente de validation.</p>
          ) : (
            profiles.map((p) => (
              <Card key={p.id} className="glass-dark">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{p.nome}</CardTitle>
                    <p className="text-sm text-muted-foreground">{p.email}</p>
                  </div>
                  <Badge variant="outline">En attente</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm italic">"{p.bio || 'Pas de bio renseignée'}"</p>
                  <div className="flex gap-4">
                    <Button 
                      onClick={() => handleStatus(p.id, 'approved')}
                      className="bg-green-600 hover:bg-green-700 gap-2"
                    >
                      <Check className="w-4 h-4" /> Approuver
                    </Button>
                    <Button 
                      onClick={() => handleStatus(p.id, 'rejected')}
                      variant="destructive"
                      className="gap-2"
                    >
                      <X className="w-4 h-4" /> Rejeter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}