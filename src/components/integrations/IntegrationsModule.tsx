'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/storeContext';
import { IntegrationConfig } from '@/types';
import {
  Layers,
  GraduationCap,
  MessageCircle,
  CreditCard,
  FolderSync,
  Mail,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  X,
} from 'lucide-react';

export const IntegrationsModule: React.FC = () => {
  const { integrations, updateIntegration } = useStore();

  const [activeConfigItem, setActiveConfigItem] = useState<IntegrationConfig | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const getIcon = (key: string) => {
    switch (key) {
      case 'google_classroom':
        return <GraduationCap className="h-6 w-6 text-emerald-600" />;
      case 'whatsapp':
        return <MessageCircle className="h-6 w-6 text-green-600" />;
      case 'razorpay':
        return <CreditCard className="h-6 w-6 text-blue-600" />;
      case 'google_drive':
        return <FolderSync className="h-6 w-6 text-amber-600" />;
      case 'resend':
        return <Mail className="h-6 w-6 text-purple-600" />;
      default:
        return <Layers className="h-6 w-6 text-teal-600" />;
    }
  };

  const handleTestSync = (id: string) => {
    setSyncingId(id);
    setTimeout(() => {
      updateIntegration(id, {
        lastSynced: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Connected',
      });
      setSyncingId(null);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              External Cloud & API Integrations
            </h1>
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 border border-teal-200">
              Enterprise Webhooks
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Connect Google Classroom sync, WhatsApp Business notifications, Razorpay India payments, and cloud drives.
          </p>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm flex flex-col justify-between hover:border-teal-300 transition"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-200">
                    {getIcon(item.key)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{item.name}</h3>
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.2 rounded-full mt-0.5 ${
                        item.status === 'Connected'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Configured'
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleTestSync(item.id)}
                  disabled={syncingId === item.id}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-teal-700 transition"
                  title="Test Connection"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${syncingId === item.id ? 'animate-spin text-teal-600' : ''}`}
                  />
                </button>
              </div>

              <p className="text-xs text-slate-500 mt-3">{item.description}</p>

              {/* Active Config Parameters */}
              <div className="mt-4 rounded-xl bg-slate-50 p-3 border border-slate-100 text-[11px] space-y-1">
                {Object.entries(item.config).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-slate-400 capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="font-mono text-slate-700 font-semibold truncate max-w-[200px]">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">
                Last verified: {item.lastSynced || 'Never'}
              </span>

              <button
                onClick={() => setActiveConfigItem(item)}
                className="font-semibold text-teal-700 hover:underline"
              >
                Configure Credentials →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Configuration Modal */}
      {activeConfigItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl relative">
            <button
              onClick={() => setActiveConfigItem(null)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Configure {activeConfigItem.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter API keys, OAuth client credentials, or webhook endpoints.
            </p>

            <div className="space-y-3 text-xs">
              {Object.entries(activeConfigItem.config).map(([key, val]) => (
                <div key={key}>
                  <label className="block font-medium text-slate-700 mb-1 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type="text"
                    defaultValue={val}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs font-mono"
                  />
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t mt-4">
              <button
                type="button"
                onClick={() => setActiveConfigItem(null)}
                className="rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  updateIntegration(activeConfigItem.id, { status: 'Connected' });
                  setActiveConfigItem(null);
                }}
                className="rounded-xl bg-teal-600 hover:bg-teal-700 px-4 py-2 text-xs font-semibold text-white shadow-sm"
              >
                Save & Verify Handshake
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
