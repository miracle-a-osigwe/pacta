import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { capturePayPalOrder } from '@/lib/paypal';
import { LedgerTransaction } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contractId, milestoneId, orderId } = body;

    const contract = store.getContract(contractId);
    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    const milestone = contract.milestones.find((m) => m.id === milestoneId);
    if (!milestone) {
      return NextResponse.json({ error: 'Milestone not found' }, { status: 404 });
    }

    const customClientId = req.headers.get('x-paypal-client-id') || undefined;
    const customClientSecret = req.headers.get('x-paypal-client-secret') || undefined;

    // Capture payment from PayPal
    const captureResult = await capturePayPalOrder(orderId, {
      clientId: customClientId,
      clientSecret: customClientSecret,
    });

    // Update milestone state to ESCROW_FUNDED
    store.updateMilestone(contractId, milestoneId, {
      status: 'ESCROW_FUNDED',
      paypalOrderId: orderId,
      paypalCaptureId: captureResult.captureId,
    });

    // Record ledger transaction for AG Grid
    const newTx: LedgerTransaction = {
      id: `tx-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      contractId,
      contractTitle: contract.title,
      milestoneId,
      milestoneTitle: milestone.title,
      type: 'ESCROW_DEPOSIT',
      amount: milestone.amount,
      currency: milestone.currency,
      status: 'HELD_IN_ESCROW',
      payer: contract.buyerEmail,
      payee: 'Pacta Escrow Vault',
      paypalReferenceId: captureResult.captureId || orderId,
      notes: `Escrow funded for "${milestone.title}". Funds held pending deliverable verification.`,
    };
    store.addTransaction(newTx);

    // Append to contract negotiation log
    contract.agentNegotiationLog.push({
      sender: 'SYSTEM',
      message: `PayPal Escrow Funded: $${milestone.amount} ${milestone.currency} captured (Ref: ${captureResult.captureId || orderId}). Provider Agent notified to execute work.`,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      captureResult,
      contract: store.getContract(contractId),
      telemetry: store.getTelemetry(),
    });
  } catch (error: unknown) {
    console.error('Error capturing PayPal order:', error);
    const message = error instanceof Error ? error.message : 'Failed to capture PayPal order';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
