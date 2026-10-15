import { getSupabaseClient } from '../client';
import { getSupabaseAdmin } from '../admin';
import { Student } from '@/types';

function mapRowToStudent(row: any): Student {
  return {
    id: row.id,
    studentId: row.student_id,
    admissionNo: row.admission_no,
    rollNo: row.roll_no,
    fullName: row.full_name,
    email: row.email || '',
    phone: row.phone || '',
    gender: (row.gender as any) || 'Male',
    dob: row.dob || '',
    bloodGroup: row.blood_group || undefined,
    avatarUrl: row.avatar_url || undefined,
    institutionId: row.institution_id,
    department: row.department || '',
    course: row.course,
    classId: row.class_id,
    section: row.section,
    semester: row.semester || undefined,
    academicYear: row.academic_year,
    admissionDate: row.admission_date || '',
    status: (row.status as any) || 'Active',
    parentName: row.parent_name || '',
    parentPhone: row.parent_phone || '',
    parentEmail: row.parent_email || '',
    address: row.address || '',
    emergencyContact: row.emergency_contact || '',
    attendanceRate: Number(row.attendance_rate || 85.0),
    assignedFacultyId: row.assigned_faculty_id || undefined,
  };
}

export const studentService = {
  async getByInstitution(institutionId: string): Promise<Student[]> {
    const supabase = getSupabaseClient() || getSupabaseAdmin();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('institution_id', institutionId)
      .order('roll_no', { ascending: true });

    if (error) {
      console.error('Error fetching students from Supabase:', error);
      return [];
    }

    return (data || []).map(mapRowToStudent);
  },

  async create(student: Omit<Student, 'id' | 'studentId' | 'attendanceRate'>): Promise<Student | null> {
    const supabase = getSupabaseAdmin() || getSupabaseClient();
    if (!supabase) return null;

    const studentIdGen = `STU-${Date.now().toString().slice(-4)}`;
    const payload: any = {
      institution_id: student.institutionId,
      student_id: studentIdGen,
      admission_no: student.admissionNo,
      roll_no: student.rollNo,
      full_name: student.fullName,
      email: student.email || null,
      phone: student.phone || null,
      gender: student.gender,
      dob: student.dob || null,
      blood_group: student.bloodGroup || null,
      avatar_url: student.avatarUrl || null,
      department: student.department || null,
      course: student.course,
      class_id: student.classId,
      section: student.section,
      semester: student.semester || null,
      academic_year: student.academicYear,
      admission_date: student.admissionDate || new Date().toISOString().split('T')[0],
      status: student.status || 'Active',
      parent_name: student.parentName || null,
      parent_phone: student.parentPhone || null,
      parent_email: student.parentEmail || null,
      address: student.address || null,
      emergency_contact: student.emergencyContact || null,
      attendance_rate: 100.0,
      assigned_faculty_id: student.assignedFacultyId || null,
    };

    const { data, error } = await supabase
      .from('students')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('Error creating student in Supabase:', error);
      return null;
    }

    return mapRowToStudent(data);
  },

  async update(id: string, updates: Partial<Student>): Promise<boolean> {
    const supabase = getSupabaseAdmin() || getSupabaseClient();
    if (!supabase) return false;

    const rowUpdates: any = {};
    if (updates.fullName) rowUpdates.full_name = updates.fullName;
    if (updates.email !== undefined) rowUpdates.email = updates.email;
    if (updates.phone !== undefined) rowUpdates.phone = updates.phone;
    if (updates.classId) rowUpdates.class_id = updates.classId;
    if (updates.section) rowUpdates.section = updates.section;
    if (updates.status) rowUpdates.status = updates.status;
    if (updates.attendanceRate !== undefined) rowUpdates.attendance_rate = updates.attendanceRate;

    const { error } = await supabase
      .from('students')
      .update(rowUpdates)
      .eq('id', id);

    if (error) {
      console.error('Error updating student in Supabase:', error);
      return false;
    }

    return true;
  },

  async delete(id: string): Promise<boolean> {
    const supabase = getSupabaseAdmin() || getSupabaseClient();
    if (!supabase) return false;

    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting student from Supabase:', error);
      return false;
    }

    return true;
  },
};
