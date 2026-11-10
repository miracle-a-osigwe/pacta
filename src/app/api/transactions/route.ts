import { NextResponse } from 'next/server';
import { store, SEED_TX_IDS } from '@/lib/store';

export async function GET() {
  const transactions = store.getTransactions();
  const telemetry = store.getTelemetry();
  const liveCount = transactions.filter((t) => !SEED_TX_IDS.has(t.id)).length;
  const seedCount = transactions.filter((t) => SEED_TX_IDS.has(t.id)).length;
  return NextResponse.json({ transactions, telemetry, liveCount, seedCount });
}
