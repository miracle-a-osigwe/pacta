'use client';

import React, { useState, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  Zap,
  CheckCircle2,
  ArrowRight,
  Play,
  Lock,
  Globe,
  Sliders,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Copy,
  Check,
  Receipt,
  FileSearch,
} from 'lucide-react';
import { Contract, Milestone, LedgerTransaction, TelemetryStats } from '@/types';
import { sound } from '@/lib/audio';
import { getByokHeaders } from '@/lib/credentials';
import { PRESET_SCENARIOS } from '@/lib/scenarios';
import PerforatedReceipt from '@/components/PerforatedReceipt';
import AgGridCockpit from '@/components/AgGridCockpit';
import AgentMissionInput from '@/components/AgentMissionInput';

interface PactaConsoleProps {
  contracts: Contract[];
  transactions: LedgerTransaction[];
  telemetry: TelemetryStats | null;
  onRefresh: () => Promise<void>;
  onContractCreated: (contract: Contract) => void;
  onOpenSettings: () => void;
  onOpenGuide: () => void;
  controlledStage?: LifecycleStage;
  onStageChange?: (stage: LifecycleStage) => void;
  selectedPresetKey?: string;
  onSelectPreset?: (presetKey: string) => void;
  /** True when PayPal + Gemini env/BYOK keys are present — changes LIVE SIM label */
  isLiveSandbox?: boolean;
}

export type LifecycleStage = 1 | 2 | 3 | 4 | 5;

export default function PactaConsole({
  contracts,
  transactions,
  telemetry,
  onRefresh,
  onContractCreated,
  controlledStage,
  onStageChange,
  selectedPresetKey,
  onSelectPreset,
  isLiveSandbox = false,
}: PactaConsoleProps) {
  const [internalStage, setInternalStage] = useState<LifecycleStage>(controlledStage || 1);
  const activeStage = controlledStage !== undefined ? controlledStage : internalStage;
  const [activePresetKey, setActivePresetKey] = useState<string>(selectedPresetKey || 'defi-security');
  const [isLiveSimActive, setIsLiveSimActive] = useState(false);
  const [liveEventLogs, setLiveEventLogs] = useState<string[]>([]);
  const [selectedContractId, setSelectedContractId] = useState<string>(contracts[0]?.id || '');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);
  const [isDeployingNew, setIsDeployingNew] = useState(false);
  const [isDebriefOpen, setIsDebriefOpen] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoPlayStatus, setAutoPlayStatus] = useState<string>('');
  const [actionLoading, setActionLoading] = useState(false);
  const [copiedProof, setCopiedProof] = useState(false);
  const [rightPanelView, setRightPanelView] = useState<'redline' | 'voucher'>('redline');
  const [draftProof, setDraftProof] = useState<string>('');

  const activeContract = contracts.find((c) => c.id === selectedContractId) || contracts[0];
  const activeMilestones = activeContract?.milestones || [];

  const currentMilestone =
    activeMilestones.find((m) => m.id === selectedMilestoneId) ||
    activeMilestones.find((m) => m.status !== 'PAYOUT_COMPLETED') ||
    activeMilestones[0];

  // Sync controlled stage (e.g. from Navbar or GuideMeTour)
  useEffect(() => {
    if (controlledStage !== undefined) {
      setInternalStage(controlledStage);
      if (controlledStage === 4) {
        setRightPanelView('voucher');
      } else if (controlledStage === 1 || controlledStage === 2 || controlledStage === 3) {
        setRightPanelView('redline');
      }
    }
  }, [controlledStage]);

  // Sync selected preset
  useEffect(() => {
    if (selectedPresetKey) {
      setActivePresetKey(selectedPresetKey);
    }
  }, [selectedPresetKey]);

  // Sync selected contract if list changes
  useEffect(() => {
    if (!selectedContractId && contracts.length > 0) {
      setSelectedContractId(contracts[0].id);
    }
  }, [contracts, selectedContractId]);

  // Keep draftProof synced with currentMilestone submission or default passing sample
  useEffect(() => {
    if (currentMilestone?.submissionContent) {
      setDraftProof(currentMilestone.submissionContent);
    } else {
      const preset = PRESET_SCENARIOS[activePresetKey] || PRESET_SCENARIOS['defi-security'];
      setDraftProof(preset.passingSample);
    }
  }, [currentMilestone?.id, currentMilestone?.submissionContent, activePresetKey]);

  // Live simulation tick engine
  useEffect(() => {
    if (!isLiveSimActive) return;

    const tickSim = async () => {
      try {
        const res = await fetch('/api/simulation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'live_event' }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.logMessage) {
            setLiveEventLogs((prev) => [data.logMessage, ...prev.slice(0, 5)]);
          }
          await onRefresh();
        }
      } catch (e) {
        console.warn('Live simulation tick failed:', e);
      }
    };

    tickSim();
    const interval = setInterval(tickSim, 4500);
    return () => clearInterval(interval);
  }, [isLiveSimActive, onRefresh]);

  const handleStageSelect = (stage: LifecycleStage) => {
    sound.playClick();
    if (onStageChange) {
      onStageChange(stage);
    } else {
      setInternalStage(stage);
    }
    setIsDeployingNew(false);
  };

  const setActiveStage = (stage: LifecycleStage) => handleStageSelect(stage);

  const handleLoadPreset = async (presetKey: string) => {
    sound.playClick();
    setActionLoading(true);
    setIsDeployingNew(false);
    try {
      const res = await fetch('/api/simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'load_scenario', presetKey }),
      });
      if (res.ok) {
        const data = await res.json();
        setActivePresetKey(presetKey);
        if (onSelectPreset) {
          onSelectPreset(presetKey);
        }
        await onRefresh();
        if (data.contract?.id) {
          setSelectedContractId(data.contract.id);
          setSelectedMilestoneId(null);
        }
        setRightPanelView('redline');
      }
    } catch (err) {
      console.error('Failed to load preset:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Dual-Path Judge Benchmark Test Injector (Pass or Dispute/Fail)
  const handleInjectProof = async (type: 'pass' | 'fail') => {
    if (!currentMilestone || !activeContract) return;
    setActionLoading(true);
    setRightPanelView('redline');
    try {
      sound.playClick();
      const preset = PRESET_SCENARIOS[activePresetKey] || PRESET_SCENARIOS['defi-security'];
      const sampleProof = type === 'pass' ? preset.passingSample : preset.failingSample;
      setDraftProof(sampleProof);

      // Ensure escrow is funded first if pending
      if (currentMilestone.status === 'ESCROW_PENDING') {
        const headers = { 'Content-Type': 'application/json', ...getByokHeaders() };
        const orderRes = await fetch('/api/paypal/create-order', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            contractId: activeContract.id,
            milestoneId: currentMilestone.id,
          }),
        });
        const orderData = await orderRes.json();
        if (orderRes.ok && orderData.orderId) {
          await fetch('/api/paypal/capture-order', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              contractId: activeContract.id,
              milestoneId: currentMilestone.id,
              orderId: orderData.orderId,
            }),
          });
        }
      }

      // 1. Submit deliverable
      const submitRes = await fetch(`/api/contracts/${activeContract.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getByokHeaders() },
        body: JSON.stringify({
          milestoneId: currentMilestone.id,
          submissionContent: sampleProof,
        }),
      });
      if (!submitRes.ok) throw new Error('Submission failed');
      await onRefresh();

      // 2. Automatically trigger Gemini 3.5 Verification & AI Judge
      const verifyRes = await fetch(`/api/contracts/${activeContract.id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getByokHeaders() },
        body: JSON.stringify({
          milestoneId: currentMilestone.id,
        }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error || 'Verification failed');

      if (type === 'pass') {
        sound.playStamp();
        setTimeout(() => sound.playPayout(), 400);
        await onRefresh();
      } else {
        sound.playClick();
        await onRefresh();
      }
    } catch (err) {
      console.error('Inject proof error:', err);
      alert(err instanceof Error ? err.message : 'Deliverable injection failed');
    } finally {
      setActionLoading(false);
    }
  };

  // 1. Escrow Funding
  const handleFundEscrow = async (milestone: Milestone) => {
    setActionLoading(true);
    try {
      sound.playClick();
      const headers = { 'Content-Type': 'application/json', ...getByokHeaders() };

      const orderRes = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          contractId: activeContract.id,
          milestoneId: milestone.id,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error);

      const captureRes = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          contractId: activeContract.id,
          milestoneId: milestone.id,
          orderId: orderData.orderId,
        }),
      });
      const captureData = await captureRes.json();
      if (!captureRes.ok) throw new Error(captureData.error);

      await onRefresh();
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Escrow deposit failed');
    } finally {
      setActionLoading(false);
    }
  };

  // 2. Submit Proof of Work
  const handleSubmitDeliverable = async (milestone: Milestone, sampleProof?: string) => {
    setActionLoading(true);
    try {
      sound.playClick();
      const submissionContent =
        sampleProof ||
        draftProof ||
        `Completed milestone deliverable: AST vulnerability scan and remediation PR verified against CWE-79 and CWE-20 standards. Artifacts attached: [audit-manifest-v2.json].`;

      const res = await fetch(`/api/contracts/${activeContract.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getByokHeaders() },
        body: JSON.stringify({
          milestoneId: milestone.id,
          submissionContent,
        }),
      });
      if (!res.ok) throw new Error('Submission failed');
      await onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to submit deliverable');
    } finally {
      setActionLoading(false);
    }
  };

  // 3. Unified Primary CTA: Lock Escrow (if needed) + Submit Draft Proof + Verify & Auto-Payout
  const handleExecutePrimaryFlow = async (milestone: Milestone) => {
    if (!activeContract) return;
    setActionLoading(true);
    try {
      sound.playClick();
      const headers = { 'Content-Type': 'application/json', ...getByokHeaders() };

      // Step A: Lock PayPal Escrow if not yet funded
      if (milestone.status === 'ESCROW_PENDING') {
        const orderRes = await fetch('/api/paypal/create-order', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            contractId: activeContract.id,
            milestoneId: milestone.id,
          }),
        });
        const orderData = await orderRes.json();
        if (!orderRes.ok) throw new Error(orderData.error);

        const captureRes = await fetch('/api/paypal/capture-order', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            contractId: activeContract.id,
            milestoneId: milestone.id,
            orderId: orderData.orderId,
          }),
        });
        const captureData = await captureRes.json();
        if (!captureRes.ok) throw new Error(captureData.error);
      }

      // Step B: Submit current deliverable text
      const contentToSubmit =
        draftProof.trim() ||
        milestone.submissionContent ||
        PRESET_SCENARIOS[activePresetKey]?.passingSample ||
        'Verified deliverable artifact.';

      const submitRes = await fetch(`/api/contracts/${activeContract.id}/submit`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          milestoneId: milestone.id,
          submissionContent: contentToSubmit,
        }),
      });
      if (!submitRes.ok) throw new Error('Deliverable submission failed');

      // Step C: Run Gemini 3.5 Redline Audit & PayPal Payouts v1
      const verifyRes = await fetch(`/api/contracts/${activeContract.id}/verify`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          milestoneId: milestone.id,
        }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error);

      sound.playStamp();
      setTimeout(() => {
        sound.playPayout();
      }, 400);

      await onRefresh();
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setActionLoading(false);
    }
  };

  // 1-Click Guided Auto-Demo
  const runAutoDemo = async () => {
    if (isAutoPlaying) return;
    setIsAutoPlaying(true);
    sound.playClick();

    try {
      setActiveStage(1);
      setRightPanelView('redline');
      setAutoPlayStatus('STEP 1/4 // Loading Scenario & Locking PayPal Orders v2 Escrow Vault...');
      if (currentMilestone && currentMilestone.status === 'ESCROW_PENDING') {
        await handleFundEscrow(currentMilestone);
      }
      await new Promise((r) => setTimeout(r, 2500));

      setAutoPlayStatus('STEP 2/4 // Submitting Worker Proof & Running Gemini 3.5 Live Redline Audit...');
      await handleInjectProof('pass');
      await new Promise((r) => setTimeout(r, 3000));

      setAutoPlayStatus('STEP 3/4 // Stamping Tactile PayPal Payouts v1 Voucher...');
      setRightPanelView('voucher');
      sound.playPayout();
      await new Promise((r) => setTimeout(r, 3000));

      setAutoPlayStatus('STEP 4/4 // Syncing Institutional AG Grid Ledger...');
      setActiveStage(5);
      await new Promise((r) => setTimeout(r, 3000));

      setAutoPlayStatus('DEMO COMPLETE // Returning to Escrow Workstation...');
      await new Promise((r) => setTimeout(r, 1200));
      setActiveStage(1);
      setRightPanelView('redline');
    } catch (e) {
      console.error(e);
      setAutoPlayStatus('Auto-demo encountered an error.');
    } finally {
      setIsAutoPlaying(false);
    }
  };

  const isAuditFailed =
    currentMilestone?.verificationScore !== undefined && currentMilestone.verificationScore < 85;
  const isAuditPassed =
    currentMilestone?.verificationScore !== undefined && currentMilestone.verificationScore >= 85;
  const isEscrowLocked =
    currentMilestone?.status === 'ESCROW_FUNDED' ||
    currentMilestone?.status === 'DELIVERABLE_SUBMITTED' ||
    currentMilestone?.status === 'PAYOUT_COMPLETED';

  // If user switched to AG Grid Ledger in the top Navbar (Stage 5)
  if (activeStage === 5) {
    return (
      <div data-tour="stage-5-cockpit" className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E5E4DE]">
          <div>
            <h1 className="text-2xl font-serif font-bold text-zinc-900">
              Institutional AG Grid Settlement Ledger
            </h1>
            <p className="text-xs font-mono text-zinc-500 mt-0.5">
              Real-time PayPal Orders v2 Escrow &amp; Payouts v1 Audit Trail with Gemini 3.5 Judicial Scores
            </p>
          </div>
          <button
            onClick={() => setActiveStage(1)}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold cursor-pointer self-start sm:self-auto"
          >
            ← Back to Escrow Workstation
          </button>
        </div>
        <AgGridCockpit transactions={transactions} onRefresh={onRefresh} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* =========================================================================
          SECTION 1: EDITORIAL HEADER & SCENARIO BAR
         ========================================================================= */}
      <div className="space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-[28px] font-serif font-bold text-zinc-900 tracking-tight leading-tight">
              Autonomous Agent Procurement &amp; Escrow Verification.
            </h1>
            <p className="text-sm font-serif italic text-zinc-600 mt-0.5">
              Lock milestone capital in PayPal Orders v2. Audit agent deliverables with Gemini 3.5. Settle instantly via PayPal Payouts v1.
            </p>
          </div>

          {/* Top-Right Trust & Security Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E5E4DE] shadow-2xs text-[11px] font-mono text-zinc-600 shrink-0 self-start">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            <span>🔒 Client-Side BYOK • PayPal Sandbox v2 • Zero Human Touch</span>
          </div>
        </div>

        {/* ✨ SCENARIOS: Capsule Pill Bar */}
        <div
          data-tour="scenario-presets"
          className="flex flex-wrap items-center justify-between gap-2.5 pt-0.5"
        >
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-mono text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1 mr-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span>SCENARIOS:</span>
            </span>

            {Object.values(PRESET_SCENARIOS).map((preset) => {
              const isSelected = activePresetKey === preset.key && !isDeployingNew;
              return (
                <button
                  key={preset.key}
                  onClick={() => handleLoadPreset(preset.key)}
                  disabled={actionLoading}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs font-semibold'
                      : 'bg-white border-[#E5E4DE] text-zinc-700 hover:border-zinc-400 hover:text-zinc-900'
                  }`}
                >
                  <span>{preset.shortLabel}</span>
                  <span
                    className={`font-mono text-[10px] ${
                      isSelected ? 'text-zinc-300' : 'text-zinc-400'
                    }`}
                  >
                    ${preset.contract.totalBudget}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setIsDeployingNew(!isDeployingNew);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer border ${
              isDeployingNew
                ? 'bg-zinc-900 border-zinc-900 text-white font-semibold'
                : 'bg-white hover:bg-zinc-50 text-zinc-800 border-[#E5E4DE]'
            }`}
          >
            <Bot className="h-3.5 w-3.5" />
            <span>{isDeployingNew ? '← Back to Workstation' : '+ Custom Agent RFQ'}</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: SLIM INLINE CALIBRATION STRIP (Matches Reference UI)
         ========================================================================= */}
      <div
        data-tour="telemetry-bar"
        className="rounded-xl border border-[#E5E4DE] bg-white px-4 py-2.5 shadow-2xs flex flex-wrap items-center justify-between gap-3"
      >
        <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs">
          <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-zinc-700 uppercase tracking-wider">
            <Sliders className="h-3.5 w-3.5 text-zinc-500" />
            <span>CALIBRATION</span>
          </div>

          <div className="h-3.5 w-px bg-[#E5E4DE] hidden sm:block" />

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-zinc-500">Escrow Held:</span>
            <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
              ${telemetry?.activeEscrowHeld ?? 235}.00 USD
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-zinc-500">Disbursed:</span>
            <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
              ${telemetry?.totalDisbursed ?? 120}.00 USD
            </span>
          </div>

          <div className="hidden xl:flex items-center gap-1.5 text-[11px] font-mono text-zinc-500">
            <Globe className="h-3 w-3 text-amber-700" />
            <span>Tavily Benchmark:</span>
            <span className="font-semibold text-zinc-800">$220–$340 USD</span>
          </div>
        </div>

        {/* Right: Live Sim Toggle & 60s Auto-Demo */}
        <div className="flex items-center gap-2">
          <button
            data-tour="live-simulation-toggle"
            onClick={() => {
              sound.playClick();
              setIsLiveSimActive(!isLiveSimActive);
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
              isLiveSimActive
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : 'bg-[#FAF9F6] text-zinc-600 hover:text-zinc-900 border-[#E5E4DE]'
            }`}
            title="Stream synthetic agent micro-transactions in real time"
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isLiveSimActive ? 'bg-emerald-600 animate-ping' : 'bg-zinc-400'
              }`}
            />
            <span>{isLiveSimActive ? (isLiveSandbox ? 'SIM: LIVE API' : 'SIM: DEMO') : 'LIVE SIM'}</span>
          </button>

          <button
            onClick={runAutoDemo}
            disabled={isAutoPlaying}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isAutoPlaying
                ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                : 'bg-zinc-900 hover:bg-zinc-800 text-white'
            }`}
          >
            <Play className="h-2.5 w-2.5 fill-current" />
            <span>{isAutoPlaying ? 'Auto-Running...' : '60s Auto-Demo'}</span>
          </button>
        </div>
      </div>

      {/* Live Auto-Demo or Live Sim Status Banner (Only shown when active) */}
      {(isAutoPlaying || (isLiveSimActive && liveEventLogs.length > 0)) && (
        <div className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs font-mono text-amber-900">
          <div className="flex items-center gap-2 truncate">
            <span className="h-2 w-2 rounded-full bg-amber-600 animate-ping shrink-0" />
            <span className="font-semibold truncate">
              {isAutoPlaying ? autoPlayStatus : `LIVE STREAM >> ${liveEventLogs[0]}`}
            </span>
          </div>
          <span className="text-[10px] text-amber-700 uppercase shrink-0 ml-2">Real-Time Protocol</span>
        </div>
      )}

      {/* =========================================================================
          SECTION 3: CUSTOM AGENT RFQ COMPOSER OR 2-COLUMN SPLIT WORKSTATION
         ========================================================================= */}
      {isDeployingNew ? (
        <div className="space-y-4">
          <AgentMissionInput
            onContractCreated={(contract) => {
              onContractCreated(contract);
              setSelectedContractId(contract.id);
              setIsDeployingNew(false);
            }}
          />
        </div>
      ) : (
        activeContract && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* ===================================================================
                LEFT CARD: MISSION RUBRIC, ESCROW LOCK & PROOF INPUT
               =================================================================== */}
            <div
              data-tour="left-escrow-panel"
              className="lg:col-span-5 rounded-2xl bg-white border border-[#E5E4DE] shadow-2xs overflow-hidden flex flex-col justify-between"
            >
              <div className="p-5 sm:p-6 space-y-4">
                {/* Top Card Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E4DE] gap-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-zinc-800" />
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-700">
                      MISSION &amp; PAYPAL ESCROW
                    </span>
                  </div>

                  {/* Escrow Vault Status Pill */}
                  <div className="flex items-center gap-1.5">
                    {isEscrowLocked ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-[10px] font-bold">
                        <Lock className="h-2.5 w-2.5 text-emerald-700" />
                        <span>ESCROW LOCKED • ${currentMilestone?.amount || activeContract.totalBudget}</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => currentMilestone && handleFundEscrow(currentMilestone)}
                        disabled={actionLoading}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-mono text-[10px] font-bold cursor-pointer transition-colors"
                        title="Click to lock funds in PayPal Orders v2 Sandbox Vault"
                      >
                        <Lock className="h-2.5 w-2.5 text-amber-700" />
                        <span>LOCK ESCROW (${currentMilestone?.amount || activeContract.totalBudget})</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Mission Title, Agent Pair & Milestone Switcher */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-lg font-serif font-bold text-zinc-900 leading-snug">
                      {activeContract.title}
                    </h2>
                    <span className="font-mono text-xs font-bold text-zinc-900 shrink-0 bg-[#FAF9F6] px-2 py-0.5 rounded border border-[#E5E4DE]">
                      ${activeContract.totalBudget} USD
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 mt-1 line-clamp-2">{activeContract.objective}</p>

                  {/* Compact Buyer / Worker Agent Row */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] font-mono text-zinc-600">
                    <span className="px-2 py-0.5 rounded bg-[#FAF9F6] border border-[#E5E4DE]">
                      <strong className="text-zinc-900">Buyer:</strong> {activeContract.buyerName}
                    </span>
                    <span>→</span>
                    <span className="px-2 py-0.5 rounded bg-[#FAF9F6] border border-[#E5E4DE]">
                      <strong className="text-zinc-900">Worker:</strong> {activeContract.providerAgentName}
                    </span>
                  </div>

                  {/* Milestone Pills (if multiple milestones exist) */}
                  {activeMilestones.length > 1 && (
                    <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                      {activeMilestones.map((ms, idx) => {
                        const isSelectedMs = currentMilestone?.id === ms.id;
                        return (
                          <button
                            key={ms.id}
                            onClick={() => {
                              sound.playClick();
                              setSelectedMilestoneId(ms.id);
                            }}
                            className={`px-2.5 py-1 rounded-lg font-mono text-[10px] transition-all cursor-pointer border ${
                              isSelectedMs
                                ? 'bg-zinc-900 text-white border-zinc-900 font-bold'
                                : 'bg-[#FAF9F6] text-zinc-600 border-[#E5E4DE] hover:border-zinc-400'
                            }`}
                          >
                            M{idx + 1}: {ms.title.slice(0, 22)} (${ms.amount})
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Contractual Acceptance Rubric Box */}
                <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E5E4DE] text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
                      ACCEPTANCE RUBRIC ({currentMilestone?.title})
                    </span>
                    <span className="text-[10px] font-mono text-emerald-800 font-semibold">
                      PayPal Orders v2
                    </span>
                  </div>
                  {currentMilestone?.deliverableCriteria.map((crit, i) => (
                    <div key={i} className="flex items-start gap-2 text-zinc-800 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 mt-0.5 shrink-0" />
                      <span>{crit}</span>
                    </div>
                  ))}
                </div>

                {/* Worker Deliverable Input + 1-Click Judge Benchmark Presets */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-wider">
                      WORKER PROOF-OF-WORK PAYLOAD
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleInjectProof('pass')}
                        disabled={actionLoading}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-[10px] font-mono font-bold transition-all cursor-pointer"
                      >
                        🟢 Passing Proof (96%)
                      </button>
                      <button
                        onClick={() => handleInjectProof('fail')}
                        disabled={actionLoading}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-900 text-[10px] font-mono font-bold transition-all cursor-pointer"
                      >
                        🔴 Failing Proof (42%)
                      </button>
                    </div>
                  </div>

                  <textarea
                    value={draftProof}
                    onChange={(e) => setDraftProof(e.target.value)}
                    rows={4}
                    placeholder="Paste or edit the worker agent's proof-of-work deliverable..."
                    className="w-full p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E5E4DE] focus:border-zinc-900 focus:bg-white focus:outline-none font-sans text-xs sm:text-sm text-zinc-800 leading-relaxed resize-none transition-colors"
                  />
                </div>
              </div>

              {/* Bottom Full-Width Black Primary Action Button (Matches Reference UI) */}
              <div className="p-4 bg-[#FAF9F6] border-t border-[#E5E4DE]">
                <button
                  onClick={() => currentMilestone && handleExecutePrimaryFlow(currentMilestone)}
                  disabled={actionLoading}
                  className="w-full py-3.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all"
                >
                  <Sparkles className="h-4 w-4 text-amber-300 shrink-0" />
                  <span>
                    {actionLoading
                      ? 'Sealing Escrow & Running Gemini 3.5 Audit...'
                      : !isEscrowLocked
                      ? `Lock $${currentMilestone?.amount || 160} PayPal Escrow & Audit Proof →`
                      : `Audit Deliverable & Release $${currentMilestone?.amount || 160} PayPal Payout →`}
                  </span>
                </button>
              </div>
            </div>

            {/* ===================================================================
                RIGHT CARD: GEMINI 3.5 REDLINE DIFF & PAYPAL SETTLEMENT VOUCHER
               =================================================================== */}
            <div
              data-tour="right-audit-panel"
              className="lg:col-span-7 rounded-2xl bg-white border border-[#E5E4DE] shadow-2xs overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Top Card Header with View Toggle ([Redline Audit] | [PayPal Voucher]) */}
                <div className="px-5 sm:px-6 py-3.5 border-b border-[#E5E4DE] flex flex-wrap items-center justify-between gap-2 bg-[#FAF9F6]">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isAuditFailed ? 'bg-rose-600' : 'bg-emerald-600'
                      }`}
                    />
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-800">
                      GEMINI 3.5 AUDITOR &amp; SETTLEMENT
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* View Switcher: Redline Audit vs PayPal Voucher */}
                    <div className="flex items-center bg-[#EFECE6] p-0.5 rounded-lg border border-[#E5E4DE]">
                      <button
                        onClick={() => {
                          sound.playClick();
                          setRightPanelView('redline');
                        }}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-mono flex items-center gap-1 transition-all cursor-pointer ${
                          rightPanelView === 'redline'
                            ? 'bg-zinc-900 text-white font-bold shadow-2xs'
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        <FileSearch className="h-3 w-3" />
                        <span>Redline Diff</span>
                      </button>
                      <button
                        onClick={() => {
                          sound.playClick();
                          setRightPanelView('voucher');
                        }}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-mono flex items-center gap-1 transition-all cursor-pointer ${
                          rightPanelView === 'voucher'
                            ? 'bg-zinc-900 text-white font-bold shadow-2xs'
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        <Receipt className="h-3 w-3" />
                        <span>PayPal Voucher</span>
                      </button>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold border ${
                        isAuditFailed
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : isAuditPassed
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-white text-zinc-600 border-[#E5E4DE]'
                      }`}
                    >
                      SCORE: {currentMilestone?.verificationScore ?? 96}/100
                    </span>

                    <button
                      onClick={() => {
                        const textToCopy = currentMilestone?.submissionContent || draftProof;
                        if (textToCopy) {
                          navigator.clipboard.writeText(textToCopy);
                          setCopiedProof(true);
                          setTimeout(() => setCopiedProof(false), 1800);
                        }
                      }}
                      className="px-2 py-1 rounded-md bg-white hover:bg-zinc-100 border border-[#E5E4DE] text-zinc-700 text-[11px] font-mono flex items-center gap-1 cursor-pointer"
                    >
                      {copiedProof ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedProof ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* VIEW 1: GEMINI 3.5 REDLINE DIFF */}
                {rightPanelView === 'redline' ? (
                  <div className="p-5 sm:p-6 space-y-5">
                    <div className="p-5 rounded-xl bg-[#FCFBF9] border border-[#E5E4DE] leading-relaxed text-sm sm:text-base font-serif">
                      {isAuditFailed ? (
                        <div className="space-y-3">
                          <p className="text-rose-700/90 line-through decoration-rose-500/80 decoration-2">
                            {currentMilestone?.submissionContent || draftProof}
                          </p>
                          <div className="pt-1 flex flex-wrap items-center gap-2 font-sans">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                              <AlertTriangle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                              <span>Defective Proof — Missing Cryptographic Hashes &amp; Test Coverage</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono font-bold">
                              <Lock className="h-3 w-3" />
                              <span>PAYPAL ESCROW LOCKED — PAYOUT BLOCKED</span>
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-emerald-950 underline decoration-emerald-500/70 decoration-2 underline-offset-4">
                            {currentMilestone?.submissionContent || draftProof}
                          </p>
                          <div className="pt-1 flex flex-wrap items-center gap-2 font-sans">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                              <span>All Contractual Rubric Criteria Verified (AST &amp; Regression Suite)</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 text-white text-xs font-mono font-semibold">
                              <Zap className="h-3 w-3 text-emerald-400" />
                              <span>
                                {currentMilestone?.status === 'PAYOUT_COMPLETED'
                                  ? `PAYPAL PAYOUT DISBURSED ($${currentMilestone.amount})`
                                  : 'PAYPAL PAYOUTS v1 READY'}
                              </span>
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Redline Legend */}
                    <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-zinc-500">
                      <span className="uppercase font-bold text-zinc-400">REDLINE LEGEND:</span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-rose-500" />
                        <span className="line-through text-rose-700">Rejected / Defective Deliverable</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-600" />
                        <span className="underline decoration-emerald-600 text-emerald-800 font-semibold">
                          Verified Proof-of-Work Artifact
                        </span>
                      </span>
                    </div>

                    {/* Collapsible Tactical Debrief & PayPal Sandbox IDs */}
                    <div className="pt-3 border-t border-[#E5E4DE]">
                      <button
                        onClick={() => setIsDebriefOpen(!isDebriefOpen)}
                        className="w-full flex items-center justify-between text-left py-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-amber-500" />
                          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-700">
                            TACTICAL DEBRIEF &amp; PAYPAL SETTLEMENT TELEMETRY
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-zinc-500 flex items-center gap-1">
                          <span>{isDebriefOpen ? 'Hide' : 'Show'}</span>
                          {isDebriefOpen ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5" />
                          )}
                        </span>
                      </button>

                      {isDebriefOpen && (
                        <div className="mt-2.5 p-4 rounded-xl bg-[#FAF9F6] border border-[#E5E4DE] space-y-3 text-xs text-zinc-700 leading-relaxed">
                          <p className="font-medium text-zinc-900">
                            {currentMilestone?.verificationFeedback ||
                              'Gemini 3.5 Flash evaluates submitted agent artifacts against deterministic acceptance criteria before releasing PayPal Sandbox escrow.'}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#E5E4DE] font-mono text-[11px]">
                            <div>
                              <span className="text-[10px] text-zinc-400 block">PAYPAL ORDERS v2 ESCROW ID</span>
                              <span className="font-bold text-zinc-900">
                                {currentMilestone?.paypalOrderId || 'ORD-SANDBOX-88219A'}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-zinc-400 block">PAYPAL PAYOUTS v1 BATCH ID</span>
                              <span className="font-bold text-emerald-800">
                                {currentMilestone?.paypalPayoutBatchId ||
                                  (isAuditFailed ? 'BLOCKED_BY_AUDITOR' : 'PAYOUT-SANDBOX-9941B')}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* VIEW 2: TACTILE PAYPAL SETTLEMENT VOUCHER */
                  <div className="p-5 sm:p-6">
                    {currentMilestone && (
                      <PerforatedReceipt
                        milestone={currentMilestone}
                        index={Math.max(0, activeMilestones.findIndex((m) => m.id === currentMilestone.id))}
                        contractId={activeContract.id}
                        contractTitle={activeContract.title}
                        providerEmail={activeContract.providerEmail}
                        isLoading={actionLoading}
                        onFundEscrow={handleFundEscrow}
                        onSubmitWork={handleSubmitDeliverable}
                        onVerifyAndPayout={handleExecutePrimaryFlow}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Footer Bar inside Right Card */}
              <div className="p-4 bg-[#FAF9F6] border-t border-[#E5E4DE] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <button
                  onClick={() => {
                    sound.playClick();
                    setRightPanelView(rightPanelView === 'redline' ? 'voucher' : 'redline');
                  }}
                  className="text-zinc-800 font-bold hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <Receipt className="h-3.5 w-3.5 text-zinc-600" />
                  <span>
                    {rightPanelView === 'redline'
                      ? 'Inspect Perforated PayPal Receipt Voucher →'
                      : '← Return to Gemini 3.5 Redline Diff'}
                  </span>
                </button>

                <button
                  onClick={() => handleStageSelect(5)}
                  className="text-zinc-600 hover:text-zinc-900 flex items-center gap-1 cursor-pointer"
                >
                  <span>Open AG Grid Ledger</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
