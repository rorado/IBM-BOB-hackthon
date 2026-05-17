"use client";

import React from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from "reactflow";

interface FlowEdgeData {
  label?: string;
  description?: string;
}

export default function FlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps<FlowEdgeData>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 12,
              pointerEvents: "all",
            }}
            className="nodrag nopan"
          >
            <div className="bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {data.label}
              </div>
              {data.description && (
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                  {data.description}
                </div>
              )}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
