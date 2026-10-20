'use client';

import React, { useState } from 'react';
import { Sparkles, Shield, Send, Loader2, ArrowRight } from 'lucide-react';
import { Contract } from '@/types';

interface AgentMissionInputProps {
  onContractCreated: (newContract: Contract) => void;
}

const PRESETS = [
  {
    title: 'Smart Contract & API Security Audit',
    category: 'Security' as const,
    budget: 250,
    objective: 'Perform automated static analysis, pen-testing, and deliver a vulnerability report with remediation patches.',
  },
  {
    title: 'App Localization: Japanese & German',
    category: 'Localization' as const,
    budget: 150,
    objective: 'Translate 450 UI keys, refine localized terminology, and generate cultural UX QA validation report.',
  },
  {
    title: 'Synthetic FinTech Benchmark Dataset',
    category: 'Data Science' as const,
    budget: 200,
    objective: 'Generate 100,000 synthetic transaction records with fraud edge-cases and schema validation.',
  },
];

export default function AgentMissionInput({ onContractCreated }: AgentMissionInputProps) {
  const [objective, setObjective] = useState('');
  const [category, setCategory] = useState<'Security' | 'Localization' | 'Engineering' | 'Data Science' | 'Design'>('Security');
  const [totalBudget, setTotalBudget] = useState(250);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!objective.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          objective,
          category,
          totalBudget,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to negotiate contract');
      }

      onContractCreated(data.contract);
      setObjective('');
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Error creating mission');
    } finally {
      setIsLoading(false);
    }
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setObjective(preset.objective);
    setCategory(preset.category);
    setTotalBudget(preset.budget);
  };

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 mb-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Sparkles className="h-4 w-4" />
            </span>
            <h2 className="text-lg font-semibold text-zinc-100">
              Autonomous Agent Procurement Mission
            </h2>
          </div>
          <p className="text-xs text-zinc-400">
            Command your Buyer Agent to formulate milestones, negotiate terms, and set up PayPal escrow.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.title}
              type="button"
              onClick={() => applyPreset(preset)}
              className="text-[11px] px-2.5 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 hover:text-white border border-zinc-700/50 transition-all flex items-center gap-1.5"
            >
              <span>{preset.title.split(':')[0]}</span>
              <span className="font-mono text-cyan-400 font-semibold">${preset.budget}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Objective Textarea */}
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">
            Mission Objective & Deliverable Scope
          </label>
          <textarea
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            rows={3}
            placeholder="e.g. Procure an enterprise security pen-test report for our payment microservice, find vulnerabilities, and create verified pull request..."
            className="w-full bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/80 transition-all resize-none"
            required
          />
        </div>

        {/* Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="Security">🛡️ Security & Audits</option>
              <option value="Localization">🌐 App Localization</option>
              <option value="Engineering">⚙️ Backend & APIs</option>
              <option value="Data Science">📊 Data & ML Training</option>
              <option value="Design">🎨 UI/UX & Design</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Escrow Budget Allocation (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-zinc-500 text-xs font-mono">$</span>
              <input
                type="number"
                min={20}
                max={5000}
                step={5}
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl pl-7 pr-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                required
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isLoading || !objective.trim()}
              className="w-full h-[38px] rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Negotiating Terms...</span>
                </>
              ) : (
                <>
                  <span>Deploy & Negotiate Contract</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
