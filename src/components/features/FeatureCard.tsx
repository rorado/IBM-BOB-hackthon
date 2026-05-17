"use client";

import { motion } from "framer-motion";
import {
  Lightbulb,
  Zap,
  Shield,
  Users,
  Database,
  Globe,
  Code2,
  Settings,
} from "lucide-react";

interface FeatureCardProps {
  feature: {
    id: string;
    name: string;
    description: string;
    category: string;
    userExplanation?: string | null;
    importance: number;
  };
  onClick?: () => void;
}

const categoryIcons: Record<string, any> = {
  Authentication: Shield,
  API: Globe,
  Database: Database,
  UI: Users,
  Logic: Code2,
  Configuration: Settings,
  General: Lightbulb,
};

const categoryColors: Record<string, string> = {
  Authentication: "text-red-500 bg-red-500/10",
  API: "text-green-500 bg-green-500/10",
  Database: "text-purple-500 bg-purple-500/10",
  UI: "text-blue-500 bg-blue-500/10",
  Logic: "text-yellow-500 bg-yellow-500/10",
  Configuration: "text-gray-500 bg-gray-500/10",
  General: "text-primary bg-primary/10",
};

export default function FeatureCard({ feature, onClick }: FeatureCardProps) {
  const Icon = categoryIcons[feature.category] || Lightbulb;
  const colorClass = categoryColors[feature.category] || categoryColors.General;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="glass rounded-xl p-6 border hover:border-primary/50 transition-all cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}
        >
          <Icon className="w-6 h-6" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold group-hover:text-primary transition-colors">
              {feature.name}
            </h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${
                    i < feature.importance
                      ? "bg-primary"
                      : "bg-muted-foreground/20"
                  }`}
                />
              ))}
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {feature.userExplanation || feature.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
              {feature.category}
            </span>
            <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Learn more →
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
