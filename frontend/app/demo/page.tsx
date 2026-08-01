"use client";

import { useState, Suspense } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/top-bar";
import { StatsSection } from "@/components/dashboard/stats-section";
import { RecentAnalyses } from "@/components/dashboard/recent-analyses";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { LanguagesShowcase } from "@/components/dashboard/languages-showcase";
import { RightPanel } from "@/components/dashboard/right-panel";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Upload, ChevronRight } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

function EvaluatorDemoPageContent() {
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
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 260, damping: 20 },
    },
  };

  const searchParams = useSearchParams();
  const router = useRouter();
  const showTour = searchParams.get("tour") === "true";

  const skipTour = () => {
    router.push("/demo");
  };

  const nextStep = () => {
    router.push("/analyze?tour=2");
  };

  return (
    <div className="relative min-h-screen bg-[#060814] font-sans text-slate-100">
      {/* Guided Tour Step 1 */}
      <AnimatePresence>
        {showTour && (
          <div className="backdrop-blur-xs pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-slate-950/20 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel pointer-events-auto flex w-full max-w-sm flex-col space-y-4 rounded-2xl border border-cyan-500/30 bg-slate-950/95 p-6 shadow-[0_0_50px_rgba(6,182,212,0.25)]"
            >
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                  Guided Tour • Step 1 of 6
                </span>
                <button
                  onClick={skipTour}
                  className="text-[10px] font-bold text-slate-500 transition hover:text-slate-300"
                >
                  Skip
                </button>
              </div>
              <h3 className="text-base font-bold leading-snug text-white">
                Welcome Hackathon Evaluator 👋
              </h3>
              <p className="text-xs leading-relaxed text-slate-400">
                This dashboard workspace summarizes active telemetry metrics (scanned documents,
                quality indexes, language segments, and bugs fixed).
              </p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] text-slate-500">
                  Highlighting: Dashboard telemetry
                </span>
                <button
                  onClick={nextStep}
                  className="flex items-center gap-1 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-cyan-600"
                >
                  Explore Editor
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sidebar Panel */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Workspace Frame */}
      <div className="flex min-h-screen flex-col lg:pl-64">
        {/* Top bar header */}
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        {/* Content container */}
        <main className="mx-auto w-full max-w-[1600px] flex-1 p-5 md:p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 items-start gap-6 xl:grid-cols-4"
          >
            {/* Left and Middle Workspace Elements */}
            <div className="space-y-7 xl:col-span-3">
              {/* Main Hero Header Card */}
              <motion.div
                variants={itemVariants}
                className="glass-panel relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-900/60 via-slate-950/40 to-cyan-950/10 p-6 sm:p-8"
              >
                {/* Decorative gradients */}
                <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-[100px]" />
                <div className="pointer-events-none absolute bottom-0 right-1/4 h-60 w-60 rounded-full bg-blue-600/5 blur-[80px]" />

                <div className="relative z-10 max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3.5 py-1 text-xs font-semibold text-cyan-300">
                    <span className="size-1.5 animate-ping rounded-full bg-cyan-400" />
                    Evaluator Session Active
                  </div>
                  <h1 className="mt-5 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
                    Welcome back 👋
                  </h1>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
                    Ready to debug smarter? CodeMedic AI helps you fix code flaws, optimize
                    performance bottlenecks, write tests, and harden application security in
                    real-time.
                  </p>

                  {/* Action buttons */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => alert("Analyze Code action triggered")}
                      className="hover:brightness-115 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/10 transition"
                    >
                      <Play className="size-3.5 fill-white text-white" />
                      <span>Analyze New Code</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => alert("Upload File action triggered")}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/40 px-5 py-3 text-xs font-bold text-slate-300 transition hover:border-slate-700 hover:text-white"
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
            <motion.div variants={itemVariants} className="space-y-6">
              <RightPanel />
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default function EvaluatorDemoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#060814]" />}>
      <EvaluatorDemoPageContent />
    </Suspense>
  );
}
