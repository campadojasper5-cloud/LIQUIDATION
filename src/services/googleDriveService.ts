import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { SchoolProfile, CashAdvance, Transaction, ChecklistItem, AuditEvaluation } from '../types';

// Initialize Firebase App singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive.file');

let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user && cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else if (!isSigningIn) {
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get Google OAuth access token');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign-in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getCachedAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const googleSignOut = async (): Promise<void> => {
  await signOut(auth);
  cachedAccessToken = null;
};

export interface DriveUploadResult {
  fileId: string;
  name: string;
  webViewLink?: string;
}

/**
 * Uploads a file (JSON or HTML report) to Google Drive using the user's access token
 */
export async function uploadToGoogleDrive(
  accessToken: string,
  filename: string,
  content: string,
  mimeType: string = 'application/json'
): Promise<DriveUploadResult> {
  const metadata = {
    name: filename,
    mimeType: mimeType,
    description: 'DepEd MOOE Liquidation Packet backup saved via DepEd MOOE System',
  };

  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  form.append('file', new Blob([content], { type: mimeType }));

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `Google Drive upload failed with status ${response.status}`
    );
  }

  return (await response.json()) as DriveUploadResult;
}

/**
 * Prepares the complete liquidation dossier package for Drive backup
 */
export function generateLiquidationBackupPayload(
  school: SchoolProfile,
  cashAdvance: CashAdvance,
  transactions: Transaction[],
  checklist: ChecklistItem[],
  evaluation: AuditEvaluation
): string {
  const payload = {
    appName: 'DepEd MOOE Liquidation & Procedural System',
    version: '1.0.0',
    exportTimestamp: new Date().toISOString(),
    school,
    cashAdvance,
    auditEvaluation: evaluation,
    summary: {
      totalCashAdvanceGranted: evaluation.totalGranted,
      totalDisbursedGross: evaluation.totalDisbursedGross,
      totalTaxWithheld: evaluation.totalTaxWithheld,
      totalNetDisbursed: evaluation.totalNetPaid,
      remainingCashBalance: evaluation.remainingCashBalance,
      liquidationPercentage: evaluation.liquidationPercentage,
      is100PercentLiquidated: evaluation.is100PercentLiquidated,
      coaCircular97002Status: evaluation.is100PercentLiquidated
        ? 'COMPLIANT - 100% Liquidated'
        : 'NON-COMPLIANT - Unliquidated Balance Pending',
    },
    transactions,
    checklist,
  };

  return JSON.stringify(payload, null, 2);
}
