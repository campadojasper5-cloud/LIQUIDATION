import React from 'react';
import { Transaction, SchoolProfile, CashAdvance } from '../../types';
import { formatPHP } from '../../utils/taxCalculator';

interface Coa2017CertificateProps {
  transaction: Transaction;
  school: SchoolProfile;
  cashAdvance: CashAdvance;
}

export const Coa2017Certificate: React.FC<Coa2017CertificateProps> = ({
  transaction,
  school,
  cashAdvance,
}) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-300 shadow-sm text-slate-900 font-sans print-page max-w-2xl mx-auto">
      <div className="text-right text-[11px] font-mono font-bold tracking-wider text-slate-500 mb-2">
        COA Circular No. 2017-001
      </div>

      <div className="text-center space-y-0.5 border-b-2 border-slate-900 pb-3 mb-4">
        <div className="text-xs font-serif uppercase tracking-widest text-slate-600">Republic of the Philippines</div>
        <div className="text-sm font-bold uppercase tracking-wider text-slate-900">Department of Education</div>
        <div className="text-xs font-semibold text-slate-800">{school.region} · {school.division}</div>
        <div className="text-sm font-bold text-slate-900 mt-1">{school.schoolName.toUpperCase()}</div>
        <div className="pt-2 text-base font-extrabold uppercase tracking-wide text-slate-900">
          CERTIFICATION OF EXPENSES NOT REQUIRING RECEIPTS (CENRR)
        </div>
        <div className="text-[11px] text-slate-600 font-medium">
          Pursuant to COA Circular No. 2017-001 (Expenses Not Exceeding ₱300.00 Per Claim)
        </div>
      </div>

      <div className="border border-slate-800 p-4 space-y-4 text-xs leading-relaxed mb-6">
        <p>
          I hereby certify that the following expenses in the total amount of{' '}
          <strong className="font-mono font-bold border-b border-slate-900 pb-0.5 px-2">{formatPHP(transaction.grossAmount)}</strong>{' '}
          were incurred in connection with official school operations and student support services, where the issuance of official
          receipts is not customary or practicable:
        </p>

        <table className="w-full text-xs border border-slate-800 border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-800 font-bold">
              <th className="px-2 py-1 text-center w-16">Date</th>
              <th className="px-2 py-1 text-left">Nature of Expense / Description</th>
              <th className="px-2 py-1 text-right w-24">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {transaction.items.map((item) => (
              <tr key={item.id}>
                <td className="px-2 py-1 text-center font-mono">{transaction.date}</td>
                <td className="px-2 py-1">{item.description} ({item.quantity} {item.unit})</td>
                <td className="px-2 py-1 text-right font-mono font-semibold">{formatPHP(item.totalAmount)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-slate-800 font-bold bg-slate-50">
            <tr>
              <td colSpan={2} className="px-2 py-1 text-right">TOTAL:</td>
              <td className="px-2 py-1 text-right font-mono text-emerald-900">{formatPHP(transaction.grossAmount)}</td>
            </tr>
          </tfoot>
        </table>

        <p className="text-[11px] text-slate-600 italic">
          I further certify that each individual purchase or disbursement does not exceed ₱300.00, and is charged to the School's
          Regular MOOE Allocation for the month of {cashAdvance.periodMonth} {cashAdvance.periodYear}.
        </p>
      </div>

      {/* Certification Signatures */}
      <div className="grid grid-cols-2 gap-8 pt-4 text-xs">
        <div className="text-center pt-6">
          <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
            {transaction.payeeName}
          </div>
          <div className="text-[11px] text-slate-600">Employee / Claimant Signature</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Date: {transaction.receiptDate}</div>
        </div>

        <div className="text-center pt-6">
          <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
            {school.schoolHeadName}
          </div>
          <div className="text-[11px] text-slate-600">{school.schoolHeadTitle}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Approving Official / Principal</div>
        </div>
      </div>
    </div>
  );
};
