import { motion } from "framer-motion";
import { Check, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    period: "/mês",
    description: "Perfeito para começar",
    features: [
      "Perfil básico",
      "Até 5 fotos",
      "Bio de até 500 caracteres",
      "Endereço aproximado (cidade/bairro)",
      "Botão WhatsApp",
      "Botão Waze",
      "Carteiras de pagamento",
    ],
    cta: "Criar Conta Grátis",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Premium",
    price: "R$ 49,90",
    period: "/mês",
    description: "Máxima visibilidade",
    features: [
      "Tudo do plano Gratuito",
      "Galeria de até 20 fotos",
      "Até 2 vídeos (2 min cada)",
      "Destaque no mapa (raio 20km)",
      "Prioridade nas buscas",
      "Endereço completo com Google Maps",
      "Badge Premium verificado",
      "Estatísticas de visualizações",
      "Notificações de visualizações",
    ],
    cta: "Assinar Premium",
    variant: "gold" as const,
    popular: true,
  },
];

const PricingSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-card/50 via-background to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-gold/30 text-sm text-gold mb-6">
            <Sparkles className="w-4 h-4" />
            Planos e Preços
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Escolha seu <span className="text-gradient-gold">Plano</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comece gratuitamente e faça upgrade quando quiser mais visibilidade
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative p-8 rounded-2xl ${
                plan.popular
                  ? "premium-glow bg-gradient-card border-2 border-gold/50"
                  : "bg-gradient-card border border-border"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-gold text-primary-foreground text-sm font-semibold">
                  <Crown className="w-4 h-4" />
                  Mais Popular
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="font-display text-2xl font-bold mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className={`text-4xl font-bold ${plan.popular ? "text-gradient-gold" : ""}`}>
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-muted-foreground mt-2">{plan.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      plan.popular ? "bg-gold/20" : "bg-secondary"
                    }`}>
                      <Check className={`w-3 h-3 ${plan.popular ? "text-gold" : "text-foreground"}`} />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                variant={plan.variant}
                size="lg"
                className="w-full"
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground text-sm mb-4">
            Formas de pagamento aceitas:
          </p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {["PIX", "Cartão de Crédito", "BRZ (Chainless)", "Bitcoin", "Ethereum"].map((method) => (
              <span
                key={method}
                className="px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium"
              >
                {method}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;