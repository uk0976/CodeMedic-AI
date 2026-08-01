"use client";

import { useState } from "react";
import {
  Sparkles,
  Cpu,
  Clock,
  Settings,
  BadgeAlert,
  HelpCircle,
  FileCode2,
  Bug,
  ShieldCheck,
  Zap,
  Code2,
  CheckCircle2,
  Clipboard,
  TrendingUp,
} from "lucide-react";

export interface AnalysisResult {
  summary: string;
  issues: {
    title: string;
    description: string;
    severity: string; // "high" | "medium" | "low"
    line?: number;
    fix?: string;
  }[];
  security: {
    finding: string;
    severity: string;
    fix?: string;
  }[];
  performance: {
    issue: string;
    impact: string;
    fix?: string;
  }[];
  optimized_code: string;
  complexity: {
    time: string;
    space: string;
  };
  tests: string[];
  confidence: number;
}

interface EditorRightPanelProps {
  language: string;
  totalChars: number;
  analysisType:
    | "Bug Detection"
    | "Security Scan"
    | "Performance Optimization"
    | "Code Review"
    | "Documentation"
    | "Generate Tests";
  results: AnalysisResult | null;
  onApplyFix: (code: string) => void;
}

export function EditorRightPanel({
  language,
  totalChars,
  analysisType,
  results,
  onApplyFix,
}: EditorRightPanelProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "issues" | "security" | "performance" | "code" | "tests"
  >("overview");

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

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "text-red-400 border-red-500/20 bg-red-500/5";
      case "medium":
        return "text-amber-400 border-amber-500/20 bg-amber-500/5";
      case "low":
        return "text-cyan-400 border-cyan-500/20 bg-cyan-500/5";
      default:
        return "text-slate-400 border-slate-800 bg-slate-900/40";
    }
  };

  const handleCopyTests = () => {
    if (results && results.tests.length > 0) {
      navigator.clipboard.writeText(results.tests.join("\n\n"));
      alert("Tests copied to clipboard.");
    }
  };

  // If no results are available, show the default preview card
  if (!results) {
    return (
      <div className="flex h-full w-80 flex-col gap-5 overflow-y-auto border-l border-slate-800/80 bg-slate-950/80 p-5 text-slate-100">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4.5 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 text-white">
            AI Preview Panel
          </span>
        </div>

        {/* Metrics Card */}
        <div className="glass-panel space-y-4 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
              <FileCode2 className="size-3.5 text-slate-500" /> Selected Language
            </span>
            <span className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-2 py-0.5 text-[10px] font-bold uppercase text-cyan-300">
              {language}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
              <Cpu className="size-3.5 text-slate-500" /> Est. Tokens
            </span>
            <span className="text-xs font-bold text-slate-200">
              {estimatedTokens.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
              <Clock className="size-3.5 text-slate-500" /> Est. Scan Time
            </span>
            <span className="text-xs font-bold text-slate-200">
              {estimatedTime > 0 ? `${estimatedTime}s` : "0s"}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
              <Settings className="size-3.5 text-slate-500" /> Analysis Type
            </span>
            <span className="text-xs font-bold text-slate-200">{analysisType}</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
              <BadgeAlert className="size-3.5 text-slate-500" /> Scan Status
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold ${
                isReady
                  ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                  : "border-slate-800 bg-slate-900/40 text-slate-500"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${isReady ? "animate-pulse bg-emerald-400" : "bg-slate-700"}`}
              />
              {isReady ? "READY" : "AWAITING CODE"}
            </span>
          </div>
        </div>

        {/* Mode Details Section */}
        <div className="glass-panel rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">
          <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-200">
            <HelpCircle className="size-3.5 text-cyan-400" />
            {analysisType} Overview
          </h3>
          <p className="text-[11px] font-medium leading-relaxed text-slate-400">
            {getModeDescription(analysisType)}
          </p>
        </div>

        {/* Info Warning */}
        <div className="rounded-xl border border-blue-500/10 bg-blue-500/5 p-3.5">
          <p className="text-[10px] font-medium leading-normal text-blue-400">
            <strong>Staging Environment:</strong> Analysis runs real OpenAI API completions. Ensure
            you configure your `OPENAI_API_KEY` in the backend environment.
          </p>
        </div>
      </div>
    );
  }

  // If results are ready, render the full diagnostics interface
  return (
    <div className="flex h-full w-80 flex-col overflow-hidden border-l border-slate-800/80 bg-slate-950/90 text-slate-100">
      {/* Top Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-900 bg-slate-950 p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4.5 text-cyan-400" />
          <span className="text-xs font-bold tracking-tight text-white">Diagnostics Report</span>
        </div>
        <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2 py-0.5 text-[9px] font-bold text-cyan-400">
          Score: {results.confidence}%
        </span>
      </div>

      {/* Tabs Header Navigation */}
      <div className="grid shrink-0 grid-cols-6 gap-0.5 border-b border-slate-900 bg-slate-950/40 p-1 text-[10px] font-semibold text-slate-400">
        {[
          { id: "overview", label: "Overview", icon: FileCode2 },
          { id: "issues", label: "Bugs", icon: Bug },
          { id: "security", label: "Sec", icon: ShieldCheck },
          { id: "performance", label: "Perf", icon: Zap },
          { id: "code", label: "Fix", icon: Code2 },
          { id: "tests", label: "Test", icon: Clipboard },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() =>
                setActiveTab(
                  tab.id as "overview" | "issues" | "security" | "performance" | "code" | "tests",
                )
              }
              className={`flex flex-col items-center justify-center rounded-lg border py-2.5 transition ${
                isActive
                  ? "border-slate-800 bg-slate-900 text-cyan-400"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
              title={tab.label}
            >
              <Icon className="mb-1 size-4" />
              <span className="origin-center scale-[0.9]">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab panel container */}
      <div className="p-4.5 flex-1 space-y-4 overflow-y-auto bg-[#070913]">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-4.5">
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-200 text-slate-500">
                Executive Summary
              </h3>
              <p className="rounded-2xl border border-slate-800/60 bg-slate-900/30 p-4 text-xs leading-relaxed text-slate-300">
                {results.summary}
              </p>
            </div>

            {/* Complexity and Rating */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-3.5">
                <span className="block text-[10px] font-bold text-slate-500">TIME COMPLEXITY</span>
                <span className="mt-1 block font-mono text-xs font-extrabold text-white">
                  {results.complexity.time}
                </span>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-3.5">
                <span className="block text-[10px] font-bold text-slate-500">SPACE COMPLEXITY</span>
                <span className="mt-1 block font-mono text-xs font-extrabold text-white">
                  {results.complexity.space}
                </span>
              </div>
            </div>

            <div className="p-4.5 flex items-center justify-between rounded-2xl border border-emerald-500/10 bg-emerald-500/5">
              <div>
                <span className="block text-[10px] font-bold uppercase text-slate-500">
                  Analysis Confidence
                </span>
                <p className="mt-1 text-[11px] leading-normal text-slate-400">
                  Highly verified scanning confidence metric based on Codex rules.
                </p>
              </div>
              <span className="text-3xl font-extrabold text-emerald-400">
                {results.confidence}%
              </span>
            </div>
          </div>
        )}

        {/* ISSUES TAB */}
        {activeTab === "issues" && (
          <div className="space-y-3.5">
            <h3 className="px-1 text-xs font-bold uppercase tracking-wider text-slate-200 text-slate-500">
              Detected Bugs
            </h3>
            {results.issues.length === 0 ? (
              <div className="py-8 text-center text-xs font-semibold text-slate-500">
                No code issues detected.
              </div>
            ) : (
              results.issues.map((issue, idx) => (
                <div
                  key={idx}
                  className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/40 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="max-w-[150px] truncate text-xs font-bold text-slate-200">
                      {issue.title}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-lg border px-1.5 py-0.5 text-[9px] font-bold uppercase ${getSeverityColor(issue.severity)}`}
                    >
                      {issue.severity}
                    </span>
                  </div>
                  <p className="text-[11px] leading-normal text-slate-400">{issue.description}</p>
                  {issue.line !== undefined && (
                    <span className="block max-w-max rounded-md bg-slate-950/40 px-2 py-0.5 font-mono text-[10px] text-cyan-400">
                      Line {issue.line}
                    </span>
                  )}
                  {issue.fix && (
                    <div className="mt-2.5 border-t border-slate-800/60 pt-2.5">
                      <span className="block text-[9px] font-bold uppercase text-slate-500">
                        Recommended Fix:
                      </span>
                      <p className="mt-1 rounded-lg bg-slate-950 p-2 font-mono text-[10px] leading-normal text-slate-300">
                        {issue.fix}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === "security" && (
          <div className="space-y-3.5">
            <h3 className="px-1 text-xs font-bold uppercase tracking-wider text-slate-200 text-slate-500">
              Security Findings
            </h3>
            {results.security.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center text-xs font-semibold text-slate-500">
                <CheckCircle2 className="size-6 text-emerald-500" />
                <span>Zero security holes found.</span>
              </div>
            ) : (
              results.security.map((sec, idx) => (
                <div
                  key={idx}
                  className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/40 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="max-w-[150px] truncate text-xs font-bold text-slate-200">
                      Vulnerability
                    </span>
                    <span
                      className={`inline-flex items-center rounded-lg border px-1.5 py-0.5 text-[9px] font-bold uppercase ${getSeverityColor(sec.severity)}`}
                    >
                      {sec.severity}
                    </span>
                  </div>
                  <p className="text-[11px] leading-normal text-slate-400">{sec.finding}</p>
                  {sec.fix && (
                    <div className="mt-2 border-t border-slate-800/60 pt-2 text-[10px]">
                      <span className="block font-bold uppercase text-slate-500">
                        Fix Recommendation:
                      </span>
                      <p className="mt-1 rounded bg-slate-950 p-2 font-mono text-slate-300">
                        {sec.fix}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* PERFORMANCE TAB */}
        {activeTab === "performance" && (
          <div className="space-y-3.5">
            <h3 className="px-1 text-xs font-bold uppercase tracking-wider text-slate-200 text-slate-500">
              Optimization Reports
            </h3>
            {results.performance.length === 0 ? (
              <div className="py-8 text-center text-xs font-semibold text-slate-500">
                No optimization issues found.
              </div>
            ) : (
              results.performance.map((perf, idx) => (
                <div
                  key={idx}
                  className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/40 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 truncate text-xs font-bold text-slate-200">
                      <TrendingUp className="size-3.5 text-cyan-400" /> Bottleneck
                    </span>
                    <span className="text-[10px] font-semibold text-cyan-300">{perf.impact}</span>
                  </div>
                  <p className="text-[11px] leading-normal text-slate-400">{perf.issue}</p>
                  {perf.fix && (
                    <div className="mt-2 border-t border-slate-800/60 pt-2 text-[10px]">
                      <span className="block font-bold uppercase text-slate-500">Resolution:</span>
                      <p className="mt-1 rounded bg-slate-950 p-2 font-mono text-slate-300">
                        {perf.fix}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* CODE TAB */}
        {activeTab === "code" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 text-slate-500">
                Refactored Code
              </h3>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(results.optimized_code);
                  alert("Optimized code copied.");
                }}
                className="flex items-center gap-1 text-[10px] font-bold text-cyan-400 transition hover:text-cyan-300"
              >
                Copy
              </button>
            </div>

            <div className="max-h-72 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 p-3.5 font-mono text-[10px] text-slate-300">
              <pre className="whitespace-pre-wrap leading-relaxed">{results.optimized_code}</pre>
            </div>

            <button
              type="button"
              onClick={() => onApplyFix(results.optimized_code)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/10 transition hover:brightness-110"
            >
              <CheckCircle2 className="size-4" /> Apply Optimized Code
            </button>
          </div>
        )}

        {/* TESTS TAB */}
        {activeTab === "tests" && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 text-slate-500">
                Test Suggestions
              </h3>
              {results.tests.length > 0 && (
                <button
                  type="button"
                  onClick={handleCopyTests}
                  className="flex items-center gap-1 text-[10px] font-bold text-cyan-400 transition hover:text-cyan-300"
                >
                  Copy All
                </button>
              )}
            </div>

            {results.tests.length === 0 ? (
              <div className="py-8 text-center text-xs font-semibold text-slate-500">
                No test suggestions generated.
              </div>
            ) : (
              results.tests.map((test, idx) => (
                <div
                  key={idx}
                  className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 p-3.5 font-mono text-[10px] text-slate-300"
                >
                  <pre className="whitespace-pre-wrap leading-relaxed">{test}</pre>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
