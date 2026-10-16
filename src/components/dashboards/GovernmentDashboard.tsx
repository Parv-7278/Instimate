'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/storeContext';
import { GovernmentCircular, FileTrackingRecord } from '@/types';
import {
  Building,
  FileText,
  FileCheck,
  Send,
  Plus,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  Eye,
  X,
  AlertTriangle,
} from 'lucide-react';
import { handleHorizontalWheel } from '@/lib/utils';


export const GovernmentDashboard: React.FC = () => {
  const {
    currentInstitution,
    circulars,
    publishCircular,
    fileTracking,
    createFileRecord,
    moveFileDesk,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'circulars' | 'files' | 'personnel'>('circulars');
  const [selectedCircular, setSelectedCircular] = useState<GovernmentCircular | null>(null);

  // New file record modal
  const [isNewFileModalOpen, setIsNewFileModalOpen] = useState(false);
  const [newFile, setNewFile] = useState({
    fileNumber: '',
    subject: '',
    initiatingOfficer: 'Aditi Mukherjee (Executive Engineer)',
    currentDesk: 'Finance & Comptroller Review Desk',
    priority: 'Urgent' as const,
    status: 'In Movement' as const,
    remarks: 'Submitted for administrative sanction.',
  });

  // Move desk modal
  const [activeMovingFile, setActiveMovingFile] = useState<FileTrackingRecord | null>(null);
  const [nextDeskName, setNextDeskName] = useState('');
  const [deskRemark, setDeskRemark] = useState('');

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFile.fileNumber || !newFile.subject) return;

    createFileRecord(newFile);
    setIsNewFileModalOpen(false);
    setNewFile({
      fileNumber: '',
      subject: '',
      initiatingOfficer: 'Aditi Mukherjee (Executive Engineer)',
      currentDesk: 'Finance & Comptroller Review Desk',
      priority: 'Urgent',
      status: 'In Movement',
      remarks: '',
    });
  };

  const handleMoveDesk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMovingFile || !nextDeskName) return;

    moveFileDesk(activeMovingFile.id, nextDeskName, deskRemark);
    setActiveMovingFile(null);
    setNextDeskName('');
    setDeskRemark('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/60 p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building className="h-6 w-6 text-amber-400" />
            <h1 className="text-xl font-bold">{currentInstitution.name}</h1>
            <span className="rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 px-2.5 py-0.5 text-xs font-semibold uppercase">
              Official Administration
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Official circulars, e-office digital file routing, administrative sanctions, and audit governance.
          </p>
        </div>

        <button
          onClick={() => setIsNewFileModalOpen(true)}
          className="rounded-xl bg-amber-600 hover:bg-amber-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" />
          <span>Initiate Official File</span>
        </button>
      </div>

      {/* Tabs */}
      <div
        onWheel={handleHorizontalWheel}
        className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold overflow-x-auto scrollbar-none scroll-touch whitespace-nowrap"
      >
        <button
          onClick={() => setActiveTab('circulars')}
          className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap shrink-0 ${
            activeTab === 'circulars' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Official Circulars & Gazettes ({circulars.length})
        </button>
        <button
          onClick={() => setActiveTab('files')}
          className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap shrink-0 ${
            activeTab === 'files' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          E-File Movement & Sanctions ({fileTracking.length})
        </button>
      </div>


      {/* Circulars Tab */}
      {activeTab === 'circulars' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {circulars.map((circ) => (
              <div
                key={circ.id}
                onClick={() => setSelectedCircular(circ)}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:border-amber-400 transition cursor-pointer space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 text-[10px] font-mono font-bold">
                    {circ.circularNumber}
                  </span>
                  <span className="rounded-full bg-slate-100 text-slate-700 px-2 py-0.5 text-[10px] font-semibold">
                    {circ.classification}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 mt-2">{circ.subject}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{circ.content}</p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Signatory: {circ.signatory}</span>
                  <span>Issued: {circ.publishedDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Tracking Tab */}
      {activeTab === 'files' && (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-800">
              Active Administrative Files & Movement Desks
            </h3>
            <span className="text-xs text-slate-400">{fileTracking.length} Files in Routing</span>
          </div>

          <div onWheel={handleHorizontalWheel} className="overflow-x-auto scroll-touch">
            <table className="w-full min-w-[700px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">File Reference #</th>
                  <th className="py-3 px-4">Subject & Purpose</th>
                  <th className="py-3 px-4">Initiating Officer</th>
                  <th className="py-3 px-4">Current Desk</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Route Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fileTracking.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{f.fileNumber}</td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-semibold text-slate-800 line-clamp-1">{f.subject}</p>
                      <p className="text-[10px] text-slate-400">{f.remarks}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{f.initiatingOfficer}</td>
                    <td className="py-3.5 px-4 font-semibold text-amber-800">{f.currentDesk}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                          f.priority === 'Urgent'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {f.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-[10px] font-bold">
                        {f.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setActiveMovingFile(f);
                          setNextDeskName('');
                          setDeskRemark('');
                        }}
                        className="rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 px-2.5 py-1 text-xs font-semibold inline-flex items-center gap-1"
                      >
                        <span>Move Desk</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Move Desk Modal */}
      {activeMovingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl relative">
            <button
              onClick={() => setActiveMovingFile(null)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Route File: {activeMovingFile.fileNumber}
            </h3>
            <p className="text-xs text-slate-500 mb-3">{activeMovingFile.subject}</p>

            <form onSubmit={handleMoveDesk} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Target Desk / Department *</label>
                <select
                  required
                  value={nextDeskName}
                  onChange={(e) => setNextDeskName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs"
                >
                  <option value="">Select Target Desk</option>
                  <option value="Chief Engineer Office">Chief Engineer Directorate</option>
                  <option value="Ministry Financial Advisor Desk">Ministry Financial Advisor Desk</option>
                  <option value="Legal & Vigilance Cell">Legal & Vigilance Cell</option>
                  <option value="Sanctioned & Disposed Archive">Sanctioned & Disposed Archive</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Routing Endorsement / Remarks</label>
                <textarea
                  rows={3}
                  value={deskRemark}
                  onChange={(e) => setDeskRemark(e.target.value)}
                  placeholder="Official observations and sanction endorsement..."
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setActiveMovingFile(null)}
                  className="rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!nextDeskName}
                  className="rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 px-4 py-2 font-bold text-white shadow-sm"
                >
                  Confirm Forwarding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New File Modal */}
      {isNewFileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl relative">
            <button
              onClick={() => setIsNewFileModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Initiate Official Administrative File
            </h3>
            <p className="text-xs text-slate-500 mb-3">Create e-office file record with unique tracking identifier.</p>

            <form onSubmit={handleCreateFile} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">File Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FILE-PWD-BRIDGE-2026-91"
                  value={newFile.fileNumber}
                  onChange={(e) => setNewFile({ ...newFile, fileNumber: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Subject Matter *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Technical Approval for Metro Feeder Corridor"
                  value={newFile.subject}
                  onChange={(e) => setNewFile({ ...newFile, subject: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Urgency Priority</label>
                  <select
                    value={newFile.priority}
                    onChange={(e: any) => setNewFile({ ...newFile, priority: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="Routine">Routine</option>
                    <option value="Immediate">Immediate</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">First Destination Desk</label>
                  <input
                    type="text"
                    value={newFile.currentDesk}
                    onChange={(e) => setNewFile({ ...newFile, currentDesk: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsNewFileModalOpen(false)}
                  className="rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-600 hover:bg-amber-700 px-4 py-2 font-bold text-white shadow-sm"
                >
                  Create & Initiate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Circular View Modal */}
      {selectedCircular && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedCircular(null)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center pb-3 border-b border-slate-200">
              <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-700">
                {selectedCircular.circularNumber}
              </span>
              <h3 className="font-extrabold text-base text-slate-900 mt-2">{selectedCircular.subject}</h3>
              <p className="text-xs text-slate-500">{selectedCircular.issuingDepartment}</p>
            </div>

            <div className="py-4 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
              {selectedCircular.content}
            </div>

            <div className="pt-3 border-t border-slate-100 text-right text-xs">
              <p className="font-bold text-slate-800">{selectedCircular.signatory}</p>
              <p className="text-slate-400 text-[11px]">Issued: {selectedCircular.publishedDate}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
