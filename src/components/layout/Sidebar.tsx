'use client';

import React from 'react';
import { useStore } from '@/lib/storeContext';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  FileSpreadsheet,
  CreditCard,
  Settings,
  Clock,
  BookOpen,
  Megaphone,
  Layers,
  FileText,
  BookMarked,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, currentInstitution, invoices, attendance, assignments } = useStore();

  const overdueInvoicesCount = invoices.filter((i) => i.status === 'Overdue').length;
  const pendingAssignmentsCount = assignments.filter((a) => a.status === 'In Progress').length;

  const isCorporate = currentInstitution.type === 'corporate' || currentInstitution.type === 'public_sector';
  const isGovernment = currentInstitution.type === 'government';

  // Navigation items dynamically adapted per institution type
  const navItems = isCorporate
    ? [
        { id: 'dashboard', label: 'Executive Workspace', icon: LayoutDashboard },
        { id: 'students', label: 'Employee Directory', icon: Users },
        { id: 'attendance', label: 'Attendance & Shifts', icon: CalendarCheck },
        { id: 'finance', label: 'Payroll & Compensation', icon: CreditCard },
        { id: 'leave', label: 'Leave & PTO', icon: FileText },
        { id: 'announcements', label: 'Company Notices', icon: Megaphone },
        { id: 'integrations', label: 'HR & API Integrations', icon: Layers },
        { id: 'settings', label: 'Corporate Settings', icon: Settings },
      ]
    : isGovernment
    ? [
        { id: 'dashboard', label: 'Secretariat Dashboard', icon: LayoutDashboard },
        { id: 'students', label: 'Officers & Personnel', icon: Users },
        { id: 'attendance', label: 'Duty Attendance', icon: CalendarCheck },
        { id: 'announcements', label: 'Gazettes & Circulars', icon: Megaphone },
        { id: 'leave', label: 'Sanctioned Leaves', icon: FileText },
        { id: 'finance', label: 'Treasury & Grants', icon: CreditCard },
        { id: 'integrations', label: 'Govt API Integrations', icon: Layers },
        { id: 'settings', label: 'Department Settings', icon: Settings },
      ]
    : [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'students', label: 'Admissions & Students', icon: Users, badge: 'New' },
        { id: 'faculty', label: 'Faculty & Teachers', icon: Users },
        { id: 'classes', label: 'Classes & Batches', icon: Layers },
        { id: 'attendance', label: 'Attendance Register', icon: CalendarCheck },
        { id: 'timetable', label: 'Class Timetable', icon: Clock },
        { id: 'exams', label: 'Exams & Results', icon: FileSpreadsheet },
        { id: 'assignments', label: 'Assignments', icon: BookOpen, count: pendingAssignmentsCount },
        { id: 'finance', label: 'Finance & Fees', icon: CreditCard, alertCount: overdueInvoicesCount },
        { id: 'announcements', label: 'Announcements', icon: Megaphone },
        { id: 'leave', label: 'Staff & Leaves', icon: FileText },
        { id: 'library', label: 'Library & Books', icon: BookMarked },
        { id: 'integrations', label: 'Integrations', icon: Layers },
        { id: 'settings', label: 'Settings', icon: Settings },
      ];

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200/80 p-4 hidden md:flex flex-col justify-between min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* User Role & Institution Indicator Card */}
        <div className="rounded-xl bg-gradient-to-br from-slate-900 to-[#0e4d59] p-3.5 text-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-400/20 text-teal-300 ring-1 ring-white/10 shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="text-[11px] font-medium text-slate-300 truncate">
                {currentInstitution.name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-bold text-teal-300 uppercase font-mono">
                  {currentInstitution.type}
                </span>
                <span className="text-slate-400 text-[10px]">•</span>
                <span className="text-[10px] font-medium text-white truncate capitalize">
                  {currentUser.role.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Main Menu
          </p>
          <div className="mt-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0d6474] to-[#127d91] text-white shadow-sm font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4.5 w-4.5 transition ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className="rounded bg-teal-100 px-1.5 py-0.5 text-[10px] font-bold text-teal-800">
                        {item.badge}
                      </span>
                    )}
                    {item.alertCount && item.alertCount > 0 ? (
                      <span className="rounded-full bg-rose-500 px-1.5 py-0.2 text-[10px] font-bold text-white">
                        {item.alertCount}
                      </span>
                    ) : null}
                    {isActive && <ChevronRight className="h-3.5 w-3.5 text-white/80" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer System Status */}
      <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-3 text-xs text-slate-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-medium text-slate-700">System Online</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">v2.4.0</span>
        </div>
        <p className="mt-1 text-[10px] text-slate-400">
          Supabase DB & Razorpay Sandbox Active
        </p>
      </div>
    </aside>
  );
};
