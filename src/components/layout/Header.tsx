import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Crown, MapPin, User, LogIn, LogOut, LayoutDashboard, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const { data } = await supabase
          .from("perfis")
          .select("role")
          .eq("id", currentUser.id)
          .single();
        
        setIsAdmin(data?.role === 'admin');
      } else {
        setIsAdmin(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (!currentUser) {
        setIsAdmin(false);
      } else {
        checkUser();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Até logo!");
    navigate("/");
  };

  const navLinks = [
    { label: "Explorar", href: "/explorar", icon: MapPin },
    { label: "Sobre", href: "/sobre" },
    { label: "Contato", href: "/contato" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-dark">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center">
              <Crown className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-bold text-gradient-gold">
              BDSMBRAZIL
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300 font-medium"
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {isAdmin && (
                  <Button variant="ghost" size="sm" className="gap-2 text-primary" asChild>
                    <Link to="/admin">
                      <ShieldCheck className="w-4 h-4" />
                      Admin
                    </Link>
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="gap-2" asChild>
                  <Link to="/dashboard">
                    <LayoutDashboard className="w-4 h-4" />
                    Painel
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="gap-2 border-primary/30" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="gap-2" asChild>
                  <Link to="/login">
                    <LogIn className="w-4 h-4" />
                    Entrar
                  </Link>
                </Button>
                <Button variant="gold" size="sm" className="gap-2" asChild>
                  <Link to="/register">
                    <User className="w-4 h-4" />
                    Cadastrar
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-dark border-t border-border"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors py-2 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.icon && <link.icon className="w-5 h-5" />}
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-border">
                {user ? (
                  <>
                    {isAdmin && (
                      <Button variant="ghost" className="justify-start gap-2 text-primary" asChild onClick={() => setIsMenuOpen(false)}>
                        <Link to="/admin"><ShieldCheck className="w-4 h-4" /> Admin</Link>
                      </Button>
                    )}
                    <Button variant="ghost" className="justify-start gap-2" asChild onClick={() => setIsMenuOpen(false)}>
                      <Link to="/dashboard"><LayoutDashboard className="w-4 h-4" /> Painel</Link>
                    </Button>
                    <Button variant="outline" className="justify-start gap-2 border-primary/30" onClick={handleLogout}>
                      <LogOut className="w-4 h-4" /> Sair
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="justify-start gap-2" asChild onClick={() => setIsMenuOpen(false)}>
                      <Link to="/login"><LogIn className="w-4 h-4" /> Entrar</Link>
                    </Button>
                    <Button variant="gold" className="justify-start gap-2" asChild onClick={() => setIsMenuOpen(false)}>
                      <Link to="/register"><User className="w-4 h-4" /> Cadastrar</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;