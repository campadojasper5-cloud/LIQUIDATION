import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Paperclip,
  Upload,
  Check,
  X,
  Eye,
  FolderOpen,
  Filter,
} from 'lucide-react';
import { ChecklistItem, ExpenseCategory } from '../types';

interface MasterChecklistProps {
  checklist: ChecklistItem[];
  onToggleStatus: (id: string, newStatus: ChecklistItem['status']) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onAttachFile: (id: string, fileName: string) => void;
}

const CATEGORY_TABS: { label: string; value: string }[] = [
  { label: 'All Categories (A–H)', value: 'ALL' },
  { label: 'Category A: Core Documents', value: 'Category A: Core Documents' },
  { label: 'Category B: Consumables', value: 'Category B: Consumable Office & School Supplies' },
  { label: 'Category C: Semi-Expendable', value: 'Category C: Semi-Expendable Property & Equipment (< ₱50,000)' },
  { label: 'Category D: Repairs & Maint.', value: 'Category D: Repairs & Maintenance of School Buildings' },
  { label: 'Category E: Utilities', value: 'Category E: Utilities & Communication Expenses' },
  { label: 'Category F: Travel Expenses', value: 'Category F: Travel Expenses' },
  { label: 'Category G: SBFP', value: 'Category G: School-Based Feeding Program (SBFP)' },
  { label: 'Category H: Small Purchases', value: 'Category H: Small Purchases & Minor Expenses Without ORs' },
];

export const MasterChecklist: React.FC<MasterChecklistProps> = ({
  checklist,
  onToggleStatus,
  onUpdateNotes,
  onAttachFile,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState<string>('');

  const filteredItems = checklist.filter((item) => {
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesCat && matchesStatus;
  });

  const totalRequired = checklist.filter((i) => i.isRequired).length;
  const verifiedCount = checklist.filter((i) => i.isRequired && i.status === 'VERIFIED').length;
  const progressPercent = Math.round((verifiedCount / totalRequired) * 100);

  const handleSimulateUpload = (id: string, currentTitle: string) => {
    const cleanName = currentTitle.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 25) + '_Verified.pdf';
    onAttachFile(id, cleanName);
    onToggleStatus(id, 'VERIFIED');
  };

  return (
    <div className="space-y-4">
      {/* Header Banner & Progress Indicator */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-emerald-700" />
              <h2 className="text-base font-bold text-slate-900">
                DepEd Master MOOE Liquidation Attachment Checklist (Categories A–H)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Required by COA Circular 97-002, RA 9184, and SDO Accounting Unit verification standards
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-700">Checklist Compliance</div>
              <div className="font-mono text-base font-bold text-emerald-800 tabular-nums">
                {verifiedCount} / {totalRequired} ({progressPercent}%)
              </div>
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-emerald-500 flex items-center justify-center font-bold text-xs text-emerald-800 bg-emerald-50">
              {progressPercent}%
            </div>
          </div>
        </div>

        {/* Linear Progress */}
        <div className="w-full bg-slate-100 rounded-full h-2 mt-4 overflow-hidden">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Filters */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 overflow-x-auto py-1 max-w-full">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedCategory(tab.value)}
                className={`cursor-pointer px-2.5 py-1 text-xs rounded-md whitespace-nowrap transition-colors ${
                  selectedCategory === tab.value
                    ? 'bg-emerald-700 text-white font-medium shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-2 py-1 text-xs bg-white text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="VERIFIED">Verified Compliant</option>
              <option value="PENDING_UPLOAD">Pending Attachment</option>
              <option value="MISSING">Missing Document</option>
              <option value="NOT_APPLICABLE">Not Applicable</option>
            </select>
          </div>
        </div>
      </div>

      {/* Checklist Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 transition-colors ${
                item.status === 'VERIFIED'
                  ? 'hover:bg-emerald-50/20'
                  : item.status === 'MISSING'
                  ? 'bg-rose-50/20 hover:bg-rose-50/40'
                  : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {/* Status Toggle Button */}
                  <button
                    onClick={() => {
                      const nextStatus =
                        item.status === 'VERIFIED'
                          ? 'PENDING_UPLOAD'
                          : item.status === 'PENDING_UPLOAD'
                          ? 'MISSING'
                          : 'VERIFIED';
                      onToggleStatus(item.id, nextStatus);
                    }}
                    className={`cursor-pointer mt-0.5 w-6 h-6 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                      item.status === 'VERIFIED'
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : item.status === 'MISSING'
                        ? 'bg-rose-100 border-rose-300 text-rose-700'
                        : item.status === 'NOT_APPLICABLE'
                        ? 'bg-slate-100 border-slate-300 text-slate-400'
                        : 'border-slate-300 text-transparent hover:border-slate-400'
                    }`}
                  >
                    {item.status === 'VERIFIED' && <Check className="w-4 h-4 stroke-[2.5]" />}
                    {item.status === 'MISSING' && <X className="w-3.5 h-3.5 stroke-[2.5]" />}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900">{item.title}</span>
                      {item.gamRef && (
                        <span className="text-[10px] font-mono font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {item.gamRef}
                        </span>
                      )}
                      {item.isRequired ? (
                        <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                          Mandatory
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                          Conditional
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600">{item.description}</p>

                    {/* Attached file status */}
                    {item.attachedFileName && (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-medium pt-1">
                        <Paperclip className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Attached: {item.attachedFileName}</span>
                      </div>
                    )}

                    {/* Notes preview or editor */}
                    {editingNotesId === item.id ? (
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="text"
                          value={notesInput}
                          onChange={(e) => setNotesInput(e.target.value)}
                          placeholder="Add compliance notes or remarks..."
                          className="text-xs border border-slate-300 rounded px-2 py-1 w-72 focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          onClick={() => {
                            onUpdateNotes(item.id, notesInput);
                            setEditingNotesId(null);
                          }}
                          className="cursor-pointer text-xs px-2 py-1 bg-emerald-700 text-white rounded font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingNotesId(null)}
                          className="cursor-pointer text-xs px-2 py-1 text-slate-500 hover:text-slate-700"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : item.notes ? (
                      <div className="text-[11px] text-slate-500 italic pt-0.5">Note: {item.notes}</div>
                    ) : null}
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => {
                      setEditingNotesId(item.id);
                      setNotesInput(item.notes || '');
                    }}
                    className="cursor-pointer text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded hover:bg-slate-100"
                  >
                    {item.notes ? 'Edit Note' : '+ Note'}
                  </button>

                  <button
                    onClick={() => handleSimulateUpload(item.id, item.title)}
                    className="cursor-pointer inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs"
                  >
                    <Upload className="w-3 h-3 text-slate-400" />
                    <span>Attach Proof</span>
                  </button>

                  <select
                    value={item.status}
                    onChange={(e) => onToggleStatus(item.id, e.target.value as any)}
                    className={`cursor-pointer text-xs font-semibold px-2.5 py-1 rounded-md border focus:outline-none ${
                      item.status === 'VERIFIED'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : item.status === 'MISSING'
                        ? 'bg-rose-50 text-rose-800 border-rose-300'
                        : item.status === 'NOT_APPLICABLE'
                        ? 'bg-slate-100 text-slate-600 border-slate-200'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}
                  >
                    <option value="VERIFIED">Verified</option>
                    <option value="PENDING_UPLOAD">Pending</option>
                    <option value="MISSING">Missing</option>
                    <option value="NOT_APPLICABLE">N/A</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
