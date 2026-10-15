import { NextResponse } from 'next/server';
import { governmentService } from '@/lib/supabase/services/governmentService';
import { isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_FILE_TRACKING } from '@/lib/seedData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const institutionId = searchParams.get('institutionId');

    if (isSupabaseConfigured() && institutionId) {
      const files = await governmentService.getFileTracking(institutionId);
      return NextResponse.json({ success: true, count: files.length, files });
    }

    const filtered = institutionId
      ? INITIAL_FILE_TRACKING.filter((f) => f.institutionId === institutionId)
      : INITIAL_FILE_TRACKING;

    return NextResponse.json({
      success: true,
      count: filtered.length,
      files: filtered,
      fallback: !isSupabaseConfigured(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to retrieve file tracking records', details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { fileId, nextDesk, remarks } = body;

    if (!fileId || !nextDesk) {
      return NextResponse.json({ error: 'fileId and nextDesk are required' }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const ok = await governmentService.moveFileDesk(fileId, nextDesk, remarks || 'Moved to next desk');
      if (!ok) {
        return NextResponse.json({ error: 'Failed to move file desk in Supabase' }, { status: 500 });
      }
      return NextResponse.json({ success: true, fileId, nextDesk, remarks });
    }

    return NextResponse.json({
      success: true,
      fileId,
      nextDesk,
      remarks,
      fallback: true,
      message: 'Desk moved in fallback mode',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error updating file desk', details: error.message },
      { status: 500 }
    );
  }
}
