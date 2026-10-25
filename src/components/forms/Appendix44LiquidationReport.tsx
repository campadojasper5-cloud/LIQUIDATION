import React from 'react';
import { SchoolProfile, CashAdvance, Transaction, AuditEvaluation } from '../../types';
import { formatPHP } from '../../utils/taxCalculator';

interface Appendix44Props {
  school: SchoolProfile;
  cashAdvance: CashAdvance;
  transactions: Transaction[];
  evaluation: AuditEvaluation;
}

export const Appendix44LiquidationReport: React.FC<Appendix44Props> = ({
  school,
  cashAdvance,
  transactions,
  evaluation,
}) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-300 shadow-sm text-slate-900 font-sans print-page">
      {/* Official GAM Header */}
      <div className="text-right text-[11px] font-mono font-bold tracking-wider text-slate-500 mb-2">
        Appendix 44
      </div>

      <div className="text-center space-y-0.5 border-b-2 border-slate-900 pb-3 mb-4">
        <div className="text-xs font-serif uppercase tracking-widest text-slate-600">Republic of the Philippines</div>
        <div className="text-sm font-bold uppercase tracking-wider text-slate-900">Department of Education</div>
        <div className="text-xs font-semibold text-slate-800">{school.region}</div>
        <div className="text-xs font-medium text-slate-700">{school.division}</div>
        <div className="text-sm font-bold text-slate-900 mt-1">{school.schoolName.toUpperCase()}</div>
        <div className="text-xs text-slate-600">School ID: {school.schoolId} · {school.schoolAddress}</div>
        <div className="pt-2 text-base font-extrabold uppercase tracking-wide text-slate-900">
          LIQUIDATION REPORT
        </div>
        <div className="text-xs font-semibold text-slate-700">
          Period Covered: {cashAdvance.periodMonth} {cashAdvance.periodYear}
        </div>
      </div>

      {/* Meta Grid */}
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
            <span className="font-semibold">Liquidation Report No.: </span>
            <span className="font-mono">LR-{cashAdvance.periodYear}-{cashAdvance.periodMonth.slice(0, 3).toUpperCase()}-001</span>
          </div>
          <div>
            <span className="font-semibold">Date Prepared: </span>
            <span>{cashAdvance.sdoSubmissionDeadline}</span>
          </div>
        </div>
      </div>

      {/* Main Liquidation Table */}
      <table className="w-full text-xs border border-slate-800 border-collapse mb-4">
        <thead>
          <tr className="bg-slate-100 border-b border-slate-800 font-bold text-center">
            <th className="border-r border-slate-800 px-2 py-2 w-24">Date</th>
            <th className="border-r border-slate-800 px-2 py-2 w-28">DV / Check No.</th>
            <th className="border-r border-slate-800 px-2 py-2">Particulars / Payee</th>
            <th className="border-r border-slate-800 px-2 py-2 w-28 text-right">Gross Amount</th>
            <th className="border-r border-slate-800 px-2 py-2 w-24 text-right">Tax Withheld</th>
            <th className="px-2 py-2 w-28 text-right">Net Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-300">
          {/* Beginning Cash Advance Row */}
          <tr className="bg-slate-50 font-semibold border-b border-slate-800">
            <td className="border-r border-slate-800 px-2 py-1.5 text-center font-mono">{cashAdvance.cashDrawnDate}</td>
            <td className="border-r border-slate-800 px-2 py-1.5 text-center font-mono">{cashAdvance.checkNo}</td>
            <td className="border-r border-slate-800 px-2 py-1.5 font-bold text-slate-900">
              CASH ADVANCE GRANTED FOR {cashAdvance.periodMonth.toUpperCase()} {cashAdvance.periodYear} (DV #{cashAdvance.dvNo})
            </td>
            <td className="border-r border-slate-800 px-2 py-1.5 text-right font-mono font-bold text-slate-900">
              {formatPHP(cashAdvance.amountGranted)}
            </td>
            <td className="border-r border-slate-800 px-2 py-1.5 text-right font-mono">-</td>
            <td className="px-2 py-1.5 text-right font-mono font-bold">
              {formatPHP(cashAdvance.amountGranted)}
            </td>
          </tr>

          {/* Section: Less Disbursements */}
          <tr>
            <td colSpan={6} className="bg-slate-100 px-2 py-1 font-bold italic text-slate-700 border-b border-slate-800">
              LESS: DISBURSEMENTS / EXPENDITURES LIQUIDATED:
            </td>
          </tr>

          {transactions.map((tx) => (
            <tr key={tx.id} className="hover:bg-slate-50">
              <td className="border-r border-slate-800 px-2 py-1.5 text-center font-mono text-[11px]">{tx.date}</td>
              <td className="border-r border-slate-800 px-2 py-1.5 text-center font-mono text-[11px]">
                {tx.dvNo} / {tx.checkOrRefNo}
              </td>
              <td className="border-r border-slate-800 px-2 py-1.5">
                <div className="font-semibold text-slate-900">{tx.payeeName}</div>
                <div className="text-[11px] text-slate-600">{tx.particulars}</div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {tx.receiptType} #{tx.receiptNo}
                </div>
              </td>
              <td className="border-r border-slate-800 px-2 py-1.5 text-right font-mono font-semibold">
                {formatPHP(tx.grossAmount)}
              </td>
              <td className="border-r border-slate-800 px-2 py-1.5 text-right font-mono text-purple-800">
                {formatPHP(tx.tax.totalTaxWithheld)}
              </td>
              <td className="px-2 py-1.5 text-right font-mono font-bold text-slate-900">
                {formatPHP(tx.tax.netAmountPaid)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="border-t-2 border-slate-800 font-bold bg-slate-50">
          <tr>
            <td colSpan={3} className="border-r border-slate-800 px-2 py-2 text-right uppercase">
              Total Disbursements:
            </td>
            <td className="border-r border-slate-800 px-2 py-2 text-right font-mono text-slate-900">
              {formatPHP(evaluation.totalDisbursedGross)}
            </td>
            <td className="border-r border-slate-800 px-2 py-2 text-right font-mono text-purple-900">
              {formatPHP(evaluation.totalTaxWithheld)}
            </td>
            <td className="px-2 py-2 text-right font-mono text-emerald-900">
              {formatPHP(evaluation.totalNetPaid)}
            </td>
          </tr>
          <tr className="bg-slate-100 border-t border-slate-800 text-sm">
            <td colSpan={3} className="border-r border-slate-800 px-2 py-2 text-right uppercase font-extrabold">
              Remaining Unliquidated Balance (Refund / Cash on Hand):
            </td>
            <td colSpan={3} className="px-3 py-2 text-right font-mono font-extrabold text-base text-slate-900">
              {formatPHP(evaluation.remainingCashBalance)}
              {evaluation.is100PercentLiquidated && (
                <span className="ml-2 text-xs font-sans text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  100% FULLY LIQUIDATED (COA CIRCULAR 97-002)
                </span>
              )}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Official Signatory Boxes (GAM Standard) */}
      <div className="grid grid-cols-2 border border-slate-800 divide-x divide-slate-800 text-xs">
        {/* Certification Section */}
        <div className="p-3 space-y-8">
          <div className="font-semibold text-slate-800 leading-tight">
            A. CERTIFIED: I hereby certify that the period covered by this Liquidation Report is true and correct, and
            that all disbursements were incurred in accordance with law and COA accounting and auditing rules.
          </div>

          <div className="grid grid-cols-2 gap-4 text-center pt-4">
            <div>
              <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
                {school.disbursingOfficerName}
              </div>
              <div className="text-[11px] text-slate-600">{school.disbursingOfficerTitle}</div>
              <div className="text-[10px] text-slate-400 mt-1">Special Disbursing Officer</div>
              <div className="text-[10px] text-slate-500 mt-2">Date: ____________________</div>
            </div>

            <div>
              <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
                {school.schoolHeadName}
              </div>
              <div className="text-[11px] text-slate-600">{school.schoolHeadTitle}</div>
              <div className="text-[10px] text-slate-400 mt-1">Approving Official / Principal</div>
              <div className="text-[10px] text-slate-500 mt-2">Date: ____________________</div>
            </div>
          </div>
        </div>

        {/* Verification Section */}
        <div className="p-3 space-y-8">
          <div className="font-semibold text-slate-800 leading-tight">
            B. VERIFIED &amp; ACCEPTED: (Division Office Accounting Unit)
            <br />
            I certify that I have verified the supporting documents and found the disbursements in order as to
            mathematical accuracy, complete attachments, and tax withholding compliance.
          </div>

          <div className="text-center pt-4 max-w-xs mx-auto">
            <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
              {school.divisionAccountantName}
            </div>
            <div className="text-[11px] text-slate-600">{school.divisionAccountantTitle}</div>
            <div className="text-[10px] text-slate-400 mt-1">Division Accountant / SDO Accounting Unit</div>
            <div className="text-[10px] text-slate-500 mt-2">Date Received: ____________________</div>
          </div>
        </div>
      </div>
    </div>
  );
};
