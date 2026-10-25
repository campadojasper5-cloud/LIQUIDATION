import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Bot,
  User,
  ShieldCheck,
  FileQuestion,
  HelpCircle,
} from 'lucide-react';
import { SchoolProfile, CashAdvance, Transaction, ChecklistItem, AuditEvaluation } from '../types';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  school: SchoolProfile;
  cashAdvance: CashAdvance;
  transactions: Transaction[];
  checklist: ChecklistItem[];
  evaluation: AuditEvaluation;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  school,
  cashAdvance,
  transactions,
  checklist,
  evaluation,
}) => {
  if (!isOpen) return null;

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Mabuhay! I am your DepEd MOOE Liquidation & COA Audit Assistant.
I can help verify your transactions against **COA Circular 97-002**, check the **5-day SDO deadline**, guide your **withholding tax math (5% VAT / 3% PT + EWT)**, or review missing documents from **Categories A through H**.

How can I assist you today?`,
      timestamp: 'Just now',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const quickQuestions = [
    'Explain COA 97-002 Non-Commensurability Rule',
    'How is 5% VAT and 1% EWT calculated on goods?',
    'What are the requirements for building repairs > ₱10,000?',
    'Review my liquidation packet for missing attachments',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
          context: {
            schoolName: school.schoolName,
            periodMonth: cashAdvance.periodMonth,
            periodYear: cashAdvance.periodYear,
            amountGranted: cashAdvance.amountGranted,
            totalDisbursed: evaluation.totalDisbursedGross,
            remainingBalance: evaluation.remainingCashBalance,
            is100PercentLiquidated: evaluation.is100PercentLiquidated,
            daysRemainingDeadline: evaluation.daysRemainingForSubmission,
            verifiedChecklist: `${evaluation.verifiedChecklistCount}/${evaluation.totalChecklistCount}`,
            transactionCount: transactions.length,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to fetch AI response.');
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'No response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `Error: ${err.message || 'Unable to connect to AI Assistant.'}`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white border-l border-slate-200 shadow-2xl flex flex-col no-print">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-emerald-800 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-emerald-300" />
          </div>
          <div>
            <h2 className="text-sm font-bold">DepEd MOOE AI Assistant</h2>
            <p className="text-[11px] text-emerald-200">
              COA Circulars, RA 9184 &amp; GAM Auditing Companion
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="cursor-pointer text-white/80 hover:text-white p-1 rounded hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                m.role === 'user'
                  ? 'bg-slate-800 text-white'
                  : 'bg-emerald-700 text-white'
              }`}
            >
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-slate-900 text-white rounded-tr-xs'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-2xs whitespace-pre-wrap'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
            <span>Consulting DepEd &amp; COA procedural manual...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Strip */}
      <div className="p-2.5 border-t border-slate-200 bg-white">
        <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 px-1">
          Quick Inquiries
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="cursor-pointer text-[11px] bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 border border-slate-200 rounded-full px-3 py-1 whitespace-nowrap transition-colors text-slate-700"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about liquidation rules, taxes, or forms..."
            className="flex-1 text-xs border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="cursor-pointer p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
