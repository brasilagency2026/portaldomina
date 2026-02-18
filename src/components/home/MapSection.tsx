import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Loader2 } from "lucide-react";
import GoogleMap from "@/components/explore/GoogleMap";
import { supabase } from "@/lib/supabase";
import { MOCK_PROFILES } from "@/lib/mockData";
import { useNavigate } from "react-router-dom";

const MapSection = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from("perfis")
          .select("*")
          .eq("status", "approved");
        
        if (error || !data || data.length === 0) {
          console.log("[MapSection] Using MOCK data");
          setProfiles(MOCK_PROFILES);
        } else {
          setProfiles(data || []);
        }
      } catch (err) {
        console.error("[MapSection] Error:", err);
        console.log("[MapSection] Using MOCK data due to error");
        setProfiles(MOCK_PROFILES);
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-primary/30 text-sm text-primary mb-6">
            <MapPin className="w-4 h-4" />
            Exploração em Tempo Real
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Encontre no <span className="text-gradient-gold">Mapa</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Visualize as profissionais disponíveis na sua região e planeje sua experiência com precisão.
          </p>
        </motion.div>

        <div className="rounded-3xl overflow-hidden border border-border bg-card aspect-[16/9] md:aspect-[21/9] shadow-premium relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-card/50 backdrop-blur-sm z-10">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground animate-pulse">Localizando profissionais...</p>
              </div>
            </div>
          ) : (
            <GoogleMap
              onMarkerClick={(id) => navigate(`/profile/${id}`)}
              markers={profiles.map((p) => ({
                id: p.id,
                name: p.nome,
                lat: p.lat || -23.5505,
                lng: p.lng || -46.6333,
                isPremium: p.is_premium,
              }))}
            />
          )}
        </div>

        <div className="mt-8 flex justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary shadow-neon" />
            <span>Premium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span>Verificado</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;