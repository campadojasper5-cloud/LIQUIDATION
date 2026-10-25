import React, { useState } from 'react';
import {
  Building2,
  Users,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  BadgeCheck,
  FileCheck2,
  Sparkles,
  School,
  IdCard,
} from 'lucide-react';
import { SchoolProfile, BacMember, InspectorateMember } from '../types';
import { formatPHP } from '../utils/taxCalculator';

interface RegistrationHubProps {
  school: SchoolProfile;
  onSaveProfile: (profile: SchoolProfile) => void;
}

const DEPED_REGIONS = [
  'Region I - Ilocos Region',
  'Region II - Cagayan Valley',
  'Region III - Central Luzon',
  'Region IV-A - CALABARZON',
  'MIMAROPA Region',
  'Region V - Bicol Region',
  'Region VI - Western Visayas',
  'Region VII - Central Visayas',
  'Region VIII - Eastern Visayas',
  'Region IX - Zamboanga Peninsula',
  'Region X - Northern Mindanao',
  'Region XI - Davao Region',
  'Region XII - SOCCSKSARGEN',
  'Region XIII - Caraga',
  'NCR - National Capital Region',
  'CAR - Cordillera Administrative Region',
  'BARMM - Bangsamoro Autonomous Region',
];

const SCHOOL_TYPES = [
  'Public Secondary School (Junior & Senior High)',
  'Public Junior High School (Stand-Alone)',
  'Public Senior High School (Stand-Alone)',
  'Public Elementary School (Central)',
  'Public Elementary School (Non-Central)',
  'Integrated School (K to 12)',
  'Technical-Vocational Secondary School',
  'Special Education (SPED) Center',
];

export const RegistrationHub: React.FC<RegistrationHubProps> = ({
  school,
  onSaveProfile,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'school' | 'signatories'>('school');
  const [formData, setFormData] = useState<SchoolProfile>(school);
  const [savedAlert, setSavedAlert] = useState(false);

  const handleInputChange = (field: keyof SchoolProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateBacMember = (index: number, field: keyof BacMember, value: string) => {
    const updated = [...formData.bacMembers];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, bacMembers: updated }));
  };

  const handleAddBacMember = () => {
    const newMember: BacMember = {
      id: `bac-${Date.now()}`,
      name: 'New BAC Member',
      designation: 'BAC Member',
      positionTitle: 'Teacher II',
      employeeId: 'DEPED-T-000000',
    };
    setFormData((prev) => ({ ...prev, bacMembers: [...prev.bacMembers, newMember] }));
  };

  const handleRemoveBacMember = (index: number) => {
    if (formData.bacMembers.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      bacMembers: prev.bacMembers.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateInspector = (index: number, field: keyof InspectorateMember, value: string) => {
    const updated = [...formData.inspectorateMembers];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, inspectorateMembers: updated }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...formData,
      registrationStatus: 'COMPLETE' as const,
      registeredDate: formData.registeredDate || new Date().toISOString().split('T')[0],
    };
    onSaveProfile(updated);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  const handlePresetElementary = () => {
    setFormData((prev) => ({
      ...prev,
      schoolName: 'Balamban Central Elementary School',
      schoolId: '109821',
      schoolType: 'Public Elementary School (Central)',
      officialEmail: '109821@deped.gov.ph',
      schoolHeadName: 'Dr. Clarita R. Mendoza, PhD',
      schoolHeadTitle: 'Elementary School Principal III',
      schoolHeadEmployeeId: 'DEPED-T-049811',
      annualMooeAllocation: 480000.00,
    }));
  };

  const handlePresetHighSchool = () => {
    setFormData((prev) => ({
      ...prev,
      schoolName: 'Mabini National High School',
      schoolId: '303042',
      schoolType: 'Public Secondary School (Junior & Senior High)',
      officialEmail: '303042@deped.gov.ph',
      schoolHeadName: 'Dr. Maria Elena S. Santos, EdD',
      schoolHeadTitle: 'Secondary School Principal IV',
      schoolHeadEmployeeId: 'DEPED-T-084920',
      annualMooeAllocation: 900000.00,
    }));
  };

  // Signatory completeness check
  const requiredSignatories = [
    { label: 'School Head / Principal', value: formData.schoolHeadName },
    { label: 'Disbursing Officer', value: formData.disbursingOfficerName },
    { label: 'Property Custodian', value: formData.propertyCustodianName },
    { label: 'BAC Chairperson', value: formData.bacChairperson },
    { label: 'BAC Vice-Chair', value: formData.bacViceChair },
    { label: 'BAC Secretariat', value: formData.bacSecretariat },
    { label: 'Inspectorate Chair', value: formData.inspectorateChair },
    { label: 'Division Accountant', value: formData.divisionAccountantName },
  ];

  const missingSignatories = requiredSignatories.filter((s) => !s.value || !s.value.trim());
  const isAllSignatoriesComplete = missingSignatories.length === 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-700" />
              <h1 className="text-lg font-bold text-slate-900">
                School Information &amp; Official Signatories Registration
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Official institutional parameters and signatory roster for automated GAM &amp; DepEd document binding
            </p>
          </div>

          <div className="flex items-center gap-3">
            {savedAlert && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Registration Saved &amp; Synced!
              </span>
            )}
            <button
              onClick={handleSubmit}
              className="cursor-pointer inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save &amp; Bind All Documents</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Switcher */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab('school')}
              className={`cursor-pointer inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeSubTab === 'school'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <School className="w-3.5 h-3.5" />
              <span>School Information Registration</span>
            </button>
            <button
              onClick={() => setActiveSubTab('signatories')}
              className={`cursor-pointer inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeSubTab === 'signatories'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Signatories &amp; BAC Registration</span>
              <span className="text-[10px] bg-emerald-600/30 text-white px-1.5 py-0.2 rounded-full">
                {formData.bacMembers.length + 8} Active
              </span>
            </button>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px]">Quick Templates:</span>
            <button
              type="button"
              onClick={handlePresetHighSchool}
              className="cursor-pointer text-[11px] font-medium px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
            >
              Secondary School
            </button>
            <button
              type="button"
              onClick={handlePresetElementary}
              className="cursor-pointer text-[11px] font-medium px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
            >
              Elementary School
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ========================================================================= */}
        {/* TAB 1: SCHOOL INFORMATION REGISTRATION */}
        {/* ========================================================================= */}
        {activeSubTab === 'school' && (
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <BadgeCheck className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span>DepEd Registration Status: </span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      OFFICIALLY REGISTERED
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    School ID: <strong>{formData.schoolId}</strong> · All official GAM headers, cover sheets, and BIR
                    withholding certificates are bound to this school identity.
                  </p>
                </div>
              </div>

              <div className="text-right text-xs">
                <span className="text-slate-400 block text-[10px]">Annual MOOE Allocation</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {formatPHP(formData.annualMooeAllocation || 0)}
                </span>
              </div>
            </div>

            {/* School Profile Details Form */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
              <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <span>1. Official DepEd Institution Identity</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Official School Name (as registered in BEIS / LIS)
                  </label>
                  <input
                    type="text"
                    value={formData.schoolName}
                    onChange={(e) => handleInputChange('schoolName', e.target.value)}
                    placeholder="e.g. Mabini National High School"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    DepEd School ID (6-Digit Official Number)
                  </label>
                  <input
                    type="text"
                    value={formData.schoolId}
                    onChange={(e) => handleInputChange('schoolId', e.target.value)}
                    placeholder="303042"
                    maxLength={6}
                    className="w-full font-mono text-slate-900 font-bold border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">School Classification / Type</label>
                  <select
                    value={formData.schoolType}
                    onChange={(e) => handleInputChange('schoolType', e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {SCHOOL_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bureau of Internal Revenue (BIR) TIN</label>
                  <input
                    type="text"
                    value={formData.tin}
                    onChange={(e) => handleInputChange('tin', e.target.value)}
                    placeholder="000-847-192-000"
                    className="w-full font-mono border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">DepEd Region</label>
                  <select
                    value={formData.region}
                    onChange={(e) => handleInputChange('region', e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {DEPED_REGIONS.map((reg) => (
                      <option key={reg} value={reg}>
                        {reg}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Schools Division Office (SDO)</label>
                  <input
                    type="text"
                    value={formData.division}
                    onChange={(e) => handleInputChange('division', e.target.value)}
                    placeholder="e.g. Schools Division of Cebu Province"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Legislative District</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    placeholder="e.g. District II - Balamban"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Complete Physical School Address (Barangay, Municipality/City, Province, Zip Code)
                </label>
                <input
                  type="text"
                  value={formData.schoolAddress}
                  onChange={(e) => handleInputChange('schoolAddress', e.target.value)}
                  placeholder="Poblacion, Balamban, Cebu, 6041"
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official DepEd School Email</label>
                  <input
                    type="email"
                    value={formData.officialEmail}
                    onChange={(e) => handleInputChange('officialEmail', e.target.value)}
                    placeholder="303042@deped.gov.ph"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">School Contact / Telephone</label>
                  <input
                    type="text"
                    value={formData.contactNumber}
                    onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                    placeholder="(032) 465-2189"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Financial Banking Details */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                2. LandBank of the Philippines (LCCA MOOE Account Details)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">LBP Account Number</label>
                  <input
                    type="text"
                    value={formData.bankAccountNo}
                    onChange={(e) => handleInputChange('bankAccountNo', e.target.value)}
                    placeholder="0812-1049-55"
                    className="w-full font-mono font-bold border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Authorized Servicing LBP Branch</label>
                  <input
                    type="text"
                    value={formData.bankBranch}
                    onChange={(e) => handleInputChange('bankBranch', e.target.value)}
                    placeholder="Land Bank of the Philippines - Toledo City Branch"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SIGNATORIES & BAC REGISTRATION */}
        {/* ========================================================================= */}
        {activeSubTab === 'signatories' && (
          <div className="space-y-6">
            {/* Signatory Readiness Assessment Banner */}
            <div
              className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                isAllSignatoriesComplete
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-center gap-3">
                {isAllSignatoriesComplete ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                )}
                <div>
                  <div className="text-xs font-bold">
                    {isAllSignatoriesComplete
                      ? 'All Official Signatories Registered & Ready for SDO Submission'
                      : 'Missing Required Signatory Information'}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    {isAllSignatoriesComplete
                      ? 'All signature blocks across GAM Appendix 44, Appendix 43, BIR 2307, Purchase Orders, and Canvasses are automatically populated.'
                      : `Please fill in missing fields: ${missingSignatories.map((m) => m.label).join(', ')}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Accountable Officers Registration */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                1. Accountable School Officials Registration
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* School Principal */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-800 text-xs">
                      School Principal / Head of Procuring Entity (HoPE)
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                      Approver
                    </span>
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5">Full Name with Professional Suffixes</label>
                    <input
                      type="text"
                      value={formData.schoolHeadName}
                      onChange={(e) => handleInputChange('schoolHeadName', e.target.value)}
                      placeholder="e.g. Dr. Maria Elena S. Santos, EdD"
                      className="w-full font-bold text-slate-900 border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-600 mb-0.5">Official Position Title</label>
                      <input
                        type="text"
                        value={formData.schoolHeadTitle}
                        onChange={(e) => handleInputChange('schoolHeadTitle', e.target.value)}
                        placeholder="Secondary School Principal IV"
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-0.5">Employee ID Number</label>
                      <input
                        type="text"
                        value={formData.schoolHeadEmployeeId}
                        onChange={(e) => handleInputChange('schoolHeadEmployeeId', e.target.value)}
                        placeholder="DEPED-T-084920"
                        className="w-full font-mono border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Special Disbursing Officer */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-800 text-xs">
                      Special Disbursing Officer (SDO) / Custodian
                    </span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                      Disburser
                    </span>
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5">Full Name</label>
                    <input
                      type="text"
                      value={formData.disbursingOfficerName}
                      onChange={(e) => handleInputChange('disbursingOfficerName', e.target.value)}
                      placeholder="e.g. Juan A. Dela Cruz, AO II"
                      className="w-full font-bold text-slate-900 border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-600 mb-0.5">Official Position Title</label>
                      <input
                        type="text"
                        value={formData.disbursingOfficerTitle}
                        onChange={(e) => handleInputChange('disbursingOfficerTitle', e.target.value)}
                        placeholder="Administrative Officer II / SDO"
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-0.5">Employee ID Number</label>
                      <input
                        type="text"
                        value={formData.disbursingOfficerEmployeeId}
                        onChange={(e) => handleInputChange('disbursingOfficerEmployeeId', e.target.value)}
                        placeholder="DEPED-NT-091421"
                        className="w-full font-mono border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Administrative Officer II / System Developer: JASPER S. CAMPADO */}
                <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/40 space-y-3 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Administrative Officer II &amp; Lead System Developer</span>
                    </span>
                    <span className="text-[10px] bg-emerald-700 text-white font-bold px-2 py-0.5 rounded shadow-2xs">
                      System Developer
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-600 mb-0.5">Full Name</label>
                      <input
                        type="text"
                        value={formData.adminOfficerName || 'JASPER S. CAMPADO'}
                        onChange={(e) => handleInputChange('adminOfficerName', e.target.value)}
                        placeholder="JASPER S. CAMPADO"
                        className="w-full font-bold text-slate-900 border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-0.5">Position Title / System Role</label>
                      <input
                        type="text"
                        value={formData.adminOfficerTitle || 'Administrative Officer II / System Developer'}
                        onChange={(e) => handleInputChange('adminOfficerTitle', e.target.value)}
                        placeholder="Administrative Officer II / System Developer"
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-0.5">Employee ID Number</label>
                      <input
                        type="text"
                        value={formData.adminOfficerEmployeeId || 'DEPED-AO2-2026-081'}
                        onChange={(e) => handleInputChange('adminOfficerEmployeeId', e.target.value)}
                        placeholder="DEPED-AO2-2026-081"
                        className="w-full font-mono border border-slate-300 rounded px-2.5 py-1.5 bg-white text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Custodian & Requisitioner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <span className="font-bold text-slate-800 text-xs block">
                    School Property Custodian / Supply Officer
                  </span>
                  <input
                    type="text"
                    value={formData.propertyCustodianName}
                    onChange={(e) => handleInputChange('propertyCustodianName', e.target.value)}
                    placeholder="Full Name"
                    className="w-full font-bold text-slate-900 border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                    required
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={formData.propertyCustodianTitle}
                      onChange={(e) => handleInputChange('propertyCustodianTitle', e.target.value)}
                      placeholder="Title / Designation"
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white text-[11px]"
                    />
                    <input
                      type="text"
                      value={formData.propertyCustodianEmployeeId}
                      onChange={(e) => handleInputChange('propertyCustodianEmployeeId', e.target.value)}
                      placeholder="Employee ID"
                      className="w-full font-mono border border-slate-300 rounded px-2.5 py-1.5 bg-white text-[11px]"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <span className="font-bold text-slate-800 text-xs block">
                    Default Department Requisitioner (PR / RIS)
                  </span>
                  <input
                    type="text"
                    value={formData.requisitionerName}
                    onChange={(e) => handleInputChange('requisitionerName', e.target.value)}
                    placeholder="Full Name"
                    className="w-full font-bold text-slate-900 border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                    required
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={formData.requisitionerTitle}
                      onChange={(e) => handleInputChange('requisitionerTitle', e.target.value)}
                      placeholder="Title / Grade Level"
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white text-[11px]"
                    />
                    <input
                      type="text"
                      value={formData.requisitionerEmployeeId}
                      onChange={(e) => handleInputChange('requisitionerEmployeeId', e.target.value)}
                      placeholder="Employee ID"
                      className="w-full font-mono border border-slate-300 rounded px-2.5 py-1.5 bg-white text-[11px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bids and Awards Committee (BAC) Registration */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    2. Bids and Awards Committee (BAC) Roster Registration
                  </h2>
                  <p className="text-xs text-slate-500">
                    Required under RA 9184 for Alternative Modes of Procurement &amp; Abstract of Canvass
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddBacMember}
                  className="cursor-pointer text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add BAC Member</span>
                </button>
              </div>

              {/* BAC Chair & Vice Chair */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <span className="font-bold text-slate-900 block">BAC Chairperson</span>
                  <input
                    type="text"
                    value={formData.bacChairperson}
                    onChange={(e) => handleInputChange('bacChairperson', e.target.value)}
                    placeholder="Full Name"
                    className="w-full font-bold text-slate-900 border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={formData.bacChairpersonTitle}
                      onChange={(e) => handleInputChange('bacChairpersonTitle', e.target.value)}
                      placeholder="Position (e.g. Master Teacher II)"
                      className="w-full border border-slate-300 rounded px-2 py-1 bg-white text-[11px]"
                    />
                    <input
                      type="text"
                      value={formData.bacChairpersonEmployeeId}
                      onChange={(e) => handleInputChange('bacChairpersonEmployeeId', e.target.value)}
                      placeholder="Employee ID"
                      className="w-full font-mono border border-slate-300 rounded px-2 py-1 bg-white text-[11px]"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <span className="font-bold text-slate-900 block">BAC Vice-Chairperson</span>
                  <input
                    type="text"
                    value={formData.bacViceChair}
                    onChange={(e) => handleInputChange('bacViceChair', e.target.value)}
                    placeholder="Full Name"
                    className="w-full font-bold text-slate-900 border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={formData.bacViceChairTitle}
                      onChange={(e) => handleInputChange('bacViceChairTitle', e.target.value)}
                      placeholder="Position (e.g. Head Teacher III)"
                      className="w-full border border-slate-300 rounded px-2 py-1 bg-white text-[11px]"
                    />
                    <input
                      type="text"
                      value={formData.bacViceChairEmployeeId}
                      onChange={(e) => handleInputChange('bacViceChairEmployeeId', e.target.value)}
                      placeholder="Employee ID"
                      className="w-full font-mono border border-slate-300 rounded px-2 py-1 bg-white text-[11px]"
                    />
                  </div>
                </div>
              </div>

              {/* Regular BAC Members */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-800">Regular BAC Members List</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {formData.bacMembers.map((member, index) => (
                    <div key={member.id} className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">BAC Member #{index + 1}</span>
                        {formData.bacMembers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveBacMember(index)}
                            className="cursor-pointer text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleUpdateBacMember(index, 'name', e.target.value)}
                        placeholder="Full Name"
                        className="w-full font-semibold border border-slate-300 rounded px-2 py-1 bg-white text-xs"
                      />
                      <input
                        type="text"
                        value={member.positionTitle}
                        onChange={(e) => handleUpdateBacMember(index, 'positionTitle', e.target.value)}
                        placeholder="Position Title"
                        className="w-full border border-slate-200 rounded px-2 py-1 bg-white text-[11px]"
                      />
                      <input
                        type="text"
                        value={member.employeeId || ''}
                        onChange={(e) => handleUpdateBacMember(index, 'employeeId', e.target.value)}
                        placeholder="Employee ID"
                        className="w-full font-mono border border-slate-200 rounded px-2 py-1 bg-white text-[11px]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* BAC Secretariat */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                <span className="font-bold text-slate-900 block">BAC Secretariat Head</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={formData.bacSecretariat}
                    onChange={(e) => handleInputChange('bacSecretariat', e.target.value)}
                    placeholder="Full Name"
                    className="w-full font-bold border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                  />
                  <input
                    type="text"
                    value={formData.bacSecretariatTitle}
                    onChange={(e) => handleInputChange('bacSecretariatTitle', e.target.value)}
                    placeholder="Position Title"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                  />
                  <input
                    type="text"
                    value={formData.bacSecretariatEmployeeId}
                    onChange={(e) => handleInputChange('bacSecretariatEmployeeId', e.target.value)}
                    placeholder="Employee ID"
                    className="w-full font-mono border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* School Inspectorate Team Registration */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                3. School Inspectorate Team (GAM Appendix 62 - IAR Signatories)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* Team Leader */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <span className="font-bold text-slate-900 block">Inspectorate Team Leader</span>
                  <input
                    type="text"
                    value={formData.inspectorateChair}
                    onChange={(e) => handleInputChange('inspectorateChair', e.target.value)}
                    placeholder="Full Name"
                    className="w-full font-bold border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                  />
                  <input
                    type="text"
                    value={formData.inspectorateChairTitle}
                    onChange={(e) => handleInputChange('inspectorateChairTitle', e.target.value)}
                    placeholder="Position Title"
                    className="w-full border border-slate-200 rounded px-2 py-1 bg-white text-[11px]"
                  />
                  <input
                    type="text"
                    value={formData.inspectorateChairEmployeeId}
                    onChange={(e) => handleInputChange('inspectorateChairEmployeeId', e.target.value)}
                    placeholder="Employee ID"
                    className="w-full font-mono border border-slate-200 rounded px-2 py-1 bg-white text-[11px]"
                  />
                </div>

                {formData.inspectorateMembers.map((insp, idx) => (
                  <div key={insp.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <span className="font-bold text-slate-900 block">{insp.designation}</span>
                    <input
                      type="text"
                      value={insp.name}
                      onChange={(e) => handleUpdateInspector(idx, 'name', e.target.value)}
                      placeholder="Full Name"
                      className="w-full font-bold border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                    />
                    <input
                      type="text"
                      value={insp.positionTitle}
                      onChange={(e) => handleUpdateInspector(idx, 'positionTitle', e.target.value)}
                      placeholder="Position Title"
                      className="w-full border border-slate-200 rounded px-2 py-1 bg-white text-[11px]"
                    />
                    <input
                      type="text"
                      value={insp.employeeId || ''}
                      onChange={(e) => handleUpdateInspector(idx, 'employeeId', e.target.value)}
                      placeholder="Employee ID"
                      className="w-full font-mono border border-slate-200 rounded px-2 py-1 bg-white text-[11px]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Division Office Endorsers */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                4. Schools Division Office (SDO) Endorsing Officials
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Division Accountant III (SDO)</label>
                  <input
                    type="text"
                    value={formData.divisionAccountantName}
                    onChange={(e) => handleInputChange('divisionAccountantName', e.target.value)}
                    className="w-full font-bold border border-slate-300 rounded-lg px-3 py-2 bg-white"
                  />
                  <input
                    type="text"
                    value={formData.divisionAccountantTitle}
                    onChange={(e) => handleInputChange('divisionAccountantTitle', e.target.value)}
                    className="w-full text-[11px] border border-slate-200 rounded px-2 py-1 mt-1 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Schools Division Superintendent (SDS)</label>
                  <input
                    type="text"
                    value={formData.divisionSuperintendentName}
                    onChange={(e) => handleInputChange('divisionSuperintendentName', e.target.value)}
                    className="w-full font-bold border border-slate-300 rounded-lg px-3 py-2 bg-white"
                  />
                  <input
                    type="text"
                    value={formData.divisionSuperintendentTitle}
                    onChange={(e) => handleInputChange('divisionSuperintendentTitle', e.target.value)}
                    className="w-full text-[11px] border border-slate-200 rounded px-2 py-1 mt-1 bg-slate-50"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Action Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="text-xs text-slate-500">
            Registered School: <strong className="text-slate-800">{formData.schoolName}</strong> (ID: {formData.schoolId})
          </div>

          <button
            type="submit"
            className="cursor-pointer inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save &amp; Bind All Official Signatories</span>
          </button>
        </div>
      </form>
    </div>
  );
};
