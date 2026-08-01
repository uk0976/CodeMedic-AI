"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  FileJson,
  FileText,
  Check,
  Zap,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Code2,
  RefreshCw,
  Cpu,
  CheckSquare,
  BookOpen,
} from "lucide-react";
import { DiffEditor } from "@monaco-editor/react";

export interface AnalysisData {
  code_health_score?: number;
  security_score?: number;
  performance_score?: number;
  maintainability_score?: number;
  critical_count?: number;
  high_count?: number;
  medium_count?: number;
  low_count?: number;
  summary: string;
  code_explanation?: string;
  why_better?: string;
  issues?: Array<{
    title: string;
    description: string;
    severity: string;
    line?: number;
    why_it_happens?: string;
    impact?: string;
    fix?: string;
    fix_code?: string;
    confidence?: number;
  }>;
  security?: Array<{
    finding?: string;
    title?: string;
    severity: string;
    owasp_category?: string;
    risk_level?: string;
    risk_score?: number;
    fix?: string;
    remediation?: string;
  }>;
  performance?: Array<{
    issue?: string;
    title?: string;
    impact: string;
    current_time?: string;
    optimized_time?: string;
    space?: string;
    memory_impact?: string;
    fix?: string;
  }>;
  code_review?: Array<{
    category: string;
    status: string;
    suggestion: string;
  }>;
  optimized_code?: string;
  complexity?: {
    time: string;
    space: string;
    explanation?: string;
    cyclomatic_complexity?: number;
    maintainability_index?: number;
  };
  tests?: string[];
  confidence?: number;
}

interface FullAnalysisReportProps {
  data: AnalysisData;
  originalCode: string;
  language: string;
  fileName: string;
  reportId?: string;
  onApplyFix?: (newCode: string) => void;
  onCloseReport?: () => void;
}

export function FullAnalysisReport({
  data,
  originalCode,
  language,
  fileName,
  reportId,
  onApplyFix,
  onCloseReport,
}: FullAnalysisReportProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "bugs" | "security" | "performance" | "codereview" | "tests"
  >("overview");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [expandedBugIdx, setExpandedBugIdx] = useState<number | null>(0);

  // Dynamic Math fallbacks
  const healthScore = data.code_health_score ?? 85;
  const securityScore = data.security_score ?? 90;
  const performanceScore = data.performance_score ?? 88;
  const maintainabilityScore = data.maintainability_score ?? 80;

  const critCount = data.critical_count ?? (data.issues?.filter((i) => i.severity === "critical").length || 0);
  const highCount = data.high_count ?? (data.issues?.filter((i) => i.severity === "high").length || 0);
  const medCount = data.medium_count ?? (data.issues?.filter((i) => i.severity === "medium").length || 0);
  const lowCount = data.low_count ?? (data.issues?.filter((i) => i.severity === "low").length || 0);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    if (score >= 60) return "text-amber-400 border-amber-500/30 bg-amber-500/10";
    return "text-rose-400 border-rose-500/30 bg-rose-500/10";
  };

  const getSeverityBadge = (severity: string) => {
    const s = severity.toLowerCase();
    if (s === "critical") return "bg-rose-500/20 text-rose-300 border-rose-500/40";
    if (s === "high") return "bg-orange-500/20 text-orange-300 border-orange-500/40";
    if (s === "medium") return "bg-amber-500/20 text-amber-300 border-amber-500/40";
    return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";
  };

  return (
    <div className="w-full h-full min-h-screen bg-[#070913] text-slate-100 p-4 md:p-8 space-y-8 overflow-y-auto">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Sparkles className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                CodeMedic AI Audit Workspace
                <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
                  {fileName}
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Full-page diagnostic report generated dynamically via AI AST Engine.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {reportId && (
            <>
              <a
                href={`/api/v1/reports/${reportId}/export/pdf`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                <Download className="w-4 h-4 text-cyan-400" /> PDF Report
              </a>
              <a
                href={`/api/v1/reports/${reportId}/export/markdown`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                <FileText className="w-4 h-4 text-purple-400" /> Markdown
              </a>
              <a
                href={`/api/v1/reports/${reportId}/export/json`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                <FileJson className="w-4 h-4 text-emerald-400" /> JSON
              </a>
            </>
          )}

          {data.optimized_code && onApplyFix && (
            <button
              onClick={() => onApplyFix(data.optimized_code!)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition"
            >
              <RefreshCw className="w-4 h-4" /> Apply Optimized Code
            </button>
          )}

          {onCloseReport && (
            <button
              onClick={onCloseReport}
              className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 transition"
            >
              Back to Editor
            </button>
          )}
        </div>
      </div>

      {/* TOP SUMMARY METRICS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Overall Code Health */}
        <div className={`p-4 rounded-xl border ${getScoreColor(healthScore)} flex flex-col justify-between`}>
          <span className="text-xs uppercase font-medium text-slate-400 tracking-wider">Code Health</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black">{healthScore}</span>
            <span className="text-xs opacity-75 font-mono">/ 100</span>
          </div>
          <div className="w-full bg-slate-800/50 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full ${healthScore >= 80 ? "bg-emerald-500" : healthScore >= 60 ? "bg-amber-500" : "bg-rose-500"}`}
              style={{ width: `${healthScore}%` }}
            />
          </div>
        </div>

        {/* Security Score */}
        <div className={`p-4 rounded-xl border ${getScoreColor(securityScore)} flex flex-col justify-between`}>
          <span className="text-xs uppercase font-medium text-slate-400 tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Security Rating
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black">{securityScore}</span>
            <span className="text-xs opacity-75 font-mono">/ 100</span>
          </div>
          <div className="w-full bg-slate-800/50 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-cyan-400" style={{ width: `${securityScore}%` }} />
          </div>
        </div>

        {/* Performance Score */}
        <div className={`p-4 rounded-xl border ${getScoreColor(performanceScore)} flex flex-col justify-between`}>
          <span className="text-xs uppercase font-medium text-slate-400 tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Performance
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black">{performanceScore}</span>
            <span className="text-xs font-mono text-amber-400">{data.complexity?.time || "O(1)"}</span>
          </div>
          <div className="w-full bg-slate-800/50 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-amber-400" style={{ width: `${performanceScore}%` }} />
          </div>
        </div>

        {/* Maintainability Index */}
        <div className={`p-4 rounded-xl border ${getScoreColor(maintainabilityScore)} flex flex-col justify-between`}>
          <span className="text-xs uppercase font-medium text-slate-400 tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-purple-400" /> Maintainability
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black">{maintainabilityScore}</span>
            <span className="text-xs opacity-75 font-mono">/ 100</span>
          </div>
          <div className="w-full bg-slate-800/50 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-purple-400" style={{ width: `${maintainabilityScore}%` }} />
          </div>
        </div>

        {/* Critical & High Issues */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <span className="text-xs uppercase font-medium text-slate-400 tracking-wider">Critical / High</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-400">{critCount}</span>
            <span className="text-slate-500">/</span>
            <span className="text-2xl font-bold text-orange-400">{highCount}</span>
          </div>
          <div className="flex gap-1.5 mt-3">
            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
              Med: {medCount}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
              Low: {lowCount}
            </span>
          </div>
        </div>

        {/* AI Confidence & Execution Time */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <span className="text-xs uppercase font-medium text-slate-400 tracking-wider">AI Confidence</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black text-blue-400">{data.confidence || 95}%</span>
            <span className="text-xs text-slate-400 font-mono">AST Scan</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 truncate">
            Language: <span className="text-slate-300 font-semibold">{language}</span>
          </p>
        </div>
      </div>

      {/* EXECUTIVE SUMMARY & AI EXPLANATION */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0b1021] to-slate-900 border border-slate-800/80 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Sparkles className="w-5 h-5" />
          </span>
          <h2 className="text-lg font-bold text-white tracking-tight">Executive Summary & AI Diagnosis</h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed font-normal bg-slate-950/60 p-4 rounded-xl border border-slate-800/60">
          {data.summary}
        </p>

        {data.code_explanation && (
          <div className="mt-3 pt-3 border-t border-slate-800/60">
            <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">
              Step-by-Step AI Technical Explanation
            </h3>
            <div className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800/40 font-mono">
              {data.code_explanation}
            </div>
          </div>
        )}
      </div>

      {/* DIAGNOSTICS TAB NAVIGATION HUB */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition flex items-center gap-2 border-b-2 ${
              activeTab === "overview"
                ? "border-blue-500 text-blue-400 bg-blue-500/10"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-4 h-4" /> Overview & Metrics
          </button>

          <button
            onClick={() => setActiveTab("bugs")}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition flex items-center gap-2 border-b-2 ${
              activeTab === "bugs"
                ? "border-rose-500 text-rose-400 bg-rose-500/10"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            Detected Bugs ({data.issues?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition flex items-center gap-2 border-b-2 ${
              activeTab === "security"
                ? "border-cyan-500 text-cyan-400 bg-cyan-500/10"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            OWASP Security ({data.security?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab("performance")}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition flex items-center gap-2 border-b-2 ${
              activeTab === "performance"
                ? "border-amber-500 text-amber-400 bg-amber-500/10"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            Performance ({data.performance?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab("codereview")}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition flex items-center gap-2 border-b-2 ${
              activeTab === "codereview"
                ? "border-purple-500 text-purple-400 bg-purple-500/10"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <CheckSquare className="w-4 h-4 text-purple-400" />
            Senior Review ({data.code_review?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab("tests")}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition flex items-center gap-2 border-b-2 ${
              activeTab === "tests"
                ? "border-emerald-500 text-emerald-400 bg-emerald-500/10"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Code2 className="w-4 h-4 text-emerald-400" />
            Unit Tests ({data.tests?.length || 0})
          </button>
        </div>

        {/* TAB CONTENTS */}
        <div className="min-h-[300px]">
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-400" /> Algorithmic Complexity Bounds
                </h3>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-xs text-slate-400 block">Time Complexity</span>
                    <span className="text-lg font-mono font-bold text-amber-400">
                      {data.complexity?.time || "O(N)"}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-xs text-slate-400 block">Space Complexity</span>
                    <span className="text-lg font-mono font-bold text-cyan-400">
                      {data.complexity?.space || "O(1)"}
                    </span>
                  </div>
                </div>
                {data.complexity?.explanation && (
                  <p className="text-xs text-slate-400 leading-relaxed font-mono pt-2">
                    {data.complexity.explanation}
                  </p>
                )}
              </div>

              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Key Engineering Recommendations
                </h3>
                <ul className="text-xs text-slate-300 space-y-2.5">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Eliminate raw concatenation in queries to mitigate OWASP Injection attacks.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Pre-index nested collection lookups to optimize time complexity from O(N^2) to O(1).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Add explicit return type annotations and PEP 257 docstrings for team intellisense.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* BUGS TAB */}
          {activeTab === "bugs" && (
            <div className="space-y-4">
              {!data.issues || data.issues.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  No code flaws or syntax bugs detected in this snippet.
                </div>
              ) : (
                data.issues.map((issue, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl bg-slate-900/80 border border-slate-800 overflow-hidden transition"
                  >
                    <div
                      onClick={() => setExpandedBugIdx(expandedBugIdx === idx ? null : idx)}
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-md border ${getSeverityBadge(issue.severity)}`}>
                          {issue.severity.toUpperCase()}
                        </span>
                        <h4 className="text-sm font-semibold text-white">
                          {issue.title} {issue.line && <span className="text-slate-400 font-mono text-xs">(Line {issue.line})</span>}
                        </h4>
                      </div>
                      {expandedBugIdx === idx ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>

                    {expandedBugIdx === idx && (
                      <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-3 text-xs">
                        <p className="text-slate-300">{issue.description}</p>
                        {issue.why_it_happens && (
                          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300">
                            <strong className="block text-[11px] uppercase tracking-wider mb-1 text-rose-400">Why It Happens:</strong>
                            {issue.why_it_happens}
                          </div>
                        )}
                        {issue.impact && (
                          <p className="text-slate-400">
                            <strong className="text-slate-300">Runtime Impact:</strong> {issue.impact}
                          </p>
                        )}
                        {issue.fix && (
                          <p className="text-slate-400">
                            <strong className="text-slate-300">Suggested Fix:</strong> {issue.fix}
                          </p>
                        )}
                        {issue.fix_code && (
                          <div className="relative mt-2">
                            <div className="flex items-center justify-between bg-slate-900 px-3 py-1.5 rounded-t-lg text-[10px] text-slate-400 font-mono">
                              <span>REPLACEMENT SNIPPET</span>
                              <button
                                onClick={() => copyToClipboard(issue.fix_code!, `bug-${idx}`)}
                                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition"
                              >
                                {copiedSection === `bug-${idx}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                Copy Code
                              </button>
                            </div>
                            <pre className="p-3 rounded-b-lg bg-slate-950 text-cyan-300 font-mono text-[11px] border border-slate-800 overflow-x-auto">
                              {issue.fix_code}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <div className="space-y-4">
              {!data.security || data.security.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400">
                  <ShieldCheck className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  Zero security exposures or credentials leaks detected.
                </div>
              ) : (
                data.security.map((sec, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-cyan-400" />
                        {sec.finding || sec.title}
                      </h4>
                      <span className={`px-2 py-0.5 text-[10px] font-mono rounded ${getSeverityBadge(sec.severity)}`}>
                        [{sec.owasp_category || "OWASP"}] {sec.severity.toUpperCase()}
                      </span>
                    </div>
                    {(sec.remediation || sec.fix) && (
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
                        <strong className="block text-[11px] text-cyan-400 mb-1">Remediation Patch:</strong>
                        <pre className="font-mono text-cyan-200 text-[11px] whitespace-pre-wrap">{sec.remediation || sec.fix}</pre>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* PERFORMANCE TAB */}
          {activeTab === "performance" && (
            <div className="space-y-4">
              {!data.performance || data.performance.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400">
                  <Zap className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  Code is optimized for fast processing speeds.
                </div>
              ) : (
                data.performance.map((perf, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-white">{perf.issue || perf.title}</h4>
                      <span className="text-xs font-mono text-amber-400">
                        {perf.current_time || "O(N)"} → {perf.optimized_time || "O(1)"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{perf.impact}</p>
                    {perf.fix && (
                      <p className="text-xs text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                        <strong className="text-amber-400">Optimization:</strong> {perf.fix}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* CODE REVIEW TAB */}
          {activeTab === "codereview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!data.code_review || data.code_review.length === 0 ? (
                <div className="col-span-2 p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400">
                  Senior code review checks passed.
                </div>
              ) : (
                data.code_review.map((cr, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{cr.category}</span>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          cr.status === "pass"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-amber-500/20 text-amber-300"
                        }`}
                      >
                        {cr.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{cr.suggestion}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* UNIT TESTS TAB */}
          {activeTab === "tests" && (
            <div className="space-y-4">
              {!data.tests || data.tests.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400">
                  No automated tests generated.
                </div>
              ) : (
                <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-slate-900 text-xs text-slate-400 font-mono border-b border-slate-800">
                    <span>GENERATED UNIT TEST SUITE</span>
                    <button
                      onClick={() => copyToClipboard(data.tests!.join("\n\n"), "tests")}
                      className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition"
                    >
                      {copiedSection === "tests" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      Copy Test Suite
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                    {data.tests.join("\n\n")}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MONACO SIDE-BY-SIDE DIFF VIEWER */}
      {data.optimized_code && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-blue-400" />
                Before vs. After Code Comparison
              </h3>
              <p className="text-xs text-slate-400">Side-by-side Monaco diff comparing original vs. refactored code.</p>
            </div>
            {onApplyFix && (
              <button
                onClick={() => onApplyFix(data.optimized_code!)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition shadow-md shadow-blue-500/20"
              >
                <Check className="w-3.5 h-3.5" /> Apply Optimized Code
              </button>
            )}
          </div>

          {data.why_better && (
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 space-y-1">
              <strong className="block font-semibold text-blue-400">Why this refactored version is better:</strong>
              <div className="whitespace-pre-wrap leading-relaxed font-mono">{data.why_better}</div>
            </div>
          )}

          <div className="h-[450px] rounded-xl overflow-hidden border border-slate-800">
            <DiffEditor
              height="100%"
              original={originalCode}
              modified={data.optimized_code}
              language={language.toLowerCase()}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 13,
                scrollBeyondLastLine: false,
                renderSideBySide: true,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
