import { NextResponse } from 'next/server';
import { attendanceService } from '@/lib/supabase/services/attendanceService';
import { isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_ATTENDANCE } from '@/lib/seedData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const institutionId = searchParams.get('institutionId');
    const date = searchParams.get('date') || undefined;

    if (isSupabaseConfigured() && institutionId) {
      const records = await attendanceService.getByInstitution(institutionId, date);
      return NextResponse.json({ success: true, count: records.length, attendance: records });
    }

    return NextResponse.json({
      success: true,
      count: INITIAL_ATTENDANCE.length,
      attendance: INITIAL_ATTENDANCE,
      fallback: !isSupabaseConfigured(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to retrieve attendance logs', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const records = Array.isArray(body) ? body : [body];

    if (records.length === 0) {
      return NextResponse.json({ error: 'No attendance records provided' }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const ok = await attendanceService.bulkMark(records);
      if (!ok) {
        return NextResponse.json({ error: 'Failed to commit attendance records in Supabase' }, { status: 500 });
      }
      return NextResponse.json({ success: true, count: records.length });
    }

    return NextResponse.json({
      success: true,
      count: records.length,
      fallback: true,
      message: 'Recorded attendance in fallback mode',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error logging attendance', details: error.message },
      { status: 500 }
    );
  }
}
