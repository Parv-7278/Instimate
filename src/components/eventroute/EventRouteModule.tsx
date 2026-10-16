'use client';

import React, { useState } from 'react';
import { EventRouteProvider, useEventRoute } from '@/lib/eventroute/eventRouteContext';
import { VenueFloorPlanMap } from './VenueFloorPlanMap';
import { ItineraryTimeline } from './ItineraryTimeline';
import { RouteNavigatorHUD } from './RouteNavigatorHUD';
import { EventCatalogView } from './EventCatalogView';
import { ItineraryPlannerModal } from './ItineraryPlannerModal';
import { ProactiveAlertsDrawer } from './ProactiveAlertsDrawer';
import {
  Compass,
  Map,
  Sparkles,
  Calendar,
  Layers,
  Bell,
  RefreshCw,
  Navigation,
  Flame,
  Search,
  BookOpen,
} from 'lucide-react';
import { handleHorizontalWheel } from '@/lib/utils';


type SubView = 'map' | 'itinerary' | 'navigation' | 'sessions';

function EventRouteContent() {
  const [activeSubView, setActiveSubView] = useState<SubView>('map');

  const {
    setIsPlannerModalOpen,
    setIsAlertsDrawerOpen,
    unreadAlertsCount,
    refreshCrowdDensity,
    isLoadingDensity,
    itinerary,
  } = useEventRoute();

  const handleNavigateToVenue = (venueId: string) => {
    setActiveSubView('map');
  };

  return (
    <div className="space-y-6">
      {/* Module Hero Header */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-[#0a424e] to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-teal-500/20">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-16 h-48 w-48 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 shadow-inner">
                <Compass className="h-4.5 w-4.5 animate-spin" style={{ animationDuration: '12s' }} />
              </span>
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest font-mono">
                EventRoute Platform • Smart Navigation
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Universal Event Navigator & Smart Itinerary
            </h1>
            <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
              Explore interactive architectural floor plans, avoid congested halls with real-time crowd heatmaps, and experience zero-conflict AI schedule planning.
            </p>
          </div>

          {/* Action Header Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* AI Planner Modal Trigger */}
            <button
              onClick={() => setIsPlannerModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 px-4 py-2.5 text-xs font-bold shadow-lg transition hover:shadow-cyan-500/20"
            >
              <Sparkles className="h-4 w-4" />
              <span>AI Itinerary Planner</span>
            </button>

            {/* Live Alerts Bell */}
            <button
              onClick={() => setIsAlertsDrawerOpen(true)}
              className="relative flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 text-white px-3.5 py-2.5 text-xs font-semibold border border-white/15 transition"
              title="Open Smart Alerts Drawer"
            >
              <Bell className="h-4 w-4 text-cyan-200" />
              <span>Smart Alerts</span>
              {unreadAlertsCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-xs">
                  {unreadAlertsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div
          onWheel={handleHorizontalWheel}
          className="relative z-10 flex items-center gap-2 mt-6 pt-5 border-t border-white/10 overflow-x-auto pb-1 scrollbar-none scroll-touch whitespace-nowrap"
        >
          {[
            { id: 'map', label: 'Venue Map & Heatmap', icon: Map, badge: 'Live' },
            {
              id: 'itinerary',
              label: 'Smart Itinerary',
              icon: Calendar,
              count: itinerary?.totalSessions,
            },
            { id: 'navigation', label: 'Indoor Turn-by-Turn GPS', icon: Navigation },
            { id: 'sessions', label: 'Event Directory', icon: BookOpen },
          ].map((tab) => {
            const isActive = activeSubView === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubView(tab.id as SubView)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-md'
                    : 'text-teal-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-teal-700' : 'text-teal-200'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="ml-1 rounded-full bg-cyan-400/20 px-1.5 py-0.2 text-[9px] font-mono text-cyan-300 border border-cyan-400/30">
                    {tab.badge}
                  </span>
                )}
                {typeof tab.count === 'number' && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-teal-100 text-teal-800' : 'bg-white/15 text-white'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Tab View Area */}
      <div>
        {activeSubView === 'map' && (
          <VenueFloorPlanMap onSelectRoomForNavigation={handleNavigateToVenue} />
        )}

        {activeSubView === 'itinerary' && (
          <ItineraryTimeline onNavigateToVenue={handleNavigateToVenue} />
        )}

        {activeSubView === 'navigation' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <RouteNavigatorHUD />
            </div>
            <div className="lg:col-span-2">
              <VenueFloorPlanMap onSelectRoomForNavigation={handleNavigateToVenue} />
            </div>
          </div>
        )}

        {activeSubView === 'sessions' && (
          <EventCatalogView onNavigateToVenue={handleNavigateToVenue} />
        )}
      </div>

      {/* Floating Modals and Drawers */}
      <ItineraryPlannerModal />
      <ProactiveAlertsDrawer onNavigateToVenue={handleNavigateToVenue} />
    </div>
  );
}

export const EventRouteModule: React.FC = () => {
  return (
    <EventRouteProvider>
      <EventRouteContent />
    </EventRouteProvider>
  );
};
