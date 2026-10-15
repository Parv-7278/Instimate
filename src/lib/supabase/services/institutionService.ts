import { getSupabaseClient } from '../client';
import { getSupabaseAdmin } from '../admin';
import { Institution, VerificationStatus, InstitutionType } from '@/types';

function mapRowToInstitution(row: any): Institution {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    slug: row.slug,
    type: row.type as InstitutionType,
    status: row.status as VerificationStatus,
    logoUrl: row.logo_url || undefined,
    address: row.address,
    city: row.city,
    state: row.state,
    country: row.country,
    phone: row.phone,
    email: row.email,
    website: row.website || undefined,
    currency: row.currency || '₹',
    currentAcademicYear: row.current_academic_year || '2024-2025',
    submittedAt: row.submitted_at || row.created_at,
    verifiedAt: row.verified_at || undefined,
    verificationNotes: row.verification_notes || undefined,
    rejectionReason: row.rejection_reason || undefined,
    affiliationNumber: row.affiliation_number || undefined,
    boardOrUniversity: row.board_or_university || undefined,
    companyRegNumber: row.company_reg_number || undefined,
    departmentJurisdiction: row.department_jurisdiction || undefined,
    representativeName: row.representative_name,
    representativeDesignation: row.representative_designation,
    representativeEmail: row.representative_email,
    representativePhone: row.representative_phone,
    enabledModules: row.enabled_modules || [],
    totalMembers: row.total_members || 1,
    totalStudents: row.total_students || 0,
    totalFaculty: row.total_faculty || 0,
  };
}

export const institutionService = {
  async getAll(): Promise<Institution[]> {
    const supabase = getSupabaseClient() || getSupabaseAdmin();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('institutions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching institutions from Supabase:', error);
      return [];
    }

    return (data || []).map(mapRowToInstitution);
  },

  async getById(id: string): Promise<Institution | null> {
    const supabase = getSupabaseClient() || getSupabaseAdmin();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('institutions')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return mapRowToInstitution(data);
  },

  async getByCodeOrSlug(identifier: string): Promise<Institution | null> {
    const supabase = getSupabaseClient() || getSupabaseAdmin();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('institutions')
      .select('*')
      .or(`code.ilike.${identifier},slug.ilike.${identifier}`)
      .maybeSingle();

    if (error || !data) return null;
    return mapRowToInstitution(data);
  },

  async create(inst: Omit<Institution, 'id' | 'status' | 'submittedAt' | 'totalMembers'>): Promise<Institution | null> {
    const supabase = getSupabaseAdmin() || getSupabaseClient();
    if (!supabase) return null;

    const insertPayload: any = {
      name: inst.name,
      code: inst.code,
      slug: inst.slug || inst.code.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      type: inst.type,
      status: 'Pending Verification',
      logo_url: inst.logoUrl || null,
      address: inst.address,
      city: inst.city || 'New Delhi',
      state: inst.state || 'Delhi',
      country: inst.country || 'India',
      phone: inst.phone,
      email: inst.email,
      website: inst.website || null,
      currency: inst.currency || '₹',
      current_academic_year: inst.currentAcademicYear || '2024-2025',
      affiliation_number: inst.affiliationNumber || null,
      board_or_university: inst.boardOrUniversity || null,
      company_reg_number: inst.companyRegNumber || null,
      department_jurisdiction: inst.departmentJurisdiction || null,
      representative_name: inst.representativeName,
      representative_designation: inst.representativeDesignation,
      representative_email: inst.representativeEmail,
      representative_phone: inst.representativePhone,
      enabled_modules: inst.enabledModules || [],
      total_members: 1,
      total_students: inst.totalStudents || 0,
      total_faculty: inst.totalFaculty || 0,
    };

    const { data, error } = await supabase
      .from('institutions')
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.error('Error inserting institution in Supabase:', error);
      return null;
    }

    return mapRowToInstitution(data);
  },

  async updateStatus(
    id: string,
    status: VerificationStatus,
    notes?: string,
    rejectionReason?: string
  ): Promise<boolean> {
    const supabase = getSupabaseAdmin() || getSupabaseClient();
    if (!supabase) return false;

    const updates: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === 'Approved' || status === 'Active') {
      updates.verified_at = new Date().toISOString();
      if (notes) updates.verification_notes = notes;
    } else if (status === 'Rejected') {
      if (rejectionReason) updates.rejection_reason = rejectionReason;
    } else if (notes) {
      updates.verification_notes = notes;
    }

    const { error } = await supabase
      .from('institutions')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating institution status in Supabase:', error);
      return false;
    }

    return true;
  },
};
