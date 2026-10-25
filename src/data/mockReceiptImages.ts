/**
 * Generates lightweight, high-fidelity SVG data URLs simulating uploaded pictures of receipts,
 * property inventory photos, and repair documentation.
 */

function createSvgDataUrl(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

export const SAMPLE_RECEIPT_SI = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%">
  <rect width="600" height="800" fill="#fdfbf7"/>
  <rect x="20" y="20" width="560" height="760" fill="none" stroke="#d1d5db" stroke-width="2" stroke-dasharray="6,4"/>
  
  <!-- Store Header -->
  <text x="300" y="70" font-family="monospace" font-size="22" font-weight="bold" text-anchor="middle" fill="#111827">CROWN PAPER &amp; SCHOOL SUPPLIES</text>
  <text x="300" y="95" font-family="monospace" font-size="12" text-anchor="middle" fill="#4b5563">108 Osmeña Blvd, Cebu City · BIR TIN: 123-456-789-000</text>
  <text x="300" y="115" font-family="monospace" font-size="12" text-anchor="middle" fill="#4b5563">BIR Permit # 2026-08194-VAT · VAT REGISTERED</text>
  
  <!-- Invoice Title -->
  <line x1="40" y1="135" x2="560" y2="135" stroke="#9ca3af" stroke-width="1.5"/>
  <text x="300" y="165" font-family="monospace" font-size="18" font-weight="bold" text-anchor="middle" fill="#1f2937">SALES INVOICE: SI-94821</text>
  <line x1="40" y1="180" x2="560" y2="180" stroke="#9ca3af" stroke-width="1.5"/>
  
  <!-- Sold To -->
  <text x="50" y="210" font-family="monospace" font-size="13" font-weight="bold" fill="#111827">SOLD TO: DEPED - MABINI NATIONAL HIGH SCHOOL</text>
  <text x="50" y="230" font-family="monospace" font-size="12" fill="#4b5563">Address: Poblacion, Balamban, Cebu (School ID: 303042)</text>
  <text x="50" y="250" font-family="monospace" font-size="12" fill="#4b5563">TIN: 000-847-192-000 · Date: October 08, 2026</text>
  <text x="50" y="270" font-family="monospace" font-size="12" fill="#4b5563">PO Ref: PO-2026-10-001 · Terms: Cash On Delivery</text>
  
  <!-- Line Items Table -->
  <line x1="40" y1="290" x2="560" y2="290" stroke="#111827" stroke-width="2"/>
  <text x="50" y="310" font-family="monospace" font-size="12" font-weight="bold" fill="#111827">QTY  UNIT  DESCRIPTION                   UNIT PRICE     AMOUNT</text>
  <line x1="40" y1="320" x2="560" y2="320" stroke="#9ca3af" stroke-width="1"/>
  
  <text x="50" y="345" font-family="monospace" font-size="12" fill="#111827">12   box   Copy Paper A4 80gsm (5 reams) ₱1,250.00   ₱15,000.00</text>
  <text x="50" y="375" font-family="monospace" font-size="12" fill="#111827">4    bot   Duplicating Ink Black 1000ml   ₱750.00    ₱3,000.00</text>
  <text x="50" y="405" font-family="monospace" font-size="12" fill="#111827">20   pcs   Correction Tape 12m              ₱45.00      ₱900.00</text>
  
  <line x1="40" y1="460" x2="560" y2="460" stroke="#9ca3af" stroke-width="1"/>
  <!-- Totals -->
  <text x="360" y="490" font-family="monospace" font-size="13" font-weight="bold" fill="#111827">TOTAL GROSS:   ₱18,900.00</text>
  <text x="360" y="510" font-family="monospace" font-size="11" fill="#6b7280">Less: 5% Final VAT:  ₱843.75</text>
  <text x="360" y="530" font-family="monospace" font-size="11" fill="#6b7280">Less: 1% EWT Goods:  ₱168.75</text>
  <text x="360" y="555" font-family="monospace" font-size="14" font-weight="bold" fill="#047857">NET PAID (CHK): ₱17,887.50</text>
  
  <!-- Stamp -->
  <g transform="translate(100, 580) rotate(-6)">
    <rect width="200" height="70" fill="none" stroke="#dc2626" stroke-width="3" rx="6"/>
    <text x="100" y="32" font-family="sans-serif" font-size="18" font-weight="extrabold" text-anchor="middle" fill="#dc2626">PAID IN FULL</text>
    <text x="100" y="55" font-family="monospace" font-size="11" text-anchor="middle" fill="#dc2626">OCT 08, 2026 · DEPED MOOE</text>
  </g>
  
  <text x="300" y="740" font-family="monospace" font-size="11" text-anchor="middle" fill="#9ca3af">THIS DOCUMENT IS NOT VALID FOR CLAIM OF INPUT TAX WITHOUT OFFICIAL STAMP</text>
</svg>
`);

export const SAMPLE_PRINTER_PROPERTY_PHOTO = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <rect width="600" height="600" fill="#1e293b"/>
  <rect x="20" y="20" width="560" height="560" fill="#334155" rx="16"/>
  
  <!-- Simulated Office Desk & Equipment -->
  <rect x="80" y="200" width="440" height="240" rx="12" fill="#0f172a" stroke="#475569" stroke-width="4"/>
  <rect x="120" y="240" width="360" height="60" fill="#1e293b" rx="4"/>
  <circle cx="450" cy="270" r="8" fill="#10b981"/>
  <text x="300" y="275" font-family="sans-serif" font-size="14" font-weight="bold" fill="#94a3b8" text-anchor="middle">EPSON ECOTANK NETWORK MULTIFUNCTION PRINTER</text>
  <rect x="180" y="340" width="240" height="80" fill="#020617" rx="4"/>
  
  <!-- DepEd Property Tag Sticker Overlay -->
  <g transform="translate(140, 100)">
    <rect width="320" height="130" fill="#ffffff" stroke="#047857" stroke-width="4" rx="8" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"/>
    <rect x="10" y="10" width="300" height="26" fill="#047857" rx="4"/>
    <text x="160" y="28" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">DEPARTMENT OF EDUCATION - INVENTORY TAG</text>
    
    <text x="20" y="55" font-family="monospace" font-size="11" font-weight="bold" fill="#0f172a">PROPERTY NO: DEPED-303042-2026-001</text>
    <text x="20" y="72" font-family="monospace" font-size="10" fill="#334155">ITEM: Heavy-Duty Ink Tank Printer</text>
    <text x="20" y="88" font-family="monospace" font-size="10" fill="#334155">COST: ₱21,500.00 (Semi-Expendable)</text>
    <text x="20" y="104" font-family="monospace" font-size="10" fill="#334155">USER: Carmela D. Bautista (Dept Head)</text>
    <text x="20" y="120" font-family="monospace" font-size="9" fill="#047857">VERIFIED BY INSPECTORATE: OCT 12, 2026</text>
  </g>
  
  <text x="300" y="530" font-family="sans-serif" font-size="13" font-weight="bold" fill="#e2e8f0" text-anchor="middle">
    PHOTO EVIDENCE: SEMI-EXPENDABLE PROPERTY TAGGED &amp; DEPLOYED
  </text>
  <text x="300" y="550" font-family="monospace" font-size="11" fill="#94a3b8" text-anchor="middle">
    Location: Faculty &amp; Registrar Office · Mabini NHS
  </text>
</svg>
`);

export const SAMPLE_REPAIR_PHOTO = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <rect width="600" height="600" fill="#0f172a"/>
  
  <!-- Split Screen: Before & After -->
  <line x1="300" y1="40" x2="300" y2="480" stroke="#64748b" stroke-width="3" stroke-dasharray="6,4"/>
  
  <!-- Left: Before -->
  <rect x="30" y="70" width="250" height="380" fill="#334155" rx="8"/>
  <text x="155" y="105" font-family="sans-serif" font-size="14" font-weight="bold" fill="#f87171" text-anchor="middle">[ BEFORE REPAIR ]</text>
  <text x="155" y="130" font-family="monospace" font-size="11" fill="#cbd5e1" text-anchor="middle">OCT 14, 2026</text>
  <!-- Damage graphic -->
  <path d="M 60 220 L 140 180 L 220 230 L 180 320 L 80 300 Z" fill="#475569" stroke="#ef4444" stroke-width="2"/>
  <text x="155" y="270" font-family="sans-serif" font-size="11" fill="#fca5a5" text-anchor="middle">Damaged G.I. Sheets</text>
  <text x="155" y="290" font-family="sans-serif" font-size="11" fill="#fca5a5" text-anchor="middle">&amp; Leaking Gutters</text>

  <!-- Right: After -->
  <rect x="320" y="70" width="250" height="380" fill="#1e293b" rx="8"/>
  <text x="445" y="105" font-family="sans-serif" font-size="14" font-weight="bold" fill="#34d399" text-anchor="middle">[ AFTER REPAIR ]</text>
  <text x="445" y="130" font-family="monospace" font-size="11" fill="#cbd5e1" text-anchor="middle">OCT 18, 2026</text>
  <!-- Fixed graphic -->
  <rect x="350" y="200" width="190" height="120" fill="#047857" stroke="#10b981" stroke-width="2" rx="4"/>
  <text x="445" y="260" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ecfdf5" text-anchor="middle">New G.I. Sheets 10ft Gauge 26</text>
  <text x="445" y="280" font-family="sans-serif" font-size="11" fill="#a7f3d0" text-anchor="middle">Sealed &amp; Fully Waterproofed</text>

  <!-- Inspectorate Certified Stamp -->
  <rect x="100" y="490" width="400" height="70" fill="#ffffff" rx="8"/>
  <text x="300" y="520" font-family="sans-serif" font-size="13" font-weight="bold" fill="#047857" text-anchor="middle">
    CERTIFIED INSPECTION: PROJECT COMPLETED IN FULL
  </text>
  <text x="300" y="540" font-family="monospace" font-size="11" fill="#475569" text-anchor="middle">
    Building: Grade 10 Academic Building · Engr. Nelson B. Castro
  </text>
</svg>
`);

export const SAMPLE_UTILITY_OR = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="100%" height="100%">
  <rect width="600" height="750" fill="#fafafa"/>
  <rect x="25" y="25" width="550" height="700" fill="none" stroke="#cbd5e1" stroke-width="2"/>
  
  <text x="300" y="70" font-family="sans-serif" font-size="20" font-weight="extrabold" text-anchor="middle" fill="#1e3a8a">CEBU II ELECTRIC COOPERATIVE, INC.</text>
  <text x="300" y="95" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#64748b">CEBECO II · Balamban Area Office · Non-VAT Exempt / Gov't</text>
  
  <line x1="50" y1="120" x2="550" y2="120" stroke="#1e3a8a" stroke-width="2"/>
  <text x="300" y="150" font-family="monospace" font-size="16" font-weight="bold" text-anchor="middle" fill="#0f172a">OFFICIAL RECEIPT: OR-CEBECO-88192</text>
  <line x1="50" y1="165" x2="550" y2="165" stroke="#1e3a8a" stroke-width="2"/>
  
  <text x="60" y="200" font-family="monospace" font-size="13" font-weight="bold" fill="#0f172a">ACCOUNT NO: 992014-01 (Mabini National High School)</text>
  <text x="60" y="225" font-family="monospace" font-size="12" fill="#334155">Service Period: Oct 01, 2026 - Oct 31, 2026</text>
  <text x="60" y="250" font-family="monospace" font-size="12" fill="#334155">Meter No: 8840192 · Class: Public School Institution</text>
  
  <rect x="60" y="280" width="480" height="150" fill="#f1f5f9" rx="8"/>
  <text x="80" y="320" font-family="monospace" font-size="13" fill="#0f172a">Total Electric Power Consumed: 1,150 kWh</text>
  <text x="80" y="350" font-family="monospace" font-size="13" fill="#0f172a">Current Billing Amount: ₱13,800.00</text>
  <text x="80" y="380" font-family="monospace" font-size="13" font-weight="bold" fill="#047857">TOTAL AMOUNT PAID: ₱13,800.00</text>
  
  <!-- Stamp -->
  <g transform="translate(180, 480)">
    <circle cx="120" cy="60" r="60" fill="none" stroke="#2563eb" stroke-width="3"/>
    <text x="120" y="55" font-family="sans-serif" font-size="14" font-weight="bold" fill="#2563eb" text-anchor="middle">COLLECTED</text>
    <text x="120" y="75" font-family="monospace" font-size="11" fill="#2563eb" text-anchor="middle">OCT 20, 2026</text>
  </g>
  
  <text x="300" y="680" font-family="monospace" font-size="11" fill="#94a3b8" text-anchor="middle">Official LandBank Check Payment: CHK-005 / DV-2026-10-005</text>
</svg>
`);
