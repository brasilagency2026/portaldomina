"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface SessionContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  user: null,
  loading: true,
  isAdmin: false,
});

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Busca a sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminRole(session.user.id);
      }
      setLoading(false);
    });

    // Escuta mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await checkAdminRole(session.user.id);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("perfis")
        .select("role")
        .eq("id", userId)
        .maybeSingle();
      
      if (!error && data) {
        setIsAdmin(data.role === 'admin');
      }
    } catch (err) {
      console.error("Erro ao verificar role de admin:", err);
    }
  };

  return (
    <SessionContext.Provider value={{ session, user, loading, isAdmin }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);