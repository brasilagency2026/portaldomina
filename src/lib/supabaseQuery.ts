import { supabase } from "@/integrations/supabase/client";

const QUERY_TIMEOUT_MS = 5000;

export function withTimeout<T>(promise: Promise<T>, ms = QUERY_TIMEOUT_MS): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Query timeout after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
}

export async function safeFetch<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  label = "query"
): Promise<T | null> {
  try {
    console.log(`[supabaseQuery] Starting: ${label}`);
    const start = Date.now();
    const result = await withTimeout(queryFn());
    console.log(`[supabaseQuery] Done: ${label} in ${Date.now() - start}ms`, result);
    if (result.error) {
      console.error(`[supabaseQuery] Error in ${label}:`, result.error);
      return null;
    }
    return result.data;
  } catch (err) {
    console.error(`[supabaseQuery] Failed: ${label}`, err);
    return null;
  }
}

export { supabase };