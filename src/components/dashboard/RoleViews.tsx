'use client';

import React from 'react';
import { useStore } from '@/lib/storeContext';
import {
  BookOpen,
  CalendarCheck,
  CreditCard,
  FileCheck,
  Award,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  UserCheck,
  Building,
  TrendingUp,
  Download,
} from 'lucide-react';

interface RoleDashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenPaymentModal: (invoiceId?: string) => void;
}

export const StudentDashboardView: React.FC<RoleDashboardProps> = ({
  onNavigateTab,
  onOpenPaymentModal,
}) => {
  const { students, assignments, invoices, examResults, timetable } = useStore();

  // Pick Aarav Patel (STU-2024-001) as current student demo, with safe fallback
  const student = students[0] || {
    id: 'demo-student',
    fullName: 'Aarav Patel',
    rollNo: '001',
    classId: 'Class 10-A',
    course: 'General Sciences',
    studentId: 'STU-2024-001',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    attendanceRate: 92,
  };
  const studentInvoices = invoices.filter((i) => i.studentId === student?.id || i.status !== 'Paid');
  const studentResults = examResults.filter((r) => r.studentId === student?.id && r.status === 'Published');
  const pendingAssignments = assignments.filter((a) => a.classId === student?.classId);

  return (
    <div className="space-y-6">
      {/* Student Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0d6474] to-[#127d91] p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={student.avatarUrl}
            alt={student.fullName}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
            }}
            className="h-16 w-16 rounded-2xl object-cover ring-4 ring-white/20 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{student.fullName}</h1>
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold">
                Roll #{student.rollNo}
              </span>
            </div>
            <p className="text-xs text-teal-100 mt-0.5">
              {student.classId} • {student.course} • ID: {student.studentId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white/10 px-4 py-2 text-center border border-white/15">
            <p className="text-[10px] text-teal-200">Attendance Rate</p>
            <p className="text-lg font-extrabold text-white">{student.attendanceRate}%</p>
          </div>
          <div className="rounded-xl bg-white/10 px-4 py-2 text-center border border-white/15">
            <p className="text-[10px] text-teal-200">Term CGPA</p>
            <p className="text-lg font-extrabold text-white">8.8 / 10</p>
          </div>
        </div>
      </div>

      {/* Grid: Assignments & Fee Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Assignments */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4.5 w-4.5 text-teal-600" />
              <h2 className="text-sm font-bold text-slate-800">My Academic Tasks & Homework</h2>
            </div>
            <button
              onClick={() => onNavigateTab('assignments')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700"
            >
              View All ({pendingAssignments.length})
            </button>
          </div>

          <div className="mt-3 space-y-3">
            {pendingAssignments.map((asg) => (
              <div
                key={asg.id}
                className="rounded-xl border border-slate-200/70 p-3 hover:border-teal-300 transition bg-slate-50/50"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {asg.subject}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 mt-1">{asg.title}</h3>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                    Due: {asg.dueDate}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{asg.description}</p>
                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">Max Marks: {asg.maxMarks}</span>
                  <button
                    onClick={() => onNavigateTab('assignments')}
                    className="text-xs font-semibold text-teal-700 hover:underline"
                  >
                    Submit Assignment →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fees and Invoices */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4.5 w-4.5 text-teal-600" />
              <h2 className="text-sm font-bold text-slate-800">Fee Invoices & Online Payment</h2>
            </div>
            <button
              onClick={() => onNavigateTab('finance')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700"
            >
              Finance Portal
            </button>
          </div>

          <div className="mt-3 space-y-3">
            {studentInvoices.map((inv) => (
              <div
                key={inv.id}
                className="rounded-xl border border-slate-200/70 p-3.5 bg-slate-50/50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{inv.title}</p>
                    <p className="text-[11px] text-slate-500">{inv.invoiceNumber} • Due {inv.dueDate}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      inv.status === 'Paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : inv.status === 'Partially Paid'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/60">
                  <div>
                    <span className="text-[10px] text-slate-400">Outstanding Due:</span>
                    <p className="text-sm font-extrabold text-slate-800">
                      ₹{inv.dueAmount.toLocaleString()}
                    </p>
                  </div>

                  {inv.dueAmount > 0 ? (
                    <button
                      onClick={() => onOpenPaymentModal(inv.id)}
                      className="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition"
                    >
                      Pay Online via Razorpay
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5" /> Fully Paid
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest Published Results */}
      {studentResults.length > 0 && (
        <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Award className="h-4.5 w-4.5 text-amber-500" />
              <h2 className="text-sm font-bold text-slate-800">
                Latest Published Examination Results ({studentResults[0].examTitle})
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('exams')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              <Download className="h-3.5 w-3.5" /> Download Official Report Card
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
            {studentResults[0].subjectResults.map((sub) => (
              <div
                key={sub.subject}
                className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-center"
              >
                <p className="text-xs font-bold text-slate-800">{sub.subject}</p>
                <p className="text-lg font-extrabold text-teal-700 my-1">
                  {sub.marksObtained}
                  <span className="text-xs text-slate-400 font-normal">/{sub.maxMarks}</span>
                </p>
                <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Grade {sub.grade}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const FacultyDashboardView: React.FC<RoleDashboardProps> = ({ onNavigateTab }) => {
  const { faculty, assignments, submissions, timetable } = useStore();
  const currentFac = faculty[0] || {
    id: 'demo-faculty',
    fullName: 'Prof. Ananya Sharma',
    designation: 'Assistant Professor',
    department: 'Computer Science',
    assignedClasses: ['Class 10-A'],
    subjects: ['Data Structures'],
  };

  const pendingGrading = submissions.filter((s) => s.status !== 'Graded');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-[#0e4d59] p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-300">
            Faculty Teaching Portal
          </span>
          <h1 className="text-xl font-bold mt-1">{currentFac.fullName}</h1>
          <p className="text-xs text-slate-300">
            {currentFac.designation} • Dept of {currentFac.department}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('attendance')}
            className="rounded-xl bg-teal-500 hover:bg-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition"
          >
            Mark Class Attendance
          </button>
          <button
            onClick={() => onNavigateTab('assignments')}
            className="rounded-xl bg-white/10 hover:bg-white/20 px-3.5 py-2 text-xs font-bold text-white border border-white/20 transition"
          >
            Create Assignment
          </button>
        </div>
      </div>

      {/* Grid: Assigned Classes & Grading Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800">
              Assigned Subjects & Class Batches
            </h2>
            <span className="text-xs text-slate-400">Term 1 Active</span>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentFac.assignedClasses.map((cls) => (
              <div
                key={cls}
                className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 hover:border-teal-300 transition"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900">{cls}</h3>
                  <span className="text-[10px] font-semibold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Subjects: {currentFac.subjects.join(', ')}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => onNavigateTab('attendance')}
                    className="text-xs font-semibold text-teal-600 hover:underline"
                  >
                    Attendance
                  </button>
                  <span className="text-slate-300">•</span>
                  <button
                    onClick={() => onNavigateTab('exams')}
                    className="text-xs font-semibold text-teal-600 hover:underline"
                  >
                    Enter Marks
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Grading Queue */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800">Pending Grading Queue</h2>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              {pendingGrading.length} Items
            </span>
          </div>

          <div className="mt-3 space-y-2.5">
            {pendingGrading.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                All submitted assignments graded!
              </div>
            ) : (
              pendingGrading.map((sub) => (
                <div key={sub.id} className="rounded-xl border border-slate-200 p-3 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-xs text-slate-800">{sub.studentName}</p>
                    <span className="text-[10px] text-slate-400">{sub.submissionDate}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-1">{sub.content}</p>
                  <button
                    onClick={() => onNavigateTab('assignments')}
                    className="mt-2 text-xs font-semibold text-teal-600 hover:underline"
                  >
                    Grade & Provide Feedback →
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
