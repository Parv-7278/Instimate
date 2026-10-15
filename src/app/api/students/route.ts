import { NextResponse } from 'next/server';
import { studentService } from '@/lib/supabase/services/studentService';
import { isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_STUDENTS } from '@/lib/seedData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const institutionId = searchParams.get('institutionId');

    if (isSupabaseConfigured() && institutionId) {
      const students = await studentService.getByInstitution(institutionId);
      return NextResponse.json({ success: true, count: students.length, students });
    }

    const filtered = institutionId
      ? INITIAL_STUDENTS.filter((s) => s.institutionId === institutionId)
      : INITIAL_STUDENTS;

    return NextResponse.json({
      success: true,
      count: filtered.length,
      students: filtered,
      fallback: !isSupabaseConfigured(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to retrieve students', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.institutionId || !body.fullName || !body.rollNo || !body.classId) {
      return NextResponse.json(
        { error: 'institutionId, fullName, rollNo, and classId are required' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      const created = await studentService.create(body);
      if (!created) {
        return NextResponse.json({ error: 'Failed to create student in Supabase' }, { status: 500 });
      }
      return NextResponse.json({ success: true, student: created });
    }

    const mockId = `stu-sub-${Date.now().toString(36)}`;
    const mockStudent = {
      ...body,
      id: mockId,
      studentId: `STU-${Date.now().toString().slice(-4)}`,
      admissionNo: body.admissionNo || `ADM-${Date.now().toString().slice(-4)}`,
      attendanceRate: 100.0,
      status: body.status || 'Active',
    };

    return NextResponse.json({
      success: true,
      student: mockStudent,
      fallback: true,
      message: 'Student added in fallback mode',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error adding student', details: error.message },
      { status: 500 }
    );
  }
}
