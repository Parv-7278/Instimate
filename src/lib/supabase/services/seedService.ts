import { getSupabaseAdmin, getSupabaseClient } from '../client';
import {
  INITIAL_INSTITUTIONS,
  DEMO_USERS,
  INITIAL_STUDENTS,
  INITIAL_FACULTY,
  INITIAL_CORPORATE_STAFF,
  INITIAL_CIRCULARS,
} from '@/lib/seedData';

export const seedService = {
  async seedIfEmpty(): Promise<{ seeded: boolean; message: string }> {
    const supabase = getSupabaseAdmin() || getSupabaseClient();
    if (!supabase) {
      return { seeded: false, message: 'Supabase client not configured' };
    }

    try {
      // Check if institutions table already has data
      const { count, error } = await supabase
        .from('institutions')
        .select('*', { count: 'exact', head: true });

      if (error) {
        return { seeded: false, message: `Database error: ${error.message}` };
      }

      if (count && count > 0) {
        return { seeded: false, message: `Database already populated with ${count} institutions` };
      }

      // Seed Institutions
      for (const inst of INITIAL_INSTITUTIONS) {
        await supabase.from('institutions').insert({
          id: inst.id,
          name: inst.name,
          code: inst.code,
          slug: inst.slug,
          type: inst.type,
          status: inst.status,
          logo_url: inst.logoUrl || null,
          address: inst.address,
          city: inst.city,
          state: inst.state,
          country: inst.country,
          phone: inst.phone,
          email: inst.email,
          website: inst.website || null,
          currency: inst.currency,
          current_academic_year: inst.currentAcademicYear,
          representative_name: inst.representativeName,
          representative_designation: inst.representativeDesignation,
          representative_email: inst.representativeEmail,
          representative_phone: inst.representativePhone,
          enabled_modules: inst.enabledModules,
          total_members: inst.totalMembers,
          total_students: inst.totalStudents || 0,
          total_faculty: inst.totalFaculty || 0,
        } as any);
      }

      // Seed Corporate Staff
      for (const staff of INITIAL_CORPORATE_STAFF) {
        await supabase.from('corporate_staff').insert({
          id: staff.id,
          institution_id: staff.institutionId,
          employee_id: staff.employeeId,
          full_name: staff.fullName,
          email: staff.email,
          phone: staff.phone,
          department: staff.department,
          designation: staff.designation,
          employment_type: staff.employmentType,
          work_mode: staff.workMode,
          joining_date: staff.joiningDate,
          status: staff.status,
          basic_salary: staff.basicSalary,
          allowances: staff.allowances,
          deductions: staff.deductions,
          leave_balance: staff.leaveBalance,
          reporting_manager: staff.reportingManager,
        } as any);
      }

      // Seed Government Circulars
      for (const circ of INITIAL_CIRCULARS) {
        await supabase.from('government_circulars').insert({
          id: circ.id,
          institution_id: circ.institutionId,
          circular_number: circ.circularNumber,
          subject: circ.subject,
          issuing_department: circ.issuingDepartment,
          signatory: circ.signatory,
          classification: circ.classification,
          published_date: circ.publishedDate,
          content: circ.content,
          attachments: circ.attachments || [],
        } as any);
      }

      return { seeded: true, message: 'Supabase database successfully initialized with demo seed data' };
    } catch (err: any) {
      return { seeded: false, message: `Seed error: ${err.message}` };
    }
  },
};
