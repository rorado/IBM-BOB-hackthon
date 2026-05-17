"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Code2,
  FolderTree,
  MessageSquare,
  GitBranch,
  Bug,
  Sparkles,
  ArrowLeft,
  Loader2,
  Settings,
  ThumbsUp,
  AlertTriangle,
  Lightbulb,
  Boxes,
  CheckCircle2,
  ZapOff,
} from "lucide-react";
import Link from "next/link";
import ChatInterface from "@/components/chat/ChatInterface";
import FileExplorer from "@/components/explorer/FileExplorer";
import CodeViewer from "@/components/explorer/CodeViewer";
import CodeFlowCanvas from "@/components/flow/CodeFlowCanvas";

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  language: string | null;
  framework: string | null;
  totalFiles: number;
  totalLines: number;
  analysisResult?: any;
  featureModules?: any[];
  codeFlowGraphs?: any[];
  fileNodes?: any[];
  githubUrl?: string | null;
}

const inferLanguageFromNodes = (nodes: any[]) => {
  const files = nodes.filter((n) => n.type === "FILE");
  const counts: Record<string, number> = {
    TypeScript: 0,
    JavaScript: 0,
    Python: 0,
    Java: 0,
    Go: 0,
    Rust: 0,
    PHP: 0,
    CSharp: 0,
  };

  for (const file of files) {
    const path = String(file.path || "").toLowerCase();
    if (path.endsWith(".ts") || path.endsWith(".tsx")) counts.TypeScript += 1;
    else if (path.endsWith(".js") || path.endsWith(".jsx"))
      counts.JavaScript += 1;
    else if (path.endsWith(".py")) counts.Python += 1;
    else if (path.endsWith(".java")) counts.Java += 1;
    else if (path.endsWith(".go")) counts.Go += 1;
    else if (path.endsWith(".rs")) counts.Rust += 1;
    else if (path.endsWith(".php")) counts.PHP += 1;
    else if (path.endsWith(".cs")) counts.CSharp += 1;
  }

  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return top && top[1] > 0 ? top[0] : null;
};

const inferFrameworkFromNodes = (nodes: any[]) => {
  const paths = nodes.map((n) => String(n.path || "").toLowerCase());

  if (
    paths.some(
      (p) =>
        p === "next.config.js" ||
        p === "next.config.mjs" ||
        p.includes("/app/layout.") ||
        p.includes("/pages/_app."),
    )
  ) {
    return "Next.js";
  }
  if (paths.some((p) => p.includes("nuxt.config"))) return "Nuxt";
  if (paths.some((p) => p.includes("angular.json"))) return "Angular";
  if (paths.some((p) => p.includes("svelte.config"))) return "SvelteKit";
  if (paths.some((p) => p.includes("manage.py"))) return "Django";
  if (paths.some((p) => p.includes("pom.xml") || p.includes("build.gradle")))
    return "Spring";

  return null;
};

export default function DeveloperModePage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "explorer" | "flows" | "chat" | "bugs"
  >("explorer");
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [flows, setFlows] = useState<any[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<any>(null);
  const [aiQuestion, setAiQuestion] = useState<string>("");
  const [chatContext, setChatContext] = useState<string>("");
  const [chatKey, setChatKey] = useState<number>(0);
  const [bugAnalysis, setBugAnalysis] = useState<any>(null);
  const [analyzingBugs, setAnalyzingBugs] = useState(false);
  const autoAnalysisStarted = useRef(false);
  const autoGithubLoaded = useRef(false);
  const [autoLoadingGithubFiles, setAutoLoadingGithubFiles] = useState(false);

  const projectInfo = useMemo(() => {
    const nodes = project?.fileNodes || [];
    const computedFiles = nodes.filter((n: any) => n.type === "FILE").length;
    const computedLines = nodes.reduce((acc: number, n: any) => {
      if (n.type !== "FILE") return acc;
      if (typeof n.lines === "number" && n.lines > 0) return acc + n.lines;
      if (typeof n.content === "string")
        return acc + n.content.split("\n").length;
      return acc;
    }, 0);

    const totalFiles =
      computedFiles > 0 ? computedFiles : project?.totalFiles || 0;
    const totalLines =
      computedLines > 0 ? computedLines : project?.totalLines || 0;

    return {
      totalFiles,
      totalLines,
      language:
        project?.language || inferLanguageFromNodes(nodes) || "TypeScript",
      framework:
        project?.framework || inferFrameworkFromNodes(nodes) || "Next.js",
      flowCount: project?.codeFlowGraphs?.length || 0,
    };
  }, [project]);

  useEffect(() => {
    autoAnalysisStarted.current = false;
    autoGithubLoaded.current = false;
    setAutoLoadingGithubFiles(false);
    setLoading(true);
    setProject(null);
    setFiles([]);
    setSelectedFile(null);
    setFlows([]);
    setSelectedFlow(null);
    setAiQuestion("");
    setChatContext("");
    setChatKey(0);
    setBugAnalysis(null);
    setAnalyzingBugs(false);
    setActiveTab("explorer");

    fetchProject();
  }, [projectId]);

  useEffect(() => {
    if (project?.codeFlowGraphs && project.codeFlowGraphs.length > 0) {
      setSelectedFlow(
        (current: any) => current || project.codeFlowGraphs?.[0] || null,
      );
    }
  }, [project?.codeFlowGraphs]);

  useEffect(() => {
    const autoLoadGithubFiles = async () => {
      if (
        !project?.githubUrl ||
        autoGithubLoaded.current ||
        files.length > 0 ||
        autoLoadingGithubFiles
      ) {
        return;
      }

      autoGithubLoaded.current = true;
      setAutoLoadingGithubFiles(true);

      try {
        const res = await fetch("/api/github/repos/tree", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ githubUrl: project.githubUrl }),
        });

        if (!res.ok) {
          throw new Error("Failed to auto-load GitHub files");
        }

        const data = await res.json();
        const loadedFiles = Array.isArray(data.files) ? data.files : [];

        if (loadedFiles.length === 0) {
          return;
        }

        const tree = buildFileTree(loadedFiles);
        setFiles(tree);

        const totalFiles = loadedFiles.filter(
          (file: any) => file.type === "FILE",
        ).length;
        const totalLines = loadedFiles.reduce(
          (sum: number, file: any) =>
            sum +
            (typeof file.content === "string"
              ? file.content.split("\n").length
              : 0),
          0,
        );

        setProject((prev) =>
          prev
            ? {
                ...prev,
                fileNodes: loadedFiles,
                totalFiles,
                totalLines,
              }
            : prev,
        );
      } catch (error) {
        console.error("Auto-load from GitHub failed:", error);
      } finally {
        setAutoLoadingGithubFiles(false);
      }
    };

    void autoLoadGithubFiles();
  }, [project, files.length, autoLoadingGithubFiles]);

  useEffect(() => {
    if (
      !project ||
      autoAnalysisStarted.current ||
      bugAnalysis ||
      analyzingBugs ||
      project.status === "FAILED"
    ) {
      return;
    }

    if (project.analysisResult) {
      setBugAnalysis(project.analysisResult);
      return;
    }

    if (
      project.status === "COMPLETED" ||
      project.status === "PENDING" ||
      project.status === "ANALYZING"
    ) {
      autoAnalysisStarted.current = true;
      setActiveTab("bugs");
      void analyzeBugs();
    }
  }, [project, bugAnalysis, analyzingBugs]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data.project);

        // Fetch files if available
        if (data.project.fileNodes) {
          setFiles(buildFileTree(data.project.fileNodes));
        }

        // Fetch flows if available
        if (data.project.codeFlowGraphs) {
          setFlows(data.project.codeFlowGraphs);
          if (data.project.codeFlowGraphs.length > 0) {
            setSelectedFlow(data.project.codeFlowGraphs[0]);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch project:", error);
    } finally {
      setLoading(false);
    }
  };

  const buildFileTree = (fileNodes: any[]) => {
    // Build hierarchical tree from flat file list
    const root: any[] = [];
    const pathMap = new Map<string, any>();

    // Sort by path to ensure parents come before children
    const sortedNodes = [...fileNodes].sort((a, b) =>
      a.path.localeCompare(b.path),
    );

    sortedNodes.forEach((node: any) => {
      const pathParts = node.path.split("/").filter(Boolean);

      // Create the node object
      const treeNode = {
        id: node.id,
        name: node.name,
        path: node.path,
        type: node.type,
        extension: node.extension,
        size: node.size,
        content: node.content,
        children: node.type === "DIRECTORY" ? [] : undefined,
      };

      // Store in map for quick lookup
      pathMap.set(node.path, treeNode);

      // If it's a root level item (no parent path)
      if (pathParts.length === 1) {
        root.push(treeNode);
      } else {
        // Find parent path
        const parentPath = pathParts.slice(0, -1).join("/");
        const parent = pathMap.get(parentPath);

        if (parent && parent.children) {
          parent.children.push(treeNode);
        } else {
          // If parent doesn't exist yet, create it
          const parentName = pathParts[pathParts.length - 2];
          const parentNode = {
            id: `dir-${parentPath}`,
            name: parentName,
            path: parentPath,
            type: "DIRECTORY" as const,
            children: [treeNode],
          };
          pathMap.set(parentPath, parentNode);

          // Check if this parent should be at root or has its own parent
          if (pathParts.length === 2) {
            root.push(parentNode);
          }
        }
      }
    });

    return root;
  };

  const handleFileSelect = (file: any) => {
    setSelectedFile(file);
  };

  const handleAskAI = (question: string) => {
    // Build context with file information
    let context = "";
    if (selectedFile) {
      context = `File: ${selectedFile.path}\n\nContent:\n${selectedFile.content}`;
    }

    setChatContext(context);
    setAiQuestion(question);
    setChatKey((prev) => prev + 1); // Force ChatInterface to re-mount with new question
    setActiveTab("chat");
  };

  const analyzeBugs = async () => {
    setAnalyzingBugs(true);
    try {
      const current = await fetch(`/api/projects/${projectId}`);
      if (current.ok) {
        const currentData = await current.json();
        const currentProject = currentData.project;
        if (
          currentProject?.analysisResult &&
          currentProject?.status !== "ANALYZING"
        ) {
          setProject(currentProject);
          setBugAnalysis(currentProject.analysisResult);
          setActiveTab("bugs");
          return;
        }
      }

      // Trigger server-side analysis
      const trigger = await fetch("/api/analysis/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      if (!trigger.ok) {
        throw new Error("Failed to start analysis");
      }

      // Poll project until status changes from ANALYZING
      const poll = async (attempt = 0): Promise<void> => {
        if (attempt >= 20) {
          setBugAnalysis(
            "Analysis is still running. Refresh the page in a moment to see completed results.",
          );
          return;
        }

        const res = await fetch(`/api/projects/${projectId}`);
        if (!res.ok) throw new Error("Failed to fetch project status");
        const data = await res.json();
        const proj = data.project;
        setProject(proj);

        if (proj.status === "ANALYZING" || !proj.analysisResult) {
          await new Promise((r) => setTimeout(r, 2500));
          return poll(attempt + 1);
        }

        // Finished — show structured analysis if available
        if (proj.analysisResult) {
          setBugAnalysis(proj.analysisResult);
          setActiveTab("bugs");
        } else {
          setBugAnalysis(
            "Analysis completed but no structured results were produced.",
          );
        }
      };

      await poll();
    } catch (error) {
      console.error("Bug analysis failed:", error);
      setBugAnalysis("Analysis failed. See logs.");
    } finally {
      setAnalyzingBugs(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Project not found</h2>
          <Link href="/dashboard" className="text-primary hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Code2 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h1 className="font-semibold">{project.name}</h1>
                <p className="text-xs text-muted-foreground">Developer Mode</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/user/${projectId}`}
              className="px-3 py-1.5 text-sm border rounded-lg hover:bg-muted transition-colors"
            >
              Switch to Normal Mode
            </Link>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-muted/30 overflow-y-auto">
          <div className="p-4 space-y-2">
            <button
              onClick={() => setActiveTab("explorer")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                activeTab === "explorer"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span className="text-sm font-medium">File Explorer</span>
            </button>

            <button
              onClick={() => setActiveTab("flows")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                activeTab === "flows"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <GitBranch className="w-4 h-4" />
              <span className="text-sm font-medium">Code Flows</span>
            </button>

            <button
              onClick={() => setActiveTab("chat")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                activeTab === "chat"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium">AI Chat</span>
            </button>

            <button
              onClick={() => setActiveTab("bugs")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                activeTab === "bugs"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <Bug className="w-4 h-4" />
              <span className="text-sm font-medium">Bug Detection</span>
            </button>
          </div>

          {/* Project Stats */}
          <div className="p-4 border-t mt-4">
            <h3 className="text-xs font-semibold text-muted-foreground mb-3">
              PROJECT INFO
            </h3>
            <div className="space-y-2 text-sm">
              {projectInfo.language && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Language</span>
                  <span className="font-medium">{projectInfo.language}</span>
                </div>
              )}
              {projectInfo.framework && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Framework</span>
                  <span className="font-medium">{projectInfo.framework}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Files</span>
                <span className="font-medium">{projectInfo.totalFiles}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Lines</span>
                <span className="font-medium">
                  {projectInfo.totalLines.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Panel */}
        <main className="flex-1 overflow-hidden flex">
          {activeTab === "explorer" && (
            <div className="flex-1 flex">
              <div className="w-80 border-r overflow-y-auto">
                {files.length > 0 ? (
                  <FileExplorer
                    files={files}
                    onFileSelect={handleFileSelect}
                    selectedFile={selectedFile?.id}
                  />
                ) : (
                  <div className="p-8 text-center">
                    <FolderTree className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-4">
                      No files available yet
                    </p>
                    {project.githubUrl && autoLoadingGithubFiles ? (
                      <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Auto loading files from GitHub...
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
              <div className="flex-1">
                {selectedFile ? (
                  <CodeViewer file={selectedFile} onAskAI={handleAskAI} />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Code2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Select a file to view
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "flows" && (
            <div className="flex-1">
              {selectedFlow ? (
                <CodeFlowCanvas flowData={selectedFlow} />
              ) : (
                <div className="h-full flex items-center justify-center px-6">
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-2xl glass rounded-2xl border p-8"
                  >
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Loader2 className="w-7 h-7 text-primary animate-spin" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 rounded bg-muted/60 animate-pulse" />
                      <div className="h-4 rounded bg-muted/50 animate-pulse w-11/12" />
                      <div className="h-4 rounded bg-muted/40 animate-pulse w-10/12" />
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          )}

          {activeTab === "chat" && (
            <div className="flex-1">
              <ChatInterface
                key={chatKey}
                projectId={projectId}
                mode="developer"
                initialQuestion={aiQuestion}
                context={chatContext}
              />
            </div>
          )}

          {activeTab === "bugs" && (
            <div className="flex-1 p-6 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Bug Detection</h2>
                    <p className="text-muted-foreground">
                      AI-powered analysis runs automatically in the background
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm">
                    <Loader2
                      className={`w-4 h-4 ${analyzingBugs ? "animate-spin" : ""}`}
                    />
                    {analyzingBugs ? "Processing" : "Auto Mode"}
                  </div>
                </div>

                {!bugAnalysis && !analyzingBugs && (
                  <div className="glass rounded-xl p-8 border text-center">
                    <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
                    <p className="text-muted-foreground">
                      Waiting for automatic analysis results...
                    </p>
                  </div>
                )}

                {analyzingBugs && (
                  <div className="glass rounded-xl p-8 border text-center">
                    <Loader2 className="w-16 h-16 mx-auto mb-4 text-primary animate-spin" />
                    <h3 className="text-xl font-semibold mb-2">
                      Analyzing Your Code...
                    </h3>
                    <p className="text-muted-foreground">
                      IBM Bob AI is reviewing your project files for potential
                      issues
                    </p>
                  </div>
                )}

                {bugAnalysis && !analyzingBugs && (
                  <div className="space-y-6">
                    {/* Header Section */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold">Analysis Results</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          AI-powered insights on your codebase
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setBugAnalysis(null)}
                          className="px-4 py-2 text-sm font-medium rounded-lg border hover:bg-muted transition-colors"
                        >
                          Clear
                        </button>
                        <button
                          onClick={() => fetchProject()}
                          className="px-4 py-2 text-sm font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                        >
                          Refresh
                        </button>
                      </div>
                    </div>

                    {typeof bugAnalysis === "string" ? (
                      <div className="glass rounded-xl p-6 border">
                        <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                          {bugAnalysis}
                        </pre>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Summary */}
                        {bugAnalysis.summary && (
                          <motion.div
                            className="glass rounded-xl p-6 border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <p className="text-sm leading-relaxed">
                              {bugAnalysis.summary}
                            </p>
                          </motion.div>
                        )}

                        {/* Metrics Cards */}
                        <div className="grid grid-cols-4 gap-4">
                          {typeof bugAnalysis.codeQuality === "number" && (
                            <motion.div
                              className={`glass rounded-lg p-4 border transition-all hover:shadow-lg ${
                                bugAnalysis.codeQuality >= 80
                                  ? "border-green-500/30 bg-gradient-to-br from-green-500/10 to-transparent"
                                  : bugAnalysis.codeQuality >= 60
                                    ? "border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-transparent"
                                    : "border-red-500/30 bg-gradient-to-br from-red-500/10 to-transparent"
                              }`}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.05 }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-xs font-semibold text-muted-foreground">
                                  Code Quality
                                </div>
                                {bugAnalysis.codeQuality >= 80 ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                ) : bugAnalysis.codeQuality >= 60 ? (
                                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                ) : (
                                  <ZapOff className="w-4 h-4 text-red-600" />
                                )}
                              </div>
                              <div className="text-2xl font-bold">
                                {bugAnalysis.codeQuality}
                              </div>
                              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    bugAnalysis.codeQuality >= 80
                                      ? "bg-green-500"
                                      : bugAnalysis.codeQuality >= 60
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                  }`}
                                  style={{
                                    width: `${bugAnalysis.codeQuality}%`,
                                  }}
                                />
                              </div>
                            </motion.div>
                          )}
                          {typeof bugAnalysis.maintainability === "number" && (
                            <motion.div
                              className={`glass rounded-lg p-4 border transition-all hover:shadow-lg ${
                                bugAnalysis.maintainability >= 80
                                  ? "border-green-500/30 bg-gradient-to-br from-green-500/10 to-transparent"
                                  : bugAnalysis.maintainability >= 60
                                    ? "border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-transparent"
                                    : "border-red-500/30 bg-gradient-to-br from-red-500/10 to-transparent"
                              }`}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.1 }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-xs font-semibold text-muted-foreground">
                                  Maintainability
                                </div>
                                {bugAnalysis.maintainability >= 80 ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                ) : bugAnalysis.maintainability >= 60 ? (
                                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                ) : (
                                  <ZapOff className="w-4 h-4 text-red-600" />
                                )}
                              </div>
                              <div className="text-2xl font-bold">
                                {bugAnalysis.maintainability}
                              </div>
                              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    bugAnalysis.maintainability >= 80
                                      ? "bg-green-500"
                                      : bugAnalysis.maintainability >= 60
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                  }`}
                                  style={{
                                    width: `${bugAnalysis.maintainability}%`,
                                  }}
                                />
                              </div>
                            </motion.div>
                          )}
                          <motion.div
                            className="glass rounded-lg p-4 border hover:shadow-lg transition-all"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.15 }}
                          >
                            <div className="text-xs font-semibold text-muted-foreground mb-2">
                              Total Files
                            </div>
                            <div className="text-2xl font-bold">
                              {projectInfo.totalFiles}
                            </div>
                            <div className="text-xs text-muted-foreground mt-2">
                              analyzed ✓
                            </div>
                          </motion.div>
                          <motion.div
                            className="glass rounded-lg p-4 border hover:shadow-lg transition-all"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                          >
                            <div className="text-xs font-semibold text-muted-foreground mb-2">
                              Code Flows
                            </div>
                            <div className="text-2xl font-bold">
                              {projectInfo.flowCount}
                            </div>
                            <div className="text-xs text-muted-foreground mt-2">
                              detected
                            </div>
                          </motion.div>
                        </div>

                        {/* Strengths */}
                        {bugAnalysis.strengths &&
                          bugAnalysis.strengths.length > 0 && (
                            <motion.div
                              className="glass rounded-xl p-6 border border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.25 }}
                            >
                              <div className="flex items-center gap-2 mb-4">
                                <ThumbsUp className="w-5 h-5 text-green-600" />
                                <h4 className="font-semibold text-lg text-green-700 dark:text-green-400">
                                  Strengths
                                </h4>
                                <span className="ml-auto text-xs bg-green-500/10 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                                  {bugAnalysis.strengths.length} item
                                  {bugAnalysis.strengths.length !== 1
                                    ? "s"
                                    : ""}
                                </span>
                              </div>
                              <ul className="space-y-2">
                                {bugAnalysis.strengths.map(
                                  (s: any, i: number) => (
                                    <li
                                      key={i}
                                      className="flex gap-3 text-sm items-start"
                                    >
                                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                      <span className="leading-relaxed">
                                        {s}
                                      </span>
                                    </li>
                                  ),
                                )}
                              </ul>
                            </motion.div>
                          )}

                        {/* Weaknesses */}
                        {bugAnalysis.weaknesses &&
                          bugAnalysis.weaknesses.length > 0 && (
                            <motion.div
                              className="glass rounded-xl p-6 border border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.3 }}
                            >
                              <div className="flex items-center gap-2 mb-4">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                                <h4 className="font-semibold text-lg text-red-700 dark:text-red-400">
                                  Areas for Improvement
                                </h4>
                                <span className="ml-auto text-xs bg-red-500/10 text-red-700 dark:text-red-400 px-2 py-1 rounded-full">
                                  {bugAnalysis.weaknesses.length} item
                                  {bugAnalysis.weaknesses.length !== 1
                                    ? "s"
                                    : ""}
                                </span>
                              </div>
                              <ul className="space-y-2">
                                {bugAnalysis.weaknesses.map(
                                  (w: any, i: number) => (
                                    <li
                                      key={i}
                                      className="flex gap-3 text-sm items-start"
                                    >
                                      <ZapOff className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                      <span className="leading-relaxed">
                                        {w}
                                      </span>
                                    </li>
                                  ),
                                )}
                              </ul>
                            </motion.div>
                          )}

                        {/* Suggestions */}
                        {bugAnalysis.suggestions &&
                          bugAnalysis.suggestions.length > 0 && (
                            <motion.div
                              className="glass rounded-xl p-6 border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.35 }}
                            >
                              <div className="flex items-center gap-2 mb-4">
                                <Lightbulb className="w-5 h-5 text-blue-600" />
                                <h4 className="font-semibold text-lg text-blue-700 dark:text-blue-400">
                                  Suggestions
                                </h4>
                                <span className="ml-auto text-xs bg-blue-500/10 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full">
                                  {bugAnalysis.suggestions.length} suggestion
                                  {bugAnalysis.suggestions.length !== 1
                                    ? "s"
                                    : ""}
                                </span>
                              </div>
                              <ol className="space-y-2">
                                {bugAnalysis.suggestions.map(
                                  (s: any, i: number) => (
                                    <li
                                      key={i}
                                      className="flex gap-3 text-sm items-start"
                                    >
                                      <span className="font-bold text-blue-600 flex-shrink-0">
                                        {i + 1}.
                                      </span>
                                      <span className="leading-relaxed">
                                        {s}
                                      </span>
                                    </li>
                                  ),
                                )}
                              </ol>
                            </motion.div>
                          )}

                        {/* Features */}
                        {project.featureModules &&
                          project.featureModules.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.4 }}
                            >
                              <div className="flex items-center gap-2 mb-4">
                                <Boxes className="w-5 h-5 text-primary" />
                                <h4 className="font-semibold text-lg">
                                  Detected Modules
                                </h4>
                                <span className="ml-auto text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                                  {project.featureModules.length} found
                                </span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {project.featureModules.map(
                                  (fm: any, idx: number) => (
                                    <motion.div
                                      key={fm.id}
                                      className="glass rounded-lg p-5 border hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group"
                                      whileHover={{ y: -2 }}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{
                                        duration: 0.3,
                                        delay: 0.4 + idx * 0.05,
                                      }}
                                    >
                                      <div className="flex items-start justify-between mb-3">
                                        <div>
                                          <h5 className="font-semibold leading-tight group-hover:text-primary transition-colors">
                                            {fm.name}
                                          </h5>
                                          <p className="text-xs text-muted-foreground mt-1">
                                            Module
                                          </p>
                                        </div>
                                        <span
                                          className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
                                            fm.importance >= 8
                                              ? "bg-red-500/20 text-red-700 dark:text-red-400"
                                              : fm.importance >= 5
                                                ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                                                : "bg-green-500/20 text-green-700 dark:text-green-400"
                                          }`}
                                        >
                                          ★ {fm.importance}/10
                                        </span>
                                      </div>
                                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                                        {fm.description}
                                      </p>
                                      {fm.files && fm.files.length > 0 && (
                                        <details className="group/details text-xs">
                                          <summary className="cursor-pointer font-medium text-primary hover:underline transition-colors">
                                            📄 {fm.files.length} file
                                            {fm.files.length !== 1
                                              ? "s"
                                              : ""}{" "}
                                            involved
                                          </summary>
                                          <ul className="mt-2 space-y-1 text-muted-foreground pl-3 border-l border-muted">
                                            {fm.files.map(
                                              (f: string, i: number) => (
                                                <li
                                                  key={i}
                                                  className="truncate hover:text-foreground"
                                                  title={f}
                                                >
                                                  {f}
                                                </li>
                                              ),
                                            )}
                                          </ul>
                                        </details>
                                      )}
                                    </motion.div>
                                  ),
                                )}
                              </div>
                            </motion.div>
                          )}

                        {/* Code Flows */}
                        {project.codeFlowGraphs &&
                          project.codeFlowGraphs.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.45 }}
                            >
                              <div className="flex items-center gap-2 mb-4">
                                <GitBranch className="w-5 h-5 text-primary" />
                                <h4 className="font-semibold text-lg">
                                  Code Flows
                                </h4>
                                <span className="ml-auto text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                                  {project.codeFlowGraphs.length} flow
                                  {project.codeFlowGraphs.length !== 1
                                    ? "s"
                                    : ""}
                                </span>
                              </div>
                              <div className="space-y-2">
                                {project.codeFlowGraphs.map(
                                  (f: any, idx: number) => (
                                    <motion.div
                                      key={f.id}
                                      className="glass rounded-lg p-4 border hover:border-primary/50 hover:shadow-lg transition-all flex items-center justify-between group cursor-pointer"
                                      whileHover={{ x: 4 }}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{
                                        duration: 0.3,
                                        delay: 0.45 + idx * 0.03,
                                      }}
                                    >
                                      <div className="flex items-center gap-3 flex-1">
                                        <div
                                          className={`w-2.5 h-2.5 rounded-full ${
                                            f.type === "AUTH"
                                              ? "bg-purple-500"
                                              : f.type === "DATA"
                                                ? "bg-blue-500"
                                                : f.type === "REQUEST"
                                                  ? "bg-orange-500"
                                                  : f.type === "ERROR"
                                                    ? "bg-red-500"
                                                    : "bg-gray-500"
                                          }`}
                                        />
                                        <div className="flex-1 min-w-0">
                                          <div className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                                            {f.name}
                                          </div>
                                          <div className="text-xs text-muted-foreground mt-0.5">
                                            {f.type} Flow
                                          </div>
                                        </div>
                                      </div>
                                      {f.complexity && (
                                        <span className="text-xs font-mono bg-muted/60 px-2.5 py-1 rounded ml-2 whitespace-nowrap">
                                          {f.complexity}
                                        </span>
                                      )}
                                    </motion.div>
                                  ),
                                )}
                              </div>
                            </motion.div>
                          )}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
