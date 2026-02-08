import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  MapPin,
  Filter,
  Search,
  Crown,
  MessageCircle,
  Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface Profile {
  id: number;
  name: string;
  image: string;
  location: string;
  distance: string;
  specialties: string[];
  isPremium: boolean;
  availability: string;
  serviceType: string;
}

const mockProfiles: Profile[] = [
  {
    id: 1,
    name: "Lady Victoria",
    image: "/profiles/profile1.jpg",
    location: "São Paulo, SP - Jardins",
    distance: "3.2 km",
    specialties: ["Dominação", "Fetiche", "BDSM"],
    isPremium: true,
    availability: "Disponível",
    serviceType: "Local próprio",
  },
  {
    id: 2,
    name: "Mistress Luna",
    image: "/profiles/profile2.jpg",
    location: "São Paulo, SP - Moema",
    distance: "5.8 km",
    specialties: ["Roleplay", "Bondage", "Submissão"],
    isPremium: true,
    availability: "Disponível",
    serviceType: "Hotel",
  },
  {
    id: 3,
    name: "Dominatrix Scarlett",
    image: "/profiles/profile3.jpg",
    location: "Campinas, SP - Centro",
    distance: "12 km",
    specialties: ["Trampling", "Worship", "Humilhação"],
    isPremium: false,
    availability: "Agenda lotada",
    serviceType: "Domicílio",
  },
  {
    id: 4,
    name: "Queen Isabella",
    image: "/profiles/profile4.jpg",
    location: "Rio de Janeiro, RJ - Copacabana",
    distance: "8.5 km",
    specialties: ["Humilhação", "CBT", "Worship"],
    isPremium: true,
    availability: "Disponível",
    serviceType: "Local próprio",
  },
  {
    id: 5,
    name: "Empress Noir",
    image: "/profiles/profile1.jpg",
    location: "São Paulo, SP - Pinheiros",
    distance: "4.1 km",
    specialties: ["Dominação", "Fetiche"],
    isPremium: false,
    availability: "Disponível",
    serviceType: "Hotel",
  },
  {
    id: 6,
    name: "Lady Crimson",
    image: "/profiles/profile2.jpg",
    location: "São Paulo, SP - Vila Madalena",
    distance: "6.3 km",
    specialties: ["BDSM", "Roleplay", "Bondage"],
    isPremium: true,
    availability: "Disponível",
    serviceType: "Local próprio",
  },
];

const distanceOptions = ["5 km", "10 km", "20 km", "50 km"];
const specialtyOptions = ["Dominação", "BDSM", "Fetiche", "Bondage", "Roleplay", "Humilhação", "Worship", "Trampling"];
const serviceTypeOptions = ["Local próprio", "Hotel", "Domicílio"];

const Explorar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistance, setSelectedDistance] = useState("20 km");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedServiceType, setSelectedServiceType] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [premiumOnly, setPremiumOnly] = useState(false);

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    );
  };

  const toggleServiceType = (type: string) => {
    setSelectedServiceType((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const filteredProfiles = mockProfiles.filter((profile) => {
    if (premiumOnly && !profile.isPremium) return false;
    if (selectedSpecialties.length > 0) {
      const hasSpecialty = selectedSpecialties.some((s) =>
        profile.specialties.includes(s)
      );
      if (!hasSpecialty) return false;
    }
    if (selectedServiceType.length > 0) {
      if (!selectedServiceType.includes(profile.serviceType)) return false;
    }
    return true;
  });

  // Sort: Premium first
  const sortedProfiles = [...filteredProfiles].sort((a, b) => {
    if (a.isPremium && !b.isPremium) return -1;
    if (!a.isPremium && b.isPremium) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Search Header */}
        <div className="glass-dark border-b border-border sticky top-20 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Input */}
              <div className="relative flex-1 w-full">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold" />
                <input
                  type="text"
                  placeholder="Digite sua cidade ou bairro..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                />
              </div>

              {/* Distance Filter */}
              <div className="flex gap-2 items-center">
                <span className="text-sm text-muted-foreground whitespace-nowrap">Raio:</span>
                <div className="flex gap-1">
                  {distanceOptions.map((dist) => (
                    <button
                      key={dist}
                      onClick={() => setSelectedDistance(dist)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedDistance === dist
                          ? "bg-gradient-gold text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {dist}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter Toggle */}
              <Button
                variant={showFilters ? "gold" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="w-4 h-4" />
                Filtros
                {(selectedSpecialties.length > 0 || selectedServiceType.length > 0) && (
                  <span className="w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center">
                    {selectedSpecialties.length + selectedServiceType.length}
                  </span>
                )}
              </Button>

              {/* Premium Toggle */}
              <button
                onClick={() => setPremiumOnly(!premiumOnly)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  premiumOnly
                    ? "bg-gradient-gold text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                <Crown className="w-4 h-4" />
                Premium
              </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-4 mt-4 border-t border-border"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Specialties */}
                  <div>
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      Especialidades
                      {selectedSpecialties.length > 0 && (
                        <button
                          onClick={() => setSelectedSpecialties([])}
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          Limpar
                        </button>
                      )}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {specialtyOptions.map((specialty) => (
                        <button
                          key={specialty}
                          onClick={() => toggleSpecialty(specialty)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                            selectedSpecialties.includes(specialty)
                              ? "bg-gold text-primary-foreground"
                              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          }`}
                        >
                          {specialty}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Service Type */}
                  <div>
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      Tipo de Atendimento
                      {selectedServiceType.length > 0 && (
                        <button
                          onClick={() => setSelectedServiceType([])}
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          Limpar
                        </button>
                      )}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {serviceTypeOptions.map((type) => (
                        <button
                          key={type}
                          onClick={() => toggleServiceType(type)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                            selectedServiceType.includes(type)
                              ? "bg-gold text-primary-foreground"
                              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Map Placeholder */}
            <div className="lg:w-1/2 xl:w-3/5">
              <div className="sticky top-44 rounded-2xl overflow-hidden border border-border bg-card aspect-[4/3] lg:aspect-auto lg:h-[calc(100vh-12rem)]">
                <div className="w-full h-full bg-secondary flex items-center justify-center">
                  <div className="text-center p-8">
                    <MapPin className="w-16 h-16 text-gold mx-auto mb-4" />
                    <h3 className="font-display text-xl font-semibold mb-2">
                      Mapa Interativo
                    </h3>
                    <p className="text-muted-foreground text-sm max-w-sm">
                      O mapa será exibido aqui com a localização das dominatrixes
                      após a integração com Google Maps API
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profiles List */}
            <div className="lg:w-1/2 xl:w-2/5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-bold">
                  {sortedProfiles.length} perfis encontrados
                </h2>
                <span className="text-sm text-muted-foreground">
                  Raio de {selectedDistance}
                </span>
              </div>

              <div className="space-y-4">
                {sortedProfiles.map((profile, index) => (
                  <Link key={profile.id} to={`/profile/${profile.id}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`group p-4 rounded-xl bg-gradient-card border transition-all hover:border-primary/50 cursor-pointer mb-4 ${
                        profile.isPremium ? "border-primary/30" : "border-border"
                      }`}
                    >
                      <div className="flex gap-4">
                        {/* Image */}
                        <div className="relative w-24 h-32 rounded-lg overflow-hidden shrink-0">
                          <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                              backgroundImage: `url(${profile.image})`,
                              backgroundColor: "hsl(var(--muted))",
                            }}
                          />
                          {profile.isPremium && (
                            <div className="absolute top-2 left-2">
                              <Crown className="w-4 h-4 text-primary" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-display text-lg font-semibold truncate group-hover:text-primary transition-colors">
                              {profile.name}
                            </h3>
                          </div>

                          <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {profile.location} • {profile.distance}
                          </p>

                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {profile.specialties.slice(0, 3).map((specialty) => (
                              <span
                                key={specialty}
                                className="px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs font-medium ${
                                  profile.availability === "Disponível"
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {profile.availability}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                • {profile.serviceType}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 mt-3">
                            <Button variant="neon" size="sm" className="flex-1 gap-1.5">
                              <MessageCircle className="w-4 h-4" />
                              WhatsApp
                            </Button>
                            <Button variant="glass" size="sm" className="gap-1.5">
                              <Navigation className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>

              {sortedProfiles.length === 0 && (
                <div className="text-center py-16">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display text-xl font-semibold mb-2">
                    Nenhum perfil encontrado
                  </h3>
                  <p className="text-muted-foreground">
                    Tente ajustar os filtros ou ampliar o raio de busca
                  </p>
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
