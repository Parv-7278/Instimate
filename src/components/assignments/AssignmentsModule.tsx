'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/storeContext';
import { Assignment, AssignmentSubmission } from '@/types';
import {
  BookOpen,
  Plus,
  FileCheck,
  Clock,
  CheckCircle2,
  Upload,
  Eye,
  X,
  FileText,
  User,
  Check,
} from 'lucide-react';

export const AssignmentsModule: React.FC = () => {
  const {
    assignments,
    addAssignment,
    submissions,
    submitAssignment,
    gradeSubmission,
    currentUser,
    students,
  } = useStore();

  const [selectedClass, setSelectedClass] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeAssignmentForSubmit, setActiveAssignmentForSubmit] = useState<Assignment | null>(null);
  const [activeSubmissionForGrading, setActiveSubmissionForGrading] = useState<AssignmentSubmission | null>(null);

  // New assignment form
  const [newAsg, setNewAsg] = useState({
    title: '',
    description: '',
    subject: 'Mathematics',
    classId: 'Class 10-A',
    dueDate: '2026-10-25',
    maxMarks: 50,
  });

  // Student submission form
  const [submitContent, setSubmitContent] = useState('');
  const [attachedFileName, setAttachedFileName] = useState('');

  // Grading form
  const [gradingMarks, setGradingMarks] = useState(28);
  const [gradingFeedback, setGradingFeedback] = useState('Well researched and thoroughly explained.');

  const isStudent = currentUser.role === 'student';

  const filteredAssignments = assignments.filter(
    (a) => selectedClass === 'all' || a.classId === selectedClass
  );

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsg.title) return;

    addAssignment({
      ...newAsg,
      facultyId: currentUser.id,
      facultyName: currentUser.fullName,
      assignedDate: new Date().toISOString().substring(0, 10),
      totalStudents: 40,
    });

    setIsCreateModalOpen(false);
    setNewAsg({
      title: '',
      description: '',
      subject: 'Mathematics',
      classId: 'Class 10-A',
      dueDate: '2026-10-25',
      maxMarks: 50,
    });
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssignmentForSubmit || !submitContent) return;

    submitAssignment({
      assignmentId: activeAssignmentForSubmit.id,
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      content: submitContent,
      attachmentName: attachedFileName || `${currentUser.fullName.replace(' ', '_')}_Solution.pdf`,
    });

    setActiveAssignmentForSubmit(null);
    setSubmitContent('');
    setAttachedFileName('');
  };

  const handleGradeSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmissionForGrading) return;

    gradeSubmission(activeSubmissionForGrading.id, gradingMarks, gradingFeedback);
    setActiveSubmissionForGrading(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Assignments & Homework Portal
            </h1>
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 border border-teal-200">
              Digital Submissions
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Post problem sets, track student submission deadlines, and provide rubric-based grades.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isStudent && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0d6474] to-[#127d91] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-95 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Assignment</span>
            </button>
          )}
        </div>
      </div>

      {/* Assignments Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssignments.map((asg) => {
          const userSub = submissions.find(
            (s) => s.assignmentId === asg.id && s.studentId === currentUser.id
          );

          return (
            <div
              key={asg.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm flex flex-col justify-between hover:border-teal-300 transition"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-md bg-teal-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-800 border border-teal-200">
                    {asg.subject}
                  </span>
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Due {asg.dueDate}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 mt-2.5 leading-snug">
                  {asg.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-3">
                  {asg.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Class: {asg.classId}</span>
                  <span className="font-semibold text-slate-700">Max Marks: {asg.maxMarks}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {asg.submissionCount} submitted
                </span>

                {userSub ? (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {userSub.status === 'Graded' ? `Graded (${userSub.marksObtained}/${asg.maxMarks})` : 'Submitted'}
                  </span>
                ) : (
                  <button
                    onClick={() => setActiveAssignmentForSubmit(asg)}
                    className="rounded-lg bg-teal-600 hover:bg-teal-700 px-3 py-1.5 text-xs font-bold text-white shadow-2xs transition"
                  >
                    Submit Work
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submissions & Grading Queue Section */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden mt-6">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="h-4.5 w-4.5 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-800">
              Student Submissions & Evaluation Queue
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            {submissions.length} Total Submissions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Submitted At</th>
                <th className="py-3 px-4">Work / File</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Feedback</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-4 font-bold text-slate-800">
                    {sub.studentName}
                  </td>
                  <td className="py-3 px-4 text-slate-500">{sub.submissionDate}</td>
                  <td className="py-3 px-4">
                    <p className="text-slate-800 line-clamp-1">{sub.content}</p>
                    {sub.attachmentName && (
                      <span className="text-[10px] text-teal-700 font-medium">
                        📎 {sub.attachmentName}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        sub.status === 'Graded'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-teal-700">
                    {sub.marksObtained !== undefined ? `${sub.marksObtained} pts` : '-'}
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">
                    {sub.feedback || '-'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {!isStudent && (
                      <button
                        onClick={() => {
                          setActiveSubmissionForGrading(sub);
                          setGradingMarks(sub.marksObtained || 28);
                          setGradingFeedback(sub.feedback || '');
                        }}
                        className="rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 px-2.5 py-1 text-xs font-semibold"
                      >
                        {sub.status === 'Graded' ? 'Edit Grade' : 'Grade'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Submission Modal */}
      {activeAssignmentForSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl relative">
            <button
              onClick={() => setActiveAssignmentForSubmit(null)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Submit Assignment
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              {activeAssignmentForSubmit.title} ({activeAssignmentForSubmit.subject})
            </p>

            <form onSubmit={handleStudentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Written Response / Explanation
                </label>
                <textarea
                  rows={4}
                  required
                  value={submitContent}
                  onChange={(e) => setSubmitContent(e.target.value)}
                  placeholder="Type your explanation or summary of work done..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Upload Assignment File (PDF / DOC / Image)
                </label>
                <div className="rounded-xl border border-dashed border-slate-200 p-3 text-center bg-slate-50">
                  <Upload className="h-5 w-5 text-teal-600 mx-auto mb-1" />
                  <input
                    type="text"
                    value={attachedFileName}
                    onChange={(e) => setAttachedFileName(e.target.value)}
                    placeholder="e.g. Aarav_Patel_Science_Solution.pdf"
                    className="w-full rounded border border-slate-200 p-1.5 text-xs text-center"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setActiveAssignmentForSubmit(null)}
                  className="rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 hover:bg-teal-700 px-4 py-2 font-semibold text-white shadow-sm"
                >
                  Confirm Submission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Faculty Grading Modal */}
      {activeSubmissionForGrading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl relative">
            <button
              onClick={() => setActiveSubmissionForGrading(null)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Grade Student Submission
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Evaluating: {activeSubmissionForGrading.studentName}
            </p>

            <form onSubmit={handleGradeSubmission} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Marks Obtained (out of 30)
                </label>
                <input
                  type="number"
                  max={30}
                  min={0}
                  required
                  value={gradingMarks}
                  onChange={(e) => setGradingMarks(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Faculty Feedback & Remarks
                </label>
                <textarea
                  rows={3}
                  value={gradingFeedback}
                  onChange={(e) => setGradingFeedback(e.target.value)}
                  placeholder="Constructive feedback for the student..."
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setActiveSubmissionForGrading(null)}
                  className="rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 hover:bg-teal-700 px-4 py-2 font-semibold text-white shadow-sm"
                >
                  Save Grade & Notify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
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
              Publish New Assignment
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Create an academic problem set for your enrolled class.
            </p>

            <form onSubmit={handleCreateAssignment} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={newAsg.title}
                  onChange={(e) => setNewAsg({ ...newAsg, title: e.target.value })}
                  placeholder="e.g. Cellular Respiration and ATP Cycle"
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={newAsg.subject}
                    onChange={(e) => setNewAsg({ ...newAsg, subject: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Target Class</label>
                  <select
                    value={newAsg.classId}
                    onChange={(e) => setNewAsg({ ...newAsg, classId: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  >
                    <option value="Class 10-A">Class 10-A</option>
                    <option value="Class 10-B">Class 10-B</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newAsg.dueDate}
                    onChange={(e) => setNewAsg({ ...newAsg, dueDate: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Max Marks</label>
                  <input
                    type="number"
                    required
                    value={newAsg.maxMarks}
                    onChange={(e) => setNewAsg({ ...newAsg, maxMarks: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Instructions</label>
                <textarea
                  rows={3}
                  value={newAsg.description}
                  onChange={(e) => setNewAsg({ ...newAsg, description: e.target.value })}
                  placeholder="Provide problem numbers and formatting guidelines..."
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                />
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
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
