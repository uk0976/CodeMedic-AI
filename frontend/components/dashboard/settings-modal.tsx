"use client";

import { useState } from "react";
import { X, Key, Cpu, Moon, Check, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [model, setModel] = useState("OpenAI Codex (Default)");
  const [apiKey, setApiKey] = useState("gsk_d8shF4vUu58M... (Saved in Env)");
  const [showKey, setShowKey] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [theme, setTheme] = useState("Dark Glassmorphism");
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="glass-panel relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/95 p-6 shadow-[0_0_50px_rgba(6,182,212,0.15)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400">
              <Sparkles className="size-4.5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">System Settings</h3>
              <p className="text-xs text-slate-400">
                Configure AI models, API credentials, and preferences
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body Form */}
        <div className="my-5 space-y-4">
          {/* Default AI Engine */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <Cpu className="size-3.5 text-cyan-400" /> Default AI Provider Engine
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2 text-xs font-semibold text-white outline-none focus:border-cyan-500/40"
            >
              <option value="OpenAI Codex (Default)" className="bg-slate-950">
                OpenAI Codex (Default)
              </option>
              <option value="Groq Llama 3.3 70B" className="bg-slate-950">
                Groq Llama 3.3 70B (High Speed)
              </option>
              <option value="Gemini 3.5 Pro" className="bg-slate-950">
                Gemini 3.5 Pro
              </option>
            </select>
          </div>

          {/* API Key Config */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <Key className="size-3.5 text-cyan-400" /> Custom API Key (Optional)
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/60 py-2 pl-3.5 pr-20 text-xs text-slate-200 outline-none focus:border-cyan-500/40"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-slate-800 px-2 py-1 text-[10px] font-semibold text-slate-300 hover:text-white"
              >
                {showKey ? "Hide" : "Show"}
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              Leave blank to use pre-configured production system keys on Render backend.
            </p>
          </div>

          {/* Preferences */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1 text-xs font-bold text-slate-300">
                <Moon className="size-3.5 text-cyan-400" /> Interface Theme
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-200 outline-none"
              >
                <option value="Dark Glassmorphism" className="bg-slate-950">
                  Dark Glassmorphism
                </option>
                <option value="Cyberpunk Neon" className="bg-slate-950">
                  Cyberpunk Neon
                </option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1 text-xs font-bold text-slate-300">
                <ShieldCheck className="size-3.5 text-emerald-400" /> Auto-Save Reports
              </label>
              <button
                type="button"
                onClick={() => setAutoSave(!autoSave)}
                className={`w-full rounded-xl border py-2 text-xs font-semibold transition ${
                  autoSave
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border-slate-800 bg-slate-900/40 text-slate-500"
                }`}
              >
                {autoSave ? "Enabled" : "Disabled"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
          <span className="text-[10px] text-slate-500">CodeMedic AI v2.5.0 • Build 2026</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:brightness-110"
            >
              {saved ? <Check className="size-3.5" /> : null}
              <span>{saved ? "Saved!" : "Save Settings"}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
