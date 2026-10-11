'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/storeContext';
import { Announcement } from '@/types';
import {
  Megaphone,
  Pin,
  Plus,
  AlertTriangle,
  Calendar,
  Users,
  Eye,
  Trash2,
  X,
  Sparkles,
} from 'lucide-react';

export const AnnouncementsModule: React.FC = () => {
  const { announcements, addAnnouncement, deleteAnnouncement, currentUser } = useStore();

  const [activeTab, setActiveTab] = useState<'all' | 'institution' | 'class'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    type: 'Institution-wide' as const,
    targetAudience: 'All' as const,
    classId: 'Class 10-A',
    priority: 'Normal' as const,
    isPinned: false,
  });

  const filteredAnnouncements = announcements.filter((a) => {
    if (activeTab === 'institution') return a.type === 'Institution-wide';
    if (activeTab === 'class') return a.type === 'Class-specific';
    return true;
  });

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.content) return;

    addAnnouncement({
      ...newNotice,
      authorName: currentUser.fullName,
      authorRole: currentUser.role.replace('_', ' ').toUpperCase(),
    });

    setIsCreateModalOpen(false);
    setNewNotice({
      title: '',
      content: '',
      type: 'Institution-wide',
      targetAudience: 'All',
      classId: 'Class 10-A',
      priority: 'Normal',
      isPinned: false,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Campus Announcements & Digital Notice Board
            </h1>
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 border border-teal-200">
              Audience Targeted
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Broadcast emergency alerts, term examination schedules, fee reminders, and class notices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0d6474] to-[#127d91] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-95 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Broadcast Notice</span>
          </button>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg transition ${
            activeTab === 'all'
              ? 'bg-teal-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Notices ({announcements.length})
        </button>
        <button
          onClick={() => setActiveTab('institution')}
          className={`px-3 py-1.5 rounded-lg transition ${
            activeTab === 'institution'
              ? 'bg-teal-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Institution-Wide
        </button>
        <button
          onClick={() => setActiveTab('class')}
          className={`px-3 py-1.5 rounded-lg transition ${
            activeTab === 'class'
              ? 'bg-teal-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Class-Specific
        </button>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((anc) => (
          <div
            key={anc.id}
            className={`rounded-2xl border p-5 transition bg-white shadow-sm ${
              anc.isPinned ? 'border-amber-300 ring-1 ring-amber-100' : 'border-slate-200/80'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                {anc.isPinned && (
                  <Pin className="h-4.5 w-4.5 text-amber-500 fill-amber-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900">{anc.title}</h3>
                    <span
                      className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${
                        anc.priority === 'High'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {anc.priority} Priority
                    </span>
                    <span className="rounded bg-teal-50 text-teal-800 border border-teal-200 px-1.5 py-0.2 text-[9px] font-medium">
                      Audience: {anc.targetAudience}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    By {anc.authorName} ({anc.authorRole}) • {anc.publishedAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" /> {anc.readCount} views
                </span>
                <button
                  onClick={() => deleteAnnouncement(anc.id)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                  title="Delete notice"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-700 leading-relaxed pl-7">
              {anc.content}
            </p>
          </div>
        ))}
      </div>

      {/* Broadcast Notice Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl relative">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Broadcast Campus Notice
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Send notifications to students, parents, faculty, or specific class sections.
            </p>

            <form onSubmit={handleCreateNotice} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Notice Headline</label>
                <input
                  type="text"
                  required
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  placeholder="e.g. Schedule for Annual Sports Fest 2026"
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Broadcast Type</label>
                  <select
                    value={newNotice.type}
                    onChange={(e: any) => setNewNotice({ ...newNotice, type: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  >
                    <option value="Institution-wide">Institution-wide</option>
                    <option value="Class-specific">Class-specific</option>
                    <option value="Urgent Alert">Urgent Alert</option>
                    <option value="Fee Deadline">Fee Deadline</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Audience</label>
                  <select
                    value={newNotice.targetAudience}
                    onChange={(e: any) => setNewNotice({ ...newNotice, targetAudience: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  >
                    <option value="All">All Campus</option>
                    <option value="Students">Students Only</option>
                    <option value="Faculty">Faculty Only</option>
                    <option value="Parents">Parents Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Announcement Content</label>
                <textarea
                  rows={4}
                  required
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  placeholder="Provide complete event dates, guidelines, or instructions..."
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinCheck"
                  checked={newNotice.isPinned}
                  onChange={(e) => setNewNotice({ ...newNotice, isPinned: e.target.checked })}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="pinCheck" className="text-xs text-slate-700">
                  Pin to top of digital notice board
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 hover:bg-teal-700 px-4 py-2 font-semibold text-white shadow-sm"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
