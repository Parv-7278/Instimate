import { NextResponse } from 'next/server';
import { corporateService } from '@/lib/supabase/services/corporateService';
import { isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, institutionId, employeeId, employeeName, workMode, recordId, durationHours } = body;

    if (action === 'clock-in') {
      if (!institutionId || !employeeId || !employeeName) {
        return NextResponse.json(
          { error: 'institutionId, employeeId, and employeeName are required for clock-in' },
          { status: 400 }
        );
      }

      if (isSupabaseConfigured()) {
        const record = await corporateService.clockIn(
          institutionId,
          employeeId,
          employeeName,
          workMode || 'Office'
        );
        if (!record) {
          return NextResponse.json({ error: 'Failed to record clock-in in Supabase' }, { status: 500 });
        }
        return NextResponse.json({ success: true, record });
      }

      return NextResponse.json({
        success: true,
        record: {
          id: `clk-${Date.now()}`,
          institutionId,
          employeeId,
          employeeName,
          date: new Date().toISOString().split('T')[0],
          clockInTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
          workMode: workMode || 'Office',
          status: 'Present',
        },
        fallback: true,
      });
    }

    if (action === 'clock-out') {
      if (!recordId) {
        return NextResponse.json({ error: 'recordId is required for clock-out' }, { status: 400 });
      }

      if (isSupabaseConfigured()) {
        const ok = await corporateService.clockOut(recordId, durationHours || 8);
        if (!ok) {
          return NextResponse.json({ error: 'Failed to record clock-out in Supabase' }, { status: 500 });
        }
        return NextResponse.json({ success: true, recordId });
      }

      return NextResponse.json({
        success: true,
        recordId,
        fallback: true,
      });
    }

    return NextResponse.json({ error: 'Invalid action: must be clock-in or clock-out' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error processing clock record', details: error.message },
      { status: 500 }
    );
  }
}
