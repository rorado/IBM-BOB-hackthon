"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Code2,
  Brain,
  GitBranch,
  Zap,
  Shield,
  Users,
  CheckCircle2,
  Sparkles,
  Github,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-lg">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl">AI Codebase Autopilot</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm hover:text-primary transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="text-sm hover:text-primary transition-colors"
            >
              Pricing
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/signin"
              className="text-sm hover:text-primary transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signin"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Powered by IBM Bob AI
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              IBM Bob —
              <br />
              <span className="gradient-primary bg-clip-text text-transparent">
                Maps for Software Engineering
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Turn any codebase into an intelligent, navigable, and explainable
              system. AI-powered insights for developers and non-technical users
              — Hackathon edition powered by IBM Bob.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signin"
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              >
                Start Exploring
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Two Modes, Infinite Possibilities
            </h2>
            <p className="text-xl text-muted-foreground">
              Same codebase, two perspectives - technical and human-friendly
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Developer Mode */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8 border hover:border-primary/50 transition-all"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">👨‍💻 Developer Mode</h3>
              <p className="text-muted-foreground mb-6">
                For engineers who need deep technical insights
              </p>
              <ul className="space-y-3">
                {[
                  "Full codebase tree explorer",
                  "AI chat over entire repository",
                  "Interactive flow visualization",
                  "Bug detection & fix suggestions",
                  "Refactoring engine",
                  "Automated test generation",
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Normal User Mode */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8 border hover:border-purple-500/50 transition-all"
            >
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold mb-3">👤 Normal User Mode</h3>
              <p className="text-muted-foreground mb-6">
                For non-technical users who need simple explanations
              </p>
              <ul className="space-y-3">
                {[
                  "Simple project overview",
                  "Feature explorer with icons",
                  "Story mode (narrative explanation)",
                  "Guided onboarding tour",
                  "Human-language AI chat",
                  "Visual feature mapping",
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Core Features Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: "AI-Powered Analysis",
                description:
                  "IBM Bob AI analyzes your entire codebase and understands architecture automatically",
              },
              {
                icon: GitBranch,
                title: "Flow Visualization",
                description:
                  "See how requests flow through your system with interactive graphs",
              },
              {
                icon: Zap,
                title: "Instant Insights",
                description:
                  "Get immediate answers about any part of your codebase",
              },
              {
                icon: Shield,
                title: "Bug Detection",
                description:
                  "Automatically identify potential issues and get fix suggestions",
              },
              {
                icon: Code2,
                title: "Auto Documentation",
                description: "Generate comprehensive docs that stay up-to-date",
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description:
                  "Share insights and knowledge across your entire team",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-xl border bg-card hover:shadow-lg transition-all"
              >
                <feature.icon className="w-10 h-10 text-primary mb-4" />
                <h4 className="font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">
              From upload to insights in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Upload", desc: "GitHub URL or ZIP file" },
              { step: "2", title: "Analyze", desc: "AI processes your code" },
              {
                step: "3",
                title: "Explore",
                desc: "Navigate with AI guidance",
              },
              { step: "4", title: "Improve", desc: "Get actionable insights" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold text-primary mx-auto mb-4">
                  {item.step}
                </div>
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start free for the IBM Bob hackathon, then scale as your team
              grows.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Hackathon",
                price: "Free",
                note: "Perfect for prototypes and demos",
                cta: "Start Free",
                features: [
                  "1 project workspace",
                  "GitHub import + file explorer",
                  "IBM Bob AI basic chat",
                  "Story mode and guided tour",
                ],
              },
              {
                name: "Team",
                price: "$19",
                note: "Per user / month",
                cta: "Start Team Plan",
                highlighted: true,
                features: [
                  "Unlimited projects",
                  "Advanced architecture insights",
                  "Flow visualization + bug detection",
                  "Priority AI responses",
                ],
              },
              {
                name: "Enterprise",
                price: "Custom",
                note: "For large organizations",
                cta: "Contact Sales",
                features: [
                  "SSO and role-based access",
                  "Private deployment options",
                  "Audit logs and governance",
                  "Dedicated onboarding support",
                ],
              },
            ].map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl border p-8 bg-card ${
                  plan.highlighted
                    ? "border-primary shadow-xl shadow-primary/20"
                    : "border-border"
                }`}
              >
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-2">{plan.price}</div>
                <p className="text-sm text-muted-foreground mb-6">
                  {plan.note}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/signin"
                  className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold transition-all ${
                    plan.highlighted
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border border-border hover:bg-muted"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-purple-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Ready to Transform Your Codebase?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join developers who are making their code more accessible and
              understandable
            </p>
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-lg font-semibold hover:bg-white/90 transition-all hover:scale-105 shadow-xl"
            >
              <Github className="w-5 h-5" />
              Sign In with GitHub
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-6 h-6 text-primary" />
                <span className="font-bold">AI Codebase Autopilot</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Making every codebase accessible and understandable
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-primary">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-primary">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#demo" className="hover:text-primary">
                    Demo
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-primary">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-primary">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2026 AI Codebase Autopilot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
