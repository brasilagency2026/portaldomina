import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Header from "@/components/layout/Header";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error("Erreur de connexion : " + error.message);
    } else {
      toast.success("Connexion réussie !");
      navigate("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto flex items-center justify-center pt-32 px-4">
        <Card className="w-full max-w-md glass-dark">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gradient-gold">Connexion</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" className="w-full bg-gradient-gold" disabled={loading}>
                {loading ? "Chargement..." : "Se connecter"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}