-- ====================================================================
-- INSTITUTION HUB: COMPLETE SUPABASE BACKEND PRODUCTION SCHEMA
-- Supports 10 Institution Types, 13 Roles, Multi-Tenancy RLS & Triggers
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. INSTITUTIONS (Multi-Tenant Root)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS institutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN (
    'school', 'college', 'university', 'coaching', 'corporate',
    'government', 'public_sector', 'hospital', 'ngo', 'training_centre'
  )),
  status VARCHAR(50) NOT NULL DEFAULT 'Pending Verification' CHECK (status IN (
    'Draft', 'Pending Verification', 'Under Review', 'Approved', 'Rejected', 'Suspended', 'Active'
  )),
  logo_url TEXT,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL DEFAULT 'New Delhi',
  state VARCHAR(100) NOT NULL DEFAULT 'Delhi',
  country VARCHAR(100) NOT NULL DEFAULT 'India',
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  website TEXT,
  currency VARCHAR(10) DEFAULT '₹',
  current_academic_year VARCHAR(50) DEFAULT '2024-2025',
  
  -- Regulatory & Affiliation fields
  affiliation_number VARCHAR(100),
  board_or_university VARCHAR(100),
  company_reg_number VARCHAR(100),
  department_jurisdiction VARCHAR(100),
  
  -- Authorized Representative
  representative_name VARCHAR(255) NOT NULL,
  representative_designation VARCHAR(100) NOT NULL,
  representative_email VARCHAR(255) NOT NULL,
  representative_phone VARCHAR(50) NOT NULL,
  
  -- Modules & Status Metadata
  enabled_modules TEXT[] DEFAULT '{}',
  total_members INT DEFAULT 1,
  total_students INT DEFAULT 0,
  total_faculty INT DEFAULT 0,
  verification_notes TEXT,
  rejection_reason TEXT,
  verified_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_institutions_code ON institutions(code);
CREATE INDEX IF NOT EXISTS idx_institutions_type ON institutions(type);
CREATE INDEX IF NOT EXISTS idx_institutions_status ON institutions(status);

-- --------------------------------------------------------------------
-- 2. USER PROFILES & ROLES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN (
    'super_admin', 'institution_owner', 'institution_admin', 'principal',
    'faculty', 'student', 'parent', 'accountant', 'hr_staff',
    'corporate_employee', 'govt_officer', 'librarian', 'auditor'
  )),
  avatar_url TEXT,
  phone VARCHAR(50),
  department VARCHAR(100),
  designation VARCHAR(100),
  member_id VARCHAR(50),
  status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Pending Activation', 'Suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_inst_user_email UNIQUE (institution_id, email)
);

CREATE INDEX IF NOT EXISTS idx_profiles_institution ON profiles(institution_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- --------------------------------------------------------------------
-- 3. CLASSROOMS & FACILITIES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS classrooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  room_number VARCHAR(50) NOT NULL,
  building VARCHAR(100) NOT NULL,
  floor VARCHAR(50) NOT NULL,
  capacity INT NOT NULL DEFAULT 40,
  current_student_count INT DEFAULT 0,
  campus VARCHAR(100) DEFAULT 'Main Campus',
  assigned_class VARCHAR(50),
  class_teacher VARCHAR(255),
  amenities TEXT[] DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'Available' CHECK (status IN ('Available', 'Occupied', 'Maintenance')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_classrooms_institution ON classrooms(institution_id);

-- --------------------------------------------------------------------
-- 4. FACULTY & INSTRUCTORS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS faculty (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  employee_id VARCHAR(50) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  department VARCHAR(100) NOT NULL,
  qualification TEXT NOT NULL,
  designation VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  subjects TEXT[] DEFAULT '{}',
  assigned_classes TEXT[] DEFAULT '{}',
  employment_type VARCHAR(50) DEFAULT 'Permanent',
  joining_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'On Leave', 'Inactive')),
  leave_balance INT DEFAULT 15,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_inst_faculty_employee_id UNIQUE (institution_id, employee_id)
);

CREATE INDEX IF NOT EXISTS idx_faculty_institution ON faculty(institution_id);

-- --------------------------------------------------------------------
-- 5. STUDENTS ROSTER
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  student_id VARCHAR(50) NOT NULL,
  admission_no VARCHAR(50) NOT NULL,
  roll_no VARCHAR(50) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  gender VARCHAR(20) DEFAULT 'Male',
  dob DATE,
  blood_group VARCHAR(10),
  avatar_url TEXT,
  department VARCHAR(100),
  course VARCHAR(100) NOT NULL,
  class_id VARCHAR(50) NOT NULL,
  section VARCHAR(10) NOT NULL,
  semester VARCHAR(20),
  academic_year VARCHAR(50) NOT NULL,
  admission_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Suspended', 'Alumni')),
  parent_name VARCHAR(255),
  parent_phone VARCHAR(50),
  parent_email VARCHAR(255),
  address TEXT,
  emergency_contact VARCHAR(50),
  attendance_rate NUMERIC(5, 2) DEFAULT 85.00,
  assigned_faculty_id UUID REFERENCES faculty(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_inst_student_id UNIQUE (institution_id, student_id),
  CONSTRAINT unique_inst_admission_no UNIQUE (institution_id, admission_no)
);

CREATE INDEX IF NOT EXISTS idx_students_institution ON students(institution_id);
CREATE INDEX IF NOT EXISTS idx_students_class ON students(class_id);

-- --------------------------------------------------------------------
-- 6. ATTENDANCE LOGS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  student_name VARCHAR(255) NOT NULL,
  roll_no VARCHAR(50) NOT NULL,
  class_id VARCHAR(50) NOT NULL,
  subject VARCHAR(100),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  session VARCHAR(50) NOT NULL DEFAULT 'Full Day',
  status VARCHAR(20) NOT NULL CHECK (status IN ('Present', 'Absent', 'Late', 'On Leave')),
  marked_by VARCHAR(255) NOT NULL,
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_student_date_session UNIQUE (student_id, date, session)
);

CREATE INDEX IF NOT EXISTS idx_attendance_inst_date ON attendance_records(institution_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance_records(student_id);

-- --------------------------------------------------------------------
-- 7. TIMETABLE SLOTS WITH COLLISION PREVENTION
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS timetable_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  day VARCHAR(20) NOT NULL CHECK (day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')),
  time_slot VARCHAR(50) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  faculty_id UUID REFERENCES faculty(id) ON DELETE SET NULL,
  faculty_name VARCHAR(255) NOT NULL,
  classroom VARCHAR(50) NOT NULL,
  class_id VARCHAR(50) NOT NULL,
  color VARCHAR(20) DEFAULT '#0d9488',
  is_break BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_room_day_slot UNIQUE (institution_id, classroom, day, time_slot),
  CONSTRAINT unique_faculty_day_slot UNIQUE (institution_id, faculty_id, day, time_slot)
);

CREATE INDEX IF NOT EXISTS idx_timetable_inst_class ON timetable_slots(institution_id, class_id);

-- --------------------------------------------------------------------
-- 8. CORPORATE & HR MODULES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS corporate_staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  employee_id VARCHAR(50) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  department VARCHAR(100) NOT NULL,
  designation VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  employment_type VARCHAR(50) DEFAULT 'Permanent' CHECK (employment_type IN ('Permanent', 'Contractual', 'Intern', 'Part-Time')),
  work_mode VARCHAR(50) DEFAULT 'On-Site' CHECK (work_mode IN ('On-Site', 'Remote', 'Hybrid')),
  joining_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'On Leave', 'Notice Period')),
  basic_salary NUMERIC(10, 2) NOT NULL DEFAULT 50000,
  allowances NUMERIC(10, 2) NOT NULL DEFAULT 10000,
  deductions NUMERIC(10, 2) NOT NULL DEFAULT 5000,
  leave_balance INT DEFAULT 18,
  reporting_manager VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_inst_corp_employee_id UNIQUE (institution_id, employee_id)
);

CREATE TABLE IF NOT EXISTS employee_clock_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  employee_id VARCHAR(50) NOT NULL,
  employee_name VARCHAR(255) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  clock_in_time VARCHAR(20) NOT NULL,
  clock_out_time VARCHAR(20),
  work_mode VARCHAR(50) NOT NULL CHECK (work_mode IN ('Office', 'Remote', 'Client Site')),
  duration_hours NUMERIC(4, 2),
  status VARCHAR(50) NOT NULL DEFAULT 'Present' CHECK (status IN ('Present', 'Late', 'Half-Day', 'Overtime')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payroll_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  employee_id VARCHAR(50) NOT NULL,
  employee_name VARCHAR(255) NOT NULL,
  designation VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  month VARCHAR(50) NOT NULL,
  basic_pay NUMERIC(10, 2) NOT NULL,
  allowances NUMERIC(10, 2) NOT NULL,
  gross_pay NUMERIC(10, 2) NOT NULL,
  tax_deductions NUMERIC(10, 2) NOT NULL,
  pf_deductions NUMERIC(10, 2) NOT NULL,
  total_deductions NUMERIC(10, 2) NOT NULL,
  net_pay NUMERIC(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Approved', 'Paid')),
  payment_date DATE,
  payment_ref VARCHAR(100),
  payslip_number VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS holidays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('National', 'Regional', 'Institution Declared', 'Restricted', 'Weekly Off')),
  is_paid BOOLEAN DEFAULT TRUE,
  applicable_departments VARCHAR(255) DEFAULT 'All Departments',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 9. GOVERNMENT & PUBLIC SECTOR MODULES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS government_circulars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  circular_number VARCHAR(100) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  issuing_department VARCHAR(100) NOT NULL,
  signatory VARCHAR(255) NOT NULL,
  classification VARCHAR(50) NOT NULL CHECK (classification IN ('Public Notice', 'Departmental', 'Confidential', 'Urgent Order')),
  published_date DATE NOT NULL DEFAULT CURRENT_DATE,
  content TEXT NOT NULL,
  attachments TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_inst_circular_no UNIQUE (institution_id, circular_number)
);

CREATE TABLE IF NOT EXISTS file_tracking_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  file_number VARCHAR(100) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  initiating_officer VARCHAR(255) NOT NULL,
  current_desk VARCHAR(100) NOT NULL,
  priority VARCHAR(50) NOT NULL CHECK (priority IN ('Urgent', 'Routine', 'Immediate')),
  status VARCHAR(50) NOT NULL CHECK (status IN ('In Movement', 'Pending Sanction', 'Approved & Disposed')),
  last_moved_at TIMESTAMPTZ DEFAULT NOW(),
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_inst_file_no UNIQUE (institution_id, file_number)
);

-- --------------------------------------------------------------------
-- 10. FINANCE & PAYMENTS (RAZORPAY)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fee_invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  invoice_number VARCHAR(50) NOT NULL,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  student_name VARCHAR(255) NOT NULL,
  roll_no VARCHAR(50) NOT NULL,
  class_id VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  paid_amount NUMERIC(10, 2) DEFAULT 0.00,
  due_amount NUMERIC(10, 2) NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Paid', 'Partially Paid', 'Pending', 'Overdue')),
  payment_date DATE,
  transaction_id VARCHAR(100),
  payment_method VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_inst_invoice_no UNIQUE (institution_id, invoice_number)
);

CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID REFERENCES fee_invoices(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  payment_method VARCHAR(50) NOT NULL,
  razorpay_order_id VARCHAR(100),
  razorpay_payment_id VARCHAR(100),
  status VARCHAR(50) DEFAULT 'Success',
  receipt_number VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 11. GENERAL OPERATIONAL MODULES (Leaves, Books, Tickets, Announcements)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  target_audience VARCHAR(50) NOT NULL,
  class_id VARCHAR(50),
  author_name VARCHAR(255) NOT NULL,
  author_role VARCHAR(100) NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  priority VARCHAR(20) DEFAULT 'Normal',
  read_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leave_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  applicant_id VARCHAR(50) NOT NULL,
  applicant_name VARCHAR(255) NOT NULL,
  applicant_role VARCHAR(50) NOT NULL,
  leave_type VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days_count INT NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  approved_by VARCHAR(255),
  applied_on DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS library_books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  isbn VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  total_copies INT NOT NULL DEFAULT 1,
  available_copies INT NOT NULL DEFAULT 1,
  shelf_location VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  ticket_number VARCHAR(50) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  priority VARCHAR(20) NOT NULL CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
  status VARCHAR(50) NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Resolved')),
  created_by_name VARCHAR(255) NOT NULL,
  created_by_role VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 12. EVENTROUTE NAVIGATION ENGINE MODULES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS venue_rooms (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  floor VARCHAR(20) NOT NULL,
  zone VARCHAR(50) NOT NULL,
  capacity INT NOT NULL,
  current_occupancy INT NOT NULL DEFAULT 0,
  congestion_status VARCHAR(20) NOT NULL DEFAULT 'low' CHECK (congestion_status IN ('low', 'moderate', 'congested')),
  coordinates JSONB NOT NULL DEFAULT '{"x": 0, "y": 0}'::jsonb
);

CREATE TABLE IF NOT EXISTS event_sessions (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  speaker_name VARCHAR(255) NOT NULL,
  speaker_role VARCHAR(255) NOT NULL,
  venue_id VARCHAR(50) REFERENCES venue_rooms(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  start_time VARCHAR(20) NOT NULL,
  end_time VARCHAR(20) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  description TEXT,
  target_audience VARCHAR(50) NOT NULL DEFAULT 'all'
);

CREATE TABLE IF NOT EXISTS user_itineraries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(100) NOT NULL,
  preferences JSONB NOT NULL,
  planned_sessions JSONB NOT NULL,
  total_walk_time_mins INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------------------
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE corporate_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_clock_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE government_circulars ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_tracking_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Helper policies allowing read/write for active tenants and super-admins
DROP POLICY IF EXISTS "Institutions visible to all for gateway directory" ON institutions;
CREATE POLICY "Institutions visible to all for gateway directory" ON institutions
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Allow tenant registration" ON institutions;
CREATE POLICY "Allow tenant registration" ON institutions
  FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Allow tenant updates" ON institutions;
CREATE POLICY "Allow tenant updates" ON institutions
  FOR UPDATE USING (TRUE);

DROP POLICY IF EXISTS "Profiles scoped access" ON profiles;
CREATE POLICY "Profiles scoped access" ON profiles
  FOR ALL USING (TRUE);

DROP POLICY IF EXISTS "Classrooms scoped access" ON classrooms;
CREATE POLICY "Classrooms scoped access" ON classrooms
  FOR ALL USING (TRUE);

DROP POLICY IF EXISTS "Faculty scoped access" ON faculty;
CREATE POLICY "Faculty scoped access" ON faculty
  FOR ALL USING (TRUE);

DROP POLICY IF EXISTS "Students scoped access" ON students;
CREATE POLICY "Students scoped access" ON students
  FOR ALL USING (TRUE);

DROP POLICY IF EXISTS "Attendance scoped access" ON attendance_records;
CREATE POLICY "Attendance scoped access" ON attendance_records
  FOR ALL USING (TRUE);

DROP POLICY IF EXISTS "Timetable scoped access" ON timetable_slots;
CREATE POLICY "Timetable scoped access" ON timetable_slots
  FOR ALL USING (TRUE);

DROP POLICY IF EXISTS "Corporate staff scoped access" ON corporate_staff;
CREATE POLICY "Corporate staff scoped access" ON corporate_staff
  FOR ALL USING (TRUE);

DROP POLICY IF EXISTS "Clock records scoped access" ON employee_clock_records;
CREATE POLICY "Clock records scoped access" ON employee_clock_records
  FOR ALL USING (TRUE);

DROP POLICY IF EXISTS "Payroll scoped access" ON payroll_records;
CREATE POLICY "Payroll scoped access" ON payroll_records
  FOR ALL USING (TRUE);

DROP POLICY IF EXISTS "Circulars scoped access" ON government_circulars;
CREATE POLICY "Circulars scoped access" ON government_circulars
  FOR ALL USING (TRUE);

DROP POLICY IF EXISTS "File tracking scoped access" ON file_tracking_records;
CREATE POLICY "File tracking scoped access" ON file_tracking_records
  FOR ALL USING (TRUE);

DROP POLICY IF EXISTS "Fee invoices scoped access" ON fee_invoices;
CREATE POLICY "Fee invoices scoped access" ON fee_invoices
  FOR ALL USING (TRUE);

DROP POLICY IF EXISTS "Payment transactions scoped access" ON payment_transactions;
CREATE POLICY "Payment transactions scoped access" ON payment_transactions
  FOR ALL USING (TRUE);

DROP POLICY IF EXISTS "Announcements scoped access" ON announcements;
CREATE POLICY "Announcements scoped access" ON announcements
  FOR ALL USING (TRUE);

DROP POLICY IF EXISTS "Leave requests scoped access" ON leave_requests;
CREATE POLICY "Leave requests scoped access" ON leave_requests
  FOR ALL USING (TRUE);

DROP POLICY IF EXISTS "Library books scoped access" ON library_books;
CREATE POLICY "Library books scoped access" ON library_books
  FOR ALL USING (TRUE);

DROP POLICY IF EXISTS "Support tickets scoped access" ON support_tickets;
CREATE POLICY "Support tickets scoped access" ON support_tickets
  FOR ALL USING (TRUE);
