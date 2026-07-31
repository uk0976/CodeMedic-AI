"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/top-bar";
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
  TrendingUp,
  Scale
} from "lucide-react";
import Link from "next/link";

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

export default function ReportsHistoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
  const [detailsTab, setDetailsTab] = useState<"overview" | "bugs" | "security" | "performance" | "code" | "tests">("overview");

  // Load reports
  const fetchReports = async () => {
    try {
      setLoading(true);
      const url = new URL("http://localhost:8000/api/v1/reports/");
      if (search) url.searchParams.append("search", search);
      if (languageFilter && languageFilter !== "all") url.searchParams.append("language", languageFilter);
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
      const res = await fetch(`http://localhost:8000/api/v1/reports/${id}`, {
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
      const res = await fetch("http://localhost:8000/api/v1/reports/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...report,
          file_name: `${report.file_name.split(".")[0]}_copy.${report.file_name.split(".")[1] || "py"}`
        })
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
    window.open(`http://localhost:8000/api/v1/reports/${reportId}/export/${format}`, "_blank");
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
    <div className="min-h-screen bg-[#060814] text-slate-100 font-sans">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-5 md:p-8 max-w-[1600px] w-full mx-auto">
          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
            
            {/* Left/Middle: Reports Directory Area */}
            <div className="xl:col-span-3 space-y-6">
              
              {/* Header Title */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                    Analysis Reports Directory
                  </h1>
                  <p className="text-sm text-slate-400 mt-1">
                    Manage diagnostic logs, compare audits, and export multi-format summaries.
                  </p>
                </div>

                {selectedForCompare.length === 2 && (
                  <motion.button
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={() => setCompareModalOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30 px-4 py-2 text-xs font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                  >
                    <Scale className="size-4" />
                    Compare Selected ({selectedForCompare.length})
                  </motion.button>
                )}
              </div>

              {/* Filters / Toolbar */}
              <div className="glass-panel rounded-2xl border border-slate-800 bg-slate-900/40 p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                
                {/* Search Bar */}
                <div className="relative w-full md:max-w-xs">
                  <Search className="absolute left-3.5 top-2.5 size-4 text-slate-500" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by file name..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-700 transition"
                  />
                </div>

                {/* Filter / Sort drop downs */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                  
                  {/* Language Filter */}
                  <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-1.5">
                    <SlidersHorizontal className="size-3.5 text-slate-500" />
                    <select
                      value={languageFilter}
                      onChange={(e) => setLanguageFilter(e.target.value)}
                      className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
                    >
                      <option value="all" className="bg-slate-900 text-slate-300">All Languages</option>
                      <option value="python" className="bg-slate-900 text-slate-300">Python</option>
                      <option value="javascript" className="bg-slate-900 text-slate-300">JavaScript</option>
                      <option value="typescript" className="bg-slate-900 text-slate-300">TypeScript</option>
                      <option value="java" className="bg-slate-900 text-slate-300">Java</option>
                      <option value="cpp" className="bg-slate-900 text-slate-300">C++</option>
                      <option value="go" className="bg-slate-900 text-slate-300">Go</option>
                      <option value="rust" className="bg-slate-900 text-slate-300">Rust</option>
                    </select>
                  </div>

                  {/* Sorting dropdown */}
                  <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-1.5">
                    <ArrowUpDown className="size-3.5 text-slate-500" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
                    >
                      <option value="newest" className="bg-slate-900 text-slate-300">Newest First</option>
                      <option value="oldest" className="bg-slate-900 text-slate-300">Oldest First</option>
                      <option value="highest_score" className="bg-slate-900 text-slate-300">Highest Score</option>
                      <option value="most_bugs" className="bg-slate-900 text-slate-300">Most Bugs</option>
                      <option value="alphabetical" className="bg-slate-900 text-slate-300">Alphabetical</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Reports Grid */}
              {loading ? (
                // Loading Skeletons
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-44 rounded-2xl bg-slate-900/40 border border-slate-850 animate-pulse p-5 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="h-4 w-1/3 bg-slate-800 rounded" />
                        <div className="h-3 w-2/3 bg-slate-800/60 rounded" />
                      </div>
                      <div className="h-8 bg-slate-800 rounded" />
                    </div>
                  ))}
                </div>
              ) : reports.length === 0 ? (
                // Empty state
                <div className="glass-panel rounded-2xl border border-slate-800/80 bg-slate-900/10 p-12 flex flex-col items-center text-center">
                  <div className="size-16 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-center text-slate-400 mb-4">
                    <FileText className="size-8" />
                  </div>
                  <h3 className="text-base font-bold text-white">No reports generated yet</h3>
                  <p className="text-xs text-slate-500 mt-2 max-w-sm">
                    Analyze code snippets inside the Editor Workspace first to start building your diagnostic database.
                  </p>
                  <Link
                    href="/analyze"
                    className="mt-6 flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 px-5 py-2.5 text-xs font-bold text-white transition"
                  >
                    <Play className="size-3.5 fill-current" />
                    Start First Analysis
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          className="group relative cursor-pointer glass-panel rounded-2xl border border-slate-800 bg-slate-900/30 hover:bg-slate-900/60 p-5 flex flex-col justify-between transition-all hover:border-slate-700 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                        >
                          {/* Selection Checkbox */}
                          <div
                            onClick={(e) => handleToggleCompare(report, e)}
                            className="absolute top-4 right-4 z-10 size-5 rounded-lg border border-slate-800 bg-slate-950 flex items-center justify-center hover:border-slate-600 transition"
                            title="Select to compare"
                          >
                            {isSelected && <Check className="size-3.5 text-cyan-400" />}
                          </div>

                          <div>
                            {/* Title & Language */}
                            <div className="flex items-center gap-3">
                              <div className="size-9 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-300">
                                <FileCode2 className="size-5" />
                              </div>
                              <div>
                                <h3 className="text-sm font-bold text-white truncate max-w-[180px]">
                                  {report.file_name}
                                </h3>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[10px] uppercase font-bold text-slate-500">
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
                            <p className="text-xs text-slate-500 line-clamp-2 mt-3 leading-relaxed">
                              {report.summary}
                            </p>
                          </div>

                          {/* Quick Metrics Grid */}
                          <div className="grid grid-cols-3 gap-2 border-t border-slate-900 pt-4 mt-4">
                            
                            {/* Quality Score */}
                            <div className="flex flex-col">
                              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Quality</span>
                              <div className="flex items-center gap-1 mt-1">
                                <Award className="size-3 text-cyan-400" />
                                <span className={`text-xs font-bold ${
                                  report.code_quality_score >= 80 ? "text-cyan-400" : "text-amber-500"
                                }`}>
                                  {report.code_quality_score}%
                                </span>
                              </div>
                            </div>

                            {/* Bugs Found */}
                            <div className="flex flex-col font-mono">
                              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Bugs</span>
                              <div className="flex items-center gap-1 mt-1">
                                <span className={`size-1.5 rounded-full ${report.bug_count > 0 ? "bg-red-500" : "bg-emerald-500"}`} />
                                <span className={`text-xs font-bold ${report.bug_count > 0 ? "text-red-400" : "text-emerald-400"}`}>
                                  {report.bug_count} detected
                                </span>
                              </div>
                            </div>

                            {/* Security Score */}
                            <div className="flex flex-col">
                              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Security</span>
                              <div className="flex items-center gap-1 mt-1">
                                <Shield className="size-3 text-emerald-400" />
                                <span className={`text-xs font-bold ${
                                  report.security_score >= 90 ? "text-emerald-400" : "text-red-400"
                                }`}>
                                  {report.security_score}%
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action Footer */}
                          <div className="flex items-center justify-between border-t border-slate-900 pt-3 mt-3">
                            <span className="text-[10px] text-slate-500 flex items-center gap-1">
                              <Calendar className="size-3" />
                              {new Date(report.created_at).toLocaleDateString()}
                            </span>

                            {/* Quick Toolbars */}
                            <div className="flex items-center gap-2">
                              {/* Export trigger */}
                              <button
                                type="button"
                                onClick={(e) => handleExport(report.id, "pdf", e)}
                                className="size-7 rounded-lg bg-slate-950 border border-slate-900 hover:border-slate-800 hover:text-cyan-400 flex items-center justify-center transition"
                                title="Download PDF"
                              >
                                <Download className="size-3.5" />
                              </button>

                              {/* Duplicate */}
                              <button
                                type="button"
                                onClick={(e) => handleDuplicate(report, e)}
                                className="size-7 rounded-lg bg-slate-950 border border-slate-900 hover:border-slate-800 hover:text-cyan-400 flex items-center justify-center transition"
                                title="Duplicate Report"
                              >
                                <Copy className="size-3.5" />
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={(e) => handleDelete(report.id, e)}
                                className="size-7 rounded-lg bg-slate-950 border border-slate-900 hover:border-red-500 hover:text-red-400 flex items-center justify-center transition"
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
              <div className="glass-panel rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-6">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="size-4 text-cyan-400" />
                  Codebase Quality Aggregates
                </h3>

                <div className="space-y-4">
                  {/* Total audits run */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-900">
                    <span className="text-xs text-slate-400">Total Scan Reports</span>
                    <span className="text-base font-bold text-white">{reports.length}</span>
                  </div>

                  {/* Avg Score */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-900">
                    <span className="text-xs text-slate-400">Average Quality Score</span>
                    <span className="text-base font-bold text-cyan-400">{averageQuality}%</span>
                  </div>

                  {/* Top language */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-900">
                    <span className="text-xs text-slate-400">Primary Language</span>
                    <span className="text-xs font-bold text-white tracking-wide">{topLanguage}</span>
                  </div>

                  {/* Bugs Fixed */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-900">
                    <span className="text-xs text-slate-400">Total Bugs Found</span>
                    <span className="text-base font-bold text-red-400">{totalBugsFixed}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="glass-panel rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Actions</h3>
                
                <Link
                  href="/analyze"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 py-3 text-xs font-bold text-white transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                >
                  <Play className="size-3.5 fill-current" />
                  Analyze New File
                </Link>

                {reports.length > 0 && (
                  <button
                    onClick={() => {
                      const latest = reports[0];
                      window.open(`http://localhost:8000/api/v1/reports/${latest.id}/export/pdf`, "_blank");
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 py-3 text-xs font-bold text-white border border-slate-700 transition"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel w-full max-w-4xl h-[85vh] rounded-3xl border border-slate-800 bg-slate-950 p-6 flex flex-col justify-between"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-900 pb-4">
                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <FileCode2 className="size-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      {selectedReport.file_name}
                      <span className="text-[10px] bg-slate-850 px-2 py-0.5 rounded-full text-slate-400 font-normal">
                        Grade {selectedReport.code_quality_score >= 80 ? "A" : selectedReport.code_quality_score >= 60 ? "B" : "C"}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      {selectedReport.analysis_type} scan  •  Generated {new Date(selectedReport.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="size-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Tab Selector Headers */}
              <div className="flex border-b border-slate-900 my-4 overflow-x-auto gap-2">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "bugs", label: "Bugs" },
                  { id: "security", label: "Security" },
                  { id: "performance", label: "Performance" },
                  { id: "code", label: "Optimizations" },
                  { id: "tests", label: "Tests" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setDetailsTab(tab.id as "overview" | "bugs" | "security" | "performance" | "code" | "tests")}
                    className={`px-4 py-2 text-xs font-bold border-b-2 transition ${
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
              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                
                {/* 1. OVERVIEW VIEW */}
                {detailsTab === "overview" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Metric cards */}
                      <div className="glass-panel p-4 rounded-xl bg-slate-900/30 border border-slate-850 flex items-center gap-3">
                        <Award className="size-6 text-cyan-400" />
                        <div>
                          <p className="text-[10px] text-slate-500 font-bold uppercase">Confidence Score</p>
                          <p className="text-base font-bold text-white mt-0.5">{selectedReport.confidence}%</p>
                        </div>
                      </div>
                      <div className="glass-panel p-4 rounded-xl bg-slate-900/30 border border-slate-850 flex items-center gap-3">
                        <Zap className="size-6 text-amber-400" />
                        <div>
                          <p className="text-[10px] text-slate-500 font-bold uppercase">Time Complexity</p>
                          <p className="text-base font-bold text-white mt-0.5">{selectedReport.complexity.time || "N/A"}</p>
                        </div>
                      </div>
                      <div className="glass-panel p-4 rounded-xl bg-slate-900/30 border border-slate-850 flex items-center gap-3">
                        <Scale className="size-6 text-emerald-400" />
                        <div>
                          <p className="text-[10px] text-slate-500 font-bold uppercase">Space Complexity</p>
                          <p className="text-base font-bold text-white mt-0.5">{selectedReport.complexity.space || "N/A"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Executive Summary</h3>
                      <p className="text-xs text-slate-300 leading-relaxed p-4 rounded-xl bg-slate-900/60 border border-slate-850">
                        {selectedReport.summary}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Complexity Explanation</h3>
                      <p className="text-xs text-slate-300 leading-relaxed p-4 rounded-xl bg-slate-900/60 border border-slate-850">
                        {selectedReport.complexity.explanation || "No explanation details provided."}
                      </p>
                    </div>
                  </div>
                )}

                {/* 2. BUGS VIEW */}
                {detailsTab === "bugs" && (
                  <div className="space-y-3">
                    {selectedReport.issues.length === 0 ? (
                      <p className="text-xs text-slate-500 py-6 text-center">No bugs or formatting errors detected.</p>
                    ) : (
                      selectedReport.issues.map((issue, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-850 flex items-start gap-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold mt-0.5 ${
                            issue.severity === "high" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}>
                            {issue.severity.toUpperCase()}
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                              {issue.title}
                              {issue.line_number && <span className="text-[10px] text-slate-500">(Line {issue.line_number})</span>}
                            </h4>
                            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{issue.description}</p>
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
                      <p className="text-xs text-slate-500 py-6 text-center">No security vulnerability reports returned.</p>
                    ) : (
                      selectedReport.security.map((sec, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-850 flex items-start gap-3">
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 mt-0.5">
                            {sec.severity.toUpperCase()}
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-white">{sec.title}</h4>
                            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{sec.description}</p>
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
                      <p className="text-xs text-slate-500 py-6 text-center">No performance issues found.</p>
                    ) : (
                      selectedReport.performance.map((perf, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-850 flex items-start gap-3">
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mt-0.5">
                            IMPACT: {perf.impact.toUpperCase()}
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-white">{perf.title}</h4>
                            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{perf.description}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* 5. CODE OPTIMIZATION VIEW */}
                {detailsTab === "code" && (
                  <div className="space-y-2 relative h-full">
                    <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
                      <button
                        onClick={() => navigator.clipboard.writeText(selectedReport.optimized_code)}
                        className="bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-300 p-2 rounded-lg text-xs flex items-center gap-1.5 transition"
                      >
                        <Copy className="size-3.5" />
                        Copy Code
                      </button>
                    </div>
                    <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-900 text-xs font-mono text-cyan-400 overflow-x-auto h-[400px]">
                      <code>{selectedReport.optimized_code}</code>
                    </pre>
                  </div>
                )}

                {/* 6. UNIT TESTS VIEW */}
                {detailsTab === "tests" && (
                  <div className="space-y-2 relative h-full">
                    <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
                      <button
                        onClick={() => navigator.clipboard.writeText(selectedReport.tests.join("\n\n"))}
                        className="bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-300 p-2 rounded-lg text-xs flex items-center gap-1.5 transition"
                      >
                        <Copy className="size-3.5" />
                        Copy Code
                      </button>
                    </div>
                    <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-900 text-xs font-mono text-emerald-400 overflow-x-auto h-[400px]">
                      <code>{selectedReport.tests.join("\n\n") || "# No tests generated."}</code>
                    </pre>
                  </div>
                )}

              </div>

              {/* Action Toolbar footer */}
              <div className="border-t border-slate-900 pt-4 mt-4 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  Select export schema to download report files.
                </span>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Download Options */}
                  <button
                    onClick={(e) => handleExport(selectedReport.id, "pdf", e)}
                    className="flex items-center gap-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:text-white px-3.5 py-2 text-xs font-bold text-slate-300 transition"
                  >
                    <Download className="size-3.5" />
                    PDF Report
                  </button>
                  <button
                    onClick={(e) => handleExport(selectedReport.id, "markdown", e)}
                    className="flex items-center gap-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:text-white px-3.5 py-2 text-xs font-bold text-slate-300 transition"
                  >
                    <FileText className="size-3.5" />
                    Markdown
                  </button>
                  <button
                    onClick={(e) => handleExport(selectedReport.id, "json", e)}
                    className="flex items-center gap-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:text-white px-3.5 py-2 text-xs font-bold text-slate-300 transition"
                  >
                    <FileCode2 className="size-3.5" />
                    JSON
                  </button>
                  <button
                    onClick={(e) => handleExport(selectedReport.id, "code", e)}
                    className="flex items-center gap-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:text-white px-3.5 py-2 text-xs font-bold text-slate-300 transition"
                  >
                    <FileCode2 className="size-3.5" />
                    Source Code
                  </button>
                  <button
                    onClick={(e) => handleExport(selectedReport.id, "tests", e)}
                    className="flex items-center gap-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:text-white px-3.5 py-2 text-xs font-bold text-slate-300 transition"
                  >
                    <SlidersHorizontal className="size-3.5" />
                    Unit Tests
                  </button>
                  <button
                    onClick={(e) => handleExport(selectedReport.id, "readme", e)}
                    className="flex items-center gap-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:text-white px-3.5 py-2 text-xs font-bold text-slate-300 transition"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel w-full max-w-4xl h-[85vh] rounded-3xl border border-slate-800 bg-slate-950 p-6 flex flex-col justify-between"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-900 pb-4">
                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Scale className="size-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Compare Diagnostics Reports</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Side-by-side analysis comparison metrics: {selectedForCompare[0].file_name} vs {selectedForCompare[1].file_name}
                    </p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setCompareModalOpen(false)}
                  className="size-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Main Comparison Body */}
              <div className="flex-1 overflow-y-auto pr-2 py-4 space-y-6">
                
                {/* Comparison Grid */}
                <div className="grid grid-cols-3 gap-4 border-b border-slate-900 pb-6">
                  <div className="text-xs font-bold text-slate-500 uppercase">Audit Metrics</div>
                  <div className="text-xs font-bold text-slate-300">{selectedForCompare[0].file_name} (A)</div>
                  <div className="text-xs font-bold text-slate-300">{selectedForCompare[1].file_name} (B)</div>

                  {/* Quality Score */}
                  <div className="text-xs text-slate-400 self-center">Quality Score</div>
                  <div className="text-base font-bold text-white self-center">
                    {selectedForCompare[0].code_quality_score}%
                  </div>
                  <div className="text-base font-bold text-cyan-400 self-center flex items-center gap-2">
                    {selectedForCompare[1].code_quality_score}%
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      selectedForCompare[1].code_quality_score >= selectedForCompare[0].code_quality_score ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                    }`}>
                      {selectedForCompare[1].code_quality_score - selectedForCompare[0].code_quality_score >= 0 ? "+" : ""}
                      {selectedForCompare[1].code_quality_score - selectedForCompare[0].code_quality_score}%
                    </span>
                  </div>

                  {/* Bug counts */}
                  <div className="text-xs text-slate-400 self-center">Bugs Count</div>
                  <div className="text-xs text-slate-300 self-center">{selectedForCompare[0].bug_count} bugs</div>
                  <div className="text-xs text-slate-300 self-center flex items-center gap-2">
                    {selectedForCompare[1].bug_count} bugs
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      selectedForCompare[1].bug_count <= selectedForCompare[0].bug_count ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                    }`}>
                      {selectedForCompare[1].bug_count - selectedForCompare[0].bug_count}
                    </span>
                  </div>

                  {/* Security scores */}
                  <div className="text-xs text-slate-400 self-center">Security Score</div>
                  <div className="text-base font-bold text-white self-center">{selectedForCompare[0].security_score}%</div>
                  <div className="text-base font-bold text-emerald-400 self-center flex items-center gap-2">
                    {selectedForCompare[1].security_score}%
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      selectedForCompare[1].security_score >= selectedForCompare[0].security_score ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                    }`}>
                      {selectedForCompare[1].security_score - selectedForCompare[0].security_score >= 0 ? "+" : ""}
                      {selectedForCompare[1].security_score - selectedForCompare[0].security_score}%
                    </span>
                  </div>

                  {/* Scan Date */}
                  <div className="text-xs text-slate-400 self-center">Scan Date</div>
                  <div className="text-xs text-slate-400 self-center">
                    {new Date(selectedForCompare[0].created_at).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-slate-400 self-center">
                    {new Date(selectedForCompare[1].created_at).toLocaleDateString()}
                  </div>
                </div>

                {/* Detailed summaries comparison */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Report A Summary</h3>
                    <p className="text-xs text-slate-450 bg-slate-900/40 p-4 rounded-xl border border-slate-850 leading-relaxed">
                      {selectedForCompare[0].summary}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Report B Summary</h3>
                    <p className="text-xs text-slate-450 bg-slate-900/40 p-4 rounded-xl border border-slate-850 leading-relaxed">
                      {selectedForCompare[1].summary}
                    </p>
                  </div>
                </div>

              </div>

              {/* Action Toolbar footer */}
              <div className="border-t border-slate-900 pt-4 mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Compare results metrics delta logs successfully generated.
                </span>

                <button
                  onClick={() => setCompareModalOpen(false)}
                  className="rounded-xl bg-slate-900 border border-slate-850 hover:bg-slate-800 px-5 py-2.5 text-xs font-bold text-white transition"
                >
                  Close Comparison
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
