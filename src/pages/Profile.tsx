import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
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

// Vérifie si c'est un UUID valide
const isUUID = (str: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

const Profile = () => {
  const { slug } = useParams<{ slug: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    if (slug) fetchProfile(slug);
  }, [slug]);

  const fetchProfile = async (identifier: string) => {
    setLoading(true);
    try {
      let query;

      if (isUUID(identifier)) {
        // Rétrocompatibilité : anciens liens avec UUID
        query = supabase.from("perfis").select("*").eq("id", identifier).single();
      } else {
        // Nouveau : recherche par slug
        query = supabase.from("perfis").select("*").eq("slug", identifier).single();
      }

      const { data, error } = await withTimeout(query);
      if (error) throw error;
      setProfile(data);

      // Enregistre une vue
      await supabase.from("profile_views").insert({ perfil_id: data.id });
    } catch (err) {
      console.error("Erro ao buscar perfil:", err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const getWhatsAppUrl = () => {
    if (!profile?.telefone) return null;
    const digits = profile.telefone.replace(/\D/g, "");
    return `https://wa.me/55${digits}`;
  };

  const getWazeUrl = () => {
    if (!profile?.lat || !profile?.lng) return null;
    return `https://waze.com/ul?ll=${profile.lat},${profile.lng}&navigate=yes`;
  };

  const profileSlug = profile?.slug || profile?.id;
  const ogImage = profile?.fotos?.[0] || profile?.foto_url || "https://bmivfqpopjgozwjoustr.supabase.co/storage/v1/object/public/profiles/og-default.jpg";
  const ogTitle = profile ? `${profile.nome} | BDSMBRAZIL` : "BDSMBRAZIL";
  const ogDescription = profile?.bio
    ? profile.bio.slice(0, 200) + (profile.bio.length > 200 ? "..." : "")
    : "Profissional verificada no maior portal BDSM do Brasil.";
  const ogUrl = `https://bdsmbrazil.com.br/profile/${profileSlug}`;

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
  const whatsappUrl = getWhatsAppUrl();
  const wazeUrl = getWazeUrl();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{ogTitle}</title>
        <meta name="description" content={ogDescription} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={ogUrl} />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="BDSMBRAZIL" />
        <meta property="og:locale" content="pt_BR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDescription} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-4">
          <Link to="/explorar">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Voltar
            </Button>
          </Link>
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
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {profile.bio || "Sem biografia disponível."}
                </p>
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

              {/* Compartilhar */}
              <div className="p-4 rounded-xl bg-secondary/30 border border-border">
                <p className="text-sm text-muted-foreground mb-3 font-medium">Compartilhar perfil:</p>
                <div className="flex gap-3 flex-wrap">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(ogUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="gap-2 border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                      Facebook
                    </Button>
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`${ogTitle}\n${ogDescription}\n\n${ogUrl}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="gap-2 border-green-500/30 text-green-400 hover:bg-green-500/10">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                      WhatsApp
                    </Button>
                  </a>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-border"
                    onClick={() => navigator.clipboard.writeText(ogUrl)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    Copiar Link
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {whatsappUrl ? (
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button variant="neon" size="xl" className="w-full gap-2 h-14 text-lg">
                      <MessageCircle className="w-6 h-6" /> WhatsApp
                    </Button>
                  </a>
                ) : (
                  <Button variant="neon" size="xl" className="flex-1 gap-2 h-14 text-lg" disabled>
                    <MessageCircle className="w-6 h-6" /> WhatsApp
                  </Button>
                )}

                {wazeUrl ? (
                  <a href={wazeUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="xl" className="gap-2 h-14 border-primary/30">
                      <Navigation className="w-6 h-6" /> Waze
                    </Button>
                  </a>
                ) : (
                  <Button variant="outline" size="xl" className="gap-2 h-14 border-primary/30" disabled>
                    <Navigation className="w-6 h-6" /> Waze
                  </Button>
                )}
              </div>

              {!whatsappUrl && (
                <p className="text-xs text-muted-foreground text-center">
                  Esta profissional ainda não adicionou um número de contato.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;