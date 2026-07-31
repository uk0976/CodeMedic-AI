"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Reveal } from "./reveal";
import { SectionHeading } from "./features";

const questions = [
  [
    "What can CodeMedic analyze?",
    "CodeMedic is designed to review source code for bugs, security issues, performance opportunities, complexity, documentation gaps, and missing tests.",
  ],
  [
    "Does the live demo require an account?",
    "No. The evaluator route is intentionally open for hackathon judges, so they can inspect the dedicated workspace without creating an account.",
  ],
  [
    "Which languages are supported?",
    "The foundation is designed around common development languages including Python, Java, JavaScript, TypeScript, C-family languages, Go, Rust, PHP, HTML, CSS, SQL, and Bash.",
  ],
  [
    "Will CodeMedic replace code review?",
    "No. It is designed to accelerate code review with an additional senior-level perspective and clearly explained findings.",
  ],
  [
    "How are reports shared?",
    "The product architecture includes a report boundary so future analysis workflows can produce structured, downloadable reports for teams and stakeholders.",
  ],
];

export function Faq() {
  const [active, setActive] = useState<number | null>(0);
  return (
    <section id="faq" className="px-5 py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <SectionHeading
            eyebrow="FAQ"
            title="Questions, answered plainly."
            description="The essentials for developers and hackathon evaluators exploring CodeMedic AI."
          />
        </Reveal>
        <div className="space-y-3">
          {questions.map(([question, answer], index) => {
            const expanded = active === index;
            return (
              <Reveal key={question} delay={index * 0.04}>
                <div className="rounded-xl border border-slate-800 bg-slate-900/45">
                  <button
                    type="button"
                    onClick={() => setActive(expanded ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-white"
                    aria-expanded={expanded}
                  >
                    <span>{question}</span>
                    <ChevronDown
                      className={`size-4 shrink-0 text-slate-400 transition ${expanded ? "rotate-180" : ""}`}
                    />
                  </button>
                  {expanded && (
                    <div className="px-5 pb-5 text-sm leading-6 text-slate-400">{answer}</div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
