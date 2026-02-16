import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import { Check, X, ShieldAlert, CreditCard, Users } from "lucide-react";

export default function Admin() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdmin();
    fetchData();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from("perfis").select("role").eq("id", user.id).single();
      if (data?.role === 'admin') setIsAdmin(true);
    }
  };

  const fetchData = async () => {
    const { data: pData } = await supabase.from("perfis").select("*").eq("status", "pending");
    const { data: payData } = await supabase.from("pagamentos").select("*, perfis(nome)").order('created_at', { ascending: false });
    setProfiles(pData || []);
    setPayments(payData || []);
    setLoading(false);
  };

  const handleStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("perfis").update({ status }).eq("id", id);
    if (!error) {
      toast.success(`Profil mis à jour`);
      fetchData();
    }
  };

  if (loading) return <div className="text-center pt-32">Chargement...</div>;
  if (!isAdmin) return <div className="min-h-screen flex items-center justify-center text-center"><ShieldAlert className="w-16 h-16 text-destructive mx-auto mb-4" /><h1 className="text-2xl font-bold">Accès Refusé</h1></div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto pt-32 px-4">
        <h1 className="text-3xl font-bold mb-8 text-gradient-gold">Administration Centrale</h1>
        
        <Tabs defaultValue="moderation" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="moderation" className="gap-2"><Users className="w-4 h-4" /> Modération</TabsTrigger>
            <TabsTrigger value="payments" className="gap-2"><CreditCard className="w-4 h-4" /> Paiements</TabsTrigger>
          </TabsList>

          <TabsContent value="moderation" className="space-y-6">
            {profiles.length === 0 ? <p className="text-muted-foreground">Aucun profil en attente.</p> : profiles.map((p) => (
              <Card key={p.id} className="glass-dark">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div><CardTitle>{p.nome}</CardTitle><p className="text-sm text-muted-foreground">{p.email}</p></div>
                  <div className="flex gap-2"><Button size="sm" onClick={() => handleStatus(p.id, 'approved')} className="bg-green-600"><Check className="w-4 h-4" /></Button><Button size="sm" variant="destructive" onClick={() => handleStatus(p.id, 'rejected')}><X className="w-4 h-4" /></Button></div>
                </CardHeader>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="payments">
            <Card className="glass-dark">
              <CardHeader><CardTitle>Historique des Transactions</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments.map((pay) => (
                    <div key={pay.id} className="flex items-center justify-between p-4 border-b border-border/50">
                      <div><p className="font-bold">{pay.perfis?.nome}</p><p className="text-xs text-muted-foreground">{new Date(pay.created_at).toLocaleDateString()}</p></div>
                      <div className="text-right"><p className="text-gradient-gold font-bold">R$ {pay.valor}</p><Badge variant={pay.status === 'completed' ? 'default' : 'outline'}>{pay.status}</Badge></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}