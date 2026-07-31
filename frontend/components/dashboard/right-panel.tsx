"use client";

import { 
  Sparkles, 
  Clock, 
  Lightbulb, 
  HelpCircle,
  ArrowRight
} from "lucide-react";

export function RightPanel() {
  const suggestions = [
    {
      title: "Optimize db.go query",
      desc: "Vulnerability in SQL query. Replace raw concat string with parameters.",
      severity: "high"
    },
    {
      title: "Error handling in http.ts",
      desc: "Add a try/catch block inside the login promise handler.",
      severity: "medium"
    }
  ];

  const activities = [
    { text: "Analyzed index.py for memory leaks", time: "10 mins ago" },
    { text: "Generated API client tests", time: "2 hrs ago" },
    { text: "Security audit passed for config.py", time: "1 day ago" }
  ];

  const tips = [
    "Paste short snippets into the Paste Code window to perform ultra-fast diagnostics.",
    "Export reports to PDF or JSON configurations to share with your DevOps pipeline."
  ];

  return (
    <div className="space-y-6">
      {/* AI Suggestions Card */}
      <div className="glass-panel rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="size-4.5 text-cyan-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider text-slate-500">AI Suggestions</h2>
        </div>
        <div className="space-y-3.5">
          {suggestions.map((s, i) => (
            <div key={i} className="group rounded-xl border border-slate-800/80 bg-slate-950/40 p-3.5 transition hover:border-slate-700/80">
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                  s.severity === "high" 
                    ? "bg-red-500/10 border border-red-500/20 text-red-400" 
                    : "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                }`}>
                  {s.severity} priority
                </span>
              </div>
              <h3 className="mt-2 text-xs font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
                {s.title}
              </h3>
              <p className="mt-1 text-[10px] text-slate-500 leading-normal">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Card */}
      <div className="glass-panel rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5">
        <div className="mb-4 flex items-center gap-2">
          <Clock className="size-4.5 text-slate-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider text-slate-500">Recent Activity</h2>
        </div>
        <div className="space-y-3.5">
          {activities.map((a, i) => (
            <div key={i} className="flex gap-3">
              <div className="relative flex flex-col items-center">
                <div className="size-2 rounded-full bg-slate-700 mt-1.5" />
                {i < activities.length - 1 && <div className="w-[1px] flex-1 bg-slate-800 my-1" />}
              </div>
              <div>
                <p className="text-xs text-slate-300 font-medium leading-normal">{a.text}</p>
                <span className="text-[10px] text-slate-500 mt-0.5 block">{a.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pro Tips Card */}
      <div className="glass-panel rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5">
        <div className="mb-4 flex items-center gap-2">
          <Lightbulb className="size-4.5 text-amber-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider text-slate-500">Workspace Tips</h2>
        </div>
        <ul className="space-y-3 list-none pl-0">
          {tips.map((tip, i) => (
            <li key={i} className="flex gap-2.5 text-[11px] leading-relaxed text-slate-400 font-medium">
              <span className="text-cyan-400 font-bold">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Quick Documentation Card */}
      <div className="glass-panel rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5">
        <div className="mb-3 flex items-center gap-2">
          <HelpCircle className="size-4.5 text-slate-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider text-slate-500">Quick Docs</h2>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
          Need help setting up your repository integrations? Access configuration files and CLI guidelines directly.
        </p>
        <a 
          href="#docs" 
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition"
        >
          <span>Open Reference</span>
          <ArrowRight className="size-3.5" />
        </a>
      </div>
    </div>
  );
}
