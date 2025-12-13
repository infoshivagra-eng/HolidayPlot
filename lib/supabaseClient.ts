
import { createClient } from '@supabase/supabase-js';

// Configuration with fallbacks
// We safely check window.process (polyfilled in index.html) or fallback to defaults
const getEnvVar = (key: string) => {
  if (typeof window !== 'undefined' && (window as any).process && (window as any).process.env) {
    return (window as any).process.env[key];
  }
  return undefined;
};

const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('holidaypot_supabase_url') : null;
const storedKey = typeof window !== 'undefined' ? localStorage.getItem('holidaypot_supabase_key') : null;

// Default credentials for demo purposes
const DEFAULT_URL = 'https://bwuunpecsglbywlftbio.supabase.co';
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3dXVucGVjc2dsYnl3bGZ0YmlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MjIxODEsImV4cCI6MjA4MTE5ODE4MX0.9zrPOOZgT0BZzlmh_yTf3LXt9pJx2KodK4uIOydRPrI';

const supabaseUrl = storedUrl || getEnvVar('PUBLIC_SUPABASE_URL') || DEFAULT_URL;
const supabaseAnonKey = storedKey || getEnvVar('PUBLIC_SUPABASE_ANON_KEY') || DEFAULT_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
