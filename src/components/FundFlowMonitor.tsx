import React, { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  Wallet,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  FileText,
  DollarSign,
  Plus,
  Edit2,
  FileSpreadsheet,
  HelpCircle,
  Camera,
  Layers,
  Sparkles,
} from 'lucide-react';
import { SchoolProfile, CashAdvance, Transaction, AuditEvaluation, ReceiptAttachment } from '../types';
import { formatPHP } from '../utils/taxCalculator';

interface FundFlowMonitorProps {
  school: SchoolProfile;
  cashAdvance: CashAdvance;
  transactions: Transaction[];
  evaluation: AuditEvaluation;
  onUpdateCashAdvance: (updated: CashAdvance) => void;
  onOpenNewTransaction: () => void;
  onSelectFormForTransaction: (tx: Transaction, formKey: string) => void;
  onOpenReceipts: (tx: Transaction) => void;
  onNavigateToForms: () => void;
}

export const FundFlowMonitor: React.FC<FundFlowMonitorProps> = ({
  school,
  cashAdvance,
  transactions,
  evaluation,
  onUpdateCashAdvance,
  onOpenNewTransaction,
  onSelectFormForTransaction,
  onOpenReceipts,
  onNavigateToForms,
}) => {
  const [isEditingCA, setIsEditingCA] = useState(false);
  const [showHowToGuide, setShowHowToGuide] = useState(false);

  // Form state for editing Cash Advance
  const [caAmount, setCaAmount] = useState(cashAdvance.amountGranted);
  const [caCheckNo, setCaCheckNo] = useState(cashAdvance.checkNo);
  const [caCheckDate, setCaCheckDate] = useState(cashAdvance.checkDate);
  const [caDvNo, setCaDvNo] = useState(cashAdvance.dvNo);
  const [caAcicNo, setCaAcicNo] = useState(cashAdvance.acicNo);
  const [caMonth, setCaMonth] = useState(cashAdvance.periodMonth);
  const [caYear, setCaYear] = useState(cashAdvance.periodYear);
  const [caDeadline, setCaDeadline] = useState(cashAdvance.sdoSubmissionDeadline);

  const handleSaveCA = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCashAdvance({
      ...cashAdvance,
      amountGranted: Number(caAmount) || 0,
      checkNo: caCheckNo,
      checkDate: caCheckDate,
      dvNo: caDvNo,
      acicNo: caAcicNo,
      periodMonth: caMonth,
      periodYear: Number(caYear) || 2026,
      sdoSubmissionDeadline: caDeadline,
    });
    setIsEditingCA(false);
  };

  // Build Chronological IN & OUT Ledger with running balance
  // IN row: Cash Advance check received
  const inEntry = {
    id: `CA-IN-${cashAdvance.id}`,
    date: cashAdvance.checkDate,
    refNo: cashAdvance.checkNo,
    dvNo: cashAdvance.dvNo,
    type: 'IN' as const,
    title: `MOOE Cash Advance Received (${cashAdvance.periodMonth} ${cashAdvance.periodYear})`,
    sourceOrPayee: `${school.division} - Division Office`,
    grossAmount: cashAdvance.amountGranted,
    taxWithheld: 0,
    netAmount: cashAdvance.amountGranted,
    notes: `Initial Cash Advance for school operational maintenance. ACIC: ${cashAdvance.acicNo}`,
  };

  // Sort out transactions by date
  const sortedOuts = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculate cumulative running cash balance
  let currentBalance = cashAdvance.amountGranted;
  const inOutLedger = [
    {
      ...inEntry,
      runningBalance: currentBalance,
      transactionObj: null as Transaction | null,
    },
    ...sortedOuts.map((tx) => {
      currentBalance -= tx.grossAmount;
      return {
        id: tx.id,
        date: tx.date,
        refNo: tx.checkOrRefNo,
        dvNo: tx.dvNo,
        type: 'OUT' as const,
        title: tx.particulars,
        sourceOrPayee: tx.payeeName,
        grossAmount: tx.grossAmount,
        taxWithheld: tx.tax.totalTaxWithheld,
        netAmount: tx.tax.netAmountPaid,
        notes: `${tx.category.split(':')[0]} · ${tx.receiptType} #${tx.receiptNo}`,
        runningBalance: currentBalance,
        transactionObj: tx,
      };
    }),
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Accounting System Header & Guide Toggle */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              DepEd GAM Accounting Engine
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500 font-medium">Fund Cash Flow &amp; IN/OUT Monitor</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            MOOE Fund Cash In &amp; Out Ledger
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Real-time accounting register tracking Cash Advances received from SDO (IN) against all Disbursement Vouchers issued (OUT), auto-calculating tax withholdings, running balances, and COA 97-002 non-commensurability status.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => setShowHowToGuide(!showHowToGuide)}
            className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
          >
            <HelpCircle className="w-4 h-4 text-emerald-700" />
            <span>{showHowToGuide ? 'Hide Encoding Guide' : 'How to Encode Details'}</span>
          </button>
          <button
            onClick={() => setIsEditingCA(true)}
            className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors whitespace-nowrap"
          >
            <Edit2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Edit Cash Advance</span>
          </button>
          <button
            onClick={onOpenNewTransaction}
            className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Encode New Voucher</span>
          </button>
        </div>
      </div>

      {/* Interactive Accounting Flow & Encoding Guide */}
      {showHowToGuide && (
        <div className="bg-emerald-950 text-white rounded-2xl p-6 shadow-md border border-emerald-800 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white">
                How to Encode &amp; Automate DepEd MOOE Transactions
              </h2>
            </div>
            <button
              onClick={() => setShowHowToGuide(false)}
              className="text-xs text-emerald-300 hover:text-white underline cursor-pointer"
            >
              Close Guide
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 text-xs">
            <div className="bg-emerald-900/60 p-4 rounded-xl border border-emerald-700/50">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center mb-2">
                1
              </div>
              <h3 className="font-bold text-emerald-200 mb-1">Record Cash Advance (IN)</h3>
              <p className="text-emerald-100/80 leading-relaxed">
                Click <strong>"Edit Cash Advance"</strong> to enter the Check / LDDAP-ADA No., ACIC No., and exact Cash Advance amount granted by SDO for the month.
              </p>
            </div>

            <div className="bg-emerald-900/60 p-4 rounded-xl border border-emerald-700/50">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center mb-2">
                2
              </div>
              <h3 className="font-bold text-emerald-200 mb-1">Encode Vouchers (OUT)</h3>
              <p className="text-emerald-100/80 leading-relaxed">
                Use <strong>"Encode New Voucher"</strong>. Select category, input supplier TIN, gross amount, and items. The system auto-calculates 5% VAT / 3% PT and 1%/2% EWT.
              </p>
            </div>

            <div className="bg-emerald-900/60 p-4 rounded-xl border border-emerald-700/50">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center mb-2">
                3
              </div>
              <h3 className="font-bold text-emerald-200 mb-1">Auto-Sync to GAM Forms</h3>
              <p className="text-emerald-100/80 leading-relaxed">
                Entries are automatically logged to <strong>Appendix 43</strong> (Register), <strong>Appendix 44</strong> (Liquidation), and generate <strong>BIR Form 2307</strong> with all committee signatures.
              </p>
            </div>

            <div className="bg-emerald-900/60 p-4 rounded-xl border border-emerald-700/50">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center mb-2">
                4
              </div>
              <h3 className="font-bold text-emerald-200 mb-1">Attach Photos &amp; Save to Drive</h3>
              <p className="text-emerald-100/80 leading-relaxed">
                Snap or upload photos of Sales Invoices, property tags, and repair progress. Finally, click <strong>"Save to Drive"</strong> to back up your full dossier!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Cash Advance Modal */}
      {isEditingCA && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn">
            <div className="px-6 py-4 bg-emerald-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-200" />
                <h3 className="font-bold text-base">Update Cash Advance (Fund IN)</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingCA(false)}
                className="text-white hover:text-emerald-200 text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCA} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Cash Advance Amount Granted (₱)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₱</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={caAmount}
                    onChange={(e) => setCaAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-sm font-bold font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Check / ADA No.</label>
                  <input
                    type="text"
                    required
                    value={caCheckNo}
                    onChange={(e) => setCaCheckNo(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Check Date</label>
                  <input
                    type="date"
                    required
                    value={caCheckDate}
                    onChange={(e) => setCaCheckDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SDO Disbursement Voucher (DV)</label>
                  <input
                    type="text"
                    required
                    value={caDvNo}
                    onChange={(e) => setCaDvNo(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ACIC No.</label>
                  <input
                    type="text"
                    required
                    value={caAcicNo}
                    onChange={(e) => setCaAcicNo(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Liquidation Period Month</label>
                  <input
                    type="text"
                    value={caMonth}
                    onChange={(e) => setCaMonth(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Year</label>
                  <input
                    type="number"
                    value={caYear}
                    onChange={(e) => setCaYear(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  SDO 5-Day Submission Deadline
                </label>
                <input
                  type="date"
                  value={caDeadline}
                  onChange={(e) => setCaDeadline(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  COA mandate: Must be submitted within 5 calendar days following the claim month.
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingCA(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 font-bold shadow-xs cursor-pointer"
                >
                  Update Cash Advance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* High-Impact 4-Metric Financial Flow Monitor */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Cash IN */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Cash IN
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ArrowDownLeft className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {formatPHP(evaluation.totalGranted)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Check #{cashAdvance.checkNo} · {cashAdvance.periodMonth} {cashAdvance.periodYear}
            </div>
          </div>
        </div>

        {/* Metric 2: Cash OUT (Gross Disbursed) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Cash OUT (Gross)
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {formatPHP(evaluation.totalDisbursedGross)}
            </div>
            <div className="text-[11px] text-blue-700 mt-1 font-medium">
              {transactions.length} Disbursements Encoded
            </div>
          </div>
        </div>

        {/* Metric 3: Tax Withheld at Source */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Tax Deducted (BIR 2307)
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <DollarSign className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-purple-800 tabular-nums">
              {formatPHP(evaluation.totalTaxWithheld)}
            </div>
            <div className="text-[11px] text-purple-700 mt-1 font-medium">
              Net Paid to Suppliers: {formatPHP(evaluation.totalNetPaid)}
            </div>
          </div>
        </div>

        {/* Metric 4: Remaining Cash Balance */}
        <div className={`p-5 rounded-2xl border shadow-xs flex flex-col justify-between ${
          evaluation.is100PercentLiquidated
            ? 'bg-emerald-50/50 border-emerald-300'
            : 'bg-amber-50/50 border-amber-300'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Cash on Hand / Balance
            </span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              evaluation.is100PercentLiquidated
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-600 text-white'
            }`}>
              {evaluation.is100PercentLiquidated ? (
                <ShieldCheck className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>
          </div>
          <div>
            <div className={`text-2xl font-bold font-mono tabular-nums ${
              evaluation.is100PercentLiquidated ? 'text-emerald-800' : 'text-amber-900'
            }`}>
              {formatPHP(evaluation.remainingCashBalance)}
            </div>
            <div className="text-[11px] font-semibold mt-1">
              {evaluation.is100PercentLiquidated ? (
                <span className="text-emerald-700">✓ 100.0% Fully Liquidated (Ready for Next CA)</span>
              ) : (
                <span className="text-amber-800">⚠️ {evaluation.liquidationPercentage.toFixed(1)}% Accounted — Balance to Liquidate</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* COA Compliance & SDO Deadline Alert Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: COA 97-002 Rule Monitor */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            evaluation.is100PercentLiquidated ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
          }`}>
            <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">
                COA Circular 97-002: Strict Non-Commensurability Rule
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                evaluation.is100PercentLiquidated ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {evaluation.is100PercentLiquidated ? 'PASSED' : 'HOLD CA'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              {evaluation.is100PercentLiquidated
                ? 'Previous Cash Advance is 100% liquidated. The School Head & SDO are officially certified eligible to receive the subsequent MOOE Cash Advance.'
                : 'Next Cash Advance is strictly prohibited by law until this active advance is liquidated to ₱0.00 zero balance.'}
            </p>
          </div>
        </div>

        {/* Card 2: SDO 5-Day Calendar Deadline */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">
                SDO Submission Deadline: {cashAdvance.sdoSubmissionDeadline}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                evaluation.daysRemainingForSubmission <= 2
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {evaluation.daysRemainingForSubmission} Days Left
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              Liquidation packet must be submitted to the Schools Division Office Accounting Unit within 5 calendar days following the month of claim.
            </p>
          </div>
        </div>
      </div>

      {/* Main IN & OUT Accounting Ledger Table with Running Balance */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Cash In &amp; Cash Out Chronological Flow (GAM Register)
            </h2>
            <p className="text-xs text-slate-500">
              Sequential cash book tracking every receipt of funds (IN) and payment of vouchers (OUT) with running balance.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateToForms}
              className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-2xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              <span>View Official Appendix 43</span>
            </button>
            <button
              onClick={onOpenNewTransaction}
              className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="px-4 py-3 whitespace-nowrap">Flow</th>
                <th className="px-4 py-3 whitespace-nowrap">Date / Ref</th>
                <th className="px-4 py-3 whitespace-nowrap">DV / Check No.</th>
                <th className="px-4 py-3">Payee / Claimant &amp; Particulars</th>
                <th className="px-4 py-3 text-right whitespace-nowrap">Amount IN</th>
                <th className="px-4 py-3 text-right whitespace-nowrap">Amount OUT</th>
                <th className="px-4 py-3 text-right whitespace-nowrap">Tax Deducted</th>
                <th className="px-4 py-3 text-right whitespace-nowrap">Net Paid</th>
                <th className="px-4 py-3 text-right whitespace-nowrap">Running Balance</th>
                <th className="px-4 py-3 text-center whitespace-nowrap">Attachments &amp; Docs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inOutLedger.map((row) => {
                const isIn = row.type === 'IN';
                return (
                  <tr
                    key={row.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      isIn ? 'bg-emerald-50/40 font-semibold' : ''
                    }`}
                  >
                    {/* Flow Tag */}
                    <td className="px-4 py-3 align-top whitespace-nowrap">
                      {isIn ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-700 text-white shadow-2xs">
                          <ArrowDownLeft className="w-3 h-3" /> CASH IN
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-200 text-slate-800">
                          <ArrowUpRight className="w-3 h-3 text-slate-600" /> CASH OUT
                        </span>
                      )}
                    </td>

                    {/* Date / Ref */}
                    <td className="px-4 py-3 align-top whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{row.date}</div>
                      <div className="font-mono text-[11px] text-slate-500">{row.refNo}</div>
                    </td>

                    {/* DV / Check */}
                    <td className="px-4 py-3 align-top whitespace-nowrap">
                      <div className="font-mono font-medium text-slate-800">{row.dvNo}</div>
                      {isIn && (
                        <div className="text-[10px] text-emerald-800 font-semibold">
                          ACIC: {cashAdvance.acicNo}
                        </div>
                      )}
                    </td>

                    {/* Payee & Particulars */}
                    <td className="px-4 py-3 align-top max-w-sm">
                      <div className="font-bold text-slate-900">{row.sourceOrPayee}</div>
                      <p className="text-slate-600 line-clamp-2 mt-0.5 text-[11px] leading-relaxed">
                        {row.title}
                      </p>
                      <div className="text-[10px] text-slate-400 mt-0.5">{row.notes}</div>
                    </td>

                    {/* Amount IN */}
                    <td className="px-4 py-3 align-top text-right font-mono font-bold text-emerald-800 whitespace-nowrap">
                      {isIn ? formatPHP(row.grossAmount) : '-'}
                    </td>

                    {/* Amount OUT */}
                    <td className="px-4 py-3 align-top text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                      {!isIn ? formatPHP(row.grossAmount) : '-'}
                    </td>

                    {/* Tax Deducted */}
                    <td className="px-4 py-3 align-top text-right font-mono text-purple-700 whitespace-nowrap">
                      {!isIn && row.taxWithheld > 0 ? formatPHP(row.taxWithheld) : '-'}
                    </td>

                    {/* Net Paid */}
                    <td className="px-4 py-3 align-top text-right font-mono text-slate-800 whitespace-nowrap">
                      {!isIn ? formatPHP(row.netAmount) : '-'}
                    </td>

                    {/* Running Cash Balance */}
                    <td className="px-4 py-3 align-top text-right font-mono font-bold whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded ${
                        row.runningBalance === 0
                          ? 'bg-emerald-100 text-emerald-900 font-extrabold'
                          : row.runningBalance < 0
                          ? 'bg-rose-100 text-rose-900'
                          : 'bg-slate-100 text-slate-900'
                      }`}>
                        {formatPHP(row.runningBalance)}
                      </span>
                    </td>

                    {/* Attachments & Docs */}
                    <td className="px-4 py-3 align-top text-center whitespace-nowrap">
                      {isIn ? (
                        <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                          DV &amp; Bank Statement
                        </span>
                      ) : row.transactionObj ? (
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Receipt Photo Trigger */}
                          <button
                            type="button"
                            onClick={() => onOpenReceipts(row.transactionObj!)}
                            className="cursor-pointer inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 transition-colors"
                            title="View/Upload receipt &amp; inspection photos"
                          >
                            <Camera className="w-3 h-3 text-emerald-700" />
                            <span>
                              {row.transactionObj.receiptAttachments?.length || 0} Photo
                              {(row.transactionObj.receiptAttachments?.length || 0) === 1 ? '' : 's'}
                            </span>
                          </button>

                          {/* BIR 2307 Auto-Fill */}
                          <button
                            type="button"
                            onClick={() => onSelectFormForTransaction(row.transactionObj!, 'bir2307')}
                            className="cursor-pointer px-2 py-1 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-colors"
                            title="View auto-filled BIR Form 2307"
                          >
                            BIR 2307
                          </button>
                        </div>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Ledger Bottom Summary Bar */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-800">
              Total Recorded Inflow: {formatPHP(evaluation.totalGranted)}
            </span>
            <span>·</span>
            <span className="font-semibold text-slate-800">
              Total Outflow Liquidated: {formatPHP(evaluation.totalDisbursedGross)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">Net Unliquidated Cash Balance:</span>
            <span className={`font-mono font-bold text-sm ${
              evaluation.is100PercentLiquidated ? 'text-emerald-700' : 'text-amber-800'
            }`}>
              {formatPHP(evaluation.remainingCashBalance)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
