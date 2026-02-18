"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Key, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface SecurityTabProps {
  perfil: any;
  setPerfil: (perfil: any) => void;
}

const SecurityTab = ({ perfil, setPerfil }: SecurityTabProps) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) toast.error("Erro ao atualizar senha.");
    else {
      toast.success("Senha atualizada!");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <Card className="glass-dark">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            <CardTitle>Alterar Senha</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nova Senha</label>
              <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirmar Nova Senha</label>
              <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full bg-gradient-gold">Atualizar Senha</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="glass-dark">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <CardTitle>Privacidade</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border">
            <div>
              <p className="font-medium">Ocultar Perfil Temporariamente</p>
              <p className="text-xs text-muted-foreground">Seu perfil não aparecerá nas buscas.</p>
            </div>
            <Checkbox 
              checked={perfil.status === 'paused'}
              onCheckedChange={async (checked) => {
                const newStatus = checked ? 'paused' : 'approved';
                const { error } = await supabase.from("perfis").update({ status: newStatus }).eq("id", perfil.id);
                if (!error) {
                  setPerfil({ ...perfil, status: newStatus });
                  toast.success("Visibilidade atualizada.");
                }
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityTab;