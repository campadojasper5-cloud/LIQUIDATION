import React, { useState } from 'react';
import {
  Users,
  Award,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Sliders,
  FileSpreadsheet,
} from 'lucide-react';
import { SchoolProfile, BacMember, InspectorateMember } from '../types';

interface SignatoriesManagerProps {
  school: SchoolProfile;
  onUpdateSchool: (updatedSchool: SchoolProfile) => void;
}

export const SignatoriesManager: React.FC<SignatoriesManagerProps> = ({
  school,
  onUpdateSchool,
}) => {
  const [profile, setProfile] = useState<SchoolProfile>(school);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleTextChange = (field: keyof SchoolProfile, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleUpdateBacMember = (index: number, field: keyof BacMember, value: string) => {
    const updated = [...profile.bacMembers];
    updated[index] = { ...updated[index], [field]: value };
    setProfile({ ...profile, bacMembers: updated });
  };

  const handleAddBacMember = () => {
    const newMember: BacMember = {
      id: `bac-${Date.now()}`,
      name: 'New BAC Member',
      designation: 'BAC Member',
      positionTitle: 'Teacher II',
    };
    setProfile({ ...profile, bacMembers: [...profile.bacMembers, newMember] });
  };

  const handleRemoveBacMember = (index: number) => {
    if (profile.bacMembers.length <= 1) return;
    setProfile({
      ...profile,
      bacMembers: profile.bacMembers.filter((_, i) => i !== index),
    });
  };

  const handleUpdateInspector = (index: number, field: keyof InspectorateMember, value: string) => {
    const updated = [...profile.inspectorateMembers];
    updated[index] = { ...updated[index], [field]: value };
    setProfile({ ...profile, inspectorateMembers: updated });
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSchool(profile);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-700" />
              <h2 className="text-base font-bold text-slate-900">
                Official DepEd Signatories &amp; BAC Roster Manager
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Changes saved here automatically propagate into all official GAM Appendices, Canvasses, and BIR 2307 forms.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {savedNotice && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Auto-Synced to All Forms
              </span>
            )}
            <button
              onClick={handleSaveAll}
              className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Signatories</span>
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* Section 1: School Station & Division Identification */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            1. School Station &amp; Division Administrative Metadata
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">School Name</label>
              <input
                type="text"
                value={profile.schoolName}
                onChange={(e) => handleTextChange('schoolName', e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">DepEd School ID</label>
              <input
                type="text"
                value={profile.schoolId}
                onChange={(e) => handleTextChange('schoolId', e.target.value)}
                className="w-full font-mono border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">School TIN (for BIR 2307)</label>
              <input
                type="text"
                value={profile.tin}
                onChange={(e) => handleTextChange('tin', e.target.value)}
                className="w-full font-mono border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Division</label>
              <input
                type="text"
                value={profile.division}
                onChange={(e) => handleTextChange('division', e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">District</label>
              <input
                type="text"
                value={profile.district}
                onChange={(e) => handleTextChange('district', e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Region</label>
              <input
                type="text"
                value={profile.region}
                onChange={(e) => handleTextChange('region', e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Core Accountable Officers (School Head & SDO) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            2. Core Accountable Officers &amp; Division Endorsers
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* School Head */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <span className="font-bold text-emerald-800 text-[11px] block">
                School Head / Principal (Approving Officer)
              </span>
              <div>
                <label className="block text-slate-600 mb-0.5">Full Name with Degree</label>
                <input
                  type="text"
                  value={profile.schoolHeadName}
                  onChange={(e) => handleTextChange('schoolHeadName', e.target.value)}
                  className="w-full font-semibold border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-0.5">Official Position / Title</label>
                <input
                  type="text"
                  value={profile.schoolHeadTitle}
                  onChange={(e) => handleTextChange('schoolHeadTitle', e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                />
              </div>
              <p className="text-[10px] text-slate-400">
                Pulls to: GAM App 44 (Certification), App 43, PO Conforme, PR Approval, BIR 2307, Abstract of Canvass.
              </p>
            </div>

            {/* Special Disbursing Officer */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <span className="font-bold text-emerald-800 text-[11px] block">
                Special Disbursing Officer / Custodial AO
              </span>
              <div>
                <label className="block text-slate-600 mb-0.5">Full Name</label>
                <input
                  type="text"
                  value={profile.disbursingOfficerName}
                  onChange={(e) => handleTextChange('disbursingOfficerName', e.target.value)}
                  className="w-full font-semibold border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-0.5">Designation</label>
                <input
                  type="text"
                  value={profile.disbursingOfficerTitle}
                  onChange={(e) => handleTextChange('disbursingOfficerTitle', e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                />
              </div>
              <p className="text-[10px] text-slate-400">
                Pulls to: GAM App 44 (Disbursing Officer Sign), GAM App 43 (Custodian Signature).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Property Custodian */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">School Property Custodian</label>
              <input
                type="text"
                value={profile.propertyCustodianName}
                onChange={(e) => handleTextChange('propertyCustodianName', e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white"
              />
              <span className="text-[10px] text-slate-400">Pulls to: IAR (App 62), RIS (App 63), ICS (App 59)</span>
            </div>

            {/* Division Accountant */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Division Accountant III</label>
              <input
                type="text"
                value={profile.divisionAccountantName}
                onChange={(e) => handleTextChange('divisionAccountantName', e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white"
              />
              <span className="text-[10px] text-slate-400">Pulls to: GAM App 44 (SDO Verification Section)</span>
            </div>

            {/* Schools Division Superintendent */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Division Superintendent (SDS)</label>
              <input
                type="text"
                value={profile.divisionSuperintendentName}
                onChange={(e) => handleTextChange('divisionSuperintendentName', e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white"
              />
              <span className="text-[10px] text-slate-400">Pulls to: Travel Orders (App 45 &amp; 47)</span>
            </div>
          </div>
        </div>

        {/* Section 3: Bids and Awards Committee (BAC) Roster */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                3. Bids and Awards Committee (BAC) Composition
              </h3>
              <p className="text-xs text-slate-500">
                Mandated under RA 9184 for Alternative Modes of Procurement &amp; Abstract of Canvass
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddBacMember}
              className="cursor-pointer text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add BAC Member</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">BAC Chairperson</label>
              <input
                type="text"
                value={profile.bacChairperson}
                onChange={(e) => handleTextChange('bacChairperson', e.target.value)}
                className="w-full font-semibold border border-slate-300 rounded-lg px-3 py-2 bg-white"
              />
              <input
                type="text"
                value={profile.bacChairpersonTitle}
                onChange={(e) => handleTextChange('bacChairpersonTitle', e.target.value)}
                placeholder="Title/Position"
                className="w-full text-[11px] border border-slate-200 rounded px-2 py-1 mt-1 bg-slate-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">BAC Vice-Chairperson</label>
              <input
                type="text"
                value={profile.bacViceChair}
                onChange={(e) => handleTextChange('bacViceChair', e.target.value)}
                className="w-full font-semibold border border-slate-300 rounded-lg px-3 py-2 bg-white"
              />
              <input
                type="text"
                value={profile.bacViceChairTitle}
                onChange={(e) => handleTextChange('bacViceChairTitle', e.target.value)}
                placeholder="Title/Position"
                className="w-full text-[11px] border border-slate-200 rounded px-2 py-1 mt-1 bg-slate-50"
              />
            </div>
          </div>

          {/* Regular BAC Members List */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800">Regular BAC Members</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {profile.bacMembers.map((member, index) => (
                <div key={member.id} className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Member #{index + 1}</span>
                    {profile.bacMembers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveBacMember(index)}
                        className="cursor-pointer text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => handleUpdateBacMember(index, 'name', e.target.value)}
                    placeholder="Full Name"
                    className="w-full text-xs font-medium border border-slate-300 rounded px-2 py-1 bg-white"
                  />
                  <input
                    type="text"
                    value={member.positionTitle}
                    onChange={(e) => handleUpdateBacMember(index, 'positionTitle', e.target.value)}
                    placeholder="e.g. Teacher III / Math Dept Head"
                    className="w-full text-[11px] border border-slate-200 rounded px-2 py-1 bg-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* BAC Secretariat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">BAC Secretariat Head</label>
              <input
                type="text"
                value={profile.bacSecretariat}
                onChange={(e) => handleTextChange('bacSecretariat', e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">BAC Secretariat Position</label>
              <input
                type="text"
                value={profile.bacSecretariatTitle}
                onChange={(e) => handleTextChange('bacSecretariatTitle', e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 4: School Inspectorate Team */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            4. School Inspectorate Team (GAM Appendix 62 - IAR Signatories)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Inspectorate Team Leader</span>
              <input
                type="text"
                value={profile.inspectorateChair}
                onChange={(e) => handleTextChange('inspectorateChair', e.target.value)}
                className="w-full font-semibold border border-slate-300 rounded px-2.5 py-1.5 bg-white"
              />
              <input
                type="text"
                value={profile.inspectorateChairTitle}
                onChange={(e) => handleTextChange('inspectorateChairTitle', e.target.value)}
                className="w-full text-[11px] border border-slate-200 rounded px-2 py-1 bg-white"
              />
            </div>

            {profile.inspectorateMembers.map((insp, idx) => (
              <div key={insp.id} className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">{insp.designation}</span>
                <input
                  type="text"
                  value={insp.name}
                  onChange={(e) => handleUpdateInspector(idx, 'name', e.target.value)}
                  className="w-full font-semibold border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                />
                <input
                  type="text"
                  value={insp.positionTitle}
                  onChange={(e) => handleUpdateInspector(idx, 'positionTitle', e.target.value)}
                  className="w-full text-[11px] border border-slate-200 rounded px-2 py-1 bg-white"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="cursor-pointer inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Apply Signatories to All Official Forms</span>
          </button>
        </div>
      </form>
    </div>
  );
};
