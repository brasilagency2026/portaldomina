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
  Eye,
  Loader2,
  RefreshCw,
  AlertTriangle
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
  const [refreshing, setRefreshing] = useState(false);
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
    setRefreshing(true);
    try {
      const { data: pData, error: pError } = await supabase
        .from("perfis")
        .select("*")
        .order('created_at', { ascending: false });
      
      if (pError) throw pError;

      const { data: payData } = await supabase
        .from("pagamentos")
        .select("*, perfis(nome)")
        .order('created_at', { ascending: false });

      setProfiles(pData || []);
      setPayments(payData || []);
      
      if (pData) {
        toast.success(`${pData.length} perfis carregados.`);
      }
    } catch (err: any) {
      console.error("Erro ao buscar dados:", err);
      toast.error("Erro de permissão: Verifique as políticas RLS no Supabase.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("perfis").update({ status }).eq("id", id);
    if (!error) {
      toast.success(`Status atualizado!`);
      fetchData();
    } else {
      toast.error("Erro: Você não tem permissão para editar este perfil (RLS).");
    }
  };

  const handleBulkStatus = async (status: string) => {
    if (selectedIds.length === 0) return;
    const { error } = await supabase.from("perfis").update({ status }).in("id", selectedIds);
    if (!error) {
      toast.success(`${selectedIds.length} perfis atualizados.`);
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
      <p className="text-muted-foreground">Verificando acesso...</p>
    </div>
  );
  
  if (isAdmin === false) return (
    <div className="min-h-screen flex items-center justify-center text-center flex-col gap-6 px-4">
      <ShieldAlert className="w-16 h-16 text-destructive" />
      <h1 className="text-3xl font-bold">Acesso Negado</h1>
      <Button asChild variant="outline"><a href="/">Voltar</a></Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto pt-32 px-4 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gradient-gold">Administração Central</h1>
            <p className="text-muted-foreground">Gerencie inscrições e usuários.</p>
          </div>
          <Button 
            variant="outline" 
            onClick={fetchData} 
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Atualizar Dados
          </Button>
        </div>

        {profiles.length === 1 && profiles[0].id === userId && (
          <div className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center gap-3 text-yellow-500">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="text-sm">
              <strong>Atenção:</strong> Você só está vendo o seu próprio perfil. Isso indica que as <strong>Políticas RLS</strong> no seu Supabase estão bloqueando o acesso aos outros dados. Execute o script SQL de permissão no painel do Supabase.
            </p>
          </div>
        )}
        
        <Tabs defaultValue="profiles" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="profiles" className="gap-2">
              <Users className="w-4 h-4" /> 
              Perfis {pendingCount > 0 && <Badge className="ml-1 bg-primary">{pendingCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2"><CreditCard className="w-4 h-4" /> Financeiro</TabsTrigger>
          </TabsList>

          <TabsContent value="profiles" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 glass-dark p-4 rounded-xl border border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="glass-dark border-border">
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="approved">Ativos</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                {selectedIds.length > 0 && (
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleBulkStatus('approved')}>
                    Aprovar Selecionados ({selectedIds.length})
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {filteredProfiles.map((p) => (
                <Card key={p.id} className={`glass-dark border-l-4 ${
                  p.status === 'approved' ? 'border-l-green-500' : 'border-l-yellow-500'
                }`}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <Checkbox 
                      checked={selectedIds.includes(p.id)}
                      onCheckedChange={() => toggleSelect(p.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold truncate">{p.nome || "Sem nome"}</h3>
                        {p.id === userId && <Badge variant="outline" className="text-[10px]">VOCÊ</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{p.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {p.status === 'pending' && (
                        <Button size="sm" className="bg-green-600" onClick={() => handleStatus(p.id, 'approved')}>
                          Aprovar
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm"><MoreHorizontal className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass-dark border-border">
                          <DropdownMenuItem asChild>
                            <a href={`/profile/${p.id}`} target="_blank" className="flex items-center gap-2">
                              <Eye className="w-4 h-4" /> Ver Perfil
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatus(p.id, 'rejected')} className="text-destructive">
                            Rejeitar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}