"use client";

import { 
  Sparkles, 
  Cpu, 
  Clock, 
  Settings, 
  BadgeAlert,
  HelpCircle,
  FileCode2
} from "lucide-react";

interface EditorRightPanelProps {
  language: string;
  totalChars: number;
  analysisType: "Bug Detection" | "Security Scan" | "Performance Optimization" | "Code Review" | "Documentation" | "Generate Tests";
}

export function EditorRightPanel({
  language,
  totalChars,
  analysisType
}: EditorRightPanelProps) {
  // Estimate tokens: roughly 1 token = 4 characters
  const estimatedTokens = Math.ceil(totalChars / 4);

  // Estimate analysis time: min 2s, +1s per 500 tokens
  const estimatedTime = totalChars === 0 ? 0 : Math.max(2, Math.ceil(estimatedTokens / 500) + 1);

  const isReady = totalChars > 0;

  const getModeDescription = (mode: string) => {
    switch (mode) {
      case "Bug Detection":
        return "Runs static analysis to find logic flows, null reference issues, and exception handling gaps.";
      case "Security Scan":
        return "Scans code for secrets/keys exposure, SQL injections, XSS, and weak cryptography.";
      case "Performance Optimization":
        return "Audits runtime complexity (Big O), loops, recursion, and suggests memory/caching efficiency gains.";
      case "Code Review":
        return "Evaluates code readability, clean code design patterns, structuring rules, and maintainability.";
      case "Documentation":
        return "Generates descriptive docstrings, inline comments, and functional explanations.";
      case "Generate Tests":
        return "Generates mock unit test suites with coverage scenarios using the corresponding test frameworks.";
      default:
        return "Select a quick diagnostic mode below.";
    }
  };

  return (
    <div className="flex h-full w-80 flex-col gap-5 border-l border-slate-800/80 bg-slate-950/80 p-5 text-slate-100 overflow-y-auto">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4.5 text-cyan-400" />
        <span className="text-xs font-bold text-white uppercase tracking-wider text-slate-500">AI Preview Panel</span>
      </div>

      {/* Metrics Card */}
      <div className="glass-panel rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-4">
        {/* Metric row */}
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
            <FileCode2 className="size-3.5 text-slate-500" /> Selected Language
          </span>
          <span className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-2 py-0.5 text-[10px] font-bold text-cyan-300 uppercase">
            {language}
          </span>
        </div>

        {/* Metric row */}
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
            <Cpu className="size-3.5 text-slate-500" /> Est. Tokens
          </span>
          <span className="text-xs font-bold text-slate-200">
            {estimatedTokens.toLocaleString()}
          </span>
        </div>

        {/* Metric row */}
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
            <Clock className="size-3.5 text-slate-500" /> Est. Scan Time
          </span>
          <span className="text-xs font-bold text-slate-200">
            {estimatedTime > 0 ? `${estimatedTime}s` : "0s"}
          </span>
        </div>

        {/* Metric row */}
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
            <Settings className="size-3.5 text-slate-500" /> Analysis Type
          </span>
          <span className="text-xs font-bold text-slate-200">
            {analysisType}
          </span>
        </div>

        {/* Metric row */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
            <BadgeAlert className="size-3.5 text-slate-500" /> Scan Status
          </span>
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold border ${
            isReady 
              ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" 
              : "border-slate-800 bg-slate-900/40 text-slate-500"
          }`}>
            <span className={`size-1.5 rounded-full ${isReady ? "bg-emerald-400 animate-pulse" : "bg-slate-700"}`} />
            {isReady ? "READY" : "AWAITING CODE"}
          </span>
        </div>
      </div>

      {/* Mode Details Section */}
      <div className="glass-panel rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">
        <h3 className="text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
          <HelpCircle className="size-3.5 text-cyan-400" />
          {analysisType} Overview
        </h3>
        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
          {getModeDescription(analysisType)}
        </p>
      </div>

      {/* Info Warning */}
      <div className="rounded-xl border border-blue-500/10 bg-blue-500/5 p-3.5">
        <p className="text-[10px] text-blue-400 leading-normal font-medium">
          <strong>Note:</strong> This panel is in simulation preview mode. The diagnostic dashboard does not perform actual network API code scans in this hackathon staging version.
        </p>
      </div>
    </div>
  );
}
