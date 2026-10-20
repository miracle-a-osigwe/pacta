import { Contract, LedgerTransaction, TelemetryStats } from '@/types';

// Pre-seeded initial data for instant rich showcase
const INITIAL_CONTRACTS: Contract[] = [
  {
    id: 'contract-sec-01',
    title: 'Full-Stack Smart Contract & API Security Audit',
    objective: 'Perform automated static analysis, pen-testing, and deliver a vulnerability report with remediation patches.',
    category: 'Security',
    totalBudget: 280,
    currency: 'USD',
    buyerName: 'Pacta Protocol DAO',
    buyerEmail: 'dao-treasury@pacta.sandbox.com',
    providerAgentName: 'SentinelSec-Agent-v3',
    providerEmail: 'sentinel.sec.bot@sandbox.paypal.com',
    status: 'ACTIVE',
    milestones: [
      {
        id: 'ms-sec-01',
        title: 'Phase 1: Static Analysis & Attack Vector Surface Map',
        description: 'Comprehensive AST scan, dependency vulnerability tree, and identified threat vector report.',
        amount: 120,
        currency: 'USD',
        status: 'PAYOUT_COMPLETED',
        deliverableCriteria: [
          'Full static code analysis report across all endpoints',
          'CWE classification and CVSS severity scoring for identified threats',
          'Automated attack surface graph included',
        ],
        submissionContent: 'Completed static AST analysis on repository. Detected 2 low-risk reentrancy warnings and 1 unvalidated input vector. Remediation guidelines and attack graph attached: [AST_REPORT_V1.pdf].',
        verificationScore: 94,
        verificationFeedback: 'AI Auditor verified: Complete AST scan provided, CWE-79 and CWE-20 classified with CVSS scores. Met all criteria.',
        paypalOrderId: 'SANDBOX-ORDER-SEC01',
        paypalPayoutBatchId: 'SANDBOX-BATCH-SEC01-P1',
        updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        id: 'ms-sec-02',
        title: 'Phase 2: Exploit PoC Testing & Remediation PR',
        description: 'Reproducible exploit scripts and verified pull request fixing identified vulnerabilities.',
        amount: 160,
        currency: 'USD',
        status: 'ESCROW_FUNDED',
        deliverableCriteria: [
          'Pull Request resolving identified vulnerabilities with 100% test pass rate',
          'Penetration testing script confirming zero regressions',
          'Final executive summary sign-off',
        ],
        paypalOrderId: 'SANDBOX-ORDER-SEC02',
        updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
    ],
    agentNegotiationLog: [
      {
        sender: 'BUYER_AGENT',
        message: 'Requesting RFQ for full-stack security audit. Maximum budget: $300 USD.',
        timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
      },
      {
        sender: 'PROVIDER_AGENT',
        message: 'SentinelSec-Agent proposed 2-phase delivery for $280 USD: Phase 1 ($120) static analysis + Phase 2 ($160) remediation PR.',
        timestamp: new Date(Date.now() - 3600000 * 47).toISOString(),
      },
      {
        sender: 'RISK_GUARD',
        message: 'Risk Guardrail verified: $280 is within approved budget limit. Escrow contract authorized.',
        timestamp: new Date(Date.now() - 3600000 * 46).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'contract-loc-02',
    title: 'Japanese & German Market App Localization',
    objective: 'Translate 450 UI keys, refine localized terminology, and generate cultural UX QA validation report.',
    category: 'Localization',
    totalBudget: 150,
    currency: 'USD',
    buyerName: 'GlobalFin Inc',
    buyerEmail: 'procurement@globalfin.com',
    providerAgentName: 'LingoMesh-Translator-AI',
    providerEmail: 'lingomesh.payouts@sandbox.paypal.com',
    status: 'ACTIVE',
    milestones: [
      {
        id: 'ms-loc-01',
        title: 'Phase 1: JSON Translation & Formatting Compliance',
        description: 'Complete translation of en-US keys into ja-JP and de-DE with ICU format validation.',
        amount: 75,
        currency: 'USD',
        status: 'ESCROW_FUNDED',
        deliverableCriteria: [
          'Strict JSON syntax compliance without missing placeholders',
          'Accurate financial and payment terminology in target locales',
          'Zero truncation in standard button layout widths',
        ],
        paypalOrderId: 'SANDBOX-ORDER-LOC01',
        updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'ms-loc-02',
        title: 'Phase 2: Linguistic QA & Context Review',
        description: 'Native tone-of-voice validation and automated screenshot layout testing.',
        amount: 75,
        currency: 'USD',
        status: 'ESCROW_PENDING',
        deliverableCriteria: [
          'UI screenshot verification for responsive widths',
          'Contextual consistency across onboarding and checkout funnels',
        ],
        updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ],
    agentNegotiationLog: [
      {
        sender: 'BUYER_AGENT',
        message: 'Initiated mission: Localize payment app for Germany and Japan.',
        timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
      },
      {
        sender: 'PROVIDER_AGENT',
        message: 'LingoMesh accepted mission at $150 USD split across 2 milestones.',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

const INITIAL_TRANSACTIONS: LedgerTransaction[] = [
  {
    id: 'tx-001',
    timestamp: new Date(Date.now() - 3600000 * 40).toISOString(),
    contractId: 'contract-sec-01',
    contractTitle: 'Full-Stack Smart Contract & API Security Audit',
    milestoneId: 'ms-sec-01',
    milestoneTitle: 'Phase 1: Static Analysis & Attack Vector Surface Map',
    type: 'ESCROW_DEPOSIT',
    amount: 120,
    currency: 'USD',
    status: 'SUCCESS',
    payer: 'dao-treasury@pacta.sandbox.com',
    payee: 'Pacta Escrow Vault',
    paypalReferenceId: 'PAYPAL-ORD-88219412',
    notes: 'Buyer funded milestone into PayPal Escrow Vault.',
  },
  {
    id: 'tx-002',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    contractId: 'contract-sec-01',
    contractTitle: 'Full-Stack Smart Contract & API Security Audit',
    milestoneId: 'ms-sec-01',
    milestoneTitle: 'Phase 1: Static Analysis & Attack Vector Surface Map',
    type: 'PAYOUT_DISBURSEMENT',
    amount: 120,
    currency: 'USD',
    status: 'SUCCESS',
    payer: 'Pacta Escrow Vault',
    payee: 'sentinel.sec.bot@sandbox.paypal.com',
    paypalReferenceId: 'PAYPAL-PAYOUT-99128471',
    verificationScore: 94,
    auditVerdict: 'AUTOMATICALLY_APPROVED',
    notes: 'Deliverable verified by AI Auditor (Score: 94/100). Instant PayPal Payout disbursed.',
  },
  {
    id: 'tx-003',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    contractId: 'contract-sec-01',
    contractTitle: 'Full-Stack Smart Contract & API Security Audit',
    milestoneId: 'ms-sec-02',
    milestoneTitle: 'Phase 2: Exploit PoC Testing & Remediation PR',
    type: 'ESCROW_DEPOSIT',
    amount: 160,
    currency: 'USD',
    status: 'HELD_IN_ESCROW',
    payer: 'dao-treasury@pacta.sandbox.com',
    payee: 'Pacta Escrow Vault',
    paypalReferenceId: 'PAYPAL-ORD-91048201',
    notes: 'Phase 2 funded. Funds held in escrow pending agent submission and AI verification.',
  },
  {
    id: 'tx-004',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    contractId: 'contract-loc-02',
    contractTitle: 'Japanese & German Market App Localization',
    milestoneId: 'ms-loc-01',
    milestoneTitle: 'Phase 1: JSON Translation & Formatting Compliance',
    type: 'ESCROW_DEPOSIT',
    amount: 75,
    currency: 'USD',
    status: 'HELD_IN_ESCROW',
    payer: 'procurement@globalfin.com',
    payee: 'Pacta Escrow Vault',
    paypalReferenceId: 'PAYPAL-ORD-92019482',
    notes: 'Escrow deposit captured. LingoMesh Agent notified to commence translation.',
  },
];

// In-Memory store instance (singleton across Next.js dev server hot-reloads)
class PactaStore {
  private contracts: Contract[] = [...INITIAL_CONTRACTS];
  private transactions: LedgerTransaction[] = [...INITIAL_TRANSACTIONS];

  getContracts(): Contract[] {
    return this.contracts;
  }

  getContract(id: string): Contract | undefined {
    return this.contracts.find((c) => c.id === id);
  }

  addContract(contract: Contract): void {
    this.contracts.unshift(contract);
  }

  updateContract(id: string, updates: Partial<Contract>): Contract | undefined {
    const idx = this.contracts.findIndex((c) => c.id === id);
    if (idx === -1) return undefined;
    this.contracts[idx] = { ...this.contracts[idx], ...updates, updatedAt: new Date().toISOString() };
    return this.contracts[idx];
  }

  updateMilestone(
    contractId: string,
    milestoneId: string,
    updates: Partial<Contract['milestones'][0]>
  ): Contract | undefined {
    const contract = this.getContract(contractId);
    if (!contract) return undefined;

    const msIdx = contract.milestones.findIndex((m) => m.id === milestoneId);
    if (msIdx === -1) return undefined;

    contract.milestones[msIdx] = {
      ...contract.milestones[msIdx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    contract.updatedAt = new Date().toISOString();
    return contract;
  }

  getTransactions(): LedgerTransaction[] {
    return this.transactions;
  }

  addTransaction(tx: LedgerTransaction): void {
    this.transactions.unshift(tx);
  }

  getTelemetry(): TelemetryStats {
    let totalBudget = 0;
    let inEscrow = 0;
    let disbursed = 0;
    let payoutsCount = 0;

    for (const tx of this.transactions) {
      if (tx.type === 'ESCROW_DEPOSIT') {
        totalBudget += tx.amount;
        if (tx.status === 'HELD_IN_ESCROW') {
          inEscrow += tx.amount;
        }
      } else if (tx.type === 'PAYOUT_DISBURSEMENT' && tx.status === 'SUCCESS') {
        disbursed += tx.amount;
        payoutsCount += 1;
      }
    }

    return {
      totalBudgetManaged: totalBudget,
      activeEscrowHeld: inEscrow,
      totalDisbursed: disbursed,
      automatedPayoutsCount: payoutsCount,
      disputeRatePercent: 0,
      activeContractsCount: this.contracts.filter((c) => c.status === 'ACTIVE').length,
    };
  }
}

// Global declaration to maintain singleton across Next.js dev server reloads
declare global {
  // eslint-disable-next-line no-var
  var __pactaStore: PactaStore | undefined;
}

export const store = globalThis.__pactaStore ?? new PactaStore();
if (process.env.NODE_ENV !== 'production') {
  globalThis.__pactaStore = store;
}
