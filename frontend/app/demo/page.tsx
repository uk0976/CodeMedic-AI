"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/top-bar";
import { StatsSection } from "@/components/dashboard/stats-section";
import { RecentAnalyses } from "@/components/dashboard/recent-analyses";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { LanguagesShowcase } from "@/components/dashboard/languages-showcase";
import { RightPanel } from "@/components/dashboard/right-panel";
import { motion } from "framer-motion";
import { Play, Upload } from "lucide-react";

export default function EvaluatorDemoPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 20 } },
  };

  return (
    <div className="min-h-screen bg-[#060814] text-slate-100 font-sans">
      {/* Sidebar Panel */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Workspace Frame */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top bar header */}
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        {/* Content container */}
        <main className="flex-1 p-5 md:p-8 max-w-[1600px] w-full mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start"
          >
            {/* Left and Middle Workspace Elements */}
            <div className="xl:col-span-3 space-y-7">
              {/* Main Hero Header Card */}
              <motion.div 
                variants={itemVariants}
                className="glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-slate-800/80 bg-gradient-to-br from-slate-900/60 via-slate-950/40 to-cyan-950/10"
              >
                {/* Decorative gradients */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-blue-600/5 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10 max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3.5 py-1 text-xs font-semibold text-cyan-300">
                    <span className="size-1.5 rounded-full bg-cyan-400 animate-ping" />
                    Evaluator Session Active
                  </div>
                  <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                    Welcome back 👋
                  </h1>
                  <p className="mt-3 text-sm text-slate-400 leading-relaxed max-w-xl">
                    Ready to debug smarter? CodeMedic AI helps you fix code flaws, optimize performance bottlenecks, write tests, and harden application security in real-time.
                  </p>
                  
                  {/* Action buttons */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => alert("Analyze Code action triggered")}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/10 hover:brightness-115 transition"
                    >
                      <Play className="size-3.5 fill-white text-white" />
                      <span>Analyze New Code</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => alert("Upload File action triggered")}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/40 px-5 py-3 text-xs font-bold text-slate-300 hover:border-slate-700 hover:text-white transition"
                    >
                      <Upload className="size-3.5" />
                      <span>Upload File</span>
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Statistics Cards */}
              <motion.div variants={itemVariants}>
                <StatsSection />
              </motion.div>

              {/* Quick Actions Grid */}
              <motion.div variants={itemVariants}>
                <QuickActions />
              </motion.div>

              {/* Recent Analyses List */}
              <motion.div variants={itemVariants}>
                <RecentAnalyses />
              </motion.div>

              {/* Supported Languages Showcase */}
              <motion.div variants={itemVariants}>
                <LanguagesShowcase />
              </motion.div>
            </div>

            {/* Right Insights Sidebar Panel */}
            <motion.div 
              variants={itemVariants}
              className="space-y-6"
            >
              <RightPanel />
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
