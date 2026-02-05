/**
 * Central application configuration
 * Handles environment detection and URL management for production deployment
 */

export type AppEnvironment = 'development' | 'network' | 'production';

export interface AppConfig {
  environment: AppEnvironment;
  appUrl: string;
  supabaseUrl: string;
  isCapacitor: boolean;
  isDevelopment: boolean;
  isProduction: boolean;
}

/**
 * Detect current environment based on hostname and environment variables
 */
function detectEnvironment(): AppEnvironment {
  const hostname = window.location.hostname;

  // Check for explicit environment variable
  const envVar = import.meta.env.VITE_APP_ENV;
  if (envVar === 'production') return 'production';
  if (envVar === 'network') return 'network';

  // Auto-detect based on hostname
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'development';
  }

  // Check if it's an IP address (network testing)
  const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  if (ipRegex.test(hostname)) {
    return 'network';
  }

  // Default to production for any domain
  return 'production';
}

/**
 * Get the appropriate app URL based on environment
 */
function getAppUrl(environment: AppEnvironment): string {
  switch (environment) {
    case 'development':
      return import.meta.env.VITE_LOCAL_URL || 'http://localhost:8080';

    case 'network':
      return import.meta.env.VITE_NETWORK_URL || window.location.origin;

    case 'production':
      return import.meta.env.VITE_APP_DOMAIN || window.location.origin;

    default:
      return window.location.origin;
  }
}

/**
 * Get Supabase URL with fallback handling
 */
function getSupabaseUrl(): string {
  const url = import.meta.env.VITE_SUPABASE_URL;
  if (!url) {
    throw new Error('VITE_SUPABASE_URL environment variable is required');
  }
  return url;
}

/**
 * Application configuration object
 */
export const appConfig: AppConfig = {
  environment: detectEnvironment(),
  appUrl: getAppUrl(detectEnvironment()),
  supabaseUrl: getSupabaseUrl(),
  isCapacitor: !!(window as any).Capacitor?.isNativePlatform(),
  isDevelopment: detectEnvironment() === 'development',
  isProduction: detectEnvironment() === 'production',
};

/**
 * Universal redirect URL helper
 * Prevents localhost redirects in production and handles all environments
 */
export function getRedirectUrl(): string {
  // For Capacitor mobile apps, use custom URL scheme
  if (appConfig.isCapacitor) {
    return `${import.meta.env.VITE_CAPACITOR_SCHEME || 'com.tazataza.app'}://`;
  }

  // Never allow localhost redirects in production
  if (appConfig.isProduction && window.location.hostname === 'localhost') {
    console.warn('Preventing localhost redirect in production environment');
    return appConfig.appUrl;
  }

  // Use app URL for all other cases
  return appConfig.appUrl;
}

/**
 * Environment validation helper
 */
export function validateEnvironment(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!import.meta.env.VITE_SUPABASE_URL) {
    errors.push('VITE_SUPABASE_URL is required');
  }

  if (!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
    errors.push('VITE_SUPABASE_PUBLISHABLE_KEY is required');
  }

  if (appConfig.environment === 'production' && !import.meta.env.VITE_APP_DOMAIN) {
    errors.push('VITE_APP_DOMAIN is recommended for production');
  }

  if (appConfig.environment === 'network' && !import.meta.env.VITE_NETWORK_URL) {
    errors.push('VITE_NETWORK_URL is recommended for network testing');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
