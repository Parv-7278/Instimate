'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/storeContext';
import { LeaveRequest } from '@/types';
import { handleHorizontalWheel } from '@/lib/utils';
import {
  FileText,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  X,
  AlertCircle,
} from 'lucide-react';

export const LeaveManagement: React.FC = () => {
  const { leaveRequests, applyLeave, updateLeaveStatus, currentUser } = useStore();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [newLeave, setNewLeave] = useState({
    leaveType: 'Casual Leave' as const,
    startDate: '2026-10-20',
    endDate: '2026-10-22',
    daysCount: 3,
    reason: '',
  });

  const canApprove = ['institution_admin', 'principal', 'hr_staff'].includes(currentUser.role);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeave.reason) return;

    applyLeave({
      applicantId: currentUser.id,
      applicantName: currentUser.fullName,
      applicantRole: (currentUser.role === 'student' ? 'student' : 'faculty') as any,
      ...newLeave,
    });

    setIsApplyModalOpen(false);
    setNewLeave({
      leaveType: 'Casual Leave',
      startDate: '2026-10-20',
      endDate: '2026-10-22',
      daysCount: 3,
      reason: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Staff & Student Leave Approvals
            </h1>
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 border border-teal-200">
              Workflow Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage academic absences, medical leave applications, and administrative sign-offs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsApplyModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0d6474] to-[#127d91] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-95 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Apply for Leave</span>
          </button>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div onWheel={handleHorizontalWheel} className="overflow-x-auto scroll-touch">
          <table className="w-full min-w-[700px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Leave Type</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action / Approval</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaveRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-4 font-bold text-slate-800">
                    {req.applicantName}
                  </td>
                  <td className="py-3 px-4 text-slate-500 capitalize">
                    {req.applicantRole}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">
                    {req.leaveType}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {req.startDate} to {req.endDate} ({req.daysCount} days)
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                    {req.reason}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        req.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {req.status === 'Pending' && canApprove ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => updateLeaveStatus(req.id, 'Approved', currentUser.fullName)}
                          className="rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 px-2.5 py-1 text-xs font-semibold"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateLeaveStatus(req.id, 'Rejected', currentUser.fullName)}
                          className="rounded-lg bg-rose-600 text-white hover:bg-rose-700 px-2.5 py-1 text-xs font-semibold"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">
                        {req.approvedBy ? `Reviewed by ${req.approvedBy}` : 'Completed'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl relative">
            <button
              onClick={() => setIsApplyModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Apply for Leave of Absence
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Submit your absence dates for administrative approval.
            </p>

            <form onSubmit={handleApply} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Leave Category</label>
                <select
                  value={newLeave.leaveType}
                  onChange={(e: any) => setNewLeave({ ...newLeave, leaveType: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                >
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Academic Leave">Academic Leave</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={newLeave.startDate}
                    onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={newLeave.endDate}
                    onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Reason for Absence</label>
                <textarea
                  rows={3}
                  required
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                  placeholder="Detail the circumstances and emergency contacts..."
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 hover:bg-teal-700 px-4 py-2 font-semibold text-white shadow-sm"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
