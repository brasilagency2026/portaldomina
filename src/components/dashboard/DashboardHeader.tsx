"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardHeaderProps {
  role?: string;
  isPremium?: boolean;
}

const DashboardHeader = ({ role, isPremium }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <h1 className="text-3xl font-bold text-gradient-gold">Painel de Controle</h1>
      <div className="flex flex-wrap gap-3">
        {role === 'admin' && (
          <Button variant="outline" className="gap-2 border-primary/50 text-primary" asChild>
            <Link to="/admin">
              <ShieldCheck className="w-4 h-4" />
              Acessar Admin
            </Link>
          </Button>
        )}
        {isPremium && (
          <Badge className="bg-gradient-gold gap-1.5 py-1.5 px-4">
            <Crown className="w-4 h-4" /> Assinatura Premium Ativa
          </Badge>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;