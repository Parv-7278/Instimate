import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseAdminConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    serviceRoleKey &&
    !supabaseUrl.includes('replace-with') &&
    !serviceRoleKey.includes('replace_with') &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    serviceRoleKey !== 'your-service-role-key'
  );
};

let adminInstance: SupabaseClient<any> | null = null;

export const getSupabaseAdmin = (): SupabaseClient<any> | null => {
  if (!isSupabaseAdminConfigured()) return null;
  if (!adminInstance) {
    adminInstance = createClient<any>(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return adminInstance;
};
