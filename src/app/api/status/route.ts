import { NextResponse } from 'next/server';

/**
 * GET /api/status
 * Returns which services are configured server-side via environment variables.
 * Client-side BYOK keys override these, but this lets the UI know the baseline.
 */
export async function GET() {
  const paypalClientId = process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';
  const paypalClientSecret = process.env.PAYPAL_CLIENT_SECRET || '';
  const geminiApiKey = process.env.GEMINI_API_KEY || '';
  const tavilyApiKey = process.env.TAVILY_API_KEY || '';

  const paypalLive =
    Boolean(paypalClientId && paypalClientSecret) &&
    paypalClientSecret !== 'your_paypal_sandbox_client_secret_here';
  const geminiLive =
    Boolean(geminiApiKey) && geminiApiKey !== 'your_gemini_api_key_here';
  const tavilyLive =
    Boolean(tavilyApiKey) && tavilyApiKey !== 'your_tavily_api_key_here';

  return NextResponse.json({
    paypal: paypalLive,
    gemini: geminiLive,
    tavily: tavilyLive,
    anyLive: paypalLive || geminiLive || tavilyLive,
    allLive: paypalLive && geminiLive && tavilyLive,
    mode: paypalLive && geminiLive ? 'LIVE_SANDBOX' : 'DEMO_EMULATION',
  });
}
