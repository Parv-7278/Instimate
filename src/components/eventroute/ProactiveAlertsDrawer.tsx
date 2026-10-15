'use client';

import React, { useState } from 'react';
import { useEventRoute } from '@/lib/eventroute/eventRouteContext';
import {
  Bell,
  X,
  Navigation,
  Clock,
  Footprints,
  AlertTriangle,
  Flame,
  Check,
  MapPin,
  Sparkles,
  ChevronRight,
  Sliders,
} from 'lucide-react';

interface ProactiveAlertsDrawerProps {
  onNavigateToVenue?: (venueId: string) => void;
}

export const ProactiveAlertsDrawer: React.FC<ProactiveAlertsDrawerProps> = ({
  onNavigateToVenue,
}) => {
  const {
    alerts,
    unreadAlertsCount,
    dismissAlert,
    markAlertRead,
    isAlertsDrawerOpen,
    setIsAlertsDrawerOpen,
    triggerQuickNavigation,
    userLocation,
    setUserLocation,
    venueRooms,
  } = useEventRoute();

  const [dismissedToastIds, setDismissedToastIds] = useState<string[]>([]);

  // Active toast alert (shows the most urgent unread alert as floating toast)
  const activeToast = alerts.find(
    (a) => !a.read && !dismissedToastIds.includes(a.id)
  );

  const handleQuickNavigate = (venueId: string) => {
    triggerQuickNavigation(venueId);
    if (onNavigateToVenue) {
      onNavigateToVenue(venueId);
    }
    setIsAlertsDrawerOpen(false);
  };

  return (
    <>
      {/* 1. Floating Toast Banner for Immediate Live Proactive Alerts */}
      {activeToast && !isAlertsDrawerOpen && (
        <div className="fixed bottom-20 right-4 sm:right-8 z-50 max-w-md w-full animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="rounded-2xl bg-slate-900/95 backdrop-blur-md text-white p-4 shadow-2xl border border-cyan-500/40 ring-1 ring-cyan-500/20">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  <Clock className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider font-mono">
                      Smart Proactive Alert
                    </span>
                    <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                  </div>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    {activeToast.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {activeToast.message}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setDismissedToastIds((prev) => [...prev, activeToast.id])}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Actions inside Toast */}
            <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-3 text-[11px] text-teal-300 font-semibold font-mono">
                <span>⏱️ {activeToast.startsInMinutes}m to start</span>
                <span>🚶 {activeToast.estimatedWalkMinutes}m walk</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAlertsDrawerOpen(true)}
                  className="px-2.5 py-1 text-xs text-slate-300 hover:text-white transition"
                >
                  View All ({alerts.length})
                </button>

                <button
                  onClick={() => handleQuickNavigate(activeToast.venueId)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow transition"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  <span>Navigate Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Slide-over Drawer / Notification Center */}
      {isAlertsDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md h-full bg-white text-slate-900 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-200">
            {/* Drawer Header */}
            <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 p-5 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">EventRoute Alerts</h3>
                    {unreadAlertsCount > 0 && (
                      <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {unreadAlertsCount} active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300">
                    Proactive departure notices & live crowd warnings
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAlertsDrawerOpen(false)}
                className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Simulated Location Bar (User can simulate moving between rooms) */}
            <div className="bg-slate-50 border-b border-slate-200 p-4 shrink-0">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <MapPin className="h-3.5 w-3.5 text-teal-600" />
                <span>Simulate Your Current Location:</span>
              </label>
              <select
                value={userLocation}
                onChange={(e) => setUserLocation(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-2xs focus:ring-2 focus:ring-teal-500"
              >
                {venueRooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} ({room.code})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                Walk times dynamically recompute whenever your simulated position changes.
              </p>
            </div>

            {/* Alerts List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {alerts.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  <Check className="h-8 w-8 mx-auto text-emerald-500 mb-2" />
                  <p className="font-semibold text-slate-600">All clear! No pending alerts.</p>
                  <p className="mt-1">
                    Notifications will pop up when an itinerary session is within 15 minutes.
                  </p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`rounded-2xl border p-4 transition text-xs ${
                      alert.type === 'leave_now'
                        ? 'bg-cyan-50/70 border-cyan-300 text-slate-900 shadow-xs'
                        : 'bg-amber-50/70 border-amber-300 text-slate-900 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {alert.type === 'leave_now' ? (
                          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-600 text-white">
                            <Clock className="h-3.5 w-3.5" />
                          </span>
                        ) : (
                          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-600 text-white">
                            <Flame className="h-3.5 w-3.5" />
                          </span>
                        )}
                        <span className="font-bold text-xs">{alert.title}</span>
                      </div>

                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="text-slate-400 hover:text-slate-600 p-1"
                        title="Dismiss"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <p className="text-slate-600 mt-2 leading-relaxed">
                      {alert.message}
                    </p>

                    {/* Metric and Action */}
                    <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-200/80">
                      <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 font-mono">
                        <span>~{alert.distanceMeters}m</span>
                        <span>•</span>
                        <span>{alert.estimatedWalkMinutes}m walk</span>
                      </div>

                      <button
                        onClick={() => handleQuickNavigate(alert.venueId)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-2xs transition"
                      >
                        <Navigation className="h-3 w-3" />
                        <span>Navigate Now</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-center shrink-0">
              <p className="text-[11px] text-slate-500">
                Proactive Smart Notification Engine • EventRoute
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
