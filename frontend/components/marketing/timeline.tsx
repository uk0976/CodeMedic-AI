import {
  ArrowDown,
  ClipboardPaste,
  Download,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "./reveal";
import { SectionHeading } from "./features";

const steps: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: ClipboardPaste, title: "Paste Code", text: "Drop in a file, snippet, or diff." },
  { icon: Sparkles, title: "AI Analysis", text: "Codex maps intent, context, and risks." },
  { icon: SearchCheck, title: "Bug Detection", text: "High-signal issues rise to the top." },
  { icon: Wrench, title: "Fixes", text: "Review actionable, explained recommendations." },
  { icon: ShieldCheck, title: "Optimization", text: "Improve safety, clarity, and performance." },
  {
    icon: Download,
    title: "Download Report",
    text: "Share an audit-ready summary with your team.",
  },
];

export function Timeline() {
  return (
    <section
      id="how-it-works"
      className="border-y border-slate-800/80 bg-slate-950/35 px-5 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="A clear path to healthier code"
            title="From first paste to confident next step."
            description="Bring your code as it is. Leave with a prioritized understanding of what to fix and why."
          />
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.06}>
              <div className="relative h-full rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                <span className="text-xs font-semibold text-slate-600">0{index + 1}</span>
                <div className="mt-5 flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                  <step.icon className="size-5" />
                </div>
                <h3 className="mt-5 font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{step.text}</p>
                {index < steps.length - 1 && (
                  <ArrowDown className="absolute -bottom-5 left-1/2 size-4 -translate-x-1/2 text-slate-600 md:hidden" />
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
