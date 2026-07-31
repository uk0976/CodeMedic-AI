import Link from "next/link";
import { Github, Stethoscope } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 px-5 pb-8 pt-14">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2 font-semibold text-white">
              <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400">
                <Stethoscope className="size-4" />
              </span>
              CodeMedic <span className="text-cyan-300">AI</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">
              Fix. Explain. Optimize. Powered by Codex.
            </p>
          </div>
          <FooterGroup
            title="Product"
            links={["Features", "How It Works", "Languages", "Live Demo"]}
          />
          <FooterGroup title="Resources" links={["Documentation", "GitHub", "Contact"]} />
          <FooterGroup title="Legal" links={["Privacy", "Terms", "Security"]} />
        </div>
        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-slate-800 pt-6 text-xs text-slate-600 sm:flex-row">
          <p>© 2026 CodeMedic AI. Built for the OpenAI Codex Hackathon.</p>
          <a
            href="https://github.com/uk0976/CodeMedic-AI"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 transition hover:text-slate-300"
          >
            <Github className="size-4" /> Open source foundation
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({ title, links }: Readonly<{ title: string; links: string[] }>) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-slate-200">{title}</h2>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link}>
            <a
              href={link === "Live Demo" ? "/demo" : "#"}
              className="text-sm text-slate-500 transition hover:text-slate-200"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
