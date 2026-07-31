"use client";

import Link from "next/link";
import { Github, Menu, Stethoscope, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const links = [
  ["Features", "#features"],
  ["How It Works", "#how-it-works"],
  ["Languages", "#languages"],
  ["Pricing", "#comparison"],
  ["FAQ", "#faq"],
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <nav
        className="glass-panel mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 sm:px-5"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight text-white"
          aria-label="CodeMedic AI home"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/30">
            <Stethoscope className="size-4" />
          </span>
          CodeMedic <span className="text-cyan-300">AI</span>
        </Link>
        <div className="hidden items-center gap-6 lg:flex">
          {links.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="text-sm text-slate-400 transition hover:text-white"
            >
              {label}
            </a>
          ))}
          <a
            href="https://github.com/uk0976/CodeMedic-AI"
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 transition hover:text-white"
            aria-label="CodeMedic AI on GitHub"
          >
            <Github className="size-4" />
          </a>
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <Link
            href="/demo?tour=true"
            className="rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-3.5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:brightness-110"
          >
            Try Live Demo <span aria-hidden="true">✦</span>
          </Link>
          <button type="button" className="text-sm text-slate-300 transition hover:text-white">
            Login
          </button>
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 sm:hidden"
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass-panel mx-auto mt-2 max-w-6xl rounded-2xl p-4 sm:hidden"
          >
            <div className="flex flex-col gap-1">
              {links.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
                >
                  {label}
                </a>
              ))}
            </div>
            <Link
              href="/demo?tour=true"
              className="mt-3 block rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white"
            >
              Try Live Demo ✦
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
