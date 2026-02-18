import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bmivfqpopjgozwjoustr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtaXZmcXBvcGpnb3p3am91c3RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNzIyMjgsImV4cCI6MjA4Njg0ODIyOH0.ffHzUWP7Ns85BIY8lqcWk4QaJHujVpQAz2mbXS7w_Ec";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
  global: {
    fetch: (url, options) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timeout));
    }
  }
});