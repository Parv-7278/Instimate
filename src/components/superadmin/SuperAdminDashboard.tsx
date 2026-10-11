'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/storeContext';
import { Institution, VerificationStatus } from '@/types';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  FileCheck,
  Search,
  Filter,
  Eye,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  X,
  ExternalLink,
} from 'lucide-react';

interface Props {
  onSelectInstitution?: (inst: Institution) => void;
  onExitToGateway?: () => void;
}

export const SuperAdminDashboard: React.FC<Props> = ({ onSelectInstitution, onExitToGateway }) => {
  const {
    institutions,
    approveInstitution,
    rejectInstitution,
    suspendInstitution,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInst, setSelectedInst] = useState<Institution | null>(null);
  const [verificationNote, setVerificationNote] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const filteredInstitutions = institutions.filter((inst) => {
    const matchesSearch =
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inst.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = institutions.filter((i) => i.status === 'Pending Verification' || i.status === 'Under Review').length;
  const activeCount = institutions.filter((i) => i.status === 'Active' || i.status === 'Approved').length;
  const rejectedCount = institutions.filter((i) => i.status === 'Rejected' || i.status === 'Suspended').length;

  const handleApprove = (id: string) => {
    approveInstitution(id, verificationNote || 'Verified by Super Admin with compliance standards.');
    setSelectedInst(null);
    setVerificationNote('');
  };

  const handleReject = (id: string) => {
    rejectInstitution(id, rejectionReason || 'Documentation non-compliant with platform requirements.');
    setSelectedInst(null);
    setRejectionReason('');
  };

  return (
    <div className="space-y-6">
      {/* Super Admin Top Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-[#0e4d59] p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-cyan-300" />
            <h1 className="text-xl font-bold">Platform Super Admin Control Centre</h1>
            <span className="rounded-full bg-cyan-400/20 text-cyan-200 border border-cyan-400/30 px-2.5 py-0.5 text-xs font-semibold">
              Root Authority
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Review institution registration applications, verify accreditation documents, authorize tenant activation, and manage platform quotas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onExitToGateway && (
            <button
              onClick={onExitToGateway}
              className="rounded-xl bg-white/10 hover:bg-white/20 px-3.5 py-2 text-xs font-semibold text-white border border-white/20 transition flex items-center gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5 text-cyan-300" />
              <span>Universal Gateway</span>
            </button>
          )}
          <span className="rounded-xl bg-white/10 px-3.5 py-2 text-xs font-semibold text-white border border-white/20">
            Total Tenants: {institutions.length}
          </span>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800">Pending Review & Verification</span>
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
          <p className="text-3xl font-extrabold text-amber-950 mt-2">{pendingCount}</p>
          <span className="text-[11px] text-amber-700">Requires Super Admin approval to activate</span>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800">Approved & Active Organizations</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-950 mt-2">{activeCount}</p>
          <span className="text-[11px] text-emerald-700">Operational dashboards active</span>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800">Rejected or Suspended</span>
            <XCircle className="h-5 w-5 text-rose-600" />
          </div>
          <p className="text-3xl font-extrabold text-rose-950 mt-2">{rejectedCount}</p>
          <span className="text-[11px] text-rose-700">Access revoked</span>
        </div>
      </div>

      {/* Institutions Applications Review Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search institutions by name, code, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="Pending Verification">Pending Verification</option>
              <option value="Under Review">Under Review</option>
              <option value="Active">Active</option>
              <option value="Rejected">Rejected</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Institution Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Code / Slug</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Representative</th>
                <th className="py-3 px-4">Verification Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInstitutions.map((inst) => (
                <tr key={inst.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {inst.name}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-700">
                      {inst.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{inst.code}</td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {inst.city}, {inst.country}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-800">{inst.representativeName}</p>
                    <p className="text-[10px] text-slate-400">{inst.representativeEmail}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        inst.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inst.status === 'Pending Verification'
                          ? 'bg-amber-100 text-amber-800 animate-pulse'
                          : inst.status === 'Under Review'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {inst.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedInst(inst)}
                        className="rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 px-2.5 py-1 text-xs font-semibold"
                      >
                        Review
                      </button>

                      {inst.status === 'Active' && onSelectInstitution && (
                        <button
                          onClick={() => onSelectInstitution(inst)}
                          className="rounded-lg bg-slate-800 text-white hover:bg-slate-900 px-2.5 py-1 text-xs font-semibold flex items-center gap-1"
                        >
                          <span>Open Workspace</span>
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & Verification Modal */}
      {selectedInst && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedInst(null)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Verify Institution Application: {selectedInst.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Review submitted credentials and regulatory affiliation details.
            </p>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Institution Type:</span>
                <span className="font-bold uppercase text-teal-800">{selectedInst.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Address:</span>
                <span className="text-slate-800">{selectedInst.address}, {selectedInst.city}, {selectedInst.state}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Official Contact:</span>
                <span className="text-slate-800">{selectedInst.email} • {selectedInst.phone}</span>
              </div>
              {selectedInst.affiliationNumber && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Affiliation / Reg #:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedInst.affiliationNumber}</span>
                </div>
              )}
              {selectedInst.companyRegNumber && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Company CIN / Reg #:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedInst.companyRegNumber}</span>
                </div>
              )}
              {selectedInst.departmentJurisdiction && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Parent Ministry:</span>
                  <span className="font-semibold text-slate-800">{selectedInst.departmentJurisdiction}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Authorized Officer:</span>
                <span className="font-semibold text-slate-800">
                  {selectedInst.representativeName} ({selectedInst.representativeDesignation})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Application Date:</span>
                <span className="text-slate-600">{selectedInst.submittedAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Current Status:</span>
                <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  {selectedInst.status}
                </span>
              </div>
            </div>

            {/* Verification Notes Input */}
            <div className="space-y-3 text-xs mb-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Super Admin Verification Notes (recorded in permanent audit log)
                </label>
                <textarea
                  rows={2}
                  value={verificationNote}
                  onChange={(e) => setVerificationNote(e.target.value)}
                  placeholder="e.g. Verified official charter and premises compliance."
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Rejection / Suspension Reason (if declining application)
                </label>
                <input
                  type="text"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Reason communicated to applicant..."
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => handleReject(selectedInst.id)}
                className="rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 px-4 py-2 text-xs font-semibold"
              >
                Reject Application
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => suspendInstitution(selectedInst.id, 'Administrative Review Suspension')}
                  className="rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"
                >
                  Suspend
                </button>
                <button
                  type="button"
                  onClick={() => handleApprove(selectedInst.id)}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2 text-xs font-bold text-white shadow-sm"
                >
                  Approve & Authorize Institution
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
