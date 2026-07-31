"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Code2, 
  BarChart3, 
  Settings as SettingsIcon, 
  Github, 
  FileText,
  X,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const mainNavItems = [
    { label: "Dashboard", href: "/demo", icon: LayoutDashboard },
    { label: "Analyze Code", href: "/analyze", icon: Code2 },
    { label: "Reports", href: "#reports", icon: BarChart3 },
    { label: "Settings", href: "#settings", icon: SettingsIcon },
  ];

  const secondaryNavItems = [
    { label: "GitHub", href: "https://github.com/uk0976/CodeMedic-AI", icon: Github, external: true },
    { label: "Documentation", href: "#docs", icon: FileText },
  ];

  const sidebarVariants = {
    open: { x: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
    closed: { x: "-100%", opacity: 0, transition: { type: "spring" as const, stiffness: 300, damping: 30 } }
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col justify-between p-6">
      <div>
        {/* Logo Section */}
        <div className="mb-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 shadow-md shadow-cyan-500/20">
              <Sparkles className="size-4.5 text-white" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white">CodeMedic</span>
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-[10px] font-medium text-transparent block -mt-1">
                AI CO-PILOT
              </span>
            </div>
          </Link>
          <button 
            type="button" 
            onClick={onClose} 
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Main Navigation */}
        <div className="space-y-1.5">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Workspace</p>
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition duration-200 ${
                  isActive 
                    ? "text-cyan-400" 
                    : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-100"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-indicator"
                    className="absolute inset-0 rounded-xl border border-cyan-500/20 bg-cyan-500/5"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`size-4.5 z-10 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                <span className="z-10">{item.label}</span>
                {item.label === "Analyze Code" && (
                  <span className="ml-auto z-10 rounded-full bg-cyan-500/10 border border-cyan-400/20 px-1.5 py-0.5 text-[9px] font-semibold text-cyan-300">
                    Live
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Secondary / Footer Navigation */}
      <div className="space-y-6">
        <div className="space-y-1.5">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Resources</p>
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition duration-200 hover:bg-slate-900/60 hover:text-slate-100"
              >
                <Icon className="size-4.5 text-slate-400" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>

        {/* Demo Mode Badge */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-300">Live Demo Session</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 leading-normal">
            No login credentials required. All workspace capabilities are pre-authorized.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed Left) */}
      <aside className="fixed bottom-0 left-0 top-0 z-30 hidden w-64 border-r border-slate-800/80 bg-slate-950/80 backdrop-blur-xl lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Mobile Sidebar (Drawer) */}
      <motion.aside
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className="fixed bottom-0 left-0 top-0 z-50 w-72 border-r border-slate-800/80 bg-slate-950/90 backdrop-blur-2xl lg:hidden"
      >
        <SidebarContent />
      </motion.aside>
    </>
  );
}
