"use client";

import { useState, useEffect, Suspense } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/top-bar";
import { SettingsModal } from "@/components/dashboard/settings-modal";
import { DocsModal } from "@/components/dashboard/docs-modal";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Download,
  Trash2,
  FileCode2,
  Calendar,
  Award,
  Shield,
  Zap,
  Play,
  Check,
  X,
  FileText,
  Copy,
  ChevronRight,
  TrendingUp,
  Scale,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { env } from "@/lib/env";

interface Report {
  id: string;
  file_name: string;
  language: string;
  analysis_type: string;
  code_quality_score: number;
  bug_count: number;
  security_score: number;
  analysis_duration: number;
  confidence: number;
  code: string;
  optimized_code: string;
  summary: string;
  issues: Array<{ title: string; description: string; severity: string; line_number?: number }>;
  security: Array<{ title: string; description: string; severity: string }>;
  performance: Array<{ title: string; description: string; impact: string }>;
  complexity: { time?: string; space?: string; explanation?: string };
  tests: string[];
  created_at: string;
}

function ReportsHistoryPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tourStep = searchParams.get("tour");

  const skipTour = () => {
    router.push("/reports");
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Selection for comparison
  const [selectedForCompare, setSelectedForCompare] = useState<Report[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  // Active Report Details Modal
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [detailsTab, setDetailsTab] = useState<
    "overview" | "bugs" | "security" | "performance" | "code" | "tests"
  >("overview");

  // Load reports
  const fetchReports = async () => {
    try {
      setLoading(true);
      const url = new URL(`${env.apiUrl}/api/v1/reports/`);
      if (search) url.searchParams.append("search", search);
      if (languageFilter && languageFilter !== "all")
        url.searchParams.append("language", languageFilter);
      if (sortBy) url.searchParams.append("sort_by", sortBy);

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (err) {
      console.error("Failed to fetch reports list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, languageFilter, sortBy]);

  // Handle report deletion
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to remove this report from history?")) return;

    try {
      const res = await fetch(`${env.apiUrl}/api/v1/reports/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setReports((prev) => prev.filter((r) => r.id !== id));
        setSelectedForCompare((prev) => prev.filter((r) => r.id !== id));
        if (selectedReport?.id === id) setSelectedReport(null);
      }
    } catch (err) {
      console.error("Failed to delete report:", err);
    }
  };

  // Toggle selection for comparison
  const handleToggleCompare = (report: Report, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedForCompare((prev) => {
      const exists = prev.find((r) => r.id === report.id);
      if (exists) {
        return prev.filter((r) => r.id !== report.id);
      }
      if (prev.length >= 2) {
        alert("You can compare a maximum of 2 reports at once.");
        return prev;
      }
      return [...prev, report];
    });
  };

  // Perform duplication
  const handleDuplicate = async (report: Report, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${env.apiUrl}/api/v1/reports/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...report,
          file_name: `${report.file_name.split(".")[0]}_copy.${report.file_name.split(".")[1] || "py"}`,
        }),
      });
      if (res.ok) {
        fetchReports();
      }
    } catch (err) {
      console.error("Failed to duplicate report:", err);
    }
  };

  // Download Trigger
  const handleExport = (reportId: string, format: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`${env.apiUrl}/api/v1/reports/${reportId}/export/${format}`, "_blank");
  };

  // Aggregate statistics for the side-panel
  const totalBugsFixed = reports.reduce((acc, r) => acc + r.bug_count, 0);
  const averageQuality = reports.length
    ? Math.round(reports.reduce((acc, r) => acc + r.code_quality_score, 0) / reports.length)
    : 0;

  const getLanguageStats = () => {
    const counts: Record<string, number> = {};
    reports.forEach((r) => {
      counts[r.language] = (counts[r.language] || 0) + 1;
    });
    let topLang = "N/A";
    let max = 0;
    Object.entries(counts).forEach(([lang, cnt]) => {
      if (cnt > max) {
        max = cnt;
        topLang = lang;
      }
    });
    return topLang.toUpperCase();
  };

  const topLanguage = getLanguageStats();

  return (
    <div className="min-h-screen bg-[#060814] font-sans text-slate-100">
      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        )}
      </AnimatePresence>

      {/* Docs Modal */}
      <AnimatePresence>
        {isDocsOpen && <DocsModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />}
      </AnimatePresence>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
      />

      <div className="flex min-h-screen flex-col lg:pl-64">
        <TopBar
          onMenuClick={() => setSidebarOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        <main className="mx-auto w-full max-w-[1600px] flex-1 p-5 md:p-8">
          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-4">
            {/* Left/Middle: Reports Directory Area */}
            <div className="space-y-6 xl:col-span-3">
              {/* Header Title */}
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h1 className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-2xl font-bold text-transparent">
                    Analysis Reports Directory
                  </h1>
                  <p className="mt-1 text-sm text-slate-400">
                    Manage diagnostic logs, compare audits, and export multi-format summaries.
                  </p>
                </div>

                {selectedForCompare.length === 2 && (
                  <motion.button
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={() => setCompareModalOpen(true)}
                    className="flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/20 px-4 py-2 text-xs font-bold text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all hover:bg-cyan-500/30"
                  >
                    <Scale className="size-4" />
                    Compare Selected ({selectedForCompare.length})
                  </motion.button>
                )}
              </div>

              {/* Filters / Toolbar */}
              <div className="glass-panel flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 md:flex-row">
                {/* Search Bar */}
                <div className="relative w-full md:max-w-xs">
                  <Search className="absolute left-3.5 top-2.5 size-4 text-slate-500" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by file name..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-500 transition focus:border-slate-700 focus:outline-none"
                  />
                </div>

                {/* Filter / Sort drop downs */}
                <div className="flex w-full flex-wrap items-center justify-end gap-3 md:w-auto">
                  {/* Language Filter */}
                  <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-1.5">
                    <SlidersHorizontal className="size-3.5 text-slate-500" />
                    <select
                      value={languageFilter}
                      onChange={(e) => setLanguageFilter(e.target.value)}
                      className="cursor-pointer bg-transparent text-xs text-slate-300 focus:outline-none"
                    >
                      <option value="all" className="bg-slate-900 text-slate-300">
                        All Languages
                      </option>
                      <option value="python" className="bg-slate-900 text-slate-300">
                        Python
                      </option>
                      <option value="javascript" className="bg-slate-900 text-slate-300">
                        JavaScript
                      </option>
                      <option value="typescript" className="bg-slate-900 text-slate-300">
                        TypeScript
                      </option>
                      <option value="java" className="bg-slate-900 text-slate-300">
                        Java
                      </option>
                      <option value="cpp" className="bg-slate-900 text-slate-300">
                        C++
                      </option>
                      <option value="go" className="bg-slate-900 text-slate-300">
                        Go
                      </option>
                      <option value="rust" className="bg-slate-900 text-slate-300">
                        Rust
                      </option>
                    </select>
                  </div>

                  {/* Sorting dropdown */}
                  <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-1.5">
                    <ArrowUpDown className="size-3.5 text-slate-500" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="cursor-pointer bg-transparent text-xs text-slate-300 focus:outline-none"
                    >
                      <option value="newest" className="bg-slate-900 text-slate-300">
                        Newest First
                      </option>
                      <option value="oldest" className="bg-slate-900 text-slate-300">
                        Oldest First
                      </option>
                      <option value="highest_score" className="bg-slate-900 text-slate-300">
                        Highest Score
                      </option>
                      <option value="most_bugs" className="bg-slate-900 text-slate-300">
                        Most Bugs
                      </option>
                      <option value="alphabetical" className="bg-slate-900 text-slate-300">
                        Alphabetical
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Reports Grid */}
              {loading ? (
                // Loading Skeletons
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="border-slate-850 flex h-44 animate-pulse flex-col justify-between rounded-2xl border bg-slate-900/40 p-5"
                    >
                      <div className="space-y-2">
                        <div className="h-4 w-1/3 rounded bg-slate-800" />
                        <div className="h-3 w-2/3 rounded bg-slate-800/60" />
                      </div>
                      <div className="h-8 rounded bg-slate-800" />
                    </div>
                  ))}
                </div>
              ) : reports.length === 0 ? (
                // Empty state
                <div className="glass-panel flex flex-col items-center rounded-2xl border border-slate-800/80 bg-slate-900/10 p-12 text-center">
                  <div className="mb-4 flex size-16 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60 text-slate-400">
                    <FileText className="size-8" />
                  </div>
                  <h3 className="text-base font-bold text-white">No reports generated yet</h3>
                  <p className="mt-2 max-w-sm text-xs text-slate-500">
                    Analyze code snippets inside the Editor Workspace first to start building your
                    diagnostic database.
                  </p>
                  <Link
                    href="/analyze"
                    className="mt-6 flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-cyan-600"
                  >
                    <Play className="size-3.5 fill-current" />
                    Start First Analysis
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <AnimatePresence>
                    {reports.map((report) => {
                      const isSelected = !!selectedForCompare.find((r) => r.id === report.id);
                      return (
                        <motion.div
                          key={report.id}
                          layoutId={report.id}
                          onClick={() => {
                            setSelectedReport(report);
                            setDetailsTab("overview");
                          }}
                          className="glass-panel group relative flex cursor-pointer flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/30 p-5 transition-all hover:border-slate-700 hover:bg-slate-900/60 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                        >
                          {/* Selection Checkbox */}
                          <div
                            onClick={(e) => handleToggleCompare(report, e)}
                            className="absolute right-4 top-4 z-10 flex size-5 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 transition hover:border-slate-600"
                            title="Select to compare"
                          >
                            {isSelected && <Check className="size-3.5 text-cyan-400" />}
                          </div>

                          <div>
                            {/* Title & Language */}
                            <div className="flex items-center gap-3">
                              <div className="border-slate-850 flex size-9 items-center justify-center rounded-xl border bg-slate-950 text-slate-300">
                                <FileCode2 className="size-5" />
                              </div>
                              <div>
                                <h3 className="max-w-[180px] truncate text-sm font-bold text-white">
                                  {report.file_name}
                                </h3>
                                <div className="mt-0.5 flex items-center gap-1.5">
                                  <span className="text-[10px] font-bold uppercase text-slate-500">
                                    {report.language}
                                  </span>
                                  <span className="size-1 rounded-full bg-slate-700" />
                                  <span className="text-[10px] text-slate-400">
                                    {report.analysis_type}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Brief summary */}
                            <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-500">
                              {report.summary}
                            </p>
                          </div>

                          {/* Quick Metrics Grid */}
                          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-900 pt-4">
                            {/* Quality Score */}
                            <div className="flex flex-col">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                                Quality
                              </span>
                              <div className="mt-1 flex items-center gap-1">
                                <Award className="size-3 text-cyan-400" />
                                <span
                                  className={`text-xs font-bold ${
                                    report.code_quality_score >= 80
                                      ? "text-cyan-400"
                                      : "text-amber-500"
                                  }`}
                                >
                                  {report.code_quality_score}%
                                </span>
                              </div>
                            </div>

                            {/* Bugs Found */}
                            <div className="flex flex-col font-mono">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                                Bugs
                              </span>
                              <div className="mt-1 flex items-center gap-1">
                                <span
                                  className={`size-1.5 rounded-full ${report.bug_count > 0 ? "bg-red-500" : "bg-emerald-500"}`}
                                />
                                <span
                                  className={`text-xs font-bold ${report.bug_count > 0 ? "text-red-400" : "text-emerald-400"}`}
                                >
                                  {report.bug_count} detected
                                </span>
                              </div>
                            </div>

                            {/* Security Score */}
                            <div className="flex flex-col">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                                Security
                              </span>
                              <div className="mt-1 flex items-center gap-1">
                                <Shield className="size-3 text-emerald-400" />
                                <span
                                  className={`text-xs font-bold ${
                                    report.security_score >= 90
                                      ? "text-emerald-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {report.security_score}%
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action Footer */}
                          <div className="mt-3 flex items-center justify-between border-t border-slate-900 pt-3">
                            <span className="flex items-center gap-1 text-[10px] text-slate-500">
                              <Calendar className="size-3" />
                              {new Date(report.created_at).toLocaleDateString()}
                            </span>

                            {/* Quick Toolbars */}
                            <div className="flex items-center gap-2">
                              {/* Export trigger */}
                              <button
                                type="button"
                                onClick={(e) => handleExport(report.id, "pdf", e)}
                                className="flex size-7 items-center justify-center rounded-lg border border-slate-900 bg-slate-950 transition hover:border-slate-800 hover:text-cyan-400"
                                title="Download PDF"
                              >
                                <Download className="size-3.5" />
                              </button>

                              {/* Duplicate */}
                              <button
                                type="button"
                                onClick={(e) => handleDuplicate(report, e)}
                                className="flex size-7 items-center justify-center rounded-lg border border-slate-900 bg-slate-950 transition hover:border-slate-800 hover:text-cyan-400"
                                title="Duplicate Report"
                              >
                                <Copy className="size-3.5" />
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={(e) => handleDelete(report.id, e)}
                                className="flex size-7 items-center justify-center rounded-lg border border-slate-900 bg-slate-950 transition hover:border-red-500 hover:text-red-400"
                                title="Delete Report"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Right Panel: Aggregate Telemetries */}
            <div className="space-y-6">
              {/* Aggregation Stats Panel */}
              <div className="glass-panel space-y-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                  <TrendingUp className="size-4 text-cyan-400" />
                  Codebase Quality Aggregates
                </h3>

                <div className="space-y-4">
                  {/* Total audits run */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-900 bg-slate-950/60 p-3">
                    <span className="text-xs text-slate-400">Total Scan Reports</span>
                    <span className="text-base font-bold text-white">{reports.length}</span>
                  </div>

                  {/* Avg Score */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-900 bg-slate-950/60 p-3">
                    <span className="text-xs text-slate-400">Average Quality Score</span>
                    <span className="text-base font-bold text-cyan-400">{averageQuality}%</span>
                  </div>

                  {/* Top language */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-900 bg-slate-950/60 p-3">
                    <span className="text-xs text-slate-400">Primary Language</span>
                    <span className="text-xs font-bold tracking-wide text-white">
                      {topLanguage}
                    </span>
                  </div>

                  {/* Bugs Fixed */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-900 bg-slate-950/60 p-3">
                    <span className="text-xs text-slate-400">Total Bugs Found</span>
                    <span className="text-base font-bold text-red-400">{totalBugsFixed}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="glass-panel space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Quick Actions
                </h3>

                <Link
                  href="/analyze"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 text-xs font-bold text-white shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all hover:bg-cyan-600"
                >
                  <Play className="size-3.5 fill-current" />
                  Analyze New File
                </Link>

                {reports.length > 0 && (
                  <button
                    onClick={() => {
                      const latest = reports[0];
                      window.open(`${env.apiUrl}/api/v1/reports/${latest.id}/export/pdf`, "_blank");
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 py-3 text-xs font-bold text-white transition hover:bg-slate-700"
                  >
                    <Download className="size-3.5" />
                    Download Latest PDF
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* -------------------- DETAILS VIEW DIALOG MODAL -------------------- */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel flex h-[85vh] w-full max-w-4xl flex-col justify-between rounded-3xl border border-slate-800 bg-slate-950 p-6"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-900 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
                    <FileCode2 className="size-6" />
                  </div>
                  <div>
                    <h2 className="flex items-center gap-2 text-base font-bold text-white">
                      {selectedReport.file_name}
                      <span className="bg-slate-850 rounded-full px-2 py-0.5 text-[10px] font-normal text-slate-400">
                        Grade{" "}
                        {selectedReport.code_quality_score >= 80
                          ? "A"
                          : selectedReport.code_quality_score >= 60
                            ? "B"
                            : "C"}
                      </span>
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                      {selectedReport.analysis_type} scan • Generated{" "}
                      {new Date(selectedReport.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="flex size-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition hover:text-white"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Tab Selector Headers */}
              <div className="my-4 flex gap-2 overflow-x-auto border-b border-slate-900">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "bugs", label: "Bugs" },
                  { id: "security", label: "Security" },
                  { id: "performance", label: "Performance" },
                  { id: "code", label: "Optimizations" },
                  { id: "tests", label: "Tests" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() =>
                      setDetailsTab(
                        tab.id as
                          "overview" | "bugs" | "security" | "performance" | "code" | "tests",
                      )
                    }
                    className={`border-b-2 px-4 py-2 text-xs font-bold transition ${
                      detailsTab === tab.id
                        ? "border-cyan-400 text-cyan-400"
                        : "border-transparent text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Main Content Area */}
              <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                {/* 1. OVERVIEW VIEW */}
                {detailsTab === "overview" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {/* Metric cards */}
                      <div className="glass-panel border-slate-850 flex items-center gap-3 rounded-xl border bg-slate-900/30 p-4">
                        <Award className="size-6 text-cyan-400" />
                        <div>
                          <p className="text-[10px] font-bold uppercase text-slate-500">
                            Confidence Score
                          </p>
                          <p className="mt-0.5 text-base font-bold text-white">
                            {selectedReport.confidence}%
                          </p>
                        </div>
                      </div>
                      <div className="glass-panel border-slate-850 flex items-center gap-3 rounded-xl border bg-slate-900/30 p-4">
                        <Zap className="size-6 text-amber-400" />
                        <div>
                          <p className="text-[10px] font-bold uppercase text-slate-500">
                            Time Complexity
                          </p>
                          <p className="mt-0.5 text-base font-bold text-white">
                            {selectedReport.complexity.time || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="glass-panel border-slate-850 flex items-center gap-3 rounded-xl border bg-slate-900/30 p-4">
                        <Scale className="size-6 text-emerald-400" />
                        <div>
                          <p className="text-[10px] font-bold uppercase text-slate-500">
                            Space Complexity
                          </p>
                          <p className="mt-0.5 text-base font-bold text-white">
                            {selectedReport.complexity.space || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Executive Summary
                      </h3>
                      <p className="border-slate-850 rounded-xl border bg-slate-900/60 p-4 text-xs leading-relaxed text-slate-300">
                        {selectedReport.summary}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Complexity Explanation
                      </h3>
                      <p className="border-slate-850 rounded-xl border bg-slate-900/60 p-4 text-xs leading-relaxed text-slate-300">
                        {selectedReport.complexity.explanation ||
                          "No explanation details provided."}
                      </p>
                    </div>
                  </div>
                )}

                {/* 2. BUGS VIEW */}
                {detailsTab === "bugs" && (
                  <div className="space-y-3">
                    {selectedReport.issues.length === 0 ? (
                      <p className="py-6 text-center text-xs text-slate-500">
                        No bugs or formatting errors detected.
                      </p>
                    ) : (
                      selectedReport.issues.map((issue, idx) => (
                        <div
                          key={idx}
                          className="border-slate-850 flex items-start gap-3 rounded-xl border bg-slate-900/60 p-4"
                        >
                          <span
                            className={`mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              issue.severity === "high"
                                ? "border border-red-500/20 bg-red-500/10 text-red-400"
                                : "border border-amber-500/20 bg-amber-500/10 text-amber-400"
                            }`}
                          >
                            {issue.severity.toUpperCase()}
                          </span>
                          <div>
                            <h4 className="flex items-center gap-1.5 text-xs font-bold text-white">
                              {issue.title}
                              {issue.line_number && (
                                <span className="text-[10px] text-slate-500">
                                  (Line {issue.line_number})
                                </span>
                              )}
                            </h4>
                            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                              {issue.description}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* 3. SECURITY VIEW */}
                {detailsTab === "security" && (
                  <div className="space-y-3">
                    {selectedReport.security.length === 0 ? (
                      <p className="py-6 text-center text-xs text-slate-500">
                        No security vulnerability reports returned.
                      </p>
                    ) : (
                      selectedReport.security.map((sec, idx) => (
                        <div
                          key={idx}
                          className="border-slate-850 flex items-start gap-3 rounded-xl border bg-slate-900/60 p-4"
                        >
                          <span className="mt-0.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                            {sec.severity.toUpperCase()}
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-white">{sec.title}</h4>
                            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                              {sec.description}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* 4. PERFORMANCE VIEW */}
                {detailsTab === "performance" && (
                  <div className="space-y-3">
                    {selectedReport.performance.length === 0 ? (
                      <p className="py-6 text-center text-xs text-slate-500">
                        No performance issues found.
                      </p>
                    ) : (
                      selectedReport.performance.map((perf, idx) => (
                        <div
                          key={idx}
                          className="border-slate-850 flex items-start gap-3 rounded-xl border bg-slate-900/60 p-4"
                        >
                          <span className="mt-0.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-400">
                            IMPACT: {perf.impact.toUpperCase()}
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-white">{perf.title}</h4>
                            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                              {perf.description}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* 5. CODE OPTIMIZATION VIEW */}
                {detailsTab === "code" && (
                  <div className="relative h-full space-y-2">
                    <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
                      <button
                        onClick={() => navigator.clipboard.writeText(selectedReport.optimized_code)}
                        className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs text-slate-300 transition hover:bg-slate-900"
                      >
                        <Copy className="size-3.5" />
                        Copy Code
                      </button>
                    </div>
                    <pre className="h-[400px] overflow-x-auto rounded-2xl border border-slate-900 bg-slate-950 p-4 font-mono text-xs text-cyan-400">
                      <code>{selectedReport.optimized_code}</code>
                    </pre>
                  </div>
                )}

                {/* 6. UNIT TESTS VIEW */}
                {detailsTab === "tests" && (
                  <div className="relative h-full space-y-2">
                    <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(selectedReport.tests.join("\n\n"))
                        }
                        className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs text-slate-300 transition hover:bg-slate-900"
                      >
                        <Copy className="size-3.5" />
                        Copy Code
                      </button>
                    </div>
                    <pre className="h-[400px] overflow-x-auto rounded-2xl border border-slate-900 bg-slate-950 p-4 font-mono text-xs text-emerald-400">
                      <code>{selectedReport.tests.join("\n\n") || "# No tests generated."}</code>
                    </pre>
                  </div>
                )}
              </div>

              {/* Action Toolbar footer */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-900 pt-4">
                <span className="text-xs text-slate-500">
                  Select export schema to download report files.
                </span>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Download Options */}
                  <button
                    onClick={(e) => handleExport(selectedReport.id, "pdf", e)}
                    className="hover:bg-slate-850 flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-300 transition hover:text-white"
                  >
                    <Download className="size-3.5" />
                    PDF Report
                  </button>
                  <button
                    onClick={(e) => handleExport(selectedReport.id, "markdown", e)}
                    className="hover:bg-slate-850 flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-300 transition hover:text-white"
                  >
                    <FileText className="size-3.5" />
                    Markdown
                  </button>
                  <button
                    onClick={(e) => handleExport(selectedReport.id, "json", e)}
                    className="hover:bg-slate-850 flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-300 transition hover:text-white"
                  >
                    <FileCode2 className="size-3.5" />
                    JSON
                  </button>
                  <button
                    onClick={(e) => handleExport(selectedReport.id, "code", e)}
                    className="hover:bg-slate-850 flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-300 transition hover:text-white"
                  >
                    <FileCode2 className="size-3.5" />
                    Source Code
                  </button>
                  <button
                    onClick={(e) => handleExport(selectedReport.id, "tests", e)}
                    className="hover:bg-slate-850 flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-300 transition hover:text-white"
                  >
                    <SlidersHorizontal className="size-3.5" />
                    Unit Tests
                  </button>
                  <button
                    onClick={(e) => handleExport(selectedReport.id, "readme", e)}
                    className="hover:bg-slate-850 flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-300 transition hover:text-white"
                  >
                    <FileText className="size-3.5" />
                    README
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -------------------- REPORT COMPARISON VIEW MODAL -------------------- */}
      <AnimatePresence>
        {compareModalOpen && selectedForCompare.length === 2 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel flex h-[85vh] w-full max-w-4xl flex-col justify-between rounded-3xl border border-slate-800 bg-slate-950 p-6"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-900 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
                    <Scale className="size-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Compare Diagnostics Reports</h2>
                    <p className="mt-1 text-xs text-slate-400">
                      Side-by-side analysis comparison metrics: {selectedForCompare[0].file_name} vs{" "}
                      {selectedForCompare[1].file_name}
                    </p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setCompareModalOpen(false)}
                  className="flex size-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition hover:text-white"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Main Comparison Body */}
              <div className="flex-1 space-y-6 overflow-y-auto py-4 pr-2">
                {/* Comparison Grid */}
                <div className="grid grid-cols-3 gap-4 border-b border-slate-900 pb-6">
                  <div className="text-xs font-bold uppercase text-slate-500">Audit Metrics</div>
                  <div className="text-xs font-bold text-slate-300">
                    {selectedForCompare[0].file_name} (A)
                  </div>
                  <div className="text-xs font-bold text-slate-300">
                    {selectedForCompare[1].file_name} (B)
                  </div>

                  {/* Quality Score */}
                  <div className="self-center text-xs text-slate-400">Quality Score</div>
                  <div className="self-center text-base font-bold text-white">
                    {selectedForCompare[0].code_quality_score}%
                  </div>
                  <div className="flex items-center gap-2 self-center text-base font-bold text-cyan-400">
                    {selectedForCompare[1].code_quality_score}%
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] ${
                        selectedForCompare[1].code_quality_score >=
                        selectedForCompare[0].code_quality_score
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {selectedForCompare[1].code_quality_score -
                        selectedForCompare[0].code_quality_score >=
                      0
                        ? "+"
                        : ""}
                      {selectedForCompare[1].code_quality_score -
                        selectedForCompare[0].code_quality_score}
                      %
                    </span>
                  </div>

                  {/* Bug counts */}
                  <div className="self-center text-xs text-slate-400">Bugs Count</div>
                  <div className="self-center text-xs text-slate-300">
                    {selectedForCompare[0].bug_count} bugs
                  </div>
                  <div className="flex items-center gap-2 self-center text-xs text-slate-300">
                    {selectedForCompare[1].bug_count} bugs
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] ${
                        selectedForCompare[1].bug_count <= selectedForCompare[0].bug_count
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {selectedForCompare[1].bug_count - selectedForCompare[0].bug_count}
                    </span>
                  </div>

                  {/* Security scores */}
                  <div className="self-center text-xs text-slate-400">Security Score</div>
                  <div className="self-center text-base font-bold text-white">
                    {selectedForCompare[0].security_score}%
                  </div>
                  <div className="flex items-center gap-2 self-center text-base font-bold text-emerald-400">
                    {selectedForCompare[1].security_score}%
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] ${
                        selectedForCompare[1].security_score >= selectedForCompare[0].security_score
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {selectedForCompare[1].security_score -
                        selectedForCompare[0].security_score >=
                      0
                        ? "+"
                        : ""}
                      {selectedForCompare[1].security_score - selectedForCompare[0].security_score}%
                    </span>
                  </div>

                  {/* Scan Date */}
                  <div className="self-center text-xs text-slate-400">Scan Date</div>
                  <div className="self-center text-xs text-slate-400">
                    {new Date(selectedForCompare[0].created_at).toLocaleDateString()}
                  </div>
                  <div className="self-center text-xs text-slate-400">
                    {new Date(selectedForCompare[1].created_at).toLocaleDateString()}
                  </div>
                </div>

                {/* Detailed summaries comparison */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Report A Summary
                    </h3>
                    <p className="text-slate-450 border-slate-850 rounded-xl border bg-slate-900/40 p-4 text-xs leading-relaxed">
                      {selectedForCompare[0].summary}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Report B Summary
                    </h3>
                    <p className="text-slate-450 border-slate-850 rounded-xl border bg-slate-900/40 p-4 text-xs leading-relaxed">
                      {selectedForCompare[1].summary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Toolbar footer */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-900 pt-4">
                <span className="text-xs text-slate-500">
                  Compare results metrics delta logs successfully generated.
                </span>

                <button
                  onClick={() => setCompareModalOpen(false)}
                  className="border-slate-850 rounded-xl border bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
                >
                  Close Comparison
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Guided Tour Tooltip Overlays */}
      <AnimatePresence>
        {tourStep && (
          <div className="pointer-events-none fixed inset-0 z-50">
            {tourStep === "5" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="glass-panel pointer-events-auto absolute bottom-24 left-[280px] flex w-full max-w-sm flex-col space-y-3 rounded-2xl border border-cyan-500/30 bg-slate-950/95 p-5 shadow-[0_0_50px_rgba(6,182,212,0.25)]"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                    Tour • Step 5 of 6
                  </span>
                  <button
                    onClick={skipTour}
                    className="hover:text-slate-350 text-[10px] font-bold text-slate-500 transition"
                  >
                    Skip
                  </button>
                </div>
                <h3 className="text-xs font-bold leading-tight text-white">
                  Reports Archival & History
                </h3>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  This archives every scan report, allowing search filters, deleting entries,
                  duplicating audits, and comparing metrics.
                </p>
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => router.push("/reports?tour=6")}
                    className="flex items-center gap-1 rounded-lg bg-cyan-500 px-3.5 py-1.5 text-[10px] font-bold text-white transition hover:bg-cyan-600"
                  >
                    Next: Export Formats
                    <ChevronRight className="size-3" />
                  </button>
                </div>
              </motion.div>
            )}

            {tourStep === "6" && (
              <motion.div
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="glass-panel pointer-events-auto absolute bottom-24 right-[420px] flex w-full max-w-sm flex-col space-y-3 rounded-2xl border border-cyan-500/30 bg-slate-950/95 p-5 shadow-[0_0_50px_rgba(6,182,212,0.25)]"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                    Tour • Step 6 of 6
                  </span>
                  <button
                    onClick={skipTour}
                    className="hover:text-slate-350 text-[10px] font-bold text-slate-500 transition"
                  >
                    Skip
                  </button>
                </div>
                <h3 className="text-xs font-bold leading-tight text-white">
                  One-Click Multi-Format Export
                </h3>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  Export code audits to PDF, Markdown, and JSON, or download optimized code
                  snippets, unit tests, and README files.
                </p>
                <div className="flex justify-end pt-1">
                  <button
                    onClick={skipTour}
                    className="flex items-center gap-1 rounded-lg bg-cyan-500 px-3.5 py-1.5 text-[10px] font-bold text-white transition hover:bg-cyan-600"
                  >
                    Finish Tour
                    <Check className="size-3" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ReportsHistoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#060814]" />}>
      <ReportsHistoryPageContent />
    </Suspense>
  );
}
