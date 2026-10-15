import { getSupabaseClient } from '../client';
import { getSupabaseAdmin } from '../admin';
import { GovernmentCircular, FileTrackingRecord } from '@/types';

export const governmentService = {
  async getCirculars(institutionId: string): Promise<GovernmentCircular[]> {
    const supabase = getSupabaseClient() || getSupabaseAdmin();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('government_circulars')
      .select('*')
      .eq('institution_id', institutionId)
      .order('published_date', { ascending: false });

    if (error) {
      console.error('Error fetching circulars from Supabase:', error);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      institutionId: row.institution_id,
      circularNumber: row.circular_number,
      subject: row.subject,
      issuingDepartment: row.issuing_department,
      signatory: row.signatory,
      classification: row.classification as any,
      publishedDate: row.published_date,
      content: row.content,
      attachments: row.attachments || [],
    }));
  },

  async createCircular(circular: Omit<GovernmentCircular, 'id' | 'publishedDate'>): Promise<GovernmentCircular | null> {
    const supabase = getSupabaseAdmin() || getSupabaseClient();
    if (!supabase) return null;

    const payload: any = {
      institution_id: circular.institutionId,
      circular_number: circular.circularNumber,
      subject: circular.subject,
      issuing_department: circular.issuingDepartment,
      signatory: circular.signatory,
      classification: circular.classification,
      published_date: new Date().toISOString().split('T')[0],
      content: circular.content,
      attachments: circular.attachments || [],
    };

    const { data, error } = await supabase
      .from('government_circulars')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('Error creating circular in Supabase:', error);
      return null;
    }

    return {
      id: data.id,
      institutionId: data.institution_id,
      circularNumber: data.circular_number,
      subject: data.subject,
      issuingDepartment: data.issuing_department,
      signatory: data.signatory,
      classification: data.classification as any,
      publishedDate: data.published_date,
      content: data.content,
      attachments: data.attachments || [],
    };
  },

  async getFileTracking(institutionId: string): Promise<FileTrackingRecord[]> {
    const supabase = getSupabaseClient() || getSupabaseAdmin();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('file_tracking_records')
      .select('*')
      .eq('institution_id', institutionId)
      .order('last_moved_at', { ascending: false });

    if (error) {
      console.error('Error fetching file tracking records from Supabase:', error);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      institutionId: row.institution_id,
      fileNumber: row.file_number,
      subject: row.subject,
      initiatingOfficer: row.initiating_officer,
      currentDesk: row.current_desk,
      priority: row.priority as any,
      status: row.status as any,
      lastMovedAt: row.last_moved_at,
      remarks: row.remarks || '',
    }));
  },

  async moveFileDesk(fileId: string, nextDesk: string, remarks: string): Promise<boolean> {
    const supabase = getSupabaseAdmin() || getSupabaseClient();
    if (!supabase) return false;

    const { error } = await supabase
      .from('file_tracking_records')
      .update({
        current_desk: nextDesk,
        remarks: remarks,
        last_moved_at: new Date().toISOString(),
      })
      .eq('id', fileId);

    if (error) {
      console.error('Error moving file desk in Supabase:', error);
      return false;
    }

    return true;
  },
};
