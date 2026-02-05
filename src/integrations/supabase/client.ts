/**
 * Production-safe Supabase client configuration
 * Includes error handling, session restore, and mobile-safe initialization
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { appConfig } from '@/config/appConfig';

// Validate required environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL) {
  throw new Error('VITE_SUPABASE_URL environment variable is required');
}

if (!SUPABASE_PUBLISHABLE_KEY) {
  throw new Error('VITE_SUPABASE_PUBLISHABLE_KEY environment variable is required');
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    // Use localStorage for web, but handle Capacitor carefully
    storage: appConfig.isCapacitor ? {
      getItem: (key: string) => {
        try {
          return localStorage.getItem(key);
        } catch (error) {
          console.warn('Capacitor: localStorage access failed:', error);
          return null;
        }
      },
      setItem: (key: string, value: string) => {
        try {
          localStorage.setItem(key, value);
        } catch (error) {
          console.warn('Capacitor: localStorage write failed:', error);
        }
      },
      removeItem: (key: string) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.warn('Capacitor: localStorage remove failed:', error);
        }
      },
    } : localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // Prevent automatic redirects to localhost in production
    flowType: 'pkce',
  },
  // Add global error handling
  global: {
    headers: {
      'X-Client-Info': `taza-taza-app@${appConfig.environment}`,
    },
  },
});

// Initialize session restore for mobile safety
if (appConfig.isCapacitor) {
  // Delay session check to ensure Capacitor is ready
  setTimeout(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.warn('Capacitor: Session restore failed:', error);
      } else if (session) {
        console.log('Capacitor: Session restored successfully');
      }
    } catch (error) {
      console.warn('Capacitor: Session check failed:', error);
    }
  }, 1000);
}
