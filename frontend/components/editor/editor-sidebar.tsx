"use client";

import Link from "next/link";
import {
  ArrowLeft,
  PlusCircle,
  FileCode,
  Upload,
  Clipboard,
  FileSpreadsheet,
  Check,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

interface EditorSidebarProps {
  onNewAnalysis: () => void;
  onSelectRecentFile: (fileName: string, content: string, language: string) => void;
  onTriggerUpload: () => void;
  onLoadTemplate: (templateName: string, content: string, language: string) => void;
  supportedLanguages: string[];
}

export function EditorSidebar({
  onNewAnalysis,
  onSelectRecentFile,
  onTriggerUpload,
  onLoadTemplate,
  supportedLanguages,
}: EditorSidebarProps) {
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);

  const recentFiles = [
    {
      name: "app.py",
      lang: "python",
      content: `def get_user_data(user_id):\n    # TODO: Add caching mechanism\n    query = f"SELECT * FROM users WHERE id = '{user_id}'"\n    print(f"Executing: {query}")\n    return db.execute(query)`,
    },
    {
      name: "auth.ts",
      lang: "typescript",
      content: `export const verifyToken = (token: string): boolean => {\n  if (!token) return false;\n  const parts = token.split('.');\n  return parts.length === 3;\n};`,
    },
    {
      name: "queries.sql",
      lang: "sql",
      content: `SELECT users.id, profiles.bio \nFROM users \nLEFT JOIN profiles ON users.id = profiles.user_id \nWHERE users.is_active = true;`,
    },
    {
      name: "style.css",
      lang: "css",
      content: `.glow-effect {\n  box-shadow: 0 0 15px rgba(6, 182, 212, 0.4);\n  backdrop-filter: blur(12px);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n}`,
    },
  ];

  const templates = [
    {
      name: "FastAPI Boilerplate (Python)",
      lang: "python",
      content: `from fastapi import FastAPI, HTTPException\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass Item(BaseModel):\n    name: str\n    price: float\n\n@app.get("/")\ndef read_root():\n    return {"message": "Hello World"}\n\n@app.post("/items")\ndef create_item(item: Item):\n    if item.price < 0:\n        raise HTTPException(status_code=400, detail="Price cannot be negative")\n    return {"item": item}`,
    },
    {
      name: "React Custom Hook (TypeScript)",
      lang: "typescript",
      content: `import { useState, useEffect } from "react";\n\nexport function useLocalStorage<T>(key: string, initialValue: T) {\n  const [value, setValue] = useState<T>(() => {\n    try {\n      const item = window.localStorage.getItem(key);\n      return item ? JSON.parse(item) : initialValue;\n    } catch (error) {\n      console.error(error);\n      return initialValue;\n    }\n  });\n\n  useEffect(() => {\n    try {\n      window.localStorage.setItem(key, JSON.stringify(value));\n    } catch (e) {\n      console.error(e);\n    }\n  }, [key, value]);\n\n  return [value, setValue] as const;\n}`,
    },
    {
      name: "Simple HTML5 (HTML)",
      lang: "html",
      content: `<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Document</title>\n</head>\n<body>\n    <h1>Hello CodeMedic AI</h1>\n</body>\n</html>`,
    },
  ];

  return (
    <div className="flex h-full w-64 flex-col overflow-y-auto border-r border-slate-800/80 bg-slate-950/80 p-5 text-slate-100">
      {/* Brand Header */}
      <div className="mb-6 flex flex-col gap-3">
        <Link
          href="/demo"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 transition hover:text-white"
        >
          <ArrowLeft className="size-3.5" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-400">
            <span className="text-[10px] font-bold">CM</span>
          </div>
          <span className="text-sm font-bold tracking-tight text-white">Editor Workspace</span>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="mb-6 space-y-2">
        <button
          type="button"
          onClick={onNewAnalysis}
          className="flex w-full items-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/10 transition hover:brightness-110"
        >
          <PlusCircle className="size-4" />
          <span>New Analysis</span>
        </button>

        <button
          type="button"
          onClick={onTriggerUpload}
          className="flex w-full items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-slate-700 hover:text-white"
        >
          <Upload className="size-4" />
          <span>Upload File</span>
        </button>

        <button
          type="button"
          onClick={() => {
            const input = prompt("Paste your code here:");
            if (input) onSelectRecentFile("pasted_code.txt", input, "plaintext");
          }}
          className="flex w-full items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-slate-700 hover:text-white"
        >
          <Clipboard className="size-4" />
          <span>Paste Code</span>
        </button>
      </div>

      {/* Templates Dropdown */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => setIsTemplatesOpen(!isTemplatesOpen)}
          className="flex w-full items-center justify-between rounded-xl border border-slate-800/80 bg-slate-900/10 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-900/30"
        >
          <span className="flex items-center gap-2">
            <FileSpreadsheet className="size-4 text-cyan-400" /> Templates
          </span>
          <ChevronDown
            className={`size-3.5 text-slate-500 transition-transform ${isTemplatesOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isTemplatesOpen && (
          <div className="mt-1.5 space-y-1 rounded-xl border border-slate-800 bg-slate-950 p-1.5 shadow-2xl">
            {templates.map((temp) => (
              <button
                key={temp.name}
                type="button"
                onClick={() => {
                  onLoadTemplate(temp.name, temp.content, temp.lang);
                  setIsTemplatesOpen(false);
                }}
                className="w-full rounded-lg px-2.5 py-2 text-left text-[11px] font-medium text-slate-400 transition hover:bg-slate-900 hover:text-white"
              >
                {temp.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Recent Files */}
      <div className="mb-6 flex-1">
        <p className="mb-3 px-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Recent Files
        </p>
        <div className="space-y-1">
          {recentFiles.map((file) => (
            <button
              key={file.name}
              type="button"
              onClick={() => onSelectRecentFile(file.name, file.content, file.lang)}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-400 transition hover:bg-slate-900/60 hover:text-white"
            >
              <FileCode className="size-4 text-slate-400" />
              <span>{file.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Supported Languages */}
      <div>
        <p className="mb-3 px-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Supported Languages
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {supportedLanguages.slice(0, 12).map((lang) => (
            <div
              key={lang}
              className="flex items-center gap-1.5 rounded-lg border border-slate-800/60 bg-slate-900/20 px-2 py-1 text-[10px] font-semibold text-slate-400"
            >
              <Check className="size-3 text-cyan-400" />
              <span>{lang}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
