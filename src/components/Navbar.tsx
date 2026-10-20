'use client';

import React from 'react';
import { ShieldCheck, Cpu, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { TelemetryStats } from '@/types';

interface NavbarProps {
  activeTab: 'contracts' | 'cockpit' | 'new-mission';
  setActiveTab: (tab: 'contracts' | 'cockpit' | 'new-mission') => void;
  telemetry: TelemetryStats | null;
}

export default function Navbar({ activeTab, setActiveTab, telemetry }: NavbarProps) {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/20">
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
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                PayPal Sandbox
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              Autonomous Agent Procurement & Escrow Settlement
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => setActiveTab('contracts')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'contracts'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            Active Missions ({telemetry?.activeContractsCount ?? 2})
          </button>
          <button
            onClick={() => setActiveTab('cockpit')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
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
            onClick={() => setActiveTab('new-mission')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1 ${
              activeTab === 'new-mission'
                ? 'bg-cyan-500 text-zinc-950 font-semibold shadow-md shadow-cyan-500/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>Deploy Agent</span>
          </button>
        </nav>

        {/* Sandbox Metrics Pill */}
        <div className="hidden md:flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Escrow Locked</p>
            <p className="text-sm font-semibold text-emerald-400 font-mono">
              ${(telemetry?.activeEscrowHeld ?? 235).toFixed(2)} USD
            </p>
          </div>
          <div className="h-8 w-px bg-zinc-800" />
          <a
            href="https://developer.paypal.com/dashboard/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-cyan-400 transition-colors py-1.5 px-2.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:border-zinc-700"
          >
            <span>PayPal Dev</span>
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </header>
  );
}
