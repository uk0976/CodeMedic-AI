import { Check, X } from "lucide-react";
import { Reveal } from "./reveal";
import { SectionHeading } from "./features";

const rows = [
  ["Time to first insight", "Hours or days", "Minutes"],
  ["Security coverage", "Manual and inconsistent", "Built into every analysis"],
  ["Review context", "Depends on reviewer availability", "Consistent senior-level reasoning"],
  ["Documentation", "Often deferred", "Generated alongside findings"],
  ["Report sharing", "Scattered across tools", "One structured downloadable report"],
];

export function Comparison() {
  return (
    <section id="comparison" className="px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="Why CodeMedic AI"
            title="Less detective work. More deliberate engineering."
            description="Traditional debugging is indispensable. CodeMedic makes it faster to find the first thread worth pulling."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-12 overflow-hidden rounded-2xl border border-slate-800">
            <div className="grid grid-cols-3 bg-slate-900/80 text-sm">
              <div className="p-4 font-medium text-slate-400 sm:p-5">Capability</div>
              <div className="border-x border-slate-800 p-4 font-medium text-slate-300 sm:p-5">
                Traditional debugging
              </div>
              <div className="bg-blue-500/10 p-4 font-semibold text-cyan-200 sm:p-5">
                CodeMedic AI
              </div>
            </div>
            {rows.map(([label, traditional, codemedic]) => (
              <div
                key={label}
                className="grid grid-cols-3 border-t border-slate-800 bg-slate-950/30 text-xs sm:text-sm"
              >
                <div className="p-4 font-medium text-slate-300 sm:p-5">{label}</div>
                <div className="flex items-start gap-2 border-x border-slate-800 p-4 text-slate-500 sm:p-5">
                  <X className="mt-0.5 size-4 shrink-0 text-slate-600" />
                  {traditional}
                </div>
                <div className="flex items-start gap-2 bg-blue-500/[0.035] p-4 text-slate-300 sm:p-5">
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                  {codemedic}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
