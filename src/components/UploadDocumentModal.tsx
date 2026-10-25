import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Loader2,
  Receipt,
  FileCheck,
} from 'lucide-react';
import { Transaction, SchoolProfile } from '../types';
import { computeDepEdTax, formatPHP } from '../utils/taxCalculator';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAutoAddTransaction: (transaction: Transaction) => void;
  school: SchoolProfile;
  currentCount: number;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
  onAutoAddTransaction,
  school,
  currentCount,
}) => {
  if (!isOpen) return null;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [extractedData, setExtractedData] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setErrorMsg(null);
      setExtractedData(null);

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => setPreviewUrl(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleStartAnalysis = async () => {
    if (!selectedFile) return;

    setAnalyzing(true);
    setErrorMsg(null);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const result = reader.result as string;
          const base64Data = result.split(',')[1];
          const mimeType = selectedFile.type || 'image/jpeg';

          const res = await fetch('/api/gemini/analyze-document', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileBase64: base64Data,
              mimeType,
              fileName: selectedFile.name,
            }),
          });

          const data = await res.json();
          if (!res.ok || data.error) {
            throw new Error(data.error || 'Failed to analyze document.');
          }

          setExtractedData(data.analysis);
        } catch (err: any) {
          setErrorMsg(err.message || 'Error occurred during AI document analysis.');
        } finally {
          setAnalyzing(false);
        }
      };
      reader.readAsDataURL(selectedFile);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error reading file.');
      setAnalyzing(false);
    }
  };

  const handleAcceptAndCreateDisbursement = () => {
    if (!extractedData) return;

    const gross = Number(extractedData.grossAmount) || 0;
    const isVat = extractedData.isVatRegistered ?? true;
    const isGoods = extractedData.isGoodsOrServices === 'goods' ? 'goods' : 'services';
    const computedTax = computeDepEdTax(gross, isVat, isGoods);

    const items = Array.isArray(extractedData.items) && extractedData.items.length > 0
      ? extractedData.items.map((item: any, idx: number) => ({
          id: `item-${Date.now()}-${idx}`,
          description: item.description || 'Purchased goods/services',
          unit: item.unit || 'lot',
          quantity: Number(item.quantity) || 1,
          unitPrice: Number(item.unitPrice) || gross,
          totalAmount: Number(item.totalAmount) || gross,
        }))
      : [
          {
            id: `item-${Date.now()}`,
            description: extractedData.particulars || 'Invoice goods/services',
            unit: 'lot',
            quantity: 1,
            unitPrice: gross,
            totalAmount: gross,
          },
        ];

    const newTx: Transaction = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      date: extractedData.receiptDate || new Date().toISOString().split('T')[0],
      dvNo: `DV-2026-10-${String(currentCount + 1).padStart(3, '0')}`,
      checkOrRefNo: `CHK-${String(currentCount + 1).padStart(3, '0')}`,
      payeeName: extractedData.payeeName || 'Registered Supplier',
      payeeTIN: extractedData.payeeTIN || '000-000-000-000',
      payeeAddress: extractedData.payeeAddress || school.schoolAddress,
      category: extractedData.category || 'Category B: Consumable Office & School Supplies',
      particulars: extractedData.particulars || `Procurement from ${extractedData.payeeName}`,
      items,
      isGoodsOrServices: isGoods,
      isVatRegistered: isVat,
      grossAmount: gross,
      tax: computedTax,
      receiptType: extractedData.receiptType || 'Sales Invoice',
      receiptNo: extractedData.receiptNo || 'DOC-EXTRACTED',
      receiptDate: extractedData.receiptDate || new Date().toISOString().split('T')[0],
      notes: `AI Auto-Extracted from ${selectedFile?.name}. ${extractedData.auditObservations || ''}`,
      isPhilGEPSRequired: gross >= 50000,
    };

    onAutoAddTransaction(newTx);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">AI Document &amp; Form Scanner</h2>
              <p className="text-xs text-slate-500">
                Upload receipts, sales invoices, or utility bills for automatic DepEd field extraction
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

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* File Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-6 text-center cursor-pointer bg-slate-50/50 hover:bg-emerald-50/20 transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-2">
              <Upload className="w-6 h-6" />
            </div>
            <div className="text-xs font-semibold text-slate-800">
              {selectedFile ? selectedFile.name : 'Click to upload Receipt, Sales Invoice, or Official Form'}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Supports PNG, JPG, JPEG, and PDF documents</p>
          </div>

          {/* Image Preview if available */}
          {previewUrl && (
            <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center max-h-48 overflow-hidden">
              <img src={previewUrl} alt="Document Preview" className="max-h-44 object-contain rounded" />
            </div>
          )}

          {/* Action Trigger */}
          {selectedFile && !extractedData && !analyzing && (
            <div className="flex justify-center">
              <button
                onClick={handleStartAnalysis}
                className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors"
              >
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>Extract Transaction &amp; Auto-Compute Tax with AI</span>
              </button>
            </div>
          )}

          {/* Loading spinner */}
          {analyzing && (
            <div className="p-6 text-center space-y-2">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
              <div className="text-xs font-semibold text-slate-800">
                Gemini AI is reading and extracting receipt details...
              </div>
              <p className="text-[11px] text-slate-500">
                Auditing supplier TIN, matching GAM categories, and computing 5% VAT / 3% PT + EWT...
              </p>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Extracted Data View */}
          {extractedData && (
            <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/30 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold text-emerald-900">Extracted DepEd Transaction Data</span>
                </div>
                <span className="text-[11px] font-mono font-bold text-emerald-800">
                  {formatPHP(extractedData.grossAmount)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Payee / Supplier</span>
                  <span className="font-semibold text-slate-800">{extractedData.payeeName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Supplier TIN</span>
                  <span className="font-mono text-slate-800">{extractedData.payeeTIN}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Invoice / OR Number</span>
                  <span className="font-mono text-slate-800">
                    {extractedData.receiptType} #{extractedData.receiptNo}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Receipt Date</span>
                  <span className="text-slate-800">{extractedData.receiptDate}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[10px]">Matched DepEd Category</span>
                  <span className="font-medium text-emerald-900">{extractedData.category}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[10px]">Particulars</span>
                  <span className="text-slate-700">{extractedData.particulars}</span>
                </div>
              </div>

              {extractedData.auditObservations && (
                <div className="p-2.5 rounded bg-white/80 border border-emerald-200 text-[11px] text-slate-600">
                  <span className="font-semibold text-emerald-800">AI Audit Note: </span>
                  <span>{extractedData.auditObservations}</span>
                </div>
              )}

              {/* Accept & Create Button */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleAcceptAndCreateDisbursement}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Accept &amp; Auto-Log to Register</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
