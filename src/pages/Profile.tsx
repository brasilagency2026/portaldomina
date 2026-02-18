import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Crown, MapPin, MessageCircle, Navigation, ArrowLeft, Shield, Home, Hotel, Car, Plane, PartyPopper, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabase, withTimeout } from "@/lib/supabaseQuery";

const ICON_MAP: Record<string, any> = {
  "Local Próprio": Home,
  "Hotel / Motel": Hotel,
  "Domicílio": Car,
  "Viagens": Plane,
  "Eventos": PartyPopper
};

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await withTimeout(
        supabase.from("perfis").select("*").eq("id", id).single()
      );
      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error("Erro ao buscar perfil:", err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin w-12 h-12 text-primary" />
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-2xl font-bold mb-4">Perfil não encontrado</h1>
        <Button asChild><Link to="/explorar">Voltar para a busca</Link></Button>
      </div>
      <Footer />
    </div>
  );

  const allPhotos = profile.fotos?.length > 0 ? profile.fotos : (profile.foto_url ? [profile.foto_url] : []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-4">
          <Link to="/explorar"><Button variant="ghost" className="gap-2"><ArrowLeft className="w-4 h-4" /> Voltar</Button></Link>
        </div>

        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-border bg-muted shadow-premium">
                {allPhotos.length > 0 ? (
                  <img src={allPhotos[activePhoto]} alt={profile.nome} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-background">
                    <Shield className="w-20 h-20 text-primary/20" />
                  </div>
                )}
                {profile.is_premium && (
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-neon text-primary-foreground text-sm font-semibold neon-glow">
                    <Crown className="w-4 h-4" /> Premium
                  </div>
                )}
              </div>
              {allPhotos.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {allPhotos.map((url: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setActivePhoto(i)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${activePhoto === i ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"}`}
                    >
                      <img src={url} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-8">
              <div>
                <h1 className="font-display text-4xl md:text-5xl font-bold mb-2 neon-text">{profile.nome}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{profile.localizacao || "Localização não informada"}</span>
                </div>
              </div>

              {profile.atendimento?.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {profile.atendimento.map((local: string) => {
                    const Icon = ICON_MAP[local] || Home;
                    return (
                      <div key={local} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/50 border border-border text-sm">
                        <Icon className="w-4 h-4 text-primary" />
                        {local}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="p-6 rounded-2xl bg-gradient-card border border-border">
                <h3 className="font-display text-xl font-semibold mb-4">Sobre</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{profile.bio || "Sem biografia disponível."}</p>
              </div>

              <div>
                <h3 className="font-display text-xl font-semibold mb-4">Serviços & Especialidades</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.servicos?.length > 0 ? profile.servicos.map((s: string) => (
                    <span key={s} className="px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                      {s}
                    </span>
                  )) : <p className="text-sm text-muted-foreground">Nenhum serviço listado.</p>}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button variant="neon" size="xl" className="flex-1 gap-2 h-14 text-lg">
                  <MessageCircle className="w-6 h-6" /> WhatsApp
                </Button>
                <Button variant="outline" size="xl" className="gap-2 h-14 border-primary/30">
                  <Navigation className="w-6 h-6" /> Waze
                </Button>
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