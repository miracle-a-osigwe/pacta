import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { milestoneId, submissionContent } = body;

    const contract = store.getContract(id);
    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    const milestone = contract.milestones.find((m) => m.id === milestoneId);
    if (!milestone) {
      return NextResponse.json({ error: 'Milestone not found' }, { status: 404 });
    }

    store.updateMilestone(id, milestoneId, {
      status: 'DELIVERABLE_SUBMITTED',
      submissionContent,
    });

    contract.agentNegotiationLog.push({
      sender: 'PROVIDER_AGENT',
      message: `Deliverable submitted for "${milestone.title}". Ready for AI verification audit.`,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      contract: store.getContract(id),
    });
  } catch (error: unknown) {
    console.error('Error submitting milestone:', error);
    const message = error instanceof Error ? error.message : 'Failed to submit milestone';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
