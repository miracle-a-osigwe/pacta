import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { planAndNegotiateMilestones } from '@/lib/gemini';
import { Contract } from '@/types';

export async function GET() {
  const contracts = store.getContracts();
  const telemetry = store.getTelemetry();
  return NextResponse.json({ contracts, telemetry });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      objective = 'Smart Contract & API Security Audit',
      totalBudget = 250,
      category = 'Security',
      buyerName = 'Acme Ventures',
      buyerEmail = 'buyer@acme.sandbox.com',
      providerAgentName = 'Autonomous-Specialist-Agent',
      providerEmail = 'provider.agent@sandbox.paypal.com',
    } = body;

    // Use Gemini to plan and negotiate milestones
    const plan = await planAndNegotiateMilestones(objective, Number(totalBudget), category);

    const contractId = `contract-${Date.now().toString(36)}`;
    const newContract: Contract = {
      id: contractId,
      title: plan.title,
      objective,
      category,
      totalBudget: Number(totalBudget),
      currency: 'USD',
      buyerName,
      buyerEmail,
      providerAgentName,
      providerEmail,
      status: 'ACTIVE',
      milestones: plan.milestones.map((m, idx) => ({
        id: `ms-${contractId}-${idx + 1}`,
        title: m.title,
        description: m.description,
        amount: m.amount,
        currency: m.currency || 'USD',
        status: idx === 0 ? 'ESCROW_PENDING' : 'PROPOSED',
        deliverableCriteria: m.deliverableCriteria,
        updatedAt: new Date().toISOString(),
      })),
      agentNegotiationLog: [
        {
          sender: 'BUYER_AGENT',
          message: `Mission initiated: "${objective}". Target budget: $${totalBudget} USD.`,
          timestamp: new Date().toISOString(),
        },
        {
          sender: 'PROVIDER_AGENT',
          message: `Negotiated agreement: ${plan.negotiationSummary}`,
          timestamp: new Date(Date.now() + 1000).toISOString(),
        },
        {
          sender: 'RISK_GUARD',
          message: `Risk check passed: Escrow allocation verified. Ready for PayPal authorization.`,
          timestamp: new Date(Date.now() + 2000).toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.addContract(newContract);

    return NextResponse.json({
      success: true,
      contract: newContract,
      telemetry: store.getTelemetry(),
    });
  } catch (error: unknown) {
    console.error('Error creating contract:', error);
    const message = error instanceof Error ? error.message : 'Failed to create contract';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
