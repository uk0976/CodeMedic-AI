import Link from "next/link";
import { Stethoscope } from "lucide-react";
import type { ReactNode } from "react";

export function AuthShell({
  title,
  description,
  children,
}: Readonly<{ title: string; description: string; children: ReactNode }>) {
  return (
    <main className="surface-grid min-h-screen bg-[#0b1120] px-5 py-12 text-slate-100">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md flex-col justify-center">
        <Link
          href="/"
          className="mb-10 flex items-center gap-2 self-center font-semibold text-white"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400">
            <Stethoscope className="size-4" />
          </span>
          CodeMedic <span className="text-cyan-300">AI</span>
        </Link>
        <section className="glass-panel rounded-3xl p-6 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-white">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
          {children}
        </section>
      </div>
    </main>
  );
}

export function FieldError({ message }: Readonly<{ message?: string }>) {
  return message ? <p className="mt-1.5 text-xs text-rose-300">{message}</p> : null;
}

export const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/15";
