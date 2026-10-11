export type InstitutionType =
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

export type VerificationStatus =
  | 'Draft'
  | 'Pending Verification'
  | 'Under Review'
  | 'Approved'
  | 'Rejected'
  | 'Suspended'
  | 'Active';

export type UserRole =
  | 'super_admin'
  | 'institution_owner'
  | 'institution_admin'
  | 'principal'
  | 'faculty'
  | 'student'
  | 'parent'
  | 'accountant'
  | 'hr_staff'
  | 'corporate_employee'
  | 'govt_officer'
  | 'librarian'
  | 'auditor';

export interface Institution {
  id: string;
  name: string;
  code: string;
  slug: string;
  type: InstitutionType;
  status: VerificationStatus;
  logoUrl?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  currency: string;
  currentAcademicYear: string;
  submittedAt: string;
  verifiedAt?: string;
  verificationNotes?: string;
  rejectionReason?: string;
  // Conditional type-specific metadata
  affiliationNumber?: string;
  boardOrUniversity?: string;
  companyRegNumber?: string;
  departmentJurisdiction?: string;
  // Authorized Representative
  representativeName: string;
  representativeDesignation: string;
  representativeEmail: string;
  representativePhone: string;
  // Enabled modules
  enabledModules: string[];
  totalMembers: number;
  totalStudents?: number;
  totalFaculty?: number;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  institutionId: string;
  department?: string;
  designation?: string;
  memberId?: string;
  status?: 'Active' | 'Pending Activation' | 'Suspended';
}

export interface Student {
  id: string;
  studentId: string;
  admissionNo: string;
  rollNo: string;
  fullName: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  bloodGroup?: string;
  avatarUrl?: string;
  institutionId: string;
  department: string;
  course: string;
  classId: string;
  section: string;
  semester?: string;
  academicYear: string;
  admissionDate: string;
  status: 'Active' | 'Inactive' | 'Suspended' | 'Alumni';
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  emergencyContact: string;
  attendanceRate: number;
  assignedFacultyId?: string;
}

export interface Faculty {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  qualification: string;
  designation: string;
  avatarUrl?: string;
  institutionId: string;
  subjects: string[];
  assignedClasses: string[];
  joiningDate: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  leaveBalance: number;
  employmentType?: 'Permanent' | 'Contractual' | 'Visiting';
}

export interface CorporateStaff {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  institutionId: string;
  avatarUrl?: string;
  employmentType: 'Permanent' | 'Contractual' | 'Intern' | 'Part-Time';
  workMode: 'On-Site' | 'Remote' | 'Hybrid';
  joiningDate: string;
  status: 'Active' | 'On Leave' | 'Notice Period';
  basicSalary: number;
  allowances: number;
  deductions: number;
  leaveBalance: number;
  reportingManager: string;
}

export interface EmployeeClockRecord {
  id: string;
  institutionId: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockInTime: string;
  clockOutTime?: string;
  workMode: 'Office' | 'Remote' | 'Client Site';
  durationHours?: number;
  status: 'Present' | 'Late' | 'Half-Day' | 'Overtime';
}

export interface PayrollRecord {
  id: string;
  institutionId: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  month: string; // e.g. "October 2026"
  basicPay: number;
  allowances: number;
  grossPay: number;
  taxDeductions: number;
  pfDeductions: number;
  totalDeductions: number;
  netPay: number;
  status: 'Draft' | 'Approved' | 'Paid';
  paymentDate?: string;
  paymentRef?: string;
  payslipNumber: string;
}

export interface HolidayItem {
  id: string;
  institutionId: string;
  title: string;
  date: string;
  type: 'National' | 'Regional' | 'Institution Declared' | 'Restricted' | 'Weekly Off';
  isPaid: boolean;
  applicableDepartments: string;
}

export interface GovernmentCircular {
  id: string;
  institutionId: string;
  circularNumber: string; // e.g. "GO-PW/2026/891"
  subject: string;
  issuingDepartment: string;
  signatory: string;
  classification: 'Public Notice' | 'Departmental' | 'Confidential' | 'Urgent Order';
  publishedDate: string;
  content: string;
  attachments?: string[];
}

export interface FileTrackingRecord {
  id: string;
  institutionId: string;
  fileNumber: string; // e.g. "FILE-PWD-ROAD-2026-44"
  subject: string;
  initiatingOfficer: string;
  currentDesk: string;
  priority: 'Urgent' | 'Routine' | 'Immediate';
  status: 'In Movement' | 'Pending Sanction' | 'Approved & Disposed';
  lastMovedAt: string;
  remarks: string;
}

export interface Classroom {
  id: string;
  roomNumber: string;
  building: string;
  floor: string;
  capacity: number;
  currentStudentCount: number;
  campus: string;
  assignedClass?: string;
  classTeacher?: string;
  amenities: string[];
  status: 'Available' | 'Occupied' | 'Maintenance';
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  timeSlot: string;
  subject: string;
  facultyName: string;
  facultyId: string;
  classroom: string;
  classId: string;
  color?: string;
  isBreak?: boolean;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  classId: string;
  subject?: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'On Leave';
  session: 'Morning' | 'Afternoon' | 'Full Day' | 'Lecture';
  markedBy: string;
  remarks?: string;
  timestamp: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  classId: string;
  facultyId: string;
  facultyName: string;
  dueDate: string;
  assignedDate: string;
  maxMarks: number;
  status: 'Not Started' | 'In Progress' | 'Submitted' | 'Late' | 'Graded' | 'Missing';
  submissionCount: number;
  totalStudents: number;
  attachments?: string[];
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submissionDate: string;
  content: string;
  attachmentName?: string;
  status: 'Submitted' | 'Late' | 'Graded';
  marksObtained?: number;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: string;
}

export interface Examination {
  id: string;
  title: string;
  type: 'Internal Assessment' | 'Midterm' | 'Final Semester' | 'Practical' | 'Unit Test';
  classId: string;
  startDate: string;
  endDate: string;
  status: 'Draft' | 'Verified' | 'Published';
  academicYear: string;
}

export interface ExamSubjectResult {
  subject: string;
  maxMarks: number;
  marksObtained: number;
  grade: string;
  remarks?: string;
}

export interface StudentExamResult {
  id: string;
  examId: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  classId: string;
  subjectResults: ExamSubjectResult[];
  totalMarks: number;
  maxTotalMarks: number;
  percentage: number;
  cgpa: number;
  overallGrade: string;
  status: 'Draft' | 'Verified' | 'Published';
  publishDate?: string;
  rank?: number;
}

export interface FeeStructure {
  id: string;
  name: string;
  amount: number;
  classId: string;
  dueDate: string;
  frequency: 'Annual' | 'Semester' | 'Monthly' | 'One-Time';
  category: 'Tuition' | 'Admission' | 'Exam' | 'Transport' | 'Hostel' | 'Laboratory' | 'Miscellaneous';
}

export interface FeeInvoice {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  classId: string;
  title: string;
  category: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  dueDate: string;
  status: 'Paid' | 'Partially Paid' | 'Pending' | 'Overdue';
  paymentDate?: string;
  transactionId?: string;
  paymentMethod?: 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Cash' | 'Cheque';
}

export interface PaymentTransaction {
  id: string;
  invoiceId: string;
  studentId: string;
  studentName: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  status: 'Success' | 'Failed' | 'Refunded';
  createdAt: string;
  receiptNumber: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'Institution-wide' | 'Class-specific' | 'Urgent Alert' | 'Exam Notice' | 'Fee Deadline' | 'Office Order';
  targetAudience: 'All' | 'Faculty' | 'Students' | 'Parents' | 'Employees' | 'Class-specific';
  classId?: string;
  authorName: string;
  authorRole: string;
  publishedAt: string;
  isPinned: boolean;
  priority: 'High' | 'Normal' | 'Low';
  attachmentUrl?: string;
  readCount: number;
}

export interface InAppNotification {
  id: string;
  userId?: string;
  targetRole?: UserRole | 'all';
  title: string;
  message: string;
  type: 'alert' | 'info' | 'success' | 'warning';
  timestamp: string;
  isRead: boolean;
  link?: string;
}

export interface LeaveRequest {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantRole: 'faculty' | 'student' | 'staff' | 'employee' | 'officer';
  leaveType: 'Sick Leave' | 'Casual Leave' | 'Earned Leave' | 'Paid Time Off' | 'Maternity Leave' | 'Emergency';
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: string;
  appliedOn: string;
}

export interface LibraryBook {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  location: string;
  status: 'Available' | 'Checked Out' | 'Reserved';
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: 'Academic' | 'Fees & Finance' | 'Facilities & Hostel' | 'Technical / IT' | 'Other';
  raisedBy: string;
  raisedByRole: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  createdAt: string;
  description: string;
}

export interface IntegrationConfig {
  id: string;
  name: string;
  key: 'google_classroom' | 'whatsapp' | 'google_drive' | 'google_calendar' | 'razorpay' | 'resend';
  icon: string;
  status: 'Connected' | 'Configured' | 'Disconnected' | 'Test Mode';
  lastSynced?: string;
  config: Record<string, string>;
  description: string;
}
