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
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings?: () => void;
  onOpenDocs?: () => void;
}

export function Sidebar({ isOpen, onClose, onOpenSettings, onOpenDocs }: SidebarProps) {
  const pathname = usePathname();

  const mainNavItems = [
    { label: "Dashboard", href: "/demo", icon: LayoutDashboard },
    { label: "Analyze Code", href: "/analyze", icon: Code2 },
    { label: "Reports", href: "/reports", icon: BarChart3 },
    { label: "Settings", href: "#settings", icon: SettingsIcon, isModal: true },
  ];

  const secondaryNavItems = [
    {
      label: "GitHub",
      href: "https://github.com/uk0976/CodeMedic-AI",
      icon: Github,
      external: true,
    },
    { label: "Documentation", href: "#docs", icon: FileText, isModal: true },
  ];

  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 300, damping: 30 },
    },
    closed: {
      x: "-100%",
      opacity: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 30 },
    },
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
              <span className="-mt-1 block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-[10px] font-medium text-transparent">
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
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Workspace
          </p>
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            if (item.isModal) {
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    if (onOpenSettings) onOpenSettings();
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition duration-200 hover:bg-slate-900/60 hover:text-slate-100"
                >
                  <Icon className="size-4.5 text-slate-400" />
                  <span>{item.label}</span>
                </button>
              );
            }

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
                <Icon
                  className={`size-4.5 z-10 ${isActive ? "text-cyan-400" : "text-slate-400"}`}
                />
                <span className="z-10">{item.label}</span>
                {item.label === "Analyze Code" && (
                  <span className="z-10 ml-auto rounded-full border border-cyan-400/20 bg-cyan-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-cyan-300">
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
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Resources
          </p>
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;

            if (item.isModal) {
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    if (onOpenDocs) onOpenDocs();
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition duration-200 hover:bg-slate-900/60 hover:text-slate-100"
                >
                  <Icon className="size-4.5 text-slate-400" />
                  <span>{item.label}</span>
                </button>
              );
            }

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

        {/* User Card */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-3">
          <div className="relative size-9 overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950 text-xs font-semibold text-white">
              UK
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-200">Umer Khan</span>
            <span className="text-[10px] text-slate-500">Evaluator / Solo Dev</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="fixed bottom-0 left-0 top-0 hidden w-64 border-r border-slate-800/80 bg-slate-950/80 backdrop-blur-xl lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              className="fixed bottom-0 left-0 top-0 z-50 w-72 border-r border-slate-800/80 bg-slate-950 shadow-2xl lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
