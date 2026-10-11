'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/storeContext';
import {
  Search,
  Users,
  GraduationCap,
  CreditCard,
  Calendar,
  X,
  ChevronRight,
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
}) => {
  const { students, faculty, classrooms, invoices } = useStore();
  const [query, setQuery] = useState('');

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Handled by parent or toggled
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const matchedStudents = query.trim()
    ? students.filter(
        (s) =>
          s.fullName.toLowerCase().includes(query.toLowerCase()) ||
          s.rollNo.includes(query) ||
          s.studentId.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const matchedFaculty = query.trim()
    ? faculty.filter(
        (f) =>
          f.fullName.toLowerCase().includes(query.toLowerCase()) ||
          f.department.toLowerCase().includes(query.toLowerCase()) ||
          f.employeeId.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const matchedInvoices = query.trim()
    ? invoices.filter(
        (i) =>
          i.studentName.toLowerCase().includes(query.toLowerCase()) ||
          i.invoiceNumber.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
          <Search className="h-5 w-5 text-teal-600 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search students, teachers, invoices, or rooms..."
            className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-3 space-y-3 text-xs">
          {!query.trim() ? (
            <div className="py-8 text-center text-slate-400">
              <p>Type a student name, roll number, or invoice code...</p>
              <div className="mt-2 flex justify-center gap-2">
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">Aarav</span>
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">Diya</span>
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">Math</span>
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">INV-2024</span>
              </div>
            </div>
          ) : (
            <>
              {matchedStudents.length > 0 && (
                <div>
                  <p className="font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-1">Students</p>
                  <div className="space-y-1">
                    {matchedStudents.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => {
                          onSelectTab('students');
                          onClose();
                        }}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-teal-50 cursor-pointer transition"
                      >
                        <div>
                          <p className="font-bold text-slate-900">{s.fullName}</p>
                          <p className="text-[10px] text-slate-400">Roll #{s.rollNo} • {s.classId}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchedFaculty.length > 0 && (
                <div>
                  <p className="font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-1">Faculty</p>
                  <div className="space-y-1">
                    {matchedFaculty.map((f) => (
                      <div
                        key={f.id}
                        onClick={() => {
                          onSelectTab('faculty');
                          onClose();
                        }}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-teal-50 cursor-pointer transition"
                      >
                        <div>
                          <p className="font-bold text-slate-900">{f.fullName}</p>
                          <p className="text-[10px] text-slate-400">{f.department}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchedInvoices.length > 0 && (
                <div>
                  <p className="font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-1">Invoices</p>
                  <div className="space-y-1">
                    {matchedInvoices.map((inv) => (
                      <div
                        key={inv.id}
                        onClick={() => {
                          onSelectTab('finance');
                          onClose();
                        }}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-teal-50 cursor-pointer transition"
                      >
                        <div>
                          <p className="font-bold text-slate-900">{inv.invoiceNumber} - {inv.studentName}</p>
                          <p className="text-[10px] text-slate-400">Due: ₹{inv.dueAmount.toLocaleString()} ({inv.status})</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchedStudents.length === 0 && matchedFaculty.length === 0 && matchedInvoices.length === 0 && (
                <p className="text-center py-6 text-slate-400">No matching records found.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
