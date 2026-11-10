'use client';

import React, { useState, useEffect } from 'react';
import {
  Play,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  CreditCard,
  ShieldCheck,
  Zap,
  BarChart3,
  Activity,
  Layers,
  Key,
} from 'lucide-react';
import { sound } from '@/lib/audio';
import { Contract } from '@/types';
import { LifecycleStage } from './PactaConsole';

export interface GuideMeTourProps {
  isOpen: boolean;
  onClose: () => void;
  currentStage: LifecycleStage;
  onStageChange: (stage: LifecycleStage) => void;
  onRefreshData: () => Promise<void>;
  onContractCreated: (contract: Contract) => void;
  onSelectPreset?: (presetKey: string) => void;
}

interface TourStep {
  targetId: string;
  stage: LifecycleStage;
  badge: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  tip: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'scenario-presets',
    stage: 1,
    badge: 'STEP 01 // SCENARIOS',
    title: '1-Click Judge Scenarios & Custom Agent RFQ',
    icon: Layers,
    description:
      'Switch instantly between 4 pre-configured agentic commerce missions (DeFi Security Audit, Multi-Lingual L10n, API Red-Team, or Synthetic Dataset), or deploy a custom RFQ.',
    tip: 'Click any capsule pill to load its live PayPal contract, Tavily rate benchmark, and acceptance rubric.',
  },
  {
    targetId: 'telemetry-bar',
    stage: 1,
    badge: 'STEP 02 // CALIBRATION',
    title: 'Inline Treasury Calibration & Live Simulation',
    icon: Activity,
    description:
      'Monitor total funds held in PayPal Orders v2 Sandbox Vaults, automated Payouts v1 disbursements, and live Tavily market rate benchmarks.',
    tip: 'Toggle "LIVE SIM" to stream real-time synthetic agent micro-transactions into the ledger.',
  },
  {
    targetId: 'left-escrow-panel',
    stage: 2,
    badge: 'STEP 03 // ESCROW & PROOF INPUT',
    title: 'Mission Rubric, PayPal Escrow Lock & Proof Input',
    icon: CreditCard,
    description:
      'The Left Card holds the contract objective, acceptance rubric, PayPal Orders v2 Escrow status, and the worker agent’s proof-of-work payload.',
    tip: 'Click "🟢 Passing Proof (96%)" or "🔴 Failing Proof (42%)"—or type custom proof—then click the black CTA button at the bottom!',
  },
  {
    targetId: 'right-audit-panel',
    stage: 3,
    badge: 'STEP 04 // LIVE REDLINE DIFF',
    title: 'Gemini 3.5 Redline Audit & PayPal Payouts v1',
    icon: ShieldCheck,
    description:
      'The Right Card shows Gemini 3.5’s live redline verification diff—striking through defective clauses in crimson (locking escrow) or underlining verified proofs in emerald (triggering instant PayPal Payout).',
    tip: 'Use the top-right toggle to flip between [Redline Diff] and [PayPal Voucher] inside the same card!',
  },
  {
    targetId: 'right-audit-panel',
    stage: 4,
    badge: 'STEP 05 // THERMAL VOUCHER',
    title: 'Stamped PayPal Settlement Receipt Voucher',
    icon: Zap,
    description:
      'When verified (score ≥ 85%), Pacta calls PayPal Payouts API (v1) and stamps a tactile perforated paper voucher complete with SHA-256 hash and Sandbox Order/Payout IDs.',
    tip: 'Notice how the Right Card automatically flipped to the PayPal Voucher view for this step!',
  },
  {
    targetId: 'stage-5-cockpit',
    stage: 5,
    badge: 'STEP 06 // AG GRID LEDGER',
    title: 'AG Grid Community v36 Institutional Ledger',
    icon: BarChart3,
    description:
      'CFOs and treasury officers audit all agent transactions in an enterprise AG Grid with real-time status pills, AI audit gauges, multi-column sorting, and instant CSV export.',
    tip: 'When you finish the tour, Pacta automatically resets back to the main 2-column Escrow Workstation!',
  },
  {
    targetId: 'nav-settings',
    stage: 1,
    badge: 'STEP 07 // BYOK KEYS',
    title: 'Bring Your Own Keys & Zero-Crash Fallbacks',
    icon: Key,
    description:
      'Configure your own PayPal Sandbox Client/Secret, Gemini API Key, or Tavily Key. All credentials stay strictly client-side in localStorage with zero-crash heuristic fallbacks.',
    tip: 'Click "Finish Tour" to start testing Pacta!',
  },
];

export default function GuideMeTour({
  isOpen,
  onClose,
  currentStage,
  onStageChange,
  onRefreshData,
  onSelectPreset,
}: GuideMeTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunningAutoDemo, setIsRunningAutoDemo] = useState(false);
  const [autoDemoStatus, setAutoDemoStatus] = useState<string | null>(null);

  // Sync stage and highlight element whenever step changes
  useEffect(() => {
    if (!isOpen) {
      document.querySelectorAll('.tour-spotlight-active').forEach((el) => {
        el.classList.remove(
          'tour-spotlight-active',
          'ring-4',
          'ring-amber-500',
          'ring-offset-4',
          'ring-offset-[#F7F6F2]',
          'shadow-[0_0_50px_rgba(245,158,11,0.45)]',
          'z-50',
          'relative'
        );
      });
      return;
    }

    const step = TOUR_STEPS[currentStep];
    if (!step) return;

    if (step.stage !== currentStage) {
      onStageChange(step.stage);
    }

    const timer = setTimeout(() => {
      document.querySelectorAll('.tour-spotlight-active').forEach((el) => {
        el.classList.remove(
          'tour-spotlight-active',
          'ring-4',
          'ring-amber-500',
          'ring-offset-4',
          'ring-offset-[#F7F6F2]',
          'shadow-[0_0_50px_rgba(245,158,11,0.45)]',
          'z-50',
          'relative'
        );
      });

      const target = document.querySelector(`[data-tour="${step.targetId}"]`);
      if (target) {
        target.classList.add(
          'tour-spotlight-active',
          'ring-4',
          'ring-amber-500',
          'ring-offset-4',
          'ring-offset-[#F7F6F2]',
          'shadow-[0_0_50px_rgba(245,158,11,0.45)]',
          'z-50',
          'relative'
        );
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [isOpen, currentStep, currentStage, onStageChange]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleDismissTour(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (!isOpen) return null;

  const handleDismissTour = (resetStage = true) => {
    sound.playClick();
    if (resetStage) {
      onStageChange(1);
    }
    setCurrentStep(0);
    onClose();
  };

  const handleNext = () => {
    sound.playClick();
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleDismissTour(true);
    }
  };

  const handlePrev = () => {
    sound.playClick();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const runAutoDemo = async () => {
    setIsRunningAutoDemo(true);
    sound.playClick();

    try {
      setAutoDemoStatus('1/4: Loading DeFi Security Audit Scenario...');
      if (onSelectPreset) {
        onSelectPreset('defi-security');
      }
      setCurrentStep(2);
      onStageChange(2);
      await new Promise((r) => setTimeout(r, 2500));

      setAutoDemoStatus('2/4: Inspecting Gemini 3.5 Live Redline Diff...');
      setCurrentStep(3);
      onStageChange(3);
      await onRefreshData();
      await new Promise((r) => setTimeout(r, 3000));

      setAutoDemoStatus('3/4: Stamping PayPal Payouts v1 Thermal Voucher...');
      sound.playStamp();
      await new Promise((r) => setTimeout(r, 500));
      sound.playPayout();
      setCurrentStep(4);
      onStageChange(4);
      await new Promise((r) => setTimeout(r, 3000));

      setAutoDemoStatus('4/4: Syncing settlement to AG Grid Institutional Ledger...');
      setCurrentStep(5);
      onStageChange(5);
      await new Promise((r) => setTimeout(r, 3000));

      setAutoDemoStatus('Complete! Returning to Escrow Workstation...');
      await new Promise((r) => setTimeout(r, 1200));
      setIsRunningAutoDemo(false);
      setAutoDemoStatus(null);
      handleDismissTour(true);
    } catch (err) {
      console.error('Auto demo error:', err);
      setAutoDemoStatus('Simulation interrupted.');
      setTimeout(() => {
        setIsRunningAutoDemo(false);
        setAutoDemoStatus(null);
      }, 2000);
    }
  };

  const step = TOUR_STEPS[currentStep];
  const StepIcon = step.icon;

  return (
    <>
      {/* Dimmed Warm Focus Backdrop Overlay */}
      <div
        onClick={() => handleDismissTour(true)}
        className="fixed inset-0 z-40 bg-zinc-950/35 backdrop-blur-[1.5px] transition-opacity duration-300"
      />

      {/* Editorial Floating Spotlight Tour Card docked at bottom */}
      <aside
        aria-label="Interactive Tour"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 pointer-events-auto"
      >
        <div className="relative bg-[#FAF9F6] border-2 border-zinc-900 rounded-2xl shadow-[0_24px_60px_rgba(24,24,27,0.28)] p-5 sm:p-6 overflow-hidden text-zinc-900">
          {/* Top Progress & Header */}
          <div className="relative flex items-center justify-between pb-3 mb-3 border-b border-[#E5E4DE]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-white font-bold uppercase tracking-wider">
                {step.badge}
              </span>
              <span className="text-zinc-300">|</span>
              <span className="font-mono text-[10px] text-zinc-500 font-semibold">
                STEP {currentStep + 1} OF {TOUR_STEPS.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block font-mono text-[10px] text-zinc-400">
                Use [←] [→] keys • Resets on finish
              </span>
              <button
                onClick={() => handleDismissTour(true)}
                className="p-1.5 rounded-lg bg-white hover:bg-zinc-100 border border-[#E5E4DE] text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
                title="Exit Tour & Reset Workstation (Esc)"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Auto-Demo Live Status Banner */}
          {isRunningAutoDemo && (
            <div className="mb-4 p-2.5 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-between text-xs font-mono text-amber-900">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-600 animate-ping" />
                <span className="font-semibold">{autoDemoStatus}</span>
              </div>
              <span className="text-[10px] text-amber-700 uppercase">Simulated Real-Time Flow</span>
            </div>
          )}

          {/* Main Step Content */}
          <div className="relative flex items-start gap-3.5 mb-4">
            <div className="h-10 w-10 rounded-xl bg-zinc-900 text-white p-2 flex items-center justify-center shrink-0 shadow-xs">
              <StepIcon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-serif font-bold text-zinc-900 mb-1">
                {step.title}
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">{step.description}</p>
            </div>
          </div>

          {/* Interactive Tip Banner */}
          <div className="relative mb-4 p-3 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-950">
            <Sparkles className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-snug">
              <span className="font-bold text-amber-900 font-mono text-[10px] uppercase block mb-0.5">
                JUDGE EVALUATION TIP:
              </span>
              <span>{step.tip}</span>
            </div>
          </div>

          {/* Step Progress Indicators */}
          <div className="relative flex items-center gap-1 mb-4">
            {TOUR_STEPS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  sound.playClick();
                  setCurrentStep(idx);
                }}
                className={`h-1.5 flex-1 rounded-full transition-all cursor-pointer ${
                  idx === currentStep
                    ? 'bg-zinc-900'
                    : idx < currentStep
                    ? 'bg-zinc-400 hover:bg-zinc-500'
                    : 'bg-zinc-200 hover:bg-zinc-300'
                }`}
                title={`Jump to: ${s.title}`}
              />
            ))}
          </div>

          {/* Action Footer Controls */}
          <div className="relative flex items-center justify-between gap-3 pt-1">
            <button
              onClick={runAutoDemo}
              disabled={isRunningAutoDemo}
              className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-mono font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>{isRunningAutoDemo ? 'Running...' : '60s Auto-Demo'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0 || isRunningAutoDemo}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-100 disabled:opacity-40 text-zinc-700 text-xs font-medium flex items-center gap-1.5 border border-[#E5E4DE] transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Previous</span>
              </button>

              <button
                onClick={handleNext}
                disabled={isRunningAutoDemo}
                className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <span>{currentStep === TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
