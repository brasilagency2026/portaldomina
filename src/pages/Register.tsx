import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Header from "@/components/layout/Header";

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
      toast.error("Erreur d'inscription : " + error.message);
    } else {
      toast.success("Inscription réussie ! Vous pouvez maintenant vous connecter.");
      navigate("/login");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto flex items-center justify-center pt-32 px-4">
        <Card className="w-full max-w-md glass-dark">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gradient-gold">Créer mon compte</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <Input
                placeholder="Nom de scène"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
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
                {loading ? "Création..." : "S'inscrire"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Déjà un compte ? <Link to="/login" className="text-primary hover:underline">Se connecter</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}