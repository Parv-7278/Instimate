'use client';

import React, { useState } from 'react';
import { useEventRoute } from '@/lib/eventroute/eventRouteContext';
import {
  Navigation,
  Compass,
  ArrowRight,
  ArrowLeftRight,
  MapPin,
  Clock,
  Footprints,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  CornerUpLeft,
  CornerUpRight,
  MoveUp,
  Flag,
} from 'lucide-react';

export const RouteNavigatorHUD: React.FC = () => {
  const {
    venueRooms,
    userLocation,
    setUserLocation,
    selectedDestination,
    setSelectedDestination,
    activeRoute,
    calculateRoute,
    clearRoute,
    preferences,
  } = useEventRoute();

  const [originId, setOriginId] = useState<string>(userLocation);
  const [destId, setDestId] = useState<string>(selectedDestination || 'hall-b');
  const [avoidCongestion, setAvoidCongestion] = useState<boolean>(preferences.avoidCrowds);

  // Sync state if external changes happen
  React.useEffect(() => {
    setOriginId(userLocation);
  }, [userLocation]);

  React.useEffect(() => {
    if (selectedDestination) {
      setDestId(selectedDestination);
    }
  }, [selectedDestination]);

  const handleCalculate = () => {
    if (originId && destId) {
      calculateRoute(originId, destId, avoidCongestion);
    }
  };

  const handleSwap = () => {
    const temp = originId;
    setOriginId(destId);
    setDestId(temp);
    calculateRoute(destId, temp, avoidCongestion);
  };

  const getStepIcon = (direction: 'straight' | 'left' | 'right' | 'arrive') => {
    switch (direction) {
      case 'left':
        return <CornerUpLeft className="h-4 w-4 text-cyan-600" />;
      case 'right':
        return <CornerUpRight className="h-4 w-4 text-indigo-600" />;
      case 'arrive':
        return <Flag className="h-4 w-4 text-emerald-600" />;
      default:
        return <MoveUp className="h-4 w-4 text-teal-600" />;
    }
  };

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-xl p-5 space-y-5">
      {/* HUD Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Indoor Pathfinding & GPS</h3>
            <p className="text-[11px] text-slate-500">Shortest path routing with congestion deterrence</p>
          </div>
        </div>

        {activeRoute && (
          <button
            onClick={clearRoute}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Origin & Destination Selectors */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-cyan-600" />
            <span>Starting Point</span>
          </label>
          <div className="flex items-center gap-2">
            <select
              value={originId}
              onChange={(e) => {
                setOriginId(e.target.value);
                setUserLocation(e.target.value);
              }}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {venueRooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-1">
          <button
            type="button"
            onClick={handleSwap}
            className="rounded-full bg-slate-100 hover:bg-slate-200 p-1.5 text-slate-600 transition shadow-sm border border-slate-200"
            title="Swap Origin and Destination"
          >
            <ArrowLeftRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
            <Flag className="h-3.5 w-3.5 text-rose-600" />
            <span>Target Destination</span>
          </label>
          <select
            value={destId}
            onChange={(e) => {
              setDestId(e.target.value);
              setSelectedDestination(e.target.value);
            }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {venueRooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.code})
              </option>
            ))}
          </select>
        </div>

        {/* Avoid Congestion Checkbox */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 text-xs">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span className="font-semibold text-slate-700">Avoid Congested Corridors</span>
          </div>
          <input
            type="checkbox"
            checked={avoidCongestion}
            onChange={(e) => setAvoidCongestion(e.target.checked)}
            className="h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
          />
        </div>

        <button
          onClick={handleCalculate}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2.5 shadow-sm transition"
        >
          <Navigation className="h-4 w-4" />
          <span>Find Shortest Indoor Route</span>
        </button>
      </div>

      {/* Calculated Route Summary Card */}
      {activeRoute && (
        <div className="space-y-4 pt-2 border-t border-slate-100 animate-in fade-in">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-teal-50/70 border border-teal-200/60 p-3 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 flex items-center justify-center gap-1">
                <Footprints className="h-3 w-3" />
                Distance
              </span>
              <p className="text-lg font-black text-teal-950 mt-0.5">
                {activeRoute.totalDistanceMeters}m
              </p>
            </div>

            <div className="rounded-xl bg-cyan-50/70 border border-cyan-200/60 p-3 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 flex items-center justify-center gap-1">
                <Clock className="h-3 w-3" />
                Walk Time
              </span>
              <p className="text-lg font-black text-cyan-950 mt-0.5">
                ~{activeRoute.estimatedWalkingMinutes} min
              </p>
            </div>
          </div>

          {/* Congestion Alert warning if path passes crowded zone */}
          {activeRoute.passesCongestedZone && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Crowded Zone on Path</p>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  This route passes near high-traffic areas. Enable "Avoid Congested Corridors" to divert through side promenades.
                </p>
              </div>
            </div>
          )}

          {/* Step-by-Step Directions */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Turn-by-Turn Guidance</span>
              <span className="text-[10px] font-mono text-slate-400">
                {activeRoute.steps.length} steps
              </span>
            </h4>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {activeRoute.steps.map((st) => (
                <div
                  key={st.stepNumber}
                  className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white border border-slate-200 shadow-2xs mt-0.5">
                    {getStepIcon(st.direction)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 leading-snug">{st.instruction}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span>{st.waypointName}</span>
                      {st.distanceMeters > 0 && <span>• {st.distanceMeters}m</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
