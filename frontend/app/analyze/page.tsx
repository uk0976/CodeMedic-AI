"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Editor from "@monaco-editor/react";
import { EditorSidebar } from "@/components/editor/editor-sidebar";
import { EditorToolbar } from "@/components/editor/editor-toolbar";
import { EditorStatusBar } from "@/components/editor/editor-status-bar";
import { EditorRightPanel, AnalysisResult } from "@/components/editor/editor-right-panel";
import { FullAnalysisReport } from "@/components/editor/full-analysis-report";
import { QuickModeCards, AnalysisMode } from "@/components/editor/quick-mode-cards";
import { UploadZone } from "@/components/editor/upload-zone";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Code2 } from "lucide-react";
import { env } from "@/lib/env";
import {
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Keyboard,
  Info,
} from "lucide-react";

interface MonacoEditorPosition {
  lineNumber: number;
  column: number;
}

interface MonacoEditorCursorEvent {
  position: MonacoEditorPosition;
}

interface MonacoEditorModel {
  getLineCount: () => number;
}

interface MonacoEditorAction {
  run: () => Promise<void>;
}

interface MonacoEditorInstance {
  getValue: () => string;
  onDidChangeCursorPosition: (cb: (e: MonacoEditorCursorEvent) => void) => void;
  onDidChangeModelContent: (cb: () => void) => void;
  getModel: () => MonacoEditorModel | null;
  getAction: (id: string) => MonacoEditorAction | null;
}

function EditorWorkspacePageContent() {
  // File and Code States
  const [code, setCode] = useState<string>("");
  const [fileName, setFileName] = useState<string>("untitled.py");
  const [language, setLanguage] = useState<string>("python");
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"editor" | "report">("editor");

  // Editor Preferences
  const [editorTheme, setEditorTheme] = useState<"vs-dark" | "light">("vs-dark");
  const [wordWrap, setWordWrap] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<number>(14);

  // Telemetry Metrics
  const [cursorLine, setCursorLine] = useState<number>(1);
  const [cursorCol, setCursorCol] = useState<number>(1);
  const [totalLines, setTotalLines] = useState<number>(1);
  const [totalChars, setTotalChars] = useState<number>(0);
  const [editorStatus, setEditorStatus] = useState<
    "Ready" | "Modified" | "Saved" | "Formatting" | "Analyzing"
  >("Ready");
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [savedReportId, setSavedReportId] = useState<string | undefined>(undefined);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Responsive Layout Panels States
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [rightPanelOpen, setRightPanelOpen] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showShortcuts, setShowShortcuts] = useState<boolean>(false);

  // Auto-collapse panels on smaller screens (< 1024px) for mobile UX
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setSidebarOpen(false);
      setRightPanelOpen(false);
    }
  }, []);

  // Selected Analysis Mode
  const [analysisType, setAnalysisType] = useState<AnalysisMode>("Bug Detection");

  const editorRef = useRef<MonacoEditorInstance | null>(null);

  const supportedLanguages = [
    "Python",
    "Java",
    "JavaScript",
    "TypeScript",
    "C",
    "C++",
    "Go",
    "Rust",
    "PHP",
    "HTML",
    "CSS",
    "SQL",
    "Bash",
    "JSON",
    "Markdown",
  ];

  useEffect(() => {
    if (editorStatus === "Modified") {
      const timer = setTimeout(() => {
        setEditorStatus("Saved");
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [code, editorStatus]);

  const handleEditorMount = (editor: MonacoEditorInstance) => {
    editorRef.current = editor;

    editor.onDidChangeCursorPosition((e: MonacoEditorCursorEvent) => {
      setCursorLine(e.position.lineNumber);
      setCursorCol(e.position.column);
    });

    editor.onDidChangeModelContent(() => {
      const val = editor.getValue();
      setCode(val);
      setTotalLines(editor.getModel()?.getLineCount() || 1);
      setTotalChars(val.length);
      setEditorStatus("Modified");
    });

    const initialVal = editor.getValue();
    setTotalLines(editor.getModel()?.getLineCount() || 1);
    setTotalChars(initialVal.length);
  };

  const handleFileLoaded = (name: string, content: string, lang: string) => {
    setFileName(name);
    setLanguage(lang);
    setCode(content);
    setShowEditor(true);
    setViewMode("editor");
    setEditorStatus("Saved");
    setTotalChars(content.length);
    setAnalysisResults(null);
    setSavedReportId(undefined);
    setAnalysisError(null);
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleLoadTemplate = (name: string, content: string, lang: string) => {
    setFileName(name.toLowerCase().replace(/[^a-z0-9]/g, "_") + getExtension(lang));
    setLanguage(lang);
    setCode(content);
    setShowEditor(true);
    setViewMode("editor");
    setEditorStatus("Saved");
    setTotalChars(content.length);
    setAnalysisResults(null);
    setSavedReportId(undefined);
    setAnalysisError(null);
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const getExtension = (lang: string) => {
    const extMap: Record<string, string> = {
      python: ".py",
      java: ".java",
      javascript: ".js",
      typescript: ".ts",
      cpp: ".cpp",
      c: ".c",
      go: ".go",
      rust: ".rs",
      php: ".php",
      html: ".html",
      css: ".css",
      sql: ".sql",
      json: ".json",
      markdown: ".md",
      bash: ".sh",
    };
    return extMap[lang] || ".txt";
  };

  const handleNewAnalysis = () => {
    setCode("");
    setFileName("untitled.py");
    setLanguage("python");
    setShowEditor(false);
    setViewMode("editor");
    setEditorStatus("Ready");
    setTotalChars(0);
    setTotalLines(1);
    setAnalysisResults(null);
    setSavedReportId(undefined);
    setAnalysisError(null);
  };

  const handleFormat = () => {
    if (editorRef.current) {
      setEditorStatus("Formatting");
      editorRef.current
        .getAction("editor.action.formatDocument")
        ?.run()
        .then(() => {
          setEditorStatus("Saved");
        });
    }
  };

  const handleAnalyze = async () => {
    if (code.trim().length === 0) {
      alert("Please paste or upload some code first to run the diagnostics.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setLoadingMessage("Analyzing...");
    setEditorStatus("Analyzing");
    setAnalysisResults(null);

    try {
      const response = await fetch(`${env.apiUrl}/api/v1/analysis/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code,
          language: language,
          analysis_types: [analysisType],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to connect to the analysis engine. Ensure backend is running.");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Failed to open response stream from backend.");
      }

      let done = false;
      let accumulatedResult: AnalysisResult | null = null;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.replace("data: ", ""));
                if (data.status) {
                  setLoadingMessage(data.status);
                }
                if (data.result) {
                  accumulatedResult = data.result;
                }
                if (data.error) {
                  throw new Error(data.error);
                }
              } catch {
                // Ignore chunk parse errors
              }
            }
          }
        }
      }

      if (accumulatedResult) {
        setAnalysisResults(accumulatedResult);
        setViewMode("report");
        setEditorStatus("Saved");

        // Save report to backend
        try {
          const saveRes = await fetch(`${env.apiUrl}/api/v1/reports/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: `${fileName} - ${analysisType}`,
              language: language,
              code_content: code,
              analysis_results: accumulatedResult,
            }),
          });
          if (saveRes.ok) {
            const savedData = await saveRes.json();
            setSavedReportId(savedData.id);
          }
        } catch {
          // Ignore save report errors
        }
      } else {
        throw new Error("Did not receive final analysis results from backend.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setAnalysisError(msg || "An error occurred during code analysis.");
      setEditorStatus("Ready");
    } finally {
      setIsAnalyzing(false);
      setLoadingMessage(null);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070913]">
      {/* 1. Left Explorer Sidebar (Desktop + Mobile Overlay Drawer) */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <>
            {/* Mobile Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-72 shrink-0 bg-[#070913] shadow-2xl lg:relative lg:inset-auto lg:z-auto lg:w-64 lg:shadow-none"
            >
              <EditorSidebar
                onNewAnalysis={handleNewAnalysis}
                onSelectRecentFile={handleFileLoaded}
                onTriggerUpload={() => {
                  const fileInput = document.querySelector(
                    "input[type='file']",
                  ) as HTMLInputElement;
                  fileInput?.click();
                }}
                onLoadTemplate={handleLoadTemplate}
                supportedLanguages={supportedLanguages}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 2. Main Editor Workspace Container */}
      <div className="flex h-full flex-1 flex-col overflow-hidden">
        {/* Top bar settings / file actions */}
        <EditorToolbar
          fileName={fileName}
          onFileNameChange={setFileName}
          language={language}
          onLanguageChange={setLanguage}
          theme={editorTheme}
          onThemeChange={setEditorTheme}
          wordWrap={wordWrap}
          onWordWrapToggle={() => setWordWrap(!wordWrap)}
          fontSize={fontSize}
          onFontSizeChange={setFontSize}
          onFormat={handleFormat}
          onTriggerUpload={() => {
            const fileInput = document.querySelector("input[type='file']") as HTMLInputElement;
            fileInput?.click();
          }}
          onAnalyze={handleAnalyze}
          supportedLanguages={supportedLanguages}
        />

        {/* Panel Control Toggles & View Mode Switcher */}
        <div className="md:px-4.5 flex items-center justify-between border-b border-slate-900 bg-slate-950/20 px-3 py-1.5 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-2 md:gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center gap-1 transition hover:text-white"
              title="Toggle Left Sidebar"
            >
              {sidebarOpen ? (
                <PanelLeftClose className="size-4" />
              ) : (
                <PanelLeftOpen className="size-4" />
              )}
              <span className="inline text-[11px] md:text-xs">Explorer</span>
            </button>

            {analysisResults && (
              <>
                <div className="h-3 w-[1px] bg-slate-800" />
                <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 p-0.5">
                  <button
                    onClick={() => setViewMode("editor")}
                    className={`flex items-center gap-1 rounded px-2 py-1 text-[10px] font-semibold transition md:px-2.5 md:text-[11px] ${
                      viewMode === "editor"
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Code2 className="h-3.5 w-3.5" /> Monaco
                  </button>
                  <button
                    onClick={() => setViewMode("report")}
                    className={`flex items-center gap-1 rounded px-2 py-1 text-[10px] font-semibold transition md:px-2.5 md:text-[11px] ${
                      viewMode === "report"
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5" /> Audit Report
                  </button>
                </div>
              </>
            )}

            <div className="hidden h-3 w-[1px] bg-slate-800 md:block" />
            <button
              type="button"
              onClick={() => setShowShortcuts(!showShortcuts)}
              className="hidden items-center gap-1 transition hover:text-white md:flex"
            >
              <Keyboard className="size-4" />
              <span>Shortcuts</span>
            </button>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <span className="hidden items-center gap-1 rounded border border-slate-900 bg-slate-950 px-2 py-0.5 text-[10px] text-slate-600 sm:flex">
              <Info className="size-3" /> Drag & Drop code
            </span>
            <div className="hidden h-3 w-[1px] bg-slate-800 sm:block" />
            <button
              type="button"
              onClick={() => setRightPanelOpen(!rightPanelOpen)}
              className="flex items-center gap-1 transition hover:text-white"
              title="Toggle AI Preview Panel"
            >
              <span className="inline text-[11px] md:text-xs">AI Preview</span>
              {rightPanelOpen ? (
                <PanelRightClose className="size-4" />
              ) : (
                <PanelRightOpen className="size-4" />
              )}
            </button>
          </div>
        </div>

        {/* Dynamic Editor Panel OR Full Analysis Report Workspace */}
        <div className="relative flex-1 overflow-hidden bg-[#070913]">
          {viewMode === "report" && analysisResults ? (
            <FullAnalysisReport
              data={analysisResults}
              originalCode={code}
              language={language}
              fileName={fileName}
              reportId={savedReportId}
              onApplyFix={(newCode) => {
                setCode(newCode);
                setViewMode("editor");
                setEditorStatus("Saved");
              }}
              onCloseReport={() => setViewMode("editor")}
            />
          ) : (
            <AnimatePresence mode="wait">
              {!showEditor ? (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full w-full"
                >
                  <UploadZone
                    onFileLoaded={handleFileLoaded}
                    isDragging={isDragging}
                    onDragStateChange={setIsDragging}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="monaco-editor"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative h-full w-full"
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                >
                  {isDragging && (
                    <div
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const files = e.dataTransfer.files;
                        if (files && files.length > 0) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            setCode(ev.target?.result as string);
                            setFileName(files[0].name);
                            setEditorStatus("Saved");
                          };
                          reader.readAsText(files[0]);
                        }
                      }}
                      className="backdrop-blur-xs pointer-events-auto absolute inset-0 z-10 flex items-center justify-center border-2 border-dashed border-cyan-500/40 bg-cyan-950/20 text-sm font-semibold text-cyan-400"
                    >
                      Drop files to load into editor
                    </div>
                  )}

                  <Editor
                    height="100%"
                    language={language}
                    value={code}
                    theme={editorTheme}
                    onMount={handleEditorMount}
                    onChange={(val) => setCode(val || "")}
                    options={{
                      fontSize: fontSize,
                      wordWrap: wordWrap ? "on" : "off",
                      minimap: { enabled: false },
                      automaticLayout: true,
                      tabSize: 4,
                      lineHeight: 22,
                      fontFamily: "Fira Code, Menlo, Monaco, Consolas, monospace",
                      cursorBlinking: "smooth",
                      cursorSmoothCaretAnimation: "on",
                      padding: { top: 16, bottom: 16 },
                      scrollBeyondLastLine: false,
                      folding: true,
                      bracketPairColorization: { enabled: true },
                      autoIndent: "full",
                    }}
                    loading={
                      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#070913] text-slate-400">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-500/20 border-t-cyan-400" />
                        <span className="text-xs font-semibold">Initializing Monaco...</span>
                      </div>
                    }
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Analysis progress / error overlay */}
          {(isAnalyzing || analysisError) && (
            <div className="backdrop-blur-xs absolute inset-0 z-30 flex items-center justify-center bg-slate-950/60 p-6">
              {analysisError ? (
                <div className="glass-panel flex w-full max-w-sm flex-col items-center rounded-2xl border border-red-500/20 bg-slate-900/90 p-6 text-center">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400">
                    <span className="text-lg font-bold">!</span>
                  </div>
                  <span className="text-sm font-bold text-white">Analysis Failed</span>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">{analysisError}</p>
                  <button
                    type="button"
                    onClick={() => setAnalysisError(null)}
                    className="mt-5 w-full rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-white transition hover:bg-slate-700"
                  >
                    Dismiss
                  </button>
                </div>
              ) : (
                <div className="glass-panel flex w-full max-w-sm flex-col items-center rounded-2xl border border-slate-800 bg-slate-900/90 p-6 text-center">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
                    <div className="size-5 animate-spin rounded-full border-2 border-cyan-500/20 border-t-cyan-400" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-wider text-white">
                    {loadingMessage || "Analyzing..."}
                  </span>
                  <p className="mt-2 text-xs text-slate-500">
                    Running diagnostic scan on codebase.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Keyboard Shortcuts Dialog */}
          {showShortcuts && (
            <div className="backdrop-blur-xs absolute inset-0 z-40 flex items-center justify-center bg-slate-950/70 p-4">
              <div className="glass-panel w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-6">
                <div className="mb-4 flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <span className="flex items-center gap-2 text-sm font-bold text-white">
                    <Keyboard className="size-4.5 text-cyan-400" /> Editor Shortcuts
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowShortcuts(false)}
                    className="text-xs text-slate-500 transition hover:text-white"
                  >
                    Close
                  </button>
                </div>
                <div className="space-y-3 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Format Document</span>
                    <kbd className="rounded border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] text-white">
                      Alt + Shift + F
                    </kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Search / Replace</span>
                    <kbd className="rounded border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] text-white">
                      Ctrl + F / Ctrl + H
                    </kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Multi-Cursor Alt Click</span>
                    <kbd className="rounded border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] text-white">
                      Alt + Click
                    </kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Fold/Unfold Section</span>
                    <kbd className="rounded border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] text-white">
                      Ctrl + Shift + [ / ]
                    </kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Undo / Redo</span>
                    <kbd className="rounded border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] text-white">
                      Ctrl + Z / Ctrl + Y
                    </kbd>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Diagnostic Selectable Actions */}
        {viewMode === "editor" && (
          <QuickModeCards selectedMode={analysisType} onSelectMode={setAnalysisType} />
        )}

        {/* Telemetry Status bar */}
        <EditorStatusBar
          language={language}
          cursorLine={cursorLine}
          cursorCol={cursorCol}
          totalLines={totalLines}
          totalChars={totalChars}
          encoding="UTF-8"
          lineEndings="LF"
          status={editorStatus}
        />
      </div>

      {/* 3. Right AI Analysis Preview Panel (Desktop + Mobile Drawer Overlay) */}
      <AnimatePresence mode="wait">
        {rightPanelOpen && viewMode === "editor" && (
          <>
            {/* Mobile Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRightPanelOpen(false)}
              className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm xl:hidden"
            />
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 z-50 w-80 shrink-0 bg-[#070913] shadow-2xl xl:relative xl:inset-auto xl:z-auto xl:w-80 xl:shadow-none"
            >
              <EditorRightPanel
                language={language}
                totalChars={totalChars}
                analysisType={analysisType}
                results={analysisResults}
                onApplyFix={(newCode) => {
                  setCode(newCode);
                  setEditorStatus("Saved");
                  if (typeof window !== "undefined" && window.innerWidth < 1280) {
                    setRightPanelOpen(false);
                  }
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function EditorWorkspacePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center bg-[#070913] text-slate-400">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-500/20 border-t-cyan-400" />
        </div>
      }
    >
      <EditorWorkspacePageContent />
    </Suspense>
  );
}
