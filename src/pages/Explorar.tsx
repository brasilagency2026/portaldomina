import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Crown, MessageCircle, Loader2, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GoogleMap from "@/components/explore/GoogleMap";
import { supabase, withTimeout } from "@/lib/supabaseQuery";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

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

const ProfileImage = ({ profile }: { profile: any }) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (Array.isArray(profile.fotos) && profile.fotos.length > 0) {
      const valid = profile.fotos.find((f: string) => f && f.startsWith("http"));
      if (valid) { setImgSrc(valid); return; }
    }
    if (profile.foto_url && profile.foto_url.startsWith("http")) {
      setImgSrc(profile.foto_url);
      return;
    }
    setImgSrc(null);
  }, [profile]);

  if (!imgSrc || error) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-background flex items-center justify-center">
        <Crown className="w-8 h-8 text-primary/30" />
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={profile.nome}
      className="w-full h-full object-cover"
      onError={() => setError(true)}
    />
  );
};

const Explorar = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [premiumOnly, setPremiumOnly] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfiles();
  }, [premiumOnly, selectedServices]);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("perfis")
        .select("*")
        .eq("status", "approved");

      if (premiumOnly) query = query.eq("is_premium", true);
      if (selectedServices.length > 0) query = query.contains("servicos", selectedServices);

      const { data, error } = await withTimeout(query.order("is_premium", { ascending: false }));

      if (error) throw error;
      setProfiles(data || []);
    } catch (err) {
      console.error("Erro ao buscar perfis:", err);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleService = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const filteredProfiles = searchQuery.trim()
    ? profiles.filter(p =>
        (p.nome || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.localizacao || "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : profiles;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        {/* Barre de recherche sticky */}
        <div className="glass-dark border-b border-border sticky top-20 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Digite sua cidade ou bairro..."
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                />
              </div>

              <div className="flex gap-2 w-full lg:w-auto">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="gap-2 flex-1 lg:flex-none border-border">
                      <Filter className="w-4 h-4" />
                      Serviços {selectedServices.length > 0 && `(${selectedServices.length})`}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 glass-dark border-border p-4" align="end">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium leading-none">Filtrar por Serviços</h4>
                        {selectedServices.length > 0 && (
                          <button onClick={() => setSelectedServices([])} className="text-xs text-primary hover:underline">
                            Limpar
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-2">
                        {LISTA_SERVICOS.map((service) => (
                          <div key={service} className="flex items-center space-x-2">
                            <Checkbox
                              id={`filter-${service}`}
                              checked={selectedServices.includes(service)}
                              onCheckedChange={() => toggleService(service)}
                            />
                            <label htmlFor={`filter-${service}`} className="text-sm font-medium leading-none cursor-pointer select-none">
                              {service}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <Button
                  variant={premiumOnly ? "gold" : "secondary"}
                  onClick={() => setPremiumOnly(!premiumOnly)}
                  className="gap-2 flex-1 lg:flex-none"
                >
                  <Crown className="w-4 h-4" />
                  Premium
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Carte */}
            <div className="lg:w-1/2 xl:w-3/5">
              <div className="sticky top-44 rounded-2xl overflow-hidden border border-border bg-card aspect-[4/3] lg:aspect-auto lg:h-[calc(100vh-12rem)]">
                <GoogleMap
                  onMarkerClick={(id) => {
                    const profile = filteredProfiles.find(p => p.id === id);
                    navigate(`/profile/${profile?.slug || id}`);
                  }}
                  markers={filteredProfiles.map((p) => ({
                    id: p.id,
                    slug: p.slug || p.id,
                    name: p.nome,
                    lat: p.lat || -23.5505,
                    lng: p.lng || -46.6333,
                    isPremium: p.is_premium,
                  }))}
                />
              </div>
            </div>

            {/* Liste des profils */}
            <div className="lg:w-1/2 xl:w-2/5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-bold">
                  {loading ? "Carregando..." : `${filteredProfiles.length} perfis encontrados`}
                </h2>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="animate-spin w-8 h-8 text-primary" />
                </div>
              ) : filteredProfiles.length === 0 ? (
                <div className="text-center py-20 glass-dark rounded-2xl border border-dashed border-border">
                  <p className="text-muted-foreground">Nenhum perfil encontrado com esses filtros.</p>
                  <Button
                    variant="link"
                    onClick={() => { setSelectedServices([]); setPremiumOnly(false); setSearchQuery(""); }}
                    className="text-primary mt-2"
                  >
                    Limpar todos os filtros
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProfiles.map((profile, index) => (
                    <Link key={profile.id} to={`/profile/${profile.slug || profile.id}`}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`group p-4 rounded-xl bg-gradient-card border transition-all hover:border-primary/50 cursor-pointer mb-4 ${
                          profile.is_premium ? "border-primary/30" : "border-border"
                        }`}
                      >
                        <div className="flex gap-4">
                          <div className="relative w-24 h-32 rounded-lg overflow-hidden shrink-0 bg-muted">
                            <ProfileImage profile={profile} />
                            {profile.is_premium && (
                              <div className="absolute top-1 left-1 z-10">
                                <Crown className="w-4 h-4 text-primary drop-shadow-lg" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-display text-lg font-semibold truncate group-hover:text-primary transition-colors">
                              {profile.nome}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1 truncate">
                              <MapPin className="w-3.5 h-3.5 shrink-0" />
                              {profile.localizacao || "Localização não informada"}
                            </p>
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {profile.servicos?.slice(0, 3).map((s: string) => (
                                <span key={s} className="px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground whitespace-nowrap">
                                  {s}
                                </span>
                              ))}
                              {profile.servicos?.length > 3 && (
                                <span className="text-[10px] text-muted-foreground self-center">
                                  +{profile.servicos.length - 3}
                                </span>
                              )}
                            </div>
                            <Button
                              variant="neon"
                              size="sm"
                              className="gap-1.5 w-full"
                              onClick={(e) => {
                                e.preventDefault();
                                if (profile.telefone) {
                                  const digits = profile.telefone.replace(/\D/g, "");
                                  window.open(`https://wa.me/55${digits}`, "_blank");
                                }
                              }}
                            >
                              <MessageCircle className="w-4 h-4" /> WHATSAPP
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Explorar;