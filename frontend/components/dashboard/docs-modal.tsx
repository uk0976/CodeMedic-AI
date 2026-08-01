"use client";

import {
  X,
  FileText,
  Download,
  ExternalLink,
  ShieldCheck,
  Zap,
  Code2,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DocsModal({ isOpen, onClose }: DocsModalProps) {
  if (!isOpen) return null;

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
        className="glass-panel relative z-10 flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/95 p-6 shadow-[0_0_50px_rgba(6,182,212,0.15)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400">
              <FileText className="size-4.5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Documentation & Architecture Guide</h3>
              <p className="text-xs text-slate-400">
                System specification, PDF report exporter, and API docs
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

        {/* PDF Document Banner Section */}
        <div className="my-4 rounded-xl border border-cyan-500/30 bg-gradient-to-r from-blue-950/40 via-cyan-950/40 to-slate-900/40 p-4">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Official Hackathon Documentation PDF
                </span>
              </div>
              <p className="text-xs text-slate-300">
                CodeMedic AI Hackathon Architecture Specification & Technical Whitepaper (2026
                Edition)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/CodeMedic_AI_Codex_Hackathon_2026.pdf"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-2 text-xs font-bold text-cyan-300 transition hover:bg-cyan-500/20"
              >
                <ExternalLink className="size-3.5" /> View Online
              </a>
              <a
                href="/CodeMedic_AI_Codex_Hackathon_2026.pdf"
                download="CodeMedic_AI_Codex_Hackathon_2026.pdf"
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110"
              >
                <Download className="size-3.5" /> Download PDF
              </a>
            </div>
          </div>
        </div>

        {/* Content Body Scrollable */}
        <div className="space-y-6 overflow-y-auto pr-2 text-xs text-slate-300">
          {/* Section 1: Overview */}
          <div className="space-y-2">
            <h4 className="flex items-center gap-2 text-sm font-bold text-white">
              <Code2 className="size-4 text-cyan-400" /> Executive System Overview
            </h4>
            <p className="leading-relaxed text-slate-400">
              CodeMedic AI is an autonomous, full-stack AI co-pilot designed for continuous code
              diagnosis, OWASP security auditing, complexity profiling, and automated refactoring.
              Built with Next.js 15, FastAPI, and multi-provider AI backends (OpenAI Codex, Groq
              Llama 3.3 70B).
            </p>
          </div>

          {/* Section 2: Key Features */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
              <Zap className="mb-1.5 size-4 text-yellow-400" />
              <span className="font-bold text-white">Fast SSE Telemetry</span>
              <p className="mt-1 text-[11px] text-slate-400">
                Active keep-alive streaming updates every 1.5s to prevent proxy timeouts.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
              <ShieldCheck className="mb-1.5 size-4 text-emerald-400" />
              <span className="font-bold text-white">OWASP Top 10 Audit</span>
              <p className="mt-1 text-[11px] text-slate-400">
                Detects SQL injection, hardcoded secrets, and XSS risks with remediation patches.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
              <FileText className="mb-1.5 size-4 text-cyan-400" />
              <span className="font-bold text-white">Multi-Format Exports</span>
              <p className="mt-1 text-[11px] text-slate-400">
                Export diagnostic reports into PDF, Markdown, or JSON formats instantly.
              </p>
            </div>
          </div>

          {/* Section 3: REST API Reference */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white">REST API Endpoint Reference</h4>
            <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/60 p-3 font-mono text-[11px]">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                <span className="font-bold text-emerald-400">POST /api/v1/analysis/analyze</span>
                <span className="text-slate-500">SSE Stream Analysis</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                <span className="font-bold text-cyan-400">POST /api/v1/analysis/analyze-sync</span>
                <span className="text-slate-500">Synchronous Fallback</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-400">GET /api/v1/reports/pdf</span>
                <span className="text-slate-500">PDF Report Generation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-4">
          <span className="text-[10px] text-slate-500">CodeMedic_AI_Codex_Hackathon_2026.pdf</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-700"
          >
            Close Guide
          </button>
        </div>
      </motion.div>
    </div>
  );
}
