import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Crown, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GoogleMap from "@/components/explore/GoogleMap";
import { supabase } from "@/lib/supabase";
import { MOCK_PROFILES } from "@/lib/mockData";

const Explorar = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [premiumOnly, setPremiumOnly] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, [premiumOnly]);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("perfis")
        .select("*")
        .eq("status", "approved");

      if (premiumOnly) {
        query = query.eq("is_premium", true);
      }

      const { data, error } = await query.order("is_premium", { ascending: false });
      
      if (error || !data || data.length === 0) {
        const filteredMock = premiumOnly 
          ? MOCK_PROFILES.filter(p => p.is_premium) 
          : MOCK_PROFILES;
        setProfiles(filteredMock);
      } else {
        setProfiles(data);
      }
    } catch (err) {
      setProfiles(premiumOnly ? MOCK_PROFILES.filter(p => p.is_premium) : MOCK_PROFILES);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="glass-dark border-b border-border sticky top-20 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold" />
                <input
                  type="text"
                  placeholder="Digite sua cidade ou bairro..."
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                />
              </div>

              <Button
                variant={premiumOnly ? "gold" : "secondary"}
                onClick={() => setPremiumOnly(!premiumOnly)}
                className="gap-2"
              >
                <Crown className="w-4 h-4" />
                Premium Only
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/2 xl:w-3/5">
              <div className="sticky top-44 rounded-2xl overflow-hidden border border-border bg-card aspect-[4/3] lg:aspect-auto lg:h-[calc(100vh-12rem)]">
                <GoogleMap
                  markers={profiles.map((p) => ({
                    id: p.id,
                    name: p.nome,
                    lat: p.lat || -23.5505,
                    lng: p.lng || -46.6333,
                    isPremium: p.is_premium,
                  }))}
                />
              </div>
            </div>

            <div className="lg:w-1/2 xl:w-2/5">
              <h2 className="font-display text-2xl font-bold mb-6">
                {loading ? "Carregando..." : `${profiles.length} perfis encontrados`}
              </h2>

              {loading ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>
              ) : (
                <div className="space-y-4">
                  {profiles.map((profile, index) => (
                    <Link key={profile.id} to={`/profile/${profile.id}`}>
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
                            {profile.foto_url ? (
                              <img 
                                src={profile.foto_url} 
                                alt={profile.nome}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-background" />
                            )}
                            {profile.is_premium && <Crown className="absolute top-2 left-2 w-4 h-4 text-primary z-10" />}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-display text-lg font-semibold truncate group-hover:text-primary transition-colors">
                              {profile.nome}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {profile.localizacao || "Localização não informada"}
                            </p>
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {profile.servicos?.slice(0, 3).map((s: string) => (
                                <span key={s} className="px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">{s}</span>
                              ))}
                            </div>
                            <div className="flex gap-2 mt-3">
                              <Button variant="neon" size="sm" className="flex-1 gap-1.5"><MessageCircle className="w-4 h-4" /> WhatsApp</Button>
                            </div>
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