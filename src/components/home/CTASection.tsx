import { motion } from "framer-motion";
import { Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-background to-crimson/10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-crimson/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-gold mb-8 shadow-gold">
            <Crown className="w-10 h-10 text-primary-foreground" />
          </div>

          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Pronta para{" "}
            <span className="text-gradient-gold">aumentar sua visibilidade</span>?
          </h2>

          <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
            Cadastre-se agora e comece a receber mais clientes através da maior
            plataforma de dominatrixes do Brasil.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="gold" size="xl" className="gap-2 group">
              Criar Meu Perfil
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="xl">
              Saber Mais
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            Cadastro 100% gratuito • Verificação em 24-48h • Sem compromisso
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
