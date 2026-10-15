import { getSupabaseClient } from '../client';
import { getSupabaseAdmin } from '../admin';
import { Classroom } from '@/types';

function mapRowToClassroom(row: any): Classroom {
  return {
    id: row.id,
    roomNumber: row.room_number,
    building: row.building,
    floor: row.floor,
    capacity: Number(row.capacity),
    currentStudentCount: Number(row.current_student_count || 0),
    campus: row.campus || 'Main Campus',
    assignedClass: row.assigned_class || undefined,
    classTeacher: row.class_teacher || undefined,
    amenities: Array.isArray(row.amenities) ? row.amenities : [],
    status: (row.status as any) || 'Available',
  };
}

export const classroomService = {
  async getByInstitution(institutionId: string): Promise<Classroom[]> {
    const supabase = getSupabaseClient() || getSupabaseAdmin();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('classrooms')
      .select('*')
      .eq('institution_id', institutionId)
      .order('room_number', { ascending: true });

    if (error) {
      console.error('Error fetching classrooms from Supabase:', error);
      return [];
    }

    return (data || []).map(mapRowToClassroom);
  },

  async create(
    classroom: Omit<Classroom, 'id'> & { institutionId: string }
  ): Promise<Classroom | null> {
    const supabase = getSupabaseAdmin() || getSupabaseClient();
    if (!supabase) return null;

    const payload: any = {
      institution_id: classroom.institutionId,
      room_number: classroom.roomNumber,
      building: classroom.building,
      floor: classroom.floor,
      capacity: classroom.capacity,
      current_student_count: classroom.currentStudentCount,
      campus: classroom.campus,
      assigned_class: classroom.assignedClass || null,
      class_teacher: classroom.classTeacher || null,
      amenities: classroom.amenities || [],
      status: classroom.status || 'Available',
    };

    const { data, error } = await supabase
      .from('classrooms')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('Error creating classroom in Supabase:', error);
      return null;
    }

    return mapRowToClassroom(data);
  },

  async update(id: string, updates: Partial<Classroom>): Promise<boolean> {
    const supabase = getSupabaseAdmin() || getSupabaseClient();
    if (!supabase) return false;

    const payload: any = {};
    if (updates.roomNumber !== undefined) payload.room_number = updates.roomNumber;
    if (updates.building !== undefined) payload.building = updates.building;
    if (updates.floor !== undefined) payload.floor = updates.floor;
    if (updates.capacity !== undefined) payload.capacity = updates.capacity;
    if (updates.currentStudentCount !== undefined) payload.current_student_count = updates.currentStudentCount;
    if (updates.campus !== undefined) payload.campus = updates.campus;
    if (updates.assignedClass !== undefined) payload.assigned_class = updates.assignedClass;
    if (updates.classTeacher !== undefined) payload.class_teacher = updates.classTeacher;
    if (updates.amenities !== undefined) payload.amenities = updates.amenities;
    if (updates.status !== undefined) payload.status = updates.status;

    const { error } = await supabase
      .from('classrooms')
      .update(payload)
      .eq('id', id);

    if (error) {
      console.error('Error updating classroom in Supabase:', error);
      return false;
    }

    return true;
  },

  async delete(id: string): Promise<boolean> {
    const supabase = getSupabaseAdmin() || getSupabaseClient();
    if (!supabase) return false;

    const { error } = await supabase
      .from('classrooms')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting classroom in Supabase:', error);
      return false;
    }

    return true;
  },
};
