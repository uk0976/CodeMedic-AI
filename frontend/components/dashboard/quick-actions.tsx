"use client";

import { Play, Upload, Clipboard, Binary, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface QuickAction {
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  onClick: () => void;
}

export function QuickActions() {
  const actions: QuickAction[] = [
    {
      label: "Analyze Code",
      description: "Run diagnostic review on source file",
      icon: Play,
      color: "from-blue-600 to-cyan-500 text-white shadow-blue-500/10",
      onClick: () => alert("Analyze Code triggered (In next phase)"),
    },
    {
      label: "Upload File",
      description: "Upload local source files for analysis",
      icon: Upload,
      color:
        "from-slate-900 to-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white",
      onClick: () => alert("Upload File triggered (In next phase)"),
    },
    {
      label: "Paste Code",
      description: "Quickly copy-paste code snippets",
      icon: Clipboard,
      color:
        "from-slate-900 to-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white",
      onClick: () => alert("Paste Code triggered (In next phase)"),
    },
    {
      label: "Generate Tests",
      description: "Auto-generate unit tests using AI",
      icon: Binary,
      color:
        "from-slate-900 to-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white",
      onClick: () => alert("Generate Tests triggered (In next phase)"),
    },
    {
      label: "Security Scan",
      description: "Check code for vulnerabilities & secrets",
      icon: ShieldCheck,
      color:
        "from-slate-900 to-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white",
      onClick: () => alert("Security Scan triggered (In next phase)"),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 300, damping: 22 },
    },
  };

  return (
    <div>
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500 text-white">
        Quick Actions
      </h2>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        {actions.map((action) => {
          const Icon = action.icon;
          const isPrimary = action.label === "Analyze Code";
          return (
            <motion.button
              key={action.label}
              type="button"
              variants={itemVariants}
              whileHover={{ y: -3, scale: 1.01 }}
              onClick={action.onClick}
              className={`flex flex-col rounded-2xl border p-5 text-left transition-all ${
                isPrimary
                  ? `bg-gradient-to-r ${action.color} border-transparent`
                  : "border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/60"
              }`}
            >
              <div
                className={`mb-4 flex size-9 items-center justify-center rounded-xl ${
                  isPrimary
                    ? "bg-white/20"
                    : "border border-slate-700/30 bg-slate-800/50 text-cyan-400"
                }`}
              >
                <Icon className="size-4.5" />
              </div>
              <h3
                className={`text-xs font-bold leading-none ${isPrimary ? "text-white" : "text-slate-200"}`}
              >
                {action.label}
              </h3>
              <p
                className={`mt-2 text-[10px] leading-normal ${isPrimary ? "text-cyan-100" : "text-slate-500"}`}
              >
                {action.description}
              </p>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
