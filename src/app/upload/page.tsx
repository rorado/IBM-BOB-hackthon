"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Upload,
  Github,
  FileArchive,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  FolderGit2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import GitHubRepoSelector from "@/components/upload/GitHubRepoSelector";

export default function UploadPage() {
  const router = useRouter();
  const [uploadType, setUploadType] = useState<
    "github" | "github-browse" | "zip"
  >("github");
  const [githubUrl, setGithubUrl] = useState("");
  const [selectedGithubRepoUrl, setSelectedGithubRepoUrl] = useState("");
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleGitHubUpload = async (url?: string) => {
    const repoUrl = (url || githubUrl).trim();

    if (!repoUrl.trim()) {
      toast.error("Please enter a GitHub URL");
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 300);

      const response = await fetch("/api/projects/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceType: "GITHUB",
          githubUrl: repoUrl,
        }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      toast.success("Repository uploaded successfully!");

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push(`/dashboard/dev/${data.projectId}`);
      }, 1000);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload repository");
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleRepoSelect = (repoUrl: string) => {
    setSelectedGithubRepoUrl(repoUrl);
  };

  const handleZipUpload = async () => {
    if (!zipFile) {
      toast.error("Please select a ZIP file");
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", zipFile);
      formData.append("sourceType", "ZIP");

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 300);

      const response = await fetch("/api/projects/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      toast.success("ZIP file uploaded successfully!");

      setTimeout(() => {
        router.push(`/dashboard/dev/${data.projectId}`);
      }, 1000);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload ZIP file");
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/zip" && !file.name.endsWith(".zip")) {
        toast.error("Please select a valid ZIP file");
        return;
      }
      setZipFile(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-lg">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Upload Your Project</h1>
          <p className="text-xl text-muted-foreground">
            Choose how you'd like to upload your codebase
          </p>
        </motion.div>

        {/* Upload Type Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <button
            onClick={() => setUploadType("github")}
            className={`p-6 rounded-xl border-2 transition-all ${
              uploadType === "github"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <Github className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-1">GitHub URL</h3>
            <p className="text-sm text-muted-foreground">
              Paste a repository URL
            </p>
          </button>

          <button
            onClick={() => setUploadType("github-browse")}
            className={`p-6 rounded-xl border-2 transition-all ${
              uploadType === "github-browse"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <FolderGit2 className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-1">Browse Repos</h3>
            <p className="text-sm text-muted-foreground">
              Select from your GitHub
            </p>
          </button>

          <button
            onClick={() => setUploadType("zip")}
            className={`p-6 rounded-xl border-2 transition-all ${
              uploadType === "zip"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <FileArchive className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-1">ZIP File</h3>
            <p className="text-sm text-muted-foreground">
              Upload a ZIP archive
            </p>
          </button>
        </motion.div>

        {/* Upload Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-8 border"
        >
          {uploadType === "github" ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username/repository"
                  className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={uploading}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Example: https://github.com/vercel/next.js
                </p>
              </div>

              {uploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={() => handleGitHubUpload()}
                disabled={uploading || !githubUrl.trim()}
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : progress === 100 ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Complete!
                  </>
                ) : (
                  <>
                    <Github className="w-5 h-5" />
                    Upload from GitHub
                  </>
                )}
              </button>
            </div>
          ) : uploadType === "github-browse" ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select a Repository
                </label>
                <GitHubRepoSelector
                  onSelect={handleRepoSelect}
                  selectedUrl={selectedGithubRepoUrl}
                />
              </div>

              {selectedGithubRepoUrl && (
                <div className="rounded-lg border bg-primary/5 p-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Selected repository</p>
                    <p className="text-xs text-muted-foreground break-all mt-1">
                      {selectedGithubRepoUrl}
                    </p>
                  </div>
                  <button
                    onClick={() => handleGitHubUpload(selectedGithubRepoUrl)}
                    disabled={uploading}
                    className="shrink-0 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Github className="w-4 h-4" />
                        Upload selected repository
                      </>
                    )}
                  </button>
                </div>
              )}

              {uploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}

              {!selectedGithubRepoUrl && (
                <p className="text-sm text-muted-foreground">
                  Pick a repository first, then click Upload selected
                  repository.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  ZIP File
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    accept=".zip"
                    onChange={handleFileChange}
                    className="hidden"
                    id="zip-upload"
                    disabled={uploading}
                  />
                  <label htmlFor="zip-upload" className="cursor-pointer block">
                    <FileArchive className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    {zipFile ? (
                      <div>
                        <p className="font-medium">{zipFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(zipFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium mb-1">
                          Click to select a ZIP file
                        </p>
                        <p className="text-sm text-muted-foreground">
                          or drag and drop
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {uploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleZipUpload}
                disabled={uploading || !zipFile}
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : progress === 100 ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Complete!
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload ZIP File
                  </>
                )}
              </button>
            </div>
          )}

          {/* Info */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2 text-sm">What happens next?</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">1.</span>
                <span>Your code is securely uploaded</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">2.</span>
                <span>IBM Bob AI analyzes the architecture</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">3.</span>
                <span>Interactive dashboard is generated</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">4.</span>
                <span>You can explore in Developer or Normal mode</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
