import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Crown,
  MessageCircle,
  Shield,
  Filter,
  Eye,
  Navigation,
  CheckCircle,
  Star,
  Zap,
  Users,
  ArrowRight,
  SlidersHorizontal,
  Map,
  UserCheck,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Acesse a página Explorar",
    description:
      "Clique em \"Explorar\" no menu principal para acessar o diretório completo de profissionais verificadas. Você verá o mapa interativo e a lista de perfis lado a lado.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
  },
  {
    number: "02",
    icon: SlidersHorizontal,
    title: "Use os filtros de busca",
    description:
      "Filtre por cidade, bairro, serviços específicos ou escolha ver apenas perfis Premium. Os resultados atualizam em tempo real no mapa e na lista.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
  },
  {
    number: "03",
    icon: Eye,
    title: "Explore os perfis",
    description:
      "Clique em qualquer perfil para ver a galeria de fotos, bio completa, serviços oferecidos e localização. Perfis Premium têm mais fotos e informações detalhadas.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  {
    number: "04",
    icon: MessageCircle,
    title: "Entre em contato",
    description:
      "Clique no botão WhatsApp para iniciar uma conversa direta com a profissional. Simples, rápido e discreto — sem intermediários.",
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20",
  },
];

const filterFeatures = [
  {
    icon: MapPin,
    title: "Busca por Localização",
    description:
      "Digite sua cidade, bairro ou região no campo de busca. O mapa e a lista filtram automaticamente as profissionais mais próximas de você.",
  },
  {
    icon: Filter,
    title: "Filtro por Serviços",
    description:
      "Clique em \"Serviços\" para abrir o painel de filtros. Selecione um ou mais serviços específicos e veja apenas as profissionais que os oferecem.",
  },
  {
    icon: Crown,
    title: "Filtro Premium",
    description:
      "Ative o botão \"Premium\" para ver apenas perfis com assinatura ativa — os mais completos, com mais fotos, vídeos e informações detalhadas.",
  },
  {
    icon: Map,
    title: "Mapa Interativo",
    description:
      "Clique nos marcadores do mapa para ver um resumo do perfil. Marcadores dourados indicam profissionais Premium, roxos indicam perfis verificados.",
  },
];

const premiumBenefits = [
  { icon: Star, text: "Aparecem primeiro nos resultados de busca" },
  { icon: MapPin, text: "Destaque no mapa interativo com marcador dourado" },
  { icon: Crown, text: "Badge Premium visível no perfil e nas listagens" },
  { icon: Eye, text: "Galeria com até 20 fotos profissionais" },
  { icon: Zap, text: "Estatísticas de visualizações em tempo real" },
  { icon: Shield, text: "Verificação prioritária pela equipe BDSMBRAZIL" },
];

const contactSteps = [
  {
    step: "1",
    title: "Encontre o perfil",
    desc: "Navegue pela lista ou mapa e clique no perfil que te interessou.",
  },
  {
    step: "2",
    title: "Clique em WhatsApp",
    desc: "No perfil completo, clique no botão verde \"WhatsApp\" para abrir uma conversa direta.",
  },
  {
    step: "3",
    title: "Conversa direta",
    desc: "Você é redirecionado para o WhatsApp da profissional. Sem intermediários, sem taxas.",
  },
  {
    step: "4",
    title: "Navegue até lá",
    desc: "Use o botão \"Waze\" para obter rotas diretas até a localização da profissional.",
  },
];

const faqs = [
  {
    q: "O site é gratuito para quem busca?",
    a: "Sim, 100%. Navegar, buscar e entrar em contato com as profissionais é completamente gratuito para os visitantes.",
  },
  {
    q: "Como sei que os perfis são reais?",
    a: "Todos os perfis passam por verificação de identidade com documento oficial e selfie antes de serem publicados. O badge \"Verificado\" confirma essa validação.",
  },
  {
    q: "Meus dados ficam seguros?",
    a: "Sim. Não armazenamos dados de visitantes. O contato é feito diretamente via WhatsApp, sem passar pelos nossos servidores.",
  },
  {
    q: "O que diferencia um perfil Premium?",
    a: "Perfis Premium aparecem primeiro nas buscas, têm mais fotos, vídeos, endereço completo com Google Maps e um badge dourado de destaque.",
  },
];

const ComoFunciona = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-primary/30 text-sm text-primary mb-6">
                <Users className="w-4 h-4" />
                Guia Completo
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
                Como <span className="text-gradient-gold">Funciona</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Tudo o que você precisa saber para navegar, encontrar e entrar em contato com as melhores profissionais do Brasil.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Passo a passo */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Em <span className="text-gradient-gold">4 passos simples</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Encontre a profissional ideal em menos de 2 minutos.
              </p>
            </motion.div>

            <div className="relative max-w-5xl mx-auto">
              {/* Linha conectora desktop */}
              <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-400/30 via-primary/50 to-green-400/30" />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative text-center"
                  >
                    <div className={`w-16 h-16 rounded-2xl ${step.bg} border ${step.border} flex items-center justify-center mx-auto mb-4 relative z-10`}>
                      <step.icon className={`w-8 h-8 ${step.color}`} />
                    </div>
                    <div className={`text-xs font-bold uppercase tracking-widest ${step.color} mb-2`}>
                      Passo {step.number}
                    </div>
                    <h3 className="font-display text-lg font-bold mb-3">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Filtros de busca */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-card/30 to-background" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-400/10 border border-purple-400/20 text-purple-400 text-xs font-bold uppercase tracking-wider mb-6">
                  <SlidersHorizontal className="w-3 h-3" />
                  Filtros Avançados
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                  Encontre exatamente o que <span className="text-gradient-gold">você procura</span>
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Nossa barra de busca e filtros avançados permitem que você refine os resultados por localização, tipo de serviço e nível de perfil — tudo em tempo real.
                </p>
                <Button variant="gold" asChild className="gap-2">
                  <Link to="/explorar">
                    Explorar Agora <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {filterFeatures.map((f, i) => (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="p-5 rounded-2xl bg-gradient-card border border-border hover:border-primary/30 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                      <f.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-sm mb-1">{f.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Perfis Verificados & Premium */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
              {/* Verificados */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 rounded-3xl bg-gradient-card border border-border"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold">Perfis Verificados</h3>
                    <p className="text-xs text-green-400 font-medium">Badge de Autenticidade</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Cada profissional passa por um processo rigoroso de verificação antes de aparecer na plataforma. Isso garante que você está interagindo com pessoas reais e profissionais.
                </p>
                <div className="space-y-3">
                  {[
                    "Envio de documento oficial com foto",
                    "Selfie de verificação ao vivo",
                    "Análise manual pela equipe BDSMBRAZIL",
                    "Aprovação em até 48 horas",
                    "Badge verde de verificado no perfil",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Premium */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-8 rounded-3xl bg-gradient-card border-2 border-primary/30 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Crown className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold">Perfis Premium</h3>
                    <p className="text-xs text-primary font-medium">Máxima Visibilidade</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed relative z-10">
                  Profissionais com assinatura Premium investem na qualidade da sua presença online. Elas aparecem primeiro, têm mais conteúdo e oferecem uma experiência mais completa.
                </p>
                <div className="space-y-3 relative z-10">
                  {premiumBenefits.map((b) => (
                    <div key={b.text} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <b.icon className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">{b.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contato via WhatsApp */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 via-background to-background" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider mb-6">
                <Phone className="w-3 h-3" />
                Contato Direto
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Contato via <span className="text-gradient-gold">WhatsApp & Waze</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Sem formulários, sem espera. O contato é direto, discreto e instantâneo.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
              {contactSteps.map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center p-6 rounded-2xl bg-gradient-card border border-border"
                >
                  <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-4 text-green-400 font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Boutons démo */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-green-500/10 border border-green-500/20">
                <MessageCircle className="w-8 h-8 text-green-400" />
                <div className="text-left">
                  <p className="font-bold text-green-400">Botão WhatsApp</p>
                  <p className="text-xs text-muted-foreground">Abre conversa direta no app</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                <Navigation className="w-8 h-8 text-blue-400" />
                <div className="text-left">
                  <p className="font-bold text-blue-400">Botão Waze</p>
                  <p className="text-xs text-muted-foreground">Rota direta até a profissional</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Dúvidas <span className="text-gradient-gold">Frequentes</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {faqs.map((faq, i) => (
                <motion.div
                  key={faq.q}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="p-6 rounded-2xl bg-gradient-card border border-border"
                >
                  <h3 className="font-bold mb-3 flex items-start gap-2">
                    <span className="text-primary shrink-0 mt-0.5">?</span>
                    {faq.q}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
                Pronto para <span className="text-gradient-gold">explorar</span>?
              </h2>
              <p className="text-muted-foreground text-lg mb-10">
                Centenas de profissionais verificadas esperando por você. Acesso gratuito, sem cadastro necessário.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="gold" size="xl" className="gap-2" asChild>
                  <Link to="/explorar">
                    <Search className="w-5 h-5" />
                    Explorar Agora
                  </Link>
                </Button>
                <Button variant="outline" size="xl" asChild>
                  <Link to="/faq">Ver todas as dúvidas</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ComoFunciona;