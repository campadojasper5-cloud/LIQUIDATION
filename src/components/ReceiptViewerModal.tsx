import React, { useState, useRef } from 'react';
import {
  X,
  Camera,
  Upload,
  Trash2,
  Download,
  Eye,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Calendar,
  Building,
} from 'lucide-react';
import { Transaction, ReceiptAttachment } from '../types';

interface ReceiptViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction;
  onUpdateAttachments: (transactionId: string, attachments: ReceiptAttachment[]) => void;
}

export const ReceiptViewerModal: React.FC<ReceiptViewerModalProps> = ({
  isOpen,
  onClose,
  transaction,
  onUpdateAttachments,
}) => {
  if (!isOpen) return null;

  const [attachments, setAttachments] = useState<ReceiptAttachment[]>(
    transaction.receiptAttachments || []
  );
  const [selectedAttachment, setSelectedAttachment] = useState<ReceiptAttachment | null>(
    attachments[0] || null
  );
  const [newCategoryType, setNewCategoryType] = useState<ReceiptAttachment['categoryType']>(
    'Receipt / Sales Invoice'
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const dataUrl = reader.result as string;
        const newAttachment: ReceiptAttachment = {
          id: `att-${Date.now()}`,
          name: file.name,
          categoryType: newCategoryType,
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

        const updated = [...attachments, newAttachment];
        setAttachments(updated);
        setSelectedAttachment(newAttachment);
        onUpdateAttachments(transaction.id, updated);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAttachment = (id: string) => {
    if (confirm('Delete this receipt picture?')) {
      const updated = attachments.filter((a) => a.id !== id);
      setAttachments(updated);
      setSelectedAttachment(updated[0] || null);
      onUpdateAttachments(transaction.id, updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Receipt &amp; Proof Document Attachments
              </h2>
              <p className="text-xs text-slate-500">
                {transaction.dvNo} · {transaction.payeeName} ({transaction.receiptType} #{transaction.receiptNo})
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

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[75vh] overflow-y-auto">
          {/* Left Column: Attachment Thumbnails & Upload Controls */}
          <div className="space-y-4">
            {/* Upload Area */}
            <div className="p-4 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/30 space-y-3">
              <span className="text-xs font-bold text-emerald-950 block">Upload Receipt Photo</span>
              
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Attachment Type
                </label>
                <select
                  value={newCategoryType}
                  onChange={(e) => setNewCategoryType(e.target.value as any)}
                  className="w-full text-xs border border-slate-300 rounded px-2 py-1.5 bg-white text-slate-800 focus:outline-none"
                >
                  <option value="Receipt / Sales Invoice">Receipt / Sales Invoice</option>
                  <option value="Delivery Receipt (DR)">Delivery Receipt (DR)</option>
                  <option value="Property Tag Photo">Property Tag Photo</option>
                  <option value="Repair Photo (Before/During/After)">Repair Photo</option>
                  <option value="Proof of Payment / Ticket">Proof of Payment / Ticket</option>
                </select>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Snap Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Browse File</span>
                </button>
              </div>
            </div>

            {/* List of Attachments */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                Attached Pictures ({attachments.length})
              </span>

              {attachments.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 border border-slate-200 rounded-xl bg-slate-50">
                  No pictures or receipt photos attached yet.
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {attachments.map((att) => (
                    <div
                      key={att.id}
                      onClick={() => setSelectedAttachment(att)}
                      className={`cursor-pointer p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                        selectedAttachment?.id === att.id
                          ? 'bg-emerald-50 border-emerald-500 shadow-xs'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <img
                          src={att.dataUrl}
                          alt={att.name}
                          className="w-10 h-10 object-cover rounded-md border border-slate-200 shrink-0"
                        />
                        <div className="truncate">
                          <div className="text-xs font-bold text-slate-900 truncate">{att.name}</div>
                          <div className="text-[10px] text-emerald-800 font-medium truncate">{att.categoryType}</div>
                          <div className="text-[9px] text-slate-400">{att.uploadedAt}</div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAttachment(att.id);
                        }}
                        className="cursor-pointer text-slate-400 hover:text-rose-600 p-1 shrink-0"
                        title="Delete receipt picture"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Full Preview Canvas */}
          <div className="md:col-span-2 bg-slate-900 rounded-xl p-4 flex flex-col justify-between overflow-hidden min-h-[360px]">
            {selectedAttachment ? (
              <>
                <div className="flex items-center justify-between text-slate-300 text-xs pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white truncate max-w-xs">{selectedAttachment.name}</span>
                    <span className="text-[10px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded">
                      {selectedAttachment.categoryType}
                    </span>
                  </div>

                  <a
                    href={selectedAttachment.dataUrl}
                    download={selectedAttachment.name}
                    className="cursor-pointer inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </a>
                </div>

                <div className="flex-1 flex items-center justify-center p-2 overflow-auto max-h-[460px]">
                  <img
                    src={selectedAttachment.dataUrl}
                    alt={selectedAttachment.name}
                    className="max-h-[420px] max-w-full object-contain rounded-lg shadow-lg border border-slate-800"
                  />
                </div>

                <div className="pt-2 text-center text-[11px] text-slate-400">
                  Uploaded: {selectedAttachment.uploadedAt} · Stored securely with DepEd MOOE packet
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-2">
                <ImageIcon className="w-12 h-12 text-slate-700" />
                <p className="text-xs">Select or upload a receipt photo to inspect details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
