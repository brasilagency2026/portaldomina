import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FeaturesSection from "@/components/home/FeaturesSection";
import PricingSection from "@/components/home/PricingSection";
import CTASection from "@/components/home/CTASection";
import { motion } from "framer-motion";
import { UserPlus, ShieldCheck } from "lucide-react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nome }
      }
    });

    if (error) {
      toast.error("Erro ao cadastrar: " + error.message);
    } else {
      toast.success("Cadastro realizado! Verifique seu e-mail para confirmar.");
      navigate("/login");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32">
        {/* Hero Registration Section */}
        <section className="pb-20 px-4">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-primary/30 text-primary text-sm font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  Área da Profissional
                </div>
                <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">
                  Junte-se à maior rede de <span className="text-gradient-gold">Dominatrixes</span> do Brasil
                </h1>
                <p className="text-xl text-muted-foreground">
                  Crie seu perfil hoje e comece a ser encontrada por clientes qualificados em sua região.
                </p>
                
                <div className="space-y-4 pt-4">
                  {[
                    "Perfil verificado com selo de confiança",
                    "Painel de controle intuitivo",
                    "Geolocalização em tempo real",
                    "Suporte dedicado à profissional"
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="w-full max-w-md mx-auto glass-dark border-primary/20 shadow-premium">
                  <CardHeader>
                    <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
                      <UserPlus className="w-6 h-6 text-primary" />
                      Criar minha conta
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Nome de Cena</label>
                        <Input
                          placeholder="Ex: Domina Hera"
                          value={nome}
                          onChange={(e) => setNome(e.target.value)}
                          required
                          className="bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">E-mail Profissional</label>
                        <Input
                          type="email"
                          placeholder="seu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Senha</label>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="bg-background/50"
                        />
                      </div>
                      <Button type="submit" className="w-full bg-gradient-gold h-12 text-lg font-bold mt-4" disabled={loading}>
                        {loading ? "Processando..." : "Cadastrar Agora"}
                      </Button>
                      <p className="text-center text-sm text-muted-foreground mt-4">
                        Já possui uma conta? <Link to="/login" className="text-primary hover:underline font-semibold">Fazer Login</Link>
                      </p>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Informational Sections moved from Home */}
        <FeaturesSection />
        <PricingSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}