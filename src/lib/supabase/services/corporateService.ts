import { getSupabaseClient } from '../client';
import { getSupabaseAdmin } from '../admin';
import { CorporateStaff, EmployeeClockRecord, PayrollRecord } from '@/types';

export const corporateService = {
  async getStaff(institutionId: string): Promise<CorporateStaff[]> {
    const supabase = getSupabaseClient() || getSupabaseAdmin();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('corporate_staff')
      .select('*')
      .eq('institution_id', institutionId)
      .order('full_name', { ascending: true });

    if (error) {
      console.error('Error fetching corporate staff from Supabase:', error);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      employeeId: row.employee_id,
      fullName: row.full_name,
      email: row.email,
      phone: row.phone || '',
      department: row.department,
      designation: row.designation,
      institutionId: row.institution_id,
      avatarUrl: row.avatar_url || undefined,
      employmentType: row.employment_type as any,
      workMode: row.work_mode as any,
      joiningDate: row.joining_date,
      status: row.status as any,
      basicSalary: Number(row.basic_salary),
      allowances: Number(row.allowances),
      deductions: Number(row.deductions),
      leaveBalance: row.leave_balance,
      reportingManager: row.reporting_manager || '',
    }));
  },

  async clockIn(
    institutionId: string,
    employeeId: string,
    employeeName: string,
    workMode: 'Office' | 'Remote' | 'Client Site'
  ): Promise<EmployeeClockRecord | null> {
    const supabase = getSupabaseAdmin() || getSupabaseClient();
    if (!supabase) return null;

    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const payload: any = {
      institution_id: institutionId,
      employee_id: employeeId,
      employee_name: employeeName,
      date: today,
      clock_in_time: nowTime,
      work_mode: workMode,
      status: 'Present',
    };

    const { data, error } = await supabase
      .from('employee_clock_records')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('Error recording employee clock-in in Supabase:', error);
      return null;
    }

    return {
      id: data.id,
      institutionId: data.institution_id,
      employeeId: data.employee_id,
      employeeName: data.employee_name,
      date: data.date,
      clockInTime: data.clock_in_time,
      workMode: data.work_mode as any,
      status: data.status as any,
    };
  },

  async clockOut(recordId: string, durationHours: number): Promise<boolean> {
    const supabase = getSupabaseAdmin() || getSupabaseClient();
    if (!supabase) return false;

    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const { error } = await supabase
      .from('employee_clock_records')
      .update({
        clock_out_time: nowTime,
        duration_hours: durationHours,
        status: durationHours > 8.5 ? 'Overtime' : 'Present',
      })
      .eq('id', recordId);

    if (error) {
      console.error('Error recording employee clock-out in Supabase:', error);
      return false;
    }

    return true;
  },

  async getClockRecords(institutionId: string, date?: string): Promise<EmployeeClockRecord[]> {
    const supabase = getSupabaseClient() || getSupabaseAdmin();
    if (!supabase) return [];

    let query = supabase
      .from('employee_clock_records')
      .select('*')
      .eq('institution_id', institutionId);

    if (date) {
      query = query.eq('date', date);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching employee clock records from Supabase:', error);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      institutionId: row.institution_id,
      employeeId: row.employee_id,
      employeeName: row.employee_name,
      date: row.date,
      clockInTime: row.clock_in_time,
      clockOutTime: row.clock_out_time || undefined,
      workMode: row.work_mode as any,
      durationHours: row.duration_hours ? Number(row.duration_hours) : undefined,
      status: row.status as any,
    }));
  },

  async getPayrollRecords(institutionId: string): Promise<PayrollRecord[]> {
    const supabase = getSupabaseClient() || getSupabaseAdmin();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('payroll_records')
      .select('*')
      .eq('institution_id', institutionId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payroll records from Supabase:', error);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      institutionId: row.institution_id,
      employeeId: row.employee_id,
      employeeName: row.employee_name,
      designation: row.designation,
      department: row.department,
      month: row.month,
      basicPay: Number(row.basic_pay),
      allowances: Number(row.allowances),
      grossPay: Number(row.gross_pay),
      taxDeductions: Number(row.tax_deductions),
      pfDeductions: Number(row.pf_deductions),
      totalDeductions: Number(row.total_deductions),
      netPay: Number(row.net_pay),
      status: row.status as any,
      paymentDate: row.payment_date || undefined,
      paymentRef: row.payment_ref || undefined,
      payslipNumber: row.payslip_number,
    }));
  },

  async createPayroll(
    record: Omit<PayrollRecord, 'id'>
  ): Promise<PayrollRecord | null> {
    const supabase = getSupabaseAdmin() || getSupabaseClient();
    if (!supabase) return null;

    const payload: any = {
      institution_id: record.institutionId,
      employee_id: record.employeeId,
      employee_name: record.employeeName,
      designation: record.designation,
      department: record.department,
      month: record.month,
      basic_pay: record.basicPay,
      allowances: record.allowances,
      gross_pay: record.grossPay,
      tax_deductions: record.taxDeductions,
      pf_deductions: record.pfDeductions,
      total_deductions: record.totalDeductions,
      net_pay: record.netPay,
      status: record.status || 'Draft',
      payment_date: record.paymentDate || null,
      payment_ref: record.paymentRef || null,
      payslip_number: record.payslipNumber,
    };

    const { data, error } = await supabase
      .from('payroll_records')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('Error creating payroll in Supabase:', error);
      return null;
    }

    return {
      id: data.id,
      institutionId: data.institution_id,
      employeeId: data.employee_id,
      employeeName: data.employee_name,
      designation: data.designation,
      department: data.department,
      month: data.month,
      basicPay: Number(data.basic_pay),
      allowances: Number(data.allowances),
      grossPay: Number(data.gross_pay),
      taxDeductions: Number(data.tax_deductions),
      pfDeductions: Number(data.pf_deductions),
      totalDeductions: Number(data.total_deductions),
      netPay: Number(data.net_pay),
      status: data.status as any,
      paymentDate: data.payment_date || undefined,
      paymentRef: data.payment_ref || undefined,
      payslipNumber: data.payslip_number,
    };
  },

  async updatePayrollStatus(
    recordId: string,
    status: 'Draft' | 'Approved' | 'Paid',
    paymentRef?: string
  ): Promise<boolean> {
    const supabase = getSupabaseAdmin() || getSupabaseClient();
    if (!supabase) return false;

    const updatePayload: any = {
      status,
      ...(status === 'Paid' ? { payment_date: new Date().toISOString().split('T')[0] } : {}),
      ...(paymentRef ? { payment_ref: paymentRef } : {}),
    };

    const { error } = await supabase
      .from('payroll_records')
      .update(updatePayload)
      .eq('id', recordId);

    if (error) {
      console.error('Error updating payroll status in Supabase:', error);
      return false;
    }

    return true;
  },
};
