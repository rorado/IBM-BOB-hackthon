"use client";

import React, { useCallback, useMemo } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MarkerType,
  BackgroundVariant,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import { CodeFlowGraph } from "@/types";

// Custom Node Types
import FlowNodeComponent from "./FlowNode";
import FlowEdgeComponent from "./FlowEdge";

interface CodeFlowCanvasProps {
  flowData: CodeFlowGraph;
  onNodeClick?: (nodeId: string) => void;
  className?: string;
}

const nodeTypes = {
  custom: FlowNodeComponent,
};

const edgeTypes = {
  custom: FlowEdgeComponent,
};

export default function CodeFlowCanvas({
  flowData,
  onNodeClick,
  className = "",
}: CodeFlowCanvasProps) {
  // Convert flow data to React Flow format
  const initialNodes: Node[] = useMemo(() => {
    const nodes = (flowData.nodes as any[]) || [];
    return nodes.map((node: any, index: number) => ({
      id: node.id,
      type: "custom",
      position: node.position || { x: index * 250, y: 100 },
      data: {
        label: node.label,
        type: node.type,
        description: node.description,
        metadata: node.metadata,
      },
    }));
  }, [flowData.nodes]);

  const initialEdges: Edge[] = useMemo(() => {
    const edges = (flowData.edges as any[]) || [];
    return edges.map((edge: any) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: "custom",
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#6366f1",
      },
      data: {
        label: edge.label,
        description: edge.description,
      },
      style: {
        stroke: "#6366f1",
        strokeWidth: 2,
      },
    }));
  }, [flowData.edges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (onNodeClick) {
        onNodeClick(node.id);
      }
    },
    [onNodeClick],
  );

  return (
    <div className={`w-full h-full ${className}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        attributionPosition="bottom-left"
        className="bg-gray-50 dark:bg-gray-900"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1}
          color="#94a3b8"
          className="dark:opacity-20"
        />
        <Controls className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg" />

        <Panel
          position="top-left"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {flowData.name}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {flowData.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
              <span>{nodes.length} nodes</span>
              <span>•</span>
              <span>{edges.length} connections</span>
            </div>
          </div>
        </Panel>

        <Panel
          position="top-right"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700"
        >
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              Legend
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Frontend
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                API
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-purple-500"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Database
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-orange-500"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Service
              </span>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
