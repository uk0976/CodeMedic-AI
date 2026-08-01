"use client";

interface EditorStatusBarProps {
  language: string;
  cursorLine: number;
  cursorCol: number;
  totalLines: number;
  totalChars: number;
  encoding: string;
  lineEndings: string;
  status: "Ready" | "Modified" | "Saved" | "Formatting" | "Analyzing";
}

export function EditorStatusBar({
  language,
  cursorLine,
  cursorCol,
  totalLines,
  totalChars,
  encoding,
  lineEndings,
  status,
}: EditorStatusBarProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ready":
        return "bg-cyan-500 shadow-cyan-500/20";
      case "Modified":
        return "bg-amber-500 shadow-amber-500/20";
      case "Saved":
        return "bg-emerald-500 shadow-emerald-500/20";
      case "Formatting":
      case "Analyzing":
        return "bg-blue-500 animate-pulse shadow-blue-500/20";
      default:
        return "bg-slate-500";
    }
  };

  return (
    <footer className="flex h-8 w-full select-none items-center justify-between border-t border-slate-900 bg-slate-950 px-4 text-[10px] font-semibold tracking-wide text-slate-500">
      {/* Left section: Editor status indicator */}
      <div className="flex items-center gap-2">
        <span className={`relative flex size-2 rounded-full shadow-sm ${getStatusColor(status)}`} />
        <span className="uppercase text-slate-400">{status}</span>
      </div>

      {/* Right section: Telemetry details */}
      <div className="flex items-center divide-x divide-slate-800/80">
        <span className="px-3 uppercase">{language}</span>
        <span className="px-3">
          Ln {cursorLine}, Col {cursorCol}
        </span>
        <span className="px-3">{totalLines} lines</span>
        <span className="px-3">{totalChars.toLocaleString()} chars</span>
        <span className="px-3">{encoding}</span>
        <span className="px-3">{lineEndings}</span>
      </div>
    </footer>
  );
}
