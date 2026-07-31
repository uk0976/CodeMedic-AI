import { Braces, CodeXml, Database, FileCode2, Terminal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "./reveal";
import { SectionHeading } from "./features";

const languages: [string, LucideIcon, string][] = [
  ["Python", Terminal, "text-emerald-300"],
  ["Java", Braces, "text-orange-300"],
  ["JavaScript", FileCode2, "text-amber-300"],
  ["TypeScript", FileCode2, "text-blue-300"],
  ["C", CodeXml, "text-slate-300"],
  ["C++", CodeXml, "text-pink-300"],
  ["C#", Braces, "text-violet-300"],
  ["Go", Terminal, "text-cyan-300"],
  ["Rust", Braces, "text-orange-300"],
  ["PHP", FileCode2, "text-indigo-300"],
  ["HTML", CodeXml, "text-rose-300"],
  ["CSS", CodeXml, "text-sky-300"],
  ["SQL", Database, "text-lime-300"],
  ["Bash", Terminal, "text-emerald-300"],
];

export function Languages() {
  return (
    <section id="languages" className="px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="Polyglot by design"
            title="Your stack speaks many languages. So do we."
            description="Analyze the languages you reach for every day, from systems code to serverless scripts."
          />
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {languages.map(([name, Icon, color], index) => (
            <Reveal key={name} delay={index * 0.025}>
              <div className="flex h-full flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/45 px-3 py-5 text-center transition hover:border-slate-600 hover:bg-slate-900">
                <Icon className={`size-5 ${color}`} />
                <span className="mt-3 text-sm font-medium text-slate-300">{name}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
