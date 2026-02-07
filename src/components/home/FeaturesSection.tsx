import { motion } from "framer-motion";
import { Shield, MapPin, Wallet, Crown, Lock, Zap } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Verificação Rigorosa",
    description:
      "Todos os perfis passam por verificação de identidade com selfie e documento oficial.",
  },
  {
    icon: MapPin,
    title: "Geolocalização Precisa",
    description:
      "Encontre profissionais próximas com mapa interativo e filtros avançados de busca.",
  },
  {
    icon: Wallet,
    title: "Múltiplos Pagamentos",
    description:
      "Aceite pagamentos via PIX, cartão de crédito e criptomoedas (BRZ, BTC, ETH).",
  },
  {
    icon: Crown,
    title: "Plano Premium",
    description:
      "Destaque seu perfil, apareça primeiro nas buscas e ganhe mais visibilidade.",
  },
  {
    icon: Lock,
    title: "Privacidade Total",
    description:
      "Seus dados pessoais são criptografados e nunca expostos publicamente.",
  },
  {
    icon: Zap,
    title: "Contato Direto",
    description:
      "Links diretos para WhatsApp e Waze para navegação instantânea até você.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-crimson/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Por que escolher o{" "}
            <span className="text-gradient-gold">Dominatrix BR</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A plataforma mais completa e segura para profissionais dominatrixes
            no Brasil
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-8 rounded-2xl bg-gradient-card border border-border hover:border-gold/30 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center mb-6 group-hover:shadow-gold transition-shadow duration-300">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3 group-hover:text-gold transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
