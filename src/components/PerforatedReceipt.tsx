'use client';

import React from 'react';
import {
  Lock,
  CheckCircle2,
  Clock,
  Sparkles,
  Bot,
  CreditCard,
  FileCheck,
  Zap,
  ExternalLink,
  Loader2,
  ShieldAlert,
} from 'lucide-react';
import { Milestone } from '@/types';
import { sound } from '@/lib/audio';

interface PerforatedReceiptProps {
  milestone: Milestone;
  index: number;
  contractId: string;
  contractTitle: string;
  providerEmail: string;
  isLoading: boolean;
  onFundEscrow: (milestone: Milestone) => void;
  onSubmitWork: (milestone: Milestone) => void;
  onVerifyAndPayout: (milestone: Milestone) => void;
}

export default function PerforatedReceipt({
  milestone,
  index,
  contractId,
  contractTitle,
  providerEmail,
  isLoading,
  onFundEscrow,
  onSubmitWork,
  onVerifyAndPayout,
}: PerforatedReceiptProps) {
  const isPaid = milestone.status === 'PAYOUT_COMPLETED';
  const isEscrowed = milestone.status === 'ESCROW_FUNDED';
  const isSubmitted = milestone.status === 'DELIVERABLE_SUBMITTED';
  const isPending = milestone.status === 'ESCROW_PENDING' || milestone.status === 'PROPOSED';
  const isDisputed = milestone.status === 'DISPUTED';

  // Calculate 10-bar analog LED gauge for verification score
  const score = milestone.verificationScore ?? 0;
  const activeBars = Math.round(score / 10);

  return (
    <div className="relative group select-none">
      {/* Tactile Hardware Perforated Receipt Card */}
      <div className="relative bg-[#0d0f15] border-x border-zinc-800 shadow-2xl p-6 sm:p-7 overflow-hidden transition-all duration-300 hover:border-zinc-700/80">
        {/* Top Perforated Dashed Tear Edge */}
        <div className="absolute top-0 left-0 right-0 h-1.5 border-t-2 border-dashed border-zinc-700/80 bg-zinc-950/90" />
        {/* Left/Right Receipt Cutout Notches */}
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#07090e] border border-zinc-800 shadow-inner" />
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#07090e] border border-zinc-800 shadow-inner" />
        {/* Bottom Perforated Dashed Tear Edge */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 border-b-2 border-dashed border-zinc-700/80 bg-zinc-950/90" />

        {/* Diagonal Ink Stamp Overlay when Paid */}
        {isPaid && (
          <div className="absolute right-4 sm:right-8 top-10 sm:top-8 pointer-events-none z-20 transform -rotate-12 animate-in fade-in zoom-in-75 duration-300">
            <div className="border-4 border-dashed border-emerald-500/90 px-4 py-1.5 rounded-xl bg-emerald-950/40 backdrop-blur-xs text-center shadow-2xl shadow-emerald-500/20">
              <span className="block font-mono font-black text-xs sm:text-sm tracking-widest text-emerald-400 uppercase">
                PAID & DISBURSED
              </span>
              <span className="block font-mono text-[9px] text-emerald-300 tracking-wider">
                PAYPAL PAYOUTS // VERIFIED
              </span>
            </div>
          </div>
        )}

        {/* Receipt Header & Technical Serial */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-zinc-800/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-zinc-500 tracking-wider uppercase">
              VOUCHER #{contractId.slice(-4).toUpperCase()}-{String(index + 1).padStart(2, '0')}
            </span>
            <span className="text-zinc-600">|</span>
            <span className="font-mono text-[10px] text-cyan-400">ESCROW DEPOSIT SLIP</span>
          </div>

          {/* Hardware Phosphor Status LEDs */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-mono text-[10px]">
              <span
                className={`h-2 w-2 rounded-full transition-all ${
                  isPaid
                    ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                    : isEscrowed || isSubmitted
                    ? 'bg-blue-400 shadow-[0_0_8px_#60a5fa]'
                    : isPending
                    ? 'bg-amber-400 shadow-[0_0_6px_#fbbf24]'
                    : 'bg-zinc-700'
                }`}
              />
              <span
                className={`font-semibold ${
                  isPaid
                    ? 'text-emerald-400'
                    : isEscrowed || isSubmitted
                    ? 'text-blue-400'
                    : 'text-amber-400'
                }`}
              >
                {isPaid
                  ? 'SETTLED'
                  : isSubmitted
                  ? 'AUDIT_PENDING'
                  : isEscrowed
                  ? 'ESCROW_LOCKED'
                  : 'AWAITING_FUNDS'}
              </span>
            </div>
          </div>
        </div>

        {/* Milestone Title & Amount */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            <div className="h-7 w-7 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              0{index + 1}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-100 tracking-tight">{milestone.title}</h4>
              <p className="text-xs text-zinc-400 mt-0.5">{milestone.description}</p>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono block">Milestone Amount</span>
            <span className="text-base sm:text-lg font-mono font-bold text-zinc-100">
              ${milestone.amount.toFixed(2)}{' '}
              <span className="text-xs font-normal text-zinc-500">{milestone.currency}</span>
            </span>
          </div>
        </div>

        {/* Contractual Acceptance Criteria */}
        <div className="my-3.5 p-3 rounded-xl bg-zinc-950/70 border border-zinc-900 text-xs space-y-1.5">
          <span className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
            Automated Audit Rubric Specifications:
          </span>
          <ul className="space-y-1">
            {milestone.deliverableCriteria.map((criterion, idx) => (
              <li key={idx} className="flex items-start gap-2 text-zinc-300 text-xs">
                <span className="text-cyan-400 font-mono text-[10px] mt-0.5">[{idx + 1}]</span>
                <span>{criterion}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Submitted Proof-of-Work Snippet (if available) */}
        {milestone.submissionContent && (
          <div className="my-3 p-3 rounded-xl bg-zinc-950/80 border border-purple-500/20 text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-purple-400 font-mono text-[10px] font-semibold">
              <FileCheck className="h-3 w-3" />
              <span>DELIVERABLE_PROOF_SUBMITTED:</span>
            </div>
            <p className="font-mono text-[11px] text-zinc-300 line-clamp-2">{milestone.submissionContent}</p>
          </div>
        )}

        {/* Analog LED Meter for Gemini AI Judge Verification Score */}
        {milestone.verificationScore !== undefined && (
          <div className="my-3.5 p-3.5 rounded-xl bg-zinc-950/90 border border-emerald-500/30 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" />
                Gemini 2.5 Verification Audit Meter:
              </span>
              <span className="font-mono font-bold text-xs text-emerald-300">
                {milestone.verificationScore} / 100
              </span>
            </div>

            {/* 10-Segment Analog Hardware Bar */}
            <div className="grid grid-cols-10 gap-1.5 h-2 w-full">
              {Array.from({ length: 10 }).map((_, barIdx) => {
                const isLit = barIdx < activeBars;
                return (
                  <div
                    key={barIdx}
                    className={`rounded-xs transition-all duration-300 ${
                      isLit
                        ? barIdx > 7
                          ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]'
                          : 'bg-emerald-500 shadow-[0_0_4px_#10b981]'
                        : 'bg-zinc-800/80'
                    }`}
                  />
                );
              })}
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans pt-0.5">
              {milestone.verificationFeedback}
            </p>

            {milestone.paypalPayoutBatchId && (
              <div className="flex items-center gap-2 pt-1 font-mono text-[10px] text-zinc-500 border-t border-zinc-900">
                <span>PayPal Batch:</span>
                <span className="text-emerald-400 select-all font-semibold">{milestone.paypalPayoutBatchId}</span>
              </div>
            )}
          </div>
        )}

        {/* Action Controls Deck */}
        <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="font-mono text-[10px] text-zinc-500">
            PAYEE: <span className="text-zinc-300">{providerEmail}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Action 1: Fund Escrow */}
            {isPending && (
              <button
                onClick={() => {
                  sound.playClick();
                  onFundEscrow(milestone);
                }}
                disabled={isLoading}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CreditCard className="h-3.5 w-3.5" />}
                <span>Fund Escrow via PayPal (${milestone.amount})</span>
              </button>
            )}

            {/* Action 2: Simulate Agent Work Submission */}
            {isEscrowed && (
              <button
                onClick={() => {
                  sound.playClick();
                  onSubmitWork(milestone);
                }}
                disabled={isLoading}
                className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-semibold flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                <FileCheck className="h-3.5 w-3.5" />
                <span>Simulate Agent Delivery</span>
              </button>
            )}

            {/* Action 3: AI Verify & Auto-Payout */}
            {isSubmitted && (
              <button
                onClick={() => {
                  sound.playStamp();
                  onVerifyAndPayout(milestone);
                }}
                disabled={isLoading}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-mono text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Bot className="h-3.5 w-3.5" />}
                <span>AI Verify & Auto-Payout (${milestone.amount})</span>
              </button>
            )}

            {/* Status if already paid */}
            {isPaid && (
              <span className="font-mono text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                <span>SETTLED VIA PAYPAL PAYOUTS</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
