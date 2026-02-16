import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Crown, MapPin, MessageCircle, Navigation, ArrowLeft, Shield, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";
import { MOCK_PROFILES } from "@/lib/mockData";

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("perfis")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error || !data) {
        const mock = MOCK_PROFILES.find(p => p.id === id);
        setProfile(mock);
      } else {
        setProfile(data);
      }
    } catch (err) {
      const mock = MOCK_PROFILES.find(p => p.id === id);
      setProfile(mock);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin w-12 h-12 text-primary" /></div>;
  if (!profile) return <div className="min-h-screen flex items-center justify-center">Perfil não encontrado</div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-4">
          <Link to="/explorar"><Button variant="ghost" className="gap-2"><ArrowLeft className="w-4 h-4" /> Voltar</Button></Link>
        </div>

        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-border bg-muted">
                {profile.foto_url ? (
                  <img 
                    src={profile.foto_url} 
                    alt={profile.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-background" />
                )}
                {profile.is_premium && <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-neon text-primary-foreground text-sm font-semibold neon-glow"><Crown className="w-4 h-4" /> Premium</div>}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-2 neon-text">{profile.nome}</h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary" /> {profile.localizacao}</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-card border border-border">
                <h3 className="font-display text-lg font-semibold mb-3">Sobre</h3>
                <p className="text-muted-foreground leading-relaxed">{profile.bio || "Sem biografia disponível."}</p>
              </div>

              <div>
                <h3 className="font-display text-lg font-semibold mb-3">Especialidades</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.servicos?.map((s: string) => (
                    <span key={s} className="px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">{s}</span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button variant="neon" size="lg" className="flex-1 gap-2"><MessageCircle className="w-5 h-5" /> WhatsApp</Button>
                <Button variant="glass" size="lg" className="gap-2"><Navigation className="w-5 h-5" /> Waze</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;