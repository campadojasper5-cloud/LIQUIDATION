import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  TrendingUp,
  FileCheck2,
  FileText,
  DollarSign,
  Award,
  Layers,
  ArrowRight,
  Sparkles,
  Printer,
  Sliders,
  AlertCircle,
  CheckCircle2,
  Palette,
  UserCheck,
  Download,
} from 'lucide-react';
import { SchoolProfile, CashAdvance, Transaction, ChecklistItem, AuditEvaluation, ExpenseCategory } from '../types';
import { formatPHP } from '../utils/taxCalculator';
import { QuarterlyMooeProjection } from './QuarterlyMooeProjection';

interface DashboardAnalyticsProps {
  school: SchoolProfile;
  cashAdvance: CashAdvance;
  transactions: Transaction[];
  checklist: ChecklistItem[];
  evaluation: AuditEvaluation;
  onOpenNewTransaction: () => void;
  onOpenChecklist: () => void;
  onOpenForms: () => void;
  onOpenSignatories: () => void;
  onOpenCertificate: () => void;
  onOpenThemeModal?: () => void;
  onOpenMonthlyPdf?: () => void;
}

export const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({
  school,
  cashAdvance,
  transactions,
  checklist,
  evaluation,
  onOpenNewTransaction,
  onOpenChecklist,
  onOpenForms,
  onOpenSignatories,
  onOpenCertificate,
  onOpenThemeModal,
  onOpenMonthlyPdf,
}) => {
  // Category breakdown calculation
  const categoryBreakdown = transactions.reduce<Record<string, { count: number; total: number }>>((acc, tx) => {
    const cat = tx.category;
    if (!acc[cat]) {
      acc[cat] = { count: 0, total: 0 };
    }
    acc[cat].count += 1;
    acc[cat].total += tx.grossAmount;
    return acc;
  }, {});

  // High-value transactions >= 50k
  const highValueTransactions = transactions.filter((tx) => tx.grossAmount >= 50000 || tx.isPhilGEPSRequired);

  return (
    <div className="space-y-6">
      {/* School Header Banner & LegitApp Style Verification Badge */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            {/* School Logo with change indicator */}
            <div
              onClick={onOpenThemeModal}
              title="Click to customize School Logo & Theme"
              className="cursor-pointer group relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-emerald-500/30 p-1 bg-white shadow-md shrink-0 transition-transform hover:scale-105"
            >
              <img
                src={school.logoUrl || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%23047857"/><text x="50" y="60" font-size="30" fill="white" text-anchor="middle">DEPED</text></svg>'}
                alt={school.schoolName}
                className="w-full h-full object-contain rounded-xl"
              />
              <div className="absolute inset-0 bg-slate-900/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity">
                Change
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-emerald-800">
                <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-md border border-emerald-200">
                  School ID: {school.schoolId}
                </span>
                <span>·</span>
                <span>{school.district}</span>
                <span>·</span>
                <span>{school.division}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                {school.schoolName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 flex flex-wrap items-center gap-2">
                <span>
                  {cashAdvance.periodMonth} {cashAdvance.periodYear} Regular School MOOE Liquidation Portfolio
                </span>
                <span className="text-slate-300">·</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <UserCheck className="w-3 h-3 text-emerald-600" />
                  Dev: JASPER S. CAMPADO (AO-II)
                </span>
              </p>
            </div>
          </div>

          {/* Action Buttons: Monthly Summary PDF, Theme Customizer & LegitApp Verification Seal */}
          <div className="flex flex-wrap items-center gap-2.5">
            {onOpenMonthlyPdf && (
              <button
                type="button"
                onClick={onOpenMonthlyPdf}
                title="Compile and Export GAM Appendix 43 & 44 into a single downloadable PDF document"
                className="cursor-pointer group flex items-center gap-2 px-3.5 py-2.5 bg-gradient-to-r from-teal-700 via-emerald-700 to-emerald-800 hover:from-teal-800 hover:to-emerald-900 text-white rounded-xl shadow-xs transition-all border border-emerald-500/40"
              >
                <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                  <Download className="w-4 h-4 text-emerald-200 group-hover:translate-y-0.5 transition-transform" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold leading-tight">Monthly Summary PDF</span>
                    <span className="bg-emerald-400/25 text-emerald-100 text-[9px] font-bold px-1.5 py-0.2 rounded border border-emerald-300/30">
                      App 43 &amp; 44
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-200/90 leading-tight">
                    Single Downloadable Dossier
                  </div>
                </div>
              </button>
            )}

            {onOpenThemeModal && (
              <button
                type="button"
                onClick={onOpenThemeModal}
                title="Change School Logo & Background Theme"
                className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-300/80 shadow-2xs transition-colors"
              >
                <Palette className="w-4 h-4 text-emerald-700" />
                <span>Theme &amp; Logo</span>
              </button>
            )}

            <button
              onClick={onOpenCertificate}
              className="cursor-pointer group flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xs transition-all border border-slate-700"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-300">
                  Pre-Audit Verification
                </div>
                <div className="text-xs font-semibold flex items-center gap-1">
                  <span>{evaluation.is100PercentLiquidated ? '100% Fully Verified' : 'Audit In Progress'}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform text-slate-400" />
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Quick Meta Ribbon with 5 Key DepEd Signatories */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">School Principal IV</span>
            <span className="font-semibold text-slate-800 truncate block">{school.schoolHeadName}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Admin Officer II / Dev</span>
            <span className="font-semibold text-emerald-800 truncate block">JASPER S. CAMPADO</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Special Disbursing Officer</span>
            <span className="font-semibold text-slate-800 truncate block">{school.disbursingOfficerName}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">BAC Chairperson</span>
            <span className="font-semibold text-slate-800 truncate block">{school.bacChairperson}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Division Accountant</span>
            <span className="font-semibold text-slate-800 truncate block">{school.divisionAccountantName}</span>
          </div>
        </div>
      </div>

      {/* Top Critical Status Banners: COA 97-002 & 5-Day SDO Deadline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* COA Circular 97-002 Non-Commensurability Rule Card */}
        <div
          className={`p-5 rounded-xl border ${
            evaluation.is100PercentLiquidated
              ? 'bg-emerald-50/60 border-emerald-200'
              : 'bg-amber-50/60 border-amber-200'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase ${
                    evaluation.is100PercentLiquidated
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-600 text-white'
                  }`}
                >
                  COA Circular 97-002 Mandate
                </span>
                <span className="text-xs font-semibold text-slate-700">Strict Non-Commensurability Rule</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 pt-1">
                {evaluation.is100PercentLiquidated
                  ? 'Next Cash Advance Release: UNLOCKED & ELIGIBLE'
                  : 'Next Cash Advance Release: BLOCKED / PENDING'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {evaluation.is100PercentLiquidated
                  ? 'Previous Cash Advance is 100% liquidated and fully accounted for. The Division Accounting Unit can legally process the subsequent Cash Advance.'
                  : `Active balance of ${formatPHP(evaluation.remainingCashBalance)} remains unliquidated. By law, no new Cash Advance can be granted until 100% settled or refunded.`}
              </p>
            </div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                evaluation.is100PercentLiquidated ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}
            >
              {evaluation.is100PercentLiquidated ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <AlertTriangle className="w-6 h-6" />
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-medium">
            <span className="text-slate-600">Liquidation Progress:</span>
            <span className="font-mono font-bold text-slate-900">{evaluation.liquidationPercentage}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 mt-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                evaluation.is100PercentLiquidated ? 'bg-emerald-600' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, evaluation.liquidationPercentage)}%` }}
            />
          </div>
        </div>

        {/* 5-Calendar Day Submission Deadline Card */}
        <div
          className={`p-5 rounded-xl border ${
            evaluation.submissionStatus === 'OVERDUE'
              ? 'bg-rose-50/60 border-rose-200'
              : evaluation.submissionStatus === 'URGENT'
              ? 'bg-amber-50/60 border-amber-200'
              : 'bg-blue-50/60 border-blue-200'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase ${
                    evaluation.submissionStatus === 'OVERDUE'
                      ? 'bg-rose-600 text-white'
                      : evaluation.submissionStatus === 'URGENT'
                      ? 'bg-amber-600 text-white'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  SDO Accounting Deadline
                </span>
                <span className="text-xs font-semibold text-slate-700">5-Calendar-Day Rule</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 pt-1">
                {evaluation.daysRemainingForSubmission > 0
                  ? `${evaluation.daysRemainingForSubmission} Days Remaining for Submission`
                  : evaluation.daysRemainingForSubmission === 0
                  ? 'Due Today to SDO Accounting Unit!'
                  : 'Submission Overdue to SDO!'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Liquidation packet must be officially received by the SDO Accounting Unit on or before{' '}
                <strong className="text-slate-900 font-semibold">{cashAdvance.sdoSubmissionDeadline}</strong> (5
                calendar days following {cashAdvance.periodMonth}).
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
            <span className="text-slate-600">Attached Check / DV:</span>
            <span className="font-mono text-slate-800 font-medium">
              {cashAdvance.checkNo} · {cashAdvance.dvNo}
            </span>
          </div>
        </div>
      </div>

      {/* Financial Core Metric Cards with Tabular Numerals */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: CA Granted */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Cash Advance Granted</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {formatPHP(evaluation.totalGranted)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>Drawn:</span>
            <span className="font-medium text-slate-700">{cashAdvance.cashDrawnDate}</span>
          </div>
        </div>

        {/* Card 2: Total Disbursed (Gross) */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Disbursed (Gross)</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {formatPHP(evaluation.totalDisbursedGross)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>Disbursement Vouchers:</span>
            <span className="font-medium text-slate-700">{transactions.length} items logged</span>
          </div>
        </div>

        {/* Card 3: Taxes Withheld (BIR 2307) */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Taxes Withheld</span>
            <FileText className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-purple-900 tabular-nums">
            {formatPHP(evaluation.totalTaxWithheld)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>Auto BIR Form 2307:</span>
            <span className="font-medium text-purple-700">5% VAT/3% PT + 1%/2% EWT</span>
          </div>
        </div>

        {/* Card 4: Unliquidated Balance */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Unliquidated Balance</span>
            <AlertCircle className={`w-4 h-4 ${evaluation.remainingCashBalance === 0 ? 'text-emerald-600' : 'text-amber-600'}`} />
          </div>
          <div className={`text-xl sm:text-2xl font-bold font-mono tabular-nums ${
            evaluation.remainingCashBalance === 0 ? 'text-emerald-700' : 'text-amber-700'
          }`}>
            {formatPHP(evaluation.remainingCashBalance)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {evaluation.remainingCashBalance === 0 ? (
              <span className="text-emerald-700 font-semibold">100% Fully Accounted (₱0.00)</span>
            ) : (
              <span className="text-amber-700 font-semibold">Requires Refund or Vouchers</span>
            )}
          </div>
        </div>
      </div>

      {/* Recharts Quarterly MOOE Availability & Runway Projection Component */}
      <QuarterlyMooeProjection
        school={school}
        cashAdvance={cashAdvance}
        transactions={transactions}
        onOpenNewTransaction={onOpenNewTransaction}
      />

      {/* Two-Column Analytics: Expense Category Breakdown & RA 9184 Audit Analyzer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">MOOE Expense Category Analysis</h2>
              <p className="text-xs text-slate-500">Distribution according to DepEd Accounting Manual guidelines</p>
            </div>
            <button
              onClick={onOpenNewTransaction}
              className="cursor-pointer text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>+ Add Entry</span>
            </button>
          </div>

          <div className="space-y-3">
            {Object.entries(categoryBreakdown).map(([cat, data]) => {
              const percentage = evaluation.totalDisbursedGross > 0
                ? Math.round((data.total / evaluation.totalDisbursedGross) * 100)
                : 0;

              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800">{cat}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 text-[11px]">{data.count} transaction(s)</span>
                      <span className="font-mono font-semibold text-slate-900 tabular-nums">
                        {formatPHP(data.total)} ({percentage}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Net Disbursed to Vendors / Personnel:</span>
            <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
              {formatPHP(evaluation.totalNetPaid)}
            </span>
          </div>
        </div>

        {/* RA 9184 & Procurement Compliance Guard (1 Col) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">RA 9184 Threshold Rules</h2>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Government Procurement Reform Act (RA 9184) &amp; DepEd Order standards
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="font-semibold text-slate-800">₱50,000.00 &amp; Above Threshold</div>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Mandatory: PhilGEPS Posting, BAC Resolution, Notice of Award (NOA), and Notice to Proceed (NTP).
                </p>
                <div className="mt-2 text-[11px] font-medium text-emerald-700">
                  {highValueTransactions.length === 0
                    ? '✓ All current transactions are under ₱50k (Small Value Procurement)'
                    : `⚠️ ${highValueTransactions.length} transaction(s) require full BAC PhilGEPS documentation!`}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="font-semibold text-slate-800">Semi-Expendable Property (&lt; ₱50k)</div>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Office equipment, computers, and printers costing below ₱50,000 per unit must be covered by{' '}
                  <strong>Inventory Custodian Slip (ICS Appendix 59)</strong> and physical property tag photos.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="font-semibold text-slate-800">Minor Expenses (&le; ₱300 vs &gt; ₱300)</div>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  &gt; ₱300 requires Reimbursement Expense Receipt (RER Appendix 46). &le; ₱300 certified under COA Circular 2017-001.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">Signatories Configured:</span>
            <button
              onClick={onOpenSignatories}
              className="cursor-pointer text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Edit BAC Roster →
            </button>
          </div>
        </div>
      </div>

      {/* LegitApp Style Inspection & Verification Chamber */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <h2 className="text-base font-bold text-slate-900">
                LegitApp MOOE Pre-Audit Verification Chamber
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Rigorous 5-point automated verification against Commission on Audit (COA) &amp; DepEd GAM mandates
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600">Verification Status:</span>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                evaluation.auditGrade === 'PASSED'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              {evaluation.auditGrade === 'PASSED' ? 'PASSED · 100% COMPLIANT' : 'ACTION REQUIRED'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Check 1 */}
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900">1. Non-Commensurability</span>
              {evaluation.is100PercentLiquidated ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              )}
            </div>
            <p className="text-[11px] text-slate-600">COA Circular 97-002 check for zero unliquidated balance.</p>
            <div className="mt-2 text-[11px] font-semibold text-emerald-700">
              {evaluation.is100PercentLiquidated ? '✓ 100% Liquidated (₱0.00 bal)' : '❌ Balance pending'}
            </div>
          </div>

          {/* Check 2 */}
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900">2. Tax Withholding &amp; 2307</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-[11px] text-slate-600">
              5% VAT / 3% PT and 1%/2% EWT auto-calculated for government remittance.
            </p>
            <div className="mt-2 text-[11px] font-semibold text-emerald-700">
              ✓ {formatPHP(evaluation.totalTaxWithheld)} computed
            </div>
          </div>

          {/* Check 3 */}
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900">3. Master Checklist (A–H)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-[11px] text-slate-600">
              Mandatory GAM appendices, canvasses, IARs, and photos attached.
            </p>
            <div className="mt-2 text-[11px] font-semibold text-emerald-700">
              ✓ {evaluation.verifiedChecklistCount}/{evaluation.totalChecklistCount} Required Verified
            </div>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="mt-5 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Official Forms Ready:{' '}
            <strong className="text-slate-800">
              GAM App 44, App 43, BIR 2307, App 60, App 61, App 62, App 63, App 59, App 46
            </strong>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {onOpenMonthlyPdf && (
              <button
                type="button"
                onClick={onOpenMonthlyPdf}
                className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-teal-600 bg-teal-50 hover:bg-teal-100 text-teal-800 transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-teal-700" />
                <span>Monthly Summary PDF</span>
              </button>
            )}
            <button
              onClick={onOpenChecklist}
              className="cursor-pointer text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
            >
              View Checklist (A–H)
            </button>
            <button
              onClick={onOpenForms}
              className="cursor-pointer text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors"
            >
              Generate Official Forms →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
