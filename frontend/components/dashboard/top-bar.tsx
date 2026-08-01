"use client";

import { useState } from "react";
import { Search, Menu, ChevronDown, Cpu, Moon, Sun, Activity } from "lucide-react";

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const [model, setModel] = useState("Gemini 3.5 Flash");
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const models = ["Gemini 3.5 Flash", "Gemini 3.5 Pro", "OpenAI Codex (Default)"];

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/60 px-6 backdrop-blur-md">
      {/* Search Bar / Menu Button */}
      <div className="flex flex-1 items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-white lg:hidden"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="size-5" />
        </button>

        <div className="relative hidden max-w-md flex-1 md:block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search analysis history, files, or reports..."
            className="w-full rounded-xl border border-slate-800/80 bg-slate-900/40 py-2 pl-10 pr-4 text-xs text-slate-300 placeholder-slate-500 outline-none transition focus:border-cyan-500/30 focus:bg-slate-900/80"
          />
        </div>
      </div>

      {/* Utilities */}
      <div className="gap-4.5 flex items-center">
        {/* Status indicator */}
        <div className="hidden items-center gap-2 rounded-full border border-emerald-500/10 bg-emerald-500/5 px-3 py-1 text-[11px] font-semibold text-emerald-400 lg:flex">
          <Activity className="size-3.5 text-emerald-400" />
          <span>System: Operational</span>
        </div>

        {/* Model Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
            className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 px-3.5 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white"
          >
            <Cpu className="size-3.5 text-cyan-400" />
            <span>{model}</span>
            <ChevronDown className="size-3 text-slate-400" />
          </button>

          {isModelDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsModelDropdownOpen(false)} />
              <div className="absolute right-0 z-20 mt-2 w-52 origin-top-right rounded-xl border border-slate-800 bg-slate-950 p-1.5 shadow-2xl">
                {models.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setModel(m);
                      setIsModelDropdownOpen(false);
                    }}
                    className={`w-full rounded-lg px-3 py-2 text-left text-xs font-medium transition ${
                      m === model
                        ? "bg-cyan-500/10 text-cyan-400"
                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={() => setIsDarkTheme(!isDarkTheme)}
          className="rounded-xl border border-slate-800 bg-slate-900/50 p-2 text-slate-400 transition hover:bg-slate-900 hover:text-white"
          aria-label="Toggle theme"
        >
          {isDarkTheme ? <Moon className="size-4" /> : <Sun className="size-4" />}
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2.5">
          <div className="relative size-8 overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950 text-xs font-semibold text-white">
              HE
            </div>
          </div>
          <div className="hidden flex-col items-start xl:flex">
            <span className="text-xs font-semibold text-slate-200">Evaluator</span>
            <span className="text-[10px] text-slate-500">Live Demo Mode</span>
          </div>
        </div>
      </div>
    </header>
  );
}
