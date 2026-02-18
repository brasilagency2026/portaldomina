import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Crown, MapPin, MessageCircle, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase, safeFetch } from "@/lib/supabaseQuery";

const ProfileCard = ({ profile, index }: { profile: any; index: number }) => {
  const displayImage = profile.foto_url || (Array.isArray(profile.fotos) && profile.fotos.length > 0 ? profile.fotos[0] : null);

  return (
    <Link to={`/profile/${profile.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group relative rounded-2xl overflow-hidden cursor-pointer"
      >
        <div className="bg-gradient-card border border-primary/30 rounded-2xl overflow-hidden transition-all group-hover:border-primary/50">
          <div className="relative aspect-[3/4] overflow-hidden bg-muted">
            {displayImage ? (
              <img
                src={displayImage}
                alt={profile.nome}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-background flex items-center justify-center">
                <Crown className="w-12 h-12 text-primary/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
            {profile.is_premium && (
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-neon text-primary-foreground text-sm font-semibold neon-glow">
                <Crown className="w-3.5 h-3.5" />
                Premium
              </div>
            )}
          </div>
          <div className="p-5">
            <h3 className="font-display text-xl font-semibold mb-1 group-hover:text-primary transition-colors truncate">
              {profile.nome}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5" />
              {profile.localizacao || "Brasil"}
            </p>
            <div className="flex flex-wrap gap-2 mb-5 h-14 overflow-hidden">
              {profile.servicos?.slice(0, 3).map((s: string) => (
                <span key={s} className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-secondary text-secondary-foreground whitespace-nowrap">
                  {s}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="neon" size="sm" className="flex-1 gap-1.5">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

const FeaturedProfiles = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchFeatured = async () => {
      const data = await safeFetch(
        () => supabase
          .from("perfis")
          .select("id, nome, localizacao, servicos, fotos, foto_url, is_premium")
          .eq("status", "approved")
          .order("is_premium", { ascending: false })
          .limit(8),
        "FeaturedProfiles"
      );

      if (mounted) {
        if (data === null) {
          setError("Não foi possível carregar os perfis.");
        } else {
          setProfiles(data as any[]);
        }
        setLoading(false);
      }
    };

    fetchFeatured();
    return () => { mounted = false; };
  }, []);

  if (!loading && profiles.length === 0 && !error) return null;

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-primary/30 text-sm text-primary mb-6">
            <Crown className="w-4 h-4" /> Destaques da Comunidade
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Profissionais em <span className="text-gradient-gold">Destaque</span>
          </h2>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin w-12 h-12 text-primary" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
            <AlertCircle className="w-8 h-8 text-destructive" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {profiles.map((profile, index) => (
              <ProfileCard key={profile.id} profile={profile} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProfiles;