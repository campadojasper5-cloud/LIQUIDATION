import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Increase JSON payload limit to handle base64 image/document uploads
app.use(express.json({ limit: '50mb' }));

// Server-side Gemini client with required telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * AI Assistant for DepEd MOOE Liquidation & Procedural Inquiries
 */
app.post('/api/gemini/assist', async (req: Request, res: Response) => {
  try {
    const { message, history, context } = req.body;

    const systemInstruction = `You are the Expert DepEd MOOE Liquidation, COA Auditing, and Philippine Government Procurement AI Assistant.
You specialize in:
1. COA Circular 97-002 (Strict Non-Commensurability Rule): No additional Cash Advance can be granted unless previous CA is 100% liquidated and fully accounted for.
2. SDO Submission Deadline: 5 calendar days following the month for which Cash Advance was drawn.
3. RA 9184 (Government Procurement Reform Act):
   - Expenditures >= ₱50,000 require PhilGEPS posting, BAC Resolution, Notice of Award (NOA), and Notice to Proceed (NTP).
   - Below ₱50,000 per unit is Semi-Expendable Property covered by Inventory Custodian Slip (ICS Appendix 59).
4. Tax Withholding Mandates:
   - Goods: 5% Final VAT (or 3% Percentage Tax) + 1% Creditable Income Tax (EWT).
   - Services / Labor: 5% Final VAT (or 3% Percentage Tax) + 2% Creditable Income Tax (EWT).
   - BIR Form 2307 must be issued to suppliers for all deductions.
5. Official GAM Appendices:
   - Appendix 44: Liquidation Report
   - Appendix 43: Cash Disbursement Register (CDR)
   - Appendix 60: Purchase Request (PR)
   - Appendix 61: Purchase Order (PO)
   - Appendix 62: Inspection and Acceptance Report (IAR)
   - Appendix 63: Requisition and Issue Slip (RIS)
   - Appendix 59: Inventory Custodian Slip (ICS)
   - Appendix 46: Reimbursement Expense Receipt (RER) for amounts > ₱300
   - COA Circular 2017-001 Certificate for amounts <= ₱300
6. Current School / Packet Context: ${JSON.stringify(context || {})}

Provide authoritative, concise, accurate Philippine accounting advice with concrete step-by-step guidance.`;

    const contents = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const h of history) {
        contents.push({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.content }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.2,
      },
    });

    res.json({ reply: response.text || 'I could not generate a response. Please try again.' });
  } catch (error: any) {
    console.error('Gemini Assist Error:', error);
    res.status(500).json({ error: error.message || 'Failed to communicate with AI Assistant.' });
  }
});

/**
 * AI Multimodal Document & Receipt Analyzer
 * Analyzes uploaded receipts, invoices, billing statements, or official forms,
 * extracts all fields, and suggests transactions and category attachments.
 */
app.post('/api/gemini/analyze-document', async (req: Request, res: Response) => {
  try {
    const { fileBase64, mimeType, fileName } = req.body;

    if (!fileBase64) {
      return res.status(400).json({ error: 'No file data provided' });
    }

    const promptText = `Analyze this uploaded document/receipt/invoice for a Philippine Department of Education (DepEd) Public School MOOE liquidation packet.
Extract all key transaction details and return a strict JSON object with these exact keys:
- "payeeName": Name of the supplier, store, utility company, or claimant
- "payeeTIN": Tax Identification Number if visible, or "000-000-000-000"
- "payeeAddress": Address of the establishment
- "receiptType": One of "Sales Invoice", "OR", "Billing SOA", "RER", or "COA 2017-001 Cert"
- "receiptNo": The official receipt, invoice, or SOA reference number
- "receiptDate": Date in YYYY-MM-DD format
- "category": Most appropriate DepEd Expense Category from:
  "Category B: Consumable Office & School Supplies",
  "Category C: Semi-Expendable Property & Equipment (< ₱50,000)",
  "Category D: Repairs & Maintenance of School Buildings",
  "Category E: Utilities & Communication Expenses",
  "Category F: Travel Expenses",
  "Category G: School-Based Feeding Program (SBFP)",
  "Category H: Small Purchases & Minor Expenses Without ORs"
- "particulars": Concise description of what was purchased or service rendered
- "isGoodsOrServices": "goods" or "services"
- "isVatRegistered": boolean (true if VAT invoice/receipt, false if Non-VAT)
- "grossAmount": Total gross invoice amount as a float number
- "items": Array of { "description": string, "unit": string, "quantity": number, "unitPrice": number, "totalAmount": number }
- "isPhilGEPSRequired": boolean (true if total gross >= 50000)
- "suggestedChecklistAttachment": The most relevant checklist attachment name from Categories A to H
- "auditObservations": Any warnings or compliance notes (e.g. "Tax deductible at 5% VAT + 1% EWT", "Exceeds ₱300 threshold", etc.)`;

    const parts: any[] = [];
    parts.push({
      inlineData: {
        mimeType: mimeType || 'image/jpeg',
        data: fileBase64,
      },
    });
    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    res.json({ success: true, analysis: parsedData });
  } catch (error: any) {
    console.error('Gemini Analyze Document Error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze document.' });
  }
});

// Serve frontend in development via Vite middlewares, or static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`DepEd MOOE Server listening on port ${PORT}`);
  });
}

startServer();
