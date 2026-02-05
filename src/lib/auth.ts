/**
 * Production-safe authentication helpers
 * Handles Google OAuth login with proper redirect management
 */

import { supabase } from '@/lib/supabase';
import { getRedirectUrl } from '@/config/appConfig';

/**
 * Sign in with Google OAuth
 * Uses universal redirect helper for consistent behavior across environments
 */
export async function loginWithGoogle(): Promise<{ error: any }> {
  const redirectUrl = getRedirectUrl();

  console.log('Auth: Starting Google sign-in with redirect:', redirectUrl);

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
    },
  });

  if (error) {
    console.error('Auth: Google sign-in error:', error);
    return { error };
  }

  console.log('Auth: Google sign-in initiated, waiting for redirect');
  return { error: null };
}

/**
 * Sign out user
 */
export async function logout(): Promise<{ error: any }> {
  console.log('Auth: Signing out user');

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Auth: Sign out error:', error);
    return { error };
  }

  console.log('Auth: User signed out successfully');
  return { error: null };
}

/**
 * Get current session
 */
export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Auth: Error getting session:', error);
    return { session: null, error };
  }

  return { session, error: null };
}

/**
 * Listen to auth state changes
 * Returns unsubscribe function
 */
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);

  return () => subscription.unsubscribe();
}
