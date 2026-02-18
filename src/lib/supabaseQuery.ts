import { supabase } from "@/integrations/supabase/client";

const QUERY_TIMEOUT_MS = 8000;

export function withTimeout<T>(promise: Promise<T>, ms = QUERY_TIMEOUT_MS): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Query timeout")), ms)
  );
  return Promise.race([promise, timeout]);
}

export { supabase };