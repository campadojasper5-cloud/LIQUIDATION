import React from 'react';
import { Transaction, SchoolProfile, CashAdvance } from '../../types';

interface Appendix63Props {
  transaction: Transaction;
  school: SchoolProfile;
  cashAdvance: CashAdvance;
}

export const Appendix63RIS: React.FC<Appendix63Props> = ({
  transaction,
  school,
  cashAdvance,
}) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-300 shadow-sm text-slate-900 font-sans print-page">
      <div className="text-right text-[11px] font-mono font-bold tracking-wider text-slate-500 mb-2">
        Appendix 63
      </div>

      <div className="text-center space-y-0.5 border-b-2 border-slate-900 pb-3 mb-4">
        <div className="text-xs font-serif uppercase tracking-widest text-slate-600">Republic of the Philippines</div>
        <div className="text-sm font-bold uppercase tracking-wider text-slate-900">Department of Education</div>
        <div className="text-xs font-semibold text-slate-800">{school.region} · {school.division}</div>
        <div className="text-sm font-bold text-slate-900 mt-1">{school.schoolName.toUpperCase()}</div>
        <div className="pt-2 text-base font-extrabold uppercase tracking-wide text-slate-900">
          REQUISITION AND ISSUE SLIP (RIS)
        </div>
      </div>

      <div className="grid grid-cols-2 text-xs border border-slate-800 mb-4 divide-x divide-slate-800">
        <div className="p-2 space-y-1">
          <div>
            <span className="font-semibold">Division / School: </span>
            <span>{school.schoolName}</span>
          </div>
          <div>
            <span className="font-semibold">Office: </span>
            <span>Faculty &amp; Instructional Staff</span>
          </div>
        </div>
        <div className="p-2 space-y-1">
          <div>
            <span className="font-semibold">RIS No.: </span>
            <span className="font-mono font-bold">RIS-2026-10-{transaction.id.replace('TX-', '')}</span>
          </div>
          <div>
            <span className="font-semibold">Date: </span>
            <span>{transaction.date}</span>
          </div>
        </div>
      </div>

      <table className="w-full text-xs border border-slate-800 border-collapse mb-4">
        <thead>
          <tr className="bg-slate-100 border-b border-slate-800 font-bold text-center">
            <th colSpan={4} className="border-r border-slate-800 px-2 py-1 bg-slate-200">Requisition</th>
            <th colSpan={2} className="px-2 py-1 bg-slate-100">Issuance</th>
          </tr>
          <tr className="bg-slate-50 border-b border-slate-800 font-bold text-center text-[11px]">
            <th className="border-r border-slate-800 px-2 py-1.5 w-16">Stock No.</th>
            <th className="border-r border-slate-800 px-2 py-1.5 w-16">Unit</th>
            <th className="border-r border-slate-800 px-2 py-1.5">Description</th>
            <th className="border-r border-slate-800 px-2 py-1.5 w-16">Qty</th>
            <th className="border-r border-slate-800 px-2 py-1.5 w-16">Qty Issued</th>
            <th className="px-2 py-1.5 w-24">Remarks</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-300">
          {transaction.items.map((item, idx) => (
            <tr key={item.id} className="hover:bg-slate-50">
              <td className="border-r border-slate-800 px-2 py-1.5 text-center font-mono">{idx + 1}</td>
              <td className="border-r border-slate-800 px-2 py-1.5 text-center">{item.unit}</td>
              <td className="border-r border-slate-800 px-2 py-1.5 font-medium">{item.description}</td>
              <td className="border-r border-slate-800 px-2 py-1.5 text-center font-mono">{item.quantity}</td>
              <td className="border-r border-slate-800 px-2 py-1.5 text-center font-mono font-bold">{item.quantity}</td>
              <td className="px-2 py-1.5 text-center text-[10px] text-emerald-800">Available / Issued</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border border-slate-800 p-2.5 text-xs mb-4">
        <span className="font-bold">Purpose: </span>
        <span>{transaction.particulars}</span>
      </div>

      {/* 4-Box Signature Workflow: Requested, Approved, Issued, Received */}
      <div className="grid grid-cols-4 border border-slate-800 divide-x divide-slate-800 text-xs text-center">
        <div className="p-2 space-y-4">
          <div className="text-left font-bold text-[10px] uppercase text-slate-500">Requested by:</div>
          <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
            {school.requisitionerName}
          </div>
          <div className="text-[10px] text-slate-600">{school.requisitionerTitle}</div>
        </div>

        <div className="p-2 space-y-4">
          <div className="text-left font-bold text-[10px] uppercase text-slate-500">Approved by:</div>
          <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
            {school.schoolHeadName}
          </div>
          <div className="text-[10px] text-slate-600">{school.schoolHeadTitle}</div>
        </div>

        <div className="p-2 space-y-4">
          <div className="text-left font-bold text-[10px] uppercase text-slate-500">Issued by:</div>
          <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
            {school.propertyCustodianName}
          </div>
          <div className="text-[10px] text-slate-600">Property Custodian</div>
        </div>

        <div className="p-2 space-y-4">
          <div className="text-left font-bold text-[10px] uppercase text-slate-500">Received by:</div>
          <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
            {school.requisitionerName}
          </div>
          <div className="text-[10px] text-slate-600">End-User / Custodian</div>
        </div>
      </div>
    </div>
  );
};
