'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { Contract } from '@/types';
import { getByokHeaders } from '@/lib/credentials';
import { sound } from '@/lib/audio';

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

    sound.playClick();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/contracts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getByokHeaders(),
        },
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
    sound.playClick();
    setObjective(preset.objective);
    setCategory(preset.category);
    setTotalBudget(preset.budget);
  };

  return (
    <div className="bg-white border border-[#E5E4DE] rounded-2xl p-6 sm:p-8 mb-8 shadow-xs relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-zinc-900 text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            <h2 className="text-xl font-serif font-bold text-zinc-900">
              Autonomous Agent Procurement Mission
            </h2>
          </div>
          <p className="text-xs text-zinc-500">
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
              className="text-[11px] px-3 py-1.5 rounded-full bg-[#FAF9F6] hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900 border border-[#E5E4DE] transition-all flex items-center gap-1.5 cursor-pointer font-medium"
            >
              <span>{preset.title.split(':')[0]}</span>
              <span className="font-mono text-emerald-700 font-bold">${preset.budget}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Objective Textarea */}
        <div>
          <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
            Mission Objective &amp; Deliverable Scope
          </label>
          <textarea
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            rows={3}
            placeholder="e.g. Procure an enterprise security pen-test report for our payment microservice, find vulnerabilities, and create verified pull request..."
            className="w-full bg-[#FAF9F6] border border-[#E5E4DE] rounded-xl p-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 focus:border-zinc-900 transition-all resize-none"
            required
          />
        </div>

        {/* Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-[#FAF9F6] border border-[#E5E4DE] rounded-xl px-3 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
            >
              <option value="Security">🛡️ Security &amp; Audits</option>
              <option value="Localization">🌐 App Localization</option>
              <option value="Engineering">⚙️ Backend &amp; APIs</option>
              <option value="Data Science">📊 Data &amp; ML Training</option>
              <option value="Design">🎨 UI/UX &amp; Design</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
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
                className="w-full bg-[#FAF9F6] border border-[#E5E4DE] rounded-xl pl-7 pr-3 py-2 text-xs font-mono text-zinc-900 focus:outline-none focus:border-zinc-900"
                required
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isLoading || !objective.trim()}
              className="w-full h-9.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Negotiating Terms...</span>
                </>
              ) : (
                <>
                  <span>Deploy &amp; Negotiate Contract</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
