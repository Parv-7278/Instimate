'use client';

import React from 'react';
import { useStore } from '@/lib/storeContext';
import { UserRole } from '@/types';
import {
  GraduationCap,
  ShieldCheck,
  CreditCard,
  Calendar,
  CheckCircle2,
  Users,
  Award,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface LandingPageProps {
  onEnterDashboard: (role?: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterDashboard }) => {
  const { switchRole } = useStore();

  const handleLaunchRole = (role: UserRole) => {
    switchRole(role);
    onEnterDashboard(role);
  };

  const personas: { role: UserRole; title: string; desc: string; color: string }[] = [
    { role: 'institution_admin', title: 'Institution Admin', desc: 'Central management, admissions, fee reconciliation & staff', color: 'border-emerald-200 bg-emerald-50/50 hover:border-emerald-400' },
    { role: 'faculty', title: 'Faculty & Teacher', desc: 'Roll-call attendance, homework grading & exam mark entry', color: 'border-blue-200 bg-blue-50/50 hover:border-blue-400' },
    { role: 'student', title: 'Student Portal', desc: 'Personal timetable, assignments due, results & Razorpay fees', color: 'border-cyan-200 bg-cyan-50/50 hover:border-cyan-400' },
    { role: 'accountant', title: 'Finance & Bursar', desc: 'Fee structures, invoices, Razorpay collections & tax receipts', color: 'border-indigo-200 bg-indigo-50/50 hover:border-indigo-400' },
    { role: 'principal', title: 'Principal / Director', desc: 'Academic KPIs, department audits & institution pass rates', color: 'border-amber-200 bg-amber-50/50 hover:border-amber-400' },
    { role: 'parent', title: 'Parent / Guardian', desc: 'Child attendance warnings, report cards & online fee payment', color: 'border-pink-200 bg-pink-50/50 hover:border-pink-400' },
    { role: 'hr_staff', title: 'HR & Office Staff', desc: 'Staff directory, leave request workflows & shifts', color: 'border-orange-200 bg-orange-50/50 hover:border-orange-400' },
    { role: 'super_admin', title: 'Super Admin', desc: 'Multi-tenant institution accounts, billing & platform settings', color: 'border-purple-200 bg-purple-50/50 hover:border-purple-400' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0d6474] to-[#127d91] text-white shadow-sm">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                Institution<span className="text-[#0d6474]">Hub</span>
              </span>
              <span className="ml-2 rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700 border border-teal-200">
                Enterprise SaaS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleLaunchRole('institution_admin')}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0d6474] to-[#127d91] px-4 py-2 text-xs font-bold text-white shadow-sm hover:opacity-95 transition"
            >
              <span>Launch Live Dashboard</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-teal-50/30 to-slate-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3.5 py-1 text-xs font-semibold text-teal-800 border border-teal-200 mb-6 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-teal-600" />
            <span>Next-Generation Multi-Tenant Institution OS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-950 max-w-4xl mx-auto leading-tight">
            The Central Nervous System for{' '}
            <span className="bg-gradient-to-r from-[#0d6474] to-[#0284c7] bg-clip-text text-transparent">
              Modern Academic Institutions
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Centralize attendance, student records, conflict-free timetable schedules, examinations, Razorpay online fee payments, and parent notifications in one unified platform.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => handleLaunchRole('institution_admin')}
              className="rounded-xl bg-gradient-to-r from-[#0d6474] to-[#127d91] px-6 py-3.5 text-sm font-bold text-white shadow-md hover:shadow-lg transition flex items-center gap-2"
            >
              <span>Explore Admin Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => handleLaunchRole('student')}
              className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 hover:bg-slate-50 shadow-xs transition"
            >
              Try Student Portal
            </button>
          </div>

          {/* Institution Types Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-500">
            <span>Built for:</span>
            {['K-12 Schools', 'Colleges & Universities', 'Competitive Coaching Centres', 'Corporate Training Wings', 'Skill Academies'].map((t) => (
              <span key={t} className="rounded-lg bg-white px-2.5 py-1 border border-slate-200 shadow-2xs text-slate-700 font-semibold">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Instant Demo Role Switcher Matrix */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Test All 8 Role Dashboards with One Click
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select any persona to experience customized permissions, security gates, and interactive workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {personas.map((p) => (
              <button
                key={p.role}
                onClick={() => handleLaunchRole(p.role)}
                className={`text-left rounded-2xl border p-4.5 transition shadow-2xs hover:shadow-md flex flex-col justify-between ${p.color}`}
              >
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{p.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-snug">{p.desc}</p>
                </div>
                <div className="mt-4 flex items-center text-xs font-bold text-teal-700">
                  <span>Enter as {p.title}</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Pillars */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Comprehensive Production-Ready Modules
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Every button, chart, and ledger is backed by real persistent database models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 mb-3 border border-teal-100">
                <CreditCard className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Razorpay Fee Payments</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Server-verified payments via UPI (GPay/PhonePe/Paytm), cards, and net banking. Automatic invoice reconciliation and downloadable receipts.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 mb-3 border border-teal-100">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Conflict-Free Timetables</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Weekly master schedule grid with automated collision prevention for classroom double-booking and faculty timetable conflicts.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 mb-3 border border-teal-100">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Examinations & Report Cards</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Faculty mark entry, configurable GPA scales, class comparisons, and printable official student progress report cards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 text-xs border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Institution Hub Enterprise. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-300">
            <span>Powered by Next.js, Supabase & Razorpay</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
