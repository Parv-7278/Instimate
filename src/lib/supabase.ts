import { getSupabaseClient, isSupabaseConfigured } from './supabase/client';
import { getSupabaseAdmin, isSupabaseAdminConfigured } from './supabase/admin';

export { isSupabaseConfigured, getSupabaseClient, isSupabaseAdminConfigured, getSupabaseAdmin };

// Default client instance for backward compatibility
export const supabase = getSupabaseClient();
