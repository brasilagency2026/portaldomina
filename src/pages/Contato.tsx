import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin, Building, Facebook, Instagram, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const contactInfo = [
  {
    icon: Building,
    label: "CNPJ",
    value: "64.465.357/0001-28",
  },
  {
    icon: Mail,
    label: "E-mail",
    value: "portaldomina@bdsmbrazil.com.br",
    href: "mailto:portaldomina@bdsmbrazil.com.br",
  },
  {
    icon: Phone,
    label: "WhatsApp",
    value: "(13) 95551-7904",
    href: "https://wa.me/5513955517904",
    buttonLabel: "Chamar no WhatsApp",
  },
];

const socialLinks = [
  {
    icon: Instagram,
    label: "Instagram",
    value: "@bd.smbrazil",
    href: "https://www.instagram.com/bd.smbrazil/",
  },
  {
    icon: Facebook,
    label: "Facebook",
    value: "eros.domina.5",
    href: "https://www.facebook.com/eros.domina.5",
  },
];

const Contato = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Entre em <span className="text-gradient-gold">Contato</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Estamos disponíveis para esclarecer dúvidas, ouvir sugestões e ajudar
            você em tudo que precisar.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="grid gap-6">
            {contactInfo.map((item) => (
              <div
                key={item.label}
                className="glass-dark rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="text-lg font-semibold">{item.value}</p>
                </div>
                {item.href && (
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      {item.buttonLabel || item.label}
                    </Button>
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Social */}
          <h2 className="font-display text-2xl font-bold mt-16 mb-6 text-center">
            Redes <span className="text-gradient-gold">Sociais</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-dark rounded-xl p-6 flex items-center gap-4 hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="font-semibold">{item.value}</p>
                </div>
              </a>
            ))}
          </div>

          {/* WhatsApp CTA */}
          <div className="mt-16 text-center">
            <a href="https://wa.me/5513955517904" target="_blank" rel="noopener noreferrer">
              <Button variant="neon" size="xl" className="gap-3">
                <MessageCircle className="w-5 h-5" />
                Fale Conosco pelo WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contato;