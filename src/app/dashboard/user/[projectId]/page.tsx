"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users,
  ArrowLeft,
  Loader2,
  Sparkles,
  BookOpen,
  Lightbulb,
  Play,
  Code2,
} from "lucide-react";
import Link from "next/link";
import FeatureCard from "@/components/features/FeatureCard";
import ChatInterface from "@/components/chat/ChatInterface";

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  language: string | null;
  framework: string | null;
}

export default function NormalUserModePage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [features, setFeatures] = useState<any[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [activeView, setActiveView] = useState<
    "overview" | "features" | "story" | "tour"
  >("overview");
  const [storyContent, setStoryContent] = useState<string | null>(null);
  const [storyLoading, setStoryLoading] = useState(false);
  const [tourContent, setTourContent] = useState<string | null>(null);
  const [tourLoading, setTourLoading] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  // Auto-generate story when Story Mode is activated
  useEffect(() => {
    if (activeView === "story" && !storyContent && !storyLoading) {
      generateStory();
    }
  }, [activeView]);

  // Auto-generate tour when Guided Tour is activated
  useEffect(() => {
    if (activeView === "tour" && !tourContent && !tourLoading) {
      generateTour();
    }
  }, [activeView]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data.project);

        // Fetch features if available
        if (data.project.featureModules) {
          setFeatures(data.project.featureModules);
        }
      }
    } catch (error) {
      console.error("Failed to fetch project:", error);
    } finally {
      setLoading(false);
    }
  };

  const buildStoryContent = () => {
    const projectName = project?.name || "this project";
    const projectLanguage = project?.language || "JavaScript";
    const projectFramework = project?.framework || "Vanilla JS";
    const featureSummary =
      features.length > 0
        ? `${features.length} featured capabilities are already available`
        : "the core experience is still being shaped";

    return `📖 Story Mode: ${projectName}

Chapter 1 — The idea
${projectName} begins as a simple, practical product built with ${projectLanguage} and ${projectFramework}. Its goal is to make the experience feel clear, friendly, and easy to understand.

Chapter 2 — What users see
Users are greeted with a guided interface, helpful project details, and ${featureSummary}. The app is designed to feel organized instead of overwhelming.

Chapter 3 — Why it matters
Behind the scenes, the project keeps both users and developers in mind. It explains the product in plain language, while still leaving room for deeper technical insight when needed.`;
  };

  const buildTourContent = () => {
    const projectName = project?.name || "this project";
    const projectLanguage = project?.language || "JavaScript";
    const projectFramework = project?.framework || "Vanilla JS";

    return `🧭 Guided Tour: ${projectName}

1. Open the overview — start with the welcome screen to understand the purpose of the project.
2. Explore the features — review the available capabilities and see what the app can do.
3. Read the project details — check the language, framework, and summary information.
4. Ask the AI — use the chat to get simple answers about how the project works.
5. Switch to developer mode — move into the technical view for code-level insight.

This project is built with ${projectLanguage} and ${projectFramework}, so the tour stays simple while still showing the structure clearly.`;
  };

  const generateStory = async () => {
    if (storyContent) return; // Already generated

    setStoryLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 450));
      setStoryContent(buildStoryContent());
    } catch (error) {
      console.error("Failed to generate story:", error);
      setStoryContent(
        "Sorry, I couldn't generate the story right now. Try again in a moment!",
      );
    } finally {
      setStoryLoading(false);
    }
  };

  const generateTour = async () => {
    if (tourContent) return; // Already generated

    setTourLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 450));
      setTourContent(buildTourContent());
    } catch (error) {
      console.error("Failed to generate tour:", error);
      setTourContent(
        "Sorry, I couldn't generate the tour right now. Try again in a moment!",
      );
    } finally {
      setTourLoading(false);
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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
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
              <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <h1 className="font-semibold">{project.name}</h1>
                <p className="text-xs text-muted-foreground">
                  Normal User Mode
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/dev/${projectId}`}
              className="px-3 py-1.5 text-sm border rounded-lg hover:bg-muted transition-colors"
            >
              Switch to Developer Mode
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-purple-500" />
          </div>
          <h1 className="text-4xl font-bold mb-3">
            Understanding {project.name}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Let's explore what this project does in simple, human-friendly terms
          </p>
        </motion.div>

        {/* Quick Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-8 border mb-8"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">What is this project?</h2>
              <p className="text-muted-foreground">
                {project.description ||
                  "This is a software project that helps solve specific problems."}
              </p>
            </div>
          </div>

          {project.language && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Built with:</span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
                {project.language}
              </span>
              {project.framework && (
                <span className="px-3 py-1 bg-purple-500/10 text-purple-500 rounded-full font-medium">
                  {project.framework}
                </span>
              )}
            </div>
          )}
        </motion.div>

        {/* Features Section - Enhanced View */}
        {(activeView === "features" || features.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {activeView === "features"
                    ? "Project Features"
                    : "Key Features"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {activeView === "features"
                    ? `${features.length} capabilities this project offers`
                    : "What this project can do"}
                </p>
              </div>
            </div>

            {features.length > 0 ? (
              <div
                className={`grid gap-6 ${
                  activeView === "features"
                    ? "md:grid-cols-1 lg:grid-cols-2"
                    : "md:grid-cols-2"
                }`}
              >
                {features.map((feature, index) => (
                  <FeatureCard
                    key={feature.id || index}
                    feature={feature}
                    onClick={() => {}}
                  />
                ))}
              </div>
            ) : (
              <div className="glass rounded-xl p-8 border text-center">
                <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  No features available yet. The analysis may still be running,
                  or this project hasn't been analyzed.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Exploration Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          {/* Features */}
          <div
            onClick={() => setActiveView("features")}
            className={`glass rounded-xl p-6 border transition-all group cursor-pointer ${
              activeView === "features"
                ? "border-purple-500 bg-purple-500/5"
                : "hover:border-purple-500/50"
            }`}
          >
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Lightbulb className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="font-semibold mb-2">Explore Features</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Discover what this project can do
            </p>
            <div className="text-sm text-purple-500 font-medium group-hover:underline">
              {features.length > 0
                ? `${features.length} features found`
                : "Coming Soon"}{" "}
              →
            </div>
          </div>

          {/* Story Mode */}
          <div
            onClick={() => setActiveView("story")}
            className={`glass rounded-xl p-6 border transition-all group cursor-pointer ${
              activeView === "story"
                ? "border-purple-500 bg-purple-500/5"
                : "hover:border-purple-500/50"
            }`}
          >
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="font-semibold mb-2">Story Mode</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Learn how this project works in plain language
            </p>
            <div className="text-sm text-purple-500 font-medium group-hover:underline">
              Discover →
            </div>
          </div>

          {/* Guided Tour */}
          <div
            onClick={() => setActiveView("tour")}
            className={`glass rounded-xl p-6 border transition-all group cursor-pointer ${
              activeView === "tour"
                ? "border-purple-500 bg-purple-500/5"
                : "hover:border-purple-500/50"
            }`}
          >
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="font-semibold mb-2">Guided Tour</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Take a walkthrough of the project
            </p>
            <div className="text-sm text-purple-500 font-medium group-hover:underline">
              Coming Soon →
            </div>
          </div>
        </motion.div>

        {/* Story Mode View */}
        {activeView === "story" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl border p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold">Story Mode</h2>
            </div>

            {storyLoading && !storyContent ? (
              <div className="flex items-center gap-3 justify-center py-12">
                <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
                <p className="text-muted-foreground">
                  Generating your project story...
                </p>
              </div>
            ) : storyContent ? (
              <div className="prose prose-invert max-w-none">
                <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-6">
                  <div className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {storyContent}
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={generateStory}
                disabled={storyLoading}
                className="w-full px-6 py-3 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors disabled:opacity-50"
              >
                {storyLoading ? "Generating..." : "Generate Story"}
              </button>
            )}
          </motion.div>
        )}

        {/* Guided Tour View */}
        {activeView === "tour" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl border p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Play className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold">Guided Tour</h2>
            </div>

            {tourLoading && !tourContent ? (
              <div className="flex items-center gap-3 justify-center py-12">
                <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
                <p className="text-muted-foreground">
                  Preparing your guided tour...
                </p>
              </div>
            ) : tourContent ? (
              <div className="prose prose-invert max-w-none">
                <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-6">
                  <div className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {tourContent}
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={generateTour}
                disabled={tourLoading}
                className="w-full px-6 py-3 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors disabled:opacity-50"
              >
                {tourLoading ? "Preparing..." : "Start Guided Tour"}
              </button>
            )}
          </motion.div>
        )}

        {/* AI Chat Section - Show for overview and features views */}
        {(activeView === "overview" || activeView === "features") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl border overflow-hidden mb-8"
          >
            {!showChat ? (
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="w-6 h-6 text-purple-500" />
                  <h2 className="text-2xl font-bold">Ask Me Anything</h2>
                </div>

                <p className="text-muted-foreground mb-6">
                  Have questions about this project? Ask in plain English and
                  get simple, easy-to-understand answers.
                </p>

                <button
                  onClick={() => setShowChat(true)}
                  className="w-full px-6 py-4 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors"
                >
                  Start Chatting with AI
                </button>

                <div className="mt-6 p-4 bg-purple-500/5 rounded-lg border border-purple-500/20">
                  <p className="text-sm text-muted-foreground">
                    💡 <strong>Tip:</strong> The AI will explain everything in
                    simple terms, without technical jargon.
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-[600px]">
                <ChatInterface projectId={projectId} mode="normal" />
              </div>
            )}
          </motion.div>
        )}

        {/* Back to Overview Button - Show for non-overview views */}
        {activeView !== "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <button
              onClick={() => setActiveView("overview")}
              className="px-4 py-2 border rounded-lg text-foreground hover:bg-muted transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Overview
            </button>
          </motion.div>
        )}

        {/* Switch Mode CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl border"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Need Technical Details?</h3>
              <p className="text-sm text-muted-foreground">
                Switch to Developer Mode for code-level insights and analysis
              </p>
            </div>
            <Link
              href={`/dashboard/dev/${projectId}`}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Code2 className="w-4 h-4" />
              Developer Mode
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
