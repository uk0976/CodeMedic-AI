"use client";

import { Bug, ShieldAlert, Zap, MessageSquareCode, BookOpen, TestTube } from "lucide-react";
import { motion } from "framer-motion";

export type AnalysisMode =
  | "Bug Detection"
  | "Security Scan"
  | "Performance Optimization"
  | "Code Review"
  | "Documentation"
  | "Generate Tests";

interface QuickModeCardsProps {
  selectedMode: AnalysisMode;
  onSelectMode: (mode: AnalysisMode) => void;
}

interface ModeCard {
  label: AnalysisMode;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export function QuickModeCards({ selectedMode, onSelectMode }: QuickModeCardsProps) {
  const modes: ModeCard[] = [
    {
      label: "Bug Detection",
      icon: Bug,
      color: "text-red-400 bg-red-500/5 border-red-500/10 hover:border-red-500/30",
    },
    {
      label: "Security Scan",
      icon: ShieldAlert,
      color: "text-amber-400 bg-amber-500/5 border-amber-500/10 hover:border-amber-500/30",
    },
    {
      label: "Performance Optimization",
      icon: Zap,
      color: "text-cyan-400 bg-cyan-500/5 border-cyan-500/10 hover:border-cyan-500/30",
    },
    {
      label: "Code Review",
      icon: MessageSquareCode,
      color: "text-blue-400 bg-blue-500/5 border-blue-500/10 hover:border-blue-500/30",
    },
    {
      label: "Documentation",
      icon: BookOpen,
      color: "text-purple-400 bg-purple-500/5 border-purple-500/10 hover:border-purple-500/30",
    },
    {
      label: "Generate Tests",
      icon: TestTube,
      color: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10 hover:border-emerald-500/30",
    },
  ];

  return (
    <div className="border-t border-slate-900 bg-slate-950/40 p-4">
      <p className="mb-3 px-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
        Select Analysis Mode
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = selectedMode === mode.label;
          return (
            <motion.button
              key={mode.label}
              type="button"
              whileHover={{ y: -2 }}
              onClick={() => onSelectMode(mode.label)}
              className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                isActive
                  ? "border-cyan-500/40 bg-slate-900 text-cyan-400 shadow-md shadow-cyan-500/5"
                  : `border-slate-800/80 bg-slate-950/40 text-slate-400 hover:text-slate-200 ${mode.color}`
              }`}
            >
              <div
                className={`size-7.5 flex items-center justify-center rounded-lg border ${
                  isActive
                    ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-400"
                    : "border-slate-800 bg-slate-900/60 text-slate-400"
                }`}
              >
                <Icon className="size-4" />
              </div>
              <span className="text-[11px] font-bold tracking-tight">{mode.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
