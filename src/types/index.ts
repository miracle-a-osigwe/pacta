export type MilestoneStatus =
  | 'PROPOSED'
  | 'ESCROW_PENDING'
  | 'ESCROW_FUNDED'
  | 'IN_PROGRESS'
  | 'DELIVERABLE_SUBMITTED'
  | 'VERIFYING'
  | 'PAYOUT_COMPLETED'
  | 'DISPUTED';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  status: MilestoneStatus;
  deliverableCriteria: string[];
  submissionContent?: string;
  verificationScore?: number; // 0-100
  verificationFeedback?: string;
  paypalOrderId?: string;
  paypalCaptureId?: string;
  paypalPayoutBatchId?: string;
  updatedAt: string;
}

export interface Contract {
  id: string;
  title: string;
  objective: string;
  category: 'Security' | 'Localization' | 'Engineering' | 'Data Science' | 'Design' | 'Other';
  totalBudget: number;
  currency: string;
  buyerName: string;
  buyerEmail: string;
  providerAgentName: string;
  providerEmail: string;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  milestones: Milestone[];
  agentNegotiationLog: {
    sender: 'BUYER_AGENT' | 'PROVIDER_AGENT' | 'RISK_GUARD' | 'SYSTEM';
    message: string;
    timestamp: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export type TransactionType = 'ESCROW_DEPOSIT' | 'PAYOUT_DISBURSEMENT' | 'REFUND' | 'FEE';

export interface LedgerTransaction {
  id: string;
  timestamp: string;
  contractId: string;
  contractTitle: string;
  milestoneId: string;
  milestoneTitle: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: 'SUCCESS' | 'PENDING' | 'HELD_IN_ESCROW' | 'FAILED';
  payer: string;
  payee: string;
  paypalReferenceId: string;
  verificationScore?: number;
  auditVerdict?: 'AUTOMATICALLY_APPROVED' | 'MANUAL_REVIEW' | 'REJECTED';
  notes: string;
}

export interface TelemetryStats {
  totalBudgetManaged: number;
  activeEscrowHeld: number;
  totalDisbursed: number;
  automatedPayoutsCount: number;
  disputeRatePercent: number;
  activeContractsCount: number;
}
