import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AppProviders } from "@/components/providers";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://codemedic-ai.vercel.app"),
  title: {
    default: "CodeMedic AI | Your AI Senior Software Engineer",
    template: "%s | CodeMedic AI",
  },
  description: "Fix. Explain. Optimize. Powered by Codex.",
  keywords: ["AI code review", "debugging", "OpenAI Codex", "code security", "developer tools"],
  openGraph: {
    title: "CodeMedic AI | Your AI Senior Software Engineer",
    description: "Analyze, debug, explain, optimize, and secure code using OpenAI Codex.",
    type: "website",
    siteName: "CodeMedic AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeMedic AI | Your AI Senior Software Engineer",
    description: "Fix. Explain. Optimize. Powered by Codex.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body><AppProviders>{children}</AppProviders></body>
    </html>
  );
}
