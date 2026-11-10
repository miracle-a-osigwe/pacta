'use client';

import React, { useState } from 'react';
import { Bot, Zap, Sparkles, Lock, ChevronUp, ChevronDown } from 'lucide-react';
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
    <div className="mb-6 rounded-2xl border border-[#E5E4DE] bg-white shadow-xs relative overflow-hidden">
      {/* Top Bezel / Header */}
      <div className="px-5 py-3 border-b border-[#E5E4DE] flex items-center justify-between text-xs bg-[#FAF9F6]">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
          <span className="font-mono font-bold tracking-wider text-zinc-700 uppercase text-[11px]">
            Autonomous Topology Mesh // Protocol Live Flow
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-white text-zinc-600 border border-[#E5E4DE]">
            4 Nodes Online
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-4 text-[11px] font-mono text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
              <span>Escrow Conduit</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-800" />
              <span>Audit Conduit</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              <span>Payout Conduit</span>
            </span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setIsCollapsed(!isCollapsed);
            }}
            className="p-1 rounded-lg bg-white hover:bg-zinc-100 border border-[#E5E4DE] text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="relative h-64 sm:h-72 w-full p-4 select-none bg-[#FCFBF9]">
          {/* Subtle Architectural Grid Canvas Background */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #D6D3CD 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          {/* SVG Animated Conduits */}
          <svg className="absolute inset-0 h-full w-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            {/* Path 1: Buyer Agent -> PayPal Escrow Vault */}
            <path
              d="M 140 144 C 240 144, 260 70, 380 70"
              fill="none"
              stroke="#E5E4DE"
              strokeWidth="2"
            />
            <path
              d="M 140 144 C 240 144, 260 70, 380 70"
              fill="none"
              stroke="#D97706"
              strokeWidth="2.5"
              strokeDasharray="6 8"
              className={isEscrowActive ? 'animate-pulse' : ''}
            />

            {/* Path 2: PayPal Vault -> Provider Agent */}
            <path
              d="M 440 70 C 560 70, 580 144, 680 144"
              fill="none"
              stroke="#E5E4DE"
              strokeWidth="2"
            />
            <path
              d="M 440 70 C 560 70, 580 144, 680 144"
              fill="none"
              stroke="#059669"
              strokeWidth="2.5"
              strokeDasharray="6 8"
              className={isPaid ? 'animate-pulse' : ''}
            />

            {/* Path 3: Provider Agent -> Gemini AI Judge */}
            <path
              d="M 680 144 C 580 144, 560 216, 440 216"
              fill="none"
              stroke="#E5E4DE"
              strokeWidth="2"
            />
            <path
              d="M 680 144 C 580 144, 560 216, 440 216"
              fill="none"
              stroke="#18181B"
              strokeWidth="2"
              strokeDasharray="6 8"
              className={isVerifying ? 'animate-pulse' : ''}
            />

            {/* Path 4: Gemini AI Judge -> PayPal Vault */}
            <path
              d="M 410 200 L 410 90"
              fill="none"
              stroke="#A1A1AA"
              strokeWidth="1.5"
              strokeDasharray="3 4"
            />
          </svg>

          {/* NODE 1: Buyer Agent (Left) */}
          <div
            onClick={() => handleNodeClick('buyer')}
            className={`absolute left-[5%] sm:left-[8%] top-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-10 ${
              selectedNode === 'buyer' ? 'scale-105 ring-2 ring-zinc-900 rounded-2xl' : 'hover:scale-105'
            }`}
          >
            <div className="w-28 sm:w-36 p-3 rounded-2xl bg-white border border-[#E5E4DE] shadow-sm flex flex-col items-center text-center">
              <div className="h-8 w-8 rounded-xl bg-zinc-900 text-white flex items-center justify-center mb-1.5">
                <Bot className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-mono text-zinc-900 font-bold uppercase">Buyer Agent</span>
              <span className="text-[9px] text-zinc-500">Autonomous RFQ</span>
              <span className="mt-1 text-[9px] font-mono text-zinc-700 bg-[#FAF9F6] px-1.5 py-0.2 rounded border border-[#E5E4DE]">
                ACTIVE
              </span>
            </div>
          </div>

          {/* NODE 2: PayPal Escrow Vault (Center-Top) */}
          <div
            onClick={() => handleNodeClick('vault')}
            className={`absolute left-1/2 -translate-x-1/2 top-[8%] cursor-pointer transition-all duration-300 z-10 ${
              selectedNode === 'vault' ? 'scale-105 ring-2 ring-amber-600 rounded-2xl' : 'hover:scale-105'
            }`}
          >
            <div className="w-36 sm:w-44 p-3 rounded-2xl bg-white border border-amber-300 shadow-sm flex flex-col items-center text-center relative">
              <div className="absolute -top-1.5 right-3 h-2 w-2 rounded-full bg-amber-600 animate-ping" />
              <div className="h-8 w-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center mb-1.5">
                <Lock className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-mono text-amber-900 font-bold uppercase">PayPal Escrow Vault</span>
              <span className="text-[9px] text-zinc-500">Orders v2 Sandbox</span>
              <span className="mt-1 text-[10px] font-mono font-bold text-amber-800">
                ${totalEscrowHeld.toFixed(2)} USD Held
              </span>
            </div>
          </div>

          {/* NODE 3: Provider Agent (Right) */}
          <div
            onClick={() => handleNodeClick('provider')}
            className={`absolute right-[5%] sm:right-[8%] top-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-10 ${
              selectedNode === 'provider' ? 'scale-105 ring-2 ring-emerald-600 rounded-2xl' : 'hover:scale-105'
            }`}
          >
            <div className="w-28 sm:w-36 p-3 rounded-2xl bg-white border border-[#E5E4DE] shadow-sm flex flex-col items-center text-center">
              <div className="h-8 w-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center mb-1.5">
                <Zap className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-mono text-zinc-900 font-bold uppercase">Provider Agent</span>
              <span className="text-[9px] text-zinc-500">Deliverable Engine</span>
              <span className="mt-1 text-[9px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-semibold">
                +${totalDisbursed.toFixed(2)} Paid
              </span>
            </div>
          </div>

          {/* NODE 4: Gemini AI Judge (Center-Bottom) */}
          <div
            onClick={() => handleNodeClick('judge')}
            className={`absolute left-1/2 -translate-x-1/2 bottom-[8%] cursor-pointer transition-all duration-300 z-10 ${
              selectedNode === 'judge' ? 'scale-105 ring-2 ring-zinc-900 rounded-2xl' : 'hover:scale-105'
            }`}
          >
            <div className="w-36 sm:w-44 p-3 rounded-2xl bg-white border border-[#E5E4DE] shadow-sm flex flex-col items-center text-center">
              <div className="h-8 w-8 rounded-xl bg-zinc-900 text-white flex items-center justify-center mb-1.5">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-mono text-zinc-900 font-bold uppercase">Gemini 3.5 AI Judge</span>
              <span className="text-[9px] text-zinc-500">Proof-of-Work Auditor</span>
              <span className="mt-1 text-[9px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-semibold">
                94% Avg Confidence
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Selected Node Inspector Drawer */}
      {selectedNode && (
        <div className="px-5 py-3 border-t border-[#E5E4DE] bg-[#FAF9F6] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-zinc-900 font-bold uppercase">[{selectedNode.toUpperCase()}_TELEMETRY]</span>
            <span className="text-zinc-600">
              {selectedNode === 'vault' && 'Secured by PayPal Sandbox Orders v2 API with automated webhook reconciliation.'}
              {selectedNode === 'judge' && 'Multimodal verification scoring deliverables against contractual acceptance criteria.'}
              {selectedNode === 'buyer' && 'Autonomous procurement agent formulating RFP specs and budget limits.'}
              {selectedNode === 'provider' && 'Autonomous contractor executing tasks and receiving instant PayPal Payouts.'}
            </span>
          </div>
          <button
            onClick={() => setSelectedNode(null)}
            className="text-[11px] font-mono text-zinc-500 hover:text-zinc-900 underline self-end sm:self-auto cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      )}
    </div>
  );
}
