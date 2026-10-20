'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Bot,
  Zap,
  ChevronDown,
  ChevronUp,
  FileCheck,
  CreditCard,
  Loader2,
} from 'lucide-react';
import { Contract, Milestone } from '@/types';

interface ContractCardProps {
  contract: Contract;
  onRefresh: () => void;
}

export default function ContractCard({ contract, onRefresh }: ContractCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [actionLoadingMilestoneId, setActionLoadingMilestoneId] = useState<string | null>(null);
  const [submissionModalMilestone, setSubmissionModalMilestone] = useState<Milestone | null>(null);
  const [submissionText, setSubmissionText] = useState('');

  // 1. Escrow Funding via PayPal
  const handleFundEscrow = async (milestone: Milestone) => {
    setActionLoadingMilestoneId(milestone.id);
    try {
      // Step A: Create order
      const orderRes = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractId: contract.id,
          milestoneId: milestone.id,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error);

      // Step B: In sandbox/demo flow, capture immediately to simulate approved checkout
      const captureRes = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractId: contract.id,
          milestoneId: milestone.id,
          orderId: orderData.orderId,
        }),
      });
      const captureData = await captureRes.json();
      if (!captureRes.ok) throw new Error(captureData.error);

      onRefresh();
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Funding failed');
    } finally {
      setActionLoadingMilestoneId(null);
    }
  };

  // 2. Submit Deliverable Proof of Work
  const handleSubmitDeliverable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionModalMilestone || !submissionText.trim()) return;

    setActionLoadingMilestoneId(submissionModalMilestone.id);
    try {
      const res = await fetch(`/api/contracts/${contract.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          milestoneId: submissionModalMilestone.id,
          submissionContent: submissionText,
        }),
      });
      if (!res.ok) throw new Error('Submission failed');
      setSubmissionModalMilestone(null);
      setSubmissionText('');
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to submit deliverable');
    } finally {
      setActionLoadingMilestoneId(null);
    }
  };

  // 3. AI Deliverable Verification + PayPal Payout
  const handleVerifyAndPayout = async (milestone: Milestone) => {
    setActionLoadingMilestoneId(milestone.id);
    try {
      const res = await fetch(`/api/contracts/${contract.id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          milestoneId: milestone.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      onRefresh();
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setActionLoadingMilestoneId(null);
    }
  };

  const getStatusBadge = (status: Milestone['status']) => {
    switch (status) {
      case 'PAYOUT_COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3" />
            Payout Disbursed (PayPal)
          </span>
        );
      case 'ESCROW_FUNDED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <CreditCard className="h-3 w-3" />
            Escrow Locked
          </span>
        );
      case 'DELIVERABLE_SUBMITTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <FileCheck className="h-3 w-3" />
            Work Submitted
          </span>
        );
      case 'ESCROW_PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="h-3 w-3" />
            Awaiting Escrow Deposit
          </span>
        );
      case 'DISPUTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            Review Required
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">
            Proposed
          </span>
        );
    }
  };

  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-xl hover:border-zinc-700/80 transition-all">
      {/* Contract Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
              {contract.category}
            </span>
            <span className="text-xs text-zinc-500 font-mono">ID: {contract.id}</span>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-zinc-100">
            {contract.title}
          </h3>
          <p className="text-xs text-zinc-400 max-w-2xl">{contract.objective}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">Contract Total</p>
            <p className="text-lg font-bold font-mono text-zinc-100">
              ${contract.totalBudget.toFixed(2)}{' '}
              <span className="text-xs font-normal text-zinc-400">{contract.currency}</span>
            </p>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 transition-colors"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Agents Bar */}
      <div className="py-3 px-4 my-4 bg-zinc-950/60 rounded-2xl border border-zinc-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-zinc-400">
          <Bot className="h-3.5 w-3.5 text-blue-400" />
          <span>Buyer:</span>
          <span className="text-zinc-200 font-medium">{contract.buyerName}</span>
          <span className="text-zinc-500 font-mono">({contract.buyerEmail})</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-400">
          <Zap className="h-3.5 w-3.5 text-cyan-400" />
          <span>Provider Agent:</span>
          <span className="text-zinc-200 font-medium">{contract.providerAgentName}</span>
          <span className="text-zinc-500 font-mono">({contract.providerEmail})</span>
        </div>
      </div>

      {/* Milestones List */}
      {isExpanded && (
        <div className="space-y-4 mt-5">
          <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Contract Milestones & Deliverables ({contract.milestones.length})
          </h4>

          <div className="space-y-3.5">
            {contract.milestones.map((ms, index) => {
              const isLoading = actionLoadingMilestoneId === ms.id;

              return (
                <div
                  key={ms.id}
                  className="p-4.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 hover:border-zinc-700/60 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="h-6 w-6 rounded-lg bg-zinc-800/80 text-zinc-300 text-xs font-bold font-mono flex items-center justify-center">
                        {index + 1}
                      </span>
                      <h5 className="text-sm font-medium text-zinc-100">{ms.title}</h5>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold font-mono text-zinc-200">
                        ${ms.amount.toFixed(2)} {ms.currency}
                      </span>
                      {getStatusBadge(ms.status)}
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 pl-8">{ms.description}</p>

                  {/* Criteria Checklist */}
                  <div className="pl-8 space-y-1.5 pt-1">
                    <p className="text-[11px] font-medium text-zinc-500">Contractual Acceptance Criteria:</p>
                    <ul className="space-y-1">
                      {ms.deliverableCriteria.map((c, i) => (
                        <li key={i} className="text-xs text-zinc-300 flex items-start gap-2">
                          <span className="text-cyan-400 text-xs font-bold">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Submission and Verification Feedback (if available) */}
                  {ms.submissionContent && (
                    <div className="ml-8 p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300 space-y-1">
                      <p className="font-semibold text-zinc-400 text-[11px] flex items-center gap-1.5">
                        <FileCheck className="h-3.5 w-3.5 text-purple-400" />
                        Submitted Deliverable:
                      </p>
                      <p className="text-zinc-300 font-mono text-[11px]">{ms.submissionContent}</p>
                    </div>
                  )}

                  {ms.verificationScore !== undefined && (
                    <div className="ml-8 p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-emerald-400 text-[11px] flex items-center gap-1">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          AI Auditor Verification Score:
                        </span>
                        <span className="font-mono font-bold text-emerald-300">
                          {ms.verificationScore} / 100
                        </span>
                      </div>
                      <p className="text-zinc-300 text-[11px]">{ms.verificationFeedback}</p>
                      {ms.paypalPayoutBatchId && (
                        <p className="text-[10px] text-zinc-400 font-mono pt-1">
                          PayPal Payout Batch ID: <span className="text-emerald-400">{ms.paypalPayoutBatchId}</span>
                        </p>
                      )}
                    </div>
                  )}

                  {/* Milestone Actions */}
                  <div className="pl-8 pt-2 flex flex-wrap items-center gap-2.5">
                    {/* Fund Escrow */}
                    {(ms.status === 'PROPOSED' || ms.status === 'ESCROW_PENDING') && (
                      <button
                        onClick={() => handleFundEscrow(ms)}
                        disabled={isLoading}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-medium flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                      >
                        {isLoading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CreditCard className="h-3.5 w-3.5" />
                        )}
                        <span>Fund Escrow via PayPal (${ms.amount})</span>
                      </button>
                    )}

                    {/* Submit Deliverable */}
                    {ms.status === 'ESCROW_FUNDED' && (
                      <button
                        onClick={() => {
                          setSubmissionModalMilestone(ms);
                          setSubmissionText(
                            `Completed deliverable for ${ms.title}. Met all criteria with test pass rate 100% and zero blocking defects.`
                          );
                        }}
                        disabled={isLoading}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium flex items-center gap-2 shadow-md shadow-purple-600/20 transition-all cursor-pointer"
                      >
                        <FileCheck className="h-3.5 w-3.5" />
                        <span>Simulate Agent Delivery</span>
                      </button>
                    )}

                    {/* AI Audit & Auto-Payout */}
                    {ms.status === 'DELIVERABLE_SUBMITTED' && (
                      <button
                        onClick={() => handleVerifyAndPayout(ms)}
                        disabled={isLoading}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-medium flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                      >
                        {isLoading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Bot className="h-3.5 w-3.5" />
                        )}
                        <span>AI Verify & Auto-Payout (${ms.amount})</span>
                      </button>
                    )}

                    {ms.status === 'PAYOUT_COMPLETED' && (
                      <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Settled & Disbursed via PayPal Payouts
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Submission Modal */}
      {submissionModalMilestone && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-purple-400" />
              <span>Submit Proof of Deliverable — {submissionModalMilestone.title}</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Provide the deliverable code, links, or report text. The Gemini AI Judge will audit this against contract criteria.
            </p>
            <form onSubmit={handleSubmitDeliverable} className="space-y-4">
              <textarea
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                rows={4}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSubmissionModalMilestone(null)}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoadingMilestoneId === submissionModalMilestone.id}
                  className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium flex items-center gap-2 cursor-pointer"
                >
                  {actionLoadingMilestoneId === submissionModalMilestone.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : null}
                  <span>Submit for AI Audit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
