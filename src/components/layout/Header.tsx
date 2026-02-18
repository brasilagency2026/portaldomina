import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Menu, 
  X, 
  User, 
  LogIn, 
  LogOut, 
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/components/auth/SessionProvider";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAdmin, loading } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Desconectado com sucesso");
      navigate("/");
    } catch (error: any) {
      toast.error("Erro ao sair: " + error.message);
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass-dark py-3 shadow-lg" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          {/* Logo com o novo símbolo BDSM */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform">
              <img 
                src="/symbolbdsmtransparent.png" 
                alt="BDSMBRAZIL Logo" 
                className="w-full h-full object-contain drop-shadow-neon"
              />
            </div>
            <span className="font-display text-2xl font-bold tracking-tighter">
              BDSM<span className="text-gradient-gold">BRAZIL</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/explorar" className="text-sm font-medium hover:text-primary transition-colors">Explorar</Link>
            <Link to="/explorar" className="text-sm font-medium hover:text-primary transition-colors">Mapa</Link>
            <Link to="/premium" className="text-sm font-medium hover:text-primary transition-colors">Premium</Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" className="gap-2" asChild>
                      <Link to={isAdmin ? "/admin" : "/dashboard"}>
                        <LayoutDashboard className="w-4 h-4" />
                        Painel
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleLogout}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </Button>
                  </div>
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
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass-dark border-b border-white/10 p-4 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-4">
            <Link to="/explorar" className="p-2 font-medium">Explorar</Link>
            <Link to="/explorar" className="p-2 font-medium">Mapa</Link>
            <Link to="/premium" className="p-2 font-medium">Premium</Link>
            <hr className="border-white/10" />
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link to={isAdmin ? "/admin" : "/dashboard"} className="p-2 font-medium flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" /> Painel
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="p-2 font-medium text-destructive flex items-center gap-2 text-left"
                    >
                      <LogOut className="w-4 h-4" /> Sair
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="p-2 font-medium flex items-center gap-2">
                      <LogIn className="w-4 h-4" /> Entrar
                    </Link>
                    <Link to="/register" className="p-2 font-medium flex items-center gap-2 text-primary">
                      <User className="w-4 h-4" /> Cadastrar
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;