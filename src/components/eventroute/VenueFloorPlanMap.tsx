'use client';

import React, { useState } from 'react';
import { useEventRoute } from '@/lib/eventroute/eventRouteContext';
import { VenueRoom } from '@/types/eventroute';
import {
  Compass,
  Layers,
  Flame,
  Users,
  Navigation,
  MapPin,
  RefreshCw,
  Search,
  Eye,
  Info,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Sliders,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';

interface VenueFloorPlanMapProps {
  onSelectRoomForNavigation?: (venueId: string) => void;
}

export const VenueFloorPlanMap: React.FC<VenueFloorPlanMapProps> = ({
  onSelectRoomForNavigation,
}) => {
  const {
    venueRooms,
    refreshCrowdDensity,
    isLoadingDensity,
    userLocation,
    setUserLocation,
    selectedDestination,
    setSelectedDestination,
    activeRoute,
    calculateRoute,
    clearRoute,
    sessions,
  } = useEventRoute();

  const [showHeatmap, setShowHeatmap] = useState(true);
  const [avoidCrowdsToggle, setAvoidCrowdsToggle] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<VenueRoom | null>(
    venueRooms.find((r) => r.id === 'hall-b') || venueRooms[0]
  );
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredRoomId, setHoveredRoomId] = useState<string | null>(null);

  // SVG coordinate definitions for rooms
  const ROOM_SVG_LAYOUT: Record<
    string,
    { x: number; y: number; w: number; h: number; doorX: number; doorY: number; label: string }
  > = {
    'hall-a': { x: 160, y: 60, w: 240, h: 160, doorX: 280, doorY: 220, label: 'Hall A • Keynotes' },
    'hall-b': { x: 450, y: 60, w: 220, h: 160, doorX: 560, doorY: 220, label: 'Hall B • Deep Tech & AI' },
    'arena-c': { x: 730, y: 60, w: 250, h: 180, doorX: 855, doorY: 240, label: 'Arena C • Gaming & XR' },
    'demo-alley': { x: 730, y: 290, w: 250, h: 200, doorX: 730, doorY: 390, label: 'Demo Alley • Hardware' },
    'lounge-d': { x: 670, y: 535, w: 220, h: 145, doorX: 780, doorY: 535, label: 'Lounge D • VC & Pitch' },
    'workshop-e': { x: 430, y: 535, w: 200, h: 145, doorX: 530, doorY: 535, label: 'Workshop E • Music' },
    'food-court': { x: 160, y: 520, w: 230, h: 160, doorX: 275, doorY: 520, label: 'Food Court & Cafe' },
    'atrium-reg': { x: 160, y: 280, w: 230, h: 180, doorX: 390, doorY: 370, label: 'Grand Atrium • Entry' },
  };

  const handleRoomClick = (room: VenueRoom) => {
    setSelectedRoom(room);
  };

  const handleRouteToRoom = (targetRoomId: string) => {
    setSelectedDestination(targetRoomId);
    calculateRoute(userLocation, targetRoomId, avoidCrowdsToggle);
    if (onSelectRoomForNavigation) {
      onSelectRoomForNavigation(targetRoomId);
    }
  };

  const handleSetCurrentLocation = (locId: string) => {
    setUserLocation(locId);
    if (selectedDestination && selectedDestination !== locId) {
      calculateRoute(locId, selectedDestination, avoidCrowdsToggle);
    }
  };

  // Convert active route path coordinates into an SVG path string
  const generateRouteSvgPath = () => {
    if (!activeRoute || activeRoute.pathCoordinates.length < 2) return '';
    const coords = activeRoute.pathCoordinates;
    return coords.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, '');
  };

  // Get active sessions for the currently selected room
  const roomSessions = sessions.filter((s) => s.venueId === selectedRoom?.id);

  return (
    <div className="flex flex-col lg:flex-row gap-5 w-full">
      {/* Left / Center Map Container */}
      <div className="flex-1 flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
        {/* Map HUD Control Bar */}
        <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold text-slate-100 uppercase tracking-wider text-[11px]">
                Interactive Floor Plan
              </span>
            </div>

            <div className="h-4 w-px bg-slate-800 hidden sm:block" />

            {/* Heatmap Layer Toggle */}
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-semibold transition ${
                showHeatmap
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              <Flame className="h-3.5 w-3.5" />
              <span>{showHeatmap ? 'Heatmap Active' : 'Heatmap Off'}</span>
            </button>

            {/* Avoid Crowds Toggle */}
            <button
              onClick={() => {
                const newVal = !avoidCrowdsToggle;
                setAvoidCrowdsToggle(newVal);
                if (selectedDestination) {
                  calculateRoute(userLocation, selectedDestination, newVal);
                }
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-semibold transition ${
                avoidCrowdsToggle
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title="Prioritizes uncongested routes in pathfinding"
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Avoid Congestion</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Simulate Foot Traffic Button */}
            <button
              onClick={() => refreshCrowdDensity(true)}
              disabled={isLoadingDensity}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/30 font-semibold transition disabled:opacity-50"
              title="Simulates real-time foot-traffic movements"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoadingDensity ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Simulate Crowd Shift</span>
            </button>

            {/* Zoom Controls */}
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
                className="p-1.5 text-slate-400 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="px-1 text-[10px] font-mono text-slate-300">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
                className="p-1.5 text-slate-400 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Interactive SVG Floor Plan Canvas */}
        <div className="relative w-full bg-slate-950 flex items-center justify-center p-2 sm:p-4 min-h-[480px] overflow-auto select-none">
          <div
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
            className="transition-transform duration-200"
          >
            <svg
              viewBox="0 0 1060 740"
              className="w-full max-w-[960px] h-auto drop-shadow-2xl"
              style={{ minWidth: '680px' }}
            >
              <defs>
                {/* Architectural Grid pattern */}
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                </pattern>

                {/* Animated Route Gradient */}
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>

                {/* Glow Filter for Heatmap and Waypoints */}
                <filter id="heatGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="22" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background Architectural Canvas */}
              <rect width="1060" height="740" fill="#090d16" rx="16" />
              <rect width="1060" height="740" fill="url(#grid)" rx="16" opacity="0.6" />

              {/* Perimeter Boundary Walls */}
              <rect
                x="80"
                y="30"
                width="900"
                height="680"
                fill="none"
                stroke="#334155"
                strokeWidth="4"
                rx="12"
              />

              {/* Hallway Concourse Corridors */}
              {/* Main East-West Concourse */}
              <rect
                x="140"
                y="370"
                width="780"
                height="80"
                fill="#0f172a"
                stroke="#1e293b"
                strokeWidth="1.5"
                rx="8"
              />
              <text x="560" y="415" fill="#475569" fontSize="12" fontWeight="600" textAnchor="middle" letterSpacing="3">
                CENTRAL MAIN CONCOURSE
              </text>

              {/* North-South Central Gallery */}
              <rect
                x="525"
                y="80"
                width="95"
                height="580"
                fill="#0f172a"
                stroke="#1e293b"
                strokeWidth="1.5"
                rx="8"
              />

              {/* Central Concourse Plaza Circle */}
              <circle
                cx="572"
                cy="410"
                r="65"
                fill="#1e293b"
                fillOpacity="0.4"
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <circle cx="572" cy="410" r="8" fill="#38bdf8" fillOpacity="0.8" />
              <text x="572" y="435" fill="#94a3b8" fontSize="10" fontWeight="700" textAnchor="middle">
                CENTRAL HUB
              </text>

              {/* HEATMAP DENSITY LAYER (Radial Glow Circles over Rooms) */}
              {showHeatmap &&
                venueRooms.map((room) => {
                  const layout = ROOM_SVG_LAYOUT[room.id];
                  if (!layout) return null;

                  const centerX = layout.x + layout.w / 2;
                  const centerY = layout.y + layout.h / 2;
                  const pct = Math.round((room.currentOccupancy / room.capacity) * 100);

                  let glowColor = '#10b981'; // Emerald
                  let glowOpacity = 0.25;

                  if (room.congestionStatus === 'congested') {
                    glowColor = '#f43f5e'; // Rose/Red
                    glowOpacity = 0.5;
                  } else if (room.congestionStatus === 'moderate') {
                    glowColor = '#f59e0b'; // Amber
                    glowOpacity = 0.35;
                  }

                  return (
                    <g key={`heat-${room.id}`} pointerEvents="none">
                      <circle
                        cx={centerX}
                        cy={centerY}
                        r={Math.min(layout.w, layout.h) * 0.75}
                        fill={glowColor}
                        opacity={glowOpacity}
                        filter="url(#heatGlow)"
                      />
                      {room.congestionStatus === 'congested' && (
                        <circle
                          cx={centerX}
                          cy={centerY}
                          r={Math.min(layout.w, layout.h) * 0.85}
                          fill="none"
                          stroke="#f43f5e"
                          strokeWidth="2"
                          strokeDasharray="6 6"
                          className="animate-spin"
                          opacity="0.6"
                        />
                      )}
                    </g>
                  );
                })}

              {/* INDOOR ROOMS & HALLS */}
              {venueRooms.map((room) => {
                const layout = ROOM_SVG_LAYOUT[room.id];
                if (!layout) return null;

                const isSelected = selectedRoom?.id === room.id;
                const isUserLoc = userLocation === room.id;
                const isDestination = selectedDestination === room.id;
                const isHovered = hoveredRoomId === room.id;

                const occupancyPct = Math.round((room.currentOccupancy / room.capacity) * 100);

                let statusBorder = '#334155';
                let statusFill = '#111827';
                let badgeColor = '#10b981';

                if (room.congestionStatus === 'congested') {
                  statusBorder = '#f43f5e';
                  badgeColor = '#f43f5e';
                } else if (room.congestionStatus === 'moderate') {
                  statusBorder = '#f59e0b';
                  badgeColor = '#f59e0b';
                }

                if (isSelected) {
                  statusBorder = '#38bdf8';
                  statusFill = '#172554';
                }

                return (
                  <g
                    key={room.id}
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => handleRoomClick(room)}
                    onMouseEnter={() => setHoveredRoomId(room.id)}
                    onMouseLeave={() => setHoveredRoomId(null)}
                  >
                    {/* Room Rectangle Box */}
                    <rect
                      x={layout.x}
                      y={layout.y}
                      width={layout.w}
                      height={layout.h}
                      fill={statusFill}
                      stroke={statusBorder}
                      strokeWidth={isSelected ? 3 : isHovered ? 2.5 : 1.5}
                      rx="10"
                      className="transition-all"
                    />

                    {/* Active Destination or User Location Glow Outline */}
                    {isDestination && (
                      <rect
                        x={layout.x - 4}
                        y={layout.y - 4}
                        width={layout.w + 8}
                        height={layout.h + 8}
                        fill="none"
                        stroke="#ec4899"
                        strokeWidth="2"
                        strokeDasharray="5 5"
                        rx="12"
                      />
                    )}

                    {isUserLoc && (
                      <rect
                        x={layout.x - 4}
                        y={layout.y - 4}
                        width={layout.w + 8}
                        height={layout.h + 8}
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        rx="12"
                      />
                    )}

                    {/* Room Doorway Indicator */}
                    <circle cx={layout.doorX} cy={layout.doorY} r="5" fill="#38bdf8" opacity="0.8" />

                    {/* Room Title & Code */}
                    <text
                      x={layout.x + 14}
                      y={layout.y + 26}
                      fill="#f8fafc"
                      fontSize="13"
                      fontWeight="700"
                    >
                      {room.name.split('(')[0].trim()}
                    </text>
                    <text
                      x={layout.x + 14}
                      y={layout.y + 44}
                      fill="#94a3b8"
                      fontSize="10"
                      fontWeight="500"
                    >
                      {room.code} • {room.building}
                    </text>

                    {/* Capacity & Occupancy Status Bar inside Room */}
                    <rect
                      x={layout.x + 14}
                      y={layout.y + layout.h - 32}
                      width={layout.w - 28}
                      height="6"
                      fill="#1e293b"
                      rx="3"
                    />
                    <rect
                      x={layout.x + 14}
                      y={layout.y + layout.h - 32}
                      width={Math.max(4, ((layout.w - 28) * occupancyPct) / 100)}
                      height="6"
                      fill={badgeColor}
                      rx="3"
                    />

                    {/* Occupancy and Congestion Text */}
                    <text
                      x={layout.x + 14}
                      y={layout.y + layout.h - 14}
                      fill="#cbd5e1"
                      fontSize="10"
                      fontWeight="600"
                    >
                      {occupancyPct}% full ({room.currentOccupancy}/{room.capacity})
                    </text>

                    {/* Congestion Status Pill on top right of room */}
                    <rect
                      x={layout.x + layout.w - 76}
                      y={layout.y + 12}
                      width="66"
                      height="20"
                      fill="#0f172a"
                      stroke={badgeColor}
                      strokeWidth="1"
                      rx="10"
                    />
                    <circle
                      cx={layout.x + layout.w - 66}
                      cy={layout.y + 22}
                      r="3.5"
                      fill={badgeColor}
                    />
                    <text
                      x={layout.x + layout.w - 56}
                      y={layout.y + 25}
                      fill={badgeColor}
                      fontSize="9"
                      fontWeight="700"
                      textAnchor="start"
                      letterSpacing="0.5"
                    >
                      {room.congestionStatus.toUpperCase()}
                    </text>

                    {/* Pin indicators for User Location or Destination */}
                    {isUserLoc && (
                      <g transform={`translate(${layout.x + layout.w / 2 - 12}, ${layout.y + layout.h / 2 - 20})`}>
                        <circle cx="12" cy="12" r="14" fill="#06b6d4" fillOpacity="0.3" className="animate-ping" />
                        <circle cx="12" cy="12" r="10" fill="#06b6d4" />
                        <text x="12" y="16" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                          YOU
                        </text>
                      </g>
                    )}

                    {isDestination && (
                      <g transform={`translate(${layout.x + layout.w - 32}, ${layout.y + layout.h - 52})`}>
                        <circle cx="12" cy="12" r="12" fill="#ec4899" fillOpacity="0.4" className="animate-ping" />
                        <circle cx="12" cy="12" r="8" fill="#ec4899" />
                        <text x="12" y="15" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                          🏁
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* PATHFINDING ROUTE OVERLAY */}
              {activeRoute && (
                <g filter="url(#lineGlow)">
                  {/* Glowing Outline under the path */}
                  <path
                    d={generateRouteSvgPath()}
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="8"
                    strokeOpacity="0.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Primary Animated Dashed Path Line */}
                  <path
                    d={generateRouteSvgPath()}
                    fill="none"
                    stroke="url(#routeGradient)"
                    strokeWidth="4"
                    strokeDasharray="10 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-pulse"
                  />

                  {/* Waypoint Nodes along the path */}
                  {activeRoute.pathCoordinates.map((coord, idx) => (
                    <circle
                      key={`pt-${idx}`}
                      cx={coord.x}
                      cy={coord.y}
                      r={idx === 0 || idx === activeRoute.pathCoordinates.length - 1 ? 6 : 3.5}
                      fill={idx === 0 ? '#06b6d4' : idx === activeRoute.pathCoordinates.length - 1 ? '#ec4899' : '#ffffff'}
                      stroke="#0f172a"
                      strokeWidth="2"
                    />
                  ))}
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Heatmap & Legend Footer Bar */}
        <div className="px-5 py-3 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-slate-300">Live Congestion Legend:</span>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span>Low (&lt;45%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span>Moderate (45-79%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span>Congested (&gt;80%)</span>
            </div>
          </div>

          {activeRoute && (
            <div className="flex items-center gap-2 text-cyan-300 font-semibold">
              <Navigation className="h-4 w-4 text-cyan-400" />
              <span>
                Active Route: {activeRoute.totalDistanceMeters}m (~{activeRoute.estimatedWalkingMinutes} min walk)
              </span>
              <button
                onClick={clearRoute}
                className="ml-2 text-xs text-slate-400 hover:text-white underline"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Side: Selected Room Inspection & Actions HUD */}
      <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
        {selectedRoom ? (
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-lg flex flex-col gap-4">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  {selectedRoom.code} • Floor {selectedRoom.floor}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedRoom.congestionStatus === 'congested'
                      ? 'bg-rose-100 text-rose-700'
                      : selectedRoom.congestionStatus === 'moderate'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {selectedRoom.congestionStatus.toUpperCase()} CROWD
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-2">
                {selectedRoom.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {selectedRoom.description}
              </p>
            </div>

            {/* Live Occupancy Metric */}
            <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-slate-400" />
                  Live Attendance
                </span>
                <span className="text-slate-900 font-bold">
                  {selectedRoom.currentOccupancy} / {selectedRoom.capacity}
                </span>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    selectedRoom.congestionStatus === 'congested'
                      ? 'bg-rose-500'
                      : selectedRoom.congestionStatus === 'moderate'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{
                    width: `${Math.round(
                      (selectedRoom.currentOccupancy / selectedRoom.capacity) * 100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-[10px] text-slate-400 text-right">
                {Math.round((selectedRoom.currentOccupancy / selectedRoom.capacity) * 100)}% Capacity Reached
              </p>
            </div>

            {/* Room Facilities Tags */}
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Venue Facilities
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedRoom.facilities.map((fac, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60"
                  >
                    {fac}
                  </span>
                ))}
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <button
                onClick={() => handleRouteToRoom(selectedRoom.id)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-xs py-2.5 shadow-sm transition"
              >
                <Navigation className="h-4 w-4" />
                <span>Route to this Venue</span>
              </button>

              <button
                onClick={() => handleSetCurrentLocation(selectedRoom.id)}
                className={`w-full flex items-center justify-center gap-2 rounded-xl text-xs font-semibold py-2 border transition ${
                  userLocation === selectedRoom.id
                    ? 'bg-cyan-50 border-cyan-300 text-cyan-800'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <MapPin className="h-3.5 w-3.5 text-teal-600" />
                <span>
                  {userLocation === selectedRoom.id ? '✓ Your Current Location' : 'Set as My Current Location'}
                </span>
              </button>
            </div>

            {/* Active / Upcoming Sessions in this Room */}
            <div className="border-t border-slate-100 pt-3">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Sessions in this Room ({roomSessions.length})
              </p>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {roomSessions.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No scheduled talks currently.</p>
                ) : (
                  roomSessions.map((sess) => (
                    <div
                      key={sess.id}
                      className="p-2 rounded-lg bg-slate-50 border border-slate-200/70 text-left text-xs"
                    >
                      <div className="flex items-center justify-between text-[10px] text-teal-700 font-bold">
                        <span>{sess.startTime} - {sess.endTime}</span>
                        <span className="capitalize">{sess.track}</span>
                      </div>
                      <p className="font-bold text-slate-900 mt-1 line-clamp-1">{sess.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {sess.speaker.name} • {sess.speaker.company}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-white border border-slate-200 p-6 text-center text-slate-400 text-xs">
            <Info className="h-8 w-8 mx-auto text-slate-300 mb-2" />
            Click on any room on the floor plan to inspect crowd status and calculate navigation routes.
          </div>
        )}
      </div>
    </div>
  );
};
