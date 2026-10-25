import { TaxComputation, Transaction, CashAdvance, ChecklistItem, AuditEvaluation } from '../types';

/**
 * Computes government withholding tax for DepEd MOOE disbursements
 * @param grossAmount Gross invoice / claim amount
 * @param isVatRegistered true if supplier is VAT-registered (5% Final VAT), false if Non-VAT (3% Percentage Tax)
 * @param isGoodsOrServices 'goods' (1% EWT) or 'services' (2% EWT)
 */
export function computeDepEdTax(
  grossAmount: number,
  isVatRegistered: boolean,
  isGoodsOrServices: 'goods' | 'services'
): TaxComputation {
  const safeGross = Math.max(0, Number(grossAmount) || 0);

  // DepEd Rules:
  // For VAT Registered:
  // - 5% Final Withholding VAT (base is net of VAT: gross / 1.12 * 0.05, OR for Simplified DepEd Government Withholding, 5% of Net of VAT)
  // Standard DepEd School MOOE practice uses:
  // Tax Base = Gross / 1.12 (if VAT) or Gross (if Non-VAT)
  // VAT = Tax Base * 5%
  // EWT = Tax Base * (1% for goods, 2% for services)
  // For Non-VAT:
  // Tax Base = Gross
  // PT = Tax Base * 3%
  // EWT = Tax Base * (1% for goods, 2% for services)

  let taxBase = safeGross;
  let taxTypeRate = 0.03;

  if (isVatRegistered) {
    taxBase = safeGross / 1.12;
    taxTypeRate = 0.05;
  }

  const taxTypeAmount = Math.round((taxBase * taxTypeRate) * 100) / 100;
  const ewtRate = isGoodsOrServices === 'goods' ? 0.01 : 0.02;
  const ewtAmount = Math.round((taxBase * ewtRate) * 100) / 100;

  const totalTaxWithheld = Math.round((taxTypeAmount + ewtAmount) * 100) / 100;
  const netAmountPaid = Math.round((safeGross - totalTaxWithheld) * 100) / 100;

  return {
    grossAmount: safeGross,
    isVatRegistered,
    taxTypeRate,
    taxTypeAmount,
    ewtRate,
    ewtAmount,
    totalTaxWithheld,
    netAmountPaid,
  };
}

export function formatPHP(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
}

export function evaluateLiquidationPacket(
  cashAdvance: CashAdvance,
  transactions: Transaction[],
  checklist: ChecklistItem[]
): AuditEvaluation {
  const totalGranted = cashAdvance.amountGranted;
  const totalDisbursedGross = transactions.reduce((sum, tx) => sum + (tx.grossAmount || 0), 0);
  const totalTaxWithheld = transactions.reduce((sum, tx) => sum + (tx.tax?.totalTaxWithheld || 0), 0);
  const totalNetPaid = transactions.reduce((sum, tx) => sum + (tx.tax?.netAmountPaid || 0), 0);
  
  const remainingCashBalance = Math.round((totalGranted - totalDisbursedGross) * 100) / 100;
  const liquidationPercentage = totalGranted > 0 
    ? Math.min(100, Math.round((totalDisbursedGross / totalGranted) * 10000) / 100)
    : 0;

  // COA Circular 97-002: Strict Non-Commensurability Rule
  // No additional CA will be granted unless previous CA is 100% liquidated and fully accounted for
  const is100PercentLiquidated = Math.abs(remainingCashBalance) < 0.01;
  const nextCashAdvanceAllowed = is100PercentLiquidated;

  // Deadline calculation (5 calendar days following month)
  // e.g. For October 2026, deadline is November 5, 2026
  const deadlineDate = new Date(cashAdvance.sdoSubmissionDeadline);
  const today = new Date('2026-10-25T09:48:56'); // using current app context date
  const diffTime = deadlineDate.getTime() - today.getTime();
  const daysRemainingForSubmission = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let submissionStatus: 'ON_TRACK' | 'URGENT' | 'OVERDUE' = 'ON_TRACK';
  if (daysRemainingForSubmission < 0) {
    submissionStatus = 'OVERDUE';
  } else if (daysRemainingForSubmission <= 3) {
    submissionStatus = 'URGENT';
  }

  // Checklist compliance
  const requiredItems = checklist.filter((item) => item.isRequired);
  const verifiedItems = requiredItems.filter((item) => item.status === 'VERIFIED');
  const checklistComplianceRate = requiredItems.length > 0
    ? Math.round((verifiedItems.length / requiredItems.length) * 100)
    : 100;

  let auditGrade: 'PASSED' | 'ACTION_REQUIRED' | 'NON_COMPLIANT' = 'PASSED';
  if (!is100PercentLiquidated || checklistComplianceRate < 70 || submissionStatus === 'OVERDUE') {
    auditGrade = 'NON_COMPLIANT';
  } else if (checklistComplianceRate < 100) {
    auditGrade = 'ACTION_REQUIRED';
  }

  return {
    totalGranted,
    totalDisbursedGross,
    totalTaxWithheld,
    totalNetPaid,
    remainingCashBalance,
    liquidationPercentage,
    is100PercentLiquidated,
    nextCashAdvanceAllowed,
    daysRemainingForSubmission,
    submissionStatus,
    totalChecklistCount: requiredItems.length,
    verifiedChecklistCount: verifiedItems.length,
    checklistComplianceRate,
    auditGrade,
  };
}
