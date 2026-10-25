import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  Receipt,
  Download,
  Camera,
  Image as ImageIcon,
} from 'lucide-react';
import { Transaction, ExpenseCategory, SchoolProfile, CashAdvance } from '../types';
import { formatPHP } from '../utils/taxCalculator';

interface TransactionLedgerProps {
  transactions: Transaction[];
  onOpenNewTransaction: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onSelectFormForTransaction: (tx: Transaction, formKey: string) => void;
  onOpenReceipts?: (tx: Transaction) => void;
  school: SchoolProfile;
  cashAdvance: CashAdvance;
}

export const TransactionLedger: React.FC<TransactionLedgerProps> = ({
  transactions,
  onOpenNewTransaction,
  onEditTransaction,
  onDeleteTransaction,
  onSelectFormForTransaction,
  onOpenReceipts,
  school,
  cashAdvance,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.payeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.dvNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.checkOrRefNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.particulars.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.receiptNo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || tx.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const totalGross = filteredTransactions.reduce((sum, tx) => sum + tx.grossAmount, 0);
  const totalTax = filteredTransactions.reduce((sum, tx) => sum + tx.tax.totalTaxWithheld, 0);
  const totalNet = filteredTransactions.reduce((sum, tx) => sum + tx.tax.netAmountPaid, 0);

  return (
    <div className="space-y-4">
      {/* Top Controls & Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">MOOE Cash Disbursement Ledger</h2>
            <p className="text-xs text-slate-500">
              Chronological register feeding into GAM Appendix 43 (CDR) and Appendix 44 (Liquidation Report)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenNewTransaction}
              className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record New Disbursement</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 border-t border-slate-100">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by payee, DV number, check number, OR/SI..."
              className="w-full text-xs pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:border-emerald-500 w-full sm:w-auto"
            >
              <option value="ALL">All Categories</option>
              <option value="Category B: Consumable Office & School Supplies">Category B: Supplies</option>
              <option value="Category C: Semi-Expendable Property & Equipment (< ₱50,000)">Category C: Semi-Expendable</option>
              <option value="Category D: Repairs & Maintenance of School Buildings">Category D: Repairs &amp; Maint.</option>
              <option value="Category E: Utilities & Communication Expenses">Category E: Utilities</option>
              <option value="Category F: Travel Expenses">Category F: Travel</option>
              <option value="Category H: Small Purchases & Minor Expenses Without ORs">Category H: Small Purchases</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="px-3.5 py-3 whitespace-nowrap">Date / DV No.</th>
                <th className="px-3.5 py-3 whitespace-nowrap">Check / Ref</th>
                <th className="px-3.5 py-3">Payee / Claimant</th>
                <th className="px-3.5 py-3">Particulars &amp; Category</th>
                <th className="px-3.5 py-3 text-right whitespace-nowrap">Gross Amount</th>
                <th className="px-3.5 py-3 text-right whitespace-nowrap">Tax Withheld</th>
                <th className="px-3.5 py-3 text-right whitespace-nowrap">Net Paid</th>
                <th className="px-3.5 py-3 whitespace-nowrap">Receipt / Ref</th>
                <th className="px-3.5 py-3 text-center whitespace-nowrap">Auto-Fill Docs</th>
                <th className="px-3.5 py-3 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-slate-400">
                    No transactions match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Date / DV No */}
                    <td className="px-3.5 py-3 align-top whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{tx.date}</div>
                      <div className="font-mono text-[11px] text-slate-500">{tx.dvNo}</div>
                    </td>

                    {/* Check No */}
                    <td className="px-3.5 py-3 align-top whitespace-nowrap">
                      <div className="font-mono text-slate-800 font-medium">{tx.checkOrRefNo}</div>
                    </td>

                    {/* Payee */}
                    <td className="px-3.5 py-3 align-top">
                      <div className="font-semibold text-slate-900">{tx.payeeName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">TIN: {tx.payeeTIN}</div>
                    </td>

                    {/* Particulars & Category */}
                    <td className="px-3.5 py-3 align-top max-w-xs">
                      <p className="text-slate-800 line-clamp-2 leading-relaxed">{tx.particulars}</p>
                      <div className="text-[11px] text-emerald-800 font-medium mt-0.5 truncate">
                        {tx.category.split(':')[0]}
                      </div>
                      {tx.grossAmount >= 50000 && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mt-1">
                          <ShieldAlert className="w-3 h-3" /> RA 9184 PhilGEPS Required
                        </span>
                      )}
                    </td>

                    {/* Gross */}
                    <td className="px-3.5 py-3 align-top text-right font-mono font-bold text-slate-900 tabular-nums whitespace-nowrap">
                      {formatPHP(tx.grossAmount)}
                    </td>

                    {/* Tax Withheld */}
                    <td className="px-3.5 py-3 align-top text-right whitespace-nowrap">
                      <div className="font-mono font-semibold text-purple-700 tabular-nums">
                        {formatPHP(tx.tax.totalTaxWithheld)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {tx.isVatRegistered ? '5% VAT' : '3% PT'} + {tx.isGoodsOrServices === 'goods' ? '1%' : '2%'}
                      </div>
                    </td>

                    {/* Net Paid */}
                    <td className="px-3.5 py-3 align-top text-right font-mono font-bold text-emerald-800 tabular-nums whitespace-nowrap">
                      {formatPHP(tx.tax.netAmountPaid)}
                    </td>

                    {/* Receipt & Attached Pictures */}
                    <td className="px-3.5 py-3 align-top whitespace-nowrap">
                      <span className="text-slate-700 font-medium">{tx.receiptType}</span>
                      <div className="font-mono text-[11px] text-slate-500">{tx.receiptNo}</div>
                      
                      {/* Receipt Picture Trigger */}
                      <button
                        type="button"
                        onClick={() => onOpenReceipts && onOpenReceipts(tx)}
                        className={`cursor-pointer inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold mt-1 transition-colors border ${
                          tx.receiptAttachments && tx.receiptAttachments.length > 0
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        }`}
                        title="View or upload receipt photos"
                      >
                        <Camera className="w-3 h-3 text-emerald-700" />
                        <span>
                          {tx.receiptAttachments && tx.receiptAttachments.length > 0
                            ? `${tx.receiptAttachments.length} Photo${tx.receiptAttachments.length > 1 ? 's' : ''}`
                            : '+ Add Photo'}
                        </span>
                      </button>
                    </td>

                    {/* Auto-Fill Related Official GAM Forms */}
                    <td className="px-3.5 py-3 align-top text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onSelectFormForTransaction(tx, 'bir2307')}
                          title="Generate & View BIR Form 2307 for this supplier"
                          className="cursor-pointer px-2 py-1 text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded border border-purple-200 transition-colors"
                        >
                          BIR 2307
                        </button>
                        {tx.category.includes('Supplies') && (
                          <button
                            onClick={() => onSelectFormForTransaction(tx, 'po')}
                            title="Auto-fill GAM Appendix 61 (Purchase Order)"
                            className="cursor-pointer px-2 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200"
                          >
                            PO / IAR
                          </button>
                        )}
                        {tx.category.includes('Semi-Expendable') && (
                          <button
                            onClick={() => onSelectFormForTransaction(tx, 'ics')}
                            title="Auto-fill GAM Appendix 59 (Inventory Custodian Slip)"
                            className="cursor-pointer px-2 py-1 text-[11px] font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200"
                          >
                            ICS App 59
                          </button>
                        )}
                        {tx.receiptType === 'RER' && (
                          <button
                            onClick={() => onSelectFormForTransaction(tx, 'rer')}
                            title="View GAM Appendix 46 (RER)"
                            className="cursor-pointer px-2 py-1 text-[11px] font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded border border-amber-200"
                          >
                            RER App 46
                          </button>
                        )}
                        {tx.receiptType === 'COA 2017-001 Cert' && (
                          <button
                            onClick={() => onSelectFormForTransaction(tx, 'cenrr')}
                            title="View COA Circular 2017-001 Certificate"
                            className="cursor-pointer px-2 py-1 text-[11px] font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded border border-teal-200"
                          >
                            COA Cert
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-3.5 py-3 align-top text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEditTransaction(tx)}
                          className="cursor-pointer p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                          title="Edit transaction"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteTransaction(tx.id)}
                          className="cursor-pointer p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {/* Table Footer Totals */}
            <tfoot className="bg-slate-50 border-t-2 border-slate-300 font-semibold text-slate-900">
              <tr>
                <td colSpan={4} className="px-3.5 py-3 text-right">
                  Total Disbursed ({filteredTransactions.length} records):
                </td>
                <td className="px-3.5 py-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                  {formatPHP(totalGross)}
                </td>
                <td className="px-3.5 py-3 text-right font-mono font-bold text-purple-700 tabular-nums">
                  {formatPHP(totalTax)}
                </td>
                <td className="px-3.5 py-3 text-right font-mono font-bold text-emerald-800 tabular-nums">
                  {formatPHP(totalNet)}
                </td>
                <td colSpan={3}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
