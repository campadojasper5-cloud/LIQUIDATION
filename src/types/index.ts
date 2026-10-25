export type ExpenseCategory =
  | 'Category A: Core Documents'
  | 'Category B: Consumable Office & School Supplies'
  | 'Category C: Semi-Expendable Property & Equipment (< ₱50,000)'
  | 'Category D: Repairs & Maintenance of School Buildings'
  | 'Category E: Utilities & Communication Expenses'
  | 'Category F: Travel Expenses'
  | 'Category G: School-Based Feeding Program (SBFP)'
  | 'Category H: Small Purchases & Minor Expenses Without ORs';

export interface ParticularItem {
  id: string;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

export interface TaxComputation {
  grossAmount: number;
  isVatRegistered: boolean; // true = 5% VAT, false = 3% Percentage Tax
  taxTypeRate: number; // 0.05 or 0.03
  taxTypeAmount: number; // VAT or PT amount
  ewtRate: number; // 0.01 for goods, 0.02 for services/labor
  ewtAmount: number; // EWT amount
  totalTaxWithheld: number;
  netAmountPaid: number;
}

export interface ReceiptAttachment {
  id: string;
  name: string;
  categoryType: 'Receipt / Sales Invoice' | 'Delivery Receipt (DR)' | 'Property Tag Photo' | 'Repair Photo (Before/During/After)' | 'Proof of Payment / Ticket';
  dataUrl: string; // base64 representation of image/document
  uploadedAt: string;
  fileSizeKb?: number;
}

export interface Transaction {
  id: string;
  date: string;
  dvNo: string;
  checkOrRefNo: string;
  payeeName: string;
  payeeTIN: string;
  payeeAddress: string;
  category: ExpenseCategory;
  particulars: string;
  items: ParticularItem[];
  isGoodsOrServices: 'goods' | 'services';
  isVatRegistered: boolean; // VAT vs Non-VAT
  grossAmount: number;
  tax: TaxComputation;
  receiptType: 'OR' | 'Sales Invoice' | 'RER' | 'COA 2017-001 Cert' | 'Billing SOA';
  receiptNo: string;
  receiptDate: string;
  notes?: string;
  isPhilGEPSRequired: boolean; // RA 9184 >= 50k
  receiptAttachments?: ReceiptAttachment[]; // Pictures of receipt, delivery slips, photos
}

export interface BacMember {
  id: string;
  name: string;
  designation: string; // e.g. "BAC Chairperson", "BAC Vice-Chair", "BAC Member", "BAC Secretariat"
  positionTitle: string; // e.g. "Master Teacher II", "Head Teacher III"
  employeeId?: string;
}

export interface InspectorateMember {
  id: string;
  name: string;
  designation: string; // e.g. "Inspectorate Team Leader", "Technical / ICT Inspector", "PTA Representative"
  positionTitle: string; // e.g. "Master Teacher I", "Teacher III / ICT Coordinator"
  employeeId?: string;
}

export interface SchoolProfile {
  region: string;
  division: string;
  district: string;
  schoolId: string;
  schoolName: string;
  schoolAddress: string;
  schoolType?: string;
  officialEmail?: string;
  contactNumber?: string;
  annualMooeAllocation?: number;
  registeredDate?: string;
  registrationStatus?: 'COMPLETE' | 'INCOMPLETE';
  logoUrl?: string;

  schoolHeadName: string;
  schoolHeadTitle: string;
  schoolHeadEmployeeId?: string;

  adminOfficerName?: string;
  adminOfficerTitle?: string;
  adminOfficerEmployeeId?: string;
  systemDeveloperName?: string;

  disbursingOfficerName: string;
  disbursingOfficerTitle: string;
  disbursingOfficerEmployeeId?: string;

  divisionAccountantName: string;
  divisionAccountantTitle: string;
  divisionSuperintendentName: string;
  divisionSuperintendentTitle: string;

  propertyCustodianName: string;
  propertyCustodianTitle: string;
  propertyCustodianEmployeeId?: string;

  tin: string;
  bankAccountNo: string;
  bankBranch: string;

  // Bids and Awards Committee (BAC) Roster
  bacChairperson: string;
  bacChairpersonTitle: string;
  bacChairpersonEmployeeId?: string;

  bacViceChair: string;
  bacViceChairTitle: string;
  bacViceChairEmployeeId?: string;

  bacMembers: BacMember[];
  bacSecretariat: string;
  bacSecretariatTitle: string;
  bacSecretariatEmployeeId?: string;

  // Inspectorate Committee Roster
  inspectorateChair: string;
  inspectorateChairTitle: string;
  inspectorateChairEmployeeId?: string;

  inspectorateMembers: InspectorateMember[];

  // End-user / Requisitioner default
  requisitionerName: string;
  requisitionerTitle: string;
  requisitionerEmployeeId?: string;
}

export interface CashAdvance {
  id: string;
  periodMonth: string; // e.g. "October"
  periodYear: number; // e.g. 2026
  checkNo: string;
  checkDate: string;
  dvNo: string;
  acicNo: string;
  amountGranted: number; // e.g. 75000
  cashDrawnDate: string;
  sdoSubmissionDeadline: string; // 5 calendar days following month (e.g. 2026-11-05)
  status: 'DRAFT' | 'UNDER_REVIEW' | 'VERIFIED_COMPLIANT' | 'SUBMITTED_TO_SDO';
}

export interface ChecklistItem {
  id: string;
  category: ExpenseCategory;
  title: string;
  gamRef?: string;
  description: string;
  isRequired: boolean;
  status: 'VERIFIED' | 'MISSING' | 'PENDING_UPLOAD' | 'NOT_APPLICABLE';
  attachedFileName?: string;
  notes?: string;
}

export interface AuditEvaluation {
  totalGranted: number;
  totalDisbursedGross: number;
  totalTaxWithheld: number;
  totalNetPaid: number;
  remainingCashBalance: number;
  liquidationPercentage: number;
  is100PercentLiquidated: boolean; // COA Circular 97-002
  nextCashAdvanceAllowed: boolean;
  daysRemainingForSubmission: number;
  submissionStatus: 'ON_TRACK' | 'URGENT' | 'OVERDUE';
  totalChecklistCount: number;
  verifiedChecklistCount: number;
  checklistComplianceRate: number;
  auditGrade: 'PASSED' | 'ACTION_REQUIRED' | 'NON_COMPLIANT';
}
