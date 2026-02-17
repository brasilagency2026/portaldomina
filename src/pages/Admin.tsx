import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import { 
  Check, 
  X, 
  ShieldAlert, 
  CreditCard, 
  Users, 
  Search, 
  Pause, 
  Play, 
  MapPin,
  Clock,
  MoreHorizontal,
  EyeOff,
  Eye,
  Loader2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Admin() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const initAdmin = async () => {
      const isAd = await checkAdmin();
      if (isAd) {
        await fetchData();
      }
      setLoading(false);
    };
    initAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
      const { data, error } = await supabase
        .from("perfis")
        .select("role")
        .eq("id", user.id)
        .single();
      
      const isAd = data?.role === 'admin';
      setIsAdmin(isAd);
      return isAd;
    }
    setIsAdmin(false);
    return false;
  };

  const fetchData = async () => {
    try {
      const { data: pData } = await supabase.from("perfis").select("*").order('created_at', { ascending: false });
      const { data: payData } = await supabase.from("pagamentos").select("*, perfis(nome)").order('created_at', { ascending: false });
      setProfiles(pData || []);
      setPayments(payData || []);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    }
  };

  const handleStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("perfis").update({ status }).eq("id", id);
    if (!error) {
      const statusMsg = status === 'paused' ? 'pausado (invisível)' : status === 'approved' ? 'ativado (visível)' : status;
      toast.success(`Perfil ${statusMsg} com sucesso!`);
      fetchData();
    }
  };

  const handleBulkStatus = async (status: string) => {
    if (selectedIds.length === 0) return;
    const { error } = await supabase.from("perfis").update({ status }).in("id", selectedIds);
    if (!error) {
      toast.success(`${selectedIds.length} perfis atualizados para ${status}`);
      setSelectedIds([]);
      fetchData();
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredProfiles = profiles.filter(p => {
    const name = (p.nome || "").toLowerCase();
    const email = (p.email || "").toLowerCase();
    const location = (p.localizacao || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    const city = cityFilter.toLowerCase();

    const matchesSearch = name.includes(search) || email.includes(search);
    const matchesCity = !cityFilter || location.includes(city);
    const matchesStatus = filterStatus === "all" || p.status === filterStatus;
    
    return matchesSearch && matchesCity && matchesStatus;
  });

  const pendingCount = profiles.filter(p => p.status === 'pending').length;

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
      <p className="text-muted-foreground">Verificando credenciais de administrador...</p>
    </div>
  );
  
  if (isAdmin === false) return (
    <div className="min-h-screen flex items-center justify-center text-center flex-col gap-6 px-4">
      <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
        <ShieldAlert className="w-10 h-10 text-destructive" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Acesso Negado</h1>
        <p className="text-muted-foreground max-w-md">
          Você não tem permissão de administrador. Certifique-se de que sua conta tem a função <code className="bg-secondary px-1 rounded">admin</code> na tabela de perfis.
        </p>
        {userId && (
          <p className="text-xs text-muted-foreground mt-4">
            Seu ID de usuário: <span className="font-mono select-all">{userId}</span>
          </p>
        )}
      </div>
      <Button asChild variant="outline" size="lg"><a href="/">Voltar para Home</a></Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto pt-32 px-4 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gradient-gold">Administração Central</h1>
            <p className="text-muted-foreground">Gerencie inscrições, visibilidade e usuários.</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchData}>Atualizar Dados</Button>
        </div>
        
        <Tabs defaultValue="profiles" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="profiles" className="gap-2">
              <Users className="w-4 h-4" /> 
              Perfis {pendingCount > 0 && <Badge className="ml-1 bg-primary h-5 w-5 p-0 flex items-center justify-center rounded-full">{pendingCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2"><CreditCard className="w-4 h-4" /> Financeiro</TabsTrigger>
          </TabsList>

          <TabsContent value="profiles" className="space-y-6">
            {/* Filtros Avançados */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 glass-dark p-4 rounded-xl border border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Nome ou email..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Filtrar por Cidade..." 
                  className="pl-10"
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                />
              </div>
              <div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="glass-dark border-border">
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                    <SelectItem value="approved">Ativos (Visíveis)</SelectItem>
                    <SelectItem value="paused">Pausados (Ocultos)</SelectItem>
                    <SelectItem value="rejected">Rejeitados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                {selectedIds.length > 0 && (
                  <div className="flex gap-2 w-full">
                    <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => handleBulkStatus('approved')}>
                      <Check className="w-3 h-3" /> Ativar ({selectedIds.length})
                    </Button>
                    <Button variant="destructive" size="sm" className="flex-1 gap-1" onClick={() => handleBulkStatus('paused')}>
                      <Pause className="w-3 h-3" /> Pausar
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {filteredProfiles.length === 0 ? (
                <p className="text-center py-10 text-muted-foreground">Nenhum perfil encontrado com esses filtros.</p>
              ) : (
                filteredProfiles.map((p) => (
                  <Card key={p.id} className={`glass-dark border-l-4 transition-all ${
                    p.status === 'approved' ? 'border-l-green-500' : 
                    p.status === 'pending' ? 'border-l-yellow-500 animate-pulse' : 
                    p.status === 'paused' ? 'border-l-blue-500 opacity-75 grayscale-[0.5]' : 'border-l-red-500'
                  }`}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <Checkbox 
                        checked={selectedIds.includes(p.id)}
                        onCheckedChange={() => toggleSelect(p.id)}
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold truncate">{p.nome || "Sem nome"}</h3>
                          <Badge variant={p.status === 'approved' ? 'default' : 'secondary'} className="text-[10px] uppercase">
                            {p.status === 'pending' ? 'NOVA INSCRIÇÃO' : p.status === 'paused' ? 'PAUSADO' : p.status}
                          </Badge>
                          {p.is_premium && <Badge className="bg-gradient-gold text-[10px]">PREMIUM</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{p.email}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-xs flex items-center gap-1 font-medium text-primary">
                            <MapPin className="w-3 h-3" /> {p.localizacao || "Não informada"}
                          </p>
                          <p className="text-xs flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-3 h-3" /> {new Date(p.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Botões de Ação Direta */}
                        {p.status === 'pending' ? (
                          <>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-1" onClick={() => handleStatus(p.id, 'approved')}>
                              <Check className="w-4 h-4" /> Aprovar
                            </Button>
                            <Button size="sm" variant="destructive" className="gap-1" onClick={() => handleStatus(p.id, 'rejected')}>
                              <X className="w-4 h-4" /> Rejeitar
                            </Button>
                          </>
                        ) : (
                          <>
                            {p.status === 'approved' ? (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-blue-500 text-blue-500 hover:bg-blue-500/10 gap-1" 
                                onClick={() => handleStatus(p.id, 'paused')}
                                title="Ocultar do site"
                              >
                                <Pause className="w-4 h-4" /> Pausar
                              </Button>
                            ) : p.status === 'paused' ? (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-green-500 text-green-500 hover:bg-green-500/10 gap-1" 
                                onClick={() => handleStatus(p.id, 'approved')}
                                title="Mostrar no site"
                              >
                                <Play className="w-4 h-4" /> Ativar
                              </Button>
                            ) : null}

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm"><MoreHorizontal className="w-4 h-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="glass-dark border-border">
                                <DropdownMenuItem asChild>
                                  <a href={`/profile/${p.id}`} target="_blank" className="flex items-center gap-2">
                                    <Eye className="w-4 h-4" /> Ver Perfil Público
                                  </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatus(p.id, 'rejected')} className="gap-2 text-destructive">
                                  <X className="w-4 h-4" /> Banir/Rejeitar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="payments">
            <Card className="glass-dark">
              <CardHeader><CardTitle>Histórico de Transações</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments.length === 0 ? (
                    <p className="text-center py-10 text-muted-foreground">Nenhum pagamento registrado.</p>
                  ) : (
                    payments.map((pay) => (
                      <div key={pay.id} className="flex items-center justify-between p-4 border-b border-border/50 last:border-0">
                        <div>
                          <p className="font-bold">{pay.perfis?.nome || 'Usuário Desconhecido'}</p>
                          <p className="text-xs text-muted-foreground">{new Date(pay.created_at).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gradient-gold font-bold">R$ {pay.valor?.toFixed(2)}</p>
                          <Badge variant={pay.status === 'completed' ? 'default' : 'outline'} className="text-[10px]">
                            {pay.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}