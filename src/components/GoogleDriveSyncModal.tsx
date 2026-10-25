import React, { useState, useEffect } from 'react';
import {
  X,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Download,
  ExternalLink,
  ShieldCheck,
  FileSpreadsheet,
  FileJson,
  Loader2,
  HardDrive,
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  googleSignIn,
  googleSignOut,
  initAuth,
  uploadToGoogleDrive,
  generateLiquidationBackupPayload,
  getCachedAccessToken,
} from '../services/googleDriveService';
import { SchoolProfile, CashAdvance, Transaction, ChecklistItem, AuditEvaluation } from '../types';

interface GoogleDriveSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  school: SchoolProfile;
  cashAdvance: CashAdvance;
  transactions: Transaction[];
  checklist: ChecklistItem[];
  evaluation: AuditEvaluation;
}

export const GoogleDriveSyncModal: React.FC<GoogleDriveSyncModalProps> = ({
  isOpen,
  onClose,
  school,
  cashAdvance,
  transactions,
  checklist,
  evaluation,
}) => {
  if (!isOpen) return null;

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessUrl, setUploadSuccessUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, t) => {
        setCurrentUser(user);
        setToken(t);
      },
      () => {
        setCurrentUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setErrorMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
        setToken(result.accessToken);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Google Sign-in failed.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await googleSignOut();
    setCurrentUser(null);
    setToken(null);
    setUploadSuccessUrl(null);
  };

  const handleSaveToDrive = async () => {
    const accessToken = token || getCachedAccessToken();
    if (!accessToken) {
      setErrorMessage('Please sign in with your Google Account first.');
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);
    setUploadSuccessUrl(null);

    try {
      const filename = `DepEd_MOOE_Liquidation_${school.schoolId}_${cashAdvance.periodMonth}_${cashAdvance.periodYear}.json`;
      const payload = generateLiquidationBackupPayload(
        school,
        cashAdvance,
        transactions,
        checklist,
        evaluation
      );

      const result = await uploadToGoogleDrive(
        accessToken,
        filename,
        payload,
        'application/json'
      );

      setUploadSuccessUrl(
        result.webViewLink || `https://drive.google.com/file/d/${result.fileId}/view`
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upload liquidation packet to Google Drive.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadLocalJson = () => {
    const payload = generateLiquidationBackupPayload(
      school,
      cashAdvance,
      transactions,
      checklist,
      evaluation
    );
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DepEd_MOOE_Liquidation_${cashAdvance.periodMonth}_${cashAdvance.periodYear}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const headers = [
      'Date',
      'DV No',
      'Check No',
      'Payee',
      'TIN',
      'Category',
      'Particulars',
      'Gross Amount',
      'Tax Withheld',
      'Net Paid',
      'Receipt Type',
      'Receipt No',
    ];
    const rows = transactions.map((t) => [
      `"${t.date}"`,
      `"${t.dvNo}"`,
      `"${t.checkOrRefNo}"`,
      `"${t.payeeName.replace(/"/g, '""')}"`,
      `"${t.payeeTIN}"`,
      `"${t.category}"`,
      `"${t.particulars.replace(/"/g, '""')}"`,
      t.grossAmount,
      t.tax.totalTaxWithheld,
      t.tax.netAmountPaid,
      `"${t.receiptType}"`,
      `"${t.receiptNo}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DepEd_MOOE_CDR_Disbursements_${cashAdvance.periodMonth}_${cashAdvance.periodYear}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <UploadCloud className="w-4 h-4 text-blue-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Google Drive Cloud Storage</h2>
              <p className="text-xs text-slate-500">
                Save &amp; archive all MOOE transactions, CDR registers, and liquidation files
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* User Sign-In Box */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            {currentUser ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'User'}
                      className="w-10 h-10 rounded-full border border-slate-300"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                      {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {currentUser.displayName || 'Connected Account'}
                    </div>
                    <div className="text-[11px] text-slate-500">{currentUser.email}</div>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="cursor-pointer text-xs text-slate-500 hover:text-rose-600 underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="text-center py-2 space-y-3">
                <p className="text-xs text-slate-600">
                  Connect your Google Account to save transactions and liquidation reports directly to your Google Drive.
                </p>
                <button
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                  className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl shadow-xs hover:bg-slate-50 transition-colors"
                >
                  {isSigningIn ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                  )}
                  <span>Sign in with Google</span>
                </button>
              </div>
            )}
          </div>

          {/* Drive Save Button */}
          {currentUser && (
            <div className="space-y-2">
              <button
                onClick={handleSaveToDrive}
                disabled={isUploading}
                className="cursor-pointer w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-xs transition-colors"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Packet to Google Drive...</span>
                  </>
                ) : (
                  <>
                    <HardDrive className="w-4 h-4" />
                    <span>Save Complete Liquidation Dossier to Drive</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Upload Success Alert */}
          {uploadSuccessUrl && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Successfully Saved to Google Drive!</span>
              </div>
              <p className="text-emerald-800 text-[11px]">
                Your {cashAdvance.periodMonth} {cashAdvance.periodYear} liquidation packet has been backed up.
              </p>
              <div className="pt-1">
                <a
                  href={uploadSuccessUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-emerald-700 hover:text-emerald-900 underline inline-flex items-center gap-1"
                >
                  <span>Open in Google Drive</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* Error Notice */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Secondary Local Export Options */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Offline Local Backup Options
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDownloadLocalJson}
                className="cursor-pointer inline-flex items-center justify-center gap-1.5 p-2.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              >
                <FileJson className="w-3.5 h-3.5 text-emerald-600" />
                <span>Download JSON</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="cursor-pointer inline-flex items-center justify-center gap-1.5 p-2.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                <span>Export CSV Table</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
