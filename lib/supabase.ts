// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

if (!supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)) {
  console.warn('Supabase environment variables not configured. Using mock client.');
}

export const supabase = supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');