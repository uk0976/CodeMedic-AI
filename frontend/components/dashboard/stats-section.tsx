"use client";

import { useEffect, useState } from "react";
import { Code2, Bug, ShieldAlert, FileText, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

interface StatItem {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  change: string;
  changeType: "increase" | "decrease";
}

function CountUp({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const duration = 1200; // Total animation duration in ms
    const stepTime = 16; // ~60fps
    const totalSteps = duration / stepTime;
    const stepIncrement = end / totalSteps;

    const timer = setInterval(() => {
      start += stepIncrement;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return <>{count.toLocaleString()}</>;
}

export function StatsSection() {
  const stats: StatItem[] = [
    {
      label: "Total Analyses",
      value: 1248,
      icon: Code2,
      color: "from-blue-500/20 to-cyan-500/20 text-cyan-400 border-cyan-500/10",
      change: "+12.4% vs last week",
      changeType: "increase",
    },
    {
      label: "Bugs Fixed",
      value: 342,
      icon: Bug,
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/10",
      change: "+28.1% vs last week",
      changeType: "increase",
    },
    {
      label: "Security Issues Found",
      value: 87,
      icon: ShieldAlert,
      color: "from-red-500/20 to-orange-500/20 text-red-400 border-red-500/10",
      change: "-8.4% vs last week",
      changeType: "decrease",
    },
    {
      label: "Reports Generated",
      value: 412,
      icon: FileText,
      color: "from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/10",
      change: "+5.7% vs last week",
      changeType: "increase",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 260, damping: 20 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`glass-panel relative overflow-hidden rounded-2xl border bg-slate-900/40 p-5`}
          >
            {/* Soft decorative background glow */}
            <div
              className={`absolute -right-6 -top-6 size-24 rounded-full bg-gradient-to-br ${stat.color} opacity-[0.06] blur-2xl`}
            />

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">{stat.label}</span>
              <div
                className={`size-8.5 flex items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} border`}
              >
                <Icon className="size-4.5" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-white">
                <CountUp value={stat.value} />
              </span>
              <span className="text-[10px] font-semibold text-slate-500">units</span>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-slate-800/60 pt-3">
              <span
                className={`text-[10px] font-medium ${
                  stat.changeType === "increase" ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {stat.change}
              </span>
              <ArrowUpRight
                className={`size-3.5 ${
                  stat.changeType === "increase" ? "text-emerald-500/50" : "text-amber-500/50"
                } ${stat.changeType === "decrease" ? "rotate-90" : ""}`}
              />
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
