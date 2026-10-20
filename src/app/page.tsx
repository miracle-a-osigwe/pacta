'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import TelemetryCards from '@/components/TelemetryCards';
import AgentMissionInput from '@/components/AgentMissionInput';
import ContractCard from '@/components/ContractCard';
import AgGridCockpit from '@/components/AgGridCockpit';
import AutonomousMesh from '@/components/AutonomousMesh';
import ProtocolTicker from '@/components/ProtocolTicker';
import SettingsModal from '@/components/SettingsModal';
import GuideMeTour from '@/components/GuideMeTour';
import { Contract, LedgerTransaction, TelemetryStats } from '@/types';
import { sound } from '@/lib/audio';
import {
  ShieldAlert,
  ArrowRight,
  Bot,
  CreditCard,
  Sparkles,
  Zap,
  RefreshCw,
  CheckCircle2,
  Play,
  HelpCircle,
  Key,
  Compass,
} from 'lucide-react';

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
    setActiveTab('contracts');
    fetchData();
  };

  // Determine active milestone for the live mesh topology
  const latestContract = contracts[0];
  const activeMilestone =
    latestContract?.milestones.find((m) => m.status !== 'PAYOUT_COMPLETED') ||
    latestContract?.milestones[0];

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

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
          {/* Hero Explainer Banner */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-zinc-900/60 border border-blue-500/20 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm shadow-blue-500/30">
                    Agentic Commerce Protocol
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">PayPal AI Hackathon 2026</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                    BYOK Enabled
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                  Safe Economic Autonomy for AI Agents
                </h1>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Pacta enables autonomous AI agents to negotiate deliverables, lock funds into conditional{' '}
                  <strong className="text-blue-400 font-medium">PayPal Escrow</strong>, inspect completed work via{' '}
                  <strong className="text-indigo-300 font-medium">Gemini 2.5 AI Judges</strong>, and automatically disburse{' '}
                  <strong className="text-emerald-400 font-medium">PayPal Payouts</strong> with tactile hardware receipts.
                </p>

                {/* Quick Action Buttons for Judges */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setIsGuideOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>60-Second Auto-Demo</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick();
                      setActiveTab('new-mission');
                    }}
                    className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/60 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Bot className="h-3.5 w-3.5 text-blue-400" />
                    <span>Create Agent Mission</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick();
                      setIsSettingsOpen(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Key className="h-3.5 w-3.5 text-amber-400" />
                    <span>Configure BYOK Keys</span>
                  </button>
                </div>
              </div>

              {/* 4-Step Cycle Graphic */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-2 text-xs shrink-0">
                <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <div className="text-[10px] font-mono text-zinc-500 mb-1">STEP 01</div>
                  <div className="flex items-center gap-1.5 font-medium text-zinc-200">
                    <Bot className="h-3.5 w-3.5 text-blue-400" />
                    <span>Agent RFQ</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Tavily + Gemini</div>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <div className="text-[10px] font-mono text-zinc-500 mb-1">STEP 02</div>
                  <div className="flex items-center gap-1.5 font-medium text-zinc-200">
                    <CreditCard className="h-3.5 w-3.5 text-blue-400" />
                    <span>PayPal Escrow</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Orders v2 API</div>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <div className="text-[10px] font-mono text-zinc-500 mb-1">STEP 03</div>
                  <div className="flex items-center gap-1.5 font-medium text-zinc-200">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                    <span>AI Audit</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Gemini 2.5 Judge</div>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <div className="text-[10px] font-mono text-zinc-500 mb-1">STEP 04</div>
                  <div className="flex items-center gap-1.5 font-medium text-zinc-200">
                    <Zap className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Instant Payout</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Payouts v1 API</div>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Telemetry Metrics */}
          <TelemetryCards telemetry={telemetry} />

          {/* Tab 1: Deploy New Agent Mission */}
          {activeTab === 'new-mission' && (
            <div className="space-y-6">
              <AgentMissionInput onContractCreated={handleContractCreated} />
            </div>
          )}

          {/* Tab 2: Active Contracts List */}
          {activeTab === 'contracts' && (
            <div className="space-y-6">
              {/* Layer 1: Autonomous Mesh Conduit Topology */}
              <AutonomousMesh
                activeMilestoneStatus={activeMilestone?.status}
                totalEscrowHeld={telemetry?.activeEscrowHeld}
                totalDisbursed={telemetry?.totalDisbursed}
              />

              <div className="flex items-center justify-between pb-2">
                <div>
                  <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                    <span>Active Agent Procurement Contracts</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                      {contracts.length}
                    </span>
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Tactile thermal milestone vouchers with conditional PayPal Escrow, Gemini verification & instant disbursement.
                  </p>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('new-mission');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-md shadow-blue-600/25 transition-all cursor-pointer"
                >
                  <Bot className="h-3.5 w-3.5" />
                  <span>Deploy New Mission</span>
                </button>
              </div>

              {isLoading ? (
                <div className="py-20 text-center text-xs text-zinc-500 font-mono animate-pulse">
                  Loading Pacta contracts and PayPal telemetry...
                </div>
              ) : contracts.length === 0 ? (
                <div className="p-12 text-center rounded-3xl border border-zinc-800 bg-zinc-900/50">
                  <p className="text-sm text-zinc-400 mb-3">No active contracts yet.</p>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setActiveTab('new-mission');
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-medium"
                  >
                    Deploy First Agent Mission
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {contracts.map((contract) => (
                    <ContractCard key={contract.id} contract={contract} onRefresh={fetchData} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: AG Grid Financial Cockpit */}
          {activeTab === 'cockpit' && (
            <div className="space-y-6">
              <AgGridCockpit transactions={transactions} onRefresh={fetchData} />
            </div>
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

        {/* Footer */}
        <footer className="border-t border-zinc-900 bg-zinc-950/80 py-6 mt-16 text-xs text-zinc-500 text-center">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-300">PACTA</span>
              <span>— Autonomous Agent Commerce & Escrow Layer</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Built for PayPal AI Hackathon 2026</span>
              <span>•</span>
              <span className="text-zinc-400 font-mono">AG Grid Community v36</span>
              <span>•</span>
              <span className="text-zinc-400 font-mono">Google Gemini 2.5</span>
              <span>•</span>
              <span className="text-zinc-400 font-mono">PayPal Orders & Payouts</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
