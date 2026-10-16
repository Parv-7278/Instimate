'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/storeContext';
import { CorporateStaff, EmployeeClockRecord, PayrollRecord } from '@/types';
import {
  Briefcase,
  Clock,
  Calendar,
  CreditCard,
  UserCheck,
  CheckCircle2,
  FileText,
  Printer,
  X,
  Search,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { handleHorizontalWheel } from '@/lib/utils';


export const CorporateDashboard: React.FC = () => {
  const {
    currentInstitution,
    corporateStaff,
    clockRecords,
    clockInEmployee,
    clockOutEmployee,
    payrollRecords,
    processPayroll,
    holidays,
    leaveRequests,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'clock' | 'employees' | 'payroll' | 'holidays'>('overview');
  const [selectedPayslip, setSelectedPayslip] = useState<PayrollRecord | null>(null);

  // Clock in simulator state
  const currentEmployee = corporateStaff[0];
  const todayClockRecord = clockRecords.find((r) => r.employeeId === currentEmployee?.id);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-indigo-400" />
            <h1 className="text-xl font-bold">{currentInstitution.name}</h1>
            <span className="rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 px-2.5 py-0.5 text-xs font-semibold uppercase">
              Corporate Headquarters
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Enterprise workforce telemetry, clock-in tracking, hybrid schedules, payroll, and appraisals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {todayClockRecord && !todayClockRecord.clockOutTime ? (
            <button
              onClick={() => clockOutEmployee(todayClockRecord.id)}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition flex items-center gap-1.5"
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Clock Out (Shift End)</span>
            </button>
          ) : (
            <button
              onClick={() => clockInEmployee(currentEmployee.id, 'Office')}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition flex items-center gap-1.5"
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Clock In (Start Workday)</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div
        onWheel={handleHorizontalWheel}
        className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold overflow-x-auto scrollbar-none scroll-touch whitespace-nowrap"
      >
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap shrink-0 ${
            activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Workforce Overview
        </button>
        <button
          onClick={() => setActiveTab('clock')}
          className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap shrink-0 ${
            activeTab === 'clock' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Daily Clock-In & Shifts ({clockRecords.length})
        </button>
        <button
          onClick={() => setActiveTab('employees')}
          className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap shrink-0 ${
            activeTab === 'employees' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Employee Directory ({corporateStaff.length})
        </button>
        <button
          onClick={() => setActiveTab('payroll')}
          className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap shrink-0 ${
            activeTab === 'payroll' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Payroll & Payslips ({payrollRecords.length})
        </button>
        <button
          onClick={() => setActiveTab('holidays')}
          className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap shrink-0 ${
            activeTab === 'holidays' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Paid Company Holidays ({holidays.length})
        </button>
      </div>


      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium text-slate-400">Total Workforce</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{corporateStaff.length}</p>
              <span className="text-[11px] text-slate-500">Across 3 core departments</span>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium text-slate-400">Workforce Arrangements</p>
              <p className="text-sm font-bold text-indigo-700 mt-1">Hybrid (60%) • Remote (40%)</p>
              <span className="text-[11px] text-slate-500">Flexible policy enabled</span>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 shadow-sm">
              <p className="text-xs font-medium text-emerald-800">Monthly Payroll Disbursed</p>
              <p className="text-2xl font-extrabold text-emerald-950 mt-1">₹2,60,500</p>
              <span className="text-[11px] text-emerald-700">September reconciled</span>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5 shadow-sm">
              <p className="text-xs font-medium text-blue-800">Active Leave Requests</p>
              <p className="text-2xl font-extrabold text-blue-950 mt-1">{leaveRequests.length}</p>
              <span className="text-[11px] text-blue-700">Casual & PTO</span>
            </div>
          </div>

          {/* Clock In Live Status */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-indigo-600" />
              <span>Today&apos;s Workday Status for {currentEmployee.fullName}</span>
            </h3>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl bg-slate-50 p-4 border border-slate-200">
              <div>
                <p className="text-xs font-semibold text-slate-800">
                  Current Status: <span className="text-emerald-700 font-bold">{todayClockRecord ? 'Checked In' : 'Not Clocked In'}</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Clock In Time: {todayClockRecord?.clockInTime || '—'} • Mode: {todayClockRecord?.workMode || currentEmployee.workMode}
                </p>
              </div>

              {todayClockRecord && !todayClockRecord.clockOutTime ? (
                <button
                  onClick={() => clockOutEmployee(todayClockRecord.id)}
                  className="rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2 text-xs font-bold text-white shadow-sm"
                >
                  Clock Out
                </button>
              ) : (
                <button
                  onClick={() => clockInEmployee(currentEmployee.id, 'Office')}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-sm"
                >
                  Clock In
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Clock In & Shifts Tab */}
      {activeTab === 'clock' && (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-800">Daily Attendance & Work Hours Log</h3>
            <span className="text-xs text-slate-400">{clockRecords.length} Records</span>
          </div>

          <div onWheel={handleHorizontalWheel} className="overflow-x-auto scroll-touch">
            <table className="w-full min-w-[700px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Clock In</th>
                  <th className="py-3 px-4">Clock Out</th>
                  <th className="py-3 px-4">Work Arrangement</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clockRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4 font-bold text-slate-800">{r.employeeName}</td>
                    <td className="py-3 px-4 text-slate-600">{r.date}</td>
                    <td className="py-3 px-4 font-semibold text-emerald-700">{r.clockInTime}</td>
                    <td className="py-3 px-4 text-slate-600">{r.clockOutTime || 'Active Shift'}</td>
                    <td className="py-3 px-4">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                        {r.workMode}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">{r.durationHours ? `${r.durationHours} hrs` : 'In Progress'}</td>
                    <td className="py-3 px-4">
                      <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Employees Directory Tab */}
      {activeTab === 'employees' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {corporateStaff.map((staff) => (
            <div key={staff.id} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-start gap-3.5">
                <img
                  src={staff.avatarUrl}
                  alt={staff.fullName}
                  className="h-14 w-14 rounded-2xl object-cover ring-2 ring-indigo-500/20"
                />
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{staff.fullName}</h3>
                  <p className="text-xs font-semibold text-indigo-700">{staff.designation}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{staff.employeeId} • {staff.department}</p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 text-xs space-y-1">
                <p><span className="text-slate-400">Work Arrangement:</span> <strong className="text-slate-800">{staff.workMode}</strong></p>
                <p><span className="text-slate-400">Monthly Compensation:</span> <strong className="text-emerald-800">₹{(staff.basicSalary + staff.allowances).toLocaleString()}</strong></p>
                <p><span className="text-slate-400">Available PTO / Leave:</span> <span className="font-bold text-indigo-700">{staff.leaveBalance} days</span></p>
                <p><span className="text-slate-400">Reporting Line:</span> <span className="text-slate-600">{staff.reportingManager}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payroll Tab */}
      {activeTab === 'payroll' && (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-800">Monthly Salary & Payslip Registers</h3>
              <p className="text-xs text-slate-400">Statutory deductions (PF, TDS) and net bank payouts</p>
            </div>
          </div>

          <div onWheel={handleHorizontalWheel} className="overflow-x-auto scroll-touch">
            <table className="w-full min-w-[700px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Month</th>
                  <th className="py-3 px-4">Gross Earnings</th>
                  <th className="py-3 px-4">Total Deductions</th>
                  <th className="py-3 px-4">Net Payout</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Official Payslip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payrollRecords.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4 font-bold text-slate-800">{p.employeeName}</td>
                    <td className="py-3 px-4 text-slate-600">{p.month}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">₹{p.grossPay.toLocaleString()}</td>
                    <td className="py-3 px-4 text-rose-600 font-medium">-₹{p.totalDeductions.toLocaleString()}</td>
                    <td className="py-3 px-4 font-extrabold text-emerald-700">₹{p.netPay.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right flex items-center justify-end gap-1.5">
                      {p.status !== 'Paid' && (
                        <button
                          onClick={() => processPayroll(p.id)}
                          className="rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2.5 py-1 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition"
                          title="Process payout and disburse to employee bank account"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Disburse</span>
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedPayslip(p)}
                        className="rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-2.5 py-1 text-xs font-semibold inline-flex items-center gap-1"
                      >
                        <FileText className="h-3 w-3" />
                        <span>View Payslip</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Holidays Tab */}
      {activeTab === 'holidays' && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-800 pb-2 border-b">
            Official Paid Company Holidays & Closures
          </h3>
          <div className="space-y-2">
            {holidays.map((h) => (
              <div key={h.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <p className="font-bold text-slate-900">{h.title}</p>
                  <p className="text-[11px] text-slate-400">{h.applicableDepartments}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-800">{h.date}</p>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded font-bold">
                    {h.isPaid ? 'Paid Holiday' : 'Unpaid'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Printable Payslip Modal */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl relative printable-area">
            <button
              onClick={() => setSelectedPayslip(null)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 no-print"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center pb-4 border-b border-slate-200">
              <h2 className="text-base font-extrabold text-slate-900 uppercase">
                {currentInstitution.name}
              </h2>
              <p className="text-xs text-slate-500">Official Monthly Confidential Payslip</p>
              <span className="mt-1 inline-block text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                {selectedPayslip.payslipNumber} • {selectedPayslip.month}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs py-3 border-b border-slate-100">
              <div>
                <p className="text-slate-400">Employee Name:</p>
                <p className="font-bold text-slate-900">{selectedPayslip.employeeName}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-400">Designation & Department:</p>
                <p className="font-semibold text-slate-800">{selectedPayslip.designation}</p>
              </div>
            </div>

            <div className="py-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Basic Monthly Pay:</span>
                <span className="font-semibold text-slate-900">₹{selectedPayslip.basicPay.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Special Allowances & HRA:</span>
                <span className="font-semibold text-slate-900">₹{selectedPayslip.allowances.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold text-slate-900">
                <span>Gross Monthly Earnings:</span>
                <span>₹{selectedPayslip.grossPay.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-rose-600 pt-2 border-t">
                <span>Tax Deductions (TDS):</span>
                <span>-₹{selectedPayslip.taxDeductions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>Provident Fund (PF):</span>
                <span>-₹{selectedPayslip.pfDeductions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t-2 border-slate-900 pt-2 text-sm font-extrabold text-emerald-800">
                <span>Net Bank Disbursal:</span>
                <span>₹{selectedPayslip.netPay.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t no-print">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Official PDF</span>
              </button>
              <button
                onClick={() => setSelectedPayslip(null)}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-semibold text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
