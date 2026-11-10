import { NextRequest, NextResponse } from 'next/server';
import { store, PRESET_SCENARIOS } from '@/lib/store';

export async function GET() {
  const presets = Object.values(PRESET_SCENARIOS).map((p) => ({
    key: p.key,
    name: p.name,
    shortLabel: p.shortLabel,
    category: p.category,
    badge: p.badge,
    totalBudget: p.contract.totalBudget,
    milestonesCount: p.contract.milestones.length,
    passingSample: p.passingSample,
    failingSample: p.failingSample,
  }));

  return NextResponse.json({ presets });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, presetKey } = body;

    if (action === 'load_scenario') {
      if (!presetKey) {
        return NextResponse.json({ error: 'presetKey is required' }, { status: 400 });
      }
      const contract = store.loadScenario(presetKey);
      if (!contract) {
        return NextResponse.json({ error: 'Preset not found' }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        contract,
        contracts: store.getContracts(),
        telemetry: store.getTelemetry(),
        preset: PRESET_SCENARIOS[presetKey],
      });
    }

    if (action === 'live_event') {
      const result = store.simulateLiveEvent();
      return NextResponse.json({
        success: true,
        transaction: result.transaction,
        transactions: store.getTransactions(),
        telemetry: result.telemetry,
        logMessage: result.logMessage,
      });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    console.error('Simulation error:', err);
    return NextResponse.json({ error: 'Simulation request failed' }, { status: 500 });
  }
}
