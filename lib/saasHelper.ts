
import { createClient } from '@supabase/supabase-js';

// Master Database Credentials (The SaaS Platform's DB)
// Using LocalStorage for Super Admin configuration or defaulting to secure/empty values

const getEnvVar = (key: string) => {
  if (typeof window !== 'undefined' && (window as any).process && (window as any).process.env) {
    return (window as any).process.env[key];
  }
  return undefined;
};

const storedMasterUrl = typeof window !== 'undefined' ? localStorage.getItem('holidaypot_master_url') : null;
const storedMasterKey = typeof window !== 'undefined' ? localStorage.getItem('holidaypot_master_key') : null;

// Secure Defaults: Empty to ensure security compliance
const DEFAULT_MASTER_URL = ''; 
const DEFAULT_MASTER_KEY = '';

const MASTER_URL = storedMasterUrl || getEnvVar('PUBLIC_MASTER_SUPABASE_URL') || DEFAULT_MASTER_URL;
const MASTER_KEY = storedMasterKey || getEnvVar('PUBLIC_MASTER_SUPABASE_ANON_KEY') || DEFAULT_MASTER_KEY;

export const masterSupabase = (MASTER_URL && MASTER_KEY)
  ? createClient(MASTER_URL, MASTER_KEY)
  : { 
      from: () => ({ 
        select: () => Promise.resolve({ data: null, error: { message: 'Master DB Not Configured' } }),
        upsert: () => Promise.resolve({ data: null, error: null })
      }) 
    } as any;
