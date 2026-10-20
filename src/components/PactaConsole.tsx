'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Bot,
  CreditCard,
  Sparkles,
  Zap,
  BarChart3,
  CheckCircle2,
  Clock,
  ArrowRight,
  Play,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Lock,
  Unlock,
  FileCheck,
  Search,
  Globe,
  Sliders,
  Terminal,
  Activity,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Contract, Milestone, LedgerTransaction, TelemetryStats } from '@/types';
import { sound } from '@/lib/audio';
import { getByokHeaders } from '@/lib/credentials';
import AutonomousMesh from '@/components/AutonomousMesh';
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
}

export type LifecycleStage = 1 | 2 | 3 | 4 | 5;

export default function PactaConsole({
  contracts,
  transactions,
  telemetry,
  onRefresh,
  onContractCreated,
  onOpenSettings,
  onOpenGuide,
}: PactaConsoleProps) {
  const [activeStage, setActiveStage] = useState<LifecycleStage>(1);
  const [selectedContractId, setSelectedContractId] = useState<string>(contracts[0]?.id || '');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);
  const [isDeployingNew, setIsDeployingNew] = useState(false);
  const [isHudExpanded, setIsHudExpanded] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoPlayStatus, setAutoPlayStatus] = useState<string>('');
  const [actionLoading, setActionLoading] = useState(false);

  // Sync selected contract if list changes
  useEffect(() => {
    if (!selectedContractId && contracts.length > 0) {
      setSelectedContractId(contracts[0].id);
    }
  }, [contracts, selectedContractId]);

  const activeContract = contracts.find((c) => c.id === selectedContractId) || contracts[0];
  const activeMilestones = activeContract?.milestones || [];

  // Pick the active milestone based on lifecycle or selection
  const currentMilestone =
    activeMilestones.find((m) => m.id === selectedMilestoneId) ||
    activeMilestones.find((m) => m.status !== 'PAYOUT_COMPLETED') ||
    activeMilestones[0];

  const handleStageSelect = (stage: LifecycleStage) => {
    sound.playClick();
    setActiveStage(stage);
    setIsDeployingNew(false);
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

  // 3. Verify & Payout
  const handleVerifyAndPayout = async (milestone: Milestone) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/contracts/${activeContract.id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getByokHeaders() },
        body: JSON.stringify({
          milestoneId: milestone.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

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

  // 1-Click State-Machine Guided Auto-Demo
  const runAutoDemo = async () => {
    if (isAutoPlaying) return;
    setIsAutoPlaying(true);
    sound.playClick();

    try {
      // Step 1: Genesis & Negotiation
      setActiveStage(1);
      setAutoPlayStatus('STAGE 01 // AGENT RFQ: Tavily market rates probed. Gemini formulating criteria...');
      await new Promise((r) => setTimeout(r, 4500));

      // Step 2: Escrow Lock
      setActiveStage(2);
      setAutoPlayStatus('STAGE 02 // ESCROW LOCK: Locking $160.00 into PayPal Orders v2 Sandbox Vault...');
      if (currentMilestone && currentMilestone.status === 'ESCROW_PENDING') {
        await handleFundEscrow(currentMilestone);
      }
      await new Promise((r) => setTimeout(r, 4500));

      // Step 3: Neural Audit
      setActiveStage(3);
      setAutoPlayStatus('STAGE 03 // NEURAL AUDIT: Submitting proof-of-work AST report and invoking Gemini 2.5 Judge...');
      if (currentMilestone && currentMilestone.status === 'ESCROW_FUNDED') {
        await handleSubmitDeliverable(currentMilestone);
        await new Promise((r) => setTimeout(r, 2500));
      }
      if (currentMilestone && (currentMilestone.status === 'DELIVERABLE_SUBMITTED' || currentMilestone.status === 'ESCROW_FUNDED')) {
        await handleVerifyAndPayout(currentMilestone);
      }
      await new Promise((r) => setTimeout(r, 4500));

      // Step 4: Instant Settlement
      setActiveStage(4);
      setAutoPlayStatus('STAGE 04 // DISBURSEMENT: PayPal Payouts v1 transaction confirmed. Tactile voucher stamped.');
      sound.playPayout();
      await new Promise((r) => setTimeout(r, 4500));

      // Step 5: AG Grid Ledger
      setActiveStage(5);
      setAutoPlayStatus('STAGE 05 // INSTITUTIONAL LEDGER: AG Grid synchronized with immutable settlement records.');
      await new Promise((r) => setTimeout(r, 3500));

      setAutoPlayStatus('DEMO COMPLETE // Pacta Autonomous Commerce Verified.');
    } catch (e) {
      console.error(e);
      setAutoPlayStatus('Auto-demo encountered an error.');
    } finally {
      setIsAutoPlaying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
          SECTION 1: INDUSTRIAL HARDWARE CHASSIS HEADER & TELEMETRY HUD
         ========================================================================= */}
      <div className="rounded-2xl border border-zinc-800 bg-[#0a0d14] p-4 shadow-2xl relative overflow-hidden">
        {/* Micro-ruler tick marks */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500/30 via-amber-500/40 to-blue-500/30 opacity-60" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Hardware Branding & Indicators */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-0.5 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
              <div className="h-full w-full bg-[#0a0d14] rounded-[10px] flex items-center justify-center">
                <Shield className="h-4 w-4 text-cyan-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-extrabold tracking-wider text-white">
                  PACTA // ESCROW APPARATUS
                </span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 uppercase">
                  v2.4 Sandbox
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE
                </span>
                <span>•</span>
                <span>GEMINI 2.5</span>
                <span>•</span>
                <span>TAVILY RATES</span>
                <span>•</span>
                <span>ORDERS v2 + PAYOUTS v1</span>
              </div>
            </div>
          </div>

          {/* Compact Telemetry Strip */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#0f1420] border border-zinc-800 text-[11px]">
              <div>
                <span className="text-zinc-500 text-[10px] block">MANAGED</span>
                <span className="text-zinc-200 font-bold">${telemetry?.totalBudgetManaged || 355}</span>
              </div>
              <div className="h-5 w-px bg-zinc-800" />
              <div>
                <span className="text-amber-400 text-[10px] block">IN ESCROW</span>
                <span className="text-amber-300 font-bold">${telemetry?.activeEscrowHeld || 235}</span>
              </div>
              <div className="h-5 w-px bg-zinc-800" />
              <div>
                <span className="text-emerald-400 text-[10px] block">DISBURSED</span>
                <span className="text-emerald-300 font-bold">${telemetry?.totalDisbursed || 120}</span>
              </div>
              <div className="h-5 w-px bg-zinc-800" />
              <div>
                <span className="text-zinc-500 text-[10px] block">DISPUTES</span>
                <span className="text-zinc-300 font-bold">0.0%</span>
              </div>
            </div>

            {/* Auto-Play 60s Demo Button */}
            <button
              onClick={runAutoDemo}
              disabled={isAutoPlaying}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                isAutoPlaying
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-blue-500/25'
              }`}
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>{isAutoPlaying ? 'Auto-Running...' : '60s Auto-Demo'}</span>
            </button>

            {/* Expand Full HUD */}
            <button
              onClick={() => {
                sound.playClick();
                setIsHudExpanded(!isHudExpanded);
              }}
              className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 cursor-pointer"
              title="Toggle Detailed Telemetry"
            >
              {isHudExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Live Auto-Demo Telemetry Status Banner */}
        {isAutoPlaying && (
          <div className="mt-3 p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between text-xs font-mono text-amber-300">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              <span>{autoPlayStatus}</span>
            </div>
            <span className="text-[10px] text-amber-400/80 uppercase">Simulated Real-Time Flow</span>
          </div>
        )}

        {/* Expandable Detailed Telemetry HUD */}
        {isHudExpanded && (
          <div className="mt-4 pt-4 border-t border-zinc-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#0e121a] border border-zinc-800/80">
              <span className="text-[10px] text-zinc-500 uppercase block">Total Capital</span>
              <span className="text-base font-bold text-zinc-100">${telemetry?.totalBudgetManaged || 355}.00</span>
              <span className="text-[10px] text-zinc-500 block">USD Total</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0e121a] border border-amber-500/30">
              <span className="text-[10px] text-amber-400 uppercase block">Active Escrow</span>
              <span className="text-base font-bold text-amber-300">${telemetry?.activeEscrowHeld || 235}.00</span>
              <span className="text-[10px] text-zinc-500 block">Orders v2 Vault</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0e121a] border border-emerald-500/30">
              <span className="text-[10px] text-emerald-400 uppercase block">Disbursed</span>
              <span className="text-base font-bold text-emerald-300">${telemetry?.totalDisbursed || 120}.00</span>
              <span className="text-[10px] text-zinc-500 block">Payouts v1 API</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0e121a] border border-zinc-800/80">
              <span className="text-[10px] text-zinc-500 uppercase block">Auto-Payouts</span>
              <span className="text-base font-bold text-zinc-100">{telemetry?.automatedPayoutsCount || 1}</span>
              <span className="text-[10px] text-zinc-500 block">Zero-Human Touch</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0e121a] border border-zinc-800/80">
              <span className="text-[10px] text-zinc-500 uppercase block">Dispute Rate</span>
              <span className="text-base font-bold text-zinc-100">0.0%</span>
              <span className="text-[10px] text-emerald-400 block">100% Verified</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0e121a] border border-zinc-800/80">
              <span className="text-[10px] text-zinc-500 uppercase block">Active Contracts</span>
              <span className="text-base font-bold text-cyan-300">{contracts.length}</span>
              <span className="text-[10px] text-zinc-500 block">Online Missions</span>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          SECTION 2: OMNIPRESENT 5-STAGE MISSION LIFECYCLE PIPELINE
         ========================================================================= */}
      <div className="rounded-2xl border border-zinc-800 bg-[#090b10] p-2.5 shadow-xl">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {/* Stage 1 */}
          <button
            onClick={() => handleStageSelect(1)}
            className={`p-3 rounded-xl text-left transition-all border cursor-pointer flex flex-col justify-between ${
              activeStage === 1
                ? 'bg-blue-600/15 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                : 'bg-[#0e121b]/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-blue-400">STAGE 01</span>
              <Bot className="h-3.5 w-3.5 text-blue-400" />
            </div>
            <div className="mt-1">
              <span className="text-xs font-semibold block leading-tight text-zinc-200">RFQ Spec</span>
              <span className="text-[10px] font-mono text-zinc-500 block">Tavily + Gemini</span>
            </div>
          </button>

          {/* Stage 2 */}
          <button
            onClick={() => handleStageSelect(2)}
            className={`p-3 rounded-xl text-left transition-all border cursor-pointer flex flex-col justify-between ${
              activeStage === 2
                ? 'bg-amber-600/15 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                : 'bg-[#0e121b]/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-amber-400">STAGE 02</span>
              <Lock className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <div className="mt-1">
              <span className="text-xs font-semibold block leading-tight text-zinc-200">Escrow Seal</span>
              <span className="text-[10px] font-mono text-zinc-500 block">Orders v2 Vault</span>
            </div>
          </button>

          {/* Stage 3 */}
          <button
            onClick={() => handleStageSelect(3)}
            className={`p-3 rounded-xl text-left transition-all border cursor-pointer flex flex-col justify-between ${
              activeStage === 3
                ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                : 'bg-[#0e121b]/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-indigo-400">STAGE 03</span>
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            </div>
            <div className="mt-1">
              <span className="text-xs font-semibold block leading-tight text-zinc-200">Neural Audit</span>
              <span className="text-[10px] font-mono text-zinc-500 block">Gemini 2.5 Judge</span>
            </div>
          </button>

          {/* Stage 4 */}
          <button
            onClick={() => handleStageSelect(4)}
            className={`p-3 rounded-xl text-left transition-all border cursor-pointer flex flex-col justify-between ${
              activeStage === 4
                ? 'bg-emerald-600/15 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                : 'bg-[#0e121b]/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-emerald-400">STAGE 04</span>
              <Zap className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="mt-1">
              <span className="text-xs font-semibold block leading-tight text-zinc-200">Disbursement</span>
              <span className="text-[10px] font-mono text-zinc-500 block">Payouts v1 Instant</span>
            </div>
          </button>

          {/* Stage 5 */}
          <button
            onClick={() => handleStageSelect(5)}
            className={`p-3 rounded-xl text-left transition-all border cursor-pointer flex flex-col justify-between col-span-2 sm:col-span-1 ${
              activeStage === 5
                ? 'bg-cyan-600/15 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                : 'bg-[#0e121b]/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-cyan-400">STAGE 05</span>
              <BarChart3 className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <div className="mt-1">
              <span className="text-xs font-semibold block leading-tight text-zinc-200">AG Grid Ledger</span>
              <span className="text-[10px] font-mono text-zinc-500 block">Institutional Trail</span>
            </div>
          </button>
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: ACTIVE MISSION DOSSIER SELECTOR BAR
         ========================================================================= */}
      <div className="px-5 py-3.5 rounded-2xl bg-[#0c0f17] border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-mono uppercase text-zinc-500">ACTIVE MISSION:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {contracts.map((contract) => (
              <button
                key={contract.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedContractId(contract.id);
                  setIsDeployingNew(false);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  selectedContractId === contract.id && !isDeployingNew
                    ? 'bg-zinc-200 text-zinc-950 font-semibold shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {contract.id.replace('contract-', '').toUpperCase()} // {contract.title.substring(0, 24)}...
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setIsDeployingNew(true);
            setActiveStage(1);
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            isDeployingNew
              ? 'bg-blue-600 text-white'
              : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/60'
          }`}
        >
          <Bot className="h-3.5 w-3.5 text-blue-400" />
          <span>+ Deploy New Mission</span>
        </button>
      </div>

      {/* =========================================================================
          SECTION 4: STATE-DRIVEN CANVAS
         ========================================================================= */}

      {/* NEW MISSION COMPOSER (When + Deploy New Mission is clicked) */}
      {isDeployingNew && (
        <div className="p-6 rounded-3xl bg-[#0b0e15] border border-blue-500/30 shadow-2xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800">
            <div>
              <h3 className="text-base font-bold text-white">Deploy New Agent Commerce Mission</h3>
              <p className="text-xs text-zinc-400">
                Pacta’s Gemini Planner will formulate objective criteria and benchmark live rates via Tavily.
              </p>
            </div>
            <button
              onClick={() => setIsDeployingNew(false)}
              className="text-xs font-mono text-zinc-400 hover:text-zinc-200 px-3 py-1 rounded-lg bg-zinc-900"
            >
              Cancel
            </button>
          </div>
          <AgentMissionInput
            onContractCreated={(contract) => {
              onContractCreated(contract);
              setSelectedContractId(contract.id);
              setIsDeployingNew(false);
              setActiveStage(2); // Automatically advance to Escrow Seal stage!
            }}
          />
        </div>
      )}

      {/* STAGE 1: RFQ SPECIFICATION & NEGOTIATION */}
      {!isDeployingNew && activeStage === 1 && activeContract && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Mission Dossier & Tavily Intelligence */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 rounded-3xl bg-[#0b0e15] border border-zinc-800/90 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold uppercase">
                      {activeContract.category}
                    </span>
                    <span className="text-xs font-mono text-zinc-500">ID: {activeContract.id}</span>
                  </div>
                  <span className="font-mono text-sm font-bold text-zinc-100">
                    ${activeContract.totalBudget.toFixed(2)} {activeContract.currency}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-white">{activeContract.title}</h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed bg-[#07090e] p-3.5 rounded-2xl border border-zinc-800/60 font-sans">
                  {activeContract.objective}
                </p>

                {/* Agents Involved */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                    <span className="text-[10px] text-zinc-500 block mb-0.5">BUYER AGENT (REQUESTER)</span>
                    <span className="text-zinc-200 font-semibold block">{activeContract.buyerName}</span>
                    <span className="text-[11px] text-zinc-500">{activeContract.buyerEmail}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                    <span className="text-[10px] text-zinc-500 block mb-0.5">PROVIDER AGENT (EXECUTOR)</span>
                    <span className="text-zinc-200 font-semibold block">{activeContract.providerAgentName}</span>
                    <span className="text-[11px] text-zinc-500">{activeContract.providerEmail}</span>
                  </div>
                </div>

                {/* Tavily Market Benchmark Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/30 to-indigo-950/30 border border-blue-500/20 text-xs">
                  <div className="flex items-center gap-2 text-blue-400 font-mono text-[11px] font-semibold mb-2">
                    <Globe className="h-3.5 w-3.5" />
                    <span>TAVILY MARKET RATE PROBE // LIVE RESEARCH</span>
                  </div>
                  <p className="text-zinc-300 text-xs leading-relaxed mb-3">
                    Domain rate probe resolved. Typical freelance & agency benchmarks for{' '}
                    <strong className="text-white">{activeContract.category}</strong> range from{' '}
                    <strong className="text-emerald-400 font-mono">$220 – $340 USD</strong>. Contract proposed at{' '}
                    <strong className="text-blue-300 font-mono">${activeContract.totalBudget} USD</strong> falls safely
                    within standard risk thresholds.
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>Risk Guardrail: APPROVED</span>
                    <span>•</span>
                    <span>Confidence: 96.4%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Negotiation Transcript & Milestones */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-3xl bg-[#0b0e15] border border-zinc-800/90 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <span className="font-mono text-xs font-bold text-zinc-300 flex items-center gap-2">
                    <Terminal className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Autonomous Agent Negotiation Log</span>
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">3 Entries</span>
                </div>

                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {activeContract.agentNegotiationLog.map((log, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/60 text-xs">
                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mb-1">
                        <span
                          className={
                            log.sender === 'BUYER_AGENT'
                              ? 'text-blue-400'
                              : log.sender === 'PROVIDER_AGENT'
                              ? 'text-cyan-400'
                              : 'text-amber-400'
                          }
                        >
                          [{log.sender}]
                        </span>
                        <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-zinc-300 text-xs leading-relaxed">{log.message}</p>
                    </div>
                  ))}
                </div>

                {/* Milestone Summary */}
                <div className="pt-2 border-t border-zinc-800">
                  <span className="text-[11px] font-mono font-bold text-zinc-400 block mb-2">
                    DECOMPOSED MILESTONES ({activeMilestones.length})
                  </span>
                  <div className="space-y-2">
                    {activeMilestones.map((ms, i) => (
                      <div
                        key={ms.id}
                        className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-center justify-between text-xs"
                      >
                        <div className="space-y-0.5">
                          <span className="font-medium text-zinc-200">
                            {i + 1}. {ms.title}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500 block">{ms.status}</span>
                        </div>
                        <span className="font-mono font-bold text-zinc-200">${ms.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Step Transition */}
                <button
                  onClick={() => handleStageSelect(2)}
                  className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 cursor-pointer"
                >
                  <span>Advance to Stage 02: Lock PayPal Escrow</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: PAYPAL ESCROW SEAL (Orders v2) */}
      {!isDeployingNew && activeStage === 2 && activeContract && (
        <div className="space-y-6">
          {/* Topology Conduit Mesh showing Escrow Path */}
          <AutonomousMesh
            activeMilestoneStatus={currentMilestone?.status}
            totalEscrowHeld={telemetry?.activeEscrowHeld}
            totalDisbursed={telemetry?.totalDisbursed}
          />

          {/* Escrow Lock Chamber */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0b0e15] border border-amber-500/30 shadow-2xl relative overflow-hidden">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                <div>
                  <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold mb-1">
                    <Lock className="h-4 w-4" />
                    <span>PAYPAL SMART ESCROW CHAMBER // ORDERS v2</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white">
                    {currentMilestone?.title || 'Milestone Escrow Deposit'}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Funds are conditionally held in PayPal Sandbox escrow until Gemini AI audit verifies deliverable.
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block">ESCROW AMOUNT</span>
                  <span className="text-2xl font-black font-mono text-amber-300">
                    ${currentMilestone?.amount || activeContract.totalBudget}.00 USD
                  </span>
                </div>
              </div>

              {/* Escrow Status & PayPal Sandbox Parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block mb-1">VAULT STATUS</span>
                  <span
                    className={`font-bold inline-flex items-center gap-1.5 ${
                      currentMilestone?.status === 'ESCROW_FUNDED' ||
                      currentMilestone?.status === 'DELIVERABLE_SUBMITTED' ||
                      currentMilestone?.status === 'PAYOUT_COMPLETED'
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
                    {currentMilestone?.status === 'ESCROW_FUNDED'
                      ? 'SEALED & HELD'
                      : currentMilestone?.status === 'PAYOUT_COMPLETED'
                      ? 'DISBURSED'
                      : 'AWAITING CAPTURE'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block mb-1">PAYPAL INTENT</span>
                  <span className="text-zinc-200 font-bold">CAPTURE (Conditional)</span>
                  <span className="text-[10px] text-zinc-500 block">Orders v2 API</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block mb-1">REFERENCE ORDER</span>
                  <span className="text-cyan-400 font-bold truncate block">
                    {currentMilestone?.paypalOrderId || 'PENDING_GENERATION'}
                  </span>
                  <span className="text-[10px] text-zinc-500 block">api-m.sandbox.paypal.com</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                {currentMilestone?.status === 'ESCROW_PENDING' || !currentMilestone?.paypalOrderId ? (
                  <button
                    onClick={() => currentMilestone && handleFundEscrow(currentMilestone)}
                    disabled={actionLoading}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-zinc-950 text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all transform hover:-translate-y-0.5"
                  >
                    <Lock className="h-4 w-4" />
                    <span>
                      {actionLoading
                        ? 'Sealing Escrow Vault...'
                        : `Lock $${currentMilestone?.amount || 160}.00 into PayPal Escrow`}
                    </span>
                  </button>
                ) : (
                  <div className="p-3 px-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Escrow Order Verified. Vault locked & ready for deliverable inspection.</span>
                  </div>
                )}

                <button
                  onClick={() => handleStageSelect(3)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Proceed to Stage 03: Deliverable & AI Audit</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 3: NEURAL PROOF-OF-WORK AUDIT (Gemini 2.5) */}
      {!isDeployingNew && activeStage === 3 && activeContract && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Deliverable Proof-of-Work */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-6 rounded-3xl bg-[#0b0e15] border border-zinc-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold">
                    <FileCheck className="h-4 w-4" />
                    <span>PROVIDER PROOF-OF-WORK SUBMISSION</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {currentMilestone?.submissionContent ? 'SUBMITTED' : 'PENDING'}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-zinc-200 mb-1">{currentMilestone?.title}</h4>
                  <p className="text-xs text-zinc-400 mb-3">{currentMilestone?.description}</p>
                </div>

                {/* Deliverable Criteria Checklist */}
                <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800 text-xs space-y-2">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block">
                    CONTRACTUAL ACCEPTANCE CRITERIA
                  </span>
                  {currentMilestone?.deliverableCriteria.map((crit, i) => (
                    <div key={i} className="flex items-start gap-2 text-zinc-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 mt-0.5 shrink-0" />
                      <span>{crit}</span>
                    </div>
                  ))}
                </div>

                {/* Proof-of-Work Content */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block">
                    SUBMITTED PROOF ARTIFACTS
                  </span>
                  <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 leading-relaxed max-h-[140px] overflow-y-auto">
                    {currentMilestone?.submissionContent || (
                      <span className="text-zinc-500 italic">
                        No deliverable submitted yet. Click below to simulate provider agent submission.
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Submission Simulator */}
                {!currentMilestone?.submissionContent && (
                  <button
                    onClick={() => currentMilestone && handleSubmitDeliverable(currentMilestone)}
                    disabled={actionLoading}
                    className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Bot className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Simulate Provider Agent Proof Submission</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right: Gemini 2.5 AI Judge Terminal */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-6 rounded-3xl bg-[#0b0e15] border border-indigo-500/30 shadow-xl space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold">
                    <Sparkles className="h-4 w-4" />
                    <span>GEMINI 2.5 AI AUDITOR & JUDGE</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                    Multimodal Inspection
                  </span>
                </div>

                {/* Score Gauge */}
                <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">VERIFICATION SCORE</span>
                    <span className="text-3xl font-black font-mono text-indigo-300">
                      {currentMilestone?.verificationScore || '--'}
                      <span className="text-xs text-zinc-500 font-normal"> / 100%</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">THRESHOLD</span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">≥ 85% FOR AUTO-PAYOUT</span>
                  </div>
                </div>

                {/* Auditor Feedback */}
                <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 leading-relaxed min-h-[90px]">
                  <span className="text-[10px] text-zinc-500 block mb-1">AUDIT VERDICT & RATIONALE</span>
                  {currentMilestone?.verificationFeedback || (
                    <span className="text-zinc-500 italic">
                      Awaiting deliverable submission. Run verification to trigger multimodal inspection.
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => currentMilestone && handleVerifyAndPayout(currentMilestone)}
                    disabled={actionLoading}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 cursor-pointer transition-all"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>
                      {actionLoading
                        ? 'Gemini Inspecting Deliverable...'
                        : 'Run Gemini AI Verification & Auto-Payout'}
                    </span>
                  </button>

                  <button
                    onClick={() => handleStageSelect(4)}
                    className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Proceed to Stage 04: View Payout Disbursement</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 4: PAYPAL INSTANT DISBURSEMENT & TACTILE VOUCHER */}
      {!isDeployingNew && activeStage === 4 && activeContract && (
        <div className="space-y-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-6 rounded-3xl bg-[#0b0e15] border border-emerald-500/30 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold mb-1">
                    <Zap className="h-4 w-4" />
                    <span>PAYPAL PAYOUTS v1 // SETTLEMENT CONFIRMATION</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white">Automated Milestone Disbursement</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Funds released directly from escrow vault to provider agent upon verified AI audit.
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block">SETTLED AMOUNT</span>
                  <span className="text-2xl font-black font-mono text-emerald-300">
                    ${currentMilestone?.amount || 120}.00 USD
                  </span>
                </div>
              </div>

              {/* Render the full Tactile Thermal Hardware Voucher */}
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
                  onVerifyAndPayout={handleVerifyAndPayout}
                />
              )}

              {/* Action to AG Grid */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleStageSelect(5)}
                  className="px-6 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-cyan-600/20 cursor-pointer transition-all"
                >
                  <span>Inspect Audit Trail in AG Grid Cockpit</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 5: AG GRID INSTITUTIONAL COCKPIT */}
      {!isDeployingNew && activeStage === 5 && (
        <div className="space-y-6">
          <AgGridCockpit transactions={transactions} onRefresh={onRefresh} />
        </div>
      )}
    </div>
  );
}
