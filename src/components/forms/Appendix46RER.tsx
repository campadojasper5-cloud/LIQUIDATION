import React from 'react';
import { Transaction, SchoolProfile, CashAdvance } from '../../types';
import { formatPHP } from '../../utils/taxCalculator';

interface Appendix46Props {
  transaction: Transaction;
  school: SchoolProfile;
  cashAdvance: CashAdvance;
}

export const Appendix46RER: React.FC<Appendix46Props> = ({
  transaction,
  school,
  cashAdvance,
}) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-300 shadow-sm text-slate-900 font-sans print-page max-w-2xl mx-auto">
      <div className="text-right text-[11px] font-mono font-bold tracking-wider text-slate-500 mb-2">
        Appendix 46
      </div>

      <div className="text-center space-y-0.5 border-b-2 border-slate-900 pb-3 mb-4">
        <div className="text-xs font-serif uppercase tracking-widest text-slate-600">Republic of the Philippines</div>
        <div className="text-sm font-bold uppercase tracking-wider text-slate-900">Department of Education</div>
        <div className="text-xs font-semibold text-slate-800">{school.region} · {school.division}</div>
        <div className="text-sm font-bold text-slate-900 mt-1">{school.schoolName.toUpperCase()}</div>
        <div className="pt-2 text-base font-extrabold uppercase tracking-wide text-slate-900">
          REIMBURSEMENT EXPENSE RECEIPT (RER)
        </div>
        <div className="text-[11px] text-slate-600">
          (For Expenses Exceeding ₱300.00 Where No Official Receipt Could Be Obtained)
        </div>
      </div>

      <div className="text-right text-xs font-mono mb-4">
        <span className="font-semibold text-slate-600">RER No.: </span>
        <span className="font-bold">{transaction.receiptNo}</span>
        <br />
        <span className="font-semibold text-slate-600">Date: </span>
        <span>{transaction.date}</span>
      </div>

      <div className="border border-slate-800 p-4 space-y-4 text-xs leading-relaxed mb-6">
        <div>
          RECEIVED from <strong className="border-b border-slate-900 pb-0.5 px-2 font-bold uppercase">{school.disbursingOfficerName}</strong>,
          Special Disbursing Officer of {school.schoolName}, the sum of{' '}
          <strong className="font-mono font-bold border-b border-slate-900 pb-0.5 px-2">{formatPHP(transaction.grossAmount)}</strong> in payment of:
        </div>

        <div className="bg-slate-50 p-3 rounded border border-slate-200">
          <div className="font-bold text-slate-900 mb-1">Particulars / Route / Activity:</div>
          <p className="text-slate-800 italic">{transaction.particulars}</p>
        </div>

        <table className="w-full text-xs border border-slate-800 border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-800 font-bold">
              <th className="px-2 py-1 text-left">Item Description</th>
              <th className="px-2 py-1 text-center w-16">Unit</th>
              <th className="px-2 py-1 text-center w-16">Qty</th>
              <th className="px-2 py-1 text-right w-24">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {transaction.items.map((item) => (
              <tr key={item.id}>
                <td className="px-2 py-1">{item.description}</td>
                <td className="px-2 py-1 text-center">{item.unit}</td>
                <td className="px-2 py-1 text-center font-mono">{item.quantity}</td>
                <td className="px-2 py-1 text-right font-mono font-semibold">{formatPHP(item.totalAmount)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-slate-800 font-bold bg-slate-50">
            <tr>
              <td colSpan={3} className="px-2 py-1 text-right">TOTAL:</td>
              <td className="px-2 py-1 text-right font-mono">{formatPHP(transaction.grossAmount)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Payee / Driver / Operator Signature */}
      <div className="grid grid-cols-2 gap-6 pt-4 text-xs">
        <div className="text-center pt-6">
          <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
            {transaction.payeeName}
          </div>
          <div className="text-[11px] text-slate-600">Signature of Payee / Operator / Vendor</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Address: {transaction.payeeAddress}</div>
        </div>

        <div className="text-center pt-6">
          <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
            {school.disbursingOfficerName}
          </div>
          <div className="text-[11px] text-slate-600">{school.disbursingOfficerTitle}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Disbursing Officer / Claimant</div>
        </div>
      </div>
    </div>
  );
};
