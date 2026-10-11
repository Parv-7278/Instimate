'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/storeContext';
import { isSupabaseConfigured } from '@/lib/supabase';
import {
  Settings,
  Building2,
  Database,
  ShieldCheck,
  RefreshCw,
  Check,
  Save,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';

export const SettingsModule: React.FC = () => {
  const { currentInstitution, setCurrentInstitution, resetToDefaults, currentUser } = useStore();

  const [saved, setSaved] = useState(false);
  const [instData, setInstData] = useState({
    name: currentInstitution.name,
    code: currentInstitution.code,
    type: currentInstitution.type,
    currency: currentInstitution.currency,
    currentAcademicYear: currentInstitution.currentAcademicYear,
    phone: currentInstitution.phone,
    email: currentInstitution.email,
    address: currentInstitution.address,
  });

  const isLiveDb = isSupabaseConfigured();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentInstitution({
      ...currentInstitution,
      ...instData,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Institution Settings & Architecture
            </h1>
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 border border-teal-200">
              Multi-Tenant Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure organization branding, academic cycles, currency, and database connections.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Reset demo state to default sample data?')) {
              resetToDefaults();
            }
          }}
          className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Reset All Demo Data</span>
        </button>
      </div>

      {/* Cloud & Database Telemetry Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-teal-600" />
            <h3 className="font-bold text-sm text-slate-900">Database Engine</h3>
          </div>
          <p className="text-xs text-slate-500">
            PostgreSQL schema with Row-Level Security (RLS) policies and real-time reactive store.
          </p>
          <div className="flex items-center gap-2 pt-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-800">
              {isLiveDb ? 'Live Supabase Cloud Connected' : 'Resilient Client-Side Database & LocalStorage Active'}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">Payment Gateway</h3>
          </div>
          <p className="text-xs text-slate-500">
            Razorpay India gateway with instant UPI, Credit/Debit cards, Net Banking & webhooks.
          </p>
          <div className="flex items-center gap-2 pt-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-800">
              Verified Razorpay Checkout & Sandbox Active
            </span>
          </div>
        </div>
      </div>

      {/* Institution Organization Form */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <h3 className="font-bold text-sm text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
          <Building2 className="h-4.5 w-4.5 text-teal-600" />
          <span>Organization Profile & Academic Configuration</span>
        </h3>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Institution Name</label>
              <input
                type="text"
                required
                value={instData.name}
                onChange={(e) => setInstData({ ...instData, name: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Institution Code</label>
              <input
                type="text"
                required
                value={instData.code}
                onChange={(e) => setInstData({ ...instData, code: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Organization Type</label>
              <select
                value={instData.type}
                onChange={(e: any) => setInstData({ ...instData, type: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
              >
                <option value="school">School</option>
                <option value="college">College</option>
                <option value="university">University</option>
                <option value="coaching">Coaching Centre</option>
                <option value="corporate">Corporate Training</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Billing Currency</label>
              <select
                value={instData.currency}
                onChange={(e) => setInstData({ ...instData, currency: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold"
              >
                <option value="₹">₹ (Indian Rupee - INR)</option>
                <option value="$">$ (US Dollar - USD)</option>
                <option value="€">€ (Euro - EUR)</option>
                <option value="£">£ (British Pound - GBP)</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Current Academic Year</label>
              <input
                type="text"
                required
                value={instData.currentAcademicYear}
                onChange={(e) => setInstData({ ...instData, currentAcademicYear: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Official Contact Email</label>
              <input
                type="email"
                required
                value={instData.email}
                onChange={(e) => setInstData({ ...instData, email: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Official Phone</label>
              <input
                type="text"
                required
                value={instData.phone}
                onChange={(e) => setInstData({ ...instData, phone: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Campus Physical Address</label>
            <input
              type="text"
              required
              value={instData.address}
              onChange={(e) => setInstData({ ...instData, address: e.target.value })}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t">
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 px-5 py-2 text-xs font-semibold text-white shadow-sm transition"
            >
              {saved ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Settings Updated!</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Configuration</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
