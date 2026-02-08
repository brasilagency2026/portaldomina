import { motion } from "framer-motion";
import { Crown, MapPin, MessageCircle, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Profile {
  id: number;
  name: string;
  image: string;
  location: string;
  distance: string;
  specialties: string[];
  isPremium: boolean;
}

const mockProfiles: Profile[] = [
  {
    id: 1,
    name: "Lady Victoria",
    image: "/profiles/profile1.jpg",
    location: "São Paulo, SP",
    distance: "3.2 km",
    specialties: ["Dominação", "Fetiche", "BDSM"],
    isPremium: true,
  },
  {
    id: 2,
    name: "Mistress Luna",
    image: "/profiles/profile2.jpg",
    location: "São Paulo, SP",
    distance: "5.8 km",
    specialties: ["Roleplay", "Bondage"],
    isPremium: true,
  },
  {
    id: 3,
    name: "Dominatrix Scarlett",
    image: "/profiles/profile3.jpg",
    location: "Campinas, SP",
    distance: "12 km",
    specialties: ["Trampling", "Worship"],
    isPremium: false,
  },
  {
    id: 4,
    name: "Queen Isabella",
    image: "/profiles/profile4.jpg",
    location: "Rio de Janeiro, RJ",
    distance: "8.5 km",
    specialties: ["Humilhação", "CBT"],
    isPremium: true,
  },
];

const ProfileCard = ({ profile, index }: { profile: Profile; index: number }) => {
  return (
    <Link to={`/profile/${profile.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className={`group relative rounded-2xl overflow-hidden cursor-pointer ${
          profile.isPremium ? "premium-glow" : ""
        }`}
      >
        {/* Card Background */}
        <div className="bg-gradient-card border border-border rounded-2xl overflow-hidden transition-all group-hover:border-primary/50">
          {/* Image Container */}
          <div className="relative aspect-[3/4] overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{
                backgroundImage: `url(${profile.image})`,
                backgroundColor: "hsl(var(--muted))",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

            {/* Premium Badge */}
            {profile.isPremium && (
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-neon text-primary-foreground text-xs font-semibold neon-glow">
                <Crown className="w-3.5 h-3.5" />
                Premium
              </div>
            )}

            {/* Distance Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-dark text-xs font-medium">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              {profile.distance}
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="font-display text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
              {profile.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {profile.location}
            </p>

            {/* Specialties */}
            <div className="flex flex-wrap gap-2 mb-5">
              {profile.specialties.slice(0, 3).map((specialty) => (
                <span
                  key={specialty}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                >
                  {specialty}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="neon" size="sm" className="flex-1 gap-1.5">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </Button>
              <Button variant="glass" size="sm" className="gap-1.5">
                <Navigation className="w-4 h-4" />
                Waze
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

const FeaturedProfiles = () => {
  return (
    <section className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-gold/30 text-sm text-gold mb-6">
            <Crown className="w-4 h-4" />
            Destaques Premium
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Profissionais em <span className="text-gradient-gold">Destaque</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Conheça as dominatrixes mais requisitadas da sua região
          </p>
        </motion.div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockProfiles.map((profile, index) => (
            <ProfileCard key={profile.id} profile={profile} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button variant="outline" size="lg" className="gap-2">
            Ver todos os perfis
            <MapPin className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProfiles;
