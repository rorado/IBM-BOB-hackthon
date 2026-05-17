"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
  Code2,
  FileJson,
  FileText,
} from "lucide-react";

interface FileNode {
  id: string;
  name: string;
  path: string;
  type: "FILE" | "DIRECTORY";
  children?: FileNode[];
  extension?: string | null;
  size?: number;
}

interface FileExplorerProps {
  files: FileNode[];
  onFileSelect?: (file: FileNode) => void;
  selectedFile?: string;
}

export default function FileExplorer({
  files,
  onFileSelect,
  selectedFile,
}: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(),
  );

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const getFileIcon = (node: FileNode) => {
    if (node.type === "DIRECTORY") {
      return expandedFolders.has(node.path) ? (
        <FolderOpen className="w-4 h-4 text-yellow-500" />
      ) : (
        <Folder className="w-4 h-4 text-yellow-500" />
      );
    }

    const ext = node.extension?.toLowerCase();
    if (ext === "json") {
      return <FileJson className="w-4 h-4 text-yellow-600" />;
    } else if (["ts", "tsx", "js", "jsx"].includes(ext || "")) {
      return <Code2 className="w-4 h-4 text-blue-500" />;
    } else if (["md", "txt"].includes(ext || "")) {
      return <FileText className="w-4 h-4 text-gray-500" />;
    }
    return <File className="w-4 h-4 text-gray-400" />;
  };

  const renderNode = (node: FileNode, depth: number = 0) => {
    const isExpanded = expandedFolders.has(node.path);
    const isSelected = selectedFile === node.id;

    return (
      <div key={node.id}>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
            isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted"
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => {
            if (node.type === "DIRECTORY") {
              toggleFolder(node.path);
            } else {
              onFileSelect?.(node);
            }
          }}
        >
          {node.type === "DIRECTORY" && (
            <span className="flex-shrink-0">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </span>
          )}
          {node.type === "FILE" && <span className="w-4" />}
          <span className="flex-shrink-0">{getFileIcon(node)}</span>
          <span className="text-sm truncate flex-1">{node.name}</span>
          {node.type === "FILE" && node.size && (
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {formatFileSize(node.size)}
            </span>
          )}
        </motion.div>

        <AnimatePresence>
          {node.type === "DIRECTORY" && isExpanded && node.children && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {node.children.map((child) => renderNode(child, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-2 space-y-1">
        {files.map((node) => renderNode(node))}
      </div>
    </div>
  );
}
