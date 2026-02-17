import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import { MapPin, Crown, Lock, User as UserIcon, Image as ImageIcon, Plus, Trash2, Home, Hotel, Car, Plane, PartyPopper, AlertCircle } from "lucide-react";

const LISTA_SERVICOS = [
  "Bondage", "Spanking", "CBT", "Foot Worship", "Roleplay", "Sissy Training", 
  "Pegging", "Medical Play", "Impact Play", "Wax Play", "Sensory Deprivation", 
  "Golden Shower", "Facesitting", "Trampling", "Humilhação Verbal", 
  "Dominação Financeira", "Adoração à Deusa", "Fetiche em Couro", 
  "Fetiche em Látex", "Crossdressing", "Eletroestimulação", "Agulhamento", 
  "Puppy Play", "Kitten Play", "Ageplay", "Breath Play", "Fire Play", 
  "Knife Play", "Blood Play", "Caning"
];

const LOCAIS_ATENDIMENTO = [
  { id: "Local Próprio", icon: Home },
  { id: "Hotel / Motel", icon: Hotel },
  { id: "Domicílio", icon: Car },
  { id: "Viagens", icon: Plane },
  { id: "Eventos", icon: PartyPopper }
];

export default function Dashboard() {
  const [perfil, setPerfil] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");

  useEffect(() => {
    fetchPerfil();
  }, []);

  const fetchPerfil = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase.from("perfis").select("*").eq("id", user.id).single();
        if (error) throw error;
        setPerfil(data);
      }
    } catch (err) {
      console.error("Erro ao carregar perfil:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!perfil) return;
    const { error } = await supabase.from("perfis").update(perfil).eq("id", perfil.id);
    if (error) toast.error("Erro ao atualizar perfil");
    else toast.success("Perfil atualizado com sucesso!");
  };

  const toggleServico = (servico: string) => {
    if (!perfil) return;
    const current = perfil.servicos || [];
    const updated = current.includes(servico)
      ? current.filter((s: string) => s !== servico)
      : [...current, servico];
    setPerfil({ ...perfil, servicos: updated });
  };

  const toggleAtendimento = (local: string) => {
    if (!perfil) return;
    const current = perfil.atendimento || [];
    const updated = current.includes(local)
      ? current.filter((l: string) => l !== local)
      : [...current, local];
    setPerfil({ ...perfil, atendimento: updated });
  };

  const addPhoto = () => {
    if (!perfil) return;
    const currentFotos = perfil.fotos || [];
    const limit = perfil.is_premium ? 20 : 5;
    
    if (currentFotos.length >= limit) {
      toast.error(`Limite de ${limit} fotos atingido.`);
      return;
    }
    if (!newPhotoUrl) return;
    
    setPerfil({ ...perfil, fotos: [...currentFotos, newPhotoUrl] });
    setNewPhotoUrl("");
  };

  const removePhoto = (index: number) => {
    if (!perfil) return;
    const updated = (perfil.fotos || []).filter((_: any, i: number) => i !== index);
    setPerfil({ ...perfil, fotos: updated });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  if (!perfil) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto pt-32 px-4 text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Perfil não encontrado</h1>
          <p className="text-muted-foreground mb-6">Ocorreu un erro ao carregar seus dados. Tente sair e entrar novamente.</p>
          <Button onClick={() => supabase.auth.signOut()}>Sair da conta</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto pt-32 px-4 pb-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gradient-gold">Painel de Controle</h1>
          {perfil.is_premium && (
            <Badge className="bg-gradient-gold gap-1.5 py-1.5 px-4">
              <Crown className="w-4 h-4" /> Assinatura Premium Ativa
            </Badge>
          )}
        </div>

        <Tabs defaultValue="perfil" className="space-y-8">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="perfil" className="gap-2"><UserIcon className="w-4 h-4" /> Meu Perfil</TabsTrigger>
            <TabsTrigger value="fotos" className="gap-2"><ImageIcon className="w-4 h-4" /> Galeria</TabsTrigger>
            <TabsTrigger value="seguranca" className="gap-2"><Lock className="w-4 h-4" /> Segurança</TabsTrigger>
          </TabsList>

          <TabsContent value="perfil">
            <form onSubmit={handleUpdate} className="space-y-8">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <Card className="glass-dark">
                    <CardHeader><CardTitle>Informações Básicas</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Nome de Cena</label>
                          <Input value={perfil.nome || ""} onChange={e => setPerfil({...perfil, nome: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Localização Principal</label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input className="pl-10" value={perfil.localizacao || ""} onChange={e => setPerfil({...perfil, localizacao: e.target.value})} />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Biografia</label>
                        <Textarea rows={4} value={perfil.bio || ""} onChange={e => setPerfil({...perfil, bio: e.target.value})} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-dark">
                    <CardHeader><CardTitle>Onde você atende?</CardTitle></CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {LOCAIS_ATENDIMENTO.map((local) => (
                          <button
                            key={local.id}
                            type="button"
                            onClick={() => toggleAtendimento(local.id)}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                              (perfil.atendimento || []).includes(local.id)
                                ? "bg-primary/20 border-primary text-primary"
                                : "bg-secondary/50 border-border text-muted-foreground hover:border-primary/30"
                            }`}
                          >
                            <local.icon className="w-6 h-6" />
                            <span className="text-xs font-medium">{local.id}</span>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-dark">
                    <CardHeader><CardTitle>Serviços & Especialidades</CardTitle></CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {LISTA_SERVICOS.map((servico) => (
                          <div key={servico} className="flex items-center space-x-2">
                            <Checkbox 
                              id={servico} 
                              checked={(perfil.servicos || []).includes(servico)}
                              onCheckedChange={() => toggleServico(servico)}
                            />
                            <label htmlFor={servico} className="text-sm font-medium leading-none cursor-pointer">
                              {servico}
                            </label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-8">
                  <Card className="glass-dark">
                    <CardHeader><CardTitle>Status & Visibilidade</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className={`p-4 rounded-lg border ${perfil.status === 'approved' ? 'border-green-500/30 bg-green-500/10' : 'border-yellow-500/30 bg-yellow-500/10'}`}>
                        <p className="text-sm opacity-70">Status:</p>
                        <p className="text-lg font-bold uppercase">{perfil.status === 'approved' ? '✅ Ativo' : '⏳ Em Análise'}</p>
                      </div>
                      <Button type="submit" className="w-full bg-gradient-gold">Salvar Todas Alterações</Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="fotos">
            <Card className="glass-dark">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Galeria de Fotos</CardTitle>
                  <Badge variant="outline">
                    {(perfil.fotos || []).length} / {perfil.is_premium ? 20 : 5} fotos
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Cole a URL da imagem ici..." 
                    value={newPhotoUrl}
                    onChange={e => setNewPhotoUrl(e.target.value)}
                  />
                  <Button onClick={addPhoto} className="bg-primary gap-2">
                    <Plus className="w-4 h-4" /> Adicionar
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {(perfil.fotos || []).map((url: string, index: number) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden group border border-border">
                      <img src={url} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 p-1.5 bg-destructive rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
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