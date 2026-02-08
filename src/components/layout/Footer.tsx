import { Crown, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    plataforma: [
      { label: "Explorar", href: "/explorar" },
      { label: "Premium", href: "/premium" },
      { label: "Como Funciona", href: "/como-funciona" },
      { label: "Para Profissionais", href: "/para-profissionais" },
    ],
    suporte: [
      { label: "Central de Ajuda", href: "/ajuda" },
      { label: "Contato", href: "/contato" },
      { label: "FAQ", href: "/faq" },
      { label: "Denunciar", href: "/denunciar" },
    ],
    legal: [
      { label: "Termos de Uso", href: "/termos" },
      { label: "Política de Privacidade", href: "/privacidade" },
      { label: "LGPD", href: "/lgpd" },
      { label: "Cookies", href: "/cookies" },
    ],
  };

  return (
    <footer className="bg-card border-t border-border">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center">
                <Crown className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display text-2xl font-bold text-gradient-gold">
                BDSMBRAZIL
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              O maior portal brasileiro de profissionais dominatrixes. Conexões
              seguras, perfis verificados e experiências únicas.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-gold hover:bg-secondary/80 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-gold hover:bg-secondary/80 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Plataforma</h4>
            <ul className="space-y-3">
              {footerLinks.plataforma.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Suporte</h4>
            <ul className="space-y-3">
              {footerLinks.suporte.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} BDSMBRAZIL. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Plataforma segura e criptografada
            </div>
          </div>
        </div>
      </div>

      {/* Age Warning */}
      <div className="bg-crimson/20 border-t border-crimson/30">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-muted-foreground">
            <span className="font-semibold text-crimson">+18</span> — Este site
            contém conteúdo adulto. Ao acessar, você confirma ter 18 anos ou mais.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
