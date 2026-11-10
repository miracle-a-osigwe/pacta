'use client';

import React from 'react';
import { HelpCircle, Key } from 'lucide-react';
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
  onOpenGuide,
  onOpenSettings,
}: NavbarProps) {
  return (
    <header className="border-b border-[#E5E4DE] bg-[#FAF9F6]/95 backdrop-blur-md sticky top-0 z-50 text-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-2">
        {/* Clean Editorial Brand Identity */}
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center shadow-xs shrink-0 font-serif font-bold text-base">
            P
          </div>
          <span className="text-base font-extrabold tracking-tight text-zinc-900 uppercase">
            PACTA
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-zinc-900/5 text-zinc-600 border border-[#E5E4DE] uppercase tracking-wider">
            Agentic Escrow
          </span>
        </div>

        {/* Clean 2-Mode Center Switcher */}
        <nav
          data-tour="nav-mode-switcher"
          className="flex items-center gap-1 bg-[#EFECE6] p-1 rounded-xl border border-[#E5E4DE]"
        >
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('contracts');
            }}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              activeTab !== 'cockpit'
                ? 'bg-zinc-900 text-white shadow-xs font-semibold'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/60'
            }`}
          >
            Escrow Workstation
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('cockpit');
            }}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'cockpit'
                ? 'bg-zinc-900 text-white shadow-xs font-semibold'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/60'
            }`}
          >
            <span>AG Grid Ledger</span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                activeTab === 'cockpit'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              Live
            </span>
          </button>
        </nav>

        {/* Action Controls: Guide Me & BYOK Drawer */}
        <div className="flex items-center gap-2">
          <button
            data-tour="nav-guide"
            onClick={() => {
              sound.playClick();
              onOpenGuide();
            }}
            className="relative px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer group"
          >
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600" />
            </span>
            <HelpCircle className="h-3.5 w-3.5 text-amber-700 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">Guide Me</span>
          </button>

          <button
            data-tour="nav-settings"
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-zinc-50 border border-[#E5E4DE] hover:border-zinc-300 text-zinc-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="Configure BYOK API Keys (PayPal, Gemini, Tavily)"
          >
            <Key className="h-3.5 w-3.5 text-zinc-700" />
            <span className="hidden sm:inline font-mono text-[11px]">BYOK Keys</span>
          </button>
        </div>
      </div>
    </header>
  );
}
