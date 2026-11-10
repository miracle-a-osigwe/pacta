import { Contract } from '@/types';

export interface ScenarioTemplate {
  id: string;
  key: string;
  name: string;
  shortLabel: string;
  category: string;
  badge: string;
  contract: Contract;
  passingSample: string;
  failingSample: string;
}

export const PRESET_SCENARIOS: Record<string, ScenarioTemplate> = {
  'defi-security': {
    id: 'contract-sec-01',
    key: 'defi-security',
    name: 'Smart Contract & API Security Audit',
    shortLabel: '🛡️ DeFi Security',
    category: 'Security',
    badge: 'SLITHER + AST VERIFIED',
    contract: {
      id: 'contract-sec-01',
      title: 'Full-Stack Smart Contract & API Security Audit',
      objective:
        'Perform automated static analysis, pen-testing, and deliver a vulnerability report with remediation patches.',
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
          submissionContent:
            'Completed static AST analysis on repository. Detected 2 low-risk reentrancy warnings and 1 unvalidated input vector. Remediation guidelines and attack graph attached: [AST_REPORT_V1.pdf].',
          verificationScore: 94,
          verificationFeedback:
            'AI Auditor verified: Complete AST scan provided, CWE-79 and CWE-20 classified with CVSS scores. Met all criteria.',
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
          message:
            'SentinelSec-Agent proposed 2-phase delivery for $280 USD: Phase 1 ($120) static analysis + Phase 2 ($160) remediation PR.',
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
    passingSample:
      'Completed static AST and reentrancy analysis on all contracts. Resolved CWE-79 and CWE-20 vectors in commit a8f9c2. Slither formal verification passed with 100% test coverage. Artifacts attached: [remediation-report-v2.json].',
    failingSample:
      'Partial draft commit: Found 3 unresolved critical reentrancy vectors. Test suite failing with 2 timeout regressions in liquidator pool. Work in progress.',
  },
  localization: {
    id: 'contract-loc-02',
    key: 'localization',
    name: 'Autonomous Multi-Lingual App Localization',
    shortLabel: '🌐 i18n Localization',
    category: 'Localization',
    badge: 'JA-JP + DE-DE ICU COMPLIANT',
    contract: {
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
    passingSample:
      'Translated 450 UI keys into ja-JP and de-DE with 100% ICU syntax compliance. Cultural nuance check validated by native corpus parser. No text truncation observed in responsive layouts. Manifest attached: [i18n-manifest.json].',
    failingSample:
      'Draft keys exported with 14 missing interpolation tokens ({userName}, {amount}). German noun compounds overflowing container bounds by 45px.',
  },
  'red-team': {
    id: 'contract-red-03',
    key: 'red-team',
    name: 'Autonomous Red-Teaming & API Penetration',
    shortLabel: '🎯 Red-Teaming',
    category: 'Penetration Testing',
    badge: 'OWASP TOP 10 + FUZZING',
    contract: {
      id: 'contract-red-03',
      title: 'Autonomous Agent Red-Teaming & API Penetration',
      objective:
        'Execute automated OWASP Top 10 API penetration testing, prompt injection fuzzing, and generate verified WAF rules.',
      category: 'Security',
      totalBudget: 320,
      currency: 'USD',
      buyerName: 'Enterprise Cloud Systems',
      buyerEmail: 'ciso-office@enterprise.sandbox.com',
      providerAgentName: 'Cerberus-RedTeam-Bot',
      providerEmail: 'cerberus.pentest@sandbox.paypal.com',
      status: 'ACTIVE',
      milestones: [
        {
          id: 'ms-red-01',
          title: 'Phase 1: API Threat Reconnaissance & Fuzzing',
          description: 'Automated fuzzing across 34 REST/GraphQL endpoints with attack surface classification.',
          amount: 120,
          currency: 'USD',
          status: 'PAYOUT_COMPLETED',
          deliverableCriteria: [
            'Automated reconnaissance log covering all endpoints',
            'SSRF and JWT validation stress test results',
          ],
          submissionContent:
            'Completed 12,000 automated fuzzing sweeps. Zero unauthenticated RCE detected; 2 SSRF misconfigurations mapped and documented in [fuzzing-recon.json].',
          verificationScore: 98,
          verificationFeedback:
            'AI Auditor verified: Extensive fuzzing telemetry provided, SSRF vectors accurately pinpointed with CVSS 6.8 rating.',
          paypalOrderId: 'SANDBOX-ORDER-RED01',
          paypalPayoutBatchId: 'SANDBOX-BATCH-RED01-P1',
          updatedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
        },
        {
          id: 'ms-red-02',
          title: 'Phase 2: Prompt Injection Fuzzing & WAF Mitigation',
          description: 'LLM adversarial prompt fuzzing suite with custom Cloudflare/Envoy WAF mitigation rules.',
          amount: 200,
          currency: 'USD',
          status: 'ESCROW_FUNDED',
          deliverableCriteria: [
            'Comprehensive prompt injection test matrix (jailbreak, delimiter collision, base64 payload)',
            'Production-ready WAF mitigation rule manifest',
            'Zero bypass reproduction in test environment',
          ],
          paypalOrderId: 'SANDBOX-ORDER-RED02',
          updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
      ],
      agentNegotiationLog: [
        {
          sender: 'BUYER_AGENT',
          message: 'Requested RFQ: Autonomous LLM Red-Teaming & API penetration suite.',
          timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        },
        {
          sender: 'PROVIDER_AGENT',
          message: 'Cerberus-RedTeam accepted mission at $320 USD split into 2 verified milestones.',
          timestamp: new Date(Date.now() - 3600000 * 22).toISOString(),
        },
      ],
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    passingSample:
      'Executed 12,000 automated fuzzing payloads against API gateway. Confirmed zero SSRF vulnerabilities. Prompt injection filters passed with 99.4% precision. Full PoC exploits and mitigation WAF rules verified: [redteam-audit.json].',
    failingSample:
      'Reconnaissance incomplete: Gateway blocked automated scanner IP after 45 requests. Fuzzing suite crashed. Zero PoC test logs submitted.',
  },
  'dataset-curation': {
    id: 'contract-data-04',
    key: 'dataset-curation',
    name: 'Synthetic Training Dataset Curation & Cleaning',
    shortLabel: '🧠 Dataset Curation',
    category: 'Data Engineering',
    badge: '50K TOKENS DEDUPLICATED',
    contract: {
      id: 'contract-data-04',
      title: 'Synthetic Training Dataset Curation & Hallucination Filter',
      objective:
        'Generate, deduplicate, and validate 50,000 domain-specific training tokens with hallucination rejection scoring.',
      category: 'Data Science',
      totalBudget: 210,
      currency: 'USD',
      buyerName: 'Frontier AI Research Lab',
      buyerEmail: 'data-ops@frontier-ai.sandbox.com',
      providerAgentName: 'DataForge-Curator-Agent',
      providerEmail: 'dataforge.curator@sandbox.paypal.com',
      status: 'ACTIVE',
      milestones: [
        {
          id: 'ms-data-01',
          title: 'Phase 1: 50K Deduplicated Token Batches',
          description: 'High-density Q&A token extraction with MinHash LSH deduplication filter.',
          amount: 110,
          currency: 'USD',
          status: 'ESCROW_FUNDED',
          deliverableCriteria: [
            '50,000 curated synthetic training rows in JSONL format',
            'MinHash LSH deduplication metric <= 0.05 redundancy',
            'Automated PII scrubbed',
          ],
          paypalOrderId: 'SANDBOX-ORDER-DATA01',
          updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
        },
        {
          id: 'ms-data-02',
          title: 'Phase 2: Hallucination Benchmark & Semantic Validation',
          description: 'Automated verification against ground-truth corpora with perplexity scoring.',
          amount: 100,
          currency: 'USD',
          status: 'ESCROW_PENDING',
          deliverableCriteria: [
            'Hallucination audit report confirming <= 0.8% false claim rate',
            'Embeddings semantic similarity matrix',
          ],
          updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
        },
      ],
      agentNegotiationLog: [
        {
          sender: 'BUYER_AGENT',
          message: 'Initiated RFQ: Curate and scrub 50K high-precision domain tokens for fine-tuning.',
          timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
        },
        {
          sender: 'PROVIDER_AGENT',
          message: 'DataForge agreed to $210 USD budget with 2 milestones.',
          timestamp: new Date(Date.now() - 3600000 * 10).toISOString(),
        },
      ],
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    },
    passingSample:
      'Curated 52,400 synthetic token rows in Parquet/JSONL. MinHash LSH duplicate rate: 0.012%. Strict regex PII scrubbing completed with 0 leaks detected. Artifact: [tokens-clean-v1.jsonl].',
    failingSample:
      'Corrupted upload: 12,000 rows contain unescaped null bytes and raw unscrubbed IP addresses. Redundancy rate exceeds 18% threshold.',
  },
};
