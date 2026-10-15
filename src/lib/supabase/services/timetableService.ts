import { getSupabaseClient } from '../client';
import { getSupabaseAdmin } from '../admin';
import { TimetableSlot } from '@/types';

export const timetableService = {
  async getByInstitution(institutionId: string, classId?: string): Promise<TimetableSlot[]> {
    const supabase = getSupabaseClient() || getSupabaseAdmin();
    if (!supabase) return [];

    let query = supabase
      .from('timetable_slots')
      .select('*')
      .eq('institution_id', institutionId);

    if (classId) {
      query = query.eq('class_id', classId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching timetable from Supabase:', error);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      day: row.day as any,
      timeSlot: row.time_slot,
      subject: row.subject,
      facultyId: row.faculty_id || '',
      facultyName: row.faculty_name,
      classroom: row.classroom,
      classId: row.class_id,
      color: row.color,
      isBreak: row.is_break,
    }));
  },

  async createSlot(
    slot: Omit<TimetableSlot, 'id'> & { institutionId: string }
  ): Promise<{ success: boolean; conflictMessage?: string; slot?: TimetableSlot }> {
    const supabase = getSupabaseAdmin() || getSupabaseClient();
    if (!supabase) {
      return { success: false, conflictMessage: 'Supabase client unavailable' };
    }

    // 1. Check classroom collision
    const { data: roomClash } = await supabase
      .from('timetable_slots')
      .select('*')
      .eq('institution_id', slot.institutionId)
      .eq('classroom', slot.classroom)
      .eq('day', slot.day)
      .eq('time_slot', slot.timeSlot)
      .maybeSingle();

    if (roomClash) {
      return {
        success: false,
        conflictMessage: `Room Collision: ${slot.classroom} is already occupied on ${slot.day} at ${slot.timeSlot} by ${roomClash.faculty_name} (${roomClash.subject}).`,
      };
    }

    // 2. Check faculty collision
    if (slot.facultyId) {
      const { data: facultyClash } = await supabase
        .from('timetable_slots')
        .select('*')
        .eq('institution_id', slot.institutionId)
        .eq('faculty_id', slot.facultyId)
        .eq('day', slot.day)
        .eq('time_slot', slot.timeSlot)
        .maybeSingle();

      if (facultyClash) {
        return {
          success: false,
          conflictMessage: `Faculty Double-Booking: ${slot.facultyName} is already assigned to ${facultyClash.classroom} for ${facultyClash.class_id} at this time.`,
        };
      }
    }

    // 3. Insert slot
    const payload: any = {
      institution_id: slot.institutionId,
      day: slot.day,
      time_slot: slot.timeSlot,
      subject: slot.subject,
      faculty_id: slot.facultyId || null,
      faculty_name: slot.facultyName,
      classroom: slot.classroom,
      class_id: slot.classId,
      color: slot.color || '#0d9488',
      is_break: Boolean(slot.isBreak),
    };

    const { data, error } = await supabase
      .from('timetable_slots')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('Error inserting timetable slot in Supabase:', error);
      return { success: false, conflictMessage: error.message };
    }

    return {
      success: true,
      slot: {
        id: data.id,
        day: data.day as any,
        timeSlot: data.time_slot,
        subject: data.subject,
        facultyId: data.faculty_id || '',
        facultyName: data.faculty_name,
        classroom: data.classroom,
        classId: data.class_id,
        color: data.color,
        isBreak: data.is_break,
      },
    };
  },
};
