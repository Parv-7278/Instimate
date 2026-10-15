'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/storeContext';
import { Classroom } from '@/types';
import {
  Building2,
  Users,
  Plus,
  CheckCircle2,
  AlertCircle,
  X,
  Layers,
  Sparkles,
  BookOpen,
  GraduationCap,
  Calendar,
} from 'lucide-react';

export const ClassroomsModule: React.FC = () => {
  const { classrooms, addClassroom, students, subjects, addSubject, faculty, timetable } = useStore();

  const [activeTab, setActiveTab] = useState<'classrooms' | 'subjects'>('classrooms');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');

  const [newRoom, setNewRoom] = useState({
    roomNumber: 'Room 306',
    building: 'Aryabhata Academic Block',
    floor: '3rd Floor',
    capacity: 45,
    campus: 'Main Campus',
    assignedClass: 'Class 9-A',
    classTeacher: 'Rajesh Kumar Verma',
    amenities: ['Smart Interactive Board', 'Projector', 'Air Conditioning'],
    status: 'Available' as const,
  });

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    addClassroom({
      ...newRoom,
      currentStudentCount: 35,
    });
    setIsAddModalOpen(false);
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubjectName.trim()) {
      addSubject(newSubjectName.trim());
      setNewSubjectName('');
      setIsAddSubjectModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Classrooms, Room Sizes & Subject Catalog
            </h1>
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 border border-teal-200">
              Connected to Supabase
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor room capacity allocations, student-to-seat ratios, smart equipment, and the institutional subject curriculum.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'classrooms' ? (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0d6474] to-[#127d91] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-95 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add Classroom Space</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAddSubjectModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0d6474] to-[#127d91] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-95 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Subject</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('classrooms')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'classrooms'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Classrooms & Room Sizes ({classrooms.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('subjects')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'subjects'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Subjects Catalog ({subjects.length})</span>
        </button>
      </div>

      {activeTab === 'subjects' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {subjects.map((sub) => {
              const teachingFaculty = faculty.filter((f) =>
                f.subjects.some((s) => s.toLowerCase() === sub.toLowerCase())
              );
              const weeklyPeriods = timetable.filter(
                (t) => t.subject.toLowerCase() === sub.toLowerCase()
              ).length;

              return (
                <div
                  key={sub}
                  className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:border-teal-300 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="rounded-xl bg-teal-50 p-2.5 text-teal-600 border border-teal-100">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">{sub}</h3>
                          <span className="text-[11px] text-slate-400">Core Academic Subject</span>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    </div>

                    <div className="mt-4 rounded-xl bg-slate-50 p-3 border border-slate-100 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <GraduationCap className="h-3.5 w-3.5" />
                          Faculty Assigned:
                        </span>
                        <span className="font-semibold text-slate-800">
                          {teachingFaculty.length > 0
                            ? teachingFaculty.map((f) => f.fullName).join(', ')
                            : 'General Department'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          Weekly Scheduled Periods:
                        </span>
                        <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                          {weeklyPeriods} slots / week
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'classrooms' && (
      /* Classrooms Grid */
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classrooms.map((room) => {
          const occupancyRate = Math.round((room.currentStudentCount / room.capacity) * 100);
          const isFull = occupancyRate >= 100;

          return (
            <div
              key={room.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm flex flex-col justify-between hover:border-teal-300 transition"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">
                      {room.roomNumber}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {room.building} • {room.floor}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      room.status === 'Available'
                        ? 'bg-emerald-100 text-emerald-800'
                        : room.status === 'Occupied'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {room.status}
                  </span>
                </div>

                <div className="mt-4 rounded-xl bg-slate-50 p-3 border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned Cohort:</span>
                    <span className="font-bold text-slate-800">{room.assignedClass || 'General Purpose'}</span>
                  </div>
                  {room.classTeacher && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Class Mentor:</span>
                      <span className="font-medium text-slate-700">{room.classTeacher}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Capacity & Seating:</span>
                    <span className="font-bold text-slate-800">
                      {room.currentStudentCount} / {room.capacity} seats ({occupancyRate}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, occupancyRate)}%` }}
                      className={`h-full ${isFull ? 'bg-rose-500' : 'bg-teal-600'}`}
                    />
                  </div>
                </div>

                {/* Amenities Badges */}
                <div className="mt-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Equipped Amenities
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {room.amenities.map((item) => (
                      <span
                        key={item}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Add Classroom Modal */}
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
              Add New Classroom or Lab Space
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Configure room details, maximum seating capacity, and smart equipment.
            </p>

            <form onSubmit={handleCreateRoom} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Room Identifier *</label>
                <input
                  type="text"
                  required
                  value={newRoom.roomNumber}
                  onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Academic Block</label>
                  <input
                    type="text"
                    required
                    value={newRoom.building}
                    onChange={(e) => setNewRoom({ ...newRoom, building: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Floor</label>
                  <input
                    type="text"
                    required
                    value={newRoom.floor}
                    onChange={(e) => setNewRoom({ ...newRoom, floor: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Seating Capacity</label>
                  <input
                    type="number"
                    required
                    value={newRoom.capacity}
                    onChange={(e) => setNewRoom({ ...newRoom, capacity: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Assigned Class</label>
                  <input
                    type="text"
                    value={newRoom.assignedClass}
                    onChange={(e) => setNewRoom({ ...newRoom, assignedClass: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  />
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
                  Save Classroom
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {isAddSubjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddSubjectModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Add New Academic Subject
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Register a curriculum subject for scheduling across faculty & timetable slots.
            </p>

            <form onSubmit={handleCreateSubject} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artificial Intelligence, Data Science, Sociology"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddSubjectModalOpen(false)}
                  className="rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 hover:bg-teal-700 px-4 py-2 font-semibold text-white shadow-sm"
                >
                  Register Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
