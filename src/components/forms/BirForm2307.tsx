import React from 'react';
import { Transaction, SchoolProfile, CashAdvance } from '../../types';
import { formatPHP } from '../../utils/taxCalculator';

interface BirForm2307Props {
  transaction: Transaction;
  school: SchoolProfile;
  cashAdvance: CashAdvance;
}

export const BirForm2307: React.FC<BirForm2307Props> = ({
  transaction,
  school,
  cashAdvance,
}) => {
  const ewtAtc = transaction.isGoodsOrServices === 'goods' ? 'WB010' : 'WB020';
  const ewtDesc =
    transaction.isGoodsOrServices === 'goods'
      ? 'Govt payments to local/resident suppliers of goods (1%)'
      : 'Govt payments to local/resident suppliers of services (2%)';

  const vatOrPtAtc = transaction.isVatRegistered ? 'WV010' : 'WB080';
  const vatOrPtDesc = transaction.isVatRegistered
    ? 'Withholding VAT on Government Purchases (5%)'
    : 'Percentage Tax on Government Money Payments (3%)';

  const taxBase = transaction.isVatRegistered
    ? transaction.grossAmount / 1.12
    : transaction.grossAmount;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-300 shadow-sm text-slate-900 font-sans print-page">
      {/* BIR Official Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border border-slate-800 flex items-center justify-center font-bold text-xs bg-slate-100">
            BIR
          </div>
          <div>
            <div className="text-[10px] font-serif uppercase tracking-widest text-slate-500">
              Republika ng Pilipinas · Kagawaran ng Pananalapi
            </div>
            <div className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Kawanihan ng Rentas Internas (Bureau of Internal Revenue)
            </div>
            <div className="text-base font-extrabold tracking-tight text-slate-900">
              Certificate of Creditable Tax Withheld At Source
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-base font-bold font-mono border border-slate-900 px-3 py-1 bg-slate-50 inline-block">
            BIR Form No. 2307
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Revised January 2018 (ENCS)</div>
        </div>
      </div>

      {/* Period Covered */}
      <div className="border border-slate-800 bg-slate-50 p-2 text-xs flex items-center justify-between mb-4">
        <div>
          <span className="font-bold">Period Covered: </span>
          <span>From: {cashAdvance.periodYear}-10-01 To: {cashAdvance.periodYear}-10-31</span>
        </div>
        <div className="font-mono text-[11px]">
          Ref Voucher: {transaction.dvNo} (Check #{transaction.checkOrRefNo})
        </div>
      </div>

      {/* Part I: Payee Information */}
      <div className="border border-slate-800 mb-4 text-xs">
        <div className="bg-slate-200 font-bold px-2 py-1 border-b border-slate-800 uppercase">
          Part I - Payee's Information
        </div>
        <div className="p-2.5 space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1">
              <span className="text-[10px] text-slate-500 block">Payee's TIN</span>
              <span className="font-mono font-bold text-slate-900">{transaction.payeeTIN}</span>
            </div>
            <div className="col-span-2">
              <span className="text-[10px] text-slate-500 block">Payee's Registered Name</span>
              <span className="font-bold text-slate-900 uppercase">{transaction.payeeName}</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block">Registered Address</span>
            <span className="text-slate-800">{transaction.payeeAddress}</span>
          </div>
        </div>
      </div>

      {/* Part II: Payor Information */}
      <div className="border border-slate-800 mb-4 text-xs">
        <div className="bg-slate-200 font-bold px-2 py-1 border-b border-slate-800 uppercase">
          Part II - Payor's Information (Withholding Agent)
        </div>
        <div className="p-2.5 space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1">
              <span className="text-[10px] text-slate-500 block">Payor's TIN</span>
              <span className="font-mono font-bold text-slate-900">{school.tin}</span>
            </div>
            <div className="col-span-2">
              <span className="text-[10px] text-slate-500 block">Payor's Name</span>
              <span className="font-bold text-slate-900 uppercase">DEPARTMENT OF EDUCATION - {school.schoolName}</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block">Registered Address</span>
            <span className="text-slate-800">{school.schoolAddress}</span>
          </div>
        </div>
      </div>

      {/* Part III: Details of Monthly Income Payments & Tax Withheld */}
      <div className="border border-slate-800 mb-4 text-xs overflow-hidden">
        <div className="bg-slate-200 font-bold px-2 py-1 border-b border-slate-800 uppercase">
          Part III - Details of Monthly Income Payments &amp; Tax Withheld
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-800 font-bold text-center">
              <th className="border-r border-slate-800 px-2 py-2">Nature of Income Payment / ATC Description</th>
              <th className="border-r border-slate-800 px-2 py-2 w-20">ATC</th>
              <th className="border-r border-slate-800 px-2 py-2 w-28 text-right">Tax Base</th>
              <th className="border-r border-slate-800 px-2 py-2 w-16 text-center">Rate</th>
              <th className="px-2 py-2 w-28 text-right">Tax Withheld</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-300">
            {/* VAT / PT Line */}
            <tr>
              <td className="border-r border-slate-800 px-2 py-2">{vatOrPtDesc}</td>
              <td className="border-r border-slate-800 px-2 py-2 text-center font-mono font-bold">{vatOrPtAtc}</td>
              <td className="border-r border-slate-800 px-2 py-2 text-right font-mono">{formatPHP(taxBase)}</td>
              <td className="border-r border-slate-800 px-2 py-2 text-center font-mono">
                {transaction.isVatRegistered ? '5%' : '3%'}
              </td>
              <td className="px-2 py-2 text-right font-mono font-bold text-purple-900">
                {formatPHP(transaction.tax.taxTypeAmount)}
              </td>
            </tr>

            {/* EWT Line */}
            <tr>
              <td className="border-r border-slate-800 px-2 py-2">{ewtDesc}</td>
              <td className="border-r border-slate-800 px-2 py-2 text-center font-mono font-bold">{ewtAtc}</td>
              <td className="border-r border-slate-800 px-2 py-2 text-right font-mono">{formatPHP(taxBase)}</td>
              <td className="border-r border-slate-800 px-2 py-2 text-center font-mono">
                {transaction.isGoodsOrServices === 'goods' ? '1%' : '2%'}
              </td>
              <td className="px-2 py-2 text-right font-mono font-bold text-purple-900">
                {formatPHP(transaction.tax.ewtAmount)}
              </td>
            </tr>
          </tbody>
          <tfoot className="border-t-2 border-slate-800 bg-slate-100 font-bold">
            <tr>
              <td colSpan={4} className="border-r border-slate-800 px-2 py-2 text-right uppercase">
                Total Tax Withheld (For BIR Remittance):
              </td>
              <td className="px-2 py-2 text-right font-mono font-extrabold text-purple-900 text-sm">
                {formatPHP(transaction.tax.totalTaxWithheld)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Declaration & Signatures */}
      <div className="border border-slate-800 p-3 text-xs space-y-4">
        <p className="text-slate-700 italic leading-relaxed text-[11px]">
          We declare under the penalties of perjury that this certificate has been made in good faith, verified by us,
          and to the best of our knowledge and belief, is true and correct pursuant to the provisions of the National
          Internal Revenue Code (NIRC), as amended, and the regulations issued under authority thereof.
        </p>

        <div className="grid grid-cols-2 gap-8 pt-4">
          <div className="text-center">
            <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
              {school.schoolHeadName}
            </div>
            <div className="text-[11px] text-slate-600">{school.schoolHeadTitle}</div>
            <div className="text-[10px] text-slate-400 mt-1">
              Payor's Authorized Representative / Withholding Agent
            </div>
          </div>

          <div className="text-center">
            <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
              {transaction.payeeName}
            </div>
            <div className="text-[11px] text-slate-600">Authorized Signature over Printed Name</div>
            <div className="text-[10px] text-slate-400 mt-1">Payee / Supplier Conforme</div>
          </div>
        </div>
      </div>
    </div>
  );
};
