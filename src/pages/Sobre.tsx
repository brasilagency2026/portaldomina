import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { ShoppingBag, Bed, Bot, MessageSquare, MapPin, Shield, Users, ExternalLink } from "lucide-react";

const services = [
  {
    icon: ShoppingBag,
    title: "Loja Online",
    description: "Boutique completa com mais de 1500 acessórios BDSM e entrega em todo Brasil.",
    link: "https://bdsmbrazil.com.br/loja",
    linkLabel: "Visitar Loja",
  },
  {
    icon: Bed,
    title: "Portal dos Motéis BDSM",
    description: "Encontre motéis com suítes temáticas BDSM verificadas em todo o Brasil.",
    link: "https://moteis-bdsm.bdsmbrazil.com.br",
    linkLabel: "Ver Motéis",
  },
  {
    icon: Bot,
    title: "Domina Virtual AI",
    description: "Converse com nossa inteligência artificial dominatrix sem censura.",
    link: "https://dominavirtual.bdsmbrazil.com.br",
    linkLabel: "Experimentar",
  },
  {
    icon: MessageSquare,
    title: "Anúncios Anônimos",
    description: "Serviço de classificados anônimos via aplicativo Session para total privacidade.",
    link: "https://anuncios-bdsm.bdsmbrazil.com.br",
    linkLabel: "Saiba Mais",
  },
];

const Sobre = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
                Sobre o <span className="text-gradient-gold">BDSMBRAZIL</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                O maior ecossistema BDSM do Brasil — conectando profissionais, entusiastas e serviços com segurança, privacidade e tecnologia.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { icon: Shield, title: "Segurança", desc: "Verificação rigorosa de identidade e criptografia de ponta a ponta para proteger seus dados." },
                { icon: Users, title: "Comunidade", desc: "Um espaço seguro e inclusivo para profissionais e entusiastas do universo BDSM." },
                { icon: MapPin, title: "Alcance Nacional", desc: "Presença em todas as capitais e principais cidades do Brasil com geolocalização precisa." },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-2xl bg-gradient-card border border-border text-center"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center mx-auto mb-6">
                    <item.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Nossos Serviços */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Nossos <span className="text-gradient-gold">Serviços</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl bg-gradient-card border border-border hover:border-primary/30 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                      <service.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold mb-2">{service.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3">{service.description}</p>
                      <a
                        href={service.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                      >
                        {service.linkLabel}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Sobre;