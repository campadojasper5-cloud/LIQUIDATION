import React from 'react';
import { Transaction, SchoolProfile, CashAdvance } from '../../types';

interface Appendix62Props {
  transaction: Transaction;
  school: SchoolProfile;
  cashAdvance: CashAdvance;
}

export const Appendix62IAR: React.FC<Appendix62Props> = ({
  transaction,
  school,
  cashAdvance,
}) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-300 shadow-sm text-slate-900 font-sans print-page">
      <div className="text-right text-[11px] font-mono font-bold tracking-wider text-slate-500 mb-2">
        Appendix 62
      </div>

      <div className="text-center space-y-0.5 border-b-2 border-slate-900 pb-3 mb-4">
        <div className="text-xs font-serif uppercase tracking-widest text-slate-600">Republic of the Philippines</div>
        <div className="text-sm font-bold uppercase tracking-wider text-slate-900">Department of Education</div>
        <div className="text-xs font-semibold text-slate-800">{school.region} · {school.division}</div>
        <div className="text-sm font-bold text-slate-900 mt-1">{school.schoolName.toUpperCase()}</div>
        <div className="pt-2 text-base font-extrabold uppercase tracking-wide text-slate-900">
          INSPECTION AND ACCEPTANCE REPORT (IAR)
        </div>
      </div>

      <div className="grid grid-cols-2 text-xs border border-slate-800 mb-4 divide-x divide-slate-800">
        <div className="p-2 space-y-1">
          <div>
            <span className="font-semibold">Supplier: </span>
            <span className="font-bold">{transaction.payeeName}</span>
          </div>
          <div>
            <span className="font-semibold">PO No./Date: </span>
            <span className="font-mono">PO-2026-10-{transaction.id.replace('TX-', '')} ({transaction.date})</span>
          </div>
          <div>
            <span className="font-semibold">Requisitioning Dept: </span>
            <span>{school.requisitionerTitle}</span>
          </div>
        </div>
        <div className="p-2 space-y-1">
          <div>
            <span className="font-semibold">IAR No.: </span>
            <span className="font-mono font-bold">IAR-2026-10-{transaction.id.replace('TX-', '')}</span>
          </div>
          <div>
            <span className="font-semibold">Date Inspected: </span>
            <span>{transaction.receiptDate}</span>
          </div>
          <div>
            <span className="font-semibold">Invoice / DR No.: </span>
            <span className="font-mono">{transaction.receiptType} #{transaction.receiptNo}</span>
          </div>
        </div>
      </div>

      <table className="w-full text-xs border border-slate-800 border-collapse mb-4">
        <thead>
          <tr className="bg-slate-100 border-b border-slate-800 font-bold text-center">
            <th className="border-r border-slate-800 px-2 py-2 w-16">Item No.</th>
            <th className="border-r border-slate-800 px-2 py-2">Item Description / Specifications</th>
            <th className="border-r border-slate-800 px-2 py-2 w-20">Unit</th>
            <th className="px-2 py-2 w-24">Quantity</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-300">
          {transaction.items.map((item, idx) => (
            <tr key={item.id} className="hover:bg-slate-50">
              <td className="border-r border-slate-800 px-2 py-2 text-center font-mono">{idx + 1}</td>
              <td className="border-r border-slate-800 px-2 py-2 font-medium">{item.description}</td>
              <td className="border-r border-slate-800 px-2 py-2 text-center">{item.unit}</td>
              <td className="px-2 py-2 text-center font-mono font-bold">{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Dual Section: Inspection vs Acceptance */}
      <div className="grid grid-cols-2 border border-slate-800 divide-x divide-slate-800 text-xs">
        {/* Inspection Section */}
        <div className="p-3 space-y-4">
          <div className="bg-slate-100 font-bold px-2 py-1 border border-slate-800 text-center uppercase">
            INSPECTION COMMITTEE
          </div>
          <p className="text-[11px] text-slate-700 italic leading-relaxed">
            Date Inspected: <strong>{transaction.receiptDate}</strong>
            <br />
            Inspected, verified, and found in order as to quantity, brand, and technical specifications.
          </p>

          <div className="space-y-4 pt-2">
            <div className="text-center">
              <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
                {school.inspectorateChair}
              </div>
              <div className="text-[11px] text-slate-600">{school.inspectorateChairTitle}</div>
              <div className="text-[10px] text-slate-400">Inspectorate Team Leader</div>
            </div>

            {school.inspectorateMembers.slice(0, 1).map((m) => (
              <div key={m.id} className="text-center pt-2">
                <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
                  {m.name}
                </div>
                <div className="text-[11px] text-slate-600">{m.positionTitle}</div>
                <div className="text-[10px] text-slate-400">Technical Inspector / Evaluator</div>
              </div>
            ))}
          </div>
        </div>

        {/* Acceptance Section */}
        <div className="p-3 space-y-4">
          <div className="bg-slate-100 font-bold px-2 py-1 border border-slate-800 text-center uppercase">
            ACCEPTANCE
          </div>
          <p className="text-[11px] text-slate-700 italic leading-relaxed">
            Date Received: <strong>{transaction.receiptDate}</strong>
            <br />
            [ ✓ ] Complete Delivery
            <br />
            [ &nbsp; ] Partial Delivery
          </p>

          <div className="text-center pt-10">
            <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
              {school.propertyCustodianName}
            </div>
            <div className="text-[11px] text-slate-600">{school.propertyCustodianTitle}</div>
            <div className="text-[10px] text-slate-400 mt-1">Property Custodian / Supply Officer</div>
          </div>
        </div>
      </div>
    </div>
  );
};
