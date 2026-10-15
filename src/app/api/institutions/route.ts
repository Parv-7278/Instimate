import { NextResponse } from 'next/server';
import { institutionService } from '@/lib/supabase/services/institutionService';
import { isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_INSTITUTIONS } from '@/lib/seedData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code') || searchParams.get('slug');

    if (isSupabaseConfigured()) {
      if (code) {
        const inst = await institutionService.getByCodeOrSlug(code);
        if (!inst) return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
        return NextResponse.json({ success: true, institution: inst });
      }

      const institutions = await institutionService.getAll();
      return NextResponse.json({ success: true, count: institutions.length, institutions });
    }

    // Fallback mode if Supabase credentials are not yet set in .env.local
    if (code) {
      const match = INITIAL_INSTITUTIONS.find(
        (i) => i.code.toLowerCase() === code.toLowerCase() || i.slug.toLowerCase() === code.toLowerCase()
      );
      if (!match) return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
      return NextResponse.json({ success: true, institution: match, fallback: true });
    }

    return NextResponse.json({
      success: true,
      count: INITIAL_INSTITUTIONS.length,
      institutions: INITIAL_INSTITUTIONS,
      fallback: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to retrieve institutions', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Required fields validation
    const required = ['name', 'code', 'type', 'address', 'phone', 'email', 'representativeName'];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    if (isSupabaseConfigured()) {
      const created = await institutionService.create(body);
      if (!created) {
        return NextResponse.json({ error: 'Failed to save institution in database' }, { status: 500 });
      }
      return NextResponse.json({ success: true, institution: created });
    }

    // Fallback response for unconfigured local environment
    const mockId = `inst-sub-${Date.now().toString(36)}`;
    const mockCreated = {
      ...body,
      id: mockId,
      status: 'Pending Verification',
      submittedAt: new Date().toISOString(),
      totalMembers: 1,
      currency: body.currency || '₹',
      currentAcademicYear: body.currentAcademicYear || '2024-2025',
    };

    return NextResponse.json({
      success: true,
      institution: mockCreated,
      fallback: true,
      message: 'Recorded in local fallback mode. Connect Supabase credentials in .env.local for cloud persistence.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error processing institution registration', details: error.message },
      { status: 500 }
    );
  }
}
