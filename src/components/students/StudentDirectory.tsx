'use client';

import React, { useState, useMemo } from 'react';
import { useStore } from '@/lib/storeContext';
import { Student } from '@/types';
import {
  Search,
  Plus,
  Download,
  Upload,
  Filter,
  Eye,
  Edit2,
  Trash2,
  CreditCard,
  QrCode,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  X,
  Printer,
  ChevronDown,
} from 'lucide-react';
import { handleHorizontalWheel, getRandomAvatar } from '@/lib/utils';


export const StudentDirectory: React.FC = () => {
  const { students, addStudent, updateStudent, deleteStudent, invoices, examResults } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'rollNo' | 'name' | 'attendance'>('rollNo');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showIdCard, setShowIdCard] = useState(false);

  // New Student Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    rollNo: '',
    admissionNo: '',
    classId: 'Class 10-A',
    section: 'A',
    course: 'Secondary Sciences',
    department: 'Science & Mathematics',
    academicYear: '2024-2025',
    dob: '2007-05-15',
    gender: 'Male' as const,
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    emergencyContact: '',
    status: 'Active' as const,
    institutionId: 'inst-1',
    admissionDate: '2024-06-01',
  });

  // Filtered and sorted students
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => {
        const matchesQuery =
          s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.rollNo.includes(searchQuery) ||
          s.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesClass = selectedClass === 'all' || s.classId === selectedClass;
        const matchesStatus = selectedStatus === 'all' || s.status === selectedStatus;
        return matchesQuery && matchesClass && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'rollNo') return a.rollNo.localeCompare(b.rollNo);
        if (sortBy === 'name') return a.fullName.localeCompare(b.fullName);
        if (sortBy === 'attendance') return b.attendanceRate - a.attendanceRate;
        return 0;
      });
  }, [students, searchQuery, selectedClass, selectedStatus, sortBy]);

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.rollNo) return;
    addStudent({
      ...formData,
      avatarUrl: getRandomAvatar(),
    });
    setIsAddModalOpen(false);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      rollNo: '',
      admissionNo: '',
      classId: 'Class 10-A',
      section: 'A',
      course: 'Secondary Sciences',
      department: 'Science & Mathematics',
      academicYear: '2024-2025',
      dob: '2007-05-15',
      gender: 'Male',
      parentName: '',
      parentPhone: '',
      parentEmail: '',
      address: '',
      emergencyContact: '',
      status: 'Active',
      institutionId: 'inst-1',
      admissionDate: '2024-06-01',
    });
  };

  const handleExportCSV = () => {
    const headers = 'Student ID,Roll No,Full Name,Class,Email,Phone,Parent,Attendance%\n';
    const rows = filteredStudents
      .map(
        (s) =>
          `"${s.studentId}","${s.rollNo}","${s.fullName}","${s.classId}","${s.email}","${s.phone}","${s.parentName}","${s.attendanceRate}%"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Institution_Hub_Students_${Date.now()}.csv`;
    a.click();
    setTimeout(() => window.URL.revokeObjectURL(url), 200);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Student Admissions & Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage comprehensive student profiles, enrollments, attendance, and fee status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsCsvModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            <Upload className="h-3.5 w-3.5 text-slate-500" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export ({filteredStudents.length})</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0d6474] to-[#127d91] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-95 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Enroll New Student</span>
          </button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 rounded-2xl bg-white p-4 border border-slate-200/80 shadow-sm">
        <div className="sm:col-span-2 relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, roll number, ID, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Classes & Sections</option>
            <option value="Class 10-A">Class 10-A</option>
            <option value="Class 10-B">Class 10-B</option>
          </select>
        </div>

        <div>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="rollNo">Sort by Roll Number</option>
            <option value="name">Sort by Full Name</option>
            <option value="attendance">Sort by Attendance %</option>
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div onWheel={handleHorizontalWheel} className="overflow-x-auto scroll-touch">
          <table className="w-full min-w-[750px] text-left text-xs border-collapse">

            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Roll & ID</th>
                <th className="py-3.5 px-4">Class & Section</th>
                <th className="py-3.5 px-4">Parent Details</th>
                <th className="py-3.5 px-4">Attendance Rate</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No matching student records found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu) => {
                  const isLowAttendance = stu.attendanceRate < 75;
                  return (
                    <tr key={stu.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={stu.avatarUrl}
                            alt={stu.fullName}
                            onError={(e: any) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
                            }}
                            className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{stu.fullName}</p>
                            <p className="text-[11px] text-slate-500">{stu.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-800">Roll #{stu.rollNo}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{stu.studentId}</p>
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-800">{stu.classId}</p>
                        <p className="text-[11px] text-slate-500">{stu.course}</p>
                      </td>

                      <td className="py-3 px-4">
                        <p className="text-slate-800 font-medium">{stu.parentName}</p>
                        <p className="text-[11px] text-slate-400">{stu.parentPhone}</p>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold text-xs ${
                              isLowAttendance ? 'text-rose-600' : 'text-emerald-700'
                            }`}
                          >
                            {stu.attendanceRate}%
                          </span>
                          {isLowAttendance && (
                            <span className="rounded bg-rose-100 px-1.5 py-0.2 text-[9px] font-bold text-rose-700">
                              Low Alert
                            </span>
                          )}
                        </div>
                        <div className="h-1.5 w-24 bg-slate-100 rounded-full mt-1 overflow-hidden">
                          <div
                            style={{ width: `${stu.attendanceRate}%` }}
                            className={`h-full ${
                              isLowAttendance ? 'bg-rose-500' : 'bg-teal-600'
                            }`}
                          />
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                          {stu.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedStudent(stu);
                              setShowIdCard(false);
                            }}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-teal-700 transition"
                            title="View Full Profile"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedStudent(stu);
                              setShowIdCard(true);
                            }}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-teal-700 transition"
                            title="Generate Digital ID Card"
                          >
                            <QrCode className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteStudent(stu.id)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition"
                            title="Delete Student"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Profile & Digital ID Card Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            {showIdCard ? (
              /* Printable Digital ID Card */
              <div className="printable-area space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-sm text-slate-900">
                    Official Student Smart ID Card
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowIdCard(false)}
                      className="no-print rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      View Full Profile
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="no-print flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-100 transition"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span>Print ID Card</span>
                    </button>
                  </div>
                </div>

                <div className="mx-auto w-full max-w-sm rounded-2xl bg-gradient-to-br from-[#0a4d5a] to-[#127d91] p-5 text-white shadow-xl border-4 border-white">
                  <div className="flex items-center justify-between border-b border-white/20 pb-3">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-wider text-cyan-200">
                        Institution Hub
                      </p>
                      <h4 className="text-xs font-extrabold text-white">Apex International Academy</h4>
                    </div>
                    <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded font-mono">
                      2024–2025
                    </span>
                  </div>

                  <div className="mt-4 flex gap-4 items-center">
                    <img
                      src={selectedStudent.avatarUrl}
                      alt={selectedStudent.fullName}
                      className="h-20 w-20 rounded-xl object-cover ring-2 ring-white/40 shadow-md"
                    />
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-sm text-white">{selectedStudent.fullName}</h4>
                      <p className="text-xs text-teal-100 font-semibold">{selectedStudent.classId}</p>
                      <p className="text-[11px] font-mono text-cyan-200">ID: {selectedStudent.studentId}</p>
                      <p className="text-[11px] text-teal-100">Roll No: #{selectedStudent.rollNo}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-[10px] text-teal-100">
                    <div>
                      <p>Emergency Contact: {selectedStudent.emergencyContact}</p>
                      <p>Blood Group: {selectedStudent.bloodGroup || 'O+'}</p>
                    </div>
                    {/* Simulated QR Code */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white p-1 shadow">
                      <QrCode className="h-10 w-10 text-slate-900" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Full Profile Tabs */
              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                  <img
                    src={selectedStudent.avatarUrl}
                    alt={selectedStudent.fullName}
                    className="h-16 w-16 rounded-2xl object-cover ring-2 ring-teal-500/20"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{selectedStudent.fullName}</h3>
                    <p className="text-xs text-slate-500">
                      Roll #{selectedStudent.rollNo} • ID: {selectedStudent.studentId} • {selectedStudent.classId}
                    </p>
                    <span className="mt-1 inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Enrolled: {selectedStudent.admissionDate}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2 rounded-xl bg-slate-50 p-3">
                    <p className="font-bold text-slate-700 border-b pb-1">Personal Details</p>
                    <p><span className="text-slate-400">Email:</span> {selectedStudent.email}</p>
                    <p><span className="text-slate-400">Phone:</span> {selectedStudent.phone}</p>
                    <p><span className="text-slate-400">Date of Birth:</span> {selectedStudent.dob}</p>
                    <p><span className="text-slate-400">Gender:</span> {selectedStudent.gender}</p>
                    <p><span className="text-slate-400">Address:</span> {selectedStudent.address}</p>
                  </div>

                  <div className="space-y-2 rounded-xl bg-slate-50 p-3">
                    <p className="font-bold text-slate-700 border-b pb-1">Parent & Academic Record</p>
                    <p><span className="text-slate-400">Parent Name:</span> {selectedStudent.parentName}</p>
                    <p><span className="text-slate-400">Parent Contact:</span> {selectedStudent.parentPhone}</p>
                    <p><span className="text-slate-400">Emergency Phone:</span> {selectedStudent.emergencyContact}</p>
                    <p><span className="text-slate-400">Attendance:</span> <span className="font-bold text-teal-700">{selectedStudent.attendanceRate}%</span></p>
                    <p><span className="text-slate-400">Department:</span> {selectedStudent.department}</p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => setShowIdCard(true)}
                    className="flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700"
                  >
                    <QrCode className="h-4 w-4" />
                    <span>View Smart ID Card</span>
                  </button>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="rounded-xl bg-teal-600 hover:bg-teal-700 px-4 py-2 text-xs font-semibold text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Enroll New Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Enroll New Student
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter student credentials, academic assignment, and guardian details.
            </p>

            <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g. Tanvi Joshi"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Roll Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.rollNo}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g. 107"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Class / Section</label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  >
                    <option value="Class 10-A">Class 10-A</option>
                    <option value="Class 10-B">Class 10-B</option>
                    <option value="Class 9-A">Class 9-A</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e: any) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Student Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                    placeholder="student@apexacademy.edu"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                    placeholder="+91 98765 00000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Parent / Guardian Name</label>
                  <input
                    type="text"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                    placeholder="Father / Mother Name"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Parent Contact Phone</label>
                  <input
                    type="text"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                    placeholder="+91 98111 22233"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Residential Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  placeholder="Street, City, Postal Code"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 hover:bg-teal-700 px-4 py-2 font-semibold text-white shadow-sm"
                >
                  Confirm Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Simulator Modal */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl relative">
            <button
              onClick={() => setIsCsvModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Bulk CSV Student Import
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Upload a standard CSV roster containing full name, roll number, and parent details.
            </p>

            <div className="rounded-xl border-2 border-dashed border-slate-200 p-6 text-center hover:border-teal-400 transition bg-slate-50/50">
              <FileSpreadsheet className="h-8 w-8 text-teal-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">Drop CSV file here or click to browse</p>
              <p className="text-[10px] text-slate-400 mt-1">Supports UTF-8 .csv files up to 10MB</p>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs">
              <button
                onClick={() => {
                  // Simulate sample import
                  addStudent({
                    fullName: 'Pranav Menon',
                    email: 'pranav.menon@apexacademy.edu',
                    phone: '+91 99123 45678',
                    rollNo: '107',
                    admissionNo: 'ADM-8807',
                    classId: 'Class 10-A',
                    section: 'A',
                    course: 'Secondary Sciences',
                    department: 'Science & Mathematics',
                    academicYear: '2024-2025',
                    dob: '2007-03-19',
                    gender: 'Male',
                    parentName: 'Suresh Menon',
                    parentPhone: '+91 99123 11223',
                    parentEmail: 's.menon@gmail.com',
                    address: '88 Indiranagar, Bengaluru',
                    emergencyContact: '+91 99123 11223',
                    status: 'Active',
                    institutionId: 'inst-1',
                    admissionDate: '2024-06-01',
                    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                  });
                  setIsCsvModalOpen(false);
                }}
                className="text-teal-700 font-semibold hover:underline"
              >
                Load Sample Test Cohort
              </button>

              <button
                onClick={() => setIsCsvModalOpen(false)}
                className="rounded-xl bg-teal-600 hover:bg-teal-700 px-4 py-2 font-semibold text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
