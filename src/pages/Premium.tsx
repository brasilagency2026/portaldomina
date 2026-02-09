import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Crown, Check, Sparkles, Zap, Eye, MapPin, Image, Video, BarChart3, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const premiumFeatures = [
  { icon: MapPin, title: "Destaque no Mapa", desc: "Apareça em destaque no mapa interativo num raio de 20km da sua localização." },
  { icon: Zap, title: "Prioridade nas Buscas", desc: "Seu perfil aparece sempre no topo dos resultados de busca." },
  { icon: Image, title: "Galeria Ilimitada", desc: "Publique quantas fotos quiser no seu perfil profissional." },
  { icon: Video, title: "Até 3 Vídeos", desc: "Adicione até 3 vídeos de 2 minutos cada para mostrar seu trabalho." },
  { icon: BarChart3, title: "Estatísticas", desc: "Acompanhe visualizações, cliques e interações com seu perfil." },
  { icon: Bell, title: "Notificações", desc: "Receba alertas em tempo real quando alguém visualizar seu perfil." },
  { icon: Eye, title: "Endereço Completo", desc: "Exiba seu endereço completo com integração Google Maps." },
  { icon: Crown, title: "Badge Verificado", desc: "Selo Premium exclusivo que transmite confiança e profissionalismo." },
];

const comparison = [
  { feature: "Perfil básico", free: true, premium: true },
  { feature: "Até 5 fotos", free: true, premium: false, premiumLabel: "Ilimitadas" },
  { feature: "Bio de até 500 caracteres", free: true, premium: true },
  { feature: "Botão WhatsApp", free: true, premium: true },
  { feature: "Botão Waze", free: true, premium: true },
  { feature: "Carteiras de pagamento", free: true, premium: true },
  { feature: "Galeria ilimitada", free: false, premium: true },
  { feature: "Até 3 vídeos", free: false, premium: true },
  { feature: "Destaque no mapa (20km)", free: false, premium: true },
  { feature: "Prioridade nas buscas", free: false, premium: true },
  { feature: "Endereço completo + Maps", free: false, premium: true },
  { feature: "Badge Premium", free: false, premium: true },
  { feature: "Estatísticas", free: false, premium: true },
  { feature: "Notificações", free: false, premium: true },
];

const Premium = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-primary/30 text-sm text-primary mb-6">
                <Sparkles className="w-4 h-4" />
                Plano Premium
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
                Maximize sua <span className="text-gradient-gold">Visibilidade</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                Destaque-se da concorrência com recursos exclusivos que aumentam suas visualizações e clientes.
              </p>
              <div className="flex items-baseline justify-center gap-2 mb-8">
                <span className="text-5xl md:text-6xl font-bold text-gradient-gold">R$ 49,90</span>
                <span className="text-xl text-muted-foreground">/mês</span>
              </div>
              <Button variant="gold" size="xl" className="gap-2">
                <Crown className="w-5 h-5" />
                Assinar Premium
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-4xl font-bold text-center mb-16"
            >
              Recursos <span className="text-gradient-gold">Exclusivos</span>
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {premiumFeatures.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="p-6 rounded-2xl bg-gradient-card border border-border hover:border-primary/30 transition-all group text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:shadow-neon transition-shadow">
                    <f.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-4xl font-bold text-center mb-16"
            >
              Gratuito vs <span className="text-gradient-gold">Premium</span>
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto rounded-2xl bg-gradient-card border border-border overflow-hidden"
            >
              <div className="grid grid-cols-3 gap-0 text-center border-b border-border p-4 bg-card">
                <div className="text-left font-semibold">Recurso</div>
                <div className="font-semibold text-muted-foreground">Gratuito</div>
                <div className="font-semibold text-primary">Premium</div>
              </div>
              {comparison.map((row) => (
                <div key={row.feature} className="grid grid-cols-3 gap-0 text-center border-b border-border/50 p-4 hover:bg-card/50 transition-colors">
                  <div className="text-left text-sm text-muted-foreground">{row.feature}</div>
                  <div>
                    {row.free ? (
                      <Check className="w-5 h-5 text-muted-foreground mx-auto" />
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </div>
                  <div>
                    {row.premium ? (
                      <Check className="w-5 h-5 text-primary mx-auto" />
                    ) : row.premiumLabel ? (
                      <span className="text-sm font-semibold text-primary">{row.premiumLabel}</span>
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>

            <div className="text-center mt-12">
              <Button variant="gold" size="xl" className="gap-2">
                <Crown className="w-5 h-5" />
                Assinar Premium — R$ 49,90/mês
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Cancele a qualquer momento • Sem fidelidade
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Premium;
