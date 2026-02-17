"use client";

import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Crown, Check, UserPlus, Zap, MapPin, Image, Video, BarChart3, Bell, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const premiumFeatures = [
  { icon: MapPin, title: "Destaque no Mapa", desc: "Apareça em destaque no mapa interativo num raio de 20km da sua localização." },
  { icon: Zap, title: "Prioridade nas Buscas", desc: "Seu perfil aparece sempre no topo dos resultados de busca." },
  { icon: Image, title: "Galeria de 20 Fotos", desc: "Publique até 20 fotos no seu perfil profissional." },
  { icon: Video, title: "Até 2 Vídeos", desc: "Adicione vídeos para mostrar seu trabalho e ambiente." },
  { icon: BarChart3, title: "Estatísticas", desc: "Acompanhe visualizações, cliques e interações com seu perfil." },
  { icon: Bell, title: "Notificações", desc: "Receba alertas em tempo real quando alguém visualizar seu perfil." },
  { icon: ShieldCheck, title: "Selo Verificado", desc: "Badge Premium exclusivo que transmite confiança e profissionalismo." },
  { icon: Crown, title: "Suporte Prioritário", desc: "Atendimento exclusivo para profissionais Premium." },
];

const ParaProfissionais = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-primary/30 text-sm text-primary mb-6"
            >
              <UserPlus className="w-4 h-4" />
              Área da Profissional
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-6xl font-bold mb-6"
            >
              Faça parte da maior rede de <br />
              <span className="text-gradient-gold">Dominatrixes do Brasil</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10"
            >
              Oferecemos as melhores ferramentas para você gerenciar sua carreira, 
              aumentar sua visibilidade e conectar-se com clientes qualificados.
            </motion.p>
            <Button variant="gold" size="xl" asChild className="h-14 px-10 text-lg">
              <Link to="/register">Criar Perfil Gratuito</Link>
            </Button>
          </div>

          {/* Free Registration Section */}
          <section className="mb-24">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold font-display mb-6">Como se inscrever <span className="text-primary">Gratuitamente</span></h2>
                <div className="space-y-6">
                  {[
                    { step: "1", title: "Crie sua conta", desc: "Preencha seus dados básicos e escolha seu nome de cena." },
                    { step: "2", title: "Complete seu perfil", desc: "Adicione sua bio, serviços, localização e até 5 fotos." },
                    { step: "3", title: "Verificação", desc: "Nossa equipe analisará seu perfil para garantir a segurança da rede." },
                    { step: "4", title: "Fique Online", desc: "Após aprovada, você já aparecerá nas buscas e no mapa." },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 font-bold text-primary">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass-dark p-8 rounded-3xl border border-border"
              >
                <h3 className="text-xl font-bold mb-4">O que inclui o Plano Grátis:</h3>
                <ul className="space-y-3">
                  {[
                    "Perfil profissional completo",
                    "Até 5 fotos na galeria",
                    "Bio de até 500 caracteres",
                    "Localização aproximada",
                    "Botão direto para WhatsApp",
                    "Botão de navegação Waze",
                    "Listagem em buscas básicas",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </section>

          {/* Premium Benefits Section */}
          <section className="py-20 relative">
            <div className="absolute inset-0 bg-primary/5 rounded-3xl -z-10" />
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Vantagens do <span className="text-gradient-gold">Plano Premium</span></h2>
              <p className="text-muted-foreground">Maximize seus resultados e destaque-se na plataforma.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {premiumFeatures.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <f.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <div className="inline-block p-8 rounded-3xl glass-dark border border-primary/30">
                <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">Investimento Premium</p>
                <div className="flex items-baseline justify-center gap-2 mb-6">
                  <span className="text-5xl font-bold text-gradient-gold">R$ 49,90</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <Button variant="gold" size="lg" asChild className="w-full">
                  <Link to="/register">Assinar Agora</Link>
                </Button>
                <p className="text-xs text-muted-foreground mt-4">Cancele quando quiser • Sem taxas de adesão</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ParaProfissionais;