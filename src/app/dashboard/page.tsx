"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Users,
  Plus,
  Loader2,
  FolderGit2,
  Calendar,
  TrendingUp,
  Trash2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  createdAt: string;
  language: string | null;
  totalFiles: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(
    null,
  );
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    projectId: string;
    projectName: string;
  }>({
    isOpen: false,
    projectId: "",
    projectName: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchProjects();
    }
  }, [status]);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (projectId: string, projectName: string) => {
    setDeleteDialog({
      isOpen: true,
      projectId,
      projectName,
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({
      isOpen: false,
      projectId: "",
      projectName: "",
    });
  };

  const handleDeleteProject = async () => {
    const { projectId } = deleteDialog;
    setDeletingProjectId(projectId);

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      setProjects((current) =>
        current.filter((project) => project.id !== projectId),
      );
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast.error("Failed to delete project");
    } finally {
      setDeletingProjectId(null);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-bold text-xl">
              AI Codebase Autopilot
            </Link>
            <div className="hidden md:flex items-center gap-4 text-sm">
              <Link href="/dashboard" className="text-primary font-medium">
                Dashboard
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {session?.user?.email}
            </span>
            <Link
              href="/upload"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Project
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {session?.user?.name?.split(" ")[0] || "Developer"}!
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose how you want to explore your codebases
          </p>
        </motion.div>

        {/* Mode Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 gap-6 mb-12"
        >
          {/* Developer Mode Card */}
          <div className="glass rounded-2xl p-8 border hover:border-primary/50 transition-all group cursor-pointer">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Code2 className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">👨‍💻 Developer Mode</h2>
            <p className="text-muted-foreground mb-6">
              Deep technical insights, code analysis, and AI-powered development
              tools
            </p>
            <ul className="space-y-2 text-sm mb-6">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>Full codebase explorer</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>Interactive flow visualization</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>AI code chat & analysis</span>
              </li>
            </ul>
            <div className="text-sm text-primary font-medium">
              Best for: Engineers, Developers, Technical Teams →
            </div>
          </div>

          {/* Normal User Mode Card */}
          <div className="glass rounded-2xl p-8 border hover:border-purple-500/50 transition-all group cursor-pointer">
            <div className="w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8 text-purple-500" />
            </div>
            <h2 className="text-2xl font-bold mb-3">👤 Normal User Mode</h2>
            <p className="text-muted-foreground mb-6">
              Simple explanations, feature exploration, and human-friendly
              insights
            </p>
            <ul className="space-y-2 text-sm mb-6">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span>Simple project overview</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span>Feature explorer</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span>Story mode & guided tours</span>
              </li>
            </ul>
            <div className="text-sm text-purple-500 font-medium">
              Best for: Product Managers, Stakeholders, Non-Technical Users →
            </div>
          </div>
        </motion.div>

        {/* Interactive Demo Coming Soon */}

        {/* Projects Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Projects</h2>
            <Link
              href="/upload"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add New
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="glass rounded-2xl p-12 border text-center">
              <FolderGit2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-6">
                Upload your first project to get started with AI-powered code
                analysis
              </p>
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Upload Project
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="glass rounded-xl p-6 border hover:border-primary/50 transition-all group cursor-pointer"
                  onClick={() => router.push(`/dashboard/dev/${project.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FolderGit2 className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          project.status === "COMPLETED"
                            ? "bg-green-500/10 text-green-500"
                            : project.status === "ANALYZING"
                              ? "bg-yellow-500/10 text-yellow-500"
                              : project.status === "FAILED"
                                ? "bg-red-500/10 text-red-500"
                                : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {project.status}
                      </div>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          openDeleteDialog(project.id, project.name);
                        }}
                        disabled={deletingProjectId === project.id}
                        className="p-2 rounded-lg border border-border hover:bg-red-500/10 hover:text-red-500 transition-colors disabled:opacity-50"
                        aria-label={`Delete ${project.name}`}
                      >
                        {deletingProjectId === project.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>

                  {project.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {project.language && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span>{project.language}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {project.totalFiles > 0 && (
                    <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {project.totalFiles} files
                      </span>
                      <span className="text-primary font-medium group-hover:underline">
                        Explore →
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Stats Section */}
        {projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 grid md:grid-cols-3 gap-6"
          >
            <div className="glass rounded-xl p-6 border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Total Projects
                </span>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div className="text-3xl font-bold">{projects.length}</div>
            </div>
            <div className="glass rounded-xl p-6 border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Analyzed</span>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-3xl font-bold">
                {projects.filter((p) => p.status === "COMPLETED").length}
              </div>
            </div>
            <div className="glass rounded-xl p-6 border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Total Files
                </span>
                <TrendingUp className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-3xl font-bold">
                {projects.reduce((sum, p) => sum + p.totalFiles, 0)}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialog.isOpen && (
        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          onClose={closeDeleteDialog}
          onConfirm={handleDeleteProject}
          title="Delete Project?"
          message={`Are you sure you want to delete "${deleteDialog.projectName}"? This will permanently remove the project and all of its analysis data, files, and chat history. This action cannot be undone.`}
          confirmText="Delete Project"
          cancelText="Cancel"
          variant="danger"
        />
      )}
    </div>
  );
}
