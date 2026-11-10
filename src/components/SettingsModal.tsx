'use client';

import React, { useState, useEffect } from 'react';
import {
  Key,
  Shield,
  CreditCard,
  Sparkles,
  Search,
  CheckCircle2,
  X,
  Save,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { getStoredCredentials, saveStoredCredentials, clearStoredCredentials, ByokCredentials } from '@/lib/credentials';
import { sound } from '@/lib/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [creds, setCreds] = useState<ByokCredentials>({
    paypalClientId: '',
    paypalClientSecret: '',
    geminiApiKey: '',
    tavilyApiKey: '',
  });
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCreds(getStoredCredentials());
      setSavedMessage(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    saveStoredCredentials(creds);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  const handleClear = () => {
    sound.playClick();
    clearStoredCredentials();
    setCreds({
      paypalClientId: '',
      paypalClientSecret: '',
      geminiApiKey: '',
      tavilyApiKey: '',
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  const handleFillSandboxPresets = () => {
    sound.playClick();
    setCreds({
      paypalClientId: 'AbcSandboxClientId_devpost_sample_2026',
      paypalClientSecret: 'EyzSandboxSecret_paypal_hackathon_demo',
      geminiApiKey: '',
      tavilyApiKey: '',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-[#FAF9F6] border border-[#E5E4DE] rounded-2xl shadow-2xl p-6 sm:p-7 overflow-hidden text-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E4DE]">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center">
              <Key className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-zinc-900 flex items-center gap-2">
                <span>BYOK Protocol Keys</span>
                <span className="text-[10px] font-sans font-mono px-2 py-0.5 rounded-full bg-[#EFECE6] text-zinc-700 border border-[#E5E4DE]">
                  Client-Side Encrypted
                </span>
              </h2>
              <p className="text-xs text-zinc-500">
                Supply your API keys directly or rely on Pacta&apos;s built-in sandbox fallbacks.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-white hover:bg-zinc-100 border border-[#E5E4DE] text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Status Callout */}
        <div className="my-4 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3 text-xs text-emerald-950">
          <Shield className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
          <p>
            Keys are stored strictly in your local browser <code className="text-emerald-900 font-mono font-bold">localStorage</code> and transmitted exclusively as ephemeral headers during API execution. Zero remote key storage.
          </p>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSave} className="space-y-4">
          {/* 1. PayPal Developer Credentials */}
          <div className="space-y-2 p-4 rounded-xl bg-white border border-[#E5E4DE]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-900 flex items-center gap-1.5 font-mono uppercase">
                <CreditCard className="h-3.5 w-3.5 text-zinc-700" />
                <span>PayPal Sandbox Credentials</span>
              </label>
              <a
                href="https://developer.paypal.com/dashboard/applications/sandbox"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-zinc-500 hover:text-zinc-900 flex items-center gap-1 font-mono"
              >
                <span>PayPal Dashboard</span>
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>

            <div className="space-y-2 pt-1">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Client ID</span>
                <input
                  type="text"
                  value={creds.paypalClientId}
                  onChange={(e) => setCreds({ ...creds, paypalClientId: e.target.value })}
                  placeholder="e.g. A21AAK... or leave blank for Sandbox Emulation"
                  className="w-full bg-[#FAF9F6] border border-[#E5E4DE] rounded-xl px-3 py-2 text-xs font-mono text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Client Secret</span>
                <input
                  type="password"
                  value={creds.paypalClientSecret}
                  onChange={(e) => setCreds({ ...creds, paypalClientSecret: e.target.value })}
                  placeholder="e.g. EKG129... or leave blank for Sandbox Emulation"
                  className="w-full bg-[#FAF9F6] border border-[#E5E4DE] rounded-xl px-3 py-2 text-xs font-mono text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900"
                />
              </div>
            </div>
          </div>

          {/* 2. Google Gemini API Key */}
          <div className="space-y-2 p-4 rounded-xl bg-white border border-[#E5E4DE]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-900 flex items-center gap-1.5 font-mono uppercase">
                <Sparkles className="h-3.5 w-3.5 text-zinc-700" />
                <span>Google Gemini API Key</span>
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-zinc-500 hover:text-zinc-900 flex items-center gap-1 font-mono"
              >
                <span>Google AI Studio</span>
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
            <input
              type="password"
              value={creds.geminiApiKey}
              onChange={(e) => setCreds({ ...creds, geminiApiKey: e.target.value })}
              placeholder="AIzaSy... (Used by Gemini 3.5 Planner & Verification AI Judge)"
              className="w-full bg-[#FAF9F6] border border-[#E5E4DE] rounded-xl px-3 py-2 text-xs font-mono text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900"
            />
          </div>

          {/* 3. Tavily API Key */}
          <div className="space-y-2 p-4 rounded-xl bg-white border border-[#E5E4DE]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-900 flex items-center gap-1.5 font-mono uppercase">
                <Search className="h-3.5 w-3.5 text-zinc-700" />
                <span>Tavily Search API Key</span>
              </label>
              <a
                href="https://app.tavily.com"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-zinc-500 hover:text-zinc-900 flex items-center gap-1 font-mono"
              >
                <span>Tavily Console</span>
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
            <input
              type="password"
              value={creds.tavilyApiKey}
              onChange={(e) => setCreds({ ...creds, tavilyApiKey: e.target.value })}
              placeholder="tvly-... (Powers real-time market rate & milestone scoping intelligence)"
              className="w-full bg-[#FAF9F6] border border-[#E5E4DE] rounded-xl px-3 py-2 text-xs font-mono text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900"
            />
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-[#E5E4DE] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleFillSandboxPresets}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-100 border border-[#E5E4DE] text-zinc-700 text-[11px] font-mono transition-colors cursor-pointer"
              >
                Fill Mock Presets
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[11px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Trash2 className="h-3 w-3" />
                <span>Clear All</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {savedMessage && (
                <span className="text-xs text-emerald-700 font-mono font-bold flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Saved!
                </span>
              )}
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Keys</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
