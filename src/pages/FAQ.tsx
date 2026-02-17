"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, ShieldCheck, CreditCard, UserCheck } from "lucide-react";

const faqs = [
  {
    category: "Geral",
    icon: HelpCircle,
    questions: [
      {
        q: "O que é o BDSMBRAZIL?",
        a: "O BDSMBRAZIL é a maior plataforma brasileira dedicada a conectar profissionais dominatrixes e entusiastas do universo BDSM de forma segura, discreta e profissional."
      },
      {
        q: "O site é gratuito para usuários?",
        a: "Sim, a navegação e a busca por perfis são totalmente gratuitas. Você só paga pelos serviços diretamente às profissionais ou se desejar adquirir um plano premium como profissional."
      }
    ]
  },
  {
    category: "Segurança",
    icon: ShieldCheck,
    questions: [
      {
        q: "Como os perfis são verificados?",
        a: "Todas as profissionais passam por um processo rigoroso de verificação de identidade, incluindo o envio de documentos oficiais e selfies em tempo real para garantir a autenticidade do perfil."
      },
      {
        q: "Meus dados estão seguros?",
        a: "Sim, utilizamos criptografia de ponta a ponta e seguimos as diretrizes da LGPD para garantir que suas informações pessoais nunca sejam expostas ou compartilhadas com terceiros."
      }
    ]
  },
  {
    category: "Pagamentos",
    icon: CreditCard,
    questions: [
      {
        q: "Quais formas de pagamento são aceitas?",
        a: "Aceitamos PIX, cartões de crédito e as principais criptomoedas (Bitcoin, Ethereum e BRZ). O pagamento dos serviços é combinado diretamente com a profissional."
      },
      {
        q: "Como funciona o reembolso?",
        a: "Para assinaturas Premium, o cancelamento pode ser feito a qualquer momento. Para serviços contratados com profissionais, as políticas de cancelamento e reembolso devem ser acordadas diretamente com elas."
      }
    ]
  }
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
              Perguntas <span className="text-gradient-gold">Frequentes</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Tudo o que você precisa saber sobre o funcionamento da nossa plataforma.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-12">
            {faqs.map((section, idx) => (
              <motion.div 
                key={section.category}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold font-display">{section.category}</h2>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-4">
                  {section.questions.map((item, i) => (
                    <AccordionItem 
                      key={i} 
                      value={`${idx}-${i}`}
                      className="glass-dark border border-border rounded-xl px-6 overflow-hidden"
                    >
                      <AccordionTrigger className="text-left hover:no-underline hover:text-primary transition-colors py-4">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>

          {/* CTA Support */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-20 p-8 rounded-3xl bg-gradient-card border border-primary/20 text-center max-w-2xl mx-auto"
          >
            <h3 className="text-xl font-bold mb-2">Ainda tem dúvidas?</h3>
            <p className="text-muted-foreground mb-6">
              Nossa equipe de suporte está pronta para ajudar você 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="neon" asChild>
                <a href="/contato">Falar com Suporte</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://wa.me/5513955517904">WhatsApp Direto</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;