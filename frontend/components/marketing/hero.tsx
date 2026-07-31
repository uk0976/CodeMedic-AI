"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Play, Sparkles } from "lucide-react";

const checks = ["Bugs found in seconds", "Security-first analysis", "Actionable fixes"];

export function Hero() {
  return (
    <section className="surface-grid relative isolate px-5 pb-24 pt-40 sm:pt-48">
      <div className="absolute inset-x-1/4 top-20 -z-10 h-80 rounded-full bg-blue-600/20 blur-[130px]" />
      <div className="absolute right-0 top-56 -z-10 h-64 w-64 rounded-full bg-violet-600/15 blur-[110px]" />
      <div className="mx-auto max-w-6xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-sm text-cyan-100"
        >
          <Sparkles className="size-3.5 text-cyan-300" /> Built for developers who ship
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="mx-auto mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl"
        >
          Your AI{" "}
          <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
            Senior Software Engineer
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400 sm:text-xl"
        >
          Analyze, debug, explain, optimize, secure, and improve your code using OpenAI Codex.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"
        >
          <a
            href="#demo"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-slate-950 shadow-xl shadow-white/10 transition hover:-translate-y-0.5 hover:bg-cyan-50"
          >
            Analyze Code <ArrowRight className="size-4" />
          </a>
          <Link
            href="/demo?tour=true"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-slate-500 hover:bg-slate-800"
          >
            <Play className="size-4 text-cyan-300" /> Try Live Demo
          </Link>
        </motion.div>
        <div className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-slate-400">
          {checks.map((check) => (
            <span key={check} className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-400" />
              {check}
            </span>
          ))}
        </div>
      </div>
      <HeroEditor />
    </section>
  );
}

function HeroEditor() {
  const actions = [
    "Bug detection",
    "Security analysis",
    "Code review",
    "Optimization",
    "Documentation",
    "Test generation",
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.32 }}
      className="glass-panel mx-auto mt-16 max-w-5xl overflow-hidden rounded-2xl text-left shadow-2xl shadow-blue-950/40"
    >
      <div className="flex items-center justify-between border-b border-slate-700/60 bg-slate-950/30 px-4 py-3">
        <div className="flex gap-1.5">
          <i className="size-2.5 rounded-full bg-rose-400" />
          <i className="size-2.5 rounded-full bg-amber-300" />
          <i className="size-2.5 rounded-full bg-emerald-400" />
        </div>
        <span className="font-mono text-xs text-slate-500">payment_processor.py</span>
        <span className="text-xs text-emerald-400">● Analysis complete</span>
      </div>
      <div className="grid lg:grid-cols-[1.3fr_0.7fr]">
        <pre className="overflow-x-auto border-b border-slate-700/60 bg-[#090f1c] p-5 text-xs leading-6 text-slate-300 sm:p-7 sm:text-sm lg:border-b-0 lg:border-r">
          <code>
            <span className="text-violet-300">def</span>{" "}
            <span className="text-blue-300">process_payment</span>(user, amount):{`\n`} query ={" "}
            <span className="text-amber-300">f</span>
            <span className="text-emerald-300">
              &quot;SELECT * FROM users WHERE id = {"{"}user{"}"}&quot;
            </span>
            {`\n`} <span className="text-slate-500"># TODO: add validation</span>
            {`\n`} <span className="text-violet-300">if</span> amount &gt;{" "}
            <span className="text-cyan-300">0</span>:{`\n`} db.execute(query){`\n`}{" "}
            <span className="text-violet-300">return</span>{" "}
            <span className="text-cyan-300">True</span>
          </code>
        </pre>
        <div className="space-y-3 p-5">
          {actions.map((action, index) => (
            <motion.div
              key={action}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65 + index * 0.07 }}
              className="flex items-center justify-between rounded-lg border border-slate-700/70 bg-slate-900/70 px-3 py-2.5"
            >
              <span className="text-sm text-slate-300">{action}</span>
              <span
                className={`size-2 rounded-full ${index < 2 ? "bg-rose-400" : index === 2 ? "bg-amber-400" : "bg-emerald-400"}`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
