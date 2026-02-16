import { motion } from "framer-motion";
import { ShoppingBag, Bed, Bot, ExternalLink, Globe } from "lucide-react";

const ecosystem = [
  {
    title: "Loja Online",
    desc: "Mais de 1500 acessórios BDSM com entrega discreta em todo o Brasil.",
    link: "https://bdsmbrazil.com.br/loja",
    icon: ShoppingBag,
    color: "text-blue-400",
  },
  {
    title: "Portal de Motéis BDSM",
    desc: "Encontre motéis com suítes temáticas BDSM verificadas em todo o país.",
    link: "https://moteis-bdsm.bdsmbrazil.com.br",
    icon: Bed,
    color: "text-purple-400",
  },
  {
    title: "Domina Virtual AI",
    desc: "Nossa inteligência artificial sem censura para experiências virtuais únicas.",
    link: "https://dominavirtual.bdsmbrazil.com.br",
    icon: Bot,
    color: "text-pink-400",
  },
];

const EcosystemSection = () => {
  return (
    <section className="py-20 relative overflow-hidden border-t border-border/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            <Globe className="w-3 h-3" />
            Grupo BDSMBRAZIL
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Faça parte de um <span className="text-gradient-gold">Ecossistema Completo</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            O Portal Dominas é integrado à maior rede BDSM do Brasil, oferecendo visibilidade cruzada e recursos tecnológicos exclusivos.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {ecosystem.map((item, index) => (
            <motion.a
              key={item.title}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-6 rounded-2xl bg-card/50 border border-border hover:border-primary/30 transition-all hover:shadow-premium"
            >
              <div className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                {item.title}
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EcosystemSection;