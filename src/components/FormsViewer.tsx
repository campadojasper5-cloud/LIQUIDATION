import React, { useState } from 'react';
import { Printer, Download, Eye, Layers, FileText, ArrowRight, RefreshCw, FileCheck } from 'lucide-react';
import { SchoolProfile, CashAdvance, Transaction, AuditEvaluation } from '../types';
import { Appendix44LiquidationReport } from './forms/Appendix44LiquidationReport';
import { Appendix43CashDisbursementRegister } from './forms/Appendix43CashDisbursementRegister';
import { BirForm2307 } from './forms/BirForm2307';
import { Appendix60PR } from './forms/Appendix60PR';
import { Appendix61PO } from './forms/Appendix61PO';
import { Appendix62IAR } from './forms/Appendix62IAR';
import { Appendix63RIS } from './forms/Appendix63RIS';
import { Appendix59ICS } from './forms/Appendix59ICS';
import { Appendix46RER } from './forms/Appendix46RER';
import { Coa2017Certificate } from './forms/Coa2017Certificate';
import { BacAbstractCanvass } from './forms/BacAbstractCanvass';

interface FormsViewerProps {
  school: SchoolProfile;
  cashAdvance: CashAdvance;
  transactions: Transaction[];
  evaluation: AuditEvaluation;
  initialForm?: string;
  initialTransactionId?: string;
  onOpenMonthlyPdf?: () => void;
}

export const FormsViewer: React.FC<FormsViewerProps> = ({
  school,
  cashAdvance,
  transactions,
  evaluation,
  initialForm = 'app44',
  initialTransactionId,
  onOpenMonthlyPdf,
}) => {
  const [activeForm, setActiveForm] = useState<string>(initialForm);
  const [selectedTxId, setSelectedTxId] = useState<string>(
    initialTransactionId || (transactions[0] ? transactions[0].id : '')
  );

  const selectedTransaction =
    transactions.find((t) => t.id === selectedTxId) || transactions[0];

  const handlePrint = () => {
    window.print();
  };

  const formsList = [
    { id: 'app44', label: 'GAM App 44: Liquidation Report', type: 'consolidated' },
    { id: 'app43', label: 'GAM App 43: Cash Disbursement Register', type: 'consolidated' },
    { id: 'bir2307', label: 'BIR Form 2307: Tax Withheld', type: 'transaction' },
    { id: 'po', label: 'GAM App 61: Purchase Order (PO)', type: 'transaction' },
    { id: 'iar', label: 'GAM App 62: Inspection & Acceptance (IAR)', type: 'transaction' },
    { id: 'pr', label: 'GAM App 60: Purchase Request (PR)', type: 'transaction' },
    { id: 'canvass', label: 'BAC: Abstract of Quotations', type: 'transaction' },
    { id: 'ris', label: 'GAM App 63: Requisition & Issue (RIS)', type: 'transaction' },
    { id: 'ics', label: 'GAM App 59: Inventory Custodian (ICS)', type: 'transaction' },
    { id: 'rer', label: 'GAM App 46: Reimbursement Receipt (RER)', type: 'transaction' },
    { id: 'cenrr', label: 'COA 2017-001: Expense Certificate (≤ ₱300)', type: 'transaction' },
  ];

  const currentFormDef = formsList.find((f) => f.id === activeForm);
  const isTransactionLinked = currentFormDef?.type === 'transaction';

  return (
    <div className="space-y-4">
      {/* Top Form Navigation Strip */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Official DepEd &amp; GAM Forms Suite</h2>
            <p className="text-xs text-slate-500">
              Compliant with Government Accounting Manual (GAM for NGAs) &amp; Bureau of Internal Revenue (BIR)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenMonthlyPdf && (
              <button
                type="button"
                onClick={onOpenMonthlyPdf}
                className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 rounded-lg shadow-xs transition-all border border-emerald-500/40"
              >
                <Download className="w-3.5 h-3.5 text-emerald-200" />
                <span>Monthly Summary PDF (App 43 &amp; 44)</span>
              </button>
            )}
            <button
              onClick={handlePrint}
              className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Form</span>
            </button>
          </div>
        </div>

        {/* Form Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {formsList.map((form) => (
            <button
              key={form.id}
              onClick={() => setActiveForm(form.id)}
              className={`cursor-pointer px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition-colors border ${
                activeForm === form.id
                  ? 'bg-emerald-800 border-emerald-800 text-white font-semibold shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              {form.label}
            </button>
          ))}
        </div>

        {/* Transaction Selector for Transaction-Linked Forms */}
        {isTransactionLinked && (
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-700 whitespace-nowrap">Auto-Fill from Voucher:</span>
              <select
                value={selectedTxId}
                onChange={(e) => setSelectedTxId(e.target.value)}
                className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 max-w-md truncate"
              >
                {transactions.map((tx) => (
                  <option key={tx.id} value={tx.id}>
                    {tx.dvNo} · {tx.payeeName} ({tx.category.split(':')[0]}) - ₱{tx.grossAmount.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>All signatures and supplier metadata automatically synced</span>
            </div>
          </div>
        )}
      </div>

      {/* Render Active Official Form */}
      <div className="overflow-x-auto">
        {activeForm === 'app44' && (
          <Appendix44LiquidationReport
            school={school}
            cashAdvance={cashAdvance}
            transactions={transactions}
            evaluation={evaluation}
          />
        )}

        {activeForm === 'app43' && (
          <Appendix43CashDisbursementRegister
            school={school}
            cashAdvance={cashAdvance}
            transactions={transactions}
            evaluation={evaluation}
          />
        )}

        {activeForm === 'bir2307' && selectedTransaction && (
          <BirForm2307
            transaction={selectedTransaction}
            school={school}
            cashAdvance={cashAdvance}
          />
        )}

        {activeForm === 'pr' && selectedTransaction && (
          <Appendix60PR
            transaction={selectedTransaction}
            school={school}
            cashAdvance={cashAdvance}
          />
        )}

        {activeForm === 'po' && selectedTransaction && (
          <Appendix61PO
            transaction={selectedTransaction}
            school={school}
            cashAdvance={cashAdvance}
          />
        )}

        {activeForm === 'iar' && selectedTransaction && (
          <Appendix62IAR
            transaction={selectedTransaction}
            school={school}
            cashAdvance={cashAdvance}
          />
        )}

        {activeForm === 'ris' && selectedTransaction && (
          <Appendix63RIS
            transaction={selectedTransaction}
            school={school}
            cashAdvance={cashAdvance}
          />
        )}

        {activeForm === 'ics' && selectedTransaction && (
          <Appendix59ICS
            transaction={selectedTransaction}
            school={school}
            cashAdvance={cashAdvance}
          />
        )}

        {activeForm === 'canvass' && selectedTransaction && (
          <BacAbstractCanvass
            transaction={selectedTransaction}
            school={school}
            cashAdvance={cashAdvance}
          />
        )}

        {activeForm === 'rer' && selectedTransaction && (
          <Appendix46RER
            transaction={selectedTransaction}
            school={school}
            cashAdvance={cashAdvance}
          />
        )}

        {activeForm === 'cenrr' && selectedTransaction && (
          <Coa2017Certificate
            transaction={selectedTransaction}
            school={school}
            cashAdvance={cashAdvance}
          />
        )}
      </div>
    </div>
  );
};
