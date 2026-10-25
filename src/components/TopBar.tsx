import React from 'react';
import { ShieldCheck, Plus, Printer, Sliders, Palette, Sparkles, Download } from 'lucide-react';
import { SchoolProfile } from '../types';

export type NavigationTab = 'overview' | 'fundflow' | 'ledger' | 'checklist' | 'forms' | 'registration';

interface TopBarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  onOpenNewTransaction: () => void;
  onOpenSignatories: () => void;
  onPrintAll: () => void;
  school?: SchoolProfile;
  onOpenThemeModal?: () => void;
  onOpenMonthlyPdf?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewTransaction,
  onOpenSignatories,
  onPrintAll,
  school,
  onOpenThemeModal,
  onOpenMonthlyPdf,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Wordmark & School Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            onClick={onOpenThemeModal}
            title="Click to customize School Logo & Visual Appearance"
            className="cursor-pointer group relative w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden flex items-center justify-center transition-transform hover:scale-105"
          >
            {school?.logoUrl ? (
              <img src={school.logoUrl} alt="School Logo" className="w-full h-full object-contain p-0.5" />
            ) : (
              <div className="w-full h-full bg-emerald-700 flex items-center justify-center text-white font-bold text-xs">
                DEPED
              </div>
            )}
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[9px] font-bold transition-opacity">
              Logo
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
                DepEd MOOE Portal
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                AO-II: JASPER S. CAMPADO
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-500 tracking-normal">
              COA Circular 97-002 &amp; GAM Suite
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('overview')}
            className={`cursor-pointer pb-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-800 font-semibold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Overview &amp; Audit
          </button>
          <button
            onClick={() => setActiveTab('fundflow')}
            className={`cursor-pointer pb-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'fundflow'
                ? 'border-emerald-600 text-emerald-800 font-semibold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Fund IN/OUT Monitor
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`cursor-pointer pb-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'ledger'
                ? 'border-emerald-600 text-emerald-800 font-semibold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Disbursement Ledger
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`cursor-pointer pb-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'checklist'
                ? 'border-emerald-600 text-emerald-800 font-semibold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Master Checklist (A–H)
          </button>
          <button
            onClick={() => setActiveTab('forms')}
            className={`cursor-pointer pb-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'forms'
                ? 'border-emerald-600 text-emerald-800 font-semibold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Official GAM Forms
          </button>
          <button
            onClick={() => setActiveTab('registration')}
            className={`cursor-pointer pb-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'registration'
                ? 'border-emerald-600 text-emerald-800 font-semibold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            School &amp; Signatories
          </button>
        </nav>

        {/* Zone 3: Primary Action & Tools */}
        <div className="flex items-center gap-2.5 shrink-0">
          {onOpenThemeModal && (
            <button
              onClick={onOpenThemeModal}
              title="Change Background Theme & Upload School Logo"
              className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors whitespace-nowrap shadow-2xs"
            >
              <Palette className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Theme &amp; Logo</span>
            </button>
          )}
          <button
            onClick={onOpenSignatories}
            title="Configure BAC Members & Signatories"
            className="cursor-pointer hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Signatories Roster</span>
          </button>
          {onOpenMonthlyPdf && (
            <button
              onClick={onOpenMonthlyPdf}
              title="Compile and Export Monthly Summary PDF (Appendix 43 & 44)"
              className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors whitespace-nowrap shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Summary PDF</span>
            </button>
          )}
          <button
            onClick={onPrintAll}
            title="Print Current Liquidation View"
            className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print View</span>
          </button>
          <button
            onClick={onOpenNewTransaction}
            className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Mobile navigation tab strip */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto px-4 py-2 border-t border-slate-200 bg-slate-50 text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
            activeTab === 'overview' ? 'bg-emerald-700 text-white font-medium' : 'text-slate-600'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('fundflow')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
            activeTab === 'fundflow' ? 'bg-emerald-700 text-white font-medium' : 'text-slate-600'
          }`}
        >
          Fund IN/OUT
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
            activeTab === 'ledger' ? 'bg-emerald-700 text-white font-medium' : 'text-slate-600'
          }`}
        >
          Ledger
        </button>
        <button
          onClick={() => setActiveTab('checklist')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
            activeTab === 'checklist' ? 'bg-emerald-700 text-white font-medium' : 'text-slate-600'
          }`}
        >
          Checklist
        </button>
        <button
          onClick={() => setActiveTab('forms')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
            activeTab === 'forms' ? 'bg-emerald-700 text-white font-medium' : 'text-slate-600'
          }`}
        >
          GAM Forms
        </button>
        <button
          onClick={() => setActiveTab('registration')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
            activeTab === 'registration' ? 'bg-emerald-700 text-white font-medium' : 'text-slate-600'
          }`}
        >
          School &amp; Signatories
        </button>
      </div>
    </header>
  );
};
