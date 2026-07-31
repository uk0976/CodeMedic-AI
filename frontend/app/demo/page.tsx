import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

export const metadata = { title: "Evaluator Workspace" };

export default function EvaluatorDemoPage() {
  return (
    <main className="surface-grid min-h-screen bg-[#0b1120] px-5 py-7 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <ArrowLeft className="size-4" /> Back to CodeMedic AI
          </Link>
          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
            Hackathon evaluator access
          </span>
        </div>
        <section className="glass-panel rounded-3xl p-8 sm:p-12">
          <div className="mb-7 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-cyan-500/20">
            <Sparkles className="size-6" />
          </div>
          <p className="text-sm font-medium text-cyan-300">Evaluator workspace</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            You&apos;re in. No login required.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-400">
            This dedicated workspace is reserved for hackathon reviewers. Product analysis workflows
            will be enabled here in the next delivery phase.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              "No authentication gate",
              "Isolated evaluator entry",
              "Production-ready platform shell",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-5 text-sm text-slate-300"
              >
                <CheckCircle2 className="mb-3 size-5 text-emerald-400" />
                {item}
              </div>
            ))}
          </div>
          <div className="mt-10 flex items-center gap-2 text-sm text-slate-500">
            <ShieldCheck className="size-4 text-emerald-400" /> Evaluator route is publicly
            accessible by design.
          </div>
        </section>
      </div>
    </main>
  );
}
