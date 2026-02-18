"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { Eye, MessageSquare, MousePointer2, TrendingUp } from "lucide-react";

const data = [
  { name: "Seg", visitas: 400, cliques: 24 },
  { name: "Ter", visitas: 300, cliques: 18 },
  { name: "Qua", visitas: 200, cliques: 12 },
  { name: "Qui", visitas: 278, cliques: 20 },
  { name: "Sex", visitas: 189, cliques: 15 },
  { name: "Sáb", visitas: 239, cliques: 25 },
  { name: "Dom", visitas: 349, cliques: 30 },
];

const StatsTab = ({ isPremium }: { isPremium: boolean }) => {
  if (!isPremium) {
    return (
      <Card className="glass-dark border-primary/20 overflow-hidden">
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
          <div className="text-center p-6 max-w-md">
            <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Estatísticas Detalhadas</h3>
            <p className="text-muted-foreground mb-6">
              Assine o plano **Premium** para visualizar quem visita seu perfil, cliques no WhatsApp e métricas de conversão.
            </p>
            <button className="bg-gradient-gold text-black px-6 py-2 rounded-full font-bold hover:shadow-neon transition-all">
              Fazer Upgrade Agora
            </button>
          </div>
        </div>
        <CardHeader>
          <CardTitle>Visão Geral (Bloqueado)</CardTitle>
        </CardHeader>
        <CardContent className="opacity-20 grayscale">
          <div className="h-[300px] w-full bg-secondary/50 rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-dark">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Visitas (7 dias)</p>
                <h3 className="text-2xl font-bold">1.955</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Eye className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-dark">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cliques WhatsApp</p>
                <h3 className="text-2xl font-bold">144</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-dark">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Cliques</p>
                <h3 className="text-2xl font-bold">7.3%</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <MousePointer2 className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-dark">
        <CardHeader>
          <CardTitle>Desempenho Semanal</CardTitle>
          <CardDescription>Visitas vs Cliques no WhatsApp</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="visitas" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: 'hsl(var(--primary))' }} 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="cliques" 
                  stroke="#22c55e" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#22c55e' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsTab;