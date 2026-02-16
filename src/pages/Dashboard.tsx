import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import { MapPin, Tag, Crown, Lock, User as UserIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [perfil, setPerfil] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [servicosInput, setServicosInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetchPerfil();
  }, []);

  const fetchPerfil = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from("perfis").select("*").eq("id", user.id).single();
      setPerfil(data);
      setServicosInput(data?.servicos?.join(", ") || "");
    }
    setLoading(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPerfil = {
      ...perfil,
      servicos: servicosInput.split(",").map(s => s.trim()).filter(s => s !== "")
    };
    
    const { error } = await supabase.from("perfis").update(updatedPerfil).eq("id", perfil.id);
    if (error) toast.error("Erro ao atualizar perfil");
    else toast.success("Perfil atualizado com sucesso!");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) toast.error("Erro ao alterar senha: " + error.message);
    else {
      toast.success("Senha alterada com sucesso!");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  if (loading) return <div className="text-center pt-32">Carregando...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto pt-32 px-4 pb-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gradient-gold">Painel de Controle</h1>
          {perfil?.is_premium && (
            <Badge className="bg-gradient-gold gap-1.5 py-1.5 px-4">
              <Crown className="w-4 h-4" /> Assinatura Premium Ativa
            </Badge>
          )}
        </div>

        <Tabs defaultValue="perfil" className="space-y-8">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="perfil" className="gap-2"><UserIcon className="w-4 h-4" /> Meu Perfil</TabsTrigger>
            <TabsTrigger value="seguranca" className="gap-2"><Lock className="w-4 h-4" /> Segurança</TabsTrigger>
          </TabsList>

          <TabsContent value="perfil">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card className="glass-dark">
                  <CardHeader><CardTitle>Informações do Perfil</CardTitle></CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdate} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Nome de Cena</label>
                          <Input value={perfil?.nome || ""} onChange={e => setPerfil({...perfil, nome: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Localização (Cidade/Bairro)</label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input className="pl-10" value={perfil?.localizacao || ""} onChange={e => setPerfil({...perfil, localizacao: e.target.value})} />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Biografia</label>
                        <Textarea rows={5} value={perfil?.bio || ""} onChange={e => setPerfil({...perfil, bio: e.target.value})} />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Serviços (separados por vírgula)</label>
                        <div className="relative">
                          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input className="pl-10" value={servicosInput} onChange={e => setServicosInput(e.target.value)} placeholder="Dominação, Bondage, Roleplay..." />
                        </div>
                      </div>

                      <Button type="submit" className="w-full bg-gradient-gold">Salvar Alterações</Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-8">
                <Card className="glass-dark">
                  <CardHeader><CardTitle>Status da Conta</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className={`p-4 rounded-lg border ${perfil?.status === 'approved' ? 'border-green-500/30 bg-green-500/10' : 'border-yellow-500/30 bg-yellow-500/10'}`}>
                      <p className="text-sm opacity-70">Status de Moderação:</p>
                      <p className="text-lg font-bold uppercase">{perfil?.status === 'approved' ? '✅ Aprovado' : '⏳ Pendente'}</p>
                    </div>
                    {!perfil?.is_premium && (
                      <Button variant="gold" className="w-full gap-2" asChild>
                        <Link to="/premium"><Crown className="w-4 h-4" /> Tornar-se Premium</Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="seguranca">
            <Card className="glass-dark max-w-md">
              <CardHeader><CardTitle>Alterar Senha</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nova Senha</label>
                    <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confirmar Nova Senha</label>
                    <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-gold">Atualizar Senha</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}