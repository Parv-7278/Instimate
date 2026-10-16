'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/storeContext';
import { AttendanceRecord } from '@/types';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Download,
  Printer,
  Sparkles,
  Save,
  Check,
} from 'lucide-react';
import { handleHorizontalWheel } from '@/lib/utils';


export const AttendanceModule: React.FC = () => {
  const { students, attendance, markAttendance, bulkMarkAttendance, currentUser } = useStore();

  const [selectedClass, setSelectedClass] = useState('Class 10-A');
  const [selectedSession, setSelectedSession] = useState<'Full Day' | 'Morning' | 'Lecture'>('Full Day');
  const [attendanceDate, setAttendanceDate] = useState('2026-10-10');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filter students in selected class
  const classStudents = students.filter((s) => s.classId === selectedClass);

  // Map student current status for today
  const getStudentStatus = (studentId: string): 'Present' | 'Absent' | 'Late' | 'On Leave' => {
    const record = attendance.find(
      (a) => a.studentId === studentId && a.date === attendanceDate && a.session === selectedSession
    );
    return record ? record.status : 'Present';
  };

  const [currentStatuses, setCurrentStatuses] = useState<Record<string, 'Present' | 'Absent' | 'Late' | 'On Leave'>>({});

  // Initialize or fetch status
  const getEffectiveStatus = (studentId: string) => {
    if (currentStatuses[studentId]) return currentStatuses[studentId];
    return getStudentStatus(studentId);
  };

  const setStatus = (studentId: string, status: 'Present' | 'Absent' | 'Late' | 'On Leave') => {
    setCurrentStatuses((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAll = (status: 'Present' | 'Absent' | 'Late') => {
    const updated: Record<string, 'Present' | 'Absent' | 'Late' | 'On Leave'> = {};
    classStudents.forEach((s) => {
      updated[s.id] = status;
    });
    setCurrentStatuses(updated);
  };

  const handleSaveAttendance = () => {
    const recordsToSave: Omit<AttendanceRecord, 'id' | 'timestamp'>[] = classStudents.map((s) => ({
      studentId: s.id,
      studentName: s.fullName,
      rollNo: s.rollNo,
      classId: selectedClass,
      date: attendanceDate,
      session: selectedSession,
      status: getEffectiveStatus(s.id),
      markedBy: currentUser.fullName,
    }));

    bulkMarkAttendance(recordsToSave);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Stats calculation
  const totalCount = classStudents.length;
  const presentCount = classStudents.filter((s) => getEffectiveStatus(s.id) === 'Present').length;
  const absentCount = classStudents.filter((s) => getEffectiveStatus(s.id) === 'Absent').length;
  const lateCount = classStudents.filter((s) => getEffectiveStatus(s.id) === 'Late').length;
  const leaveCount = classStudents.filter((s) => getEffectiveStatus(s.id) === 'On Leave').length;
  const presentRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  const handleExportCSV = () => {
    const headers = 'Roll No,Student Name,Class,Date,Session,Attendance Status,Marked By\n';
    const rows = classStudents
      .map(
        (s) =>
          `"${s.rollNo}","${s.fullName}","${selectedClass}","${attendanceDate}","${selectedSession}","${getEffectiveStatus(s.id)}","${currentUser.fullName}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Attendance_${selectedClass}_${attendanceDate}.csv`;
    a.click();
    setTimeout(() => window.URL.revokeObjectURL(url), 200);
  };


  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Live Attendance Register
            </h1>
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 border border-teal-200">
              Audit-Logged
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Record lecture sessions, calculate rates automatically, and trigger low attendance parent alerts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Register</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Sheet</span>
          </button>

          <button
            onClick={handleSaveAttendance}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-sm transition ${
              saveSuccess ? 'bg-emerald-600' : 'bg-gradient-to-r from-[#0d6474] to-[#127d91] hover:opacity-95'
            }`}
          >
            {saveSuccess ? (
              <>
                <Check className="h-4 w-4" />
                <span>Attendance Saved!</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save & Commit Session</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Control Filters & Summary Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Selector Filters */}
        <div className="md:col-span-2 rounded-2xl bg-white p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Class & Section
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-teal-500"
            >
              <option value="Class 10-A">Class 10-A (Aryabhata Block 302)</option>
              <option value="Class 10-B">Class 10-B (Aryabhata Block 304)</option>
              <option value="Class 9-A">Class 9-A</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Session Type
            </label>
            <select
              value={selectedSession}
              onChange={(e: any) => setSelectedSession(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-teal-500"
            >
              <option value="Full Day">Full Day (Regular)</option>
              <option value="Morning">Morning Session</option>
              <option value="Lecture">Lecture Period 1</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Date
            </label>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Live Metrics Cards */}
        <div className="md:col-span-2 rounded-2xl bg-white p-4 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="text-center px-2">
            <p className="text-[10px] text-slate-400 font-medium">Present</p>
            <p className="text-base font-extrabold text-teal-700">{presentCount}</p>
            <span className="text-[10px] text-teal-600 font-semibold">{presentRate}%</span>
          </div>

          <div className="h-8 w-px bg-slate-200" />

          <div className="text-center px-2">
            <p className="text-[10px] text-slate-400 font-medium">Absent</p>
            <p className="text-base font-extrabold text-rose-600">{absentCount}</p>
            <span className="text-[10px] text-slate-400">
              {totalCount > 0 ? Math.round((absentCount / totalCount) * 100) : 0}%
            </span>
          </div>

          <div className="h-8 w-px bg-slate-200" />

          <div className="text-center px-2">
            <p className="text-[10px] text-slate-400 font-medium">Late</p>
            <p className="text-base font-extrabold text-amber-600">{lateCount}</p>
            <span className="text-[10px] text-slate-400">
              {totalCount > 0 ? Math.round((lateCount / totalCount) * 100) : 0}%
            </span>
          </div>

          <div className="h-8 w-px bg-slate-200" />

          <div className="text-center px-2">
            <p className="text-[10px] text-slate-400 font-medium">On Leave</p>
            <p className="text-base font-extrabold text-blue-600">{leaveCount}</p>
            <span className="text-[10px] text-slate-400">
              {totalCount > 0 ? Math.round((leaveCount / totalCount) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Bulk Shortcut Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-100/70 p-3 rounded-xl border border-slate-200 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-slate-700">Bulk Quick Actions:</span>
          <button
            onClick={() => handleMarkAll('Present')}
            className="rounded-lg bg-teal-600 hover:bg-teal-700 px-3 py-1 text-white font-medium shadow-2xs transition"
          >
            Mark All Present
          </button>
          <button
            onClick={() => handleMarkAll('Absent')}
            className="rounded-lg bg-rose-600 hover:bg-rose-700 px-3 py-1 text-white font-medium shadow-2xs transition"
          >
            Mark All Absent
          </button>
        </div>

        <p className="text-[11px] text-slate-500 hidden sm:block">
          Logged by: <span className="font-semibold text-slate-800">{currentUser.fullName}</span>
        </p>
      </div>

      {/* Roster Roll-Call Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden printable-area">
        <div onWheel={handleHorizontalWheel} className="overflow-x-auto scroll-touch">
          <table className="w-full min-w-[650px] text-left text-xs border-collapse">

          <thead>
            <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4 w-20 text-center">Roll No</th>
              <th className="py-3 px-4">Student Name</th>
              <th className="py-3 px-4">Historical Rate</th>
              <th className="py-3 px-4 text-center">Status Toggle</th>
              <th className="py-3 px-4">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {classStudents.map((stu) => {
              const currentSt = getEffectiveStatus(stu.id);
              const isLowHistorical = stu.attendanceRate < 75;

              return (
                <tr key={stu.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-4 text-center font-bold text-slate-800">
                    #{stu.rollNo}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={stu.avatarUrl}
                        alt={stu.fullName}
                        className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{stu.fullName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{stu.studentId}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`font-semibold ${
                          isLowHistorical ? 'text-rose-600 font-bold' : 'text-slate-700'
                        }`}
                      >
                        {stu.attendanceRate}%
                      </span>
                      {isLowHistorical && (
                        <span className="text-[9px] bg-rose-100 text-rose-700 px-1 py-0.2 rounded font-bold">
                          &lt;75% Alert
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80 gap-1">
                      <button
                        onClick={() => setStatus(stu.id, 'Present')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          currentSt === 'Present'
                            ? 'bg-teal-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Present
                      </button>

                      <button
                        onClick={() => setStatus(stu.id, 'Absent')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          currentSt === 'Absent'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Absent
                      </button>

                      <button
                        onClick={() => setStatus(stu.id, 'Late')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          currentSt === 'Late'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Late
                      </button>

                      <button
                        onClick={() => setStatus(stu.id, 'On Leave')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          currentSt === 'On Leave'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Leave
                      </button>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <input
                      type="text"
                      placeholder="Optional remarks (e.g. medical slip)..."
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </td>
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

