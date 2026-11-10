'use client';

import React from 'react';
import {
  CheckCircle2,
  Sparkles,
  Bot,
  CreditCard,
  FileCheck,
  Loader2,
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

  // Calculate 10-bar analog gauge for verification score
  const score = milestone.verificationScore ?? 0;
  const activeBars = Math.round(score / 10);

  return (
    <div className="relative group select-none">
      {/* Tactile Warm Paper Perforated Receipt Voucher */}
      <div className="relative bg-[#FCFBF7] border-x border-[#D6D3CD] shadow-md p-6 sm:p-7 overflow-hidden transition-all duration-300">
        {/* Top Perforated Dashed Tear Edge */}
        <div className="absolute top-0 left-0 right-0 h-1.5 border-t-2 border-dashed border-[#D6D3CD] bg-[#F2F0E8]" />
        {/* Left/Right Receipt Cutout Notches matching page paper background */}
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#F7F6F2] border border-[#D6D3CD] shadow-inner" />
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#F7F6F2] border border-[#D6D3CD] shadow-inner" />
        {/* Bottom Perforated Dashed Tear Edge */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 border-b-2 border-dashed border-[#D6D3CD] bg-[#F2F0E8]" />

        {/* Diagonal Rubber Ink Stamp Overlay when Paid */}
        {isPaid && (
          <div className="absolute right-4 sm:right-8 top-10 sm:top-8 pointer-events-none z-20 transform -rotate-12 animate-in fade-in zoom-in-75 duration-300">
            <div className="border-4 border-double border-emerald-700/85 px-4 py-1.5 rounded-lg bg-emerald-50/90 backdrop-blur-xs text-center shadow-sm">
              <span className="block font-mono font-black text-xs sm:text-sm tracking-widest text-emerald-800 uppercase">
                PAID &amp; DISBURSED
              </span>
              <span className="block font-mono text-[9px] text-emerald-700 tracking-wider font-bold">
                PAYPAL PAYOUTS // VERIFIED
              </span>
            </div>
          </div>
        )}

        {/* Receipt Header & Technical Serial */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-dashed border-[#D6D3CD] text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-zinc-500 tracking-wider uppercase font-semibold">
              VOUCHER #{contractId.slice(-4).toUpperCase()}-{String(index + 1).padStart(2, '0')}
            </span>
            <span className="text-zinc-300">|</span>
            <span className="font-mono text-[10px] text-zinc-800 font-bold">ESCROW DEPOSIT SLIP</span>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-mono text-[10px]">
              <span
                className={`h-2 w-2 rounded-full transition-all ${
                  isPaid
                    ? 'bg-emerald-600'
                    : isEscrowed || isSubmitted
                    ? 'bg-blue-600'
                    : isPending
                    ? 'bg-amber-500'
                    : 'bg-zinc-400'
                }`}
              />
              <span
                className={`font-bold ${
                  isPaid
                    ? 'text-emerald-800'
                    : isEscrowed || isSubmitted
                    ? 'text-blue-800'
                    : 'text-amber-800'
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
            <div className="h-7 w-7 rounded-lg bg-zinc-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              0{index + 1}
            </div>
            <div>
              <h4 className="text-base font-serif font-bold text-zinc-900 tracking-tight">{milestone.title}</h4>
              <p className="text-xs text-zinc-600 mt-0.5">{milestone.description}</p>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono block">Milestone Amount</span>
            <span className="text-lg sm:text-xl font-mono font-black text-zinc-900">
              ${milestone.amount.toFixed(2)}{' '}
              <span className="text-xs font-normal text-zinc-500">{milestone.currency}</span>
            </span>
          </div>
        </div>

        {/* Contractual Acceptance Criteria */}
        <div className="my-3.5 p-3.5 rounded-xl bg-[#F4F2EC] border border-[#E5E4DE] text-xs space-y-1.5">
          <span className="font-mono text-[10px] font-bold text-zinc-600 uppercase tracking-wider block">
            Automated Audit Rubric Specifications:
          </span>
          <ul className="space-y-1">
            {milestone.deliverableCriteria.map((criterion, idx) => (
              <li key={idx} className="flex items-start gap-2 text-zinc-800 text-xs">
                <span className="text-zinc-500 font-mono text-[10px] font-bold mt-0.5">[{idx + 1}]</span>
                <span>{criterion}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Submitted Proof-of-Work Snippet (if available) */}
        {milestone.submissionContent && (
          <div className="my-3 p-3.5 rounded-xl bg-white border border-[#E5E4DE] text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-700 font-mono text-[10px] font-bold uppercase">
              <FileCheck className="h-3.5 w-3.5 text-emerald-700" />
              <span>DELIVERABLE_PROOF_SUBMITTED:</span>
            </div>
            <p className="font-mono text-[11px] text-zinc-700 line-clamp-2">{milestone.submissionContent}</p>
          </div>
        )}

        {/* Analog Meter for Gemini AI Judge Verification Score */}
        {milestone.verificationScore !== undefined && (
          <div className="my-3.5 p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-emerald-900 font-bold uppercase flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
                Gemini 3.5 Verification Audit Meter:
              </span>
              <span className="font-mono font-bold text-xs text-emerald-900">
                {milestone.verificationScore} / 100
              </span>
            </div>

            {/* 10-Segment Analog Ink Bar */}
            <div className="grid grid-cols-10 gap-1.5 h-2 w-full">
              {Array.from({ length: 10 }).map((_, barIdx) => {
                const isLit = barIdx < activeBars;
                return (
                  <div
                    key={barIdx}
                    className={`rounded-xs transition-all duration-300 ${
                      isLit
                        ? score >= 85
                          ? 'bg-emerald-600'
                          : 'bg-rose-600'
                        : 'bg-zinc-200'
                    }`}
                  />
                );
              })}
            </div>

            <p className="text-[11px] text-zinc-700 leading-relaxed font-sans pt-0.5">
              {milestone.verificationFeedback}
            </p>

            {milestone.paypalPayoutBatchId && (
              <div className="flex items-center gap-2 pt-1.5 font-mono text-[10px] text-zinc-600 border-t border-emerald-200/80">
                <span>PayPal Batch:</span>
                <span className="text-emerald-800 select-all font-bold">{milestone.paypalPayoutBatchId}</span>
              </div>
            )}
          </div>
        )}

        {/* Action Controls Deck */}
        <div className="pt-3 border-t border-dashed border-[#D6D3CD] flex flex-wrap items-center justify-between gap-3">
          <div className="font-mono text-[10px] text-zinc-500">
            PAYEE: <span className="text-zinc-800 font-semibold">{providerEmail}</span>
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
                className="px-4 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-xs font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
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
                className="px-4 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-xs font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
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
                className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Bot className="h-3.5 w-3.5" />}
                <span>AI Verify &amp; Auto-Payout (${milestone.amount})</span>
              </button>
            )}

            {/* Status if already paid */}
            {isPaid && (
              <span className="font-mono text-xs text-emerald-800 flex items-center gap-1 font-bold">
                <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                <span>SETTLED VIA PAYPAL PAYOUTS</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
