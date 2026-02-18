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
      const { data } = await supabase
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
    } catch (err: any) {
      console.error("Erro ao buscar dados:", err);
      toast.error("Erro ao carregar dados.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("perfis").update({ status }).eq("id", id);
    if (!error) {
      toast.success(`Status atualizado para ${status}!`);
      fetchData();
    } else {
      toast.error("Erro ao atualizar status.");
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
    const search = searchTerm.toLowerCase();

    const matchesSearch = name.includes(search) || email.includes(search);
    const matchesStatus = filterStatus === "all" || p.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  
  if (!isAdmin) return <div className="min-h-screen flex items-center justify-center">Acesso Negado</div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto pt-32 px-4 pb-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gradient-gold">Administração Central</h1>
          <Button variant="outline" onClick={fetchData} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        <Tabs defaultValue="profiles" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="profiles" className="gap-2"><Users className="w-4 h-4" /> Perfis</TabsTrigger>
            <TabsTrigger value="payments" className="gap-2"><CreditCard className="w-4 h-4" /> Pagamentos</TabsTrigger>
          </TabsList>

          <TabsContent value="profiles" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 glass-dark p-4 rounded-xl border border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por nome ou email..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por Status" />
                </SelectTrigger>
                <SelectContent className="glass-dark border-border">
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="approved">Ativos</SelectItem>
                  <SelectItem value="paused">Pausados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4">
              {filteredProfiles.map((p) => (
                <Card key={p.id} className="glass-dark border-border">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-muted shrink-0">
                      <img 
                        src={p.foto_url || (p.fotos && p.fotos[0]) || "/placeholder.svg"} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold truncate">{p.nome || "Sem nome"}</h3>
                      <p className="text-xs text-muted-foreground truncate">{p.email}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant={p.status === 'approved' ? 'default' : p.status === 'paused' ? 'secondary' : 'outline'}>
                          {p.status}
                        </Badge>
                        {p.is_premium && <Badge className="bg-gold text-black">Premium</Badge>}
                      </div>
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
                          {p.status === 'approved' ? (
                            <DropdownMenuItem onClick={() => handleStatus(p.id, 'paused')} className="text-yellow-500">
                              <Pause className="w-4 h-4 mr-2" /> Pausar Publicação
                            </DropdownMenuItem>
                          ) : p.status === 'paused' ? (
                            <DropdownMenuItem onClick={() => handleStatus(p.id, 'approved')} className="text-green-500">
                              <Play className="w-4 h-4 mr-2" /> Retomar Publicação
                            </DropdownMenuItem>
                          ) : null}
                          <DropdownMenuItem onClick={() => handleStatus(p.id, 'rejected')} className="text-destructive">
                            <X className="w-4 h-4 mr-2" /> Rejeitar/Remover
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