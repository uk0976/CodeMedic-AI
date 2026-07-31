import { Check, CircleAlert, Code2, Gauge, ShieldAlert, Sparkles } from "lucide-react";
import { Reveal } from "./reveal";
import { SectionHeading } from "./features";

const findings = [
  [
    CircleAlert,
    "Critical",
    "SQL injection risk",
    "String interpolation exposes user input to the query.",
  ],
  [
    ShieldAlert,
    "High",
    "Missing input validation",
    "Amounts must be type-checked and constrained.",
  ],
  [Gauge, "Medium", "No transaction boundary", "Wrap payment updates in an atomic transaction."],
] as const;

export function InteractiveDemo() {
  return (
    <section id="demo" className="relative px-5 py-24 sm:py-32">
      <div className="absolute left-1/2 top-1/2 -z-10 h-96 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[130px]" />
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="See the signal, not the noise"
            title="A code review that explains the why."
            description="CodeMedic prioritizes the issue, links the reasoning, and turns each observation into a clear next move."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="glass-panel mt-12 overflow-hidden rounded-3xl">
            <div className="flex items-center justify-between border-b border-slate-700/60 px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-blue-500/15 text-blue-300">
                  <Code2 className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-white">payment_processor.py</p>
                  <p className="text-xs text-slate-500">Python • 18 lines</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-300">
                <Sparkles className="size-3" /> 96% confidence
              </span>
            </div>
            <div className="grid lg:grid-cols-2">
              <div className="border-b border-slate-700/60 bg-[#090f1c] p-5 sm:p-7 lg:border-b-0 lg:border-r">
                <div className="mb-5 flex items-center gap-2 text-xs text-slate-500">
                  <span className="rounded bg-slate-800 px-2 py-1">EXPLORER</span>
                  <span>payment_processor.py</span>
                </div>
                <pre className="overflow-x-auto text-xs leading-7 text-slate-300 sm:text-sm">
                  <code>
                    <span className="text-violet-300">def</span>{" "}
                    <span className="text-blue-300">charge_customer</span>(customer_id, amount):
                    {`\n`} connection = get_connection(){`\n`}
                    {`\n`}{" "}
                    <span className="rounded bg-rose-500/20 px-1 text-rose-200">
                      query = f&quot;SELECT * FROM customers
                    </span>
                    {`\n`}{" "}
                    <span className="rounded bg-rose-500/20 px-1 text-rose-200">
                      WHERE id = {"{"}customer_id{"}"}&quot;
                    </span>
                    {`\n`}
                    {`\n`} connection.execute(query){`\n`} record_payment(customer_id, amount){`\n`}{" "}
                    <span className="text-violet-300">return</span> {"{"}
                    <span className="text-emerald-300">&quot;status&quot;</span>:{" "}
                    <span className="text-emerald-300">&quot;charged&quot;</span>
                    {"}"}
                  </code>
                </pre>
              </div>
              <div className="bg-slate-900/40 p-5 sm:p-7">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">AI Analysis</p>
                    <p className="mt-1 text-xs text-slate-500">3 findings • 2 suggestions</p>
                  </div>
                  <span className="rounded-md bg-violet-400/10 px-2 py-1 text-xs font-medium text-violet-300">
                    Senior review
                  </span>
                </div>
                <div className="space-y-3">
                  {findings.map(([Icon, level, title, text]) => (
                    <div
                      key={title}
                      className="rounded-xl border border-slate-700/70 bg-slate-950/40 p-3.5"
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="mt-0.5 size-4 shrink-0 text-rose-400" />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-slate-100">{title}</p>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300">
                              {level}
                            </span>
                          </div>
                          <p className="mt-1 text-xs leading-5 text-slate-400">{text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
                >
                  <Check className="size-4" /> View safe query rewrite
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
