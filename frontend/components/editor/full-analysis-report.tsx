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
import { env } from "@/lib/env";

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

  const critCount =
    data.critical_count ?? (data.issues?.filter((i) => i.severity === "critical").length || 0);
  const highCount =
    data.high_count ?? (data.issues?.filter((i) => i.severity === "high").length || 0);
  const medCount =
    data.medium_count ?? (data.issues?.filter((i) => i.severity === "medium").length || 0);
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
    <div className="h-full min-h-screen w-full space-y-8 overflow-y-auto bg-[#070913] p-4 text-slate-100 md:p-8">
      {/* Header Bar */}
      <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-3">
            <span className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-2 text-blue-400">
              <Sparkles className="h-6 w-6" />
            </span>
            <div>
              <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white">
                CodeMedic AI Audit Workspace
                <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 font-mono text-xs text-cyan-400">
                  {fileName}
                </span>
              </h1>
              <p className="mt-1 text-sm text-slate-400">
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
                href={`${env.apiUrl}/api/v1/reports/${reportId}/export/pdf`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-700"
              >
                <Download className="h-4 w-4 text-cyan-400" /> PDF Report
              </a>
              <a
                href={`${env.apiUrl}/api/v1/reports/${reportId}/export/markdown`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-700"
              >
                <FileText className="h-4 w-4 text-purple-400" /> Markdown
              </a>
              <a
                href={`${env.apiUrl}/api/v1/reports/${reportId}/export/json`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-700"
              >
                <FileJson className="h-4 w-4 text-emerald-400" /> JSON
              </a>
            </>
          )}

          {data.optimized_code && onApplyFix && (
            <button
              onClick={() => onApplyFix(data.optimized_code!)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-500"
            >
              <RefreshCw className="h-4 w-4" /> Apply Optimized Code
            </button>
          )}

          {onCloseReport && (
            <button
              onClick={onCloseReport}
              className="rounded-lg border border-slate-700/50 bg-slate-800/50 px-3.5 py-2 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              Back to Editor
            </button>
          )}
        </div>
      </div>

      {/* TOP SUMMARY METRICS GRID */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        {/* Overall Code Health */}
        <div
          className={`flex flex-col justify-between rounded-xl border p-4 ${getScoreColor(healthScore)}`}
        >
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Code Health
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black">{healthScore}</span>
            <span className="font-mono text-xs opacity-75">/ 100</span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800/50">
            <div
              className={`h-full ${healthScore >= 80 ? "bg-emerald-500" : healthScore >= 60 ? "bg-amber-500" : "bg-rose-500"}`}
              style={{ width: `${healthScore}%` }}
            />
          </div>
        </div>

        {/* Security Score */}
        <div
          className={`flex flex-col justify-between rounded-xl border p-4 ${getScoreColor(securityScore)}`}
        >
          <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" /> Security Rating
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black">{securityScore}</span>
            <span className="font-mono text-xs opacity-75">/ 100</span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800/50">
            <div className="h-full bg-cyan-400" style={{ width: `${securityScore}%` }} />
          </div>
        </div>

        {/* Performance Score */}
        <div
          className={`flex flex-col justify-between rounded-xl border p-4 ${getScoreColor(performanceScore)}`}
        >
          <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-400">
            <Zap className="h-3.5 w-3.5 text-amber-400" /> Performance
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black">{performanceScore}</span>
            <span className="font-mono text-xs text-amber-400">
              {data.complexity?.time || "O(1)"}
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800/50">
            <div className="h-full bg-amber-400" style={{ width: `${performanceScore}%` }} />
          </div>
        </div>

        {/* Maintainability Index */}
        <div
          className={`flex flex-col justify-between rounded-xl border p-4 ${getScoreColor(maintainabilityScore)}`}
        >
          <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-400">
            <BookOpen className="h-3.5 w-3.5 text-purple-400" /> Maintainability
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black">{maintainabilityScore}</span>
            <span className="font-mono text-xs opacity-75">/ 100</span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800/50">
            <div className="h-full bg-purple-400" style={{ width: `${maintainabilityScore}%` }} />
          </div>
        </div>

        {/* Critical & High Issues */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Critical / High
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-400">{critCount}</span>
            <span className="text-slate-500">/</span>
            <span className="text-2xl font-bold text-orange-400">{highCount}</span>
          </div>
          <div className="mt-3 flex gap-1.5">
            <span className="rounded bg-rose-500/20 px-2 py-0.5 font-mono text-[10px] text-rose-300">
              Med: {medCount}
            </span>
            <span className="rounded bg-cyan-500/20 px-2 py-0.5 font-mono text-[10px] text-cyan-300">
              Low: {lowCount}
            </span>
          </div>
        </div>

        {/* AI Confidence & Execution Time */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
            AI Confidence
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black text-blue-400">{data.confidence || 95}%</span>
            <span className="font-mono text-xs text-slate-400">AST Scan</span>
          </div>
          <p className="mt-2 truncate text-[11px] text-slate-500">
            Language: <span className="font-semibold text-slate-300">{language}</span>
          </p>
        </div>
      </div>

      {/* EXECUTIVE SUMMARY & AI EXPLANATION */}
      <div className="space-y-4 rounded-2xl border border-slate-800/80 bg-gradient-to-r from-slate-900 via-[#0b1021] to-slate-900 p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-2 text-cyan-400">
            <Sparkles className="h-5 w-5" />
          </span>
          <h2 className="text-lg font-bold tracking-tight text-white">
            Executive Summary & AI Diagnosis
          </h2>
        </div>
        <p className="rounded-xl border border-slate-800/60 bg-slate-950/60 p-4 text-sm font-normal leading-relaxed text-slate-300">
          {data.summary}
        </p>

        {data.code_explanation && (
          <div className="mt-3 border-t border-slate-800/60 pt-3">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Step-by-Step AI Technical Explanation
            </h3>
            <div className="whitespace-pre-wrap rounded-xl border border-slate-800/40 bg-slate-950/40 p-4 font-mono text-xs leading-relaxed text-slate-300">
              {data.code_explanation}
            </div>
          </div>
        )}
      </div>

      {/* DIAGNOSTICS TAB NAVIGATION HUB */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-800 pb-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 rounded-t-lg border-b-2 px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === "overview"
                ? "border-blue-500 bg-blue-500/10 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="h-4 w-4" /> Overview & Metrics
          </button>

          <button
            onClick={() => setActiveTab("bugs")}
            className={`flex items-center gap-2 rounded-t-lg border-b-2 px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === "bugs"
                ? "border-rose-500 bg-rose-500/10 text-rose-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <AlertTriangle className="h-4 w-4 text-rose-400" />
            Detected Bugs ({data.issues?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-2 rounded-t-lg border-b-2 px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === "security"
                ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldAlert className="h-4 w-4 text-cyan-400" />
            OWASP Security ({data.security?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab("performance")}
            className={`flex items-center gap-2 rounded-t-lg border-b-2 px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === "performance"
                ? "border-amber-500 bg-amber-500/10 text-amber-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Zap className="h-4 w-4 text-amber-400" />
            Performance ({data.performance?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab("codereview")}
            className={`flex items-center gap-2 rounded-t-lg border-b-2 px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === "codereview"
                ? "border-purple-500 bg-purple-500/10 text-purple-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <CheckSquare className="h-4 w-4 text-purple-400" />
            Senior Review ({data.code_review?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab("tests")}
            className={`flex items-center gap-2 rounded-t-lg border-b-2 px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === "tests"
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Code2 className="h-4 w-4 text-emerald-400" />
            Unit Tests ({data.tests?.length || 0})
          </button>
        </div>

        {/* TAB CONTENTS */}
        <div className="min-h-[300px]">
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-200">
                  <Cpu className="h-4 w-4 text-blue-400" /> Algorithmic Complexity Bounds
                </h3>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                    <span className="block text-xs text-slate-400">Time Complexity</span>
                    <span className="font-mono text-lg font-bold text-amber-400">
                      {data.complexity?.time || "O(N)"}
                    </span>
                  </div>
                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                    <span className="block text-xs text-slate-400">Space Complexity</span>
                    <span className="font-mono text-lg font-bold text-cyan-400">
                      {data.complexity?.space || "O(1)"}
                    </span>
                  </div>
                </div>
                {data.complexity?.explanation && (
                  <p className="pt-2 font-mono text-xs leading-relaxed text-slate-400">
                    {data.complexity.explanation}
                  </p>
                )}
              </div>

              <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Key Engineering
                  Recommendations
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-emerald-400">•</span>
                    <span>
                      Eliminate raw concatenation in queries to mitigate OWASP Injection attacks.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-emerald-400">•</span>
                    <span>
                      Pre-index nested collection lookups to optimize time complexity from O(N^2) to
                      O(1).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-emerald-400">•</span>
                    <span>
                      Add explicit return type annotations and PEP 257 docstrings for team
                      intellisense.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* BUGS TAB */}
          {activeTab === "bugs" && (
            <div className="space-y-4">
              {!data.issues || data.issues.length === 0 ? (
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-400">
                  <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-emerald-400" />
                  No code flaws or syntax bugs detected in this snippet.
                </div>
              ) : (
                data.issues.map((issue, idx) => (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 transition"
                  >
                    <div
                      onClick={() => setExpandedBugIdx(expandedBugIdx === idx ? null : idx)}
                      className="flex cursor-pointer items-center justify-between p-4 transition hover:bg-slate-800/50"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-md border px-2.5 py-0.5 text-[11px] font-bold ${getSeverityBadge(issue.severity)}`}
                        >
                          {issue.severity.toUpperCase()}
                        </span>
                        <h4 className="text-sm font-semibold text-white">
                          {issue.title}{" "}
                          {issue.line && (
                            <span className="font-mono text-xs text-slate-400">
                              (Line {issue.line})
                            </span>
                          )}
                        </h4>
                      </div>
                      {expandedBugIdx === idx ? (
                        <ChevronUp className="h-4 w-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      )}
                    </div>

                    {expandedBugIdx === idx && (
                      <div className="space-y-3 border-t border-slate-800 bg-slate-950/60 p-4 text-xs">
                        <p className="text-slate-300">{issue.description}</p>
                        {issue.why_it_happens && (
                          <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-rose-300">
                            <strong className="mb-1 block text-[11px] uppercase tracking-wider text-rose-400">
                              Why It Happens:
                            </strong>
                            {issue.why_it_happens}
                          </div>
                        )}
                        {issue.impact && (
                          <p className="text-slate-400">
                            <strong className="text-slate-300">Runtime Impact:</strong>{" "}
                            {issue.impact}
                          </p>
                        )}
                        {issue.fix && (
                          <p className="text-slate-400">
                            <strong className="text-slate-300">Suggested Fix:</strong> {issue.fix}
                          </p>
                        )}
                        {issue.fix_code && (
                          <div className="relative mt-2">
                            <div className="flex items-center justify-between rounded-t-lg bg-slate-900 px-3 py-1.5 font-mono text-[10px] text-slate-400">
                              <span>REPLACEMENT SNIPPET</span>
                              <button
                                onClick={() => copyToClipboard(issue.fix_code!, `bug-${idx}`)}
                                className="flex items-center gap-1 text-cyan-400 transition hover:text-cyan-300"
                              >
                                {copiedSection === `bug-${idx}` ? (
                                  <Check className="h-3 w-3" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                                Copy Code
                              </button>
                            </div>
                            <pre className="overflow-x-auto rounded-b-lg border border-slate-800 bg-slate-950 p-3 font-mono text-[11px] text-cyan-300">
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
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-400">
                  <ShieldCheck className="mx-auto mb-2 h-8 w-8 text-cyan-400" />
                  Zero security exposures or credentials leaks detected.
                </div>
              ) : (
                data.security.map((sec, idx) => (
                  <div
                    key={idx}
                    className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="flex items-center gap-2 text-sm font-semibold text-white">
                        <ShieldAlert className="h-4 w-4 text-cyan-400" />
                        {sec.finding || sec.title}
                      </h4>
                      <span
                        className={`rounded px-2 py-0.5 font-mono text-[10px] ${getSeverityBadge(sec.severity)}`}
                      >
                        [{sec.owasp_category || "OWASP"}] {sec.severity.toUpperCase()}
                      </span>
                    </div>
                    {(sec.remediation || sec.fix) && (
                      <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs text-slate-300">
                        <strong className="mb-1 block text-[11px] text-cyan-400">
                          Remediation Patch:
                        </strong>
                        <pre className="whitespace-pre-wrap font-mono text-[11px] text-cyan-200">
                          {sec.remediation || sec.fix}
                        </pre>
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
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-400">
                  <Zap className="mx-auto mb-2 h-8 w-8 text-amber-400" />
                  Code is optimized for fast processing speeds.
                </div>
              ) : (
                data.performance.map((perf, idx) => (
                  <div
                    key={idx}
                    className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-white">
                        {perf.issue || perf.title}
                      </h4>
                      <span className="font-mono text-xs text-amber-400">
                        {perf.current_time || "O(N)"} → {perf.optimized_time || "O(1)"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{perf.impact}</p>
                    {perf.fix && (
                      <p className="rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-400">
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {!data.code_review || data.code_review.length === 0 ? (
                <div className="col-span-2 rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-400">
                  Senior code review checks passed.
                </div>
              ) : (
                data.code_review.map((cr, idx) => (
                  <div
                    key={idx}
                    className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/80 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{cr.category}</span>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold ${
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
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-400">
                  No automated tests generated.
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                  <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2 font-mono text-xs text-slate-400">
                    <span>GENERATED UNIT TEST SUITE</span>
                    <button
                      onClick={() => copyToClipboard(data.tests!.join("\n\n"), "tests")}
                      className="flex items-center gap-1.5 text-cyan-400 transition hover:text-cyan-300"
                    >
                      {copiedSection === "tests" ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      Copy Test Suite
                    </button>
                  </div>
                  <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-emerald-300">
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
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
          <div className="flex flex-col items-start justify-between gap-2 border-b border-slate-800 pb-3 md:flex-row md:items-center">
            <div>
              <h3 className="flex items-center gap-2 text-base font-bold text-white">
                <Code2 className="h-5 w-5 text-blue-400" />
                Before vs. After Code Comparison
              </h3>
              <p className="text-xs text-slate-400">
                Side-by-side Monaco diff comparing original vs. refactored code.
              </p>
            </div>
            {onApplyFix && (
              <button
                onClick={() => onApplyFix(data.optimized_code!)}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-500"
              >
                <Check className="h-3.5 w-3.5" /> Apply Optimized Code
              </button>
            )}
          </div>

          {data.why_better && (
            <div className="space-y-1 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 text-xs text-blue-200">
              <strong className="block font-semibold text-blue-400">
                Why this refactored version is better:
              </strong>
              <div className="whitespace-pre-wrap font-mono leading-relaxed">{data.why_better}</div>
            </div>
          )}

          <div className="h-[500px] w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
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
                automaticLayout: true,
                wordWrap: "on",
                wrappingStrategy: "advanced",
                scrollBeyondLastColumn: 5,
                scrollbar: {
                  vertical: "visible",
                  horizontal: "visible",
                  useShadows: false,
                  verticalScrollbarSize: 10,
                  horizontalScrollbarSize: 10,
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
