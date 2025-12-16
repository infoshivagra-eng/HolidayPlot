
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

// Secure Defaults: Should come from environment variables or be empty to prevent exposure
const DEFAULT_URL = '';
const DEFAULT_KEY = '';

const supabaseUrl = storedUrl || getEnvVar('PUBLIC_SUPABASE_URL') || DEFAULT_URL;
const supabaseAnonKey = storedKey || getEnvVar('PUBLIC_SUPABASE_ANON_KEY') || DEFAULT_KEY;

// Create client only if URL and Key are present to avoid runtime errors on empty init
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : { 
      from: () => ({ 
        select: () => Promise.resolve({ data: null, error: { message: 'No Supabase Configured' } }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        delete: () => Promise.resolve({ data: null, error: null }),
        upsert: () => Promise.resolve({ data: null, error: null })
      }) 
    } as any;
