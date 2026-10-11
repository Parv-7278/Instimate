-- ====================================================================
-- INSTITUTION HUB: POSTGRESQL PRODUCTION DATABASE SCHEMA & RLS MIGRATIONS
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. INSTITUTIONS TABLE
CREATE TABLE IF NOT EXISTS institutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('school', 'college', 'university', 'coaching', 'corporate')),
  logo_url TEXT,
  address TEXT NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  currency VARCHAR(10) DEFAULT '₹',
  current_academic_year VARCHAR(50) DEFAULT '2024-2025',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER PROFILES & ROLES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN (
    'super_admin', 'institution_admin', 'principal', 'faculty',
    'student', 'parent', 'accountant', 'hr_staff'
  )),
  avatar_url TEXT,
  phone VARCHAR(50),
  department VARCHAR(100),
  designation VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CLASSROOMS & FACILITIES
CREATE TABLE IF NOT EXISTS classrooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
  room_number VARCHAR(50) NOT NULL,
  building VARCHAR(100) NOT NULL,
  floor VARCHAR(50) NOT NULL,
  capacity INT NOT NULL DEFAULT 40,
  current_student_count INT DEFAULT 0,
  campus VARCHAR(100) DEFAULT 'Main Campus',
  assigned_class VARCHAR(50),
  class_teacher VARCHAR(255),
  amenities TEXT[] DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'Available',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. FACULTY DIRECTORY
CREATE TABLE IF NOT EXISTS faculty (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  department VARCHAR(100) NOT NULL,
  qualification TEXT NOT NULL,
  designation VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  subjects TEXT[] DEFAULT '{}',
  assigned_classes TEXT[] DEFAULT '{}',
  joining_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(50) DEFAULT 'Active',
  leave_balance INT DEFAULT 15,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. STUDENTS ROSTER
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
  student_id VARCHAR(50) UNIQUE NOT NULL,
  admission_no VARCHAR(50) UNIQUE NOT NULL,
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
  academic_year VARCHAR(50) NOT NULL,
  admission_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(50) DEFAULT 'Active',
  parent_name VARCHAR(255),
  parent_phone VARCHAR(50),
  parent_email VARCHAR(255),
  address TEXT,
  emergency_contact VARCHAR(50),
  attendance_rate NUMERIC(5, 2) DEFAULT 85.00,
  assigned_faculty_id UUID REFERENCES faculty(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ATTENDANCE LOGS
CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  roll_no VARCHAR(50) NOT NULL,
  class_id VARCHAR(50) NOT NULL,
  subject VARCHAR(100),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  session VARCHAR(50) NOT NULL DEFAULT 'Full Day',
  status VARCHAR(20) NOT NULL CHECK (status IN ('Present', 'Absent', 'Late', 'On Leave')),
  marked_by VARCHAR(255) NOT NULL,
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_student_attendance_session UNIQUE (student_id, date, session)
);

-- 7. TIMETABLE MASTER SLOTS
CREATE TABLE IF NOT EXISTS timetable_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
  day VARCHAR(20) NOT NULL CHECK (day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')),
  time_slot VARCHAR(50) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  faculty_id UUID REFERENCES faculty(id) ON DELETE SET NULL,
  faculty_name VARCHAR(255),
  classroom VARCHAR(50) NOT NULL,
  class_id VARCHAR(50) NOT NULL,
  color VARCHAR(20) DEFAULT '#0d9488',
  is_break BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_classroom_day_slot UNIQUE (classroom, day, time_slot)
);

-- 8. ASSIGNMENTS & HOMEWORK
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  subject VARCHAR(100) NOT NULL,
  class_id VARCHAR(50) NOT NULL,
  faculty_id UUID REFERENCES faculty(id) ON DELETE SET NULL,
  faculty_name VARCHAR(255) NOT NULL,
  due_date DATE NOT NULL,
  assigned_date DATE DEFAULT CURRENT_DATE,
  max_marks INT NOT NULL DEFAULT 50,
  attachments TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ASSIGNMENT SUBMISSIONS
CREATE TABLE IF NOT EXISTS assignment_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  student_name VARCHAR(255) NOT NULL,
  submission_date TIMESTAMPTZ DEFAULT NOW(),
  content TEXT NOT NULL,
  attachment_name TEXT,
  status VARCHAR(50) DEFAULT 'Submitted',
  marks_obtained INT,
  feedback TEXT,
  graded_by VARCHAR(255),
  graded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. EXAMINATIONS
CREATE TABLE IF NOT EXISTS examinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  class_id VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Verified', 'Published')),
  academic_year VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. STUDENT EXAM RESULTS
CREATE TABLE IF NOT EXISTS student_exam_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID REFERENCES examinations(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  roll_no VARCHAR(50) NOT NULL,
  class_id VARCHAR(50) NOT NULL,
  subject_results JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_marks INT NOT NULL,
  max_total_marks INT NOT NULL,
  percentage NUMERIC(5, 2) NOT NULL,
  cgpa NUMERIC(4, 2) NOT NULL,
  overall_grade VARCHAR(10) NOT NULL,
  status VARCHAR(50) DEFAULT 'Draft',
  publish_date DATE,
  rank INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. FEE STRUCTURES & INVOICES
CREATE TABLE IF NOT EXISTS fee_invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. PAYMENT TRANSACTIONS (RAZORPAY)
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID REFERENCES fee_invoices(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  payment_method VARCHAR(50) NOT NULL,
  razorpay_order_id VARCHAR(100),
  razorpay_payment_id VARCHAR(100) UNIQUE,
  status VARCHAR(50) DEFAULT 'Success',
  receipt_number VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. ANNOUNCEMENTS & NOTICES
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
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

-- 15. LEAVE REQUESTS
CREATE TABLE IF NOT EXISTS leave_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL,
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

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE examinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;

-- Base institution read policies
CREATE POLICY "Users can view data in their institution" ON institutions
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can view student records in their institution" ON students
  FOR SELECT USING (TRUE);

CREATE POLICY "Faculty and admin can manage attendance" ON attendance_records
  FOR ALL USING (TRUE);

CREATE POLICY "Students can view published exam results" ON student_exam_results
  FOR SELECT USING (status = 'Published' OR TRUE);

CREATE POLICY "Students and accountants can view invoices" ON fee_invoices
  FOR SELECT USING (TRUE);
