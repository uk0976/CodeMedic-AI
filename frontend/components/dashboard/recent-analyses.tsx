"use client";

import { useState } from "react";
import { FileCode, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface Analysis {
  id: string;
  fileName: string;
  language: string;
  type: "Bug Fix" | "Security Scan" | "Optimization" | "Refactoring";
  status: "Completed" | "Running" | "Failed";
  date: string;
}

export function RecentAnalyses() {
  const [filter, setFilter] = useState<string>("All");

  const analyses: Analysis[] = [
    {
      id: "1",
      fileName: "index.py",
      language: "Python",
      type: "Bug Fix",
      status: "Completed",
      date: "Aug 1, 2026",
    },
    {
      id: "2",
      fileName: "AuthService.java",
      language: "Java",
      type: "Security Scan",
      status: "Completed",
      date: "Jul 31, 2026",
    },
    {
      id: "3",
      fileName: "http.ts",
      language: "TypeScript",
      type: "Optimization",
      status: "Completed",
      date: "Jul 30, 2026",
    },
    {
      id: "4",
      fileName: "main.cpp",
      language: "C++",
      type: "Bug Fix",
      status: "Running",
      date: "Just now",
    },
    {
      id: "5",
      fileName: "db.go",
      language: "Go",
      type: "Security Scan",
      status: "Failed",
      date: "Jul 28, 2026",
    },
  ];

  const filteredAnalyses =
    filter === "All" ? analyses : analyses.filter((a) => a.status === filter);

  const getStatusStyle = (status: Analysis["status"]) => {
    switch (status) {
      case "Completed":
        return "border-emerald-500/20 bg-emerald-500/5 text-emerald-400";
      case "Running":
        return "border-cyan-500/20 bg-cyan-500/5 text-cyan-400";
      case "Failed":
        return "border-red-500/20 bg-red-500/5 text-red-400";
    }
  };

  const getLanguageColor = (lang: string) => {
    switch (lang) {
      case "Python":
        return "text-blue-400 bg-blue-500/5 border-blue-500/20";
      case "Java":
        return "text-orange-400 bg-orange-500/5 border-orange-500/20";
      case "TypeScript":
        return "text-cyan-400 bg-cyan-500/5 border-cyan-500/20";
      case "C++":
        return "text-pink-400 bg-pink-500/5 border-pink-500/20";
      case "Go":
        return "text-teal-400 bg-teal-500/5 border-teal-500/20";
      default:
        return "text-slate-400 bg-slate-500/5 border-slate-500/20";
    }
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-base font-bold text-white">Recent Analyses</h2>
          <p className="mt-0.5 text-xs leading-normal text-slate-400">
            A history of recent diagnostics run on your codebase.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 p-1">
          {["All", "Completed", "Running", "Failed"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filter === status
                  ? "bg-slate-800 text-white"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800/60 pb-3 text-slate-500">
              <th className="pb-3 font-semibold">File Name</th>
              <th className="pb-3 font-semibold">Language</th>
              <th className="pb-3 font-semibold">Analysis Type</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold">Date</th>
              <th className="pb-3 text-right font-semibold">Report</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {filteredAnalyses.map((analysis, i) => (
              <motion.tr
                key={analysis.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="group hover:bg-slate-900/20"
              >
                {/* File Name */}
                <td className="py-4.5 font-medium text-slate-200">
                  <div className="flex items-center gap-2.5">
                    <FileCode className="size-4 text-slate-400 transition-colors group-hover:text-cyan-400" />
                    <span>{analysis.fileName}</span>
                  </div>
                </td>

                {/* Language */}
                <td className="py-4.5">
                  <span
                    className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-[11px] font-medium ${getLanguageColor(analysis.language)}`}
                  >
                    {analysis.language}
                  </span>
                </td>

                {/* Analysis Type */}
                <td className="py-4.5 font-medium text-slate-400">{analysis.type}</td>

                {/* Status */}
                <td className="py-4.5">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${getStatusStyle(analysis.status)}`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        analysis.status === "Completed"
                          ? "bg-emerald-400"
                          : analysis.status === "Running"
                            ? "animate-pulse bg-cyan-400"
                            : "bg-red-400"
                      }`}
                    />
                    {analysis.status}
                  </span>
                </td>

                {/* Date */}
                <td className="py-4.5 font-medium text-slate-500">{analysis.date}</td>

                {/* Open Report */}
                <td className="py-4.5 text-right">
                  <button
                    type="button"
                    onClick={() => alert(`Opening report for ${analysis.fileName} (In next phase)`)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/40 px-2.5 py-1.5 font-semibold text-slate-400 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
                  >
                    <span>View</span>
                    <ExternalLink className="size-3" />
                  </button>
                </td>
              </motion.tr>
            ))}

            {filteredAnalyses.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center font-medium text-slate-500">
                  No analyses found with status: &quot;{filter}&quot;
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
