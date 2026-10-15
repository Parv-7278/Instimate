'use client';

import React from 'react';
import { useEventRoute } from '@/lib/eventroute/eventRouteContext';
import { ItinerarySlot } from '@/types/eventroute';
import {
  Sparkles,
  Calendar,
  Clock,
  Footprints,
  Coffee,
  CheckCircle2,
  Trash2,
  Navigation,
  Download,
  Share2,
  AlertCircle,
  MapPin,
  Tag,
  Flame,
} from 'lucide-react';

interface ItineraryTimelineProps {
  onNavigateToVenue?: (venueId: string) => void;
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({
  onNavigateToVenue,
}) => {
  const {
    itinerary,
    isGeneratingItinerary,
    setIsPlannerModalOpen,
    removeItinerarySlot,
    triggerQuickNavigation,
    preferences,
  } = useEventRoute();

  if (!itinerary || itinerary.slots.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-slate-200 p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 mb-4">
          <Sparkles className="h-7 w-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900">No Generated Itinerary Yet</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
          Tell us your favorite topics and pacing, and the EventRoute engine will automatically organize your personalized schedule.
        </p>
        <button
          onClick={() => setIsPlannerModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-2.5 shadow-sm transition"
        >
          <Sparkles className="h-4 w-4" />
          <span>Launch AI Itinerary Planner</span>
        </button>
      </div>
    );
  }

  const handleExportICS = () => {
    // Generate simple calendar .ics export
    let icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//EventRoute//Universal Itinerary//EN\n`;
    itinerary.slots
      .filter((s) => s.type === 'session' && s.session)
      .forEach((slot) => {
        const sess = slot.session!;
        icsContent += `BEGIN:VEVENT\nSUMMARY:${sess.title}\nDESCRIPTION:${sess.description}\\nSpeaker: ${sess.speaker.name}\nLOCATION:${sess.venueName}\nEND:VEVENT\n`;
      });
    icsContent += `END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'EventRoute-Itinerary.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats Bar */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-[#0d4f5c] to-slate-900 p-5 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[11px] font-bold text-cyan-200 uppercase tracking-wider font-mono">
              AI Optimized Schedule
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">Your Personalized Event Timeline</h2>
          <p className="text-xs text-slate-300">
            {preferences.timeAvailability.replace('_', ' ').toUpperCase()} •{' '}
            {preferences.pace.toUpperCase()} PACE • {preferences.experienceLevel.toUpperCase()} LEVEL
          </p>
        </div>

        {/* Quick Summary Pill Stats */}
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white/10 backdrop-blur-md px-3.5 py-2 border border-white/15 text-center">
            <span className="text-[10px] text-teal-200 uppercase font-semibold">Sessions</span>
            <p className="text-base font-bold text-white">{itinerary.totalSessions}</p>
          </div>

          <div className="rounded-xl bg-white/10 backdrop-blur-md px-3.5 py-2 border border-white/15 text-center">
            <span className="text-[10px] text-teal-200 uppercase font-semibold">Walking</span>
            <p className="text-base font-bold text-cyan-300">{itinerary.totalWalkingMeters}m</p>
          </div>

          <div className="rounded-xl bg-white/10 backdrop-blur-md px-3.5 py-2 border border-white/15 text-center">
            <span className="text-[10px] text-teal-200 uppercase font-semibold">Conflicts Resolved</span>
            <p className="text-base font-bold text-emerald-300">{itinerary.conflictsResolvedCount}</p>
          </div>

          <button
            onClick={() => setIsPlannerModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 px-3.5 py-2 text-xs font-bold shadow transition"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Customize</span>
          </button>

          <button
            onClick={handleExportICS}
            className="flex items-center gap-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white px-3 py-2 text-xs font-semibold border border-white/20 transition"
            title="Download Calendar .ICS file"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export .ICS</span>
          </button>
        </div>
      </div>

      {/* Vertical Timeline List */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {itinerary.slots.map((slot) => {
          if (slot.type === 'transition') {
            return (
              <div key={slot.id} className="relative animate-in fade-in">
                {/* Timeline Node Dot */}
                <span className="absolute -left-6 sm:-left-8 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-cyan-100 text-cyan-700 ring-4 ring-white border border-cyan-300">
                  <Footprints className="h-3 w-3" />
                </span>

                <div className="rounded-xl bg-cyan-50/60 border border-cyan-200/60 px-4 py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 text-cyan-900">
                    <span className="font-bold">{slot.startTime}</span>
                    <span className="text-cyan-400">•</span>
                    <span className="font-medium text-cyan-800">{slot.title}</span>
                    <span className="text-[11px] text-cyan-600">
                      (~{slot.distanceMeters}m, {slot.transitionTimeMinutes} min walk)
                    </span>
                  </div>

                  {slot.venueId && (
                    <button
                      onClick={() => {
                        triggerQuickNavigation(slot.venueId!);
                        if (onNavigateToVenue) onNavigateToVenue(slot.venueId!);
                      }}
                      className="flex items-center gap-1 text-[11px] font-bold text-cyan-700 hover:text-cyan-900 bg-white/80 px-2.5 py-1 rounded-lg border border-cyan-200 shadow-2xs transition"
                    >
                      <Navigation className="h-3 w-3" />
                      <span>View Route on Map</span>
                    </button>
                  )}
                </div>
              </div>
            );
          }

          if (slot.type === 'break') {
            return (
              <div key={slot.id} className="relative animate-in fade-in">
                {/* Timeline Node Dot */}
                <span className="absolute -left-6 sm:-left-8 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-700 ring-4 ring-white border border-amber-300">
                  <Coffee className="h-3 w-3" />
                </span>

                <div className="rounded-xl bg-amber-50/70 border border-amber-200/80 p-4 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-900">{slot.startTime} - {slot.endTime}</span>
                      <span className="font-semibold text-amber-800">{slot.title}</span>
                    </div>
                    {slot.venueName && (
                      <span className="text-[11px] font-medium text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
                        {slot.venueName}
                      </span>
                    )}
                  </div>
                  {slot.notes && (
                    <p className="text-[11px] text-amber-700/90 mt-1 leading-snug">{slot.notes}</p>
                  )}
                </div>
              </div>
            );
          }

          // Regular Session Slot
          const sess = slot.session;
          if (!sess) return null;

          return (
            <div key={slot.id} className="relative animate-in fade-in">
              {/* Timeline Node Dot */}
              <span className="absolute -left-6 sm:-left-8 top-5 flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-white ring-4 ring-white shadow-xs">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </span>

              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                        {slot.startTime} – {slot.endTime} ({sess.durationMinutes} min)
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {sess.track}
                      </span>
                      <span className="text-[10px] font-semibold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200 capitalize">
                        {sess.experienceLevel} Level
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug pt-0.5">
                      {sess.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {sess.description}
                    </p>

                    {/* Speaker & Venue Pill */}
                    <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        {sess.speaker.avatarUrl ? (
                          <img
                            src={sess.speaker.avatarUrl}
                            alt={sess.speaker.name}
                            className="h-6 w-6 rounded-full object-cover ring-1 ring-slate-200"
                          />
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-slate-200" />
                        )}
                        <span className="font-semibold text-slate-800">{sess.speaker.name}</span>
                        <span className="text-slate-400">({sess.speaker.company})</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-teal-800 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-teal-600" />
                        <span>{sess.venueName}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {sess.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Side Actions */}
                  <div className="flex sm:flex-col items-center gap-2 shrink-0 pt-2 sm:pt-0">
                    <button
                      onClick={() => {
                        triggerQuickNavigation(sess.venueId);
                        if (onNavigateToVenue) onNavigateToVenue(sess.venueId);
                      }}
                      className="flex items-center gap-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 px-3 py-1.5 text-xs font-bold border border-teal-200 transition"
                    >
                      <Navigation className="h-3.5 w-3.5 text-teal-600" />
                      <span>Navigate Here</span>
                    </button>

                    <button
                      onClick={() => removeItinerarySlot(slot.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition rounded-lg hover:bg-rose-50"
                      title="Remove from my itinerary"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
