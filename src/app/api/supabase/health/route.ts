import { NextResponse } from 'next/server';
import { isSupabaseConfigured, getSupabaseClient, getSupabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase';

export async function GET() {
  const isClientConfigured = isSupabaseConfigured();
  const isAdminConfigured = isSupabaseAdminConfigured();

  if (!isClientConfigured && !isAdminConfigured) {
    return NextResponse.json({
      status: 'unconfigured',
      connected: false,
      message: 'Supabase credentials are not set. The application is running in local fallback mode.',
      instructions: 'Provide NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY in .env.local to enable live Supabase PostgreSQL backend.',
    });
  }

  const client = getSupabaseAdmin() || getSupabaseClient();
  if (!client) {
    return NextResponse.json({
      status: 'error',
      connected: false,
      message: 'Failed to initialize Supabase client instance.',
    });
  }

  try {
    const { count, error } = await client
      .from('institutions')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return NextResponse.json({
        status: 'connection_error',
        connected: false,
        error: error.message,
        hint: 'Verify your Supabase credentials and execute the migration file in supabase/migrations/',
      });
    }

    return NextResponse.json({
      status: 'healthy',
      connected: true,
      institutionCount: count,
      message: 'Successfully connected to live Supabase PostgreSQL database!',
    });
  } catch (err: any) {
    return NextResponse.json({
      status: 'exception',
      connected: false,
      error: err.message,
    });
  }
}
