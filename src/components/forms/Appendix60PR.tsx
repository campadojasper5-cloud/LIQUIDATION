import React from 'react';
import { Transaction, SchoolProfile, CashAdvance } from '../../types';
import { formatPHP } from '../../utils/taxCalculator';

interface Appendix60Props {
  transaction: Transaction;
  school: SchoolProfile;
  cashAdvance: CashAdvance;
}

export const Appendix60PR: React.FC<Appendix60Props> = ({
  transaction,
  school,
  cashAdvance,
}) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-300 shadow-sm text-slate-900 font-sans print-page">
      <div className="text-right text-[11px] font-mono font-bold tracking-wider text-slate-500 mb-2">
        Appendix 60
      </div>

      <div className="text-center space-y-0.5 border-b-2 border-slate-900 pb-3 mb-4">
        <div className="text-xs font-serif uppercase tracking-widest text-slate-600">Republic of the Philippines</div>
        <div className="text-sm font-bold uppercase tracking-wider text-slate-900">Department of Education</div>
        <div className="text-xs font-semibold text-slate-800">{school.region} · {school.division}</div>
        <div className="text-sm font-bold text-slate-900 mt-1">{school.schoolName.toUpperCase()}</div>
        <div className="pt-2 text-base font-extrabold uppercase tracking-wide text-slate-900">
          PURCHASE REQUEST (PR)
        </div>
      </div>

      <div className="grid grid-cols-2 text-xs border border-slate-800 mb-4 divide-x divide-slate-800">
        <div className="p-2 space-y-1">
          <div>
            <span className="font-semibold">Entity Name: </span>
            <span>{school.schoolName}</span>
          </div>
          <div>
            <span className="font-semibold">Fund Cluster: </span>
            <span className="font-mono">01 - Regular Agency Fund (MOOE)</span>
          </div>
        </div>
        <div className="p-2 space-y-1">
          <div>
            <span className="font-semibold">PR No.: </span>
            <span className="font-mono">PR-2026-10-{transaction.id.replace('TX-', '')}</span>
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
            <th className="border-r border-slate-800 px-2 py-2 w-16">Item No.</th>
            <th className="border-r border-slate-800 px-2 py-2 w-16">Unit</th>
            <th className="border-r border-slate-800 px-2 py-2">Item Description &amp; Specifications</th>
            <th className="border-r border-slate-800 px-2 py-2 w-16">Qty</th>
            <th className="border-r border-slate-800 px-2 py-2 w-28 text-right">Estimated Unit Cost</th>
            <th className="px-2 py-2 w-28 text-right">Estimated Total Cost</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-300">
          {transaction.items.map((item, idx) => (
            <tr key={item.id} className="hover:bg-slate-50">
              <td className="border-r border-slate-800 px-2 py-2 text-center font-mono">{idx + 1}</td>
              <td className="border-r border-slate-800 px-2 py-2 text-center">{item.unit}</td>
              <td className="border-r border-slate-800 px-2 py-2 font-medium">{item.description}</td>
              <td className="border-r border-slate-800 px-2 py-2 text-center font-mono">{item.quantity}</td>
              <td className="border-r border-slate-800 px-2 py-2 text-right font-mono">{formatPHP(item.unitPrice)}</td>
              <td className="px-2 py-2 text-right font-mono font-bold text-slate-900">{formatPHP(item.totalAmount)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="border-t-2 border-slate-800 font-bold bg-slate-50">
          <tr>
            <td colSpan={5} className="border-r border-slate-800 px-2 py-2 text-right uppercase">
              Total Estimated Cost:
            </td>
            <td className="px-2 py-2 text-right font-mono font-bold text-emerald-900 text-sm">
              {formatPHP(transaction.grossAmount)}
            </td>
          </tr>
        </tfoot>
      </table>

      <div className="border border-slate-800 p-2.5 text-xs mb-4">
        <span className="font-bold">Purpose: </span>
        <span>{transaction.particulars}</span>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-2 border border-slate-800 divide-x divide-slate-800 text-xs">
        <div className="p-3 text-center space-y-6">
          <div className="text-left font-semibold text-slate-700">Requested by:</div>
          <div className="pt-2">
            <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
              {school.requisitionerName}
            </div>
            <div className="text-[11px] text-slate-600">{school.requisitionerTitle}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Requisitioning Officer</div>
          </div>
        </div>

        <div className="p-3 text-center space-y-6">
          <div className="text-left font-semibold text-slate-700">Approved by:</div>
          <div className="pt-2">
            <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
              {school.schoolHeadName}
            </div>
            <div className="text-[11px] text-slate-600">{school.schoolHeadTitle}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Head of Procuring Entity / Principal</div>
          </div>
        </div>
      </div>
    </div>
  );
};
