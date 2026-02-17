"use client";

import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, ShieldCheck, CreditCard, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        a: "Sim, a navegação e a busca por perfis são totalmente gratuitas. Você só paga pelos serviços diretamente às profissionais."
      }
    ]
  },
  {
    category: "Segurança",
    icon: ShieldCheck,
    questions: [
      {
        q: "Como os perfis são verificados?",
        a: "Todas as profissionais passam por um processo rigoroso de verificação de identidade, incluindo o envio de documentos oficiais e selfies para garantir a autenticidade."
      },
      {
        q: "Meus dados estão seguros?",
        a: "Sim, utilizamos criptografia de ponta a ponta e seguimos as diretrizes da LGPD para garantir sua total privacidade."
      }
    ]
  },
  {
    category: "Pagamentos",
    icon: CreditCard,
    questions: [
      {
        q: "Quais formas de pagamento são aceitas?",
        a: "Aceitamos PIX, cartões de crédito e criptomoedas. O pagamento é combinado diretamente com a profissional escolhida."
      }
    ]
  }
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-4xl md:text-6xl font-bold mb-4"
            >
              Perguntas <span className="text-gradient-gold">Frequentes</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              Tudo o que você precisa saber sobre o funcionamento da nossa plataforma.
            </motion.p>
          </div>

          {/* FAQ Content */}
          <div className="max-w-3xl mx-auto space-y-12">
            {faqs.map((section, idx) => (
              <div key={section.category} className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold font-display">{section.category}</h2>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-4">
                  {section.questions.map((item, i) => (
                    <AccordionItem 
                      key={i} 
                      value={`item-${idx}-${i}`}
                      className="glass-dark border border-border rounded-xl px-6"
                    >
                      <AccordionTrigger className="text-left hover:no-underline py-4 font-medium">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          {/* Support CTA */}
          <div className="mt-20 p-8 rounded-3xl bg-gradient-card border border-primary/20 text-center max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-2">Ainda tem dúvidas?</h3>
            <p className="text-muted-foreground mb-6">
              Nossa equipe de suporte está pronta para ajudar você.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="neon" asChild>
                <a href="/contato">Falar com Suporte</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://wa.me/5513955517904" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp Direto
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;