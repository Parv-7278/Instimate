import { getSupabaseClient } from '../client';
import { getSupabaseAdmin } from '../admin';
import { AttendanceRecord, AttendanceStatus } from '@/types';

function mapRowToAttendance(row: any): AttendanceRecord {
  return {
    id: row.id,
    studentId: row.student_id,
    studentName: row.student_name,
    rollNo: row.roll_no,
    classId: row.class_id,
    subject: row.subject || undefined,
    date: row.date,
    session: row.session || 'Full Day',
    status: row.status as AttendanceStatus,
    markedBy: row.marked_by,
    timestamp: row.created_at,
    remarks: row.remarks || undefined,
  };
}

export const attendanceService = {
  async getByInstitution(institutionId: string, date?: string): Promise<AttendanceRecord[]> {
    const supabase = getSupabaseClient() || getSupabaseAdmin();
    if (!supabase) return [];

    let query = supabase
      .from('attendance_records')
      .select('*')
      .eq('institution_id', institutionId);

    if (date) {
      query = query.eq('date', date);
    }

    const { data, error } = await query.order('date', { ascending: false });

    if (error) {
      console.error('Error fetching attendance from Supabase:', error);
      return [];
    }

    return (data || []).map(mapRowToAttendance);
  },

  async bulkMark(records: (Omit<AttendanceRecord, 'id' | 'timestamp'> & { institutionId: string })[]): Promise<boolean> {
    const supabase = getSupabaseAdmin() || getSupabaseClient();
    if (!supabase || records.length === 0) return false;

    const payload = records.map((r) => ({
      institution_id: r.institutionId,
      student_id: r.studentId,
      student_name: r.studentName,
      roll_no: r.rollNo,
      class_id: r.classId,
      subject: r.subject || null,
      date: r.date,
      session: r.session || 'Full Day',
      status: r.status,
      marked_by: r.markedBy,
      remarks: r.remarks || null,
    }));

    const { error } = await supabase
      .from('attendance_records')
      .upsert(payload, { onConflict: 'student_id,date,session' });

    if (error) {
      console.error('Error recording bulk attendance in Supabase:', error);
      return false;
    }

    return true;
  },
};
