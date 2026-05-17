"use client";

import { signIn } from "next-auth/react";
import { Github, Brain, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignInPage() {
  const handleGitHubSignIn = async () => {
    await signIn("github", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        {/* Sign in card */}
        <div className="glass rounded-2xl p-8 border shadow-2xl">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <Brain className="w-10 h-10 text-primary" />
            <span className="text-2xl font-bold">AI Codebase Autopilot</span>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">
              Sign in to continue exploring your codebases
            </p>
          </div>

          {/* GitHub Sign In Button */}
          <button
            onClick={handleGitHubSignIn}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-foreground text-background rounded-lg font-semibold hover:bg-foreground/90 transition-all hover:scale-105 shadow-lg"
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-muted-foreground">
                Why GitHub?
              </span>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              <p>Access your repositories directly</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              <p>Secure OAuth authentication</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              <p>No password required</p>
            </div>
          </div>

          {/* Terms */}
          <p className="text-xs text-center text-muted-foreground mt-8">
            By signing in, you agree to our{" "}
            <Link href="#" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>

        {/* Additional info */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            Don't have a GitHub account?{" "}
            <a
              href="https://github.com/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Create one here
            </a>
          </p>
        </div>
      </motion.div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
