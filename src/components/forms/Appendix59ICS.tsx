import React from 'react';
import { Transaction, SchoolProfile, CashAdvance } from '../../types';
import { formatPHP } from '../../utils/taxCalculator';

interface Appendix59Props {
  transaction: Transaction;
  school: SchoolProfile;
  cashAdvance: CashAdvance;
}

export const Appendix59ICS: React.FC<Appendix59Props> = ({
  transaction,
  school,
  cashAdvance,
}) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-300 shadow-sm text-slate-900 font-sans print-page">
      <div className="text-right text-[11px] font-mono font-bold tracking-wider text-slate-500 mb-2">
        Appendix 59
      </div>

      <div className="text-center space-y-0.5 border-b-2 border-slate-900 pb-3 mb-4">
        <div className="text-xs font-serif uppercase tracking-widest text-slate-600">Republic of the Philippines</div>
        <div className="text-sm font-bold uppercase tracking-wider text-slate-900">Department of Education</div>
        <div className="text-xs font-semibold text-slate-800">{school.region} · {school.division}</div>
        <div className="text-sm font-bold text-slate-900 mt-1">{school.schoolName.toUpperCase()}</div>
        <div className="pt-2 text-base font-extrabold uppercase tracking-wide text-slate-900">
          INVENTORY CUSTODIAN SLIP (ICS)
        </div>
        <div className="text-xs font-semibold text-slate-700">
          (For Semi-Expendable Property Costing Below ₱50,000.00)
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
            <span className="font-semibold">ICS No.: </span>
            <span className="font-mono font-bold">ICS-2026-10-{transaction.id.replace('TX-', '')}</span>
          </div>
          <div>
            <span className="font-semibold">Invoice / DR Ref: </span>
            <span>{transaction.receiptType} #{transaction.receiptNo}</span>
          </div>
        </div>
      </div>

      <table className="w-full text-xs border border-slate-800 border-collapse mb-4">
        <thead>
          <tr className="bg-slate-100 border-b border-slate-800 font-bold text-center">
            <th className="border-r border-slate-800 px-2 py-2 w-14">Qty</th>
            <th className="border-r border-slate-800 px-2 py-2 w-16">Unit</th>
            <th className="border-r border-slate-800 px-2 py-2 w-28 text-right">Unit Cost</th>
            <th className="border-r border-slate-800 px-2 py-2 w-28 text-right">Total Cost</th>
            <th className="border-r border-slate-800 px-2 py-2">Description &amp; Serial Number</th>
            <th className="border-r border-slate-800 px-2 py-2 w-28 font-mono">Inventory Item No.</th>
            <th className="px-2 py-2 w-24">Estimated Useful Life</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-300">
          {transaction.items.map((item, idx) => (
            <tr key={item.id} className="hover:bg-slate-50">
              <td className="border-r border-slate-800 px-2 py-2 text-center font-mono">{item.quantity}</td>
              <td className="border-r border-slate-800 px-2 py-2 text-center">{item.unit}</td>
              <td className="border-r border-slate-800 px-2 py-2 text-right font-mono">{formatPHP(item.unitPrice)}</td>
              <td className="border-r border-slate-800 px-2 py-2 text-right font-mono font-bold text-slate-900">
                {formatPHP(item.totalAmount)}
              </td>
              <td className="border-r border-slate-800 px-2 py-2">
                <div className="font-semibold text-slate-900">{item.description}</div>
                <div className="text-[10px] text-slate-500">
                  Tag: DEPED-MNHS-2026-SEP-00{idx + 1} · Property Sticker Affixed
                </div>
              </td>
              <td className="border-r border-slate-800 px-2 py-2 text-center font-mono text-[11px]">
                DEPED-{school.schoolId}-2026-{idx + 1}
              </td>
              <td className="px-2 py-2 text-center text-xs font-medium">5 Years</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="border-t-2 border-slate-800 font-bold bg-slate-50">
          <tr>
            <td colSpan={3} className="border-r border-slate-800 px-2 py-2 text-right uppercase">
              Total Semi-Expendable Property Value:
            </td>
            <td className="border-r border-slate-800 px-2 py-2 text-right font-mono font-extrabold text-emerald-900">
              {formatPHP(transaction.grossAmount)}
            </td>
            <td colSpan={3} className="px-2 py-2 text-slate-500 text-[10px] italic">
              (All units under ₱50,000.00 COA Threshold)
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Dual Signatures: Received from (Property Custodian) vs Received by (End-User) */}
      <div className="grid grid-cols-2 border border-slate-800 divide-x divide-slate-800 text-xs">
        <div className="p-4 text-center space-y-6">
          <div className="text-left font-semibold text-slate-700">Received from:</div>
          <div className="pt-2">
            <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
              {school.propertyCustodianName}
            </div>
            <div className="text-[11px] text-slate-600">{school.propertyCustodianTitle}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Signature over Printed Name of Supply Officer</div>
            <div className="text-[10px] text-slate-500 mt-2">Date: {transaction.receiptDate}</div>
          </div>
        </div>

        <div className="p-4 text-center space-y-6">
          <div className="text-left font-semibold text-slate-700">Received by:</div>
          <div className="pt-2">
            <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
              {school.requisitionerName}
            </div>
            <div className="text-[11px] text-slate-600">{school.requisitionerTitle}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Signature over Printed Name of End-User</div>
            <div className="text-[10px] text-slate-500 mt-2">Date: {transaction.receiptDate}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
