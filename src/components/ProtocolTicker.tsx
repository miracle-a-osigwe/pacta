'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Pause, Play, Trash2, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { sound } from '@/lib/audio';

interface LogPacket {
  id: string;
  time: string;
  protocol: 'ESCROW' | 'GEMINI' | 'PAYPAL' | 'TAVILY' | 'MESH';
  level: 'INFO' | 'SUCCESS' | 'WARN';
  message: string;
  hash?: string;
}

const DEFAULT_PACKETS: LogPacket[] = [
  {
    id: 'p1',
    time: '14:22:01.104',
    protocol: 'MESH',
    level: 'INFO',
    message: 'Autonomous topology conduit synchronized across 4 nodes. Webhook listener active.',
    hash: '0x8f2a...1e4b',
  },
  {
    id: 'p2',
    time: '14:22:15.892',
    protocol: 'TAVILY',
    level: 'INFO',
    message: 'Market intelligence probe resolved. Benchmark rate: $250.00 USD for security audit.',
    hash: '0x4c11...90a3',
  },
  {
    id: 'p3',
    time: '14:22:30.412',
    protocol: 'ESCROW',
    level: 'SUCCESS',
    message: 'Orders v2 Escrow deposit verified: $125.00 captured. State -> HELD_IN_ESCROW.',
    hash: '0x3e9b...77f1',
  },
  {
    id: 'p4',
    time: '14:23:02.781',
    protocol: 'GEMINI',
    level: 'SUCCESS',
    message: 'Gemini 2.5 AI Judge completed multimodal audit. Score: 94/100 -> AUTOMATICALLY_APPROVED.',
    hash: '0x112d...aa82',
  },
  {
    id: 'p5',
    time: '14:23:03.119',
    protocol: 'PAYPAL',
    level: 'SUCCESS',
    message: 'PayPal Payouts executed: Instant disbursement $125.00 -> provider.agent@sandbox.paypal.com.',
    hash: '0x99fe...bb12',
  },
];

export default function ProtocolTicker() {
  const [logs, setLogs] = useState<LogPacket[]>(DEFAULT_PACKETS);
  const [isPaused, setIsPaused] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Background synthetic heartbeat to keep terminal feeling alive
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
        2,
        '0'
      )}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`;

      const syntheticEvents: Omit<LogPacket, 'id' | 'time'>[] = [
        {
          protocol: 'MESH',
          level: 'INFO',
          message: 'Pacta cryptographic consensus probe: All agent escrow signatures valid.',
          hash: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
        },
        {
          protocol: 'PAYPAL',
          level: 'INFO',
          message: 'PayPal Sandbox OAuth session heartbeat acknowledged: Latency 24ms.',
          hash: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
        },
        {
          protocol: 'GEMINI',
          level: 'INFO',
          message: 'Auditor model telemetry: Temperature 0.1 | Flash 2.5 | Spec verification armed.',
          hash: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
        },
      ];

      const chosen = syntheticEvents[Math.floor(Math.random() * syntheticEvents.length)];
      const newPacket: LogPacket = {
        id: `p-${Date.now()}`,
        time: timeStr,
        ...chosen,
      };

      setLogs((prev) => [...prev.slice(-40), newPacket]);
    }, 7000);

    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    if (containerRef.current && !isPaused && !isCollapsed) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs, isPaused, isCollapsed]);

  const getTagBadge = (protocol: LogPacket['protocol']) => {
    switch (protocol) {
      case 'ESCROW':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'GEMINI':
        return 'text-indigo-300 bg-indigo-500/10 border-indigo-500/30';
      case 'PAYPAL':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'TAVILY':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      default:
        return 'text-zinc-400 bg-zinc-800/50 border-zinc-700/50';
    }
  };

  return (
    <div className="mt-8 rounded-2xl border border-zinc-800/90 bg-[#06080c] shadow-2xl overflow-hidden font-mono text-xs">
      {/* Console Top Header */}
      <div className="px-4 py-2.5 bg-zinc-950/80 border-b border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <div className="flex items-center gap-1.5 text-zinc-300 font-bold text-[11px] tracking-wider uppercase">
            <Terminal className="h-3.5 w-3.5 text-zinc-400" />
            <span>Pacta Protocol Stream // Packet Feed</span>
          </div>
          <span className="hidden sm:inline-block text-[10px] text-zinc-500 px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800">
            TLS 1.3 // LIVE
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setIsPaused(!isPaused);
            }}
            className={`px-2 py-0.5 rounded text-[10px] flex items-center gap-1 transition-colors ${
              isPaused
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'
            }`}
          >
            {isPaused ? <Play className="h-2.5 w-2.5" /> : <Pause className="h-2.5 w-2.5" />}
            <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setLogs([]);
            }}
            className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
            title="Clear Log"
          >
            <Trash2 className="h-3 w-3" />
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setIsCollapsed(!isCollapsed);
            }}
            className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 transition-colors"
          >
            {isCollapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Console Streaming Body */}
      {!isCollapsed && (
        <div
          ref={containerRef}
          className="h-36 sm:h-44 overflow-y-auto p-3 space-y-1 bg-[#05070a]/90 select-text"
        >
          {logs.length === 0 ? (
            <div className="text-zinc-600 text-center py-6 text-[11px]">Stream buffer empty. Awaiting packets...</div>
          ) : (
            logs.map((pkt) => (
              <div
                key={pkt.id}
                className="flex items-start gap-2 text-[11px] leading-relaxed hover:bg-zinc-900/40 px-1 py-0.5 rounded transition-colors"
              >
                <span className="text-zinc-500 shrink-0">{pkt.time}</span>
                <span
                  className={`px-1.5 py-0.2 rounded border text-[9px] font-bold uppercase tracking-wider shrink-0 ${getTagBadge(
                    pkt.protocol
                  )}`}
                >
                  {pkt.protocol}
                </span>
                <span className="text-zinc-300 flex-1">{pkt.message}</span>
                {pkt.hash && <span className="text-zinc-600 text-[10px] shrink-0 hidden md:inline">{pkt.hash}</span>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
