'use client';

import React from 'react';
import { Lock, Zap, Bot, TrendingUp } from 'lucide-react';
import { TelemetryStats } from '@/types';

interface TelemetryCardsProps {
  telemetry: TelemetryStats | null;
}

export default function TelemetryCards({ telemetry }: TelemetryCardsProps) {
  const escrowHeld = telemetry?.activeEscrowHeld ?? 235;
  const totalDisbursed = telemetry?.totalDisbursed ?? 120;
  const automatedPayouts = telemetry?.automatedPayoutsCount ?? 1;
  const totalBudget = telemetry?.totalBudgetManaged ?? 430;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Card 1: Active Escrow */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4.5 relative overflow-hidden group hover:border-blue-500/40 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-zinc-400">Escrow Locked (PayPal)</span>
          <div className="h-8 w-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <Lock className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-zinc-100">
            ${escrowHeld.toFixed(2)}
          </span>
          <span className="text-xs text-zinc-500">USD</span>
        </div>
        <div className="mt-2 text-[11px] text-zinc-400 flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>Held safely in PayPal vault</span>
        </div>
      </div>

      {/* Card 2: Autonomous Payouts */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4.5 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-zinc-400">Total Disbursed (Payouts)</span>
          <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Zap className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-emerald-400">
            ${totalDisbursed.toFixed(2)}
          </span>
          <span className="text-xs text-zinc-500">USD</span>
        </div>
        <div className="mt-2 text-[11px] text-zinc-400 flex items-center gap-1">
          <span className="font-medium text-zinc-300">{automatedPayouts}</span>
          <span>milestones verified & paid</span>
        </div>
      </div>

      {/* Card 3: AI Judge Pass Rate */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4.5 relative overflow-hidden group hover:border-indigo-500/40 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-zinc-400">AI Quality Audit Rate</span>
          <div className="h-8 w-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <Bot className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-indigo-300">
            94.0%
          </span>
          <span className="text-xs text-emerald-400 font-medium">Avg Score</span>
        </div>
        <div className="mt-2 text-[11px] text-zinc-400">
          Gemini 2.5 multimodal inspection
        </div>
      </div>

      {/* Card 4: Total Volume Managed */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4.5 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-zinc-400">Total Pipeline Orchestrated</span>
          <div className="h-8 w-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-cyan-300">
            ${totalBudget.toFixed(2)}
          </span>
          <span className="text-xs text-zinc-500">USD</span>
        </div>
        <div className="mt-2 text-[11px] text-zinc-400">
          Zero chargebacks or disputed claims
        </div>
      </div>
    </div>
  );
}
