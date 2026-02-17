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
import EcosystemSection from "@/components/home/EcosystemSection";
import { motion } from "framer-motion";
import { UserPlus, ShieldCheck, MailCheck } from "lucide-react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // 1. Criar usuário no Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nome },
        emailRedirectTo: `${window.location.origin}/login`
      }
    });

    if (error) {
      toast.error("Erro ao cadastrar: " + error.message);
      setLoading(false);
      return;
    }

    // 2. Tentar criar o perfil na tabela 'perfis' imediatamente
    if (data.user) {
      const { error: profileError } = await supabase
        .from("perfis")
        .insert([
          { 
            id: data.user.id, 
            email: email, 
            nome: nome,
            status: 'pending',
            role: 'user'
          }
        ]);
      
      if (profileError) {
        console.warn("Aviso: Perfil será criado no primeiro login devido a restrições de RLS.");
      }
    }

    setIsSubmitted(true);
    toast.success("Cadastro realizado com sucesso!");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32">
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
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="w-full max-w-md mx-auto glass-dark border-primary/20 shadow-premium">
                  <CardHeader>
                    <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
                      {isSubmitted ? <MailCheck className="w-6 h-6 text-green-500" /> : <UserPlus className="w-6 h-6 text-primary" />}
                      {isSubmitted ? "Verifique seu E-mail" : "Criar minha conta"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isSubmitted ? (
                      <div className="text-center space-y-6 py-4">
                        <p className="text-muted-foreground">
                          Enviamos um link de confirmação para <strong>{email}</strong>. 
                          Por favor, clique no link para ativar sua conta.
                        </p>
                        <Button variant="outline" className="w-full" onClick={() => setIsSubmitted(false)}>
                          Voltar
                        </Button>
                      </div>
                    ) : (
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
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        <EcosystemSection />
        <FeaturesSection />
        <PricingSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}