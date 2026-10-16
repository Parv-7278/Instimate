'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/storeContext';
import { UserRole } from '@/types';
import {
  Bell,
  MessageSquare,
  ChevronDown,
  Building2,
  UserCheck,
  LogOut,
  RefreshCw,
  Search,
  Sparkles,
  Check,
  ArrowLeft,
  Compass,
} from 'lucide-react';
import { handleHorizontalWheel } from '@/lib/utils';


interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch?: () => void;
  onExitToGateway?: () => void;
}

const ROLE_LABELS: Record<UserRole, { label: string; badge: string; color: string }> = {
  institution_admin: { label: 'Admin', badge: 'Admin', color: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30' },
  institution_owner: { label: 'Owner / Trustee', badge: 'Owner', color: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30' },
  super_admin: { label: 'Super Admin', badge: 'Super Admin', color: 'bg-purple-500/20 text-purple-200 border-purple-400/30' },
  principal: { label: 'Principal', badge: 'Director', color: 'bg-amber-500/20 text-amber-200 border-amber-400/30' },
  faculty: { label: 'Faculty / Teacher', badge: 'Faculty', color: 'bg-blue-500/20 text-blue-200 border-blue-400/30' },
  student: { label: 'Student', badge: 'Student', color: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/30' },
  parent: { label: 'Parent / Guardian', badge: 'Parent', color: 'bg-pink-500/20 text-pink-200 border-pink-400/30' },
  accountant: { label: 'Finance / Bursar', badge: 'Finance', color: 'bg-indigo-500/20 text-indigo-200 border-indigo-400/30' },
  hr_staff: { label: 'HR / Office Staff', badge: 'HR', color: 'bg-orange-500/20 text-orange-200 border-orange-400/30' },
  corporate_employee: { label: 'Corporate Employee', badge: 'Employee', color: 'bg-indigo-500/20 text-indigo-200 border-indigo-400/30' },
  govt_officer: { label: 'Government Officer', badge: 'Govt Officer', color: 'bg-amber-500/20 text-amber-200 border-amber-400/30' },
  librarian: { label: 'Librarian', badge: 'Library', color: 'bg-teal-500/20 text-teal-200 border-teal-400/30' },
  auditor: { label: 'Auditor (Read-Only)', badge: 'Auditor', color: 'bg-slate-500/20 text-slate-200 border-slate-400/30' },
};

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  onExitToGateway,
}) => {
  const {
    isSupabaseLive,
    currentUser,
    switchRole,
    institutions,
    currentInstitution,
    setCurrentInstitution,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    resetToDefaults,
    signOut,
  } = useStore();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [instMenuOpen, setInstMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const isCorporate = currentInstitution.type === 'corporate' || currentInstitution.type === 'public_sector';
  const isGovernment = currentInstitution.type === 'government';

  const topTabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'eventroute', label: 'EventRoute' },
    { id: 'students', label: 'Students' },
    { id: 'faculty', label: 'Teachers' },
    { id: 'classes', label: 'Classes' },
    { id: 'timetable', label: 'Timetable' },
    { id: 'finance', label: 'Finance' },
    { id: 'exams', label: 'Reports' },
  ];

  const allMobileTabs = isCorporate
    ? [
        { id: 'dashboard', label: 'Workspace' },
        { id: 'eventroute', label: 'EventRoute' },
        { id: 'students', label: 'Directory' },
        { id: 'attendance', label: 'Attendance' },
        { id: 'finance', label: 'Payroll' },
        { id: 'leave', label: 'Leave' },
        { id: 'announcements', label: 'Notices' },
        { id: 'integrations', label: 'Integrations' },
        { id: 'settings', label: 'Settings' },
      ]
    : isGovernment
    ? [
        { id: 'dashboard', label: 'Secretariat' },
        { id: 'eventroute', label: 'EventRoute' },
        { id: 'students', label: 'Officers' },
        { id: 'attendance', label: 'Duty' },
        { id: 'announcements', label: 'Circulars' },
        { id: 'leave', label: 'Sanctions' },
        { id: 'finance', label: 'Treasury' },
        { id: 'integrations', label: 'Govt APIs' },
        { id: 'settings', label: 'Settings' },
      ]
    : [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'eventroute', label: 'EventRoute' },
        { id: 'students', label: 'Students' },
        { id: 'faculty', label: 'Teachers' },
        { id: 'classes', label: 'Classes' },
        { id: 'attendance', label: 'Attendance' },
        { id: 'timetable', label: 'Timetable' },
        { id: 'exams', label: 'Reports' },
        { id: 'assignments', label: 'Assignments' },
        { id: 'finance', label: 'Finance' },
        { id: 'announcements', label: 'Notices' },
        { id: 'leave', label: 'Staff Leaves' },
        { id: 'library', label: 'Library' },
        { id: 'integrations', label: 'Integrations' },
        { id: 'settings', label: 'Settings' },
      ];

  return (
    <header className="sticky top-0 z-40 w-full bg-gradient-to-r from-[#0a4d5a] via-[#0d6474] to-[#117688] text-white shadow-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 shrink-0">
          {onExitToGateway && (
            <button
              onClick={onExitToGateway}
              className="rounded-lg bg-black/20 hover:bg-black/30 p-1.5 text-teal-100 transition mr-1"
              title="Return to Universal Institution Gateway"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 text-left transition hover:opacity-90"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md border border-white/20 shadow-inner shrink-0">
              <Building2 className="h-5 w-5 text-cyan-200" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white font-sans">
                  Institution<span className="text-cyan-300">Hub</span>
                </span>
                <span className="hidden sm:inline-block rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-cyan-200 uppercase border border-white/15">
                  {currentInstitution.type}
                </span>
                {isSupabaseLive ? (
                  <span className="hidden lg:inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-200 border border-emerald-400/30" title="Connected to Supabase PostgreSQL Database">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Supabase Live
                  </span>
                ) : (
                  <span className="hidden lg:inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-200 border border-amber-400/30" title="Running in local fallback mode. Configure Supabase keys in .env.local to activate cloud database">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    Supabase Offline
                  </span>
                )}
              </div>
              <p className="text-[11px] text-teal-100/80 hidden md:block truncate max-w-[200px]">
                {currentInstitution.name}
              </p>
            </div>
          </button>
        </div>

        {/* Center Navigation Tabs - Contained with independent horizontal scroll */}
        <nav
          onWheel={handleHorizontalWheel}
          className="hidden lg:flex items-center space-x-1 overflow-x-auto min-w-0 max-w-md xl:max-w-xl 2xl:max-w-2xl scrollbar-none scroll-touch py-1 mx-2"
        >
          {topTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3.5 py-1.5 text-xs font-medium transition-all duration-150 rounded-lg whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-white font-semibold bg-white/15 shadow-sm'
                    : 'text-teal-100 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-cyan-300 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Section: Quick Switchers, Alerts & Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('eventroute')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition border ${
              activeTab === 'eventroute'
                ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-sm'
                : 'bg-black/20 hover:bg-black/30 text-cyan-200 border-white/10'
            }`}
            title="Open EventRoute Navigator & Smart Itinerary"
          >
            <Compass className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">EventRoute</span>
          </button>


          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-1.5 rounded-lg bg-black/20 hover:bg-black/30 px-2.5 py-1.5 text-xs text-teal-100 transition border border-white/10"
              title="Search anything (Cmd+K)"
            >
              <Search className="h-3.5 w-3.5 text-cyan-200" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden md:inline rounded bg-white/10 px-1 py-0.2 text-[10px] font-mono">⌘K</kbd>
            </button>
          )}

          {/* Quick Role Persona Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => {
                setRoleMenuOpen(!roleMenuOpen);
                setNotifMenuOpen(false);
                setInstMenuOpen(false);
                setProfileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-white/25 border border-white/20"
              title="Switch demo persona/role"
            >
              <UserCheck className="h-3.5 w-3.5 text-cyan-200" />
              <span className="hidden sm:inline">Role:</span>
              <span className="font-semibold text-cyan-100">
                {ROLE_LABELS[currentUser.role]?.badge || currentUser.role}
              </span>
              <ChevronDown className="h-3 w-3 opacity-70" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white p-2 text-slate-800 shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Select Role Persona
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Test role authorization & permissions
                  </p>
                </div>
                <div className="mt-1 space-y-0.5 max-h-72 overflow-y-auto">
                  {(Object.keys(ROLE_LABELS) as UserRole[]).map((roleKey) => {
                    const isCurrent = currentUser.role === roleKey;
                    const meta = ROLE_LABELS[roleKey];
                    return (
                      <button
                        key={roleKey}
                        onClick={() => {
                          switchRole(roleKey);
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-left transition ${
                          isCurrent
                            ? 'bg-teal-50 text-teal-900 font-semibold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              isCurrent ? 'bg-teal-600' : 'bg-slate-300'
                            }`}
                          />
                          <span>{meta.label}</span>
                        </div>
                        {isCurrent && <Check className="h-3.5 w-3.5 text-teal-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Institution Switcher */}
          <div className="relative hidden md:block">
            <button
              onClick={() => {
                setInstMenuOpen(!instMenuOpen);
                setRoleMenuOpen(false);
                setNotifMenuOpen(false);
                setProfileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 rounded-lg bg-black/15 hover:bg-black/25 px-2.5 py-1.5 text-xs text-white transition border border-white/10"
              title="Switch tenant institution"
            >
              <Building2 className="h-3.5 w-3.5 text-cyan-200" />
              <span className="max-w-[120px] truncate">{currentInstitution.code}</span>
              <ChevronDown className="h-3 w-3 opacity-70" />
            </button>

            {instMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white p-2 text-slate-800 shadow-xl ring-1 ring-black/5 z-50">
                <div className="px-3 py-2 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Switch Active Organization
                  </span>
                </div>
                <div className="mt-1 space-y-1 max-h-72 overflow-y-auto">
                  {institutions.map((inst) => {
                    const isSelected = currentInstitution.id === inst.id;
                    const isActive = inst.status === 'Active';

                    return (
                      <button
                        key={inst.id}
                        disabled={!isActive}
                        onClick={() => {
                          setCurrentInstitution(inst);
                          setInstMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2.5 text-xs rounded-lg text-left transition ${
                          !isActive
                            ? 'opacity-50 cursor-not-allowed bg-slate-50'
                            : isSelected
                            ? 'bg-teal-50 text-teal-900 font-semibold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>
                          <p className="font-medium text-slate-900">{inst.name}</p>
                          <p className="text-[11px] text-slate-500 capitalize">
                            {inst.type} • Status: {inst.status}
                          </p>
                        </div>
                        {isSelected && <Check className="h-4 w-4 text-teal-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setNotifMenuOpen(!notifMenuOpen);
                setRoleMenuOpen(false);
                setInstMenuOpen(false);
                setProfileMenuOpen(false);
              }}
              className="relative flex items-center gap-1.5 rounded-lg p-2 text-white/90 hover:bg-white/15 hover:text-white transition"
              title="View notifications"
            >
              <Bell className="h-4.5 w-4.5 text-teal-100" />
              {unreadCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white shadow-sm ring-2 ring-[#0d6474]">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifMenuOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white p-3 text-slate-800 shadow-2xl ring-1 ring-black/10 z-50 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="bg-rose-100 text-rose-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="mt-2 space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => markNotificationRead(item.id)}
                      className={`p-2.5 rounded-lg transition text-left cursor-pointer border ${
                        item.isRead
                          ? 'bg-slate-50/70 border-slate-100 text-slate-600'
                          : 'bg-teal-50/60 border-teal-100 text-slate-900'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-xs text-slate-800">{item.title}</p>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-snug">{item.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="relative ml-1">
            <button
              onClick={() => {
                setProfileMenuOpen(!profileMenuOpen);
                setRoleMenuOpen(false);
                setNotifMenuOpen(false);
                setInstMenuOpen(false);
              }}
              className="flex items-center gap-2 rounded-full py-1 pl-2 pr-1 text-white hover:bg-white/10 transition"
            >
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
                alt={currentUser.fullName}
                onError={(e: any) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150';
                }}
                className="h-8.5 w-8.5 rounded-full object-cover ring-2 ring-white/30"
              />
              <ChevronDown className="h-3.5 w-3.5 opacity-70" />
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white p-2 text-slate-800 shadow-2xl ring-1 ring-black/5 z-50">
                <div className="p-2 border-b border-slate-100">
                  <p className="font-semibold text-xs text-slate-900">{currentUser.fullName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                  <span className="mt-1 inline-block text-[10px] uppercase font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                    {ROLE_LABELS[currentUser.role]?.label || currentUser.role}
                  </span>
                </div>

                <div className="mt-1 space-y-0.5">
                  {onExitToGateway && (
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        onExitToGateway();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg text-left"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Back to Universal Gateway</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      resetToDefaults();
                      setProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-amber-700 hover:bg-amber-50 rounded-lg text-left"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Reset Demo Data</span>
                  </button>
                  <button
                    onClick={async () => {
                      setProfileMenuOpen(false);
                      await signOut();
                      if (onExitToGateway) onExitToGateway();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg text-left"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Horizontal Scrollable Sub-Navigation Bar */}
      <nav
        onWheel={handleHorizontalWheel}
        className="lg:hidden flex items-center gap-1.5 overflow-x-auto px-3 sm:px-4 py-2 bg-[#08424e] border-t border-teal-600/30 text-xs font-medium scrollbar-none scroll-touch whitespace-nowrap"
      >
        {allMobileTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                isActive
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-teal-100 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Outside click dismiss overlay for open menus */}
      {(roleMenuOpen || notifMenuOpen || instMenuOpen || profileMenuOpen) && (
        <div
          className="fixed inset-0 z-30 bg-transparent"
          onClick={() => {
            setRoleMenuOpen(false);
            setNotifMenuOpen(false);
            setInstMenuOpen(false);
            setProfileMenuOpen(false);
          }}
        />
      )}
    </header>
  );
};

