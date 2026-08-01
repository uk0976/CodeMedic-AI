"use client";

import { Sparkles, Clock, Lightbulb, HelpCircle, ArrowRight } from "lucide-react";

export function RightPanel() {
  const suggestions = [
    {
      title: "Optimize db.go query",
      desc: "Vulnerability in SQL query. Replace raw concat string with parameters.",
      severity: "high",
    },
    {
      title: "Error handling in http.ts",
      desc: "Add a try/catch block inside the login promise handler.",
      severity: "medium",
    },
  ];

  const activities = [
    { text: "Analyzed index.py for memory leaks", time: "10 mins ago" },
    { text: "Generated API client tests", time: "2 hrs ago" },
    { text: "Security audit passed for config.py", time: "1 day ago" },
  ];

  const tips = [
    "Paste short snippets into the Paste Code window to perform ultra-fast diagnostics.",
    "Export reports to PDF or JSON configurations to share with your DevOps pipeline.",
  ];

  return (
    <div className="space-y-6">
      {/* AI Suggestions Card */}
      <div className="glass-panel rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="size-4.5 text-cyan-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 text-white">
            AI Suggestions
          </h2>
        </div>
        <div className="space-y-3.5">
          {suggestions.map((s, i) => (
            <div
              key={i}
              className="group rounded-xl border border-slate-800/80 bg-slate-950/40 p-3.5 transition hover:border-slate-700/80"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                    s.severity === "high"
                      ? "border border-red-500/20 bg-red-500/10 text-red-400"
                      : "border border-amber-500/20 bg-amber-500/10 text-amber-400"
                  }`}
                >
                  {s.severity} priority
                </span>
              </div>
              <h3 className="mt-2 text-xs font-semibold text-slate-200 transition-colors group-hover:text-cyan-400">
                {s.title}
              </h3>
              <p className="mt-1 text-[10px] leading-normal text-slate-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Card */}
      <div className="glass-panel rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5">
        <div className="mb-4 flex items-center gap-2">
          <Clock className="size-4.5 text-slate-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 text-white">
            Recent Activity
          </h2>
        </div>
        <div className="space-y-3.5">
          {activities.map((a, i) => (
            <div key={i} className="flex gap-3">
              <div className="relative flex flex-col items-center">
                <div className="mt-1.5 size-2 rounded-full bg-slate-700" />
                {i < activities.length - 1 && <div className="my-1 w-[1px] flex-1 bg-slate-800" />}
              </div>
              <div>
                <p className="text-xs font-medium leading-normal text-slate-300">{a.text}</p>
                <span className="mt-0.5 block text-[10px] text-slate-500">{a.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pro Tips Card */}
      <div className="glass-panel rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5">
        <div className="mb-4 flex items-center gap-2">
          <Lightbulb className="size-4.5 text-amber-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 text-white">
            Workspace Tips
          </h2>
        </div>
        <ul className="list-none space-y-3 pl-0">
          {tips.map((tip, i) => (
            <li
              key={i}
              className="flex gap-2.5 text-[11px] font-medium leading-relaxed text-slate-400"
            >
              <span className="font-bold text-cyan-400">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Quick Documentation Card */}
      <div className="glass-panel rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5">
        <div className="mb-3 flex items-center gap-2">
          <HelpCircle className="size-4.5 text-slate-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 text-white">
            Quick Docs
          </h2>
        </div>
        <p className="text-[11px] font-medium leading-relaxed text-slate-400">
          Need help setting up your repository integrations? Access configuration files and CLI
          guidelines directly.
        </p>
        <a
          href="#docs"
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 transition hover:text-cyan-300"
        >
          <span>Open Reference</span>
          <ArrowRight className="size-3.5" />
        </a>
      </div>
    </div>
  );
}
