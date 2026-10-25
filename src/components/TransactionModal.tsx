import React, { useState, useRef } from 'react';
import { Transaction, ExpenseCategory, ParticularItem, SchoolProfile, ReceiptAttachment } from '../types';
import { computeDepEdTax, formatPHP } from '../utils/taxCalculator';
import {
  Camera,
  Image as ImageIcon,
  Upload,
  Trash2,
  Paperclip,
  Eye,
  Plus,
  CheckCircle2,
  X,
  ShieldAlert,
  Calculator,
} from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
  editingTransaction?: Transaction | null;
  school: SchoolProfile;
  currentDisbursementCount: number;
}

const CATEGORIES: ExpenseCategory[] = [
  'Category B: Consumable Office & School Supplies',
  'Category C: Semi-Expendable Property & Equipment (< ₱50,000)',
  'Category D: Repairs & Maintenance of School Buildings',
  'Category E: Utilities & Communication Expenses',
  'Category F: Travel Expenses',
  'Category G: School-Based Feeding Program (SBFP)',
  'Category H: Small Purchases & Minor Expenses Without ORs',
];

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTransaction,
  school,
  currentDisbursementCount,
}) => {
  if (!isOpen) return null;

  const defaultDV = `DV-2026-10-${String(currentDisbursementCount + 1).padStart(3, '0')}`;
  const defaultCheck = `CHK-${String(currentDisbursementCount + 1).padStart(3, '0')}`;

  const [date, setDate] = useState(editingTransaction?.date || '2026-10-25');
  const [dvNo, setDvNo] = useState(editingTransaction?.dvNo || defaultDV);
  const [checkOrRefNo, setCheckOrRefNo] = useState(editingTransaction?.checkOrRefNo || defaultCheck);
  const [payeeName, setPayeeName] = useState(editingTransaction?.payeeName || '');
  const [payeeTIN, setPayeeTIN] = useState(editingTransaction?.payeeTIN || '000-000-000-000');
  const [payeeAddress, setPayeeAddress] = useState(editingTransaction?.payeeAddress || school.schoolAddress);
  const [category, setCategory] = useState<ExpenseCategory>(
    editingTransaction?.category || 'Category B: Consumable Office & School Supplies'
  );
  const [particulars, setParticulars] = useState(editingTransaction?.particulars || '');
  const [isGoodsOrServices, setIsGoodsOrServices] = useState<'goods' | 'services'>(
    editingTransaction?.isGoodsOrServices || 'goods'
  );
  const [isVatRegistered, setIsVatRegistered] = useState<boolean>(
    editingTransaction?.isVatRegistered ?? true
  );
  const [receiptType, setReceiptType] = useState<Transaction['receiptType']>(
    editingTransaction?.receiptType || 'Sales Invoice'
  );
  const [receiptNo, setReceiptNo] = useState(editingTransaction?.receiptNo || '');
  const [receiptDate, setReceiptDate] = useState(editingTransaction?.receiptDate || '2026-10-25');
  const [notes, setNotes] = useState(editingTransaction?.notes || '');
  const [receiptAttachments, setReceiptAttachments] = useState<ReceiptAttachment[]>(
    editingTransaction?.receiptAttachments || []
  );
  const [attachmentCategory, setAttachmentCategory] = useState<ReceiptAttachment['categoryType']>('Receipt / Sales Invoice');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const newAtt: ReceiptAttachment = {
          id: `att-${Date.now()}`,
          name: file.name,
          categoryType: attachmentCategory,
          dataUrl,
          uploadedAt: new Date().toLocaleString([], {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }),
          fileSizeKb: Math.round(file.size / 1024),
        };
        setReceiptAttachments((prev) => [...prev, newAtt]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setReceiptAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  // Item list
  const [items, setItems] = useState<ParticularItem[]>(
    editingTransaction?.items || [
      { id: '1', description: 'Office supplies & materials', unit: 'lot', quantity: 1, unitPrice: 2500, totalAmount: 2500 },
    ]
  );

  // Compute gross from items
  const grossAmount = items.reduce((sum, item) => sum + (Number(item.totalAmount) || 0), 0);

  // Live tax calculation
  const computedTax = computeDepEdTax(grossAmount, isVatRegistered, isGoodsOrServices);

  // RA 9184 threshold check (₱50,000.00 and above)
  const isThresholdTriggered = grossAmount >= 50000;

  const handleAddItem = () => {
    const newItem: ParticularItem = {
      id: Date.now().toString(),
      description: '',
      unit: 'pcs',
      quantity: 1,
      unitPrice: 0,
      totalAmount: 0,
    };
    setItems([...items, newItem]);
  };

  const handleUpdateItem = (index: number, field: keyof ParticularItem, value: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      const q = field === 'quantity' ? Number(value) || 0 : item.quantity;
      const p = field === 'unitPrice' ? Number(value) || 0 : item.unitPrice;
      item.totalAmount = Math.round(q * p * 100) / 100;
    }
    updated[index] = item;
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleApplyPreset = (presetKey: string) => {
    if (presetKey === 'supplies') {
      setCategory('Category B: Consumable Office & School Supplies');
      setParticulars('Purchase of A4 copy papers and instructional supplies for Q4 learning modules');
      setPayeeName('EduSupply Co. & Paper Trade');
      setPayeeTIN('241-890-123-000');
      setIsGoodsOrServices('goods');
      setIsVatRegistered(true);
      setReceiptType('Sales Invoice');
      setItems([
        { id: '1', description: 'Copy Paper A4 70gsm (Reams)', unit: 'ream', quantity: 20, unitPrice: 245, totalAmount: 4900 },
        { id: '2', description: 'Epson 003 Ink Cyan/Magenta/Yellow/Black set', unit: 'set', quantity: 2, unitPrice: 1350, totalAmount: 2700 },
      ]);
    } else if (presetKey === 'equipment') {
      setCategory('Category C: Semi-Expendable Property & Equipment (< ₱50,000)');
      setParticulars('Acquisition of 1 unit Heavy Duty Multi-Function EcoTank Printer for Principal Office & Registrar');
      setPayeeName('Infotech Commercial Corp');
      setPayeeTIN('112-984-555-000');
      setIsGoodsOrServices('goods');
      setIsVatRegistered(true);
      setReceiptType('Sales Invoice');
      setItems([
        { id: '1', description: 'EcoTank All-in-One Ink Tank Printer (< ₱50,000)', unit: 'unit', quantity: 1, unitPrice: 14800, totalAmount: 14800 },
      ]);
    } else if (presetKey === 'repairs') {
      setCategory('Category D: Repairs & Maintenance of School Buildings');
      setParticulars('Procurement of roofing sheets, sealants, and electrical fixtures for typhoon repairs of Bldg C classrooms');
      setPayeeName('St. Jude Hardware & Construction Supply');
      setPayeeTIN('334-112-908-000');
      setIsGoodsOrServices('goods');
      setIsVatRegistered(true);
      setReceiptType('Sales Invoice');
      setItems([
        { id: '1', description: 'Corrugated G.I. Sheets 8ft Gauge 26', unit: 'pcs', quantity: 10, unitPrice: 480, totalAmount: 4800 },
        { id: '2', description: 'VulcaSeal All-Weather elastomeric sealant', unit: 'can', quantity: 3, unitPrice: 320, totalAmount: 960 },
        { id: '3', description: 'LED Tube lights 18W with fixture', unit: 'sets', quantity: 10, unitPrice: 280, totalAmount: 2800 },
      ]);
    } else if (presetKey === 'utilities') {
      setCategory('Category E: Utilities & Communication Expenses');
      setParticulars('Payment for school electricity consumption for the billing period');
      setPayeeName('Manila Electric Company / Local Electric Coop');
      setPayeeTIN('000-101-528-000');
      setIsGoodsOrServices('services');
      setIsVatRegistered(true);
      setReceiptType('OR');
      setItems([
        { id: '1', description: 'Monthly Electricity Consumption Charge (SIN 901823)', unit: 'month', quantity: 1, unitPrice: 6850, totalAmount: 6850 },
      ]);
    } else if (presetKey === 'travel') {
      setCategory('Category F: Travel Expenses');
      setParticulars('Reimbursement of transportation expenses and meals during SDO Division Mid-Year Planning Conference');
      setPayeeName(school.schoolHeadName);
      setPayeeTIN(school.tin || '000-000-000-000');
      setIsGoodsOrServices('services');
      setIsVatRegistered(false);
      setReceiptType('OR');
      setItems([
        { id: '1', description: 'Actual bus/van fare and per diem pursuant to EO 77', unit: 'trip', quantity: 1, unitPrice: 2600, totalAmount: 2600 },
      ]);
    } else if (presetKey === 'feeding') {
      setCategory('Category G: School-Based Feeding Program (SBFP)');
      setParticulars('Supply and delivery of fresh eggs, fortified buns, and pasteurized milk for 45 SBFP beneficiaries');
      setPayeeName('Luzon Agro-Dairy Farmers Cooperative');
      setPayeeTIN('455-789-001-000');
      setIsGoodsOrServices('goods');
      setIsVatRegistered(false);
      setReceiptType('Sales Invoice');
      setItems([
        { id: '1', description: 'Fresh Farm Eggs Large (30 pcs/tray)', unit: 'tray', quantity: 15, unitPrice: 240, totalAmount: 3600 },
        { id: '2', description: 'Fortified Milk Packs 200ml', unit: 'packs', quantity: 180, unitPrice: 25, totalAmount: 4500 },
      ]);
    } else if (presetKey === 'minor') {
      setCategory('Category H: Small Purchases & Minor Expenses Without ORs');
      setParticulars('Emergency photocopy of testing materials and tricycle fare of liaison officer');
      setPayeeName('Liaison Teacher Officer');
      setPayeeTIN('000-000-000-000');
      setIsGoodsOrServices('services');
      setIsVatRegistered(false);
      setReceiptType('COA 2017-001 Cert');
      setItems([
        { id: '1', description: 'Photocopy of masterlist and local transport (< ₱300)', unit: 'lot', quantity: 1, unitPrice: 240, totalAmount: 240 },
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payeeName.trim()) {
      alert('Please specify the Payee / Supplier Name.');
      return;
    }
    if (grossAmount <= 0) {
      alert('Total amount must be greater than ₱0.00.');
      return;
    }

    const transaction: Transaction = {
      id: editingTransaction?.id || `TX-${Date.now().toString().slice(-4)}`,
      date,
      dvNo,
      checkOrRefNo,
      payeeName,
      payeeTIN,
      payeeAddress,
      category,
      particulars: particulars || `Payment for ${category}`,
      items,
      isGoodsOrServices,
      isVatRegistered,
      grossAmount,
      tax: computedTax,
      receiptType,
      receiptNo: receiptNo || `REF-${Date.now().toString().slice(-5)}`,
      receiptDate,
      notes,
      isPhilGEPSRequired: isThresholdTriggered,
      receiptAttachments,
    };

    onSave(transaction);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-3xl my-8 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {editingTransaction ? 'Edit MOOE Disbursement Voucher' : 'New MOOE Disbursement Entry'}
            </h2>
            <p className="text-xs text-slate-500">
              Auto-computes withholding taxes (BIR 2307), logs to CDR (Appendix 43), &amp; updates Liquidation Report (Appendix 44)
            </p>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* RA 9184 Threshold Banner if >= 50,000 */}
          {isThresholdTriggered && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <div className="font-bold">RA 9184 Procurement Threshold Triggered (₱50,000.00 &amp; Above)</div>
                <p className="text-amber-800">
                  By law, this transaction requires <strong>PhilGEPS Posting</strong>, <strong>BAC Resolution</strong>,{' '}
                  <strong>Notice of Award (NOA)</strong>, and <strong>Notice to Proceed (NTP)</strong>. All BAC members will be
                  automatically inserted into the Abstract of Canvass and BAC Resolution.
                </p>
              </div>
            </div>
          )}

          {/* Quick-Fill Accounting Presets Toolbar */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <span>⚡</span> 1-Click Accounting Transaction Presets:
              </span>
              <span className="text-[11px] text-emerald-700">Auto-fills category, taxes &amp; particulars</span>
            </div>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleApplyPreset('supplies')}
                className="cursor-pointer px-2.5 py-1 rounded bg-white hover:bg-emerald-100 text-emerald-900 font-medium border border-emerald-300 shadow-2xs transition-colors"
              >
                📦 School Supplies (A4, Ink)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('equipment')}
                className="cursor-pointer px-2.5 py-1 rounded bg-white hover:bg-emerald-100 text-emerald-900 font-medium border border-emerald-300 shadow-2xs transition-colors"
              >
                💻 Semi-Expendable IT (&lt; ₱50k)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('repairs')}
                className="cursor-pointer px-2.5 py-1 rounded bg-white hover:bg-emerald-100 text-emerald-900 font-medium border border-emerald-300 shadow-2xs transition-colors"
              >
                🔨 Repairs &amp; Maintenance
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('utilities')}
                className="cursor-pointer px-2.5 py-1 rounded bg-white hover:bg-emerald-100 text-emerald-900 font-medium border border-emerald-300 shadow-2xs transition-colors"
              >
                ⚡ Electricity &amp; Water
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('travel')}
                className="cursor-pointer px-2.5 py-1 rounded bg-white hover:bg-emerald-100 text-emerald-900 font-medium border border-emerald-300 shadow-2xs transition-colors"
              >
                🚌 Travel Reimbursement
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('feeding')}
                className="cursor-pointer px-2.5 py-1 rounded bg-white hover:bg-emerald-100 text-emerald-900 font-medium border border-emerald-300 shadow-2xs transition-colors"
              >
                🍲 SBFP Feeding Program
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('minor')}
                className="cursor-pointer px-2.5 py-1 rounded bg-white hover:bg-emerald-100 text-emerald-900 font-medium border border-emerald-300 shadow-2xs transition-colors"
              >
                🧾 Minor (&le; ₱300 COA Cert)
              </button>
            </div>
          </div>

          {/* Section 1: Basic Voucher Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Disbursement Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Disbursement Voucher (DV) No.</label>
              <input
                type="text"
                value={dvNo}
                onChange={(e) => setDvNo(e.target.value)}
                className="w-full text-xs font-mono border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Check / ACIC Ref No.</label>
              <input
                type="text"
                value={checkOrRefNo}
                onChange={(e) => setCheckOrRefNo(e.target.value)}
                className="w-full text-xs font-mono border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Section 2: Payee & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Payee / Supplier / Claimant Name</label>
              <input
                type="text"
                value={payeeName}
                onChange={(e) => setPayeeName(e.target.value)}
                placeholder="e.g. Crown Paper & Supplies Mart"
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Payee TIN (for BIR 2307)</label>
              <input
                type="text"
                value={payeeTIN}
                onChange={(e) => setPayeeTIN(e.target.value)}
                placeholder="000-000-000-000"
                className="w-full text-xs font-mono border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Expense Category (GAM)</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Payee Registered Address</label>
              <input
                type="text"
                value={payeeAddress}
                onChange={(e) => setPayeeAddress(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Particulars / Nature of Payment</label>
            <textarea
              value={particulars}
              onChange={(e) => setParticulars(e.target.value)}
              placeholder="e.g. Procurement of mimeographing ink and instructional papers for Q2 examination..."
              rows={2}
              className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Section 3: Itemized Line Items */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">Itemized Breakdown (PR / PO / IAR Lines)</label>
              <button
                type="button"
                onClick={handleAddItem}
                className="cursor-pointer text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item Line</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="px-3 py-2">Description</th>
                    <th className="px-3 py-2 w-20">Unit</th>
                    <th className="px-3 py-2 w-20">Qty</th>
                    <th className="px-3 py-2 w-28 text-right">Unit Price</th>
                    <th className="px-3 py-2 w-32 text-right">Total</th>
                    <th className="px-2 py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="px-3 py-1.5">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleUpdateItem(idx, 'description', e.target.value)}
                          placeholder="Item name / specification"
                          className="w-full text-xs px-2 py-1 border border-slate-200 rounded focus:outline-none focus:border-emerald-500"
                          required
                        />
                      </td>
                      <td className="px-3 py-1.5">
                        <input
                          type="text"
                          value={item.unit}
                          onChange={(e) => handleUpdateItem(idx, 'unit', e.target.value)}
                          placeholder="pcs/box"
                          className="w-full text-xs px-2 py-1 border border-slate-200 rounded focus:outline-none focus:border-emerald-500"
                        />
                      </td>
                      <td className="px-3 py-1.5">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(idx, 'quantity', e.target.value)}
                          className="w-full text-xs px-2 py-1 border border-slate-200 rounded focus:outline-none focus:border-emerald-500 font-mono text-center"
                          required
                        />
                      </td>
                      <td className="px-3 py-1.5">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => handleUpdateItem(idx, 'unitPrice', e.target.value)}
                          className="w-full text-xs px-2 py-1 border border-slate-200 rounded focus:outline-none focus:border-emerald-500 font-mono text-right"
                          required
                        />
                      </td>
                      <td className="px-3 py-1.5 text-right font-mono font-semibold text-slate-800">
                        {formatPHP(item.totalAmount)}
                      </td>
                      <td className="px-2 py-1.5 text-center">
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="cursor-pointer text-slate-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: DepEd Government Tax Withholding Auto-Calculator */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold text-slate-900">
                  Government Tax Withholding Engine (BIR 2307 &amp; 2306)
                </span>
              </div>
              <span className="text-[11px] text-slate-500">DepEd Mandate: 5% VAT / 3% PT + 1%/2% EWT</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Supplier Tax Category</label>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="vatStatus"
                      checked={isVatRegistered}
                      onChange={() => setIsVatRegistered(true)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>VAT-Registered (5% Final VAT)</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer ml-3">
                    <input
                      type="radio"
                      name="vatStatus"
                      checked={!isVatRegistered}
                      onChange={() => setIsVatRegistered(false)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Non-VAT (3% Percentage Tax)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nature of Procurement</label>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="goodsServices"
                      checked={isGoodsOrServices === 'goods'}
                      onChange={() => setIsGoodsOrServices('goods')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Goods / Supplies (1% EWT)</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer ml-3">
                    <input
                      type="radio"
                      name="goodsServices"
                      checked={isGoodsOrServices === 'services'}
                      onChange={() => setIsGoodsOrServices('services')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Services / Labor (2% EWT)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Computation Summary Strip */}
            <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Gross Invoice Amount</span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">{formatPHP(grossAmount)}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px]">
                  {isVatRegistered ? '5% Final Withholding VAT' : '3% Percentage Tax'}
                </span>
                <span className="font-mono font-semibold text-purple-700 tabular-nums">
                  {formatPHP(computedTax.taxTypeAmount)}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px]">
                  {isGoodsOrServices === 'goods' ? '1% EWT (Goods)' : '2% EWT (Services)'}
                </span>
                <span className="font-mono font-semibold text-purple-700 tabular-nums">
                  {formatPHP(computedTax.ewtAmount)}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-emerald-300 bg-emerald-50/30">
                <span className="text-emerald-800 block text-[10px] font-semibold">Net Payable to Payee</span>
                <span className="font-mono font-bold text-emerald-800 tabular-nums">
                  {formatPHP(computedTax.netAmountPaid)}
                </span>
              </div>
            </div>
          </div>

          {/* Section 5: Official Receipt / Proof Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Receipt / Voucher Type</label>
              <select
                value={receiptType}
                onChange={(e) => setReceiptType(e.target.value as any)}
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="Sales Invoice">Sales Invoice (SI) + DR</option>
                <option value="OR">Official Receipt (OR)</option>
                <option value="Billing SOA">Billing SOA / Statement</option>
                <option value="RER">RER Appendix 46 (&gt; ₱300)</option>
                <option value="COA 2017-001 Cert">COA 2017-001 Cert (&le; ₱300)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Receipt / Invoice / RER No.</label>
              <input
                type="text"
                value={receiptNo}
                onChange={(e) => setReceiptNo(e.target.value)}
                placeholder="e.g. SI-94821 or OR-1002"
                className="w-full text-xs font-mono border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Receipt Date</label>
              <input
                type="date"
                value={receiptDate}
                onChange={(e) => setReceiptDate(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 6: Receipt Pictures & Proof Attachments */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-700" />
                  <span>Attach Receipt Pictures, SI / OR &amp; Proof Photos</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Upload pictures of Official Receipts, Sales Invoices, property tags, or repair progress photos. Automatically stored in dossier.
                </p>
              </div>

              {/* Upload & Camera Actions */}
              <div className="flex items-center gap-2">
                <select
                  value={attachmentCategory}
                  onChange={(e) => setAttachmentCategory(e.target.value as any)}
                  className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Receipt / Sales Invoice">Receipt / Sales Invoice</option>
                  <option value="Delivery Receipt (DR)">Delivery Receipt (DR)</option>
                  <option value="Property Tag Photo">Property Tag Photo (&lt; ₱50k)</option>
                  <option value="Repair Photo (Before/During/After)">Repair Photo (Progress)</option>
                  <option value="Proof of Payment / Ticket">Proof of Payment / Ticket</option>
                </select>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-2xs transition-colors whitespace-nowrap"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Attach Photo</span>
                </button>
              </div>
            </div>

            {/* Attached Photos Gallery */}
            {receiptAttachments.length === 0 ? (
              <div className="border border-dashed border-slate-300 rounded-lg p-4 text-center text-xs text-slate-500 bg-white">
                <ImageIcon className="w-6 h-6 mx-auto text-slate-300 mb-1" />
                <p>No receipt pictures attached yet. Click <strong>"Attach Photo"</strong> to upload invoice photos, property tags, or repair documentation.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {receiptAttachments.map((att) => (
                  <div key={att.id} className="relative group border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                    <img
                      src={att.dataUrl}
                      alt={att.name}
                      className="w-full h-24 object-cover"
                    />
                    <div className="p-1.5">
                      <div className="text-[10px] font-bold text-slate-800 truncate" title={att.name}>
                        {att.name}
                      </div>
                      <div className="text-[9px] text-emerald-800 font-semibold truncate">
                        {att.categoryType}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(att.id)}
                      className="cursor-pointer absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity shadow-xs"
                      title="Delete attachment"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Signatory Preview Banner */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800">Auto-Assigned Signatories: </span>
              <span>
                School Head ({school.schoolHeadName}) · SDO ({school.disbursingOfficerName}) · BAC Chair (
                {school.bacChairperson})
              </span>
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">Automatic Signature Binding</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs"
            >
              {editingTransaction ? 'Update Disbursement' : 'Save & Auto-Log to Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
