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
  Filter,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Admin() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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
    setLoading(true);
    const { data: pData } = await supabase.from("perfis").select("*").order('created_at', { ascending: false });
    const { data: payData } = await supabase.from("pagamentos").select("*, perfis(nome)").order('created_at', { ascending: false });
    setProfiles(pData || []);
    setPayments(payData || []);
    setLoading(false);
  };

  const handleStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("perfis").update({ status }).eq("id", id);
    if (!error) {
      toast.success(`Perfil atualizado para ${status}`);
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
    const matchesSearch = p.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = p.localizacao?.toLowerCase().includes(filterLocation.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  if (loading && !profiles.length) return <div className="text-center pt-32">Carregando painel administrativo...</div>;
  if (!isAdmin) return <div className="min-h-screen flex items-center justify-center text-center flex-col gap-4"><ShieldAlert className="w-16 h-16 text-destructive" /><h1 className="text-2xl font-bold">Acesso Negado</h1><p>Você não tem permissão para acessar esta área.</p></div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto pt-32 px-4 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gradient-gold">Administração Central</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchData}>Atualizar Dados</Button>
          </div>
        </div>
        
        <Tabs defaultValue="profiles" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="profiles" className="gap-2"><Users className="w-4 h-4" /> Gestão de Perfis</TabsTrigger>
            <TabsTrigger value="payments" className="gap-2"><CreditCard className="w-4 h-4" /> Financeiro</TabsTrigger>
          </TabsList>

          <TabsContent value="profiles" className="space-y-6">
            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 glass-dark p-4 rounded-xl border border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por nome ou email..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Filtrar por Cidade/Estado..." 
                  className="pl-10"
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                {selectedIds.length > 0 && (
                  <div className="flex gap-2 w-full">
                    <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => handleBulkStatus('paused')}>
                      <Pause className="w-3 h-3" /> Pausar ({selectedIds.length})
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => handleBulkStatus('approved')}>
                      <Play className="w-3 h-3" /> Ativar
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Lista de Perfis */}
            <div className="space-y-4">
              {filteredProfiles.length === 0 ? (
                <p className="text-center py-10 text-muted-foreground">Nenhum perfil encontrado com esses filtros.</p>
              ) : (
                filteredProfiles.map((p) => (
                  <Card key={p.id} className={`glass-dark border-l-4 ${
                    p.status === 'approved' ? 'border-l-green-500' : 
                    p.status === 'paused' ? 'border-l-yellow-500' : 'border-l-red-500'
                  }`}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <Checkbox 
                        checked={selectedIds.includes(p.id)}
                        onCheckedChange={() => toggleSelect(p.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold truncate">{p.nome}</h3>
                          <Badge variant={p.status === 'approved' ? 'default' : 'secondary'} className="text-[10px] uppercase">
                            {p.status}
                          </Badge>
                          {p.is_premium && <Badge className="bg-gradient-gold text-[10px]">PREMIUM</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{p.email}</p>
                        <p className="text-xs flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" /> {p.localizacao || "Não informada"}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        {p.status === 'pending' && (
                          <>
                            <Button size="sm" variant="ghost" className="text-green-500 hover:text-green-400" onClick={() => handleStatus(p.id, 'approved')}>
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-400" onClick={() => handleStatus(p.id, 'rejected')}>
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm"><MoreHorizontal className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="glass-dark border-border">
                            {p.status === 'approved' ? (
                              <DropdownMenuItem onClick={() => handleStatus(p.id, 'paused')} className="gap-2">
                                <Pause className="w-4 h-4" /> Pausar Perfil
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleStatus(p.id, 'approved')} className="gap-2">
                                <Play className="w-4 h-4" /> Ativar Perfil
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleStatus(p.id, 'rejected')} className="gap-2 text-destructive">
                              <X className="w-4 h-4" /> Rejeitar/Banir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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