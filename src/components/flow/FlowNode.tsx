"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import {
  Code2,
  Database,
  Server,
  Globe,
  Lock,
  Zap,
  FileCode,
  Settings,
} from "lucide-react";

const nodeTypeConfig = {
  frontend: {
    color: "bg-blue-500",
    borderColor: "border-blue-500",
    icon: Globe,
    label: "Frontend",
  },
  api: {
    color: "bg-green-500",
    borderColor: "border-green-500",
    icon: Server,
    label: "API",
  },
  database: {
    color: "bg-purple-500",
    borderColor: "border-purple-500",
    icon: Database,
    label: "Database",
  },
  service: {
    color: "bg-orange-500",
    borderColor: "border-orange-500",
    icon: Zap,
    label: "Service",
  },
  auth: {
    color: "bg-red-500",
    borderColor: "border-red-500",
    icon: Lock,
    label: "Auth",
  },
  component: {
    color: "bg-cyan-500",
    borderColor: "border-cyan-500",
    icon: FileCode,
    label: "Component",
  },
  middleware: {
    color: "bg-yellow-500",
    borderColor: "border-yellow-500",
    icon: Settings,
    label: "Middleware",
  },
  default: {
    color: "bg-gray-500",
    borderColor: "border-gray-500",
    icon: Code2,
    label: "Node",
  },
};

interface FlowNodeData {
  label: string;
  type?: string;
  description?: string;
  metadata?: Record<string, any>;
}

function FlowNode({ data, selected }: NodeProps<FlowNodeData>) {
  const nodeType = data.type || "default";
  const config =
    nodeTypeConfig[nodeType as keyof typeof nodeTypeConfig] ||
    nodeTypeConfig.default;
  const Icon = config.icon;

  return (
    <div
      className={`
        relative px-4 py-3 rounded-lg border-2 bg-white dark:bg-gray-800
        shadow-lg transition-all duration-200
        ${selected ? `${config.borderColor} shadow-xl scale-105` : "border-gray-200 dark:border-gray-700"}
        hover:shadow-xl hover:scale-105
        min-w-[180px]
      `}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className={`w-3 h-3 ${config.color} border-2 border-white dark:border-gray-800`}
      />

      {/* Node Content */}
      <div className="flex items-start gap-3">
        <div className={`${config.color} p-2 rounded-md flex-shrink-0`}>
          <Icon className="w-4 h-4 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {data.label}
            </h4>
          </div>

          {data.description && (
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
              {data.description}
            </p>
          )}

          {data.metadata && Object.keys(data.metadata).length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {Object.entries(data.metadata)
                .slice(0, 2)
                .map(([key, value]) => (
                  <span
                    key={key}
                    className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  >
                    {key}: {String(value).slice(0, 10)}
                  </span>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className={`w-3 h-3 ${config.color} border-2 border-white dark:border-gray-800`}
      />

      {/* Type Badge */}
      <div className="absolute -top-2 -right-2">
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${config.color} text-white font-medium shadow-md`}
        >
          {config.label}
        </span>
      </div>
    </div>
  );
}

export default memo(FlowNode);
