export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      institutions: {
        Row: {
          id: string;
          name: string;
          code: string;
          slug: string;
          type:
            | 'school'
            | 'college'
            | 'university'
            | 'coaching'
            | 'corporate'
            | 'government'
            | 'public_sector'
            | 'hospital'
            | 'ngo'
            | 'training_centre';
          status:
            | 'Draft'
            | 'Pending Verification'
            | 'Under Review'
            | 'Approved'
            | 'Rejected'
            | 'Suspended'
            | 'Active';
          logo_url: string | null;
          address: string;
          city: string;
          state: string;
          country: string;
          phone: string;
          email: string;
          website: string | null;
          currency: string;
          current_academic_year: string;
          affiliation_number: string | null;
          board_or_university: string | null;
          company_reg_number: string | null;
          department_jurisdiction: string | null;
          representative_name: string;
          representative_designation: string;
          representative_email: string;
          representative_phone: string;
          enabled_modules: string[];
          total_members: number;
          total_students: number;
          total_faculty: number;
          verification_notes: string | null;
          rejection_reason: string | null;
          verified_at: string | null;
          submitted_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['institutions']['Row']> & {
          name: string;
          code: string;
          slug: string;
          type: Database['public']['Tables']['institutions']['Row']['type'];
          address: string;
          phone: string;
          email: string;
          representative_name: string;
          representative_designation: string;
          representative_email: string;
          representative_phone: string;
        };
        Update: Partial<Database['public']['Tables']['institutions']['Row']>;
      };
      profiles: {
        Row: {
          id: string;
          institution_id: string | null;
          email: string;
          full_name: string;
          role: string;
          avatar_url: string | null;
          phone: string | null;
          department: string | null;
          designation: string | null;
          member_id: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & {
          email: string;
          full_name: string;
          role: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Row']>;
      };
      students: {
        Row: {
          id: string;
          institution_id: string;
          student_id: string;
          admission_no: string;
          roll_no: string;
          full_name: string;
          email: string | null;
          phone: string | null;
          gender: string;
          dob: string | null;
          blood_group: string | null;
          avatar_url: string | null;
          department: string | null;
          course: string;
          class_id: string;
          section: string;
          semester: string | null;
          academic_year: string;
          admission_date: string;
          status: string;
          parent_name: string | null;
          parent_phone: string | null;
          parent_email: string | null;
          address: string | null;
          emergency_contact: string | null;
          attendance_rate: number;
          assigned_faculty_id: string | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['students']['Row']> & {
          institution_id: string;
          student_id: string;
          admission_no: string;
          roll_no: string;
          full_name: string;
          course: string;
          class_id: string;
          section: string;
          academic_year: string;
        };
        Update: Partial<Database['public']['Tables']['students']['Row']>;
      };
      faculty: {
        Row: {
          id: string;
          institution_id: string;
          employee_id: string;
          full_name: string;
          email: string;
          phone: string | null;
          department: string;
          qualification: string;
          designation: string;
          avatar_url: string | null;
          subjects: string[];
          assigned_classes: string[];
          employment_type: string;
          joining_date: string;
          status: string;
          leave_balance: number;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['faculty']['Row']> & {
          institution_id: string;
          employee_id: string;
          full_name: string;
          email: string;
          department: string;
          qualification: string;
          designation: string;
        };
        Update: Partial<Database['public']['Tables']['faculty']['Row']>;
      };
      attendance_records: {
        Row: {
          id: string;
          institution_id: string;
          student_id: string;
          student_name: string;
          roll_no: string;
          class_id: string;
          subject: string | null;
          date: string;
          session: string;
          status: string;
          marked_by: string;
          remarks: string | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['attendance_records']['Row']> & {
          institution_id: string;
          student_id: string;
          student_name: string;
          roll_no: string;
          class_id: string;
          status: string;
          marked_by: string;
        };
        Update: Partial<Database['public']['Tables']['attendance_records']['Row']>;
      };
      timetable_slots: {
        Row: {
          id: string;
          institution_id: string;
          day: string;
          time_slot: string;
          subject: string;
          faculty_id: string | null;
          faculty_name: string;
          classroom: string;
          class_id: string;
          color: string;
          is_break: boolean;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['timetable_slots']['Row']> & {
          institution_id: string;
          day: string;
          time_slot: string;
          subject: string;
          faculty_name: string;
          classroom: string;
          class_id: string;
        };
        Update: Partial<Database['public']['Tables']['timetable_slots']['Row']>;
      };
      corporate_staff: {
        Row: {
          id: string;
          institution_id: string;
          employee_id: string;
          full_name: string;
          email: string;
          phone: string | null;
          department: string;
          designation: string;
          avatar_url: string | null;
          employment_type: string;
          work_mode: string;
          joining_date: string;
          status: string;
          basic_salary: number;
          allowances: number;
          deductions: number;
          leave_balance: number;
          reporting_manager: string | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['corporate_staff']['Row']> & {
          institution_id: string;
          employee_id: string;
          full_name: string;
          email: string;
          department: string;
          designation: string;
        };
        Update: Partial<Database['public']['Tables']['corporate_staff']['Row']>;
      };
      employee_clock_records: {
        Row: {
          id: string;
          institution_id: string;
          employee_id: string;
          employee_name: string;
          date: string;
          clock_in_time: string;
          clock_out_time: string | null;
          work_mode: string;
          duration_hours: number | null;
          status: string;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['employee_clock_records']['Row']> & {
          institution_id: string;
          employee_id: string;
          employee_name: string;
          clock_in_time: string;
          work_mode: string;
        };
        Update: Partial<Database['public']['Tables']['employee_clock_records']['Row']>;
      };
      government_circulars: {
        Row: {
          id: string;
          institution_id: string;
          circular_number: string;
          subject: string;
          issuing_department: string;
          signatory: string;
          classification: string;
          published_date: string;
          content: string;
          attachments: string[];
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['government_circulars']['Row']> & {
          institution_id: string;
          circular_number: string;
          subject: string;
          issuing_department: string;
          signatory: string;
          classification: string;
          content: string;
        };
        Update: Partial<Database['public']['Tables']['government_circulars']['Row']>;
      };
      file_tracking_records: {
        Row: {
          id: string;
          institution_id: string;
          file_number: string;
          subject: string;
          initiating_officer: string;
          current_desk: string;
          priority: string;
          status: string;
          last_moved_at: string;
          remarks: string | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['file_tracking_records']['Row']> & {
          institution_id: string;
          file_number: string;
          subject: string;
          initiating_officer: string;
          current_desk: string;
          priority: string;
          status: string;
        };
        Update: Partial<Database['public']['Tables']['file_tracking_records']['Row']>;
      };
      fee_invoices: {
        Row: {
          id: string;
          institution_id: string;
          invoice_number: string;
          student_id: string;
          student_name: string;
          roll_no: string;
          class_id: string;
          title: string;
          category: string;
          total_amount: number;
          paid_amount: number;
          due_amount: number;
          due_date: string;
          status: string;
          payment_date: string | null;
          transaction_id: string | null;
          payment_method: string | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['fee_invoices']['Row']> & {
          institution_id: string;
          invoice_number: string;
          student_id: string;
          student_name: string;
          roll_no: string;
          class_id: string;
          title: string;
          category: string;
          total_amount: number;
          due_amount: number;
          due_date: string;
        };
        Update: Partial<Database['public']['Tables']['fee_invoices']['Row']>;
      };
      classrooms: {
        Row: {
          id: string;
          institution_id: string;
          room_number: string;
          building: string;
          floor: string;
          capacity: number;
          current_student_count: number;
          campus: string;
          assigned_class: string | null;
          class_teacher: string | null;
          amenities: string[];
          status: string;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['classrooms']['Row']> & {
          institution_id: string;
          room_number: string;
          building: string;
          floor: string;
          capacity: number;
        };
        Update: Partial<Database['public']['Tables']['classrooms']['Row']>;
      };
      payroll_records: {
        Row: {
          id: string;
          institution_id: string;
          employee_id: string;
          employee_name: string;
          designation: string;
          department: string;
          month: string;
          basic_pay: number;
          allowances: number;
          gross_pay: number;
          tax_deductions: number;
          pf_deductions: number;
          total_deductions: number;
          net_pay: number;
          status: string;
          payment_date: string | null;
          payment_ref: string | null;
          payslip_number: string;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['payroll_records']['Row']> & {
          institution_id: string;
          employee_id: string;
          employee_name: string;
          designation: string;
          department: string;
          month: string;
          basic_pay: number;
          allowances: number;
          gross_pay: number;
          tax_deductions: number;
          pf_deductions: number;
          total_deductions: number;
          net_pay: number;
          payslip_number: string;
        };
        Update: Partial<Database['public']['Tables']['payroll_records']['Row']>;
      };
      payment_transactions: {
        Row: {
          id: string;
          invoice_id: string | null;
          student_id: string | null;
          amount: number;
          currency: string;
          payment_method: string;
          razorpay_order_id: string | null;
          razorpay_payment_id: string | null;
          status: string;
          receipt_number: string;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['payment_transactions']['Row']> & {
          amount: number;
          payment_method: string;
          receipt_number: string;
        };
        Update: Partial<Database['public']['Tables']['payment_transactions']['Row']>;
      };
    };
  };
}
