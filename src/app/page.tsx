'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import PactaConsole, { LifecycleStage } from '@/components/PactaConsole';
import ProtocolTicker from '@/components/ProtocolTicker';
import SettingsModal from '@/components/SettingsModal';
import GuideMeTour from '@/components/GuideMeTour';
import { Contract, LedgerTransaction, TelemetryStats } from '@/types';
import { getConnectionStatus } from '@/lib/credentials';
import { AlertTriangle, CheckCircle2, Zap } from 'lucide-react';
import { sound } from '@/lib/audio';

interface ServiceStatus {
  paypal: boolean;
  gemini: boolean;
  tavily: boolean;
  anyLive: boolean;
  allLive: boolean;
  mode: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'contracts' | 'cockpit' | 'new-mission'>('contracts');
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [transactions, setTransactions] = useState<LedgerTransaction[]>([]);
  const [telemetry, setTelemetry] = useState<TelemetryStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentStage, setCurrentStage] = useState<LifecycleStage>(1);
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>('defi-security');

  // Connection status: merges server-side env vars + client-side BYOK keys
  const [serverStatus, setServerStatus] = useState<ServiceStatus | null>(null);
  const [clientStatus, setClientStatus] = useState(() => {
    if (typeof window !== 'undefined') return getConnectionStatus();
    return { paypal: false, gemini: false, tavily: false, anyLive: false, allLive: false };
  });

  // Merge: a service is "live" if either server env or client BYOK has it configured
  const mergedStatus = {
    paypal: (serverStatus?.paypal ?? false) || clientStatus.paypal,
    gemini: (serverStatus?.gemini ?? false) || clientStatus.gemini,
    tavily: (serverStatus?.tavily ?? false) || clientStatus.tavily,
  };
  const isFullyLive = mergedStatus.paypal && mergedStatus.gemini;
  const isAnyLive = mergedStatus.paypal || mergedStatus.gemini || mergedStatus.tavily;

  // Fetch server status once on mount
  useEffect(() => {
    fetch('/api/status')
      .then((r) => r.json())
      .then((data: ServiceStatus) => setServerStatus(data))
      .catch(() => {/* silently continue in demo mode */});
  }, []);

  // Re-read client BYOK keys whenever settings modal closes
  useEffect(() => {
    if (!isSettingsOpen) {
      setClientStatus(getConnectionStatus());
    }
  }, [isSettingsOpen]);

  const handleNavTabChange = (tab: 'contracts' | 'cockpit' | 'new-mission') => {
    setActiveTab(tab);
    if (tab === 'cockpit') {
      setCurrentStage(5);
    } else if (tab === 'contracts') {
      if (currentStage === 5) setCurrentStage(1);
    }
  };

  const handleStageChange = (stage: LifecycleStage) => {
    setCurrentStage(stage);
    if (stage === 5) {
      setActiveTab('cockpit');
    } else {
      setActiveTab('contracts');
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const [contractsRes, txRes] = await Promise.all([
        fetch('/api/contracts'),
        fetch('/api/transactions'),
      ]);

      const contractsData = await contractsRes.json();
      const txData = await txRes.json();

      if (contractsData.contracts) setContracts(contractsData.contracts);
      if (contractsData.telemetry) setTelemetry(contractsData.telemetry);
      if (txData.transactions) setTransactions(txData.transactions);
    } catch (err) {
      console.error('Failed to load Pacta data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleContractCreated = (newContract: Contract) => {
    setContracts((prev) => [newContract, ...prev]);
    fetchData();
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-zinc-900 selection:bg-zinc-900 selection:text-white font-sans antialiased">
      {/* Subtle organic warm background lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={handleNavTabChange}
          telemetry={telemetry}
          onOpenGuide={() => setIsGuideOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* =====================================================================
            CONNECTION STATUS BANNER
            Shows judges exactly what mode they are in — Live Sandbox vs Demo Emulation.
            Disappears entirely when all services are fully live.
           ===================================================================== */}
        {!isFullyLive && (
          <div
            className={`border-b px-4 py-2 text-xs font-mono flex flex-wrap items-center justify-between gap-2 ${
              isAnyLive
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-[#FAF9F6] border-[#E5E4DE] text-zinc-600'
            }`}
          >
            <div className="flex items-center gap-2 flex-wrap">
              {isAnyLive ? (
                <AlertTriangle className="h-3.5 w-3.5 text-amber-700 shrink-0" />
              ) : (
                <Zap className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
              )}
              <span className="font-bold uppercase tracking-wider">
                {isAnyLive ? 'Partial Live Mode' : 'Demo Emulation Mode'}
              </span>
              <span className="text-zinc-500 hidden sm:inline">
                —
              </span>

              {/* Per-service status pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* PayPal */}
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${
                    mergedStatus.paypal
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-zinc-100 border-zinc-200 text-zinc-500'
                  }`}
                >
                  {mergedStatus.paypal ? (
                    <CheckCircle2 className="h-2.5 w-2.5" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-zinc-400 inline-block" />
                  )}
                  PayPal {mergedStatus.paypal ? 'LIVE' : 'EMULATED'}
                </span>

                {/* Gemini */}
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${
                    mergedStatus.gemini
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-zinc-100 border-zinc-200 text-zinc-500'
                  }`}
                >
                  {mergedStatus.gemini ? (
                    <CheckCircle2 className="h-2.5 w-2.5" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-zinc-400 inline-block" />
                  )}
                  Gemini {mergedStatus.gemini ? 'LIVE' : 'HEURISTIC'}
                </span>

                {/* Tavily */}
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${
                    mergedStatus.tavily
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-zinc-100 border-zinc-200 text-zinc-500'
                  }`}
                >
                  {mergedStatus.tavily ? (
                    <CheckCircle2 className="h-2.5 w-2.5" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-zinc-400 inline-block" />
                  )}
                  Tavily {mergedStatus.tavily ? 'LIVE' : 'STATIC'}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setIsSettingsOpen(true);
              }}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 text-white text-[10px] font-bold hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
            >
              Add API Keys →
            </button>
          </div>
        )}

        {/* Fully Live Banner — shown when all services connected */}
        {isFullyLive && (
          <div className="border-b border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-mono flex items-center gap-2 text-emerald-900">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
            <span className="font-bold uppercase tracking-wider">Live Sandbox Connected</span>
            <span className="text-emerald-700">—</span>
            <span>PayPal Orders v2 + Payouts v1 • Gemini 3.5 Flash Judge • Tavily Rate Probe — All calls are real.</span>
          </div>
        )}

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {isLoading ? (
            <div className="py-32 text-center text-xs text-zinc-600 font-mono flex flex-col items-center justify-center gap-3">
              <span className="h-3 w-3 rounded-full bg-zinc-900 animate-ping" />
              <span>INITIALIZING PACTA AUTONOMOUS ESCROW PROTOCOL...</span>
            </div>
          ) : (
            <PactaConsole
              contracts={contracts}
              transactions={transactions}
              telemetry={telemetry}
              onRefresh={fetchData}
              onContractCreated={handleContractCreated}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenGuide={() => setIsGuideOpen(true)}
              controlledStage={currentStage}
              onStageChange={handleStageChange}
              selectedPresetKey={selectedPresetKey}
              onSelectPreset={setSelectedPresetKey}
              isLiveSandbox={isFullyLive}
            />
          )}

          {/* Collapsible Protocol Packet Ticker */}
          <ProtocolTicker />
        </main>

        {/* BYOK Settings Drawer Modal */}
        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

        {/* Interactive Guide Me & 60-Second Auto Demo Modal */}
        <GuideMeTour
          isOpen={isGuideOpen}
          onClose={() => setIsGuideOpen(false)}
          currentStage={currentStage}
          onStageChange={handleStageChange}
          onRefreshData={fetchData}
          onContractCreated={handleContractCreated}
          onSelectPreset={setSelectedPresetKey}
        />

        {/* Chassis Footer */}
        <footer className="border-t border-[#E5E4DE] bg-[#FAF9F6] py-5 mt-12 text-xs text-zinc-500 text-center font-mono">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-900">PACTA</span>
              <span className="text-zinc-500">// AUTONOMOUS AGENT COMMERCE &amp; ESCROW PROTOCOL</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-zinc-500">
              <span>PAYPAL ORDERS v2 + PAYOUTS v1</span>
              <span>•</span>
              <span>AG GRID v36</span>
              <span>•</span>
              <span>GEMINI 3.5 FLASH</span>
              <span>•</span>
              <span>TAVILY API</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
