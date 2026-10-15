import { NextResponse } from 'next/server';
import { institutionService } from '@/lib/supabase/services/institutionService';
import { isSupabaseConfigured } from '@/lib/supabase';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, notes, rejectionReason } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const ok = await institutionService.updateStatus(id, status, notes, rejectionReason);
      if (!ok) {
        return NextResponse.json({ error: 'Failed to update institution status in Supabase' }, { status: 500 });
      }
      return NextResponse.json({ success: true, id, status, notes });
    }

    return NextResponse.json({
      success: true,
      id,
      status,
      notes,
      fallback: true,
      message: 'Status updated in fallback mode',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error updating institution status', details: error.message },
      { status: 500 }
    );
  }
}
