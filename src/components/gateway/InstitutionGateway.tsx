'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/storeContext';
import { Institution, UserRole } from '@/types';
import {
  Building2,
  ShieldAlert,
  Users,
  ArrowRight,
  Sparkles,
  Lock,
  Globe,
  CheckCircle2,
  Clock,
  Layers,
  Search,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { InstitutionRegistrationModal } from './InstitutionRegistrationModal';
import { authService } from '@/lib/supabase/services/authService';
import { isSupabaseConfigured } from '@/lib/supabase';

interface Props {
  onEnterInstitutionWorkspace: (inst: Institution, role?: UserRole) => void;
  onEnterSuperAdmin: () => void;
}

export const InstitutionGateway: React.FC<Props> = ({
  onEnterInstitutionWorkspace,
  onEnterSuperAdmin,
}) => {
  const { institutions, setCurrentInstitution, switchRole } = useStore();

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [activeSignInModal, setActiveSignInModal] = useState<'institution' | 'member' | null>(null);

  // Authentication Mode & Status
  const [isDemoMode, setIsDemoMode] = useState(!isSupabaseConfigured());
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Institution Login Form State
  const [instLoginId, setInstLoginId] = useState('AIA-2024');
  const [instEmail, setInstEmail] = useState('admin@apexacademy.edu');
  const [instPassword, setInstPassword] = useState('••••••••');

  // Member Login Form State
  const [memberEmail, setMemberEmail] = useState('aarav.patel@apexacademy.edu');
  const [memberPassword, setMemberPassword] = useState('••••••••');

  const [searchTenantQuery, setSearchTenantQuery] = useState('');

  const filteredTenants = institutions.filter(
    (i) =>
      i.name.toLowerCase().includes(searchTenantQuery.toLowerCase()) ||
      i.code.toLowerCase().includes(searchTenantQuery.toLowerCase()) ||
      i.type.toLowerCase().includes(searchTenantQuery.toLowerCase())
  );

  const handleInstitutionLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    // DEMO MODE QUICK LOGIN
    if (isDemoMode) {
      const matched = institutions.find(
        (i) => i.code.toLowerCase() === instLoginId.toLowerCase() || i.slug.toLowerCase() === instLoginId.toLowerCase()
      ) || institutions.find((i) => i.status === 'Active') || institutions[0];

      if (matched && matched.status !== 'Active') {
        alert(`This institution is currently '${matched.status}'. Only Super Admin approved institutions can sign in.`);
        return;
      }
      if (matched) setCurrentInstitution(matched);
      onEnterInstitutionWorkspace(matched || institutions[0], 'institution_admin');
      setActiveSignInModal(null);
      return;
    }

    // LIVE SUPABASE AUTHENTICATION
    setIsLoading(true);
    try {
      const authData = await authService.signIn(instEmail, instPassword);
      if (authData.user) {
        const profile = await authService.fetchUserProfile(authData.user.id);
        let matched = institutions.find((i) => i.id === profile?.institutionId);
        if (!matched) {
          matched = institutions.find(
            (i) => i.code.toLowerCase() === instLoginId.toLowerCase() || i.slug.toLowerCase() === instLoginId.toLowerCase()
          ) || institutions.find((i) => i.status === 'Active') || institutions[0];
        }

        if (matched && matched.status !== 'Active') {
          setAuthError(`Institution is currently '${matched.status}'. Super Admin authorization required.`);
          setIsLoading(false);
          return;
        }

        if (matched) setCurrentInstitution(matched);
        onEnterInstitutionWorkspace(matched || institutions[0], (profile?.role as UserRole) || 'institution_admin');
        setActiveSignInModal(null);
      }
    } catch (err: any) {
      console.error('Supabase admin login error:', err);
      setAuthError(err.message || 'Invalid administrator login credentials. Make sure user exists in Supabase Auth.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMemberLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    // DEMO MODE QUICK LOGIN
    if (isDemoMode) {
      const inst = institutions.find((i) => i.status === 'Active') || institutions[0];
      setCurrentInstitution(inst);
      onEnterInstitutionWorkspace(inst, 'student');
      setActiveSignInModal(null);
      return;
    }

    // LIVE SUPABASE AUTHENTICATION
    setIsLoading(true);
    try {
      const authData = await authService.signIn(memberEmail, memberPassword);
      if (authData.user) {
        const profile = await authService.fetchUserProfile(authData.user.id);
        let matched = institutions.find((i) => i.id === profile?.institutionId);
        if (!matched) {
          matched = institutions.find((i) => i.status === 'Active') || institutions[0];
        }

        if (matched) setCurrentInstitution(matched);
        onEnterInstitutionWorkspace(matched || institutions[0], (profile?.role as UserRole) || 'student');
        setActiveSignInModal(null);
      }
    } catch (err: any) {
      console.error('Supabase member login error:', err);
      setAuthError(err.message || 'Invalid member credentials. Make sure user exists in Supabase Auth.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col justify-between selection:bg-teal-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0d6474] to-[#127d91] text-white shadow-inner border border-white/20">
              <Building2 className="h-5 w-5 text-cyan-200" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white font-sans">
                INSTITUTION<span className="text-cyan-400">HUB</span>
              </span>
              <span className="ml-2 rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
                Universal Multi-Tenant OS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onEnterSuperAdmin}
              className="flex items-center gap-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-400/30 px-3 py-1.5 text-xs font-semibold text-purple-200 transition"
              title="Open Super Admin Platform Verification Dashboard"
            >
              <ShieldAlert className="h-4 w-4 text-purple-300" />
              <span className="hidden sm:inline">Super Admin Governance</span>
            </button>

            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0d6474] to-[#127d91] px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:opacity-95 transition"
            >
              <span>Register Institution</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-950/80 border border-cyan-500/30 px-3.5 py-1 text-xs font-semibold text-cyan-300">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Universal Sovereign Tenant Workspaces</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            One Platform. Every Institution.{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Complete Control.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Independent registration, multi-step accreditation verification, sovereign tenant data isolation, and tailored operational dashboards for schools, universities, companies, and government agencies.
          </p>
        </div>

        {/* 3 Primary Action Cards (Exact Priority 1 Requirement!) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Card 1: Register an Institution */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 flex flex-col justify-between hover:border-cyan-500/50 transition-all shadow-xl group">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4 group-hover:scale-105 transition">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Register an Institution</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Apply for institutional onboarding with conditional accreditation, affiliation, corporate CIN, or ministerial jurisdiction credentials.
              </p>
            </div>

            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#0d6474] to-[#127d91] py-2.5 text-xs font-bold text-white shadow-md hover:opacity-95 transition flex items-center justify-center gap-2"
            >
              <span>Begin Institution Registration</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Card 2: Institution Sign In */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 flex flex-col justify-between hover:border-emerald-500/50 transition-all shadow-xl group">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4 group-hover:scale-105 transition">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Sign In to Institution</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                For verified institution administrators and directors. Access your organization’s sovereign management dashboard and members.
              </p>
            </div>

            <button
              onClick={() => setActiveSignInModal('institution')}
              className="mt-6 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-md transition flex items-center justify-center gap-2"
            >
              <span>Institution Admin Login</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Card 3: Member Login */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 flex flex-col justify-between hover:border-indigo-500/50 transition-all shadow-xl group">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4 group-hover:scale-105 transition">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Member Login</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                For teachers, corporate employees, government officers, students, and parents belonging to an authorized institution.
              </p>
            </div>

            <button
              onClick={() => setActiveSignInModal('member')}
              className="mt-6 w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 py-2.5 text-xs font-bold text-white shadow-md transition flex items-center justify-center gap-2"
            >
              <span>Member Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Live Registered Organizations & Verification Directory */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 max-w-5xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="h-4.5 w-4.5 text-cyan-400" />
                <span>Multi-Tenant Organizations Directory</span>
              </h3>
              <p className="text-xs text-slate-400">
                Explore active organizations across different sectors or launch live workspaces directly.
              </p>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search institution or type..."
                value={searchTenantQuery}
                onChange={(e) => setSearchTenantQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredTenants.map((inst) => {
              const isActive = inst.status === 'Active';

              return (
                <div
                  key={inst.id}
                  className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-4 flex flex-col justify-between hover:border-slate-700 transition"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                        {inst.type}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : inst.status === 'Pending Verification'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {inst.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-white mt-2.5">{inst.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {inst.city}, {inst.country} • Code: {inst.code}
                    </p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-500">
                      {inst.totalMembers} Members
                    </span>

                    {isActive ? (
                      <button
                        onClick={() => {
                          setCurrentInstitution(inst);
                          onEnterInstitutionWorkspace(inst);
                        }}
                        className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                      >
                        <span>Open Workspace</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    ) : (
                      <span className="text-[10px] text-amber-400/80 font-medium">
                        Verification Pending
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 text-xs text-slate-500 text-center">
        <p>© 2026 Institution Hub Universal Platform. Strict multi-tenant isolation & sovereign data encryption enabled.</p>
      </footer>

      {/* Registration Modal */}
      <InstitutionRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={(id) => {
          setIsRegisterModalOpen(false);
          alert('Institution registration submitted successfully! Status set to Pending Verification. The Super Admin will review your application.');
        }}
      />

      {/* Institution Login Modal */}
      {activeSignInModal === 'institution' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative text-slate-100">
            <button
              onClick={() => {
                setActiveSignInModal(null);
                setAuthError(null);
              }}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-800"
            >
              ✕
            </button>

            <h3 className="text-base font-bold text-white mb-1">
              Institution Administrator Sign In
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Enter your authorized organization identifier and admin credentials.
            </p>

            {/* Mode Switcher Banner */}
            <div className="flex items-center justify-between rounded-xl bg-slate-800/90 p-2.5 mb-3 border border-slate-700/70">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${isDemoMode ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
                <span className="text-[11px] font-medium text-slate-200">
                  {isDemoMode ? 'Demo Quick Login (Skip Password)' : 'Live Supabase Auth Active'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsDemoMode(!isDemoMode);
                  setAuthError(null);
                }}
                className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
              >
                Switch to {isDemoMode ? 'Supabase Auth' : 'Demo Mode'}
              </button>
            </div>

            {/* Error Banner */}
            {authError && (
              <div className="mb-3 rounded-xl bg-rose-500/15 border border-rose-500/30 p-2.5 text-xs text-rose-200 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-rose-300">{authError}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDemoMode(true);
                      setAuthError(null);
                    }}
                    className="text-[11px] text-cyan-300 hover:text-cyan-200 underline font-semibold block"
                  >
                    Switch to Demo Mode to test immediately →
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleInstitutionLoginSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Institution Code / Domain Slug</label>
                <input
                  type="text"
                  required
                  value={instLoginId}
                  onChange={(e) => setInstLoginId(e.target.value)}
                  placeholder="e.g. AIA-2024 or apex-international-academy"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Administrator Email</label>
                <input
                  type="email"
                  required
                  value={instEmail}
                  onChange={(e) => setInstEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={instPassword}
                  onChange={(e) => setInstPassword(e.target.value)}
                  placeholder={isDemoMode ? 'Any password in demo mode' : 'Supabase account password'}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-xs text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSignInModal(null);
                    setAuthError(null);
                  }}
                  className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 px-5 py-2 text-xs font-bold text-white shadow-sm transition"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <span>{isDemoMode ? 'Access Dashboard (Demo)' : 'Access Dashboard'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Login Modal */}
      {activeSignInModal === 'member' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative text-slate-100">
            <button
              onClick={() => {
                setActiveSignInModal(null);
                setAuthError(null);
              }}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-800"
            >
              ✕
            </button>

            <h3 className="text-base font-bold text-white mb-1">
              Authorized Member Sign In
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              For faculty, students, corporate staff, and government officers.
            </p>

            {/* Mode Switcher Banner */}
            <div className="flex items-center justify-between rounded-xl bg-slate-800/90 p-2.5 mb-3 border border-slate-700/70">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${isDemoMode ? 'bg-amber-400' : 'bg-indigo-400 animate-pulse'}`} />
                <span className="text-[11px] font-medium text-slate-200">
                  {isDemoMode ? 'Demo Quick Login (Skip Password)' : 'Live Supabase Auth Active'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsDemoMode(!isDemoMode);
                  setAuthError(null);
                }}
                className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
              >
                Switch to {isDemoMode ? 'Supabase Auth' : 'Demo Mode'}
              </button>
            </div>

            {/* Error Banner */}
            {authError && (
              <div className="mb-3 rounded-xl bg-rose-500/15 border border-rose-500/30 p-2.5 text-xs text-rose-200 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-rose-300">{authError}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDemoMode(true);
                      setAuthError(null);
                    }}
                    className="text-[11px] text-cyan-300 hover:text-cyan-200 underline font-semibold block"
                  >
                    Switch to Demo Mode to test immediately →
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleMemberLoginSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Registered Member Email</label>
                <input
                  type="email"
                  required
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={memberPassword}
                  onChange={(e) => setMemberPassword(e.target.value)}
                  placeholder={isDemoMode ? 'Any password in demo mode' : 'Supabase account password'}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-xs text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSignInModal(null);
                    setAuthError(null);
                  }}
                  className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-5 py-2 text-xs font-bold text-white shadow-sm transition"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <span>{isDemoMode ? 'Sign In to Portal (Demo)' : 'Sign In to Member Portal'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
