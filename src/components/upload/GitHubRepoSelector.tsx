"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Star,
  GitFork,
  Clock,
  Loader2,
  CheckCircle2,
  Github,
} from "lucide-react";
import { toast } from "sonner";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  private: boolean;
}
interface GitHubRepoSelectorProps {
  onSelect: (repoUrl: string) => void;
  selectedUrl?: string;
}

export default function GitHubRepoSelector({
  onSelect,
  selectedUrl,
}: GitHubRepoSelectorProps) {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<string | null>(
    selectedUrl || null,
  );

  useEffect(() => {
    fetchUserRepos();
  }, []);

  useEffect(() => {
    setSelectedRepo(selectedUrl || null);
  }, [selectedUrl]);

  const fetchUserRepos = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/github/repos");

      if (!response.ok) {
        throw new Error("Failed to fetch repositories");
      }

      const data = await response.json();
      setRepos(data.repos || []);
    } catch (error) {
      console.error("Failed to fetch repos:", error);
      toast.error("Failed to load your GitHub repositories");
    } finally {
      setLoading(false);
    }
  };

  const filteredRepos = repos.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelectRepo = (repo: Repository) => {
    setSelectedRepo(repo.html_url);
    onSelect(repo.html_url);
    toast.success(`Selected: ${repo.name}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">
            Loading your repositories...
          </p>
        </div>
      </div>
    );
  }

  if (repos.length === 0) {
    return (
      <div className="text-center py-12">
        <Github className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No Repositories Found</h3>
        <p className="text-sm text-muted-foreground mb-4">
          We couldn't find any repositories in your GitHub account.
        </p>
        <p className="text-xs text-muted-foreground">
          Make sure you've authorized access to your repositories.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search your repositories..."
          className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Repository List */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        <AnimatePresence>
          {filteredRepos.map((repo) => (
            <motion.div
              key={repo.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                selectedRepo === repo.html_url
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              }`}
              onClick={() => handleSelectRepo(repo)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold truncate">{repo.name}</h3>
                    {repo.private && (
                      <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-600 dark:text-yellow-500">
                        Private
                      </span>
                    )}
                    {selectedRepo === repo.html_url && (
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                  </div>

                  {repo.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {repo.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {repo.language && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span>{repo.language}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      <span>{repo.stargazers_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="w-3 h-3" />
                      <span>{repo.forks_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(repo.updated_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredRepos.length === 0 && searchQuery && (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              No repositories match "{searchQuery}"
            </p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
        <span>
          {filteredRepos.length} of {repos.length} repositories
        </span>
        {selectedRepo && (
          <span className="text-primary font-medium">Repository selected</span>
        )}
      </div>
    </div>
  );
}
