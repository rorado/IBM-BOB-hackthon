"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Download, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface CodeViewerProps {
  file: {
    name: string;
    path: string;
    content: string;
    extension?: string | null;
  };
  onAskAI?: (question: string) => void;
}

export default function CodeViewer({ file, onAskAI }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(file.content);
      setCopied(true);
      toast.success("Code copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy code");
    }
  };

  const downloadFile = () => {
    const blob = new Blob([file.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  };

  const lineCount = file.content.split("\n").length;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div>
          <h3 className="font-semibold">{file.name}</h3>
          <p className="text-xs text-muted-foreground">{file.path}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyToClipboard}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Copy code"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={downloadFile}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Download file"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className="flex-1 overflow-auto bg-muted/20">
        <div className="flex">
          {/* Line Numbers */}
          <div className="flex-shrink-0 p-4 pr-2 text-right text-xs text-muted-foreground select-none bg-muted/30 border-r">
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i + 1} className="leading-6">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Code */}
          <pre className="flex-1 p-4 text-sm font-mono overflow-x-auto">
            <code className="whitespace-pre">{file.content}</code>
          </pre>
        </div>
      </div>

      {/* AI Actions */}
      {onAskAI && (
        <div className="p-4 border-t bg-muted/30">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Ask AI about this file</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onAskAI(`Explain what ${file.name} does`)}
              className="px-3 py-2 text-sm rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
            >
              Explain this file
            </button>
            <button
              onClick={() => onAskAI(`Find potential issues in ${file.name}`)}
              className="px-3 py-2 text-sm rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
            >
              Find issues
            </button>
            <button
              onClick={() => onAskAI(`Suggest improvements for ${file.name}`)}
              className="px-3 py-2 text-sm rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
            >
              Suggest improvements
            </button>
            <button
              onClick={() => onAskAI(`Generate tests for ${file.name}`)}
              className="px-3 py-2 text-sm rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
            >
              Generate tests
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
