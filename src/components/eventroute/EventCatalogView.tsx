'use client';

import React, { useState } from 'react';
import { useEventRoute } from '@/lib/eventroute/eventRouteContext';
import { EventCategory, EventSession } from '@/types/eventroute';
import {
  Search,
  Bookmark,
  BookmarkCheck,
  Navigation,
  MapPin,
  Clock,
  Sparkles,
  Users,
  Filter,
} from 'lucide-react';
import { handleHorizontalWheel } from '@/lib/utils';


interface EventCatalogViewProps {
  onNavigateToVenue?: (venueId: string) => void;
}

export const EventCatalogView: React.FC<EventCatalogViewProps> = ({
  onNavigateToVenue,
}) => {
  const {
    sessions,
    bookmarkedSessionIds,
    toggleBookmark,
    triggerQuickNavigation,
    venueRooms,
  } = useEventRoute();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Disciplines' },
    { id: 'coding', label: 'Coding & AI' },
    { id: 'gaming', label: 'Gaming & XR' },
    { id: 'music', label: 'Music & Audio' },
    { id: 'entrepreneurship', label: 'Startups & VC' },
    { id: 'workshops', label: 'Workshops' },
    { id: 'security', label: 'Security' },
    { id: 'robotics', label: 'Robotics' },
  ];

  const filteredSessions = sessions.filter((sess) => {
    const matchesCat = selectedCategory === 'all' || sess.category === selectedCategory;
    const matchesBookmark = !onlyBookmarked || bookmarkedSessionIds.includes(sess.id);
    const matchesSearch =
      !searchQuery.trim() ||
      sess.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sess.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sess.speaker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sess.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCat && matchesBookmark && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Search & Category Filter Bar */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search talks, speakers, workshops, or tags (e.g. LLM, Rust, Vision Pro)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Filter Badges */}
        <div
          onWheel={handleHorizontalWheel}
          className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none scroll-touch whitespace-nowrap"
        >
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 shrink-0"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => setOnlyBookmarked(!onlyBookmarked)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition shrink-0 ${
              onlyBookmarked
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${onlyBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span>Saved ({bookmarkedSessionIds.length})</span>
          </button>
        </div>
      </div>

      {/* Grid of Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSessions.map((sess) => {
          const isBookmarked = bookmarkedSessionIds.includes(sess.id);
          const room = venueRooms.find((r) => r.id === sess.venueId);

          return (
            <div
              key={sess.id}
              className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200 font-mono">
                      {sess.startTime} - {sess.endTime}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {sess.track}
                    </span>
                    {room && (
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          room.congestionStatus === 'congested'
                            ? 'bg-rose-100 text-rose-700'
                            : room.congestionStatus === 'moderate'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {room.congestionStatus} CROWD
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => toggleBookmark(sess.id)}
                    className="p-1.5 text-slate-400 hover:text-amber-500 transition rounded-lg hover:bg-amber-50"
                    title={isBookmarked ? 'Remove bookmark' : 'Bookmark this talk'}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="h-5 w-5 text-amber-500 fill-amber-500" />
                    ) : (
                      <Bookmark className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {sess.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {sess.description}
                </p>

                {/* Speaker info */}
                <div className="flex items-center gap-2.5 pt-2">
                  {sess.speaker.avatarUrl ? (
                    <img
                      src={sess.speaker.avatarUrl}
                      alt={sess.speaker.name}
                      className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-200"
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-slate-200" />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{sess.speaker.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {sess.speaker.role} • {sess.speaker.company}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
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

              {/* Bottom Footer Actions */}
              <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 font-medium truncate">
                  <MapPin className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                  <span className="truncate">{sess.venueName}</span>
                </div>

                <button
                  onClick={() => {
                    triggerQuickNavigation(sess.venueId);
                    if (onNavigateToVenue) onNavigateToVenue(sess.venueId);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold border border-teal-200 transition shrink-0"
                >
                  <Navigation className="h-3.5 w-3.5 text-teal-600" />
                  <span>Route to Room</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
