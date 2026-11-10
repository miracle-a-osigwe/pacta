/**
 * Client-Side BYOK (Bring Your Own Key) Storage & Header Dispatcher
 * Keeps keys strictly in the user's browser localStorage and attaches
 * them as transient headers to Pacta API calls.
 */

export interface ByokCredentials {
  paypalClientId: string;
  paypalClientSecret: string;
  geminiApiKey: string;
  tavilyApiKey: string;
}

const STORAGE_KEY = 'pacta_byok_credentials_v1';

export function getStoredCredentials(): ByokCredentials {
  if (typeof window === 'undefined') {
    return {
      paypalClientId: '',
      paypalClientSecret: '',
      geminiApiKey: '',
      tavilyApiKey: '',
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        paypalClientId: '',
        paypalClientSecret: '',
        geminiApiKey: '',
        tavilyApiKey: '',
      };
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse stored BYOK credentials:', e);
    return {
      paypalClientId: '',
      paypalClientSecret: '',
      geminiApiKey: '',
      tavilyApiKey: '',
    };
  }
}

export function saveStoredCredentials(creds: Partial<ByokCredentials>): void {
  if (typeof window === 'undefined') return;
  const current = getStoredCredentials();
  const updated = { ...current, ...creds };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearStoredCredentials(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Returns request headers containing any active BYOK keys
 */
export function getByokHeaders(): Record<string, string> {
  const creds = getStoredCredentials();
  const headers: Record<string, string> = {};

  if (creds.paypalClientId) headers['x-paypal-client-id'] = creds.paypalClientId;
  if (creds.paypalClientSecret) headers['x-paypal-client-secret'] = creds.paypalClientSecret;
  if (creds.geminiApiKey) headers['x-gemini-key'] = creds.geminiApiKey;
  if (creds.tavilyApiKey) headers['x-tavily-key'] = creds.tavilyApiKey;

  return headers;
}

/**
 * Returns the live connection status of each service based on stored BYOK credentials.
 * Used to surface the credential status banner in the UI.
 */
export function getConnectionStatus(): {
  paypal: boolean;
  gemini: boolean;
  tavily: boolean;
  anyLive: boolean;
  allLive: boolean;
} {
  const creds = getStoredCredentials();
  const paypal = Boolean(creds.paypalClientId && creds.paypalClientSecret);
  const gemini = Boolean(creds.geminiApiKey);
  const tavily = Boolean(creds.tavilyApiKey);
  return {
    paypal,
    gemini,
    tavily,
    anyLive: paypal || gemini || tavily,
    allLive: paypal && gemini && tavily,
  };
}
