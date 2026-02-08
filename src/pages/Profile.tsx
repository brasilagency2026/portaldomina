import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Crown,
  MapPin,
  MessageCircle,
  Navigation,
  ArrowLeft,
  Shield,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface Profile {
  id: number;
  name: string;
  images: string[];
  location: string;
  distance: string;
  specialties: string[];
  isPremium: boolean;
  availability: string;
  serviceType: string;
  bio: string;
  whatsapp: string;
  coordinates: { lat: number; lng: number };
}

const mockProfiles: Record<number, Profile> = {
  1: {
    id: 1,
    name: "Lady Victoria",
    images: ["/profiles/profile1.jpg", "/profiles/profile2.jpg", "/profiles/profile3.jpg"],
    location: "São Paulo, SP - Jardins",
    distance: "3.2 km",
    specialties: ["Dominação", "Fetiche", "BDSM", "Roleplay"],
    isPremium: true,
    availability: "Disponível",
    serviceType: "Local próprio",
    bio: "Dominatrix profissional com mais de 10 anos de experiência. Especializada em sessões de dominação elegante e sofisticada. Ambiente discreto e equipado. Atendimento exclusivo para submissos sérios que buscam uma experiência autêntica e memorável.",
    whatsapp: "5511999999999",
    coordinates: { lat: -23.5629, lng: -46.6544 },
  },
  2: {
    id: 2,
    name: "Mistress Luna",
    images: ["/profiles/profile2.jpg", "/profiles/profile1.jpg", "/profiles/profile4.jpg"],
    location: "São Paulo, SP - Moema",
    distance: "5.8 km",
    specialties: ["Roleplay", "Bondage", "Submissão", "Fetiche"],
    isPremium: true,
    availability: "Disponível",
    serviceType: "Hotel",
    bio: "Mistress experiente em roleplay e bondage artístico. Sessões personalizadas de acordo com seus desejos mais profundos. Discrição absoluta garantida.",
    whatsapp: "5511988888888",
    coordinates: { lat: -23.5989, lng: -46.6658 },
  },
  3: {
    id: 3,
    name: "Dominatrix Scarlett",
    images: ["/profiles/profile3.jpg", "/profiles/profile2.jpg"],
    location: "Campinas, SP - Centro",
    distance: "12 km",
    specialties: ["Trampling", "Worship", "Humilhação"],
    isPremium: false,
    availability: "Agenda lotada",
    serviceType: "Domicílio",
    bio: "Especialista em trampling e worship. Sessões intensas para submissos que buscam experiências extremas.",
    whatsapp: "5519977777777",
    coordinates: { lat: -22.9064, lng: -47.0616 },
  },
  4: {
    id: 4,
    name: "Queen Isabella",
    images: ["/profiles/profile4.jpg", "/profiles/profile1.jpg", "/profiles/profile3.jpg"],
    location: "Rio de Janeiro, RJ - Copacabana",
    distance: "8.5 km",
    specialties: ["Humilhação", "CBT", "Worship", "BDSM"],
    isPremium: true,
    availability: "Disponível",
    serviceType: "Local próprio",
    bio: "Rainha absoluta do BDSM carioca. Dungeon equipada com tudo que você precisa para uma sessão inesquecível. Apenas para submissos experientes.",
    whatsapp: "5521966666666",
    coordinates: { lat: -22.9711, lng: -43.1822 },
  },
};

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const profile = mockProfiles[Number(id)];

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Perfil não encontrado</h1>
          <Link to="/explorar">
            <Button variant="neon">Voltar para Explorar</Button>
          </Link>
        </div>
      </div>
    );
  }

  const wazeLink = `https://waze.com/ul?ll=${profile.coordinates.lat},${profile.coordinates.lng}&navigate=yes`;
  const whatsappLink = `https://wa.me/${profile.whatsapp}`;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-4">
          <Link to="/explorar">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </Link>
        </div>

        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-border">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${profile.images[0]})`,
                    backgroundColor: "hsl(var(--muted))",
                  }}
                />
                {profile.isPremium && (
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-neon text-primary-foreground text-sm font-semibold neon-glow">
                    <Crown className="w-4 h-4" />
                    Premium
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {profile.images.length > 1 && (
                <div className="grid grid-cols-3 gap-3">
                  {profile.images.slice(1, 4).map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-colors cursor-pointer"
                    >
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${image})`,
                          backgroundColor: "hsl(var(--muted))",
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Header */}
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-2 neon-text">
                  {profile.name}
                </h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary" />
                    {profile.location}
                  </span>
                  <span className="text-primary font-medium">{profile.distance}</span>
                </div>
              </div>

              {/* Status */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-border">
                  <Clock className="w-4 h-4 text-primary" />
                  <span
                    className={`text-sm font-medium ${
                      profile.availability === "Disponível"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {profile.availability}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-border">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{profile.serviceType}</span>
                </div>
              </div>

              {/* Bio */}
              <div className="p-6 rounded-2xl bg-gradient-card border border-border">
                <h3 className="font-display text-lg font-semibold mb-3">Sobre</h3>
                <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
              </div>

              {/* Specialties */}
              <div>
                <h3 className="font-display text-lg font-semibold mb-3">Especialidades</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="neon" size="lg" className="w-full gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Chamar no WhatsApp
                  </Button>
                </a>
                <a href={wazeLink} target="_blank" rel="noopener noreferrer">
                  <Button variant="glass" size="lg" className="gap-2">
                    <Navigation className="w-5 h-5" />
                    Abrir no Waze
                  </Button>
                </a>
              </div>

              {/* Verified Badge */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <Shield className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-medium text-sm">Perfil Verificado</p>
                  <p className="text-xs text-muted-foreground">
                    Identidade confirmada pela equipe Dominatrix BR
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
