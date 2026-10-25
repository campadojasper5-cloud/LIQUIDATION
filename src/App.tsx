import React, { useState, useEffect } from 'react';
import {
  INITIAL_SCHOOL_PROFILE,
  INITIAL_CASH_ADVANCE,
  INITIAL_TRANSACTIONS,
  INITIAL_CHECKLIST,
} from './data/sampleData';
import { SchoolProfile, CashAdvance, Transaction, ChecklistItem, AuditEvaluation } from './types';
import { evaluateLiquidationPacket } from './utils/taxCalculator';
import { TopBar, NavigationTab } from './components/TopBar';
import { DashboardAnalytics } from './components/DashboardAnalytics';
import { FundFlowMonitor } from './components/FundFlowMonitor';
import { TransactionLedger } from './components/TransactionLedger';
import { MasterChecklist } from './components/MasterChecklist';
import { FormsViewer } from './components/FormsViewer';
import { RegistrationHub } from './components/RegistrationHub';
import { TransactionModal } from './components/TransactionModal';
import { UploadDocumentModal } from './components/UploadDocumentModal';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { GoogleDriveSyncModal } from './components/GoogleDriveSyncModal';
import { LegitCertificateModal } from './components/LegitCertificateModal';
import { ReceiptViewerModal } from './components/ReceiptViewerModal';
import { ThemeAndLogoModal, BackgroundTheme } from './components/ThemeAndLogoModal';
import { MonthlySummaryPdfModal } from './components/MonthlySummaryPdfModal';
import { ReceiptAttachment } from './types';
import {
  Sparkles,
  Upload,
  HardDrive,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Printer,
  TrendingDown,
  TrendingUp,
  Palette,
  Download,
} from 'lucide-react';

export default function App() {
  // LocalStorage state management with fallback to sample data
  const [school, setSchool] = useState<SchoolProfile>(() => {
    const saved = localStorage.getItem('deped_mooe_school');
    return saved ? JSON.parse(saved) : INITIAL_SCHOOL_PROFILE;
  });

  const [cashAdvance, setCashAdvance] = useState<CashAdvance>(() => {
    const saved = localStorage.getItem('deped_mooe_ca');
    return saved ? JSON.parse(saved) : INITIAL_CASH_ADVANCE;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('deped_mooe_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem('deped_mooe_checklist');
    return saved ? JSON.parse(saved) : INITIAL_CHECKLIST;
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');

  // Form Viewer Deep Link State
  const [targetFormKey, setTargetFormKey] = useState<string>('app44');
  const [targetTransactionId, setTargetTransactionId] = useState<string | undefined>(undefined);

  // Modals state
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isMonthlyPdfModalOpen, setIsMonthlyPdfModalOpen] = useState(false);

  // Receipt photos viewer modal state
  const [viewingReceiptTransaction, setViewingReceiptTransaction] = useState<Transaction | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Theme & Appearance state
  const [theme, setTheme] = useState<BackgroundTheme>(() => {
    return (localStorage.getItem('deped_mooe_theme') as BackgroundTheme) || 'emerald';
  });
  const [customBgUrl, setCustomBgUrl] = useState<string>(() => {
    return localStorage.getItem('deped_mooe_bg_image') || '';
  });
  const [bgOpacity, setBgOpacity] = useState<number>(() => {
    const val = localStorage.getItem('deped_mooe_bg_opacity');
    return val ? parseFloat(val) : 0.15;
  });
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('deped_mooe_school', JSON.stringify(school));
  }, [school]);

  useEffect(() => {
    localStorage.setItem('deped_mooe_ca', JSON.stringify(cashAdvance));
  }, [cashAdvance]);

  useEffect(() => {
    localStorage.setItem('deped_mooe_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('deped_mooe_checklist', JSON.stringify(checklist));
  }, [checklist]);

  useEffect(() => {
    localStorage.setItem('deped_mooe_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('deped_mooe_bg_image', customBgUrl);
  }, [customBgUrl]);

  useEffect(() => {
    localStorage.setItem('deped_mooe_bg_opacity', bgOpacity.toString());
  }, [bgOpacity]);

  const getThemeBackgroundClass = () => {
    switch (theme) {
      case 'emerald':
        return 'bg-gradient-to-br from-slate-50 via-emerald-50/25 to-teal-50/30 text-slate-900';
      case 'slate':
        return 'bg-slate-100/90 text-slate-900';
      case 'sapphire':
        return 'bg-gradient-to-br from-slate-50 via-blue-50/25 to-indigo-50/25 text-slate-900';
      case 'parchment':
        return 'bg-[#faf8f5] text-stone-900';
      case 'cyber':
        return 'bg-slate-950 text-slate-100';
      case 'custom':
        return 'bg-slate-50 text-slate-900';
      default:
        return 'bg-slate-50 text-slate-900';
    }
  };

  // Recalculate audit evaluation
  const evaluation: AuditEvaluation = evaluateLiquidationPacket(cashAdvance, transactions, checklist);

  // Transaction handlers
  const handleSaveTransaction = (transaction: Transaction) => {
    if (editingTransaction) {
      setTransactions((prev) => prev.map((t) => (t.id === transaction.id ? transaction : t)));
    } else {
      setTransactions((prev) => [transaction, ...prev]);
    }
    setIsTransactionModalOpen(false);
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    if (confirm('Are you sure you want to delete this disbursement entry?')) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleEditTransaction = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsTransactionModalOpen(true);
  };

  // Checklist handlers
  const handleToggleChecklistStatus = (id: string, newStatus: ChecklistItem['status']) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const handleUpdateChecklistNotes = (id: string, notes: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes } : item))
    );
  };

  const handleAttachChecklistFile = (id: string, attachedFileName: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, attachedFileName, status: 'VERIFIED' } : item))
    );
  };

  const handleOpenReceiptModal = (tx: Transaction) => {
    setViewingReceiptTransaction(tx);
    setIsReceiptModalOpen(true);
  };

  const handleUpdateAttachments = (transactionId: string, attachments: ReceiptAttachment[]) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === transactionId ? { ...t, receiptAttachments: attachments } : t))
    );
    if (viewingReceiptTransaction && viewingReceiptTransaction.id === transactionId) {
      setViewingReceiptTransaction((prev) => (prev ? { ...prev, receiptAttachments: attachments } : null));
    }
  };

  const handleSelectFormForTransaction = (tx: Transaction, formKey: string) => {
    setTargetFormKey(formKey);
    setTargetTransactionId(tx.id);
    setActiveTab('forms');
  };

  return (
    <div className={`min-h-screen relative flex flex-col font-sans transition-colors duration-500 ${getThemeBackgroundClass()}`}>
      {/* Optional Custom Campus Photo Background */}
      {customBgUrl && (
        <div
          className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center no-print"
          style={{
            backgroundImage: `url(${customBgUrl})`,
            opacity: bgOpacity,
          }}
        />
      )}

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Bar with Strict 3-Zone Contract */}
        <TopBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenNewTransaction={() => {
            setEditingTransaction(null);
            setIsTransactionModalOpen(true);
          }}
          onOpenSignatories={() => setActiveTab('registration')}
          onPrintAll={() => window.print()}
          school={school}
          onOpenThemeModal={() => setIsThemeModalOpen(true)}
          onOpenMonthlyPdf={() => setIsMonthlyPdfModalOpen(true)}
        />

        {/* Sub-Header Action Ticker */}
        <div className="bg-slate-900 text-slate-100 text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-slate-800 no-print flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-emerald-400">
              {school.schoolName} ({school.schoolId})
            </span>
            <span className="text-slate-500">·</span>
            <span>
              {cashAdvance.periodMonth} {cashAdvance.periodYear} MOOE Liquidation
            </span>
            <span className="text-slate-500">·</span>
            <span className={evaluation.is100PercentLiquidated ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {evaluation.is100PercentLiquidated ? '✓ 100% Fully Liquidated (₱0.00 Bal)' : `⚠️ Active Balance ₱${evaluation.remainingCashBalance.toLocaleString()}`}
            </span>
          </div>

          {/* Global Toolbar Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMonthlyPdfModalOpen(true)}
              className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-600 hover:to-emerald-600 text-white transition-all font-semibold text-[11px] shadow-2xs border border-emerald-400/30"
              title="Compile and Export Monthly Summary PDF (Appendix 43 & 44)"
            >
              <Download className="w-3.5 h-3.5 text-emerald-200" />
              <span>Summary PDF (43 &amp; 44)</span>
            </button>
            <button
              onClick={() => setIsThemeModalOpen(true)}
              className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 transition-colors font-medium text-[11px]"
              title="Customize School Logo & Background Theme"
            >
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>Theme &amp; Logo</span>
            </button>
            <button
              onClick={() => setIsAiAssistantOpen(true)}
              className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 transition-colors font-medium text-[11px]"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI Assistant</span>
            </button>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors font-medium text-[11px]"
            >
              <Upload className="w-3.5 h-3.5 text-slate-300" />
              <span>AI Scan Receipt</span>
            </button>
            <button
              onClick={() => setIsDriveModalOpen(true)}
              className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white transition-colors font-semibold text-[11px]"
            >
              <HardDrive className="w-3.5 h-3.5 text-blue-200" />
              <span>Save to Drive</span>
            </button>
          </div>
        </div>

        {/* Main Content Canvas */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'overview' && (
            <DashboardAnalytics
              school={school}
              cashAdvance={cashAdvance}
              transactions={transactions}
              checklist={checklist}
              evaluation={evaluation}
              onOpenNewTransaction={() => {
                setEditingTransaction(null);
                setIsTransactionModalOpen(true);
              }}
              onOpenChecklist={() => setActiveTab('checklist')}
              onOpenForms={() => setActiveTab('forms')}
              onOpenSignatories={() => setActiveTab('registration')}
              onOpenCertificate={() => setIsCertificateModalOpen(true)}
              onOpenThemeModal={() => setIsThemeModalOpen(true)}
              onOpenMonthlyPdf={() => setIsMonthlyPdfModalOpen(true)}
            />
          )}

        {activeTab === 'fundflow' && (
          <FundFlowMonitor
            school={school}
            cashAdvance={cashAdvance}
            transactions={transactions}
            evaluation={evaluation}
            onUpdateCashAdvance={(updated) => setCashAdvance(updated)}
            onOpenNewTransaction={() => {
              setEditingTransaction(null);
              setIsTransactionModalOpen(true);
            }}
            onSelectFormForTransaction={handleSelectFormForTransaction}
            onOpenReceipts={handleOpenReceiptModal}
            onNavigateToForms={() => setActiveTab('forms')}
          />
        )}

        {activeTab === 'ledger' && (
          <TransactionLedger
            transactions={transactions}
            onOpenNewTransaction={() => {
              setEditingTransaction(null);
              setIsTransactionModalOpen(true);
            }}
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onSelectFormForTransaction={handleSelectFormForTransaction}
            onOpenReceipts={handleOpenReceiptModal}
            school={school}
            cashAdvance={cashAdvance}
          />
        )}

        {activeTab === 'checklist' && (
          <MasterChecklist
            checklist={checklist}
            onToggleStatus={handleToggleChecklistStatus}
            onUpdateNotes={handleUpdateChecklistNotes}
            onAttachFile={handleAttachChecklistFile}
          />
        )}

        {activeTab === 'forms' && (
          <FormsViewer
            school={school}
            cashAdvance={cashAdvance}
            transactions={transactions}
            evaluation={evaluation}
            initialForm={targetFormKey}
            initialTransactionId={targetTransactionId}
            onOpenMonthlyPdf={() => setIsMonthlyPdfModalOpen(true)}
          />
        )}

        {activeTab === 'registration' && (
          <RegistrationHub
            school={school}
            onSaveProfile={(updated) => setSchool(updated)}
          />
        )}
      </main>

      {/* Floating Action Buttons (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2.5 no-print">
        <button
          onClick={() => setIsDriveModalOpen(true)}
          title="Save & Upload all transactions to Google Drive"
          className="cursor-pointer group flex items-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <HardDrive className="w-5 h-5" />
          <span className="hidden group-hover:inline text-xs font-semibold pr-1">Save to Drive</span>
        </button>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          title="Scan & Upload Form/Receipt with Gemini AI"
          className="cursor-pointer group flex items-center gap-2 p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <Upload className="w-5 h-5 text-emerald-400" />
          <span className="hidden group-hover:inline text-xs font-semibold pr-1">AI Form Scanner</span>
        </button>

        <button
          onClick={() => setIsAiAssistantOpen(true)}
          title="Open AI Liquidation & COA Audit Assistant"
          className="cursor-pointer group flex items-center gap-2 px-4 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <Sparkles className="w-5 h-5 text-emerald-300" />
          <span className="text-xs font-bold">Ask DepEd AI</span>
        </button>
      </div>

      {/* Modals & Drawers */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => {
          setIsTransactionModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
        editingTransaction={editingTransaction}
        school={school}
        currentDisbursementCount={transactions.length}
      />

      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onAutoAddTransaction={(newTx) => {
          setTransactions((prev) => [newTx, ...prev]);
        }}
        school={school}
        currentCount={transactions.length}
      />

      <AiAssistantDrawer
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        school={school}
        cashAdvance={cashAdvance}
        transactions={transactions}
        checklist={checklist}
        evaluation={evaluation}
      />

      <GoogleDriveSyncModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        school={school}
        cashAdvance={cashAdvance}
        transactions={transactions}
        checklist={checklist}
        evaluation={evaluation}
      />

      <LegitCertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        school={school}
        cashAdvance={cashAdvance}
        evaluation={evaluation}
      />

      {viewingReceiptTransaction && (
        <ReceiptViewerModal
          isOpen={isReceiptModalOpen}
          onClose={() => {
            setIsReceiptModalOpen(false);
            setViewingReceiptTransaction(null);
          }}
          transaction={viewingReceiptTransaction}
          onUpdateAttachments={handleUpdateAttachments}
        />
      )}

      {/* Theme & School Logo Customization Studio Modal */}
      <ThemeAndLogoModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        school={school}
        currentTheme={theme}
        customBgUrl={customBgUrl}
        bgOpacity={bgOpacity}
        onUpdateSchool={(updated) => setSchool(updated)}
        onSelectTheme={(t) => setTheme(t)}
        onUpdateCustomBg={(url) => setCustomBgUrl(url)}
        onUpdateBgOpacity={(op) => setBgOpacity(op)}
      />

      {/* Monthly Summary PDF Modal (Compiles Appendix 43 & 44 into a single downloadable document) */}
      <MonthlySummaryPdfModal
        isOpen={isMonthlyPdfModalOpen}
        onClose={() => setIsMonthlyPdfModalOpen(false)}
        school={school}
        cashAdvance={cashAdvance}
        transactions={transactions}
        evaluation={evaluation}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/90 bg-white/90 backdrop-blur-md py-4 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <div>
              DepEd MOOE Liquidation &amp; Procedural System · Compliant with COA Circular 97-002, RA 9184, &amp; GAM for NGAs
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
              Developed &amp; Architected by JASPER S. CAMPADO (Administrative Officer II &amp; Lead System Developer)
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <span>School ID: {school.schoolId}</span>
            <span>·</span>
            <span>{school.division}</span>
            <span>·</span>
            <button
              onClick={() => setIsThemeModalOpen(true)}
              className="cursor-pointer text-slate-700 hover:text-emerald-700 font-medium"
            >
              Logo &amp; Themes
            </button>
            <span>·</span>
            <button
              onClick={() => setIsCertificateModalOpen(true)}
              className="cursor-pointer text-emerald-700 hover:underline font-semibold"
            >
              Pre-Audit Certificate
            </button>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
