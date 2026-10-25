import React from 'react';
import { SchoolProfile, CashAdvance, Transaction, AuditEvaluation } from '../../types';
import { formatPHP } from '../../utils/taxCalculator';

interface Appendix43Props {
  school: SchoolProfile;
  cashAdvance: CashAdvance;
  transactions: Transaction[];
  evaluation: AuditEvaluation;
}

export const Appendix43CashDisbursementRegister: React.FC<Appendix43Props> = ({
  school,
  cashAdvance,
  transactions,
  evaluation,
}) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-300 shadow-sm text-slate-900 font-sans print-page">
      {/* Official Header */}
      <div className="text-right text-[11px] font-mono font-bold tracking-wider text-slate-500 mb-2">
        Appendix 43
      </div>

      <div className="text-center space-y-0.5 border-b-2 border-slate-900 pb-3 mb-4">
        <div className="text-xs font-serif uppercase tracking-widest text-slate-600">Republic of the Philippines</div>
        <div className="text-sm font-bold uppercase tracking-wider text-slate-900">Department of Education</div>
        <div className="text-xs font-semibold text-slate-800">{school.region} · {school.division}</div>
        <div className="text-sm font-bold text-slate-900 mt-1">{school.schoolName.toUpperCase()}</div>
        <div className="pt-2 text-base font-extrabold uppercase tracking-wide text-slate-900">
          CASH DISBURSEMENT REGISTER (CDR)
        </div>
        <div className="text-xs font-semibold text-slate-700">
          For the Month of {cashAdvance.periodMonth} {cashAdvance.periodYear}
        </div>
      </div>

      {/* Meta Grid */}
      <div className="grid grid-cols-2 text-xs border border-slate-800 mb-4 divide-x divide-slate-800">
        <div className="p-2 space-y-1">
          <div>
            <span className="font-semibold">Entity Name: </span>
            <span>{school.schoolName} (School ID: {school.schoolId})</span>
          </div>
          <div>
            <span className="font-semibold">Fund Cluster: </span>
            <span className="font-mono">01 - Regular Agency Fund (MOOE)</span>
          </div>
        </div>
        <div className="p-2 space-y-1">
          <div>
            <span className="font-semibold">Accountable Officer: </span>
            <span className="font-bold">{school.disbursingOfficerName}</span>
          </div>
          <div>
            <span className="font-semibold">Official Designation: </span>
            <span>{school.disbursingOfficerTitle}</span>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[11px] border border-slate-800 border-collapse mb-4">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-800 font-bold text-center">
              <th className="border-r border-slate-800 px-1.5 py-1.5 w-16">Date</th>
              <th className="border-r border-slate-800 px-1.5 py-1.5 w-24">Serial / DV No.</th>
              <th className="border-r border-slate-800 px-1.5 py-1.5 w-20">Check No.</th>
              <th className="border-r border-slate-800 px-2 py-1.5">Payee</th>
              <th className="border-r border-slate-800 px-2 py-1.5">Nature of Payment</th>
              <th className="border-r border-slate-800 px-1.5 py-1.5 w-20 text-right">Gross (Dr)</th>
              <th className="border-r border-slate-800 px-1.5 py-1.5 w-20 text-right">Tax (Cr)</th>
              <th className="px-1.5 py-1.5 w-20 text-right">Net Paid (Cr)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-300">
            {/* Cash Advance Inflow Entry */}
            <tr className="bg-slate-50 font-semibold border-b border-slate-800">
              <td className="border-r border-slate-800 px-1.5 py-1 text-center font-mono">{cashAdvance.cashDrawnDate}</td>
              <td className="border-r border-slate-800 px-1.5 py-1 text-center font-mono">{cashAdvance.dvNo}</td>
              <td className="border-r border-slate-800 px-1.5 py-1 text-center font-mono">{cashAdvance.checkNo}</td>
              <td className="border-r border-slate-800 px-2 py-1 font-bold text-slate-900">{school.disbursingOfficerName}</td>
              <td className="border-r border-slate-800 px-2 py-1 font-semibold text-slate-800">
                To record receipt of Cash Advance for {cashAdvance.periodMonth} {cashAdvance.periodYear} MOOE
              </td>
              <td className="border-r border-slate-800 px-1.5 py-1 text-right font-mono font-bold text-slate-900">
                {formatPHP(cashAdvance.amountGranted)}
              </td>
              <td className="border-r border-slate-800 px-1.5 py-1 text-right font-mono">-</td>
              <td className="px-1.5 py-1 text-right font-mono font-bold">{formatPHP(cashAdvance.amountGranted)}</td>
            </tr>

            {/* Disbursements */}
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50">
                <td className="border-r border-slate-800 px-1.5 py-1 text-center font-mono">{tx.date}</td>
                <td className="border-r border-slate-800 px-1.5 py-1 text-center font-mono">{tx.dvNo}</td>
                <td className="border-r border-slate-800 px-1.5 py-1 text-center font-mono">{tx.checkOrRefNo}</td>
                <td className="border-r border-slate-800 px-2 py-1 font-medium">{tx.payeeName}</td>
                <td className="border-r border-slate-800 px-2 py-1 text-slate-600 line-clamp-1">{tx.particulars}</td>
                <td className="border-r border-slate-800 px-1.5 py-1 text-right font-mono">{formatPHP(tx.grossAmount)}</td>
                <td className="border-r border-slate-800 px-1.5 py-1 text-right font-mono text-purple-800">
                  {formatPHP(tx.tax.totalTaxWithheld)}
                </td>
                <td className="px-1.5 py-1 text-right font-mono font-semibold text-slate-900">
                  {formatPHP(tx.tax.netAmountPaid)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2 border-slate-800 font-bold bg-slate-100">
            <tr>
              <td colSpan={5} className="border-r border-slate-800 px-2 py-1.5 text-right uppercase">
                Totals for the Month:
              </td>
              <td className="border-r border-slate-800 px-1.5 py-1.5 text-right font-mono">
                {formatPHP(evaluation.totalDisbursedGross)}
              </td>
              <td className="border-r border-slate-800 px-1.5 py-1.5 text-right font-mono text-purple-900">
                {formatPHP(evaluation.totalTaxWithheld)}
              </td>
              <td className="px-1.5 py-1.5 text-right font-mono text-emerald-900">
                {formatPHP(evaluation.totalNetPaid)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Certification Signature Block */}
      <div className="grid grid-cols-2 gap-8 text-xs pt-4 border-t border-slate-800">
        <div className="text-center space-y-4">
          <p className="text-slate-600 italic">I certify that the entries in this register are true and correct:</p>
          <div className="pt-6">
            <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
              {school.disbursingOfficerName}
            </div>
            <div className="text-[11px] text-slate-600">{school.disbursingOfficerTitle}</div>
            <div className="text-[10px] text-slate-400">Accountable Officer</div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-slate-600 italic">Noted and Verified by:</p>
          <div className="pt-6">
            <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
              {school.schoolHeadName}
            </div>
            <div className="text-[11px] text-slate-600">{school.schoolHeadTitle}</div>
            <div className="text-[10px] text-slate-400">Secondary School Principal IV</div>
          </div>
        </div>
      </div>
    </div>
  );
};
