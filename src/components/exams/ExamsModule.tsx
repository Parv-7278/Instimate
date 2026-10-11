'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/storeContext';
import { StudentExamResult } from '@/types';
import {
  FileSpreadsheet,
  Award,
  Download,
  Printer,
  CheckCircle2,
  AlertCircle,
  Plus,
  Eye,
  TrendingUp,
  X,
  FileCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export const ExamsModule: React.FC = () => {
  const {
    examinations,
    examResults,
    publishExamResults,
    addExamResult,
    students,
    currentUser,
  } = useStore();

  const [selectedExamId, setSelectedExamId] = useState(examinations[0]?.id || '');
  const [selectedResult, setSelectedResult] = useState<StudentExamResult | null>(null);
  const [isEnterMarksModalOpen, setIsEnterMarksModalOpen] = useState(false);

  const selectedExam = examinations.find((e) => e.id === selectedExamId) || examinations[0];
  const examResultsList = examResults.filter((r) => r.examId === selectedExam?.id);

  // Stats matching mockup: Average 78%, Pass 86%, Failed 12%
  const avgScore = 78;
  const passRate = 86;
  const failRate = 12;

  const subjectChartData = [
    { subject: 'Math', avgMarks: 82 },
    { subject: 'Science', avgMarks: 76 },
    { subject: 'History', avgMarks: 74 },
    { subject: 'English', avgMarks: 85 },
    { subject: 'Biology', avgMarks: 88 },
  ];

  // Mark entry form state
  const [markForm, setMarkForm] = useState({
    studentId: 'stu-4',
    math: 85,
    science: 80,
    history: 78,
    english: 82,
    biology: 89,
  });

  const handleSaveMarks = (e: React.FormEvent) => {
    e.preventDefault();
    const stu = students.find((s) => s.id === markForm.studentId);
    if (!stu || !selectedExam) return;

    const subjects = [
      { subject: 'Math', maxMarks: 100, marksObtained: markForm.math, grade: markForm.math >= 90 ? 'A+' : markForm.math >= 80 ? 'A' : 'B' },
      { subject: 'Science', maxMarks: 100, marksObtained: markForm.science, grade: markForm.science >= 90 ? 'A+' : markForm.science >= 80 ? 'A' : 'B' },
      { subject: 'History', maxMarks: 100, marksObtained: markForm.history, grade: markForm.history >= 90 ? 'A+' : markForm.history >= 80 ? 'A' : 'B' },
      { subject: 'English', maxMarks: 100, marksObtained: markForm.english, grade: markForm.english >= 90 ? 'A+' : markForm.english >= 80 ? 'A' : 'B' },
      { subject: 'Biology', maxMarks: 100, marksObtained: markForm.biology, grade: markForm.biology >= 90 ? 'A+' : markForm.biology >= 80 ? 'A' : 'B' },
    ];

    const totalMarks = subjects.reduce((acc, s) => acc + s.marksObtained, 0);
    const maxTotalMarks = 500;
    const percentage = Number(((totalMarks / maxTotalMarks) * 100).toFixed(1));
    const cgpa = Number((percentage / 9.5).toFixed(1));

    addExamResult({
      examId: selectedExam.id,
      examTitle: selectedExam.title,
      studentId: stu.id,
      studentName: stu.fullName,
      rollNo: stu.rollNo,
      classId: stu.classId,
      subjectResults: subjects,
      totalMarks,
      maxTotalMarks,
      percentage,
      cgpa,
      overallGrade: percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B+' : 'B',
      status: 'Published',
      publishDate: new Date().toISOString().substring(0, 10),
      rank: examResultsList.length + 1,
    });

    setIsEnterMarksModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Academic Examinations & Report Cards
            </h1>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
              GPA / CGPA Computed
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Administer examination schedules, enter subject marks, compute grades, and generate verified report cards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedExam && selectedExam.status !== 'Published' && (
            <button
              onClick={() => publishExamResults(selectedExam.id)}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Publish Verified Results</span>
            </button>
          )}

          <button
            onClick={() => setIsEnterMarksModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0d6474] to-[#127d91] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-95 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Enter Student Marks</span>
          </button>
        </div>
      </div>

      {/* Overview Analytics Bar Row matching mockup */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-400">Class Cohort Average</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{avgScore}%</p>
          <div className="h-1.5 w-full bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div style={{ width: `${avgScore}%` }} className="h-full bg-teal-600" />
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 shadow-sm">
          <p className="text-xs font-medium text-emerald-800">Pass Rate (Pass Criteria Met)</p>
          <p className="text-2xl font-extrabold text-emerald-950 mt-1">{passRate}%</p>
          <div className="h-1.5 w-full bg-emerald-200 rounded-full mt-3 overflow-hidden">
            <div style={{ width: `${passRate}%` }} className="h-full bg-emerald-600" />
          </div>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-5 shadow-sm">
          <p className="text-xs font-medium text-rose-800">Failed / Remedial Needed</p>
          <p className="text-2xl font-extrabold text-rose-950 mt-1">{failRate}%</p>
          <div className="h-1.5 w-full bg-rose-200 rounded-full mt-3 overflow-hidden">
            <div style={{ width: `${failRate}%` }} className="h-full bg-rose-500" />
          </div>
        </div>
      </div>

      {/* Results Matrix Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-4.5 w-4.5 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-800">
              Exam Ledger: {selectedExam?.title}
            </h2>
          </div>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              selectedExam?.status === 'Published'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            Status: {selectedExam?.status}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Roll & Student</th>
                <th className="py-3 px-4">Math</th>
                <th className="py-3 px-4">Science</th>
                <th className="py-3 px-4">History</th>
                <th className="py-3 px-4">English</th>
                <th className="py-3 px-4">Biology</th>
                <th className="py-3 px-4">Total Marks</th>
                <th className="py-3 px-4">Percentage</th>
                <th className="py-3 px-4">CGPA</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4 text-right">Report Card</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {examResultsList.map((res) => {
                const mathScore = res.subjectResults.find((s) => s.subject === 'Math')?.marksObtained || '-';
                const sciScore = res.subjectResults.find((s) => s.subject === 'Science')?.marksObtained || '-';
                const histScore = res.subjectResults.find((s) => s.subject === 'History')?.marksObtained || '-';
                const engScore = res.subjectResults.find((s) => s.subject === 'English')?.marksObtained || '-';
                const bioScore = res.subjectResults.find((s) => s.subject === 'Biology')?.marksObtained || '-';

                return (
                  <tr key={res.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4 font-bold text-slate-700">
                      #{res.rank || '-'}
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{res.studentName}</p>
                      <p className="text-[10px] text-slate-400">Roll #{res.rollNo}</p>
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-700">{mathScore}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{sciScore}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{histScore}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{engScore}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{bioScore}</td>

                    <td className="py-3 px-4 font-bold text-slate-900">
                      {res.totalMarks} / {res.maxTotalMarks}
                    </td>

                    <td className="py-3 px-4 font-extrabold text-teal-700">
                      {res.percentage}%
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {res.cgpa}
                    </td>

                    <td className="py-3 px-4">
                      <span className="rounded bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-800 border border-teal-200">
                        {res.overallGrade}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedResult(res)}
                        className="rounded-lg bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 transition inline-flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        <span>View Card</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Report Card Printable Modal */}
      {selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto printable-area">
            <button
              onClick={() => setSelectedResult(null)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 no-print"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Institutional Header */}
            <div className="text-center pb-4 border-b-2 border-slate-800">
              <h2 className="text-lg font-black uppercase tracking-wider text-slate-900">
                Apex International Academy
              </h2>
              <p className="text-xs text-slate-500">
                Knowledge Park Boulevard, New Delhi • Affiliated Academic Board
              </p>
              <h3 className="mt-2 text-sm font-extrabold text-teal-800 uppercase tracking-widest bg-teal-50 py-1 inline-block px-4 rounded-full border border-teal-200">
                Official Cumulative Academic Progress Report
              </h3>
            </div>

            {/* Student Info Box */}
            <div className="grid grid-cols-2 gap-4 text-xs py-4 border-b border-slate-200">
              <div>
                <p><span className="text-slate-400">Student Name:</span> <strong className="text-slate-800">{selectedResult.studentName}</strong></p>
                <p><span className="text-slate-400">Roll Number:</span> <strong>#{selectedResult.rollNo}</strong></p>
                <p><span className="text-slate-400">Class & Section:</span> <strong>{selectedResult.classId}</strong></p>
              </div>
              <div className="text-right">
                <p><span className="text-slate-400">Examination:</span> <strong>{selectedResult.examTitle}</strong></p>
                <p><span className="text-slate-400">Academic Term:</span> <strong>2024–2025</strong></p>
                <p><span className="text-slate-400">Issued On:</span> <strong>{selectedResult.publishDate}</strong></p>
              </div>
            </div>

            {/* Marks Breakdown Table */}
            <div className="py-4">
              <table className="w-full text-xs text-left border border-slate-300">
                <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                  <tr>
                    <th className="p-2 border-r border-slate-300">Subject</th>
                    <th className="p-2 text-center border-r border-slate-300">Max Marks</th>
                    <th className="p-2 text-center border-r border-slate-300">Marks Obtained</th>
                    <th className="p-2 text-center border-r border-slate-300">Letter Grade</th>
                    <th className="p-2">Performance Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {selectedResult.subjectResults.map((sub) => (
                    <tr key={sub.subject}>
                      <td className="p-2 font-bold text-slate-800 border-r border-slate-200">{sub.subject}</td>
                      <td className="p-2 text-center border-r border-slate-200">{sub.maxMarks}</td>
                      <td className="p-2 text-center font-bold text-slate-900 border-r border-slate-200">{sub.marksObtained}</td>
                      <td className="p-2 text-center font-bold text-teal-700 border-r border-slate-200">{sub.grade}</td>
                      <td className="p-2 text-slate-600">
                        {sub.marksObtained >= 90 ? 'Outstanding proficiency' : sub.marksObtained >= 80 ? 'Very good conceptual grasp' : 'Satisfactory progress'}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold border-t-2 border-slate-300">
                    <td className="p-2 border-r border-slate-300">Total Aggregate</td>
                    <td className="p-2 text-center border-r border-slate-300">{selectedResult.maxTotalMarks}</td>
                    <td className="p-2 text-center text-teal-800 border-r border-slate-300">{selectedResult.totalMarks}</td>
                    <td className="p-2 text-center text-teal-800 border-r border-slate-300">{selectedResult.overallGrade}</td>
                    <td className="p-2 font-extrabold text-teal-900">{selectedResult.percentage}% (CGPA: {selectedResult.cgpa})</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Signatures Footer */}
            <div className="pt-8 grid grid-cols-3 text-center text-xs text-slate-600 border-t border-slate-200 mt-4">
              <div>
                <div className="h-10 border-b border-dashed border-slate-400 mx-6 mb-1" />
                <p className="font-semibold text-slate-800">Class Mentor</p>
                <p className="text-[10px] text-slate-400">Prof. Ananya Sharma</p>
              </div>
              <div>
                <div className="h-10 border-b border-dashed border-slate-400 mx-6 mb-1 flex items-center justify-center">
                  <span className="text-[10px] text-teal-700 font-mono font-bold">[VERIFIED SEAL]</span>
                </div>
                <p className="font-semibold text-slate-800">Controller of Examinations</p>
                <p className="text-[10px] text-slate-400">Dr. Robert Langdon</p>
              </div>
              <div>
                <div className="h-10 border-b border-dashed border-slate-400 mx-6 mb-1" />
                <p className="font-semibold text-slate-800">Principal & Director</p>
                <p className="text-[10px] text-slate-400">Dr. Katherine Howard</p>
              </div>
            </div>

            <div className="pt-6 flex justify-end gap-2 no-print border-t border-slate-100 mt-4">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-xl bg-teal-50 px-4 py-2 text-xs font-semibold text-teal-700 hover:bg-teal-100"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Official PDF</span>
              </button>
              <button
                onClick={() => setSelectedResult(null)}
                className="rounded-xl bg-slate-800 hover:bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enter Marks Form Modal */}
      {isEnterMarksModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl relative">
            <button
              onClick={() => setIsEnterMarksModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Enter Student Subject Marks
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Marks entered will automatically compute Total, Percentage, and CGPA.
            </p>

            <form onSubmit={handleSaveMarks} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Select Student</label>
                <select
                  value={markForm.studentId}
                  onChange={(e) => setMarkForm({ ...markForm, studentId: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} (Roll #{s.rollNo} • {s.classId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Math (Max 100)</label>
                  <input
                    type="number"
                    max={100}
                    min={0}
                    required
                    value={markForm.math}
                    onChange={(e) => setMarkForm({ ...markForm, math: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Science (Max 100)</label>
                  <input
                    type="number"
                    max={100}
                    min={0}
                    required
                    value={markForm.science}
                    onChange={(e) => setMarkForm({ ...markForm, science: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">History</label>
                  <input
                    type="number"
                    max={100}
                    min={0}
                    required
                    value={markForm.history}
                    onChange={(e) => setMarkForm({ ...markForm, history: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">English</label>
                  <input
                    type="number"
                    max={100}
                    min={0}
                    required
                    value={markForm.english}
                    onChange={(e) => setMarkForm({ ...markForm, english: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Biology</label>
                  <input
                    type="number"
                    max={100}
                    min={0}
                    required
                    value={markForm.biology}
                    onChange={(e) => setMarkForm({ ...markForm, biology: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsEnterMarksModalOpen(false)}
                  className="rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 hover:bg-teal-700 px-4 py-2 font-semibold text-white shadow-sm"
                >
                  Compute & Save Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
