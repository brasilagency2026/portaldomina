"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Eye, TrendingUp, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/components/auth/SessionProvider";
import { Link } from "react-router-dom";

interface DayStats {
  name: string;
  visitas: number;
}

const StatsTab = ({ isPremium }: { isPremium: boolean }) => {
  const { user } = useSession();
  const [data, setData] = useState<DayStats[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPremium || !user) {
      setLoading(false);
      return;
    }
    fetchStats();
  }, [isPremium, user]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Busca as visitas dos últimos 7 dias
      const since = new Date();
      since.setDate(since.getDate() - 6);
      since.setHours(0, 0, 0, 0);

      const { data: views, error } = await supabase
        .from("profile_views")
        .select("viewed_at")
        .eq("perfil_id", user!.id)
        .gte("viewed_at", since.toISOString());

      if (error) throw error;

      // Agrupa por dia
      const days: Record<string, number> = {};
      const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split("T")[0];
        days[key] = 0;
      }

      (views || []).forEach((v) => {
        const key = v.viewed_at.split("T")[0];
        if (key in days) days[key]++;
      });

      const chartData: DayStats[] = Object.entries(days).map(([dateStr, count]) => {
        const d = new Date(dateStr + "T12:00:00");
        return { name: dayNames[d.getDay()], visitas: count };
      });

      setData(chartData);
      setTotalViews((views || []).length);
    } catch (err) {
      console.error("Erro ao buscar estatísticas:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isPremium) {
    return (
      <Card className="glass-dark border-primary/20 overflow-hidden relative">
        <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px] z-10 flex items-center justify-center">
          <div className="text-center p-6 max-w-md">
            <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Estatísticas Detalhadas</h3>
            <p className="text-muted-foreground mb-6">
              Assine o plano <strong>Premium</strong> para visualizar quem visita seu perfil e métricas de conversão.
            </p>
            <Link
              to="/premium"
              className="bg-gradient-gold text-black px-6 py-2 rounded-full font-bold hover:shadow-neon transition-all inline-block"
            >
              Fazer Upgrade Agora
            </Link>
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="glass-dark">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Visitas (7 dias)</p>
                <h3 className="text-2xl font-bold">{totalViews}</h3>
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
                <p className="text-sm text-muted-foreground">Média diária</p>
                <h3 className="text-2xl font-bold">
                  {data.length > 0 ? (totalViews / 7).toFixed(1) : "0"}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-dark">
        <CardHeader>
          <CardTitle>Visitas nos últimos 7 dias</CardTitle>
          <CardDescription>Número de visualizações do seu perfil por dia</CardDescription>
        </CardHeader>
        <CardContent>
          {totalViews === 0 ? (
            <div className="h-[350px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Eye className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>Nenhuma visita registrada ainda.</p>
                <p className="text-sm mt-1 opacity-60">As visitas aparecerão aqui assim que alguém ver seu perfil.</p>
              </div>
            </div>
          ) : (
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
                    allowDecimals={false}
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
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsTab;