'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/storeContext';
import { Faculty } from '@/types';
import { getRandomAvatar } from '@/lib/utils';
import {
  Users,
  Plus,
  BookOpen,
  CalendarCheck,
  Mail,
  Phone,
  Award,
  X,
  Search,
} from 'lucide-react';

export const FacultyModule: React.FC = () => {
  const { faculty, addFaculty } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newFac, setNewFac] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: 'Mathematics & Computing',
    qualification: 'M.Sc. Mathematics, B.Ed',
    designation: 'Assistant Professor',
    subjects: 'Mathematics',
    assignedClasses: 'Class 10-A',
    institutionId: 'inst-1',
    joiningDate: '2024-06-01',
    status: 'Active' as const,
    leaveBalance: 15,
  });

  const filteredFaculty = faculty.filter(
    (f) =>
      f.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFac.fullName) return;

    addFaculty({
      ...newFac,
      subjects: newFac.subjects.split(',').map((s) => s.trim()),
      assignedClasses: newFac.assignedClasses.split(',').map((c) => c.trim()),
      avatarUrl: getRandomAvatar(),
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Faculty & Teaching Staff Directory
            </h1>
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 border border-teal-200">
              {faculty.length} Active Educators
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage teacher subject allocations, class mentors, qualifications, and leave balances.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0d6474] to-[#127d91] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-95 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Appoint Faculty Member</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="max-w-md relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by faculty name, employee ID, or department..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
        />
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFaculty.map((fac) => (
          <div
            key={fac.id}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm flex flex-col justify-between hover:border-teal-300 transition"
          >
            <div>
              <div className="flex items-start gap-3.5">
                <img
                  src={fac.avatarUrl}
                  alt={fac.fullName}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
                  }}
                  className="h-14 w-14 rounded-2xl object-cover ring-2 ring-teal-500/20 shadow-xs"
                />
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{fac.fullName}</h3>
                  <p className="text-xs font-medium text-teal-700">{fac.designation}</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">{fac.employeeId}</p>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-3 border border-slate-100 text-xs space-y-1.5">
                <p><span className="text-slate-400">Department:</span> <strong className="text-slate-800">{fac.department}</strong></p>
                <p><span className="text-slate-400">Qualification:</span> <span className="text-slate-700">{fac.qualification}</span></p>
                <p><span className="text-slate-400">Assigned Classes:</span> <span className="font-semibold text-teal-800">{fac.assignedClasses.join(', ')}</span></p>
                <p><span className="text-slate-400">Leave Balance:</span> <span className="font-bold text-emerald-700">{fac.leaveBalance} days</span></p>
              </div>

              {/* Subjects tags */}
              <div className="mt-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Subjects Taught
                </p>
                <div className="flex flex-wrap gap-1">
                  {fac.subjects.map((sub) => (
                    <span
                      key={sub}
                      className="rounded bg-teal-50 border border-teal-200 px-2 py-0.5 text-[10px] font-bold text-teal-800"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 text-[11px]">
                <Mail className="h-3 w-3 text-slate-400" />
                {fac.email}
              </span>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                {fac.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Faculty Modal */}
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
              Appoint Faculty Member
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter academic qualifications and subject assignments.
            </p>

            <form onSubmit={handleCreateFaculty} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newFac.fullName}
                  onChange={(e) => setNewFac({ ...newFac, fullName: e.target.value })}
                  placeholder="e.g. Dr. Priya Nair"
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newFac.email}
                    onChange={(e) => setNewFac({ ...newFac, email: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={newFac.phone}
                    onChange={(e) => setNewFac({ ...newFac, phone: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={newFac.department}
                    onChange={(e) => setNewFac({ ...newFac, department: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={newFac.designation}
                    onChange={(e) => setNewFac({ ...newFac, designation: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Subjects (Comma separated)</label>
                <input
                  type="text"
                  value={newFac.subjects}
                  onChange={(e) => setNewFac({ ...newFac, subjects: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                />
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
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
