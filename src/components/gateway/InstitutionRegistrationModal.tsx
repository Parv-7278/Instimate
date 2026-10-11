'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/storeContext';
import { InstitutionType } from '@/types';
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  FileCheck,
  Shield,
  Upload,
  Globe,
  Mail,
  Phone,
  MapPin,
  Lock,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newInstId: string) => void;
}

export const InstitutionRegistrationModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const { registerInstitution } = useStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    type: 'school' as InstitutionType,
    email: '',
    phone: '',
    website: '',
    address: '',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    currency: '₹',
    currentAcademicYear: '2024-2025',
    // Conditional regulatory metadata
    affiliationNumber: '',
    boardOrUniversity: '',
    companyRegNumber: '',
    departmentJurisdiction: '',
    // Authorized Representative
    representativeName: '',
    representativeDesignation: '',
    representativeEmail: '',
    representativePhone: '',
    password: '',
    agreeTerms: false,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      alert('Please agree to the platform verification terms and privacy policy.');
      return;
    }

    const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const code = `${formData.name.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newInst = registerInstitution({
      name: formData.name,
      code,
      slug,
      type: formData.type,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      phone: formData.phone,
      email: formData.email,
      website: formData.website,
      currency: formData.currency,
      currentAcademicYear: formData.currentAcademicYear,
      affiliationNumber: formData.affiliationNumber,
      boardOrUniversity: formData.boardOrUniversity,
      companyRegNumber: formData.companyRegNumber,
      departmentJurisdiction: formData.departmentJurisdiction,
      representativeName: formData.representativeName,
      representativeDesignation: formData.representativeDesignation,
      representativeEmail: formData.representativeEmail,
      representativePhone: formData.representativePhone,
      enabledModules: ['attendance', 'staff', 'leaves', 'announcements'],
    });

    onSuccess(newInst.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Wizard Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
            <span className={step >= 1 ? 'text-teal-700' : ''}>1. Organization Profile</span>
            <span className={step >= 2 ? 'text-teal-700' : ''}>2. Regulatory Details</span>
            <span className={step >= 3 ? 'text-teal-700' : ''}>3. Official Representative</span>
            <span className={step >= 4 ? 'text-teal-700' : ''}>4. Review & Submit</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${(step / 4) * 100}%` }}
              className="h-full bg-gradient-to-r from-[#0d6474] to-[#127d91] transition-all duration-300"
            />
          </div>
        </div>

        {/* Step 1: Organization Basics */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 1: Organization Profile</h2>
              <p className="text-xs text-slate-500">
                Enter your institution name, category, and official location.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Official Institution Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. St. Jude International Academy / Vertex Cyber Tech"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Institution Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e: any) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800"
                  >
                    <option value="school">K-12 School</option>
                    <option value="college">Undergraduate / College</option>
                    <option value="university">University</option>
                    <option value="coaching">Coaching / Competitive Centre</option>
                    <option value="corporate">Private Corporate Company</option>
                    <option value="government">Government Office / Department</option>
                    <option value="public_sector">Public Sector Undertaking (PSU)</option>
                    <option value="hospital">Hospital & Healthcare Facility</option>
                    <option value="ngo">NGO & Non-Profit Foundation</option>
                    <option value="training_centre">Vocational / Professional Training</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Billing Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
                  >
                    <option value="₹">₹ (INR - Indian Rupee)</option>
                    <option value="$">$ (USD - US Dollar)</option>
                    <option value="€">€ (EUR - Euro)</option>
                    <option value="£">£ (GBP - British Pound)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Official Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="contact@institution.edu / info@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Contact Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 11 4982 0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Campus / Office Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Street Address, Building, Sector"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">State / Region</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                disabled={!formData.name || !formData.email || !formData.phone}
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition"
              >
                <span>Continue to Step 2</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Conditional Regulatory & Affiliation Details */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 2: Regulatory & Legal Verification</h2>
              <p className="text-xs text-slate-500">
                Additional identification conditionally displayed for{' '}
                <span className="font-semibold text-teal-800 uppercase">{formData.type}</span>.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              {/* Conditional for Schools & Colleges */}
              {['school', 'college', 'university'].includes(formData.type) && (
                <>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Affiliation / Accreditation Registration Number *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CBSE-AFF-2024 / AICTE-UNIV-99120"
                      value={formData.affiliationNumber}
                      onChange={(e) => setFormData({ ...formData, affiliationNumber: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Recognizing Board / University / Regulatory Council
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Central Board of Secondary Education / UGC Autonomous"
                      value={formData.boardOrUniversity}
                      onChange={(e) => setFormData({ ...formData, boardOrUniversity: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
                    />
                  </div>
                </>
              )}

              {/* Conditional for Corporate Companies */}
              {['corporate', 'public_sector'].includes(formData.type) && (
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Corporate Identification / Business Registration Number (CIN / EIN) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CIN-U72200TG2020PTC145620 / US-EIN-9923812"
                    value={formData.companyRegNumber}
                    onChange={(e) => setFormData({ ...formData, companyRegNumber: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-mono"
                  />
                </div>
              )}

              {/* Conditional for Government Offices */}
              {formData.type === 'government' && (
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Parent Ministry / Administrative Jurisdiction *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ministry of Urban Development & Infrastructure"
                    value={formData.departmentJurisdiction}
                    onChange={(e) => setFormData({ ...formData, departmentJurisdiction: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
                  />
                </div>
              )}

              {/* Conditional for Hospital / Coaching / NGO */}
              {['hospital', 'ngo', 'coaching', 'training_centre'].includes(formData.type) && (
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Trust Registration / Society / Healthcare Operating License Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MAH-HOSP-REG-881920 / TRUST-ACT-1950"
                    value={formData.affiliationNumber}
                    onChange={(e) => setFormData({ ...formData, affiliationNumber: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block font-medium text-slate-700 mb-1">Official Website URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://your-institution.org"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
                />
              </div>

              <div className="rounded-xl border-2 border-dashed border-slate-200 p-4 text-center bg-slate-50">
                <Upload className="h-5 w-5 text-teal-600 mx-auto mb-1" />
                <p className="font-semibold text-slate-700">Upload Registration / Affiliation Certificate</p>
                <p className="text-[10px] text-slate-400 mt-0.5">PDF or PNG document up to 15MB for verification</p>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1 rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-700"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 px-5 py-2 text-xs font-semibold text-white shadow-sm"
              >
                <span>Continue to Step 3</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Authorized Representative */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 3: Authorized Representative</h2>
              <p className="text-xs text-slate-500">
                Provide credentials of the primary institution administrator or signing officer.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Ramesh Gupta"
                    value={formData.representativeName}
                    onChange={(e) => setFormData({ ...formData, representativeName: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Official Designation *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Director / Registrar / CHRO"
                    value={formData.representativeDesignation}
                    onChange={(e) => setFormData({ ...formData, representativeDesignation: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Representative Official Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="ramesh.gupta@institution.edu"
                    value={formData.representativeEmail}
                    onChange={(e) => setFormData({ ...formData, representativeEmail: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Mobile Contact *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98111 22334"
                    value={formData.representativePhone}
                    onChange={(e) => setFormData({ ...formData, representativePhone: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Create Admin Master Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Min 8 characters with numbers & symbols"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-1 rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-700"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button
                type="button"
                disabled={!formData.representativeName || !formData.representativeEmail}
                onClick={() => setStep(4)}
                className="flex items-center gap-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 px-5 py-2 text-xs font-semibold text-white shadow-sm"
              >
                <span>Review & Verification</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review and Submit Application */}
        {step === 4 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 4: Review Application</h2>
              <p className="text-xs text-slate-500">
                Confirm your details before submitting for Super Admin verification review.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Institution:</span>
                <span className="font-bold text-slate-900">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Type:</span>
                <span className="font-bold uppercase text-teal-800">{formData.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email & Contact:</span>
                <span className="text-slate-800">{formData.email} • {formData.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Representative:</span>
                <span className="font-semibold text-slate-800">
                  {formData.representativeName} ({formData.representativeDesignation})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Initial Status:</span>
                <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  Pending Super Admin Verification
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="agreeTerms"
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
              />
              <label htmlFor="agreeTerms" className="text-xs text-slate-600 leading-snug">
                I hereby certify that I am the authorized representative of this institution. I understand that the institution account will be set to <strong>Pending Verification</strong> until reviewed by the Super Admin.
              </label>
            </div>

            <div className="pt-4 flex justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-1 rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-700"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button
                type="submit"
                disabled={!formData.agreeTerms}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 px-6 py-2.5 text-xs font-bold text-white shadow-md transition"
              >
                Submit Application for Verification
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
