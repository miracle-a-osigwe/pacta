'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import PactaConsole, { LifecycleStage } from '@/components/PactaConsole';
import ProtocolTicker from '@/components/ProtocolTicker';
import SettingsModal from '@/components/SettingsModal';
import GuideMeTour from '@/components/GuideMeTour';
import { Contract, LedgerTransaction, TelemetryStats } from '@/types';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'contracts' | 'cockpit' | 'new-mission'>('contracts');
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [transactions, setTransactions] = useState<LedgerTransaction[]>([]);
  const [telemetry, setTelemetry] = useState<TelemetryStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [contractsRes, txRes] = await Promise.all([
        fetch('/api/contracts'),
        fetch('/api/transactions'),
      ]);

      const contractsData = await contractsRes.json();
      const txData = await txRes.json();

      if (contractsData.contracts) {
        setContracts(contractsData.contracts);
      }
      if (contractsData.telemetry) {
        setTelemetry(contractsData.telemetry);
      }
      if (txData.transactions) {
        setTransactions(txData.transactions);
      }
    } catch (err) {
      console.error('Failed to load Pacta data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleContractCreated = (newContract: Contract) => {
    setContracts((prev) => [newContract, ...prev]);
    fetchData();
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-100 selection:bg-blue-600 selection:text-white font-sans antialiased">
      {/* Background ambient gradient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/3 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          telemetry={telemetry}
          onOpenGuide={() => setIsGuideOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {isLoading ? (
            <div className="py-32 text-center text-xs text-zinc-500 font-mono flex flex-col items-center justify-center gap-3">
              <span className="h-3 w-3 rounded-full bg-cyan-400 animate-ping" />
              <span>INITIALIZING PACTA AUTONOMOUS ESCROW APPARATUS...</span>
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
            />
          )}

          {/* Layer 3: Monospace ASCII Protocol Packet Ticker */}
          <ProtocolTicker />
        </main>

        {/* BYOK Settings Drawer Modal */}
        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

        {/* Interactive Guide Me & 60-Second Auto Demo Modal */}
        <GuideMeTour
          isOpen={isGuideOpen}
          onClose={() => setIsGuideOpen(false)}
          setActiveTab={setActiveTab}
          onRefreshData={fetchData}
          onContractCreated={handleContractCreated}
        />

        {/* Chassis Footer */}
        <footer className="border-t border-zinc-900 bg-zinc-950/80 py-5 mt-12 text-xs text-zinc-500 text-center font-mono">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-300">PACTA</span>
              <span>// AUTONOMOUS AGENT COMMERCE & ESCROW LAYER</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-zinc-400">
              <span>PAYPAL ORDERS v2 + PAYOUTS v1</span>
              <span>•</span>
              <span>AG GRID v36</span>
              <span>•</span>
              <span>GOOGLE GEMINI 2.5</span>
              <span>•</span>
              <span>TAVILY API</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
