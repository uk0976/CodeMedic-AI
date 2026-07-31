import {
  BookOpenText,
  Bug,
  Gauge,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  TestTube2,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "./reveal";

const features: { icon: LucideIcon; title: string; description: string; tint: string }[] = [
  {
    icon: Bug,
    title: "AI Bug Detection",
    description: "Surface elusive logic errors before they reach production.",
    tint: "text-rose-300 bg-rose-400/10",
  },
  {
    icon: Wrench,
    title: "Code Fixing",
    description: "Get contextual fixes you can understand and trust.",
    tint: "text-blue-300 bg-blue-400/10",
  },
  {
    icon: ShieldCheck,
    title: "Security Scanner",
    description: "Find vulnerable patterns and risky dependencies early.",
    tint: "text-emerald-300 bg-emerald-400/10",
  },
  {
    icon: Gauge,
    title: "Performance Optimizer",
    description: "Turn slow paths into efficient, maintainable code.",
    tint: "text-amber-300 bg-amber-400/10",
  },
  {
    icon: ScanSearch,
    title: "Complexity Analyzer",
    description: "Understand cognitive load and hidden code smells.",
    tint: "text-violet-300 bg-violet-400/10",
  },
  {
    icon: BookOpenText,
    title: "Documentation Generator",
    description: "Produce useful docs that stay close to the code.",
    tint: "text-cyan-300 bg-cyan-400/10",
  },
  {
    icon: TestTube2,
    title: "Test Generator",
    description: "Cover happy paths, edge cases, and regressions faster.",
    tint: "text-pink-300 bg-pink-400/10",
  },
  {
    icon: Sparkles,
    title: "Code Review",
    description: "Receive senior-level review notes in one clear report.",
    tint: "text-indigo-300 bg-indigo-400/10",
  },
];

export function Features() {
  return (
    <section id="features" className="px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="A complete code health check"
            title="Everything your code needs to recover faster."
            description="One focused workspace for the high-signal feedback usually scattered across tools, tabs, and pull requests."
          />
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.04}>
              <article className="group h-full rounded-2xl border border-slate-800 bg-slate-900/40 p-5 transition duration-300 hover:-translate-y-1 hover:border-slate-600 hover:bg-slate-900/80">
                <div
                  className={`flex size-10 items-center justify-center rounded-xl ${feature.tint}`}
                >
                  <feature.icon className="size-5" />
                </div>
                <h3 className="mt-5 font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{feature.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: Readonly<{ eyebrow: string; title: string; description: string }>) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold text-cyan-300">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
      <p className="mt-4 text-lg leading-8 text-slate-400">{description}</p>
    </div>
  );
}
