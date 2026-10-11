/**
 * Centralized environment variable configuration module.
 *
 * All environment variables used across the application must be declared here.
 * Server-side secrets are kept strictly server-only (never exposed to browser bundles).
 * Public variables use the NEXT_PUBLIC_ prefix for client-side access.
 *
 * Usage:
 *   import { config } from '@/lib/config';
 *   if (!config.supabase.isConfigured) { ... }
 */

// ─── Public (client-safe) configuration ─────────────────────────────────────

export const publicConfig = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    /** True only when real (non-placeholder) Supabase credentials are provided */
    isConfigured:
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('replace-with') &&
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.includes('replace_with'),
  },

  /** Public Razorpay key_id — safe for client bundles */
  razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
};

// ─── Server-only configuration ────────────────────────────────────────────────
// These values must NEVER be exported in client components or API responses.

export const serverConfig = {
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',

  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
    /** True only when real (non-placeholder) keys are provided */
    isConfigured:
      Boolean(process.env.RAZORPAY_KEY_ID) &&
      Boolean(process.env.RAZORPAY_KEY_SECRET) &&
      !process.env.RAZORPAY_KEY_ID?.includes('replace_with') &&
      !process.env.RAZORPAY_KEY_SECRET?.includes('replace_with'),
  },

  resend: {
    apiKey: process.env.RESEND_API_KEY || '',
    fromEmail: process.env.RESEND_FROM_EMAIL || '',
    isConfigured:
      Boolean(process.env.RESEND_API_KEY) &&
      !process.env.RESEND_API_KEY?.includes('replace_with'),
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    isConfigured:
      Boolean(process.env.GOOGLE_CLIENT_ID) &&
      Boolean(process.env.GOOGLE_CLIENT_SECRET) &&
      !process.env.GOOGLE_CLIENT_ID?.includes('replace_with'),
  },

  whatsapp: {
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '',
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
    isConfigured:
      Boolean(process.env.WHATSAPP_ACCESS_TOKEN) &&
      !process.env.WHATSAPP_ACCESS_TOKEN?.includes('replace_with'),
  },
};

/**
 * Validates that required environment variables are present.
 * Call this in server-side code (API routes, server components) to catch
 * configuration mistakes early and fail safely with a clear message.
 *
 * @param required - array of env var names that must be set
 * @throws Error with descriptive (non-sensitive) message if any are missing
 */
export function requireEnvVars(required: string[]): void {
  const missing = required.filter((key) => {
    const val = process.env[key];
    return !val || val.startsWith('replace_with') || val.startsWith('replace-with');
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing or unconfigured required environment variables: ${missing.join(', ')}. ` +
        'Copy .env.example to .env.local and fill in the actual values. ' +
        'See README.md for setup instructions.'
    );
  }
}
