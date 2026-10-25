import React from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Printer,
  QrCode,
  Award,
  Calendar,
  Building2,
  FileCheck,
} from 'lucide-react';
import { SchoolProfile, CashAdvance, AuditEvaluation } from '../types';
import { formatPHP } from '../utils/taxCalculator';

interface LegitCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  school: SchoolProfile;
  cashAdvance: CashAdvance;
  evaluation: AuditEvaluation;
}

export const LegitCertificateModal: React.FC<LegitCertificateModalProps> = ({
  isOpen,
  onClose,
  school,
  cashAdvance,
  evaluation,
}) => {
  if (!isOpen) return null;

  const certificateId = `DEPED-SDO-2026-LQ-${school.schoolId.slice(-3)}482`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden my-8">
        {/* Modal Controls */}
        <div className="px-6 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-bold text-slate-800">
              LegitApp Digital Certificate of MOOE Pre-Audit Compliance
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Certificate</span>
            </button>
            <button
              onClick={onClose}
              className="cursor-pointer text-slate-400 hover:text-slate-600 p-1 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Sheet (Printable) */}
        <div className="p-8 sm:p-10 bg-white text-slate-900 border-8 border-double border-slate-200 m-4 rounded-xl print-page relative overflow-hidden">
          {/* Subtle Watermark seal */}
          <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none select-none">
            <ShieldCheck className="w-72 h-72 text-emerald-950" />
          </div>

          {/* Certificate Header */}
          <div className="text-center space-y-1 border-b-2 border-emerald-800 pb-4 mb-6">
            <div className="text-[11px] font-serif uppercase tracking-widest text-slate-500">
              Republic of the Philippines · Department of Education
            </div>
            <div className="text-xs font-semibold text-slate-700">
              {school.region} · {school.division}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-emerald-950 pt-1">
              Certificate of Liquidation Pre-Audit
            </h1>
            <div className="text-xs font-mono font-bold text-emerald-800 tracking-wider">
              VERIFICATION CERTIFICATE ID: {certificateId}
            </div>
          </div>

          {/* Statement */}
          <div className="text-center space-y-3 mb-6">
            <p className="text-xs text-slate-600 leading-relaxed max-w-lg mx-auto">
              This digital certification attests that the complete School MOOE Cash Advance packet for:
            </p>
            <div className="text-lg sm:text-xl font-bold text-slate-900 uppercase">
              {school.schoolName}
            </div>
            <div className="text-xs text-slate-600">
              School Identification No.: <strong className="font-mono">{school.schoolId}</strong> · {school.schoolAddress}
            </div>
            <p className="text-xs text-slate-700 max-w-lg mx-auto leading-relaxed pt-2">
              For the Period Covered: <strong>{cashAdvance.periodMonth} {cashAdvance.periodYear}</strong> drawn under Check
              No. <span className="font-mono font-bold">{cashAdvance.checkNo}</span> has been systematically audited against
              the strict mandates of <strong>COA Circular No. 97-002</strong>, <strong>RA 9184</strong>, and the{' '}
              <strong>Government Accounting Manual (GAM for NGAs)</strong>.
            </p>
          </div>

          {/* Verification Shield Badge */}
          <div className="bg-emerald-50 border-2 border-emerald-400 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <div className="text-xs uppercase font-extrabold text-emerald-900 tracking-wider">
                  Audit Verdict: {evaluation.is100PercentLiquidated ? 'PASSED · 100% FULLY LIQUIDATED' : 'PARTIAL / REVIEW'}
                </div>
                <div className="text-[11px] text-emerald-800">
                  COA Circular 97-002 Non-Commensurability Rule:{' '}
                  <strong>{evaluation.is100PercentLiquidated ? 'SATISFIED (₱0.00 Balance)' : 'ACTIVE BALANCE'}</strong>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase block">Total Accounted</span>
              <span className="text-base font-mono font-bold text-emerald-950 tabular-nums">
                {formatPHP(evaluation.totalDisbursedGross)}
              </span>
            </div>
          </div>

          {/* Breakdown Summary Grid */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs mb-8 border border-slate-200 rounded-lg p-3 bg-slate-50">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">CA Granted</span>
              <span className="font-mono font-bold text-slate-800">{formatPHP(evaluation.totalGranted)}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Withheld Taxes (2307)</span>
              <span className="font-mono font-bold text-purple-800">{formatPHP(evaluation.totalTaxWithheld)}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Next CA Status</span>
              <span className="font-bold text-emerald-800">ELIGIBLE FOR RELEASE</span>
            </div>
          </div>

          {/* Signatures & Seal Verification Block */}
          <div className="grid grid-cols-3 gap-4 text-xs pt-4 border-t border-slate-300 items-end">
            {/* QR Block */}
            <div className="text-center">
              <div className="w-16 h-16 border-2 border-slate-900 rounded p-1 mx-auto flex items-center justify-center bg-white">
                <QrCode className="w-12 h-12 text-slate-900" />
              </div>
              <span className="text-[9px] text-slate-400 block mt-1 font-mono">SCAN TO VERIFY</span>
            </div>

            {/* Accountable SDO */}
            <div className="text-center">
              <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
                {school.disbursingOfficerName}
              </div>
              <div className="text-[10px] text-slate-600">{school.disbursingOfficerTitle}</div>
              <div className="text-[9px] text-slate-400">Accountable Officer</div>
            </div>

            {/* School Principal */}
            <div className="text-center">
              <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
                {school.schoolHeadName}
              </div>
              <div className="text-[10px] text-slate-600">{school.schoolHeadTitle}</div>
              <div className="text-[9px] text-slate-400">Secondary School Principal IV</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
