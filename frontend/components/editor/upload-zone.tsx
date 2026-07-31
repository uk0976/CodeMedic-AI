"use client";

import { useState } from "react";
import { 
  FileUp, 
  UploadCloud, 
  RefreshCw,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UploadZoneProps {
  onFileLoaded: (fileName: string, content: string, language: string) => void;
  isDragging: boolean;
  onDragStateChange: (state: boolean) => void;
}

export function UploadZone({
  onFileLoaded,
  isDragging,
  onDragStateChange
}: UploadZoneProps) {
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadingName, setUploadingName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    setUploadingName(file.name);
    setUploadProgress(0);

    // Simulate progress bar animation
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        clearInterval(interval);
        setUploadProgress(100);

        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          const ext = file.name.split(".").pop()?.toLowerCase() || "";
          
          // Map file extension to monaco supported language keys
          let lang = "plaintext";
          const extMap: Record<string, string> = {
            py: "python",
            java: "java",
            js: "javascript",
            ts: "typescript",
            tsx: "typescript",
            cpp: "cpp",
            c: "c",
            go: "go",
            rs: "rust",
            php: "php",
            html: "html",
            css: "css",
            sql: "sql",
            json: "json",
            md: "markdown",
            txt: "plaintext",
            sh: "bash",
            bash: "bash"
          };

          if (extMap[ext]) {
            lang = extMap[ext];
          }

          setTimeout(() => {
            onFileLoaded(file.name, content, lang);
            setUploadProgress(null);
            setUploadingName("");
          }, 300);
        };
        reader.readAsText(file);
      } else {
        setUploadProgress(progress);
      }
    }, 80);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragStateChange(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    onDragStateChange(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDragStateChange(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative flex h-full w-full flex-col items-center justify-center bg-[#070913] p-8 text-center transition-all ${
        isDragging ? "ring-2 ring-inset ring-cyan-500/50 bg-cyan-950/5" : ""
      }`}
    >
      {/* Empty State Layout */}
      <AnimatePresence mode="wait">
        {uploadProgress === null ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-md flex flex-col items-center"
          >
            {/* Glowing Icon Frame */}
            <div className="relative mb-6 flex size-16 items-center justify-center rounded-2xl border border-cyan-500/20 bg-slate-900 shadow-xl shadow-cyan-500/5">
              <UploadCloud className={`size-7 text-cyan-400 ${isDragging ? "animate-bounce" : ""}`} />
              <div className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-cyan-400">
                <Sparkles className="size-2 text-slate-950 fill-slate-950" />
              </div>
            </div>

            <h2 className="text-lg font-extrabold tracking-tight text-white sm:text-xl">
              {isDragging ? "Drop your file here" : "AI-Powered Code Workspace"}
            </h2>
            <p className="mt-2.5 text-xs leading-relaxed text-slate-400 font-medium">
              Paste your code or upload a source file to begin AI-powered analysis. Support for over 15+ syntax environments including Python, TS, Go, and Rust.
            </p>

            {/* Custom Input Trigger */}
            <div className="mt-8">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3.5 text-xs font-bold text-white shadow-lg shadow-blue-500/10 hover:brightness-110 transition">
                <FileUp className="size-4" />
                Browse Local Files
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".py,.java,.js,.ts,.tsx,.cpp,.c,.go,.rs,.php,.html,.css,.sql,.json,.md,.txt,.sh"
                />
              </label>
            </div>

            <span className="mt-3.5 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              Or drag & drop files directly here
            </span>
          </motion.div>
        ) : (
          /* Uploading Progress Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm flex flex-col items-center rounded-2xl border border-slate-800 bg-slate-950/60 p-6 backdrop-blur-md shadow-2xl"
          >
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <RefreshCw className="size-5 animate-spin" />
            </div>

            <span className="text-xs font-bold text-slate-200 truncate max-w-full">
              Loading {uploadingName}...
            </span>
            <p className="mt-1 text-[10px] text-slate-500">
              Reading file contents and detecting syntax rules
            </p>

            {/* Progress Bar Container */}
            <div className="mt-5 w-full">
              <div className="flex justify-between text-[9px] font-bold text-slate-400 mb-1 px-0.5">
                <span>PROGRESS</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-900 overflow-hidden border border-slate-800/40">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
