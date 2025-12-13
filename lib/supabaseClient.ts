
import { createClient } from '@supabase/supabase-js';

// Helper to safely get env vars without crashing
const getEnv = (key: string) => {
  try {
    return process.env[key];
  } catch (e) {
    return undefined;
  }
};

// Configuration with fallbacks to the provided credentials, but prioritizing localStorage for admin overrides
const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('holidaypot_supabase_url') : null;
const storedKey = typeof window !== 'undefined' ? localStorage.getItem('holidaypot_supabase_key') : null;

const supabaseUrl = storedUrl || getEnv('PUBLIC_SUPABASE_URL') || 'https://bwuunpecsglbywlftbio.supabase.co';
const supabaseAnonKey = storedKey || getEnv('PUBLIC_SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3dXVucGVjc2dsYnl3bGZ0YmlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MjIxODEsImV4cCI6MjA4MTE5ODE4MX0.9zrPOOZgT0BZzlmh_yTf3LXt9pJx2KodK4uIOydRPrI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
