'use client';

import React from 'react';
import { ShieldCheck, Cpu, ArrowUpRight, CheckCircle2, HelpCircle, Key } from 'lucide-react';
import { TelemetryStats } from '@/types';
import { sound } from '@/lib/audio';

interface NavbarProps {
  activeTab: 'contracts' | 'cockpit' | 'new-mission';
  setActiveTab: (tab: 'contracts' | 'cockpit' | 'new-mission') => void;
  telemetry: TelemetryStats | null;
  onOpenGuide: () => void;
  onOpenSettings: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  telemetry,
  onOpenGuide,
  onOpenSettings,
}: NavbarProps) {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
            <div className="h-full w-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                PACTA
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Agentic Commerce
              </span>
              <span className="hidden sm:inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                PayPal Sandbox
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden lg:block">
              Autonomous Agent Procurement & Escrow Settlement
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('contracts');
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              activeTab === 'contracts'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            Active Missions ({telemetry?.activeContractsCount ?? 2})
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('cockpit');
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'cockpit'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <span>AG Grid Cockpit</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-300 font-mono">
              Live
            </span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('new-mission');
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
              activeTab === 'new-mission'
                ? 'bg-cyan-500 text-zinc-950 font-semibold shadow-md shadow-cyan-500/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>Deploy</span>
          </button>
        </nav>

        {/* Action Controls: Guide Me & BYOK Drawer */}
        <div className="flex items-center gap-2">
          {/* Guide Me Button with Pulsing Radar Effect */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenGuide();
            }}
            className="relative px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 border border-blue-500/40 text-blue-300 hover:text-blue-200 text-xs font-medium flex items-center gap-1.5 shadow-lg shadow-blue-500/10 transition-all cursor-pointer group"
          >
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
            </span>
            <HelpCircle className="h-3.5 w-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">Guide Me</span>
          </button>

          {/* BYOK Settings Drawer Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            className="px-2.5 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Configure BYOK API Keys (PayPal, Gemini, Tavily)"
          >
            <Key className="h-3.5 w-3.5 text-indigo-400" />
            <span className="hidden sm:inline">BYOK Keys</span>
          </button>
        </div>
      </div>
    </header>
  );
}
