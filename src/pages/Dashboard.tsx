import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import { MapPin, Crown, Lock, User as UserIcon, Image as ImageIcon, Trash2, Home, Hotel, Car, Plane, PartyPopper, Loader2, Upload, ShieldCheck, Key } from "lucide-react";

const LISTA_SERVICOS = [
  "Bondage", "Spanking", "CBT", "Foot Worship", "Roleplay", "Sissy Training", 
  "Pegging", "Medical Play", "Wax Play", "Sensory Deprivation", 
  "Facesitting", "Trampling", "Humilhação Verbal", 
  "Dominação Financeira", "Fetiche em Couro", 
  "Fetiche em Látex", "Crossdressing", "Eletroestimulação", "Agulhamento", 
  "Puppy Play", "Ageplay", "Breath Play", "Fire Play", 
  "Knife Play", "Blood Play", "Caning",
  "Chuva dourada", "Chuva marrom", "Ballbusting"
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
  const [uploading, setUploading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetchPerfil();
  }, []);

  const fetchPerfil = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let { data, error } = await supabase
        .from("perfis")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (!data) {
        const { data: newProfile, error: createError } = await supabase
          .from("perfis")
          .insert([
            { 
              id: user.id, 
              email: user.email, 
              nome: user.user_metadata?.nome || "Nova Profissional",
              status: 'pending',
              role: 'user'
            }
          ])
          .select()
          .single();
        
        if (createError) throw createError;
        data = newProfile;
        toast.info("Perfil inicial criado com sucesso!");
      }

      setPerfil(data);
    } catch (err) {
      console.error("Erro ao carregar/criar perfil:", err);
      toast.error("Erro ao carregar seus dados.");
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

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast.error("Erro ao atualizar senha: " + error.message);
    } else {
      toast.success("Senha atualizada com sucesso!");
      setNewPassword("");
      setConfirmPassword("");
    }
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return;
      if (!perfil) return;

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${perfil.id}/${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const limit = perfil.is_premium ? 20 : 5;
      const currentFotos = perfil.fotos || [];
      
      if (currentFotos.length >= limit) {
        toast.error(`Limite de ${limit} fotos atingido.`);
        return;
      }

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      const updatedFotos = [...currentFotos, publicUrl];
      setPerfil({ ...perfil, fotos: updatedFotos });
      
      toast.success("Foto enviada com sucesso!");
    } catch (error: any) {
      toast.error("Erro no upload: " + error.message);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const removePhoto = (index: number) => {
    if (!perfil) return;
    const updated = (perfil.fotos || []).filter((_: any, i: number) => i !== index);
    setPerfil({ ...perfil, fotos: updated });
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
      <p className="text-muted-foreground">Carregando seu painel...</p>
    </div>
  );

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
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-12 hover:border-primary/50 transition-colors relative">
                  <input 
                    type="file" 
                    accept="image/png, image/jpeg" 
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-10 h-10 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">Enviando arquivo...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold">Clique ou arraste para enviar</p>
                        <p className="text-sm text-muted-foreground">PNG ou JPG (Máx. 5MB)</p>
                      </div>
                    </div>
                  )}
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

          <TabsContent value="seguranca">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="glass-dark">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Key className="w-5 h-5 text-primary" />
                    <CardTitle>Alterar Senha</CardTitle>
                  </div>
                  <CardDescription>Mantenha sua conta segura atualizando sua senha regularmente.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nova Senha</label>
                      <Input 
                        type="password" 
                        placeholder="Mínimo 6 caracteres" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Confirmar Nova Senha</label>
                      <Input 
                        type="password" 
                        placeholder="Repita a nova senha" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-gradient-gold">Atualizar Senha</Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="glass-dark">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    <CardTitle>Privacidade da Conta</CardTitle>
                  </div>
                  <CardDescription>Gerencie como seu perfil é exibido para os visitantes.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border">
                    <div>
                      <p className="font-medium">Ocultar Perfil Temporariamente</p>
                      <p className="text-xs text-muted-foreground">Seu perfil não aparecerá nas buscas enquanto estiver oculto.</p>
                    </div>
                    <Checkbox 
                      checked={perfil.status === 'paused'}
                      onCheckedChange={async (checked) => {
                        const newStatus = checked ? 'paused' : 'approved';
                        const { error } = await supabase.from("perfis").update({ status: newStatus }).eq("id", perfil.id);
                        if (!error) {
                          setPerfil({ ...perfil, status: newStatus });
                          toast.success(checked ? "Perfil ocultado com sucesso." : "Perfil visível novamente.");
                        }
                      }}
                    />
                  </div>
                  
                  <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/10">
                    <p className="font-medium text-destructive">Zona de Perigo</p>
                    <p className="text-xs text-muted-foreground mb-4">Ao excluir sua conta, todos os seus dados e fotos serão removidos permanentemente.</p>
                    <Button variant="destructive" size="sm" className="w-full">Excluir Minha Conta</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}