'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  Play,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  Bot,
  CreditCard,
  ShieldCheck,
  Zap,
  BarChart3,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { sound } from '@/lib/audio';
import { getByokHeaders } from '@/lib/credentials';
import { Contract } from '@/types';

interface GuideMeTourProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: 'contracts' | 'cockpit' | 'new-mission') => void;
  onRefreshData: () => Promise<void>;
  onContractCreated: (contract: Contract) => void;
}

interface TourStep {
  title: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  tip: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Autonomous Agent RFQ & Planning',
    badge: 'STAGE 01 // PLANNING',
    icon: Bot,
    description:
      'Describe any task in natural language. Pacta’s Gemini 2.5 Planning Agent benchmarks live freelance rates (via Tavily) and breaks the job down into verifiable milestone contracts with objective acceptance criteria.',
    tip: 'Click "Deploy New Mission" in the navigation bar or use quick presets like "Security Audit".',
  },
  {
    title: 'Autonomous Topology Mesh',
    badge: 'STAGE 02 // MESH VISUALIZATION',
    icon: Sparkles,
    description:
      'Visual conduits illustrate the cryptographic flow between the Buyer Agent, the PayPal Escrow Vault, the Provider Agent, and the Gemini AI Judge. Glowing pulses track real-time money and audit signals.',
    tip: 'Click any node in the topology mesh to open the real-time telemetry inspector.',
  },
  {
    title: 'Tactile Hardware Escrow Vouchers',
    badge: 'STAGE 03 // ESCROW DEPOSIT',
    icon: CreditCard,
    description:
      'Each milestone operates as a physical perforated receipt voucher. When funded, money locks conditionally into the PayPal Sandbox Escrow Vault via the Orders v2 API.',
    tip: 'Click "Fund Escrow via PayPal" to lock milestone funds before the agent commences execution.',
  },
  {
    title: 'Gemini AI Judge & Analog Meter',
    badge: 'STAGE 04 // PROOF-OF-WORK AUDIT',
    icon: ShieldCheck,
    description:
      'Once deliverables are submitted, the Gemini AI Judge audits the submission against all contractual acceptance criteria. An analog 10-bar LED meter indicates the compliance score.',
    tip: 'Scores ≥ 85 trigger automatic instant settlement; lower scores are flagged for human arbitration.',
  },
  {
    title: 'PayPal Payouts & AG Grid Cockpit',
    badge: 'STAGE 05 // INSTANT DISBURSEMENT',
    icon: BarChart3,
    description:
      'Upon approval, the PayPal Payouts API automatically disburses funds to the provider’s email in milliseconds. The settlement is recorded in the Bloomberg-style AG Grid Financial Cockpit with CSV export.',
    tip: 'Switch to the "AG Grid Cockpit" tab to filter, sort, and review the immutable ledger.',
  },
];

export default function GuideMeTour({
  isOpen,
  onClose,
  setActiveTab,
  onRefreshData,
  onContractCreated,
}: GuideMeTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunningAutoDemo, setIsRunningAutoDemo] = useState(false);
  const [autoDemoStatus, setAutoDemoStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNext = () => {
    sound.playClick();
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    sound.playClick();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 60-Second Auto Demo Simulation for Hackathon Judges
  const runAutoDemo = async () => {
    setIsRunningAutoDemo(true);
    sound.playClick();

    try {
      // Step 1: Create a live demo contract
      setAutoDemoStatus('1/5: Deploying Autonomous Agent Mission (Gemini + Tavily)...');
      setActiveTab('contracts');

      const headers = {
        'Content-Type': 'application/json',
        ...getByokHeaders(),
      };

      const createRes = await fetch('/api/contracts', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          objective: 'Automated Zero-Day Smart Contract Security Audit & Hardening',
          totalBudget: 150,
          category: 'Security',
          buyerName: 'Judge Autonomous Fund',
          buyerEmail: 'judge.buyer@sandbox.paypal.com',
          providerAgentName: 'Sentient-SecOps-Bot',
          providerEmail: 'provider.agent@sandbox.paypal.com',
        }),
      });

      const createData = await createRes.json();
      if (!createData.contract) throw new Error('Contract deployment failed');
      const contract: Contract = createData.contract;
      onContractCreated(contract);
      await onRefreshData();

      const milestone1 = contract.milestones[0];
      await new Promise((r) => setTimeout(r, 2000));

      // Step 2: Fund Escrow via PayPal
      setAutoDemoStatus(`2/5: Locking $${milestone1.amount} into PayPal Escrow Vault...`);
      sound.playClick();

      const orderRes = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          contractId: contract.id,
          milestoneId: milestone1.id,
        }),
      });
      const orderData = await orderRes.json();

      const captureRes = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          contractId: contract.id,
          milestoneId: milestone1.id,
          orderId: orderData.orderId,
        }),
      });
      await captureRes.json();
      await onRefreshData();
      await new Promise((r) => setTimeout(r, 2200));

      // Step 3: Provider agent delivers proof of work
      setAutoDemoStatus('3/5: Provider Agent submitting deliverable proof-of-work...');
      sound.playClick();

      await fetch(`/api/contracts/${contract.id}/submit`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          milestoneId: milestone1.id,
          submissionContent:
            'Completed zero-day vulnerability analysis. Discovered and patched 2 reentrancy vectors. Static analysis 100% clean, gas optimization improved by 18.4%. Test suite attached with 48/48 unit tests passing.',
        }),
      });
      await onRefreshData();
      await new Promise((r) => setTimeout(r, 2200));

      // Step 4: AI Judge Audits & Verifies
      setAutoDemoStatus('4/5: Gemini AI Judge evaluating deliverable against criteria...');
      const verifyRes = await fetch(`/api/contracts/${contract.id}/verify`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          milestoneId: milestone1.id,
        }),
      });
      await verifyRes.json();

      // Step 5: Sound & Switch to Cockpit
      sound.playStamp();
      await new Promise((r) => setTimeout(r, 800));
      sound.playPayout();

      setAutoDemoStatus('5/5: PayPal Payout Disbursed! Switching to AG Grid Financial Cockpit...');
      await onRefreshData();
      await new Promise((r) => setTimeout(r, 1800));

      setActiveTab('cockpit');
      setAutoDemoStatus('Demo Completed! Settlement finalized on immutable ledger.');
      await new Promise((r) => setTimeout(r, 2500));
      setIsRunningAutoDemo(false);
      setAutoDemoStatus(null);
      onClose();
    } catch (err) {
      console.error('Auto demo error:', err);
      setAutoDemoStatus('Demo simulation interrupted. Check console logs.');
      setTimeout(() => {
        setIsRunningAutoDemo(false);
        setAutoDemoStatus(null);
      }, 3000);
    }
  };

  const step = TOUR_STEPS[currentStep];
  const StepIcon = step.icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#0c0f17] to-[#07080c] border border-blue-500/30 rounded-3xl shadow-2xl p-6 sm:p-7 overflow-hidden">
        {/* Top Progress & Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-blue-400 font-bold uppercase tracking-wider">
              {step.badge}
            </span>
            <span className="text-zinc-600">|</span>
            <span className="font-mono text-[10px] text-zinc-400">
              STEP {currentStep + 1} OF {TOUR_STEPS.length}
            </span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            disabled={isRunningAutoDemo}
            className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step Body */}
        <div className="py-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-blue-600/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
              <StepIcon className="h-5 w-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">{step.title}</h3>
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">{step.description}</p>

          <div className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 text-xs text-zinc-400 space-y-1">
            <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase block">Pro Tip for Judges:</span>
            <p>{step.tip}</p>
          </div>
        </div>

        {/* Live Auto Demo Banner (if running) */}
        {autoDemoStatus && (
          <div className="mb-4 p-3 rounded-2xl bg-blue-950/40 border border-blue-500/40 flex items-center gap-2.5 text-xs text-blue-300 font-mono animate-in fade-in">
            <Loader2 className="h-4 w-4 animate-spin text-blue-400 shrink-0" />
            <span className="flex-1">{autoDemoStatus}</span>
          </div>
        )}

        {/* Footer Navigation & 1-Click Auto Demo */}
        <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          {/* Auto Demo Button */}
          <button
            onClick={runAutoDemo}
            disabled={isRunningAutoDemo}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isRunningAutoDemo ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5 fill-current" />
            )}
            <span>Auto-Play 60s Demo</span>
          </button>

          {/* Stepper Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                disabled={isRunningAutoDemo}
                className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={isRunningAutoDemo}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{currentStep === TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
