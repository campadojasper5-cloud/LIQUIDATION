import React, { useRef, useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  X,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  Layers,
  ShieldCheck,
  Award,
  Sparkles,
  ChevronDown,
  Loader2,
  UserCheck,
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { SchoolProfile, CashAdvance, Transaction, AuditEvaluation } from '../types';
import { formatPHP } from '../utils/taxCalculator';

interface MonthlySummaryPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  school: SchoolProfile;
  cashAdvance: CashAdvance;
  transactions: Transaction[];
  evaluation: AuditEvaluation;
}

export const MonthlySummaryPdfModal: React.FC<MonthlySummaryPdfModalProps> = ({
  isOpen,
  onClose,
  school,
  cashAdvance,
  transactions,
  evaluation,
}) => {
  const documentRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<string>('');
  const [activePreviewSection, setActivePreviewSection] = useState<'all' | 'app44' | 'app43' | 'transmittal'>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  if (!isOpen) return null;

  // Compute breakdown for summary
  const totalVAT = transactions
    .filter((t) => t.tax.isVatRegistered)
    .reduce((sum, t) => sum + t.tax.taxTypeAmount, 0);
  const totalPercentageTax = transactions
    .filter((t) => !t.tax.isVatRegistered)
    .reduce((sum, t) => sum + t.tax.taxTypeAmount, 0);
  const totalGoodsEWT = transactions
    .filter((t) => t.isGoodsOrServices === 'goods')
    .reduce((sum, t) => sum + t.tax.ewtAmount, 0);
  const totalServicesEWT = transactions
    .filter((t) => t.isGoodsOrServices === 'services')
    .reduce((sum, t) => sum + t.tax.ewtAmount, 0);

  // Download PDF Function using jsPDF + html2canvas
  const handleDownloadPdf = async () => {
    if (!documentRef.current) return;

    try {
      setIsGeneratingPdf(true);
      setDownloadProgress('Preparing pages for high-resolution rendering...');

      // Get all printable pages
      const pageElements = documentRef.current.querySelectorAll<HTMLElement>('.pdf-compilation-page');
      
      if (pageElements.length === 0) {
        throw new Error('No printable pages found.');
      }

      // Initialize jsPDF in portrait orientation, mm units, A4 size (210 x 297mm)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pageWidth = 210;
      const pageHeight = 297;

      for (let i = 0; i < pageElements.length; i++) {
        setDownloadProgress(`Rendering Page ${i + 1} of ${pageElements.length} (Appendix ${i === 0 ? '44' : i === 1 ? '43' : 'Summary'})...`);
        const pageEl = pageElements[i];

        // Capture page using html2canvas with high scale for crisp text
        const canvas = await html2canvas(pageEl, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: 1024,
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);

        if (i > 0) {
          pdf.addPage('a4', 'portrait');
        }

        // Fit image cleanly to A4 page dimensions
        pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
      }

      setDownloadProgress('Compiling into final downloadable PDF...');
      const cleanSchoolName = school.schoolName.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `DepEd_MOOE_Monthly_Summary_${cashAdvance.periodMonth}_${cashAdvance.periodYear}_${cleanSchoolName}.pdf`;

      pdf.save(filename);
      setDownloadProgress('Done! Downloading file...');
      setTimeout(() => {
        setIsGeneratingPdf(false);
        setDownloadProgress('');
      }, 1000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Unable to generate PDF directly. You can also use the "Direct Print" button to Save as PDF via your browser.');
      setIsGeneratingPdf(false);
      setDownloadProgress('');
    }
  };

  const handleDirectPrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-hidden">
      <div className="bg-slate-100 w-full max-w-6xl h-[94vh] rounded-2xl shadow-2xl flex flex-col border border-slate-700/60 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 shrink-0 no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Monthly Summary PDF Dossier
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-400/30">
                  Appendix 43 &amp; 44
                </span>
                <span className="hidden sm:inline bg-blue-500/20 text-blue-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-blue-400/30">
                  COA Circular 97-002
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {school.schoolName} ({school.schoolId}) · {cashAdvance.periodMonth} {cashAdvance.periodYear} MOOE Liquidation
              </p>
            </div>
          </div>

          {/* Quick Actions in Header */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* View Filter Toggles */}
            <div className="hidden lg:flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setActivePreviewSection('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  activePreviewSection === 'all'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                All Pages
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewSection('app44')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  activePreviewSection === 'app44'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                App. 44 (LR)
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewSection('app43')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  activePreviewSection === 'app43'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                App. 43 (CDR)
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewSection('transmittal')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  activePreviewSection === 'transmittal'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Transmittal
              </button>
            </div>

            {/* Direct Print Button */}
            <button
              type="button"
              onClick={handleDirectPrint}
              className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors shadow-2xs"
              title="Print document or Save as PDF using your browser dialog"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span>Direct Print</span>
            </button>

            {/* Primary Download PDF Button */}
            <button
              type="button"
              disabled={isGeneratingPdf}
              onClick={handleDownloadPdf}
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-lg shadow-md transition-all border border-emerald-400/40 disabled:opacity-60"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-white" />
                  <span>Download Summary PDF</span>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar Banner when compiling */}
        {isGeneratingPdf && (
          <div className="bg-emerald-900/90 text-emerald-100 text-xs px-5 py-2.5 flex items-center justify-between border-b border-emerald-700 no-print animate-pulse">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              <span className="font-semibold">{downloadProgress}</span>
            </div>
            <span className="text-[11px] text-emerald-300">Rendering high-resolution vector output</span>
          </div>
        )}

        {/* Scrollable Document Canvas Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-300/60 flex flex-col items-center gap-8">
          <div
            ref={documentRef}
            className="w-full max-w-[850px] space-y-8 text-slate-900 transition-all duration-200"
            style={{ transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined, transformOrigin: 'top center' }}
          >
            {/* ========================================================================= */}
            {/* PAGE 1: APPENDIX 44 - LIQUIDATION REPORT (GAM for NGAs)                   */}
            {/* ========================================================================= */}
            {(activePreviewSection === 'all' || activePreviewSection === 'app44') && (
              <div className="pdf-compilation-page bg-white p-8 sm:p-10 rounded-xl shadow-lg border border-slate-300 font-sans relative">
                {/* Top Corner GAM Identifier */}
                <div className="flex justify-between items-center text-[11px] font-mono font-bold tracking-wider text-slate-500 mb-3 border-b border-slate-200 pb-1">
                  <span>GOVERNMENT ACCOUNTING MANUAL (GAM) FOR NGAS</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300 text-slate-800">
                    Appendix 44
                  </span>
                </div>

                {/* Republic Letterhead with Logo */}
                <div className="flex items-center justify-between gap-4 border-b-2 border-slate-900 pb-3 mb-4">
                  <div className="w-16 h-16 shrink-0 flex items-center justify-center">
                    <img
                      src={school.logoUrl || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%23047857"/><text x="50" y="60" font-size="30" fill="white" text-anchor="middle">DEPED</text></svg>'}
                      alt="DepEd School Logo"
                      className="w-16 h-16 object-contain"
                    />
                  </div>

                  <div className="text-center flex-1 space-y-0.5">
                    <div className="text-[11px] font-serif uppercase tracking-widest text-slate-600">
                      Republic of the Philippines
                    </div>
                    <div className="text-sm font-bold uppercase tracking-wider text-slate-900">
                      Department of Education
                    </div>
                    <div className="text-xs font-semibold text-slate-800">
                      {school.region} · {school.division}
                    </div>
                    <div className="text-xs text-slate-600 font-medium">
                      District of {school.district}
                    </div>
                    <div className="text-sm font-extrabold text-slate-900 mt-1 uppercase">
                      {school.schoolName}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      School ID: {school.schoolId} · {school.schoolAddress}
                    </div>
                  </div>

                  <div className="w-16 h-16 shrink-0 flex flex-col items-center justify-center border border-slate-300 rounded-lg p-1 bg-slate-50 text-center">
                    <span className="text-[9px] font-bold text-slate-500 uppercase">Status</span>
                    <span className="text-[10px] font-extrabold text-emerald-700">LIQUIDATED</span>
                    <span className="text-[8px] font-mono text-slate-400">100% BAL 0</span>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <h1 className="text-lg font-extrabold uppercase tracking-wide text-slate-900">
                    LIQUIDATION REPORT
                  </h1>
                  <div className="text-xs font-semibold text-slate-700">
                    Period Covered: {cashAdvance.periodMonth} {cashAdvance.periodYear}
                  </div>
                </div>

                {/* Metadata Box */}
                <div className="grid grid-cols-2 text-xs border border-slate-800 mb-4 divide-x divide-slate-800">
                  <div className="p-2 space-y-1">
                    <div>
                      <span className="font-semibold text-slate-700">Entity Name: </span>
                      <span className="font-bold text-slate-900">{school.schoolName}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700">Fund Cluster: </span>
                      <span className="font-mono text-slate-900">01 - Regular Agency Fund (MOOE)</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700">Bank / LBP Branch: </span>
                      <span className="text-slate-900">{school.bankBranch}</span>
                    </div>
                  </div>
                  <div className="p-2 space-y-1">
                    <div>
                      <span className="font-semibold text-slate-700">Liquidation Report No.: </span>
                      <span className="font-mono font-bold text-slate-900">
                        LR-{cashAdvance.periodYear}-{cashAdvance.periodMonth.slice(0, 3).toUpperCase()}-001
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700">Date Prepared: </span>
                      <span className="text-slate-900">{cashAdvance.sdoSubmissionDeadline}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700">CA Check / DV No.: </span>
                      <span className="font-mono text-slate-900">
                        Ck #{cashAdvance.checkNo} / DV #{cashAdvance.dvNo}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main Appendix 44 Table */}
                <table className="w-full text-xs border border-slate-800 border-collapse mb-4">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-800 font-bold text-center">
                      <th className="border-r border-slate-800 px-2 py-2 w-20">Date</th>
                      <th className="border-r border-slate-800 px-2 py-2 w-24">DV / Ck No.</th>
                      <th className="border-r border-slate-800 px-2 py-2">Particulars / Payee</th>
                      <th className="border-r border-slate-800 px-2 py-2 w-24 text-right">Gross Amount</th>
                      <th className="border-r border-slate-800 px-2 py-2 w-20 text-right">Tax Withheld</th>
                      <th className="px-2 py-2 w-24 text-right">Net Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300">
                    {/* Beginning Inflow Row */}
                    <tr className="bg-slate-50 font-semibold border-b border-slate-800">
                      <td className="border-r border-slate-800 px-2 py-1.5 text-center font-mono text-[11px]">
                        {cashAdvance.cashDrawnDate}
                      </td>
                      <td className="border-r border-slate-800 px-2 py-1.5 text-center font-mono text-[11px]">
                        {cashAdvance.checkNo}
                      </td>
                      <td className="border-r border-slate-800 px-2 py-1.5 font-bold text-slate-900">
                        CASH ADVANCE GRANTED FOR {cashAdvance.periodMonth.toUpperCase()} {cashAdvance.periodYear} (DV #{cashAdvance.dvNo})
                      </td>
                      <td className="border-r border-slate-800 px-2 py-1.5 text-right font-mono font-bold text-slate-900">
                        {formatPHP(cashAdvance.amountGranted)}
                      </td>
                      <td className="border-r border-slate-800 px-2 py-1.5 text-right font-mono text-slate-400">-</td>
                      <td className="px-2 py-1.5 text-right font-mono font-bold text-slate-900">
                        {formatPHP(cashAdvance.amountGranted)}
                      </td>
                    </tr>

                    {/* Section Label: LESS DISBURSEMENTS */}
                    <tr>
                      <td
                        colSpan={6}
                        className="bg-slate-100 px-2 py-1 font-bold italic text-slate-700 border-b border-slate-800 text-[11px]"
                      >
                        LESS: DISBURSEMENTS / EXPENDITURES LIQUIDATED:
                      </td>
                    </tr>

                    {/* Transaction Rows */}
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50">
                        <td className="border-r border-slate-800 px-2 py-1 text-center font-mono text-[10px]">
                          {tx.date}
                        </td>
                        <td className="border-r border-slate-800 px-2 py-1 text-center font-mono text-[10px]">
                          {tx.dvNo} / {tx.checkOrRefNo}
                        </td>
                        <td className="border-r border-slate-800 px-2 py-1">
                          <div className="font-semibold text-slate-900 leading-tight">{tx.payeeName}</div>
                          <div className="text-[10px] text-slate-600 line-clamp-1">{tx.particulars}</div>
                          <div className="text-[9px] text-slate-400 font-mono">
                            {tx.receiptType} #{tx.receiptNo}
                          </div>
                        </td>
                        <td className="border-r border-slate-800 px-2 py-1 text-right font-mono font-semibold">
                          {formatPHP(tx.grossAmount)}
                        </td>
                        <td className="border-r border-slate-800 px-2 py-1 text-right font-mono text-purple-900">
                          {formatPHP(tx.tax.totalTaxWithheld)}
                        </td>
                        <td className="px-2 py-1 text-right font-mono font-bold text-slate-900">
                          {formatPHP(tx.tax.netAmountPaid)}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot className="border-t-2 border-slate-800 font-bold bg-slate-50">
                    <tr>
                      <td colSpan={3} className="border-r border-slate-800 px-2 py-1.5 text-right uppercase">
                        Total Disbursements:
                      </td>
                      <td className="border-r border-slate-800 px-2 py-1.5 text-right font-mono text-slate-900 font-bold">
                        {formatPHP(evaluation.totalDisbursedGross)}
                      </td>
                      <td className="border-r border-slate-800 px-2 py-1.5 text-right font-mono text-purple-900 font-bold">
                        {formatPHP(evaluation.totalTaxWithheld)}
                      </td>
                      <td className="px-2 py-1.5 text-right font-mono text-emerald-900 font-bold">
                        {formatPHP(evaluation.totalNetPaid)}
                      </td>
                    </tr>
                    <tr className="bg-slate-100 border-t border-slate-800 text-xs">
                      <td colSpan={3} className="border-r border-slate-800 px-2 py-2 text-right uppercase font-extrabold">
                        Remaining Unliquidated Balance (Refund / Cash on Hand):
                      </td>
                      <td colSpan={3} className="px-3 py-2 text-right font-mono font-extrabold text-sm text-slate-900">
                        {formatPHP(evaluation.remainingCashBalance)}
                        {evaluation.is100PercentLiquidated && (
                          <span className="ml-2 text-[10px] font-sans font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                            100% FULLY LIQUIDATED (COA CIRCULAR 97-002)
                          </span>
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>

                {/* Signatory Blocks A and B (Standard GAM Appendix 44) */}
                <div className="grid grid-cols-2 border border-slate-800 divide-x divide-slate-800 text-xs mb-3">
                  {/* Box A: Certification */}
                  <div className="p-3 space-y-4">
                    <div className="font-semibold text-slate-800 leading-tight text-[11px]">
                      A. CERTIFIED: I hereby certify that the period covered by this Liquidation Report is true and correct, and
                      that all disbursements were incurred in accordance with law and COA accounting and auditing rules.
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-center pt-2">
                      <div>
                        <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase text-[11px]">
                          {school.disbursingOfficerName}
                        </div>
                        <div className="text-[10px] text-slate-600">{school.disbursingOfficerTitle}</div>
                        <div className="text-[9px] text-slate-400">Special Disbursing Officer</div>
                      </div>

                      <div>
                        <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase text-[11px]">
                          {school.schoolHeadName}
                        </div>
                        <div className="text-[10px] text-slate-600">{school.schoolHeadTitle}</div>
                        <div className="text-[9px] text-slate-400">Approving Official / Principal</div>
                      </div>
                    </div>
                  </div>

                  {/* Box B: Verification by Division Office */}
                  <div className="p-3 space-y-4">
                    <div className="font-semibold text-slate-800 leading-tight text-[11px]">
                      B. VERIFIED &amp; ACCEPTED: (Division Office Accounting Unit)
                      <br />
                      I certify that I have verified the supporting documents and found the disbursements in order as to
                      mathematical accuracy, complete attachments, and tax withholding compliance.
                    </div>

                    <div className="text-center pt-2 max-w-xs mx-auto">
                      <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase text-[11px]">
                        {school.divisionAccountantName}
                      </div>
                      <div className="text-[10px] text-slate-600">{school.divisionAccountantTitle}</div>
                      <div className="text-[9px] text-slate-400">Division Accountant / SDO Accounting Unit</div>
                    </div>
                  </div>
                </div>

                {/* Official System Developer & Pre-Audit Endorsement Footer */}
                <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Document: GAM Form Appendix 44 (Page 1 of 2)</span>
                  <span className="font-semibold text-slate-700">
                    System Developer: JASPER S. CAMPADO (Administrative Officer II)
                  </span>
                  <span>COA Circular No. 97-002 Certified</span>
                </div>
              </div>
            )}

            {/* Visual Page Break Indicator */}
            {activePreviewSection === 'all' && (
              <div className="flex items-center justify-center gap-3 py-2 no-print">
                <div className="h-px bg-slate-400 flex-1" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 bg-slate-200 px-3 py-1 rounded-full border border-slate-300">
                  Page Break · Appendix 43 Follows
                </span>
                <div className="h-px bg-slate-400 flex-1" />
              </div>
            )}

            {/* ========================================================================= */}
            {/* PAGE 2: APPENDIX 43 - CASH DISBURSEMENT REGISTER (CDR)                    */}
            {/* ========================================================================= */}
            {(activePreviewSection === 'all' || activePreviewSection === 'app43') && (
              <div className="pdf-compilation-page bg-white p-8 sm:p-10 rounded-xl shadow-lg border border-slate-300 font-sans relative">
                {/* Top Corner GAM Identifier */}
                <div className="flex justify-between items-center text-[11px] font-mono font-bold tracking-wider text-slate-500 mb-3 border-b border-slate-200 pb-1">
                  <span>GOVERNMENT ACCOUNTING MANUAL (GAM) FOR NGAS</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300 text-slate-800">
                    Appendix 43
                  </span>
                </div>

                {/* Republic Letterhead with Logo */}
                <div className="flex items-center justify-between gap-4 border-b-2 border-slate-900 pb-3 mb-4">
                  <div className="w-16 h-16 shrink-0 flex items-center justify-center">
                    <img
                      src={school.logoUrl || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%23047857"/><text x="50" y="60" font-size="30" fill="white" text-anchor="middle">DEPED</text></svg>'}
                      alt="DepEd School Logo"
                      className="w-16 h-16 object-contain"
                    />
                  </div>

                  <div className="text-center flex-1 space-y-0.5">
                    <div className="text-[11px] font-serif uppercase tracking-widest text-slate-600">
                      Republic of the Philippines
                    </div>
                    <div className="text-sm font-bold uppercase tracking-wider text-slate-900">
                      Department of Education
                    </div>
                    <div className="text-xs font-semibold text-slate-800">
                      {school.region} · {school.division}
                    </div>
                    <div className="text-sm font-extrabold text-slate-900 mt-1 uppercase">
                      {school.schoolName}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      School ID: {school.schoolId} · {school.district}
                    </div>
                  </div>

                  <div className="w-16 h-16 shrink-0 flex flex-col items-center justify-center border border-slate-300 rounded-lg p-1 bg-slate-50 text-center">
                    <span className="text-[9px] font-bold text-slate-500 uppercase">Book</span>
                    <span className="text-[10px] font-extrabold text-slate-800">CDR</span>
                    <span className="text-[8px] font-mono text-slate-400">Vol. 1</span>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <h1 className="text-lg font-extrabold uppercase tracking-wide text-slate-900">
                    CASH DISBURSEMENT REGISTER (CDR)
                  </h1>
                  <div className="text-xs font-semibold text-slate-700">
                    For the Month of {cashAdvance.periodMonth} {cashAdvance.periodYear}
                  </div>
                </div>

                {/* Metadata Box */}
                <div className="grid grid-cols-2 text-xs border border-slate-800 mb-4 divide-x divide-slate-800">
                  <div className="p-2 space-y-1">
                    <div>
                      <span className="font-semibold text-slate-700">Entity Name: </span>
                      <span className="font-bold text-slate-900">{school.schoolName}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700">Fund Cluster: </span>
                      <span className="font-mono text-slate-900">01 - Regular Agency Fund (MOOE)</span>
                    </div>
                  </div>
                  <div className="p-2 space-y-1">
                    <div>
                      <span className="font-semibold text-slate-700">Accountable Officer: </span>
                      <span className="font-bold text-slate-900">{school.disbursingOfficerName}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700">Official Designation: </span>
                      <span className="text-slate-900">{school.disbursingOfficerTitle}</span>
                    </div>
                  </div>
                </div>

                {/* CDR Table */}
                <table className="w-full text-[11px] border border-slate-800 border-collapse mb-4">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-800 font-bold text-center">
                      <th className="border-r border-slate-800 px-1.5 py-1.5 w-16">Date</th>
                      <th className="border-r border-slate-800 px-1.5 py-1.5 w-20">Serial/DV</th>
                      <th className="border-r border-slate-800 px-1.5 py-1.5 w-16">Check No.</th>
                      <th className="border-r border-slate-800 px-2 py-1.5">Payee</th>
                      <th className="border-r border-slate-800 px-2 py-1.5">Nature of Payment</th>
                      <th className="border-r border-slate-800 px-1.5 py-1.5 w-20 text-right">Gross (Dr)</th>
                      <th className="border-r border-slate-800 px-1.5 py-1.5 w-16 text-right">Tax (Cr)</th>
                      <th className="px-1.5 py-1.5 w-20 text-right">Net Paid (Cr)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300">
                    {/* Inflow Entry */}
                    <tr className="bg-slate-50 font-semibold border-b border-slate-800">
                      <td className="border-r border-slate-800 px-1.5 py-1 text-center font-mono">
                        {cashAdvance.cashDrawnDate}
                      </td>
                      <td className="border-r border-slate-800 px-1.5 py-1 text-center font-mono">
                        {cashAdvance.dvNo}
                      </td>
                      <td className="border-r border-slate-800 px-1.5 py-1 text-center font-mono">
                        {cashAdvance.checkNo}
                      </td>
                      <td className="border-r border-slate-800 px-2 py-1 font-bold text-slate-900">
                        {school.disbursingOfficerName}
                      </td>
                      <td className="border-r border-slate-800 px-2 py-1 font-semibold text-slate-800">
                        Receipt of Cash Advance for {cashAdvance.periodMonth} {cashAdvance.periodYear} MOOE
                      </td>
                      <td className="border-r border-slate-800 px-1.5 py-1 text-right font-mono font-bold text-slate-900">
                        {formatPHP(cashAdvance.amountGranted)}
                      </td>
                      <td className="border-r border-slate-800 px-1.5 py-1 text-right font-mono text-slate-400">-</td>
                      <td className="px-1.5 py-1 text-right font-mono font-bold text-slate-900">
                        {formatPHP(cashAdvance.amountGranted)}
                      </td>
                    </tr>

                    {/* Transaction Rows */}
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50">
                        <td className="border-r border-slate-800 px-1.5 py-1 text-center font-mono text-[10px]">
                          {tx.date}
                        </td>
                        <td className="border-r border-slate-800 px-1.5 py-1 text-center font-mono text-[10px]">
                          {tx.dvNo}
                        </td>
                        <td className="border-r border-slate-800 px-1.5 py-1 text-center font-mono text-[10px]">
                          {tx.checkOrRefNo}
                        </td>
                        <td className="border-r border-slate-800 px-2 py-1 font-medium">{tx.payeeName}</td>
                        <td className="border-r border-slate-800 px-2 py-1 text-slate-600 line-clamp-1">
                          {tx.particulars}
                        </td>
                        <td className="border-r border-slate-800 px-1.5 py-1 text-right font-mono text-[10px]">
                          {formatPHP(tx.grossAmount)}
                        </td>
                        <td className="border-r border-slate-800 px-1.5 py-1 text-right font-mono text-[10px] text-purple-900">
                          {formatPHP(tx.tax.totalTaxWithheld)}
                        </td>
                        <td className="px-1.5 py-1 text-right font-mono text-[10px] font-semibold text-slate-900">
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
                      <td className="border-r border-slate-800 px-1.5 py-1.5 text-right font-mono text-slate-900">
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

                {/* Signatures on Appendix 43 */}
                <div className="grid grid-cols-2 gap-8 text-xs pt-4 border-t border-slate-800 mb-4">
                  <div className="text-center space-y-4">
                    <p className="text-slate-600 italic">I certify that the entries in this register are true and correct:</p>
                    <div className="pt-4">
                      <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
                        {school.disbursingOfficerName}
                      </div>
                      <div className="text-[11px] text-slate-600">{school.disbursingOfficerTitle}</div>
                      <div className="text-[10px] text-slate-400">Accountable Officer</div>
                    </div>
                  </div>

                  <div className="text-center space-y-4">
                    <p className="text-slate-600 italic">Noted and Verified by:</p>
                    <div className="pt-4">
                      <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
                        {school.schoolHeadName}
                      </div>
                      <div className="text-[11px] text-slate-600">{school.schoolHeadTitle}</div>
                      <div className="text-[10px] text-slate-400">Secondary School Principal IV</div>
                    </div>
                  </div>
                </div>

                {/* Footer Designation with JASPER S. CAMPADO */}
                <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Document: GAM Form Appendix 43 (Page 2 of 2)</span>
                  <span className="font-semibold text-slate-700">
                    Admin Officer II &amp; System Dev: JASPER S. CAMPADO
                  </span>
                  <span>GAM for NGAs Compliant</span>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* PAGE 3: EXECUTIVE LIQUIDATION TRANSMITTAL & TAX SCHEDULE (BONUS SUMMARY) */}
            {/* ========================================================================= */}
            {(activePreviewSection === 'all' || activePreviewSection === 'transmittal') && (
              <div className="pdf-compilation-page bg-white p-8 sm:p-10 rounded-xl shadow-lg border border-slate-300 font-sans relative">
                <div className="flex justify-between items-center text-[11px] font-mono font-bold tracking-wider text-slate-500 mb-3 border-b border-slate-200 pb-1">
                  <span>DEPED FINANCIAL MANAGEMENT OPERATIONS MANUAL (FMOM)</span>
                  <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
                    Transmittal &amp; Tax Summary
                  </span>
                </div>

                {/* Transmittal Header */}
                <div className="text-center border-b-2 border-slate-900 pb-3 mb-4 space-y-0.5">
                  <div className="text-[11px] font-serif uppercase tracking-widest text-slate-600">
                    Republic of the Philippines
                  </div>
                  <div className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Department of Education · {school.region}
                  </div>
                  <div className="text-xs font-semibold text-slate-800">
                    Schools Division of {school.division}
                  </div>
                  <div className="text-base font-extrabold uppercase text-slate-900 pt-2">
                    EXECUTIVE MONTHLY LIQUIDATION TRANSMITTAL
                  </div>
                  <div className="text-xs font-medium text-slate-600">
                    For the Month of {cashAdvance.periodMonth} {cashAdvance.periodYear}
                  </div>
                </div>

                {/* Addressee */}
                <div className="text-xs space-y-1 mb-4 border-l-4 border-emerald-700 pl-3 py-1 bg-emerald-50/50">
                  <div className="font-bold text-slate-900">MEMORANDUM FOR:</div>
                  <div className="text-slate-800 font-semibold">{school.divisionAccountantName}</div>
                  <div className="text-slate-600">{school.divisionAccountantTitle}, Division Accounting Unit</div>
                  <div className="text-slate-600">Schools Division Office of {school.division}</div>
                </div>

                {/* Summary Table */}
                <div className="mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                    I. Financial Account Summary
                  </h3>
                  <table className="w-full text-xs border border-slate-800 border-collapse">
                    <tbody className="divide-y divide-slate-300">
                      <tr>
                        <td className="p-2 font-semibold bg-slate-50 w-2/3 border-r border-slate-800">
                          Cash Advance Received (Check #{cashAdvance.checkNo} / DV #{cashAdvance.dvNo})
                        </td>
                        <td className="p-2 text-right font-mono font-bold text-slate-900">
                          {formatPHP(cashAdvance.amountGranted)}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold bg-slate-50 border-r border-slate-800">
                          Total Liquidation Expenditures Incurred (Gross)
                        </td>
                        <td className="p-2 text-right font-mono font-bold text-slate-900">
                          {formatPHP(evaluation.totalDisbursedGross)}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold bg-slate-50 border-r border-slate-800">
                          Total Taxes Withheld for Remittance to BIR
                        </td>
                        <td className="p-2 text-right font-mono font-bold text-purple-900">
                          {formatPHP(evaluation.totalTaxWithheld)}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold bg-slate-50 border-r border-slate-800">
                          Total Net Amount Actually Paid to Suppliers / Creditors
                        </td>
                        <td className="p-2 text-right font-mono font-bold text-emerald-900">
                          {formatPHP(evaluation.totalNetPaid)}
                        </td>
                      </tr>
                      <tr className="bg-slate-100 font-extrabold border-t-2 border-slate-800">
                        <td className="p-2 uppercase border-r border-slate-800">
                          Remaining Unliquidated Cash Balance (Refund Amount)
                        </td>
                        <td className="p-2 text-right font-mono text-sm">
                          {formatPHP(evaluation.remainingCashBalance)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Withholding Tax Breakdown */}
                <div className="mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                    II. BIR Withholding Tax Remittance Schedule (Forms 1600 &amp; 0605 / 2307)
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2 rounded border border-slate-300 bg-slate-50">
                      <span className="text-[10px] text-slate-500 block">5% Final VAT</span>
                      <span className="font-mono font-bold text-slate-900">{formatPHP(totalVAT)}</span>
                    </div>
                    <div className="p-2 rounded border border-slate-300 bg-slate-50">
                      <span className="text-[10px] text-slate-500 block">3% Percentage Tax</span>
                      <span className="font-mono font-bold text-slate-900">{formatPHP(totalPercentageTax)}</span>
                    </div>
                    <div className="p-2 rounded border border-slate-300 bg-slate-50">
                      <span className="text-[10px] text-slate-500 block">1% EWT (Goods)</span>
                      <span className="font-mono font-bold text-slate-900">{formatPHP(totalGoodsEWT)}</span>
                    </div>
                    <div className="p-2 rounded border border-slate-300 bg-slate-50">
                      <span className="text-[10px] text-slate-500 block">2% EWT (Services)</span>
                      <span className="font-mono font-bold text-slate-900">{formatPHP(totalServicesEWT)}</span>
                    </div>
                  </div>
                </div>

                {/* Transmittal Signatures */}
                <div className="grid grid-cols-3 gap-4 text-xs pt-6 border-t border-slate-800 mt-6 text-center">
                  <div>
                    <p className="text-[10px] text-slate-500 mb-4">Submitted by:</p>
                    <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
                      {school.disbursingOfficerName}
                    </div>
                    <div className="text-[10px] text-slate-600">{school.disbursingOfficerTitle}</div>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-500 mb-4">Pre-Audited &amp; Developed by:</p>
                    <div className="border-b border-slate-900 pb-1 font-bold text-emerald-900 uppercase">
                      JASPER S. CAMPADO
                    </div>
                    <div className="text-[10px] text-slate-600">Admin Officer II &amp; System Dev</div>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-500 mb-4">Approved by:</p>
                    <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
                      {school.schoolHeadName}
                    </div>
                    <div className="text-[10px] text-slate-600">{school.schoolHeadTitle}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-900 text-slate-300 px-5 py-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0 no-print">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              Certified DepEd SDO Liquidation Dossier · Ready for Division Office Accounting submission
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400">Zoom:</span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 border border-slate-700"
            >
              -
            </button>
            <span className="font-mono text-slate-200 w-10 text-center">{zoomLevel}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 border border-slate-700"
            >
              +
            </button>

            <button
              type="button"
              disabled={isGeneratingPdf}
              onClick={handleDownloadPdf}
              className="cursor-pointer ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
