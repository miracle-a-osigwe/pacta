import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET() {
  const transactions = store.getTransactions();
  const telemetry = store.getTelemetry();
  return NextResponse.json({ transactions, telemetry });
}
