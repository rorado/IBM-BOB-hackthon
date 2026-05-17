// Utility Functions

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format file size to human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}

/**
 * Get file extension from path
 */
export function getFileExtension(path: string): string {
  const parts = path.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

/**
 * Get language from file extension
 */
export function getLanguageFromExtension(extension: string): string {
  const languageMap: Record<string, string> = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    py: "python",
    rb: "ruby",
    java: "java",
    go: "go",
    rs: "rust",
    php: "php",
    c: "c",
    cpp: "cpp",
    cs: "csharp",
    swift: "swift",
    kt: "kotlin",
    html: "html",
    css: "css",
    scss: "scss",
    json: "json",
    yaml: "yaml",
    yml: "yaml",
    md: "markdown",
    sql: "sql",
    sh: "bash",
  };

  return languageMap[extension] || "plaintext";
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Sleep/delay function
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

/**
 * Parse GitHub URL
 */
export function parseGitHubUrl(
  url: string,
): { owner: string; repo: string } | null {
  const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
  const match = url.match(regex);

  if (!match) return null;

  return {
    owner: match[1],
    repo: match[2].replace(".git", ""),
  };
}

/**
 * Format date to relative time
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return date.toLocaleDateString();
}

/**
 * Calculate code complexity score (simplified)
 */
export function calculateComplexity(code: string): number {
  let complexity = 1;

  // Count control flow statements
  const controlFlowPatterns = [
    /\bif\b/g,
    /\belse\b/g,
    /\bfor\b/g,
    /\bwhile\b/g,
    /\bswitch\b/g,
    /\bcase\b/g,
    /\bcatch\b/g,
    /\b\?\s*:/g, // ternary
  ];

  controlFlowPatterns.forEach((pattern) => {
    const matches = code.match(pattern);
    if (matches) complexity += matches.length;
  });

  return Math.min(complexity, 100);
}

/**
 * Extract imports from code
 */
export function extractImports(code: string, language: string): string[] {
  const imports: string[] = [];

  if (language === "javascript" || language === "typescript") {
    const importRegex = /import\s+.*?\s+from\s+['"](.+?)['"]/g;
    const requireRegex = /require\(['"](.+?)['"]\)/g;

    let match;
    while ((match = importRegex.exec(code)) !== null) {
      imports.push(match[1]);
    }
    while ((match = requireRegex.exec(code)) !== null) {
      imports.push(match[1]);
    }
  } else if (language === "python") {
    const importRegex = /(?:from\s+(\S+)\s+)?import\s+(.+)/g;
    let match;
    while ((match = importRegex.exec(code)) !== null) {
      imports.push(match[1] || match[2].split(",")[0].trim());
    }
  }

  return [...new Set(imports)];
}

/**
 * Validate project name
 */
export function validateProjectName(name: string): {
  valid: boolean;
  error?: string;
} {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: "Project name is required" };
  }

  if (name.length < 3) {
    return {
      valid: false,
      error: "Project name must be at least 3 characters",
    };
  }

  if (name.length > 100) {
    return {
      valid: false,
      error: "Project name must be less than 100 characters",
    };
  }

  if (!/^[a-zA-Z0-9\s\-_]+$/.test(name)) {
    return {
      valid: false,
      error:
        "Project name can only contain letters, numbers, spaces, hyphens, and underscores",
    };
  }

  return { valid: true };
}

/**
 * Validate GitHub URL
 */
export function validateGitHubUrl(url: string): {
  valid: boolean;
  error?: string;
} {
  if (!url || url.trim().length === 0) {
    return { valid: false, error: "GitHub URL is required" };
  }

  const parsed = parseGitHubUrl(url);
  if (!parsed) {
    return { valid: false, error: "Invalid GitHub URL format" };
  }

  return { valid: true };
}

export interface InferredTechStack {
  language: string;
  framework: string;
  technologies: string[];
}

/**
 * Infer the primary language/framework from project files
 */
export function inferProjectTechStack(
  files: Array<{ path?: string; content?: string | null }>,
): InferredTechStack {
  const filePaths = files.map((file) => file.path || "").filter(Boolean);
  const lowerPaths = filePaths.map((path) => path.toLowerCase());
  const contents = files
    .map((file) => file.content || "")
    .filter((content) => content.trim().length > 0)
    .slice(0, 10)
    .join("\n");

  const extensions = new Set(
    filePaths
      .map((path) => path.split(".").pop()?.toLowerCase())
      .filter(Boolean),
  );

  const technologies: string[] = [];
  let language = "JavaScript";
  let framework = "Vanilla JS";

  if (extensions.has("tsx") || extensions.has("ts")) {
    language = "TypeScript";
  } else if (extensions.has("jsx") || extensions.has("js")) {
    language = "JavaScript";
  } else if (extensions.has("py")) {
    language = "Python";
  } else if (extensions.has("java")) {
    language = "Java";
  } else if (extensions.has("go")) {
    language = "Go";
  } else if (extensions.has("rs")) {
    language = "Rust";
  } else if (extensions.has("php")) {
    language = "PHP";
  } else if (extensions.has("rb")) {
    language = "Ruby";
  } else if (extensions.has("swift")) {
    language = "Swift";
  } else if (extensions.has("kt")) {
    language = "Kotlin";
  }

  const hasPackageJson = lowerPaths.some((path) =>
    path.endsWith("package.json"),
  );
  const hasNextConfig = lowerPaths.some((path) => path.includes("next.config"));
  const hasVueFiles = extensions.has("vue");
  const hasReactFiles = extensions.has("tsx") || extensions.has("jsx");
  const hasAngularFiles =
    contents.includes("@angular/") || contents.includes("angular.json");
  const hasDjangoFiles =
    lowerPaths.some((path) => path.includes("manage.py")) ||
    contents.includes("django");
  const hasFlaskFiles = contents.includes("flask");

  if (hasNextConfig || (hasPackageJson && hasReactFiles)) {
    framework = "Next.js";
    technologies.push("React", "Next.js");
  } else if (hasVueFiles) {
    framework = "Vue.js";
    technologies.push("Vue.js");
  } else if (hasAngularFiles) {
    framework = "Angular";
    technologies.push("Angular");
  } else if (hasDjangoFiles) {
    framework = "Django";
    technologies.push("Django");
  } else if (hasFlaskFiles) {
    framework = "Flask";
    technologies.push("Flask");
  } else if (hasPackageJson) {
    framework = hasReactFiles ? "React" : "Node.js";
    technologies.push(hasReactFiles ? "React" : "Node.js");
  } else if (language === "Python") {
    framework = "Python";
    technologies.push("Python");
  } else if (language !== "JavaScript") {
    framework = language;
    technologies.push(language);
  }

  if (language === "TypeScript") technologies.unshift("TypeScript");
  else if (language === "JavaScript") technologies.unshift("JavaScript");

  return {
    language,
    framework,
    technologies: [...new Set(technologies)],
  };
}

/**
 * Get color for file type
 */
export function getFileTypeColor(extension: string): string {
  const colorMap: Record<string, string> = {
    js: "text-yellow-500",
    jsx: "text-yellow-500",
    ts: "text-blue-500",
    tsx: "text-blue-500",
    py: "text-green-500",
    rb: "text-red-500",
    java: "text-orange-500",
    go: "text-cyan-500",
    rs: "text-orange-600",
    php: "text-purple-500",
    html: "text-orange-400",
    css: "text-blue-400",
    json: "text-yellow-600",
    md: "text-gray-500",
  };

  return colorMap[extension] || "text-gray-400";
}

/**
 * Get icon for file type
 */
export function getFileTypeIcon(extension: string): string {
  const iconMap: Record<string, string> = {
    js: "📜",
    jsx: "⚛️",
    ts: "📘",
    tsx: "⚛️",
    py: "🐍",
    rb: "💎",
    java: "☕",
    go: "🐹",
    rs: "🦀",
    php: "🐘",
    html: "🌐",
    css: "🎨",
    json: "📋",
    md: "📝",
    yml: "⚙️",
    yaml: "⚙️",
  };

  return iconMap[extension] || "📄";
}

// Made with Bob
