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
    let mounted = true;
    
    // Timeout de sécurité pour débloquer l'UI si Supabase ne répond pas
    const safetyTimeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn("[SessionProvider] Timeout: Forcing loading to false");
        setLoading(false);
      }
    }, 2000);

    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
            checkAdminRole(session.user.id);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("[SessionProvider] Error initializing session:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initSession();

    // Écoute des changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await checkAdminRole(session.user.id);
        } else {
          setIsAdmin(false);
        }
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
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
      console.error("[SessionProvider] Error checking admin role:", err);
    }
  };

  return (
    <SessionContext.Provider value={{ session, user, loading, isAdmin }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);