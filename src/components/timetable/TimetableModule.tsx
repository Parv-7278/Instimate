'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/storeContext';
import { TimetableSlot } from '@/types';
import {
  Clock,
  Calendar,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Download,
  Printer,
  X,
  Filter,
} from 'lucide-react';

export const TimetableModule: React.FC = () => {
  const { timetable, addTimetableSlot, classrooms, faculty } = useStore();

  const [selectedClass, setSelectedClass] = useState('Class 10-A');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [conflictError, setConflictError] = useState<string | null>(null);

  // New slot form state
  const [slotData, setSlotData] = useState({
    day: 'Monday' as const,
    timeSlot: '8:00 AM - 9:00 AM',
    subject: 'Math',
    facultyId: faculty[0]?.id || '',
    facultyName: faculty[0]?.fullName || '',
    classroom: classrooms[0]?.roomNumber || '',
    classId: 'Class 10-A',
    color: '#0d9488',
  });

  const days: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'> = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];

  const timeSlots = [
    '8:00 AM - 9:00 AM',
    '9:15 AM - 10:15 AM',
    '10:30 AM - 11:30 AM',
    '11:30 AM - 12:00 PM', // Lunch break
    '12:00 PM - 1:00 PM',
  ];

  const classTimetable = timetable.filter(
    (t) => t.classId === selectedClass || t.isBreak
  );

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError(null);

    const fac = faculty.find((f) => f.id === slotData.facultyId);
    const facultyName = fac ? fac.fullName : slotData.facultyName;

    const res = addTimetableSlot({
      ...slotData,
      facultyName,
    });

    if (!res.success) {
      setConflictError(res.conflictMessage || 'Timetable scheduling conflict detected!');
      return;
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Interactive Timetable & Master Schedule
            </h1>
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 border border-teal-200">
              Conflict-Free Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage lecture schedules, detect double-booked faculty or classrooms, and export class calendars.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-teal-500"
          >
            <option value="Class 10-A">Class 10-A (Secondary)</option>
            <option value="Class 10-B">Class 10-B (Commerce)</option>
            <option value="Class 9-A">Class 9-A</option>
          </select>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Grid</span>
          </button>

          <button
            onClick={() => {
              setConflictError(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0d6474] to-[#127d91] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-95 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Add Lecture Slot</span>
          </button>
        </div>
      </div>

      {/* Timetable Weekly Grid (Matching mockup exact layout) */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm printable-area">
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[700px] border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <th className="py-3.5 px-4 font-bold w-40 text-center">Time</th>
                {days.map((day) => (
                  <th key={day} className="py-3.5 px-4 font-bold text-center">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {timeSlots.map((slot) => {
                if (slot === '11:30 AM - 12:00 PM') {
                  return (
                    <tr key={slot} className="bg-teal-50/80 border-y border-teal-200">
                      <td colSpan={6} className="py-3 text-center font-bold text-teal-900 text-xs tracking-wider uppercase">
                        Lunch Break (11:30 AM – 12:00 PM)
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={slot} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-4 font-semibold text-slate-700 whitespace-nowrap bg-slate-50 text-center border-r border-slate-200/60">
                      {slot}
                    </td>

                    {days.map((day) => {
                      const matched = classTimetable.find(
                        (t) => t.timeSlot === slot && t.day === day && !t.isBreak
                      );

                      return (
                        <td key={day} className="py-3 px-3 text-center align-middle">
                          {matched ? (
                            <div className="rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-2xs hover:border-teal-400 hover:shadow-xs transition">
                              <p className="font-bold text-xs text-slate-900">
                                {matched.subject}
                              </p>
                              <p className="text-[10px] text-teal-700 font-medium truncate mt-0.5">
                                {matched.facultyName}
                              </p>
                              <span className="mt-1 inline-block text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                                {matched.classroom}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-300 font-mono text-sm">-</span>
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

      {/* Add Slot Modal with Conflict Detection */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Schedule Lecture Slot
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Allocate subject, faculty, and room with live collision detection.
            </p>

            {conflictError && (
              <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                <p>{conflictError}</p>
              </div>
            )}

            <form onSubmit={handleCreateSlot} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Day</label>
                  <select
                    value={slotData.day}
                    onChange={(e: any) => setSlotData({ ...slotData, day: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  >
                    {days.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Time Slot</label>
                  <select
                    value={slotData.timeSlot}
                    onChange={(e) => setSlotData({ ...slotData, timeSlot: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  >
                    <option value="8:00 AM - 9:00 AM">8:00 AM - 9:00 AM</option>
                    <option value="9:15 AM - 10:15 AM">9:15 AM - 10:15 AM</option>
                    <option value="10:30 AM - 11:30 AM">10:30 AM - 11:30 AM</option>
                    <option value="12:00 PM - 1:00 PM">12:00 PM - 1:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={slotData.subject}
                  onChange={(e) => setSlotData({ ...slotData, subject: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  placeholder="e.g. Chemistry, Robotics"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Faculty</label>
                  <select
                    value={slotData.facultyId}
                    onChange={(e) => {
                      const fac = faculty.find((f) => f.id === e.target.value);
                      setSlotData({
                        ...slotData,
                        facultyId: e.target.value,
                        facultyName: fac ? fac.fullName : '',
                      });
                    }}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  >
                    {faculty.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.fullName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Classroom</label>
                  <select
                    value={slotData.classroom}
                    onChange={(e) => setSlotData({ ...slotData, classroom: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  >
                    {classrooms.map((c) => (
                      <option key={c.id} value={c.roomNumber}>
                        {c.roomNumber} ({c.building})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 hover:bg-teal-700 px-4 py-2 font-semibold text-white shadow-sm"
                >
                  Verify & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
