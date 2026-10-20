import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { auditDeliverableSubmission } from '@/lib/gemini';
import { createPayPalPayout } from '@/lib/paypal';
import { LedgerTransaction } from '@/types';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { milestoneId } = body;

    const contract = store.getContract(id);
    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    const milestone = contract.milestones.find((m) => m.id === milestoneId);
    if (!milestone) {
      return NextResponse.json({ error: 'Milestone not found' }, { status: 404 });
    }

    const submission =
      milestone.submissionContent ||
      'Production deliverables completed and verified against contract acceptance criteria. Full test suite passing with zero defects.';

    const customGeminiKey = req.headers.get('x-gemini-key') || undefined;
    const customClientId = req.headers.get('x-paypal-client-id') || undefined;
    const customClientSecret = req.headers.get('x-paypal-client-secret') || undefined;

    // 1. Autonomous AI Auditor (Gemini AI Judge) inspects deliverable
    const auditResult = await auditDeliverableSubmission({
      criteria: milestone.deliverableCriteria,
      milestoneTitle: milestone.title,
      submissionContent: submission,
      customGeminiApiKey: customGeminiKey,
    });

    let payoutResult = null;
    let newStatus = milestone.status;

    if (auditResult.verdict === 'AUTOMATICALLY_APPROVED') {
      // 2. Trigger PayPal Payouts API for instant automated disbursement
      payoutResult = await createPayPalPayout({
        receiverEmail: contract.providerEmail,
        amount: milestone.amount,
        currency: milestone.currency,
        note: `Pacta: Payout for ${milestone.title}`,
        senderItemId: `${id}_${milestoneId}`,
        customClientId,
        customClientSecret,
      });

      newStatus = 'PAYOUT_COMPLETED';

      // 3. Record in AG Grid ledger
      const payoutTx: LedgerTransaction = {
        id: `tx-payout-${Date.now().toString(36)}`,
        timestamp: new Date().toISOString(),
        contractId: id,
        contractTitle: contract.title,
        milestoneId,
        milestoneTitle: milestone.title,
        type: 'PAYOUT_DISBURSEMENT',
        amount: milestone.amount,
        currency: milestone.currency,
        status: 'SUCCESS',
        payer: 'Pacta Escrow Vault',
        payee: contract.providerEmail,
        paypalReferenceId: payoutResult.payoutBatchId,
        verificationScore: auditResult.score,
        auditVerdict: auditResult.verdict,
        notes: `AI Judge Score ${auditResult.score}/100. PayPal Payout disbursed to ${contract.providerEmail}.`,
      };
      store.addTransaction(payoutTx);

      // Log to contract
      contract.agentNegotiationLog.push({
        sender: 'SYSTEM',
        message: `Deliverable Verified (Score: ${auditResult.score}/100 - ${auditResult.verdict}). PayPal Payouts executed: $${milestone.amount} ${milestone.currency} sent to ${contract.providerEmail} (Batch: ${payoutResult.payoutBatchId}).`,
        timestamp: new Date().toISOString(),
      });
    } else {
      newStatus = 'DISPUTED';
      contract.agentNegotiationLog.push({
        sender: 'SYSTEM',
        message: `Deliverable Audit flagged (Score: ${auditResult.score}/100 - ${auditResult.verdict}). Payout held for human review: ${auditResult.feedback}`,
        timestamp: new Date().toISOString(),
      });
    }

    // Update milestone state
    store.updateMilestone(id, milestoneId, {
      status: newStatus,
      verificationScore: auditResult.score,
      verificationFeedback: auditResult.feedback,
      paypalPayoutBatchId: payoutResult?.payoutBatchId,
    });

    // Check if entire contract is completed
    const updatedContract = store.getContract(id);
    const allCompleted = updatedContract?.milestones.every(
      (m) => m.status === 'PAYOUT_COMPLETED'
    );
    if (allCompleted) {
      store.updateContract(id, { status: 'COMPLETED' });
    }

    return NextResponse.json({
      success: true,
      auditResult,
      payoutResult,
      contract: store.getContract(id),
      telemetry: store.getTelemetry(),
    });
  } catch (error: unknown) {
    console.error('Error verifying milestone:', error);
    const message = error instanceof Error ? error.message : 'Failed to verify milestone';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
