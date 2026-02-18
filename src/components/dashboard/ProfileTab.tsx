"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MapPin, Home, Hotel, Car, Plane, PartyPopper } from "lucide-react";

const LISTA_SERVICOS = [
  "Bondage", "Spanking", "CBT", "Foot Worship", "Roleplay", "Sissy Training", 
  "Pegging", "Medical Play", "Wax Play", "Sensory Deprivation", 
  "Facesitting", "Trampling", "Humilhação Verbal", 
  "Dominação Financeira", "Fetiche em Couro", 
  "Fetiche em Látex", "Crossdressing", "Eletroestimulação", "Agulhamento", 
  "Puppy Play", "Ageplay", "Breath Play", "Fire Play", 
  "Knife Play", "Blood Play", "Caning",
  "Chuva dourada", "Chuva marrom", "Ballbusting"
];

const LOCAIS_ATENDIMENTO = [
  { id: "Local Próprio", icon: Home },
  { id: "Hotel / Motel", icon: Hotel },
  { id: "Domicílio", icon: Car },
  { id: "Viagens", icon: Plane },
  { id: "Eventos", icon: PartyPopper }
];

interface ProfileTabProps {
  perfil: any;
  setPerfil: (perfil: any) => void;
  handleUpdate: (e: React.FormEvent) => void;
  locationInputRef: React.RefObject<HTMLInputElement>;
}

const ProfileTab = ({ perfil, setPerfil, handleUpdate, locationInputRef }: ProfileTabProps) => {
  const toggleServico = (servico: string) => {
    const current = perfil.servicos || [];
    const updated = current.includes(servico)
      ? current.filter((s: string) => s !== servico)
      : [...current, servico];
    setPerfil({ ...perfil, servicos: updated });
  };

  const toggleAtendimento = (local: string) => {
    const current = perfil.atendimento || [];
    const updated = current.includes(local)
      ? current.filter((l: string) => l !== local)
      : [...current, local];
    setPerfil({ ...perfil, atendimento: updated });
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-8">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="glass-dark">
            <CardHeader><CardTitle>Informações Básicas</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome de Cena</label>
                  <Input value={perfil.nome || ""} onChange={e => setPerfil({...perfil, nome: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cidade / Localização</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      ref={locationInputRef}
                      className="pl-10" 
                      placeholder="Digite sua cidade..."
                      defaultValue={perfil.localizacao || ""} 
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Biografia</label>
                <Textarea rows={4} value={perfil.bio || ""} onChange={e => setPerfil({...perfil, bio: e.target.value})} />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-dark">
            <CardHeader><CardTitle>Onde você atende?</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {LOCAIS_ATENDIMENTO.map((local) => (
                  <button
                    key={local.id}
                    type="button"
                    onClick={() => toggleAtendimento(local.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                      (perfil.atendimento || []).includes(local.id)
                        ? "bg-primary/20 border-primary text-primary"
                        : "bg-secondary/50 border-border text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    <local.icon className="w-6 h-6" />
                    <span className="text-xs font-medium">{local.id}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-dark">
            <CardHeader><CardTitle>Serviços & Especialidades</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {LISTA_SERVICOS.map((servico) => (
                  <div key={servico} className="flex items-center space-x-2">
                    <Checkbox 
                      id={servico} 
                      checked={(perfil.servicos || []).includes(servico)}
                      onCheckedChange={() => toggleServico(servico)}
                    />
                    <label htmlFor={servico} className="text-sm font-medium leading-none cursor-pointer">
                      {servico}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="glass-dark">
            <CardHeader><CardTitle>Status & Visibilidade</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className={`p-4 rounded-lg border ${perfil.status === 'approved' ? 'border-green-500/30 bg-green-500/10' : 'border-yellow-500/30 bg-yellow-500/10'}`}>
                <p className="text-sm opacity-70">Status:</p>
                <p className="text-lg font-bold uppercase">{perfil.status === 'approved' ? '✅ Ativo' : '⏳ Em Análise'}</p>
              </div>
              <Button type="submit" className="w-full bg-gradient-gold">Salvar Todas Alterações</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
};

export default ProfileTab;