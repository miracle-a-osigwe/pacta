'use client';

import React, { useState } from 'react';
import { Bot, Shield, Zap, Sparkles, Lock, ArrowRight, Eye, ChevronUp, ChevronDown } from 'lucide-react';
import { sound } from '@/lib/audio';

interface AutonomousMeshProps {
  activeMilestoneStatus?: string;
  totalEscrowHeld?: number;
  totalDisbursed?: number;
}

export default function AutonomousMesh({
  activeMilestoneStatus = 'ESCROW_FUNDED',
  totalEscrowHeld = 235,
  totalDisbursed = 120,
}: AutonomousMeshProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isEscrowActive = activeMilestoneStatus === 'ESCROW_FUNDED' || activeMilestoneStatus === 'DELIVERABLE_SUBMITTED';
  const isVerifying = activeMilestoneStatus === 'VERIFYING' || activeMilestoneStatus === 'DELIVERABLE_SUBMITTED';
  const isPaid = activeMilestoneStatus === 'PAYOUT_COMPLETED';

  const handleNodeClick = (id: string) => {
    sound.playClick();
    setSelectedNode(selectedNode === id ? null : id);
  };

  return (
    <div className="mb-8 rounded-3xl border border-zinc-800/90 bg-gradient-to-b from-[#0b0e14] via-[#090b10] to-[#07080c] shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Top Bezel / Header */}
      <div className="px-5 py-3 border-b border-zinc-800/80 flex items-center justify-between text-xs bg-zinc-950/40">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-mono font-bold tracking-wider text-zinc-300 uppercase text-[11px]">
            Autonomous Topology Mesh // Protocol Live Flow
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
            4 Nodes Online
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-4 text-[11px] font-mono text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              <span>Escrow Conduit</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              <span>Audit Conduit</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Payout Conduit</span>
            </span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setIsCollapsed(!isCollapsed);
            }}
            className="p-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="relative h-64 sm:h-72 w-full p-4 select-none">
          {/* Subtle Grid Canvas Background */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* SVG Animated Conduits */}
          <svg className="absolute inset-0 h-full w-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Conduit Gradients */}
              <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="grad-emerald" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="grad-purple" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
              </linearGradient>

              {/* Glowing Filter */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Path 1: Buyer Agent -> PayPal Escrow Vault */}
            <path
              d="M 140 144 C 240 144, 260 70, 380 70"
              fill="none"
              stroke="#1e293b"
              strokeWidth="2"
            />
            <path
              d="M 140 144 C 240 144, 260 70, 380 70"
              fill="none"
              stroke="url(#grad-blue)"
              strokeWidth="2.5"
              strokeDasharray="6 8"
              className={isEscrowActive ? 'animate-pulse' : ''}
              filter="url(#glow)"
            />

            {/* Path 2: PayPal Vault -> Provider Agent */}
            <path
              d="M 440 70 C 560 70, 580 144, 680 144"
              fill="none"
              stroke="#1e293b"
              strokeWidth="2"
            />
            <path
              d="M 440 70 C 560 70, 580 144, 680 144"
              fill="none"
              stroke="url(#grad-emerald)"
              strokeWidth="2.5"
              strokeDasharray="6 8"
              className={isPaid ? 'animate-pulse' : ''}
              filter="url(#glow)"
            />

            {/* Path 3: Provider Agent -> Gemini AI Judge */}
            <path
              d="M 680 144 C 580 144, 560 216, 440 216"
              fill="none"
              stroke="#1e293b"
              strokeWidth="2"
            />
            <path
              d="M 680 144 C 580 144, 560 216, 440 216"
              fill="none"
              stroke="url(#grad-purple)"
              strokeWidth="2.5"
              strokeDasharray="6 8"
              className={isVerifying ? 'animate-pulse' : ''}
            />

            {/* Path 4: Gemini AI Judge -> PayPal Vault (Verification approval signal) */}
            <path
              d="M 410 200 L 410 90"
              fill="none"
              stroke="#334155"
              strokeWidth="1.5"
              strokeDasharray="3 4"
            />
          </svg>

          {/* NODE 1: Buyer Agent (Left) */}
          <div
            onClick={() => handleNodeClick('buyer')}
            className={`absolute left-[5%] sm:left-[8%] top-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-10 ${
              selectedNode === 'buyer' ? 'scale-110 ring-2 ring-cyan-400' : 'hover:scale-105'
            }`}
          >
            <div className="w-28 sm:w-36 p-3 rounded-2xl bg-zinc-950/90 border border-cyan-500/40 shadow-lg shadow-cyan-500/10 flex flex-col items-center text-center">
              <div className="h-9 w-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-1.5">
                <Bot className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Buyer Agent</span>
              <span className="text-[9px] text-zinc-400">Autonomous RFQ</span>
              <span className="mt-1 text-[9px] font-mono text-zinc-300 bg-zinc-900 px-1.5 py-0.2 rounded border border-zinc-800">
                ACTIVE
              </span>
            </div>
          </div>

          {/* NODE 2: PayPal Escrow Vault (Center-Top) */}
          <div
            onClick={() => handleNodeClick('vault')}
            className={`absolute left-1/2 -translate-x-1/2 top-[8%] cursor-pointer transition-all duration-300 z-10 ${
              selectedNode === 'vault' ? 'scale-110 ring-2 ring-blue-500' : 'hover:scale-105'
            }`}
          >
            <div className="w-36 sm:w-44 p-3 rounded-2xl bg-zinc-950/95 border border-blue-500/50 shadow-xl shadow-blue-500/20 flex flex-col items-center text-center relative">
              <div className="absolute -top-1.5 right-3 h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <div className="h-9 w-9 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mb-1.5">
                <Lock className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono text-blue-400 font-bold uppercase">PayPal Escrow Vault</span>
              <span className="text-[9px] text-zinc-400">Orders v2 Sandbox</span>
              <span className="mt-1 text-[10px] font-mono font-bold text-emerald-400">
                ${totalEscrowHeld.toFixed(2)} USD Held
              </span>
            </div>
          </div>

          {/* NODE 3: Provider Agent (Right) */}
          <div
            onClick={() => handleNodeClick('provider')}
            className={`absolute right-[5%] sm:right-[8%] top-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-10 ${
              selectedNode === 'provider' ? 'scale-110 ring-2 ring-purple-400' : 'hover:scale-105'
            }`}
          >
            <div className="w-28 sm:w-36 p-3 rounded-2xl bg-zinc-950/90 border border-purple-500/40 shadow-lg shadow-purple-500/10 flex flex-col items-center text-center">
              <div className="h-9 w-9 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-1.5">
                <Zap className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">Provider Agent</span>
              <span className="text-[9px] text-zinc-400">Deliverable Engine</span>
              <span className="mt-1 text-[9px] font-mono text-emerald-400 bg-zinc-900 px-1.5 py-0.2 rounded border border-zinc-800">
                +${totalDisbursed.toFixed(2)} Paid
              </span>
            </div>
          </div>

          {/* NODE 4: Gemini AI Judge (Center-Bottom) */}
          <div
            onClick={() => handleNodeClick('judge')}
            className={`absolute left-1/2 -translate-x-1/2 bottom-[8%] cursor-pointer transition-all duration-300 z-10 ${
              selectedNode === 'judge' ? 'scale-110 ring-2 ring-emerald-400' : 'hover:scale-105'
            }`}
          >
            <div className="w-36 sm:w-44 p-3 rounded-2xl bg-zinc-950/95 border border-emerald-500/50 shadow-xl shadow-emerald-500/15 flex flex-col items-center text-center">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-1.5">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Gemini 2.5 AI Judge</span>
              <span className="text-[9px] text-zinc-400">Proof-of-Work Auditor</span>
              <span className="mt-1 text-[9px] font-mono text-zinc-300 bg-zinc-900 px-1.5 py-0.2 rounded border border-zinc-800">
                94% Avg Confidence
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Selected Node Inspector Drawer */}
      {selectedNode && (
        <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-950/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-cyan-400 font-bold uppercase">[{selectedNode.toUpperCase()}_TELEMETRY]</span>
            <span className="text-zinc-300">
              {selectedNode === 'vault' && 'Secured by PayPal Sandbox Orders v2 API with automated webhook reconciliation.'}
              {selectedNode === 'judge' && 'Multimodal verification scoring deliverables against contractual acceptance criteria.'}
              {selectedNode === 'buyer' && 'Autonomous procurement agent formulating RFP specs and budget limits.'}
              {selectedNode === 'provider' && 'Autonomous contractor executing tasks and receiving instant PayPal Payouts.'}
            </span>
          </div>
          <button
            onClick={() => setSelectedNode(null)}
            className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 underline self-end sm:self-auto"
          >
            Close Inspector
          </button>
        </div>
      )}
    </div>
  );
}
