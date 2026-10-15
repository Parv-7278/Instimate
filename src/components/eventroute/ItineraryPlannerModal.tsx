'use client';

import React, { useState } from 'react';
import { useEventRoute } from '@/lib/eventroute/eventRouteContext';
import {
  EventCategory,
  ExperienceLevel,
  PacePreference,
  TimeAvailability,
  UserItineraryPreferences,
} from '@/types/eventroute';
import {
  Sparkles,
  X,
  Code,
  Gamepad2,
  Music,
  TrendingUp,
  Wrench,
  Shield,
  Palette,
  Bot,
  Clock,
  Compass,
  CheckCircle2,
  Zap,
  Coffee,
  Flame,
  ArrowRight,
  ArrowLeft,
  Calendar,
} from 'lucide-react';

const CATEGORIES_CONFIG: {
  id: EventCategory;
  label: string;
  desc: string;
  icon: React.ElementType;
  badgeColor: string;
}[] = [
  {
    id: 'coding',
    label: 'Coding & AI Engineering',
    desc: 'Autonomous agents, Rust, LLM fine-tuning, system architecture',
    icon: Code,
    badgeColor: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-700',
  },
  {
    id: 'gaming',
    label: 'Gaming & XR Domes',
    desc: 'Unreal Engine 5.5, Vision Pro, WebXR, spatial graphics',
    icon: Gamepad2,
    badgeColor: 'border-purple-500/30 bg-purple-500/10 text-purple-700',
  },
  {
    id: 'music',
    label: 'Music & Audio Tech',
    desc: 'Algorithmic beats, modular synthesis, live coding sound',
    icon: Music,
    badgeColor: 'border-pink-500/30 bg-pink-500/10 text-pink-700',
  },
  {
    id: 'entrepreneurship',
    label: 'Entrepreneurship & VC',
    desc: 'Founder war stories, pitch deck roasts, VC speed dating',
    icon: TrendingUp,
    badgeColor: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700',
  },
  {
    id: 'workshops',
    label: 'Hands-on Workshops',
    desc: 'Interactive laptop-ready labs, hackathons, live coding',
    icon: Wrench,
    badgeColor: 'border-amber-500/30 bg-amber-500/10 text-amber-700',
  },
  {
    id: 'security',
    label: 'Cybersecurity & Zero-Day',
    desc: 'Red teaming, exploit synthesis, memory forensics',
    icon: Shield,
    badgeColor: 'border-rose-500/30 bg-rose-500/10 text-rose-700',
  },
  {
    id: 'design',
    label: 'Spatial UI & UX Design',
    desc: 'Holographic interfaces, gesture ergonomics, micro-interactions',
    icon: Palette,
    badgeColor: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-700',
  },
  {
    id: 'robotics',
    label: 'Physical AI & Robotics',
    desc: 'Humanoid balance control, edge neuromorphic silicon',
    icon: Bot,
    badgeColor: 'border-teal-500/30 bg-teal-500/10 text-teal-700',
  },
];

export const ItineraryPlannerModal: React.FC = () => {
  const {
    isPlannerModalOpen,
    setIsPlannerModalOpen,
    preferences,
    updatePreferences,
    generateItinerary,
    isGeneratingItinerary,
  } = useEventRoute();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form draft state
  const [selectedInterests, setSelectedInterests] = useState<EventCategory[]>(preferences.interests);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(preferences.experienceLevel);
  const [pace, setPace] = useState<PacePreference>(preferences.pace);
  const [timeAvailability, setTimeAvailability] = useState<TimeAvailability>(preferences.timeAvailability);
  const [avoidCrowds, setAvoidCrowds] = useState<boolean>(preferences.avoidCrowds);

  if (!isPlannerModalOpen) return null;

  const toggleInterest = (cat: EventCategory) => {
    setSelectedInterests((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleCompleteAndGenerate = async () => {
    const finalPrefs: UserItineraryPreferences = {
      interests: selectedInterests.length > 0 ? selectedInterests : ['coding', 'workshops'],
      experienceLevel,
      pace,
      timeAvailability,
      preferredVenues: preferences.preferredVenues,
      avoidCrowds,
    };

    updatePreferences(finalPrefs);
    setStep(4); // Show AI generation pulse screen
    await generateItinerary(finalPrefs);

    setTimeout(() => {
      setIsPlannerModalOpen(false);
      setStep(1);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white text-slate-900 shadow-2xl ring-1 ring-slate-200 border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Top Gradient Header */}
        <div className="bg-gradient-to-r from-teal-700 via-cyan-700 to-indigo-800 px-6 py-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md border border-white/20 shadow-inner">
              <Sparkles className="h-6 w-6 text-cyan-200 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">EventRoute AI Planner</h2>
                <span className="rounded-full bg-cyan-400/20 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-200 border border-cyan-400/30">
                  Smart Itinerary
                </span>
              </div>
              <p className="text-xs text-teal-100/90 mt-0.5">
                Generate a personalized, conflict-free schedule optimized with walking routes
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPlannerModalOpen(false)}
            className="rounded-lg p-2 text-white/80 hover:bg-white/15 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                  step === 1 ? 'bg-teal-600 text-white' : 'bg-teal-100 text-teal-800'
                }`}
              >
                1
              </span>
              <span>Interests</span>
            </div>
            <div className="h-0.5 w-10 sm:w-16 bg-slate-200" />

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                  step === 2 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                2
              </span>
              <span>Skill & Track</span>
            </div>
            <div className="h-0.5 w-10 sm:w-16 bg-slate-200" />

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                  step === 3 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                3
              </span>
              <span>Pace & Route</span>
            </div>
            <div className="h-0.5 w-10 sm:w-16 bg-slate-200" />

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                  step === 4 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                4
              </span>
              <span>Generate</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* STEP 1: Core Interests */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  What topics and disciplines are you most excited about?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Select at least one track. The AI engine uses these to curate keynotes, workshops, and booth demos.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {CATEGORIES_CONFIG.map((cat) => {
                  const isSelected = selectedInterests.includes(cat.id);
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleInterest(cat.id)}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all duration-150 ${
                        isSelected
                          ? 'border-teal-500 bg-teal-50/70 shadow-sm ring-1 ring-teal-500/20'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 bg-white'
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition ${
                          isSelected
                            ? 'bg-teal-600 text-white border-teal-600'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold text-slate-900">{cat.label}</p>
                          {isSelected && (
                            <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                          {cat.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedInterests.length === 0 && (
                <p className="text-xs text-rose-500 font-medium">
                  Please pick at least one interest to proceed.
                </p>
              )}
            </div>
          )}

          {/* STEP 2: Experience Level */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Select your technical depth & experience level
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  We'll match you with talks that match your background so you never get lost or bored.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {
                    id: 'beginner',
                    title: 'Foundational & Curious',
                    desc: 'Beginner-friendly introductions, high-level overviews, and creative primers.',
                    badge: 'No prerequisite needed',
                  },
                  {
                    id: 'intermediate',
                    title: 'Practitioner & Builder',
                    desc: 'Working knowledge of code/frameworks. Deep architectural breakdowns and hands-on labs.',
                    badge: 'Recommended',
                  },
                  {
                    id: 'advanced',
                    title: 'Specialist & Hardcore',
                    desc: 'Zero-day research, high-frequency systems, low-level compilers, and kernel tuning.',
                    badge: 'Expert Level',
                  },
                  {
                    id: 'all',
                    title: 'Universal Track Mix',
                    desc: 'A vibrant cross-section of foundational keynotes and deep technical workshops.',
                    badge: 'Diverse Blend',
                  },
                ].map((lvl) => {
                  const isSelected = experienceLevel === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setExperienceLevel(lvl.id as ExperienceLevel)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-teal-500 bg-teal-50/70 shadow-sm ring-1 ring-teal-500/20'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{lvl.title}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {lvl.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1.5">{lvl.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Pace & Availability */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  How would you like to pace your day?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Our scheduler will automatically inject lunch, coffee, and transit walking buffers between sessions.
                </p>
              </div>

              {/* Pace Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Daily Rhythm & Pace
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'relaxed',
                      label: 'Relaxed & Social',
                      desc: '45m networking buffers, chill coffee breaks, no rushing.',
                      icon: Coffee,
                    },
                    {
                      id: 'balanced',
                      label: 'Balanced Rhythm',
                      desc: 'Optimal 20m transit buffer, dedicated lunch, steady flow.',
                      icon: Zap,
                    },
                    {
                      id: 'intensive',
                      label: 'Intensive Marathon',
                      desc: 'Packed schedule, rapid-fire sessions, maximal knowledge.',
                      icon: Flame,
                    },
                  ].map((p) => {
                    const isSelected = pace === p.id;
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPace(p.id as PacePreference)}
                        className={`p-3.5 rounded-xl border text-left transition ${
                          isSelected
                            ? 'border-teal-500 bg-teal-50/70 shadow-sm ring-1 ring-teal-500/20'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`h-4 w-4 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`} />
                          <span className="text-xs font-bold text-slate-900">{p.label}</span>
                        </div>
                        <p className="text-[11px] text-slate-500">{p.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Availability */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Time Availability
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'full_day', label: 'Full Day (09:00 - 18:30)' },
                    { id: 'morning', label: 'Morning Only (Until 13:00)' },
                    { id: 'afternoon', label: 'Afternoon Only (From 13:00)' },
                  ].map((t) => {
                    const isSelected = timeAvailability === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTimeAvailability(t.id as TimeAvailability)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                          isSelected
                            ? 'border-teal-500 bg-teal-50/70 text-teal-900'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Crowd avoidance toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
                    <Compass className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Avoid Congested Corridors & Halls</p>
                    <p className="text-[11px] text-slate-500">
                      Route pathfinder will prioritize quieter side concourses when foot-traffic exceeds 80%.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={avoidCrowds}
                  onChange={(e) => setAvoidCrowds(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Generating Screen */}
          {step === 4 && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 animate-spin">
                  <Sparkles className="h-8 w-8" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-teal-500/30 border-t-teal-600 animate-spin" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Synthesizing Personalized Schedule...
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Filtering 14 sessions across 8 halls, computing indoor walking distances, and guaranteeing zero conflicts.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-teal-700 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-200">
                <span>✓ Resolving room transit buffers</span>
                <span>•</span>
                <span>✓ Embedding floor plan waypoints</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {step < 4 && (
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200/70 rounded-lg transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                disabled={step === 1 && selectedInterests.length === 0}
                onClick={() => setStep((s) => (s + 1) as 2 | 3)}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-sm transition"
              >
                <span>Continue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCompleteAndGenerate}
                disabled={isGeneratingItinerary}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 rounded-lg shadow-md hover:shadow transition"
              >
                <Sparkles className="h-4 w-4" />
                <span>Generate Itinerary Now</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
