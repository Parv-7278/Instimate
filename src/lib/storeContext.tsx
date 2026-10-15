'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserRole,
  Institution,
  InstitutionType,
  VerificationStatus,
  Student,
  Faculty,
  Classroom,
  TimetableSlot,
  AttendanceRecord,
  Assignment,
  AssignmentSubmission,
  Examination,
  StudentExamResult,
  FeeStructure,
  FeeInvoice,
  PaymentTransaction,
  Announcement,
  InAppNotification,
  LeaveRequest,
  LibraryBook,
  SupportTicket,
  IntegrationConfig,
  CorporateStaff,
  EmployeeClockRecord,
  PayrollRecord,
  HolidayItem,
  GovernmentCircular,
  FileTrackingRecord,
} from '@/types';
import {
  INITIAL_INSTITUTIONS,
  DEMO_USERS,
  INITIAL_STUDENTS,
  INITIAL_FACULTY,
  INITIAL_CLASSROOMS,
  INITIAL_TIMETABLE,
  INITIAL_ATTENDANCE,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_EXAMINATIONS,
  INITIAL_STUDENT_RESULTS,
  INITIAL_FEE_STRUCTURES,
  INITIAL_INVOICES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_INTEGRATIONS,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_LIBRARY_BOOKS,
  INITIAL_TICKETS,
  INITIAL_CORPORATE_STAFF,
  INITIAL_EMPLOYEE_CLOCK_RECORDS,
  INITIAL_PAYROLL_RECORDS,
  INITIAL_HOLIDAYS,
  INITIAL_CIRCULARS,
  INITIAL_FILE_TRACKING,
} from './seedData';
import { isSupabaseConfigured, getSupabaseClient } from './supabase';
import { authService } from './supabase/services/authService';
import { institutionService } from './supabase/services/institutionService';
import { studentService } from './supabase/services/studentService';
import { attendanceService } from './supabase/services/attendanceService';
import { corporateService } from './supabase/services/corporateService';
import { governmentService } from './supabase/services/governmentService';
import { financeService } from './supabase/services/financeService';
import { timetableService } from './supabase/services/timetableService';
import { classroomService } from './supabase/services/classroomService';

interface StoreContextType {
  isSupabaseLive: boolean;
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  switchRole: (role: UserRole) => void;
  signOut: () => Promise<void>;

  // Institutions & Multi-tenancy
  institutions: Institution[];
  currentInstitution: Institution;
  setCurrentInstitution: (inst: Institution) => void;
  registerInstitution: (inst: Omit<Institution, 'id' | 'status' | 'submittedAt' | 'totalMembers'>) => Institution;
  approveInstitution: (id: string, notes?: string) => void;
  rejectInstitution: (id: string, reason: string) => void;
  suspendInstitution: (id: string, reason: string) => void;

  // Member Management
  members: UserProfile[];
  inviteMember: (member: Omit<UserProfile, 'id' | 'status'>) => void;

  // Corporate & HR Modules
  corporateStaff: CorporateStaff[];
  clockRecords: EmployeeClockRecord[];
  clockInEmployee: (employeeId: string, workMode: 'Office' | 'Remote' | 'Client Site') => void;
  clockOutEmployee: (recordId: string) => void;
  payrollRecords: PayrollRecord[];
  processPayroll: (recordId: string, paymentRef?: string) => void;
  addPayrollRecord: (record: Omit<PayrollRecord, 'id' | 'institutionId'>) => void;
  holidays: HolidayItem[];
  addHoliday: (holiday: Omit<HolidayItem, 'id' | 'institutionId'>) => void;

  // Government Modules
  circulars: GovernmentCircular[];
  publishCircular: (circ: Omit<GovernmentCircular, 'id' | 'institutionId' | 'publishedDate'>) => void;
  fileTracking: FileTrackingRecord[];
  createFileRecord: (file: Omit<FileTrackingRecord, 'id' | 'institutionId' | 'lastMovedAt'>) => void;
  moveFileDesk: (fileId: string, nextDesk: string, remarks: string) => void;

  // Academic Modules
  subjects: string[];
  addSubject: (subject: string) => void;
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'studentId' | 'attendanceRate'>) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  faculty: Faculty[];
  addFaculty: (fac: Omit<Faculty, 'id' | 'employeeId'>) => void;

  classrooms: Classroom[];
  addClassroom: (room: Omit<Classroom, 'id'>) => void;

  timetable: TimetableSlot[];
  addTimetableSlot: (slot: Omit<TimetableSlot, 'id'>) => { success: boolean; conflictMessage?: string };

  attendance: AttendanceRecord[];
  markAttendance: (record: Omit<AttendanceRecord, 'id' | 'timestamp'>) => void;
  bulkMarkAttendance: (records: Omit<AttendanceRecord, 'id' | 'timestamp'>[]) => void;

  assignments: Assignment[];
  addAssignment: (asg: Omit<Assignment, 'id' | 'submissionCount' | 'status'>) => void;
  submissions: AssignmentSubmission[];
  submitAssignment: (sub: Omit<AssignmentSubmission, 'id' | 'submissionDate' | 'status'>) => void;
  gradeSubmission: (id: string, marks: number, feedback: string) => void;

  examinations: Examination[];
  examResults: StudentExamResult[];
  publishExamResults: (examId: string) => void;
  addExamResult: (result: Omit<StudentExamResult, 'id'>) => void;

  feeStructures: FeeStructure[];
  invoices: FeeInvoice[];
  transactions: PaymentTransaction[];
  createInvoice: (invoice: Omit<FeeInvoice, 'id' | 'invoiceNumber'>) => void;
  payInvoice: (invoiceId: string, amount: number, paymentMethod: string, transactionId: string) => void;

  announcements: Announcement[];
  addAnnouncement: (anc: Omit<Announcement, 'id' | 'publishedAt' | 'readCount'>) => void;
  deleteAnnouncement: (id: string) => void;

  notifications: InAppNotification[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;

  leaveRequests: LeaveRequest[];
  applyLeave: (leave: Omit<LeaveRequest, 'id' | 'status' | 'appliedOn'>) => void;
  updateLeaveStatus: (id: string, status: 'Approved' | 'Rejected', approverName: string) => void;

  libraryBooks: LibraryBook[];
  issueBook: (bookId: string) => void;
  returnBook: (bookId: string) => void;

  supportTickets: SupportTicket[];
  createTicket: (ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'status' | 'createdAt'>) => void;
  resolveTicket: (id: string) => void;

  integrations: IntegrationConfig[];
  updateIntegration: (id: string, updates: Partial<IntegrationConfig>) => void;

  resetToDefaults: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'universal_institution_hub_v2';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSupabaseLive, setIsSupabaseLive] = useState(false);

  // Core States
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS[0]);
  const [institutions, setInstitutions] = useState<Institution[]>(INITIAL_INSTITUTIONS);
  const [currentInstitution, setCurrentInstitution] = useState<Institution>(INITIAL_INSTITUTIONS[0]);
  const [members, setMembers] = useState<UserProfile[]>(DEMO_USERS);

  // Corporate & HR States
  const [corporateStaff, setCorporateStaff] = useState<CorporateStaff[]>(INITIAL_CORPORATE_STAFF);
  const [clockRecords, setClockRecords] = useState<EmployeeClockRecord[]>(INITIAL_EMPLOYEE_CLOCK_RECORDS);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(INITIAL_PAYROLL_RECORDS);
  const [holidays, setHolidays] = useState<HolidayItem[]>(INITIAL_HOLIDAYS);

  // Government States
  const [circulars, setCirculars] = useState<GovernmentCircular[]>(INITIAL_CIRCULARS);
  const [fileTracking, setFileTracking] = useState<FileTrackingRecord[]>(INITIAL_FILE_TRACKING);

  // Academic States
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [faculty, setFaculty] = useState<Faculty[]>(INITIAL_FACULTY);
  const [classrooms, setClassrooms] = useState<Classroom[]>(INITIAL_CLASSROOMS);
  const [timetable, setTimetable] = useState<TimetableSlot[]>(INITIAL_TIMETABLE);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(INITIAL_SUBMISSIONS);
  const [examinations, setExaminations] = useState<Examination[]>(INITIAL_EXAMINATIONS);
  const [examResults, setExamResults] = useState<StudentExamResult[]>(INITIAL_STUDENT_RESULTS);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>(INITIAL_FEE_STRUCTURES);
  const [invoices, setInvoices] = useState<FeeInvoice[]>(INITIAL_INVOICES);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [notifications, setNotifications] = useState<InAppNotification[]>(INITIAL_NOTIFICATIONS);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(INITIAL_LEAVE_REQUESTS);
  const [libraryBooks, setLibraryBooks] = useState<LibraryBook[]>(INITIAL_LIBRARY_BOOKS);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>(INITIAL_INTEGRATIONS);
  const [subjects, setSubjects] = useState<string[]>([
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'English',
    'History',
    'Commerce',
  ]);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.institutions) setInstitutions(parsed.institutions);
        if (parsed.members) setMembers(parsed.members);
        if (parsed.corporateStaff) setCorporateStaff(parsed.corporateStaff);
        if (parsed.clockRecords) setClockRecords(parsed.clockRecords);
        if (parsed.payrollRecords) setPayrollRecords(parsed.payrollRecords);
        if (parsed.holidays) setHolidays(parsed.holidays);
        if (parsed.circulars) setCirculars(parsed.circulars);
        if (parsed.fileTracking) setFileTracking(parsed.fileTracking);
        if (parsed.students) setStudents(parsed.students);
        if (parsed.faculty) setFaculty(parsed.faculty);
        if (parsed.classrooms) setClassrooms(parsed.classrooms);
        if (parsed.timetable) setTimetable(parsed.timetable);
        if (parsed.attendance) setAttendance(parsed.attendance);
        if (parsed.assignments) setAssignments(parsed.assignments);
        if (parsed.submissions) setSubmissions(parsed.submissions);
        if (parsed.examinations) setExaminations(parsed.examinations);
        if (parsed.examResults) setExamResults(parsed.examResults);
        if (parsed.invoices) setInvoices(parsed.invoices);
        if (parsed.transactions) setTransactions(parsed.transactions);
        if (parsed.announcements) setAnnouncements(parsed.announcements);
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.leaveRequests) setLeaveRequests(parsed.leaveRequests);
        if (parsed.libraryBooks) setLibraryBooks(parsed.libraryBooks);
        if (parsed.currentInstitutionId) {
          const matched = (parsed.institutions || INITIAL_INSTITUTIONS).find(
            (i: Institution) => i.id === parsed.currentInstitutionId
          );
          if (matched) setCurrentInstitution(matched);
        }
        if (parsed.currentUserId) {
          const matchedUser = DEMO_USERS.find((u) => u.id === parsed.currentUserId);
          if (matchedUser) setCurrentUser(matchedUser);
        }
      }
    } catch {
      // Ignore
    }
    setIsLoaded(true);
  }, []);

  // Live Supabase Backend synchronization
  useEffect(() => {
    if (isSupabaseConfigured()) {
      setIsSupabaseLive(true);
      institutionService.getAll().then((liveInstitutions) => {
        if (liveInstitutions && liveInstitutions.length > 0) {
          setInstitutions(liveInstitutions);
        }
      }).catch((err) => {
        console.warn('Supabase institutions sync warning:', err);
      });
    }
  }, []);

  // Supabase Auth session listener
  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    // 1. Check existing session on load
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await authService.fetchUserProfile(session.user.id);
        if (profile) {
          setCurrentUser(profile);
          if (profile.institutionId) {
            const matchedInst = institutions.find((i) => i.id === profile.institutionId);
            if (matchedInst) setCurrentInstitution(matchedInst);
          }
        }
      }
    }).catch((err) => {
      console.warn('Supabase session load error:', err);
    });

    // 2. Listen to real-time auth changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const profile = await authService.fetchUserProfile(session.user.id);
          if (profile) {
            setCurrentUser(profile);
            if (profile.institutionId) {
              const matchedInst = institutions.find((i) => i.id === profile.institutionId);
              if (matchedInst) setCurrentInstitution(matchedInst);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(DEMO_USERS[0]);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [institutions]);

  // Synchronize institution modules with Supabase when currentInstitution changes
  useEffect(() => {
    if (!isSupabaseConfigured() || !currentInstitution?.id) return;

    // 1. Classrooms & Room Capacities
    classroomService.getByInstitution(currentInstitution.id).then((rooms) => {
      if (rooms && rooms.length > 0) setClassrooms(rooms);
    }).catch((err) => console.warn('Supabase classrooms sync warning:', err));

    // 2. Attendance Records
    attendanceService.getByInstitution(currentInstitution.id).then((records) => {
      if (records && records.length > 0) setAttendance(records);
    }).catch((err) => console.warn('Supabase attendance sync warning:', err));

    // 3. Timetable Slots
    timetableService.getByInstitution(currentInstitution.id).then((slots) => {
      if (slots && slots.length > 0) setTimetable(slots);
    }).catch((err) => console.warn('Supabase timetable sync warning:', err));

    // 4. Invoices & Transactions
    financeService.getInvoices(currentInstitution.id).then((invs) => {
      if (invs && invs.length > 0) setInvoices(invs);
    }).catch((err) => console.warn('Supabase invoices sync warning:', err));

    financeService.getTransactions(currentInstitution.id).then((txs) => {
      if (txs && txs.length > 0) setTransactions(txs);
    }).catch((err) => console.warn('Supabase transactions sync warning:', err));

    // 5. Corporate Staff, Clock & Payroll
    corporateService.getStaff(currentInstitution.id).then((staff) => {
      if (staff && staff.length > 0) setCorporateStaff(staff);
    }).catch((err) => console.warn('Supabase staff sync warning:', err));

    corporateService.getClockRecords(currentInstitution.id).then((clocks) => {
      if (clocks && clocks.length > 0) setClockRecords(clocks);
    }).catch((err) => console.warn('Supabase clocks sync warning:', err));

    corporateService.getPayrollRecords(currentInstitution.id).then((payrolls) => {
      if (payrolls && payrolls.length > 0) setPayrollRecords(payrolls);
    }).catch((err) => console.warn('Supabase payroll sync warning:', err));

    // 6. Students
    studentService.getByInstitution(currentInstitution.id).then((stus) => {
      if (stus && stus.length > 0) setStudents(stus);
    }).catch((err) => console.warn('Supabase students sync warning:', err));
  }, [currentInstitution?.id]);

  // Sync to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          institutions,
          members,
          corporateStaff,
          clockRecords,
          payrollRecords,
          holidays,
          circulars,
          fileTracking,
          students,
          faculty,
          classrooms,
          timetable,
          attendance,
          assignments,
          submissions,
          examinations,
          examResults,
          invoices,
          transactions,
          announcements,
          notifications,
          leaveRequests,
          libraryBooks,
          currentInstitutionId: currentInstitution.id,
          currentUserId: currentUser.id,
        })
      );
    } catch {
      // Ignore quota errors
    }
  }, [
    isLoaded,
    institutions,
    members,
    corporateStaff,
    clockRecords,
    payrollRecords,
    holidays,
    circulars,
    fileTracking,
    students,
    faculty,
    classrooms,
    timetable,
    attendance,
    assignments,
    submissions,
    examinations,
    examResults,
    invoices,
    transactions,
    announcements,
    notifications,
    leaveRequests,
    libraryBooks,
    currentInstitution,
    currentUser,
  ]);

  const switchRole = (role: UserRole) => {
    const user = DEMO_USERS.find((u) => u.role === role) || DEMO_USERS[0];
    setCurrentUser(user);
    if (user.institutionId) {
      const inst = institutions.find((i) => i.id === user.institutionId);
      if (inst) setCurrentInstitution(inst);
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
    } catch (err) {
      console.warn('Error signing out:', err);
    }
    setCurrentUser(DEMO_USERS[0]);
  };

  // Institution Registration
  const registerInstitution = (
    instData: Omit<Institution, 'id' | 'status' | 'submittedAt' | 'totalMembers'>
  ): Institution => {
    const newInst: Institution = {
      ...instData,
      id: `inst-${Date.now()}`,
      status: 'Pending Verification',
      submittedAt: new Date().toISOString().substring(0, 10),
      totalMembers: 1,
    };
    setInstitutions((prev) => [newInst, ...prev]);

    // Push notification for Super Admin
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'New Institution Application',
        message: `${newInst.name} (${newInst.type}) registered and requires Super Admin review.`,
        type: 'info',
        timestamp: 'Just now',
        isRead: false,
      },
      ...prev,
    ]);

    // Async persist to live Supabase backend
    if (isSupabaseConfigured()) {
      institutionService.create(instData).then((persisted) => {
        if (persisted) {
          setInstitutions((prev) => prev.map((i) => (i.id === newInst.id ? persisted : i)));
        }
      }).catch(console.error);
    }

    return newInst;
  };

  const approveInstitution = (id: string, notes?: string) => {
    setInstitutions((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              status: 'Active',
              verifiedAt: new Date().toISOString().substring(0, 10),
              verificationNotes: notes || 'Verified and Authorized by Platform Super Admin',
            }
          : i
      )
    );

    if (isSupabaseConfigured()) {
      institutionService.updateStatus(id, 'Active', notes).catch(console.error);
    }
  };

  const rejectInstitution = (id: string, reason: string) => {
    setInstitutions((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'Rejected', rejectionReason: reason } : i))
    );

    if (isSupabaseConfigured()) {
      institutionService.updateStatus(id, 'Rejected', undefined, reason).catch(console.error);
    }
  };

  const suspendInstitution = (id: string, reason: string) => {
    setInstitutions((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'Suspended', rejectionReason: reason } : i))
    );

    if (isSupabaseConfigured()) {
      institutionService.updateStatus(id, 'Suspended', undefined, reason).catch(console.error);
    }
  };

  const inviteMember = (memberData: Omit<UserProfile, 'id' | 'status'>) => {
    const newMember: UserProfile = {
      ...memberData,
      id: `usr-${Date.now()}`,
      status: 'Active',
      memberId: `MBR-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setMembers((prev) => [newMember, ...prev]);
  };

  const clockInEmployee = (employeeId: string, workMode: 'Office' | 'Remote' | 'Client Site') => {
    const staff = corporateStaff.find((s) => s.id === employeeId);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const today = new Date().toISOString().substring(0, 10);

    const newRecord: EmployeeClockRecord = {
      id: `clk-${Date.now()}`,
      institutionId: currentInstitution.id,
      employeeId,
      employeeName: staff ? staff.fullName : 'Employee',
      date: today,
      clockInTime: nowTime,
      workMode,
      status: 'Present',
    };
    setClockRecords((prev) => [newRecord, ...prev]);

    if (isSupabaseConfigured() && staff) {
      corporateService.clockIn(currentInstitution.id, employeeId, staff.fullName, workMode).catch(console.error);
    }
  };

  const clockOutEmployee = (recordId: string) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setClockRecords((prev) =>
      prev.map((r) => (r.id === recordId ? { ...r, clockOutTime: nowTime, durationHours: 8.5 } : r))
    );

    if (isSupabaseConfigured()) {
      corporateService.clockOut(recordId, 8.5).catch(console.error);
    }
  };

  const addHoliday = (holidayData: Omit<HolidayItem, 'id' | 'institutionId'>) => {
    const newHol: HolidayItem = {
      ...holidayData,
      id: `hol-${Date.now()}`,
      institutionId: currentInstitution.id,
    };
    setHolidays((prev) => [...prev, newHol]);
  };

  const publishCircular = (circData: Omit<GovernmentCircular, 'id' | 'institutionId' | 'publishedDate'>) => {
    const newCirc: GovernmentCircular = {
      ...circData,
      id: `circ-${Date.now()}`,
      institutionId: currentInstitution.id,
      publishedDate: new Date().toISOString().substring(0, 10),
    };
    setCirculars((prev) => [newCirc, ...prev]);

    if (isSupabaseConfigured()) {
      governmentService.createCircular(newCirc).catch(console.error);
    }
  };

  const createFileRecord = (fileData: Omit<FileTrackingRecord, 'id' | 'institutionId' | 'lastMovedAt'>) => {
    const newFile: FileTrackingRecord = {
      ...fileData,
      id: `file-${Date.now()}`,
      institutionId: currentInstitution.id,
      lastMovedAt: new Date().toLocaleString(),
    };
    setFileTracking((prev) => [newFile, ...prev]);
  };

  const moveFileDesk = (fileId: string, nextDesk: string, remarks: string) => {
    setFileTracking((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? {
              ...f,
              currentDesk: nextDesk,
              lastMovedAt: new Date().toLocaleString(),
              remarks,
            }
          : f
      )
    );

    if (isSupabaseConfigured()) {
      governmentService.moveFileDesk(fileId, nextDesk, remarks).catch(console.error);
    }
  };

  const addStudent = (studentData: Omit<Student, 'id' | 'studentId' | 'attendanceRate'>) => {
    const nextNumber = students.length + 1;
    const newStudent: Student = {
      ...studentData,
      id: `stu-${Date.now()}`,
      studentId: `STU-2024-${String(nextNumber).padStart(3, '0')}`,
      attendanceRate: 85.0,
    };
    setStudents((prev) => [newStudent, ...prev]);

    if (isSupabaseConfigured()) {
      studentService.create(studentData).catch(console.error);
    }
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const addFaculty = (facData: Omit<Faculty, 'id' | 'employeeId'>) => {
    const newFac: Faculty = {
      ...facData,
      id: `fac-${Date.now()}`,
      employeeId: `FAC-${100 + faculty.length + 1}`,
    };
    setFaculty((prev) => [...prev, newFac]);
  };

  const addClassroom = (roomData: Omit<Classroom, 'id'>) => {
    const newRoom: Classroom = {
      ...roomData,
      id: `room-${Date.now()}`,
    };
    setClassrooms((prev) => [...prev, newRoom]);

    if (isSupabaseConfigured()) {
      classroomService
        .create({
          ...roomData,
          institutionId: currentInstitution.id,
        })
        .then((persisted) => {
          if (persisted) {
            setClassrooms((prev) => prev.map((r) => (r.id === newRoom.id ? persisted : r)));
          }
        })
        .catch(console.error);
    }
  };

  const addTimetableSlot = (slotData: Omit<TimetableSlot, 'id'>) => {
    const conflictFaculty = timetable.find(
      (t) =>
        t.day === slotData.day &&
        t.timeSlot === slotData.timeSlot &&
        t.facultyId &&
        t.facultyId === slotData.facultyId &&
        !t.isBreak
    );
    if (conflictFaculty) {
      return {
        success: false,
        conflictMessage: `Faculty Conflict: ${slotData.facultyName} is already assigned to ${conflictFaculty.classroom} (${conflictFaculty.subject}) during ${slotData.timeSlot} on ${slotData.day}!`,
      };
    }

    const conflictRoom = timetable.find(
      (t) =>
        t.day === slotData.day &&
        t.timeSlot === slotData.timeSlot &&
        t.classroom === slotData.classroom &&
        !t.isBreak
    );
    if (conflictRoom) {
      return {
        success: false,
        conflictMessage: `Room Conflict: ${slotData.classroom} is already occupied by ${conflictRoom.subject} (${conflictRoom.facultyName}) during ${slotData.timeSlot} on ${slotData.day}!`,
      };
    }

    const newSlot: TimetableSlot = {
      ...slotData,
      id: `tt-${Date.now()}`,
    };
    setTimetable((prev) => [...prev, newSlot]);

    if (isSupabaseConfigured()) {
      timetableService
        .createSlot({
          ...slotData,
          institutionId: currentInstitution.id,
        })
        .then((res) => {
          if (res.slot) {
            setTimetable((prev) => prev.map((s) => (s.id === newSlot.id ? res.slot! : s)));
          }
        })
        .catch(console.error);
    }

    return { success: true };
  };

  const markAttendance = (recordData: Omit<AttendanceRecord, 'id' | 'timestamp'>) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newRecord: AttendanceRecord = {
      ...recordData,
      id: `att-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      timestamp,
    };
    setAttendance((prev) => [newRecord, ...prev]);

    if (isSupabaseConfigured()) {
      attendanceService
        .bulkMark([
          {
            ...recordData,
            institutionId: currentInstitution.id,
          },
        ])
        .catch(console.error);
    }
  };

  const bulkMarkAttendance = (records: Omit<AttendanceRecord, 'id' | 'timestamp'>[]) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setAttendance((prev) => {
      const map = new Map<string, AttendanceRecord>();
      prev.forEach((r) => map.set(`${r.studentId}-${r.date}-${r.session}`, r));
      records.forEach((r) => {
        const key = `${r.studentId}-${r.date}-${r.session}`;
        map.set(key, {
          ...r,
          id: `att-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          timestamp,
        });
      });
      return Array.from(map.values());
    });

    if (isSupabaseConfigured() && records.length > 0) {
      attendanceService.bulkMark(
        records.map((r) => ({ ...r, institutionId: currentInstitution.id }))
      ).catch(console.error);
    }
  };

  const addAssignment = (asgData: Omit<Assignment, 'id' | 'submissionCount' | 'status'>) => {
    const newAsg: Assignment = {
      ...asgData,
      id: `asg-${Date.now()}`,
      submissionCount: 0,
      status: 'In Progress',
    };
    setAssignments((prev) => [newAsg, ...prev]);
  };

  const submitAssignment = (subData: Omit<AssignmentSubmission, 'id' | 'submissionDate' | 'status'>) => {
    const newSub: AssignmentSubmission = {
      ...subData,
      id: `sub-${Date.now()}`,
      submissionDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Submitted',
    };
    setSubmissions((prev) => [newSub, ...prev]);
  };

  const gradeSubmission = (id: string, marks: number, feedback: string) => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: 'Graded',
              marksObtained: marks,
              feedback,
              gradedBy: currentUser.fullName,
              gradedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            }
          : s
      )
    );
  };

  const publishExamResults = (examId: string) => {
    setExaminations((prev) =>
      prev.map((e) => (e.id === examId ? { ...e, status: 'Published' } : e))
    );
    setExamResults((prev) =>
      prev.map((r) => (r.examId === examId ? { ...r, status: 'Published' } : r))
    );
  };

  const addExamResult = (resultData: Omit<StudentExamResult, 'id'>) => {
    setExamResults((prev) => [{ ...resultData, id: `res-${Date.now()}` }, ...prev]);
  };

  const createInvoice = (invData: Omit<FeeInvoice, 'id' | 'invoiceNumber'>) => {
    const invoiceNumber = `INV-2024-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInv: FeeInvoice = {
      ...invData,
      id: `inv-${Date.now()}`,
      invoiceNumber,
    };
    setInvoices((prev) => [newInv, ...prev]);

    if (isSupabaseConfigured()) {
      financeService
        .createInvoice({
          ...invData,
          invoiceNumber,
          institutionId: currentInstitution.id,
        })
        .then((persisted) => {
          if (persisted) {
            setInvoices((prev) => prev.map((i) => (i.id === newInv.id ? persisted : i)));
          }
        })
        .catch(console.error);
    }
  };

  const payInvoice = (
    invoiceId: string,
    amount: number,
    paymentMethod: string,
    transactionId: string
  ) => {
    const nowStr = new Date().toISOString().substring(0, 10);
    let matchedStudentId = '';
    let matchedStudentName = '';

    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          matchedStudentId = inv.studentId;
          matchedStudentName = inv.studentName;
          const newPaid = inv.paidAmount + amount;
          const newDue = Math.max(0, inv.totalAmount - newPaid);
          return {
            ...inv,
            paidAmount: newPaid,
            dueAmount: newDue,
            status: newDue === 0 ? 'Paid' : 'Partially Paid',
            paymentDate: nowStr,
            transactionId,
            paymentMethod: paymentMethod as any,
          };
        }
        return inv;
      })
    );

    const newTxn: PaymentTransaction = {
      id: `txn-${Date.now()}`,
      invoiceId,
      studentId: matchedStudentId,
      studentName: matchedStudentName,
      amount,
      currency: 'INR',
      paymentMethod,
      razorpayPaymentId: transactionId,
      status: 'Success',
      createdAt: new Date().toISOString(),
      receiptNumber: `RCPT-${Date.now().toString().slice(-6)}`,
    };
    setTransactions((prev) => [newTxn, ...prev]);

    if (isSupabaseConfigured()) {
      financeService.recordPayment(invoiceId, amount, paymentMethod, transactionId).catch(console.error);
    }
  };

  const processPayroll = (recordId: string, paymentRef?: string) => {
    const ref = paymentRef || `BANK-DISB-${Date.now().toString().slice(-6)}`;
    const today = new Date().toISOString().split('T')[0];

    setPayrollRecords((prev) =>
      prev.map((p) =>
        p.id === recordId
          ? {
              ...p,
              status: 'Paid',
              paymentDate: today,
              paymentRef: ref,
            }
          : p
      )
    );

    if (isSupabaseConfigured()) {
      corporateService.updatePayrollStatus(recordId, 'Paid', ref).catch(console.error);
    }
  };

  const addPayrollRecord = (recordData: Omit<PayrollRecord, 'id' | 'institutionId'>) => {
    const newPayroll: PayrollRecord = {
      ...recordData,
      id: `pay-${Date.now()}`,
      institutionId: currentInstitution.id,
    };
    setPayrollRecords((prev) => [newPayroll, ...prev]);

    if (isSupabaseConfigured()) {
      corporateService
        .createPayroll({
          ...recordData,
          institutionId: currentInstitution.id,
        })
        .then((persisted) => {
          if (persisted) {
            setPayrollRecords((prev) => prev.map((p) => (p.id === newPayroll.id ? persisted : p)));
          }
        })
        .catch(console.error);
    }
  };

  const addSubject = (subject: string) => {
    if (subject.trim() && !subjects.includes(subject.trim())) {
      setSubjects((prev) => [...prev, subject.trim()]);
    }
  };

  const addAnnouncement = (ancData: Omit<Announcement, 'id' | 'publishedAt' | 'readCount'>) => {
    setAnnouncements((prev) => [
      {
        ...ancData,
        id: `anc-${Date.now()}`,
        publishedAt: new Date().toLocaleString(),
        readCount: 1,
      },
      ...prev,
    ]);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const applyLeave = (leaveData: Omit<LeaveRequest, 'id' | 'status' | 'appliedOn'>) => {
    setLeaveRequests((prev) => [
      {
        ...leaveData,
        id: `lev-${Date.now()}`,
        status: 'Pending',
        appliedOn: new Date().toISOString().substring(0, 10),
      },
      ...prev,
    ]);
  };

  const updateLeaveStatus = (id: string, status: 'Approved' | 'Rejected', approverName: string) => {
    setLeaveRequests((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status, approvedBy: approverName } : l))
    );
  };

  const issueBook = (bookId: string) => {
    setLibraryBooks((prev) =>
      prev.map((b) => (b.id === bookId && b.availableCopies > 0 ? { ...b, availableCopies: b.availableCopies - 1 } : b))
    );
  };

  const returnBook = (bookId: string) => {
    setLibraryBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b))
    );
  };

  const createTicket = (ticketData: Omit<SupportTicket, 'id' | 'ticketNumber' | 'status' | 'createdAt'>) => {
    setSupportTickets((prev) => [
      {
        ...ticketData,
        id: `tkt-${Date.now()}`,
        ticketNumber: `TKT-2024-${Math.floor(100 + Math.random() * 900)}`,
        status: 'Open',
        createdAt: new Date().toLocaleString(),
      },
      ...prev,
    ]);
  };

  const resolveTicket = (id: string) => {
    setSupportTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'Resolved' } : t)));
  };

  const updateIntegration = (id: string, updates: Partial<IntegrationConfig>) => {
    setIntegrations((prev) => prev.map((int) => (int.id === id ? { ...int, ...updates } : int)));
  };

  const resetToDefaults = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setInstitutions(INITIAL_INSTITUTIONS);
    setCurrentInstitution(INITIAL_INSTITUTIONS[0]);
    setCurrentUser(DEMO_USERS[0]);
    setMembers(DEMO_USERS);
    setCorporateStaff(INITIAL_CORPORATE_STAFF);
    setClockRecords(INITIAL_EMPLOYEE_CLOCK_RECORDS);
    setPayrollRecords(INITIAL_PAYROLL_RECORDS);
    setHolidays(INITIAL_HOLIDAYS);
    setCirculars(INITIAL_CIRCULARS);
    setFileTracking(INITIAL_FILE_TRACKING);
    setStudents(INITIAL_STUDENTS);
    setFaculty(INITIAL_FACULTY);
    setClassrooms(INITIAL_CLASSROOMS);
    setTimetable(INITIAL_TIMETABLE);
    setAttendance(INITIAL_ATTENDANCE);
    setAssignments(INITIAL_ASSIGNMENTS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setExaminations(INITIAL_EXAMINATIONS);
    setExamResults(INITIAL_STUDENT_RESULTS);
    setFeeStructures(INITIAL_FEE_STRUCTURES);
    setInvoices(INITIAL_INVOICES);
    setTransactions([]);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setLeaveRequests(INITIAL_LEAVE_REQUESTS);
    setLibraryBooks(INITIAL_LIBRARY_BOOKS);
    setSupportTickets(INITIAL_TICKETS);
    setIntegrations(INITIAL_INTEGRATIONS);
  };

  return (
    <StoreContext.Provider
      value={{
        isSupabaseLive,
        currentUser,
        setCurrentUser,
        switchRole,
        signOut,
        institutions,
        currentInstitution,
        setCurrentInstitution,
        registerInstitution,
        approveInstitution,
        rejectInstitution,
        suspendInstitution,
        members,
        inviteMember,
        corporateStaff,
        clockRecords,
        clockInEmployee,
        clockOutEmployee,
        payrollRecords,
        processPayroll,
        addPayrollRecord,
        holidays,
        addHoliday,
        circulars,
        publishCircular,
        fileTracking,
        createFileRecord,
        moveFileDesk,
        subjects,
        addSubject,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        faculty,
        addFaculty,
        classrooms,
        addClassroom,
        timetable,
        addTimetableSlot,
        attendance,
        markAttendance,
        bulkMarkAttendance,
        assignments,
        addAssignment,
        submissions,
        submitAssignment,
        gradeSubmission,
        examinations,
        examResults,
        publishExamResults,
        addExamResult,
        feeStructures,
        invoices,
        transactions,
        createInvoice,
        payInvoice,
        announcements,
        addAnnouncement,
        deleteAnnouncement,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        leaveRequests,
        applyLeave,
        updateLeaveStatus,
        libraryBooks,
        issueBook,
        returnBook,
        supportTickets,
        createTicket,
        resolveTicket,
        integrations,
        updateIntegration,
        resetToDefaults,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
