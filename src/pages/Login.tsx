"use client";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import { useSession } from "@/components/auth/SessionProvider";
import { Loader2, LogIn } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useSession();
  const location = useLocation();

  // Redireciona se já estiver logado
  useEffect(() => {
    if (!loading && user) {
      const from = (location.state as any)?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password 
      });

      if (error) {
        if (error.message === "Invalid login credentials") {
          toast.error("E-mail ou senha incorretos.");
        } else {
          toast.error("Erro ao entrar: " + error.message);
        }
        setIsSubmitting(false);
      } else {
        toast.success("Bem-vinda de volta!");
        // O useEffect acima cuidará do redirecionamento assim que a sessão for detectada
      }
    } catch (err: any) {
      toast.error("Ocorreu um erro inesperado ao tentar entrar.");
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto flex items-center justify-center pt-40 px-4">
        <Card className="w-full max-w-md glass-dark border-primary/20 shadow-premium">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gradient-gold flex items-center justify-center gap-2">
              <LogIn className="w-6 h-6 text-primary" />
              Entrar no Portal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">E-mail</label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Senha</label>
                <Input
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="bg-background/50"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-gold h-12 text-lg font-bold" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Entrando...
                  </>
                ) : "Entrar"}
              </Button>
              <div className="text-center space-y-2 mt-4">
                <p className="text-sm text-muted-foreground">
                  Não tem uma conta? <a href="/register" className="text-primary hover:underline font-semibold">Cadastre-se</a>
                </p>
                <p className="text-xs text-muted-foreground">
                  Esqueceu sua senha? <button type="button" className="hover:text-primary transition-colors">Recuperar</button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}