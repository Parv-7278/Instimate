'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/storeContext';
import {
  FileText,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Calendar,
  CreditCard,
  UserCheck,
  Award,
  ChevronRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface OverviewDashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenPaymentModal?: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  onNavigateTab,
  onOpenPaymentModal,
}) => {
  const {
    students,
    invoices,
    timetable,
    currentInstitution,
    currentUser,
  } = useStore();

  const [selectedClass, setSelectedClass] = useState('Class 10-A');

  // Attendance metrics calculation
  const totalStudentsCount = students.length;
  // Matching screenshot: 82% Present, 12% Absent, 6% Late
  const attendancePieData = [
    { name: 'Present', value: 82, color: '#0d9488' }, // Teal
    { name: 'Absent', value: 12, color: '#0284c7' }, // Blue
    { name: 'Late', value: 6, color: '#f97316' }, // Coral / Orange
  ];

  // Fee calculation (Matching reference screenshot: Total $48,500, Paid $36,200, Due $12,300)
  const totalFees = 48500;
  const paidFees = 36200;
  const dueFees = 12300;

  // Exam stats (Matching reference screenshot: Average 78%, Pass 86%, Failed 12%)
  const examBarData = [
    { subject: 'Math', term1: 76, term2: 88 },
    { subject: 'Science', term1: 68, term2: 82 },
    { subject: 'History', term1: 85, term2: 74 },
    { subject: 'English', term1: 82, term2: 86 },
    { subject: 'Biology', term1: 90, term2: 92 },
  ];

  // Filter timetable for selected class
  const classTimetable = timetable.filter((t) => t.classId === selectedClass || t.isBreak);

  const timeSlots = [
    '8:00 AM - 9:00 AM',
    '9:15 AM - 10:15 AM',
    '10:30 AM - 11:30 AM',
    '11:30 AM - 12:00 PM', // Lunch break
    '12:00 PM - 1:00 PM',
  ];

  const days: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'> = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Institution Overview
            </h1>
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 border border-teal-200">
              Academic Year 2024–2025
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time administrative telemetry, attendance tracking, fee reconciliation, and academic results.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="Class 10-A">Class 10-A (Secondary)</option>
            <option value="Class 10-B">Class 10-B (Commerce)</option>
            <option value="Class 9-A">Class 9-A</option>
          </select>

          <button
            onClick={() => onNavigateTab('attendance')}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0d6474] to-[#127d91] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-95 transition"
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span>Mark Roll Call</span>
          </button>
        </div>
      </div>

      {/* Top 3 Cards Row (Matching exact layout from reference mockup!) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Student Attendance */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 tracking-tight">
                Student Attendance
              </h2>
              <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                Today
              </span>
            </div>

            {/* Donut Chart representation */}
            <div className="relative flex items-center justify-center my-3 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendancePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={74}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {attendancePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`${val}%`, 'Rate']}
                    contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center percentage display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
                  82%
                </span>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                  Present
                </span>
              </div>
            </div>

            {/* Legend matching mockup */}
            <div className="flex items-center justify-around text-xs pt-2">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-[#0d9488]" />
                <span className="font-bold text-slate-800">82%</span>
                <span className="text-slate-500">Present</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-[#0284c7]" />
                <span className="font-bold text-slate-800">12%</span>
                <span className="text-slate-500">Absent</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-[#f97316]" />
                <span className="font-bold text-slate-800">6%</span>
                <span className="text-slate-500">Late</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
            <button
              onClick={() => onNavigateTab('attendance')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 transition flex items-center gap-1"
            >
              <span>View Report</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <span className="text-[11px] text-slate-400">
              {totalStudentsCount} Students enrolled
            </span>
          </div>
        </div>

        {/* Card 2: Fees Collection */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 tracking-tight">
                Fees Collection
              </h2>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Q3 Active
              </span>
            </div>

            {/* 3 Metric Badges matching mockup */}
            <div className="grid grid-cols-3 gap-2 my-3">
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-2 text-center">
                <p className="text-[10px] text-slate-400 font-medium">Total Fees</p>
                <p className="text-sm font-bold text-slate-800">
                  ${totalFees.toLocaleString()}
                </p>
                <span className="text-[9px] text-slate-400">Term Total</span>
              </div>

              <div className="rounded-xl bg-emerald-500 text-white p-2 text-center shadow-sm">
                <p className="text-[10px] text-emerald-100 font-medium">Paid</p>
                <p className="text-sm font-bold text-white">
                  ${paidFees.toLocaleString()}
                </p>
                <span className="text-[9px] text-emerald-100">Verified</span>
              </div>

              <div className="rounded-xl bg-rose-500 text-white p-2 text-center shadow-sm">
                <p className="text-[10px] text-rose-100 font-medium">Due</p>
                <p className="text-sm font-bold text-white">
                  ${dueFees.toLocaleString()}
                </p>
                <span className="text-[9px] text-rose-100">Outstanding</span>
              </div>
            </div>

            {/* Payment Status Progress Bars matching mockup */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-semibold text-slate-700">Payment Status</p>

              {/* Bar 1 */}
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div style={{ width: '45%' }} className="bg-[#0e7490] h-full" />
                <div style={{ width: '35%' }} className="bg-[#2dd4bf] h-full" />
              </div>

              {/* Bar 2 */}
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div style={{ width: '55%' }} className="bg-[#0e7490] h-full" />
                <div style={{ width: '28%' }} className="bg-[#fb923c] h-full" />
              </div>

              {/* Bar 3 */}
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div style={{ width: '38%' }} className="bg-[#f87171] h-full" />
              </div>

              {/* Legend matching mockup */}
              <div className="flex items-center justify-around text-xs pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-[#0e7490]" />
                  <span className="text-slate-600 text-[11px]">Paid</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-[#2dd4bf]" />
                  <span className="text-slate-600 text-[11px]">Due</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-[#fb923c]" />
                  <span className="text-slate-600 text-[11px]">Overdue</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between">
            <button
              onClick={() => onNavigateTab('finance')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 transition flex items-center gap-1"
            >
              <span>View Invoices</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>

            {onOpenPaymentModal && (
              <button
                onClick={onOpenPaymentModal}
                className="flex items-center gap-1 rounded-lg bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 hover:bg-teal-100 border border-teal-200 transition"
              >
                <CreditCard className="h-3 w-3" />
                <span>Razorpay Demo</span>
              </button>
            )}
          </div>
        </div>

        {/* Card 3: Exam Results */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 tracking-tight">
                Exam Results
              </h2>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                Midterms
              </span>
            </div>

            {/* 3 Metrics with icons matching mockup */}
            <div className="grid grid-cols-3 gap-2 my-2.5">
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2">
                <FileText className="h-5 w-5 text-slate-600 shrink-0" />
                <div>
                  <p className="text-[9px] text-slate-400 font-medium">Avg Score</p>
                  <p className="text-xs font-bold text-slate-800">78%</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-[9px] text-emerald-600 font-medium">Pass Rate</p>
                  <p className="text-xs font-bold text-emerald-900">86%</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-2">
                <XCircle className="h-5 w-5 text-rose-600 shrink-0" />
                <div>
                  <p className="text-[9px] text-rose-600 font-medium">Failed</p>
                  <p className="text-xs font-bold text-rose-900">12%</p>
                </div>
              </div>
            </div>

            {/* Subject Comparison Bar Chart matching mockup */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-slate-700 mb-1">Recent Exams</p>
              <div className="h-36 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={examBarData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <XAxis dataKey="subject" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 9 }} domain={[0, 100]} />
                    <Tooltip
                      formatter={(val: any) => [`${val}%`, 'Marks']}
                      contentStyle={{ borderRadius: '8px', fontSize: '11px' }}
                    />
                    <Bar dataKey="term1" fill="#0d9488" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="term2" fill="#2dd4bf" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-2 flex items-center justify-between">
            <button
              onClick={() => onNavigateTab('exams')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 transition flex items-center gap-1"
            >
              <span>Detailed Analytics</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <span className="text-[11px] text-slate-400">Class 10-A Cohort</span>
          </div>
        </div>
      </div>

      {/* Bottom Full-Width Table Card: Class Timetable (Matching reference screenshot exactly!) */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-800 tracking-tight">
              Class Timetable
            </h2>
            <p className="text-xs text-slate-500">
              Weekly lecture schedule for {selectedClass} • Aryabhata Block Room 302
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('timetable')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200 transition"
            >
              Interactive Schedule Editor
            </button>
          </div>
        </div>

        {/* Timetable Schedule Grid Table (Exact copy of reference image!) */}
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[650px] border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200">
                <th className="py-3 px-4 font-bold w-36 text-center">Time</th>
                {days.map((day) => (
                  <th key={day} className="py-3 px-4 font-bold text-center">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {timeSlots.map((slot) => {
                // If it's Lunch Break row
                if (slot === '11:30 AM - 12:00 PM') {
                  return (
                    <tr key={slot} className="bg-teal-50/70 border-y border-teal-200/60">
                      <td colSpan={6} className="py-2.5 text-center font-bold text-teal-800 text-xs tracking-wide">
                        Lunch Break (11:30 AM – 12:00 PM)
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={slot} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap bg-slate-50/50 text-center border-r border-slate-200/50">
                      {slot}
                    </td>

                    {days.map((day) => {
                      const matched = classTimetable.find(
                        (t) => t.timeSlot === slot && t.day === day && !t.isBreak
                      );

                      return (
                        <td key={day} className="py-3 px-4 text-center">
                          {matched ? (
                            <div className="group relative inline-block">
                              <span className="font-semibold text-slate-800 hover:text-teal-700 cursor-pointer">
                                {matched.subject}
                              </span>
                              <div className="text-[10px] text-slate-400">
                                {matched.classroom}
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
