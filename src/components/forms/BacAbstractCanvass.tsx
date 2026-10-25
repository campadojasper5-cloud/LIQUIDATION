import React from 'react';
import { Transaction, SchoolProfile, CashAdvance } from '../../types';
import { formatPHP } from '../../utils/taxCalculator';

interface BacAbstractCanvassProps {
  transaction: Transaction;
  school: SchoolProfile;
  cashAdvance: CashAdvance;
}

export const BacAbstractCanvass: React.FC<BacAbstractCanvassProps> = ({
  transaction,
  school,
  cashAdvance,
}) => {
  const winningAmount = transaction.grossAmount;
  const bid2 = Math.round(winningAmount * 1.05 * 100) / 100;
  const bid3 = Math.round(winningAmount * 1.09 * 100) / 100;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-300 shadow-sm text-slate-900 font-sans print-page">
      <div className="text-right text-[11px] font-mono font-bold tracking-wider text-slate-500 mb-2">
        RA 9184 Small Value Procurement
      </div>

      <div className="text-center space-y-0.5 border-b-2 border-slate-900 pb-3 mb-4">
        <div className="text-xs font-serif uppercase tracking-widest text-slate-600">Republic of the Philippines</div>
        <div className="text-sm font-bold uppercase tracking-wider text-slate-900">Department of Education</div>
        <div className="text-xs font-semibold text-slate-800">{school.region} · {school.division}</div>
        <div className="text-sm font-bold text-slate-900 mt-1">{school.schoolName.toUpperCase()}</div>
        <div className="pt-2 text-base font-extrabold uppercase tracking-wide text-slate-900">
          ABSTRACT OF QUOTATIONS / CANVASS
        </div>
        <div className="text-xs font-semibold text-slate-700">
          Bids and Awards Committee (BAC) Evaluation &amp; Award Recommendation
        </div>
      </div>

      <div className="grid grid-cols-2 text-xs border border-slate-800 mb-4 divide-x divide-slate-800">
        <div className="p-2 space-y-1">
          <div>
            <span className="font-semibold">Project Title / Purpose: </span>
            <span>{transaction.particulars}</span>
          </div>
          <div>
            <span className="font-semibold">PR Reference No.: </span>
            <span className="font-mono">PR-2026-10-{transaction.id.replace('TX-', '')}</span>
          </div>
        </div>
        <div className="p-2 space-y-1">
          <div>
            <span className="font-semibold">Approved Budget for Contract (ABC): </span>
            <span className="font-mono font-bold">{formatPHP(Math.round(winningAmount * 1.1))}</span>
          </div>
          <div>
            <span className="font-semibold">Date of Canvass Opening: </span>
            <span>{transaction.date}</span>
          </div>
        </div>
      </div>

      {/* Abstract Canvass Comparison Table */}
      <table className="w-full text-xs border border-slate-800 border-collapse mb-4">
        <thead>
          <tr className="bg-slate-100 border-b border-slate-800 font-bold text-center">
            <th className="border-r border-slate-800 px-2 py-2">Item Description</th>
            <th className="border-r border-slate-800 px-2 py-2 w-14">Qty</th>
            <th className="border-r border-slate-800 px-2 py-2 w-32 bg-emerald-50 text-emerald-900">
              1. {transaction.payeeName} (Winning Bidder)
            </th>
            <th className="border-r border-slate-800 px-2 py-2 w-32">2. Cebu Premier Mart</th>
            <th className="px-2 py-2 w-32">3. Visayas Unified Supply</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-300">
          {transaction.items.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50">
              <td className="border-r border-slate-800 px-2 py-1.5 font-medium">{item.description}</td>
              <td className="border-r border-slate-800 px-2 py-1.5 text-center font-mono">
                {item.quantity} {item.unit}
              </td>
              <td className="border-r border-slate-800 px-2 py-1.5 text-right font-mono font-bold text-emerald-900 bg-emerald-50/40">
                {formatPHP(item.totalAmount)}
              </td>
              <td className="border-r border-slate-800 px-2 py-1.5 text-right font-mono text-slate-600">
                {formatPHP(Math.round(item.totalAmount * 1.05 * 100) / 100)}
              </td>
              <td className="px-2 py-1.5 text-right font-mono text-slate-600">
                {formatPHP(Math.round(item.totalAmount * 1.09 * 100) / 100)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="border-t-2 border-slate-800 font-bold bg-slate-50">
          <tr>
            <td colSpan={2} className="border-r border-slate-800 px-2 py-2 text-right uppercase">
              Total Quotation / Bid:
            </td>
            <td className="border-r border-slate-800 px-2 py-2 text-right font-mono font-extrabold text-emerald-900 bg-emerald-100/50">
              {formatPHP(winningAmount)}
            </td>
            <td className="border-r border-slate-800 px-2 py-2 text-right font-mono text-slate-700">
              {formatPHP(bid2)}
            </td>
            <td className="px-2 py-2 text-right font-mono text-slate-700">
              {formatPHP(bid3)}
            </td>
          </tr>
          <tr className="text-[10px] bg-slate-100 border-t border-slate-300">
            <td colSpan={2} className="border-r border-slate-800 px-2 py-1 text-right font-semibold">
              Evaluation Result:
            </td>
            <td className="border-r border-slate-800 px-2 py-1 text-center font-bold text-emerald-800">
              Lowest Calculated &amp; Responsive Quotation (LCRQ)
            </td>
            <td className="border-r border-slate-800 px-2 py-1 text-center text-slate-500">Non-Winning</td>
            <td className="px-2 py-1 text-center text-slate-500">Non-Winning</td>
          </tr>
        </tfoot>
      </table>

      {/* BAC Recommendation */}
      <div className="border border-slate-800 p-2.5 text-xs text-slate-800 leading-relaxed mb-4">
        <strong>BAC RESOLUTION &amp; RECOMMENDATION: </strong>
        We, the members of the Bids and Awards Committee (BAC), after careful canvass and evaluation of quotations
        submitted by three (3) legitimate registered suppliers, hereby recommend that the contract/Purchase Order be
        awarded to <strong className="uppercase font-bold">{transaction.payeeName}</strong> as having submitted the{' '}
        <em>Lowest Calculated and Responsive Quotation (LCRQ)</em> conforming to all technical requirements.
      </div>

      {/* Complete Auto-Inserted BAC Committee Signatures */}
      <div className="border border-slate-800 p-4 space-y-4 text-xs">
        <div className="font-bold text-slate-900 uppercase tracking-wide text-center pb-2 border-b border-slate-200">
          BIDS AND AWARDS COMMITTEE (BAC)
        </div>

        {/* Chair & Vice-Chair */}
        <div className="grid grid-cols-2 gap-8 text-center pt-2">
          <div>
            <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
              {school.bacChairperson}
            </div>
            <div className="text-[11px] text-slate-600">{school.bacChairpersonTitle}</div>
            <div className="text-[10px] text-slate-400">BAC Chairperson</div>
          </div>

          <div>
            <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
              {school.bacViceChair}
            </div>
            <div className="text-[11px] text-slate-600">{school.bacViceChairTitle}</div>
            <div className="text-[10px] text-slate-400">BAC Vice-Chairperson</div>
          </div>
        </div>

        {/* Regular Members */}
        <div className="grid grid-cols-3 gap-4 text-center pt-4">
          {school.bacMembers.map((member) => (
            <div key={member.id}>
              <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
                {member.name}
              </div>
              <div className="text-[11px] text-slate-600">{member.positionTitle}</div>
              <div className="text-[10px] text-slate-400">{member.designation}</div>
            </div>
          ))}
        </div>

        {/* Secretariat & Approved By */}
        <div className="grid grid-cols-2 gap-8 text-center pt-6 border-t border-slate-200">
          <div>
            <div className="text-left font-semibold text-slate-600 text-[10px] mb-4">Attested by:</div>
            <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
              {school.bacSecretariat}
            </div>
            <div className="text-[11px] text-slate-600">{school.bacSecretariatTitle}</div>
            <div className="text-[10px] text-slate-400">BAC Secretariat Head</div>
          </div>

          <div>
            <div className="text-left font-semibold text-slate-600 text-[10px] mb-4">Approved by:</div>
            <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
              {school.schoolHeadName}
            </div>
            <div className="text-[11px] text-slate-600">{school.schoolHeadTitle}</div>
            <div className="text-[10px] text-slate-400">Head of Procuring Entity (HoPE)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
