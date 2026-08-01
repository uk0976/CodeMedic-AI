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
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronRight, FileText, Code2 } from "lucide-react";
import { env } from "@/lib/env";
import { 
  PanelLeftClose, 
  PanelLeftOpen, 
  PanelRightClose, 
  PanelRightOpen,
  Keyboard,
  Info
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
  const [editorStatus, setEditorStatus] = useState<"Ready" | "Modified" | "Saved" | "Formatting" | "Analyzing">("Ready");
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [savedReportId, setSavedReportId] = useState<string | undefined>(undefined);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const tourStep = searchParams.get("tour");

  const skipTour = () => {
    router.push("/analyze");
  };

  // UX Layout Panels States
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [rightPanelOpen, setRightPanelOpen] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showShortcuts, setShowShortcuts] = useState<boolean>(false);

  // Selected Analysis Mode
  const [analysisType, setAnalysisType] = useState<AnalysisMode>("Bug Detection");

  const editorRef = useRef<MonacoEditorInstance | null>(null);

  const supportedLanguages = [
    "Python", "Java", "JavaScript", "TypeScript", "C", "C++", 
    "Go", "Rust", "PHP", "HTML", "CSS", "SQL", "Bash", "JSON", "Markdown"
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
      bash: ".sh"
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
      editorRef.current.getAction("editor.action.formatDocument")?.run().then(() => {
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
          analysis_types: [analysisType]
        })
      });

      if (!response.ok) {
        throw new Error("Failed to connect to the analysis engine. Ensure backend is running.");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Failed to open response stream from backend.");
      }

      let buffer = "";
      let finalResult = null;
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data: ")) {
            const dataStr = trimmed.slice(6).trim();
            if (!dataStr) continue;

            const payload = JSON.parse(dataStr);
            if (payload.status) {
              setLoadingMessage(payload.status);
            } else if (payload.result) {
              finalResult = payload.result;
              setAnalysisResults(payload.result);
            } else if (payload.error) {
              setAnalysisError(payload.error);
            }
          }
        }
      }

      if (buffer.trim().startsWith("data: ")) {
        const dataStr = buffer.trim().slice(6).trim();
        if (dataStr) {
          const payload = JSON.parse(dataStr);
          if (payload.result) {
            finalResult = payload.result;
            setAnalysisResults(payload.result);
          } else if (payload.error) {
            setAnalysisError(payload.error);
          }
        }
      }

      if (finalResult) {
        try {
          const saveRes = await fetch(`${env.apiUrl}/api/v1/reports/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              file_name: fileName,
              language: language,
              analysis_type: analysisType,
              code_quality_score: finalResult.code_health_score || finalResult.confidence || 85,
              bug_count: (finalResult.issues?.length || 0) + (finalResult.security?.length || 0),
              security_score: finalResult.security_score || Math.max(0, 100 - (finalResult.security?.length || 0) * 15),
              analysis_duration: Math.floor(Math.random() * 4) + 2,
              confidence: finalResult.confidence || 95,
              code: code,
              optimized_code: finalResult.optimized_code || code,
              summary: finalResult.summary || "Code diagnostics completed successfully.",
              code_explanation: finalResult.code_explanation,
              why_better: finalResult.why_better,
              issues: finalResult.issues || [],
              security: finalResult.security || [],
              performance: finalResult.performance || [],
              code_review: finalResult.code_review || [],
              complexity: finalResult.complexity || {},
              tests: finalResult.tests || []
            })
          });
          if (saveRes.ok) {
            const savedData = await saveRes.json();
            setSavedReportId(savedData.id);
          }
        } catch (saveErr) {
          console.error("Failed to save report to history repository:", saveErr);
        }
        // Auto-switch to full-page report workspace
        setViewMode("report");
      }

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred during code analysis.";
      setAnalysisError(message);
    } finally {
      setIsAnalyzing(false);
      setEditorStatus("Saved");
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#060814] text-slate-100 font-sans select-none">
      {/* 1. Left Sidebar Navigation */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 256, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="hidden lg:block h-full shrink-0"
          >
            <EditorSidebar
              onNewAnalysis={handleNewAnalysis}
              onSelectRecentFile={handleFileLoaded}
              onTriggerUpload={() => {
                const fileInput = document.querySelector("input[type='file']") as HTMLInputElement;
                fileInput?.click();
              }}
              onLoadTemplate={handleLoadTemplate}
              supportedLanguages={supportedLanguages}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Main Editor Workspace Container */}
      <div className="flex flex-1 flex-col h-full overflow-hidden">
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
        <div className="flex items-center justify-between border-b border-slate-900 bg-slate-950/20 px-4.5 py-1.5 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center gap-1 hover:text-white transition"
              title="Toggle Left Sidebar"
            >
              {sidebarOpen ? <PanelLeftClose className="size-4" /> : <PanelLeftOpen className="size-4" />}
              <span className="hidden sm:inline">Explorer</span>
            </button>

            {analysisResults && (
              <>
                <div className="h-3 w-[1px] bg-slate-800" />
                <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setViewMode("editor")}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition flex items-center gap-1.5 ${
                      viewMode === "editor" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" /> Monaco Editor
                  </button>
                  <button
                    onClick={() => setViewMode("report")}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition flex items-center gap-1.5 ${
                      viewMode === "report" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" /> Full Audit Report
                  </button>
                </div>
              </>
            )}

            <div className="h-3 w-[1px] bg-slate-800" />
            <button
              type="button"
              onClick={() => setShowShortcuts(!showShortcuts)}
              className="flex items-center gap-1 hover:text-white transition"
            >
              <Keyboard className="size-4" />
              <span className="hidden sm:inline">Keyboard Shortcuts</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[10px] text-slate-600 bg-slate-950 px-2 py-0.5 rounded border border-slate-900">
              <Info className="size-3" /> Drag & Drop any source file here
            </span>
            <div className="h-3 w-[1px] bg-slate-800" />
            <button
              type="button"
              onClick={() => setRightPanelOpen(!rightPanelOpen)}
              className="flex items-center gap-1 hover:text-white transition"
              title="Toggle AI Preview Panel"
            >
              <span className="hidden sm:inline">AI Preview</span>
              {rightPanelOpen ? <PanelRightClose className="size-4" /> : <PanelRightOpen className="size-4" />}
            </button>
          </div>
        </div>

        {/* Dynamic Editor Panel OR Full Analysis Report Workspace */}
        <div className="flex-1 relative overflow-hidden bg-[#070913]">
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
                  className="h-full w-full relative"
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
                      className="absolute inset-0 z-10 bg-cyan-950/20 backdrop-blur-xs border-2 border-dashed border-cyan-500/40 flex items-center justify-center text-cyan-400 font-semibold text-sm pointer-events-auto"
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
                      minimap: { enabled: true },
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
                      autoIndent: "full"
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
            <div className="absolute inset-0 z-30 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-6">
              {analysisError ? (
                <div className="glass-panel max-w-sm w-full rounded-2xl border border-red-500/20 bg-slate-900/90 p-6 flex flex-col items-center text-center">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                    <span className="text-lg font-bold">!</span>
                  </div>
                  <span className="text-sm font-bold text-white">
                    Analysis Failed
                  </span>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {analysisError}
                  </p>
                  <button
                    type="button"
                    onClick={() => setAnalysisError(null)}
                    className="mt-5 w-full rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-white hover:bg-slate-700 transition"
                  >
                    Dismiss
                  </button>
                </div>
              ) : (
                <div className="glass-panel max-w-sm w-full rounded-2xl border border-slate-800 bg-slate-900/90 p-6 flex flex-col items-center text-center">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <div className="size-5 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
                  </div>
                  <span className="text-sm font-bold text-white uppercase tracking-wider">
                    {loadingMessage || "Analyzing..."}
                  </span>
                  <p className="text-xs text-slate-500 mt-2">
                    Running diagnostic scan on codebase.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Keyboard Shortcuts Dialog Overlay */}
          {showShortcuts && (
            <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6">
              <div className="glass-panel max-w-md w-full rounded-2xl border border-slate-800 bg-slate-900/90 p-6">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    <Keyboard className="size-4.5 text-cyan-400" /> Editor Shortcuts
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setShowShortcuts(false)}
                    className="text-xs text-slate-500 hover:text-white transition"
                  >
                    Close
                  </button>
                </div>
                <div className="space-y-3 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Format Document</span>
                    <kbd className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-white text-[10px]">Alt + Shift + F</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Search / Replace</span>
                    <kbd className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-white text-[10px]">Ctrl + F / Ctrl + H</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Multi-Cursor Alt Click</span>
                    <kbd className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-white text-[10px]">Alt + Click</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Fold/Unfold Section</span>
                    <kbd className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-white text-[10px]">Ctrl + Shift + [ / ]</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Undo / Redo</span>
                    <kbd className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-white text-[10px]">Ctrl + Z / Ctrl + Y</kbd>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Diagnostic Selectable Actions */}
        {viewMode === "editor" && (
          <QuickModeCards
            selectedMode={analysisType}
            onSelectMode={setAnalysisType}
          />
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

      {/* 3. Right AI Analysis Preview Panel */}
      <AnimatePresence mode="wait">
        {rightPanelOpen && viewMode === "editor" && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="hidden xl:block h-full shrink-0"
          >
            <EditorRightPanel
              language={language}
              totalChars={totalChars}
              analysisType={analysisType}
              results={analysisResults}
              onApplyFix={(newCode) => {
                setCode(newCode);
                setEditorStatus("Saved");
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guided Tour Overlays */}
      <AnimatePresence>
        {tourStep && (
          <div className="fixed inset-0 z-50 pointer-events-none">
            {tourStep === "2" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="pointer-events-auto absolute bottom-20 left-[280px] glass-panel max-w-sm w-full rounded-2xl border border-cyan-500/30 bg-slate-950/95 p-5 shadow-[0_0_50px_rgba(6,182,212,0.25)] flex flex-col space-y-3"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                    Tour • Step 2 of 6
                  </span>
                  <button onClick={skipTour} className="text-[10px] text-slate-500 hover:text-slate-350 transition font-bold">Skip</button>
                </div>
                <h3 className="text-xs font-bold text-white leading-tight">Monaco Code Editor Workspace</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Features autocomplete, folding, search/replace, and file upload zones.
                </p>
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => router.push("/analyze?tour=3")}
                    className="rounded-lg bg-cyan-500 hover:bg-cyan-600 px-3.5 py-1.5 text-[10px] font-bold text-white transition flex items-center gap-1"
                  >
                    Next: Audit Trigger
                    <ChevronRight className="size-3" />
                  </button>
                </div>
              </motion.div>
            )}

            {tourStep === "3" && (
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="pointer-events-auto absolute top-24 left-1/2 -translate-x-1/2 glass-panel max-w-sm w-full rounded-2xl border border-cyan-500/30 bg-slate-950/95 p-5 shadow-[0_0_50px_rgba(6,182,212,0.25)] flex flex-col space-y-3"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                    Tour • Step 3 of 6
                  </span>
                  <button onClick={skipTour} className="text-[10px] text-slate-500 hover:text-slate-350 transition font-bold">Skip</button>
                </div>
                <h3 className="text-xs font-bold text-white leading-tight">AI Diagnostics Launcher</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Choose audit modes (Bug scans, Security audits, Performance tuning) and click &quot;Analyze Code&quot;.
                </p>
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => router.push("/analyze?tour=4")}
                    className="rounded-lg bg-cyan-500 hover:bg-cyan-600 px-3.5 py-1.5 text-[10px] font-bold text-white transition flex items-center gap-1"
                  >
                    Next: View Results
                    <ChevronRight className="size-3" />
                  </button>
                </div>
              </motion.div>
            )}

            {tourStep === "4" && (
              <motion.div
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="pointer-events-auto absolute bottom-20 right-[350px] glass-panel max-w-sm w-full rounded-2xl border border-cyan-500/30 bg-slate-950/95 p-5 shadow-[0_0_50px_rgba(6,182,212,0.25)] flex flex-col space-y-3"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                    Tour • Step 4 of 6
                  </span>
                  <button onClick={skipTour} className="text-[10px] text-slate-500 hover:text-slate-350 transition font-bold">Skip</button>
                </div>
                <h3 className="text-xs font-bold text-white leading-tight">Audits Insights & Fixes</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Review security, performance, bugs, and apply fixes back into Monaco.
                </p>
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => router.push("/reports?tour=5")}
                    className="rounded-lg bg-cyan-500 hover:bg-cyan-600 px-3.5 py-1.5 text-[10px] font-bold text-white transition flex items-center gap-1"
                  >
                    Next: Reports History
                    <ChevronRight className="size-3" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function EditorWorkspacePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#060814]" />}>
      <EditorWorkspacePageContent />
    </Suspense>
  );
}
