import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import {
  Check,
  X,
  CreditCard,
  Users,
  Search,
  Pause,
  Play,
  Eye,
  Loader2,
  RefreshCw,
  Crown,
  MoreHorizontal,
  ShieldCheck,
  Clock,
  MapPin,
  Phone,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  approved: { label: "Aprovado", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  pending:  { label: "Pendente", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  paused:   { label: "Pausado",  color: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
  rejected: { label: "Rejeitado",color: "bg-red-500/20 text-red-400 border-red-500/30" },
};

export default function Admin() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const init = async () => {
      const ok = await checkAdmin();
      if (ok) await fetchData();
      setLoading(false);
    };
    init();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setIsAdmin(false); return false; }
    const { data } = await supabase.from("perfis").select("role").eq("id", user.id).single();
    const ok = data?.role === "admin";
    setIsAdmin(ok);
    return ok;
  };

  const fetchData = async () => {
    setRefreshing(true);
    const { data: pData } = await supabase
      .from("perfis")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: payData } = await supabase
      .from("pagamentos")
      .select("*, perfis(nome)")
      .order("created_at", { ascending: false });

    setProfiles(pData || []);
    setPayments(payData || []);
    setRefreshing(false);
  };

  const handleStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("perfis").update({ status }).eq("id", id);
    if (!error) {
      toast.success(`Status atualizado para "${STATUS_CONFIG[status]?.label || status}"`);
      setProfiles(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    } else {
      toast.error("Erro ao atualizar status.");
    }
  };

  const togglePremium = async (id: string, current: boolean) => {
    const { error } = await supabase.from("perfis").update({ is_premium: !current }).eq("id", id);
    if (!error) {
      toast.success(!current ? "Premium ativado!" : "Premium removido.");
      setProfiles(prev => prev.map(p => p.id === id ? { ...p, is_premium: !current } : p));
    } else {
      toast.error("Erro ao atualizar Premium.");
    }
  };

  const getProfileImage = (p: any) => {
    if (Array.isArray(p.fotos) && p.fotos.length > 0) {
      const valid = p.fotos.find((f: string) => f && f.startsWith("http"));
      if (valid) return valid;
    }
    if (p.foto_url && p.foto_url.startsWith("http")) return p.foto_url;
    return null;
  };

  const filteredProfiles = profiles.filter(p => {
    const matchSearch =
      (p.nome || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Stats
  const stats = {
    total: profiles.length,
    approved: profiles.filter(p => p.status === "approved").length,
    pending: profiles.filter(p => p.status === "pending").length,
    premium: profiles.filter(p => p.is_premium).length,
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin w-10 h-10 text-primary" />
    </div>
  );

  if (!isAdmin) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <ShieldCheck className="w-16 h-16 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Acesso Negado</h1>
        <p className="text-muted-foreground">Você não tem permissão para acessar esta página.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto pt-32 px-4 pb-20">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gradient-gold">Administração Central</h1>
          <Button variant="outline" onClick={fetchData} disabled={refreshing} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total de Perfis", value: stats.total, icon: Users, color: "text-blue-400" },
            { label: "Aprovados", value: stats.approved, icon: Check, color: "text-green-400" },
            { label: "Pendentes", value: stats.pending, icon: Clock, color: "text-yellow-400" },
            { label: "Premium", value: stats.premium, icon: Crown, color: "text-primary" },
          ].map((s) => (
            <Card key={s.label} className="glass-dark border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="profiles" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="profiles" className="gap-2">
              <Users className="w-4 h-4" /> Perfis
              {stats.pending > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-yellow-500 text-black text-xs font-bold">
                  {stats.pending}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2">
              <CreditCard className="w-4 h-4" /> Pagamentos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profiles" className="space-y-4">
            {/* Filtros */}
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
                  <SelectItem value="approved">Aprovados</SelectItem>
                  <SelectItem value="paused">Pausados</SelectItem>
                  <SelectItem value="rejected">Rejeitados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <p className="text-sm text-muted-foreground px-1">
              {filteredProfiles.length} perfil(is) encontrado(s)
            </p>

            {/* Lista de perfis */}
            <div className="grid gap-3">
              {filteredProfiles.map((p) => {
                const imgSrc = getProfileImage(p);
                const statusCfg = STATUS_CONFIG[p.status] || STATUS_CONFIG.pending;

                return (
                  <Card key={p.id} className="glass-dark border-border hover:border-primary/20 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-secondary shrink-0 border border-border">
                          {imgSrc ? (
                            <img
                              src={imgSrc}
                              alt={p.nome}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.currentTarget.style.display = "none"; }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xl font-bold">
                              {(p.nome || "?")[0].toUpperCase()}
                            </div>
                          )}
                        </div>

                        {/* Infos */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-bold truncate">{p.nome || "Sem nome"}</h3>
                            {p.is_premium && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/30">
                                <Crown className="w-3 h-3" /> Premium
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate mb-2">{p.email}</p>
                          <div className="flex flex-wrap gap-2 items-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusCfg.color}`}>
                              {statusCfg.label}
                            </span>
                            {p.localizacao && (
                              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="w-3 h-3" /> {p.localizacao}
                              </span>
                            )}
                            {p.telefone && (
                              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                <Phone className="w-3 h-3" /> {p.telefone}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions rapides */}
                        <div className="flex items-center gap-2 shrink-0">
                          {p.status === "pending" && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 gap-1.5 text-white"
                              onClick={() => handleStatus(p.id, "approved")}
                            >
                              <Check className="w-3.5 h-3.5" /> Aprovar
                            </Button>
                          )}

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="glass-dark border-border w-52">
                              <DropdownMenuItem asChild>
                                <a href={`/profile/${p.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 cursor-pointer">
                                  <Eye className="w-4 h-4" /> Ver Perfil Público
                                </a>
                              </DropdownMenuItem>

                              <DropdownMenuSeparator className="bg-border" />

                              {/* Toggle Premium */}
                              <DropdownMenuItem
                                onClick={() => togglePremium(p.id, p.is_premium)}
                                className={`flex items-center gap-2 cursor-pointer ${p.is_premium ? "text-yellow-400" : "text-primary"}`}
                              >
                                <Crown className="w-4 h-4" />
                                {p.is_premium ? "Remover Premium" : "Ativar Premium"}
                              </DropdownMenuItem>

                              <DropdownMenuSeparator className="bg-border" />

                              {/* Status actions */}
                              {p.status !== "approved" && (
                                <DropdownMenuItem
                                  onClick={() => handleStatus(p.id, "approved")}
                                  className="flex items-center gap-2 cursor-pointer text-green-400"
                                >
                                  <Check className="w-4 h-4" /> Aprovar
                                </DropdownMenuItem>
                              )}
                              {p.status === "approved" && (
                                <DropdownMenuItem
                                  onClick={() => handleStatus(p.id, "paused")}
                                  className="flex items-center gap-2 cursor-pointer text-yellow-400"
                                >
                                  <Pause className="w-4 h-4" /> Pausar Publicação
                                </DropdownMenuItem>
                              )}
                              {p.status === "paused" && (
                                <DropdownMenuItem
                                  onClick={() => handleStatus(p.id, "approved")}
                                  className="flex items-center gap-2 cursor-pointer text-green-400"
                                >
                                  <Play className="w-4 h-4" /> Retomar Publicação
                                </DropdownMenuItem>
                              )}
                              {p.status !== "rejected" && (
                                <DropdownMenuItem
                                  onClick={() => handleStatus(p.id, "rejected")}
                                  className="flex items-center gap-2 cursor-pointer text-destructive"
                                >
                                  <X className="w-4 h-4" /> Rejeitar / Remover
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {filteredProfiles.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>Nenhum perfil encontrado.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="payments">
            <div className="grid gap-3">
              {payments.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>Nenhum pagamento registrado.</p>
                </div>
              ) : (
                payments.map((pay) => (
                  <Card key={pay.id} className="glass-dark border-border">
                    <CardContent className="p-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold">{pay.perfis?.nome || "—"}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(pay.created_at).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">R$ {Number(pay.valor).toFixed(2)}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${
                          pay.status === "paid"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        }`}>
                          {pay.status === "paid" ? "Pago" : "Pendente"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}