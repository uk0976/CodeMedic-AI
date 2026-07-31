"use client";

import { motion } from "framer-motion";

interface Language {
  name: string;
  color: string;
  glow: string;
}

export function LanguagesShowcase() {
  const languages: Language[] = [
    { name: "Python", color: "from-blue-500 to-yellow-500", glow: "shadow-blue-500/10" },
    { name: "Java", color: "from-orange-600 to-red-500", glow: "shadow-orange-500/10" },
    { name: "JavaScript", color: "from-yellow-400 to-amber-500", glow: "shadow-yellow-500/10" },
    { name: "TypeScript", color: "from-blue-600 to-cyan-500", glow: "shadow-cyan-500/10" },
    { name: "C", color: "from-blue-700 to-indigo-500", glow: "shadow-blue-700/10" },
    { name: "C++", color: "from-pink-600 to-purple-500", glow: "shadow-pink-500/10" },
    { name: "Go", color: "from-cyan-400 to-teal-500", glow: "shadow-teal-500/10" },
    { name: "Rust", color: "from-amber-700 to-orange-600", glow: "shadow-orange-600/10" },
    { name: "PHP", color: "from-indigo-600 to-purple-700", glow: "shadow-indigo-500/10" },
    { name: "HTML", color: "from-orange-500 to-red-600", glow: "shadow-red-500/10" },
    { name: "CSS", color: "from-blue-500 to-indigo-600", glow: "shadow-blue-500/10" },
    { name: "SQL", color: "from-emerald-500 to-teal-600", glow: "shadow-emerald-500/10" },
  ];

  return (
    <div className="glass-panel rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
      <h2 className="text-sm font-bold text-white uppercase tracking-wider text-slate-500 mb-4">Supported Languages</h2>
      
      <div className="flex flex-wrap gap-2.5">
        {languages.map((lang, index) => (
          <motion.div
            key={lang.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
            whileHover={{ y: -2, scale: 1.03 }}
            className={`flex items-center gap-2 rounded-xl border border-slate-800/80 bg-slate-950/60 px-3.5 py-2 text-xs font-semibold text-slate-300 shadow-md ${lang.glow} transition-colors hover:border-slate-700/80 hover:text-white`}
          >
            <div className={`size-2 rounded-full bg-gradient-to-r ${lang.color}`} />
            <span>{lang.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
