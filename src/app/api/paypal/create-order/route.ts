import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { createPayPalOrder } from '@/lib/paypal';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contractId, milestoneId } = body;

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

    const orderResult = await createPayPalOrder({
      amount: milestone.amount,
      currency: milestone.currency,
      referenceId: `${contractId}_${milestoneId}`,
      description: `Pacta Escrow: ${milestone.title}`,
      customClientId,
      customClientSecret,
    });

    store.updateMilestone(contractId, milestoneId, {
      paypalOrderId: orderResult.orderId,
      status: 'ESCROW_PENDING',
    });

    return NextResponse.json({
      success: true,
      orderId: orderResult.orderId,
      approvalUrl: orderResult.approvalUrl,
    });
  } catch (error: unknown) {
    console.error('Error creating PayPal order:', error);
    const message = error instanceof Error ? error.message : 'Failed to create PayPal order';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
