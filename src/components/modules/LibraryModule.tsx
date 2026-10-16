'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/storeContext';
import { LibraryBook } from '@/types';
import { handleHorizontalWheel } from '@/lib/utils';
import {
  BookMarked,
  Search,
  Plus,
  CheckCircle2,
  BookOpen,
  ArrowRightLeft,
  X,
} from 'lucide-react';

export const LibraryModule: React.FC = () => {
  const { libraryBooks, issueBook, returnBook } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = libraryBooks.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.isbn.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Central Library Catalog & Book Issues
            </h1>
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 border border-teal-200">
              Circulation Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Search physical books, track available copies, manage student checkouts and return overdue items.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="max-w-md relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by book title, author, ISBN, or subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
        />
      </div>

      {/* Books Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div onWheel={handleHorizontalWheel} className="overflow-x-auto scroll-touch">
          <table className="w-full min-w-[650px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Book Title & Author</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">ISBN</th>
                <th className="py-3 px-4">Shelf Location</th>
                <th className="py-3 px-4">Copies (Avail / Total)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Circulation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBooks.map((bk) => (
                <tr key={bk.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{bk.title}</p>
                    <p className="text-[11px] text-slate-500">By {bk.author}</p>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">{bk.category}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{bk.isbn}</td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{bk.location}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">
                    {bk.availableCopies} / {bk.totalCopies}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        bk.availableCopies > 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {bk.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => issueBook(bk.id)}
                        disabled={bk.availableCopies === 0}
                        className="rounded-lg bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white px-2.5 py-1 text-xs font-semibold"
                      >
                        Issue Book
                      </button>
                      <button
                        onClick={() => returnBook(bk.id)}
                        disabled={bk.availableCopies >= bk.totalCopies}
                        className="rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 px-2.5 py-1 text-xs font-semibold"
                      >
                        Return
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
