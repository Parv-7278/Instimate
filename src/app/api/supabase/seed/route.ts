import { NextResponse } from 'next/server';
import { seedService } from '@/lib/supabase/services/seedService';
import { isSupabaseConfigured } from '@/lib/supabase';

export async function POST() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      error: 'Supabase is not configured. Add credentials in .env.local to seed.',
    }, { status: 400 });
  }

  const result = await seedService.seedIfEmpty();
  return NextResponse.json(result);
}
