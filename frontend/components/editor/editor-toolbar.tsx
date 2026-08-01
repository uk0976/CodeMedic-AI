"use client";

import { FileCode, Moon, Sun, WrapText, Type, AlignLeft, Upload, Play } from "lucide-react";

interface EditorToolbarProps {
  fileName: string;
  onFileNameChange: (name: string) => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  theme: "vs-dark" | "light";
  onThemeChange: (theme: "vs-dark" | "light") => void;
  wordWrap: boolean;
  onWordWrapToggle: () => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  onFormat: () => void;
  onTriggerUpload: () => void;
  onAnalyze: () => void;
  supportedLanguages: string[];
}

export function EditorToolbar({
  fileName,
  onFileNameChange,
  language,
  onLanguageChange,
  theme,
  onThemeChange,
  wordWrap,
  onWordWrapToggle,
  fontSize,
  onFontSizeChange,
  onFormat,
  onTriggerUpload,
  onAnalyze,
  supportedLanguages,
}: EditorToolbarProps) {
  const fontSizes = [12, 13, 14, 15, 16, 18, 20];

  return (
    <div className="p-4.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
      {/* File Name & Language Selector */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <FileCode className="size-4.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={fileName}
            onChange={(e) => onFileNameChange(e.target.value)}
            className="w-44 rounded-xl border border-slate-800 bg-slate-900/40 py-2 pl-10 pr-3 text-xs font-semibold text-white outline-none focus:border-cyan-500/30"
            placeholder="File name"
          />
        </div>

        {/* Language Select */}
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2 text-xs font-semibold text-slate-300 outline-none focus:border-cyan-500/30"
        >
          {supportedLanguages.map((lang) => (
            <option key={lang} value={lang.toLowerCase()} className="bg-slate-950">
              {lang}
            </option>
          ))}
        </select>
      </div>

      {/* Editor Preferences */}
      <div className="flex items-center gap-2">
        {/* Font Size Selector */}
        <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/40 px-2 py-0.5">
          <Type className="size-3.5 text-slate-400" />
          <select
            value={fontSize}
            onChange={(e) => onFontSizeChange(Number(e.target.value))}
            className="cursor-pointer bg-transparent py-1 text-xs font-semibold text-slate-300 outline-none"
          >
            {fontSizes.map((size) => (
              <option key={size} value={size} className="bg-slate-950">
                {size}px
              </option>
            ))}
          </select>
        </div>

        {/* Word Wrap Toggle */}
        <button
          type="button"
          onClick={onWordWrapToggle}
          title="Toggle Word Wrap"
          className={`rounded-xl border p-2 transition ${
            wordWrap
              ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-400"
              : "border-slate-800 bg-slate-900/40 text-slate-400 hover:text-white"
          }`}
        >
          <WrapText className="size-4" />
        </button>

        {/* Format Code */}
        <button
          type="button"
          onClick={onFormat}
          title="Format Code"
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-2 text-slate-400 transition hover:text-white"
        >
          <AlignLeft className="size-4" />
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={() => onThemeChange(theme === "vs-dark" ? "light" : "vs-dark")}
          title="Toggle Editor Theme"
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-2 text-slate-400 transition hover:text-white"
        >
          {theme === "vs-dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
      </div>

      {/* Upload & Analyze Code Buttons */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onTriggerUpload}
          className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/40 px-3.5 py-2 text-xs font-bold text-slate-300 transition hover:border-slate-700 hover:text-white"
        >
          <Upload className="size-3.5" />
          <span>Upload</span>
        </button>

        <button
          type="button"
          onClick={onAnalyze}
          className="animate-pulse-subtle flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition hover:brightness-110"
        >
          <Play className="size-3.5 fill-white text-white" />
          <span>Analyze Code</span>
        </button>
      </div>
    </div>
  );
}
