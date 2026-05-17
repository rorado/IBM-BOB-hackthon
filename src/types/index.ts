// Core TypeScript Types for AI Codebase Autopilot

import {
  Project,
  User,
  FileNode,
  AnalysisResult,
  CodeFlowGraph,
  FeatureModule,
  ChatMessage,
} from "@prisma/client";

// ============================================================================
// PROJECT TYPES
// ============================================================================

export type ProjectWithRelations = Project & {
  user: User;
  fileNodes?: FileNode[];
  analysisResult?: AnalysisResult;
  codeFlowGraphs?: CodeFlowGraph[];
  featureModules?: FeatureModule[];
};

export interface ProjectUploadData {
  name: string;
  description?: string;
  sourceType: "GITHUB" | "ZIP";
  githubUrl?: string;
  zipFile?: File;
}

export interface ProjectAnalysisStatus {
  projectId: string;
  status: "PENDING" | "ANALYZING" | "COMPLETED" | "FAILED";
  progress: number; // 0-100
  currentStep?: string;
  error?: string;
}

// ============================================================================
// ANALYSIS TYPES
// ============================================================================

export interface ArchitecturePattern {
  type: string;
  confidence: number;
  description: string;
}

export interface DependencyNode {
  id: string;
  name: string;
  type: "internal" | "external";
  version?: string;
  dependencies: string[];
}

export interface CodeQualityMetrics {
  overall: number;
  maintainability: number;
  complexity: number;
  testCoverage?: number;
  documentation: number;
}

export interface CodeIssue {
  severity: "high" | "medium" | "low";
  type: string;
  file: string;
  line?: number;
  message: string;
  suggestion?: string;
}

export interface AnalysisInsight {
  category: "strength" | "weakness" | "suggestion";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  files?: string[];
}

// ============================================================================
// FLOW VISUALIZATION TYPES
// ============================================================================

export interface FlowNode {
  id: string;
  type:
    | "start"
    | "process"
    | "decision"
    | "end"
    | "api"
    | "database"
    | "component";
  data: {
    label: string;
    description?: string;
    file?: string;
    line?: number;
    code?: string;
  };
  position: { x: number; y: number };
  style?: Record<string, any>;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: "default" | "step" | "smoothstep" | "straight";
  animated?: boolean;
  style?: Record<string, any>;
}

export interface CodeFlow {
  id: string;
  name: string;
  type: "REQUEST" | "DATA" | "AUTH" | "FEATURE" | "ERROR" | "CUSTOM";
  description: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  metadata: {
    complexity: number;
    files: string[];
    entryPoint: string;
    exitPoint: string;
  };
}

// ============================================================================
// CHAT TYPES
// ============================================================================

export interface ChatContext {
  type: "REPOSITORY" | "FILE" | "FLOW" | "MODULE" | "DOCUMENTATION";
  data: any;
  projectId: string;
}

export interface ChatMessageData {
  id: string;
  role: "USER" | "ASSISTANT" | "SYSTEM";
  content: string;
  mode: "DEVELOPER" | "NORMAL";
  context?: ChatContext;
  timestamp: Date;
  tokens?: number;
}

export interface ChatRequest {
  message: string;
  projectId: string;
  mode: "DEVELOPER" | "NORMAL";
  context?: ChatContext;
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
  relatedFiles?: string[];
  relatedFlows?: string[];
}

// ============================================================================
// FILE TREE TYPES
// ============================================================================

export interface FileTreeNode {
  id: string;
  name: string;
  path: string;
  type: "FILE" | "DIRECTORY";
  extension?: string;
  size: number;
  lines?: number;
  children?: FileTreeNode[];
  summary?: string;
  importance?: number;
}

export interface FileContent {
  path: string;
  content: string;
  language: string;
  lines: number;
  size: number;
  analysis?: {
    summary: string;
    complexity: number;
    dependencies: string[];
    exports: string[];
  };
}

// ============================================================================
// FEATURE MODULE TYPES
// ============================================================================

export interface FeatureModuleData {
  id: string;
  name: string;
  description: string;
  category: string;
  files: string[];
  technicalDetails: string;
  userExplanation: string;
  importance: number;
  dependencies: string[];
}

// ============================================================================
// DOCUMENTATION TYPES
// ============================================================================

export interface DocumentationSection {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  order: number;
  subsections?: DocumentationSection[];
}

export interface DocumentationStructure {
  overview: DocumentationSection;
  architecture: DocumentationSection;
  features: DocumentationSection[];
  api: DocumentationSection[];
  setup: DocumentationSection;
}

// ============================================================================
// MODE TYPES
// ============================================================================

export type ViewMode = "DEVELOPER" | "NORMAL";

export interface ModeConfig {
  mode: ViewMode;
  features: {
    codeTree: boolean;
    fileViewer: boolean;
    flowGraph: boolean;
    technicalChat: boolean;
    bugDetection: boolean;
    refactoring: boolean;
    testGeneration: boolean;
    simpleOverview: boolean;
    featureExplorer: boolean;
    storyMode: boolean;
    guidedTour: boolean;
  };
  aiPersonality: "technical" | "friendly";
}

// ============================================================================
// UI STATE TYPES
// ============================================================================

export interface DashboardState {
  selectedProject: string | null;
  viewMode: ViewMode;
  selectedFile: string | null;
  selectedFlow: string | null;
  sidebarOpen: boolean;
  chatOpen: boolean;
}

export interface UploadState {
  uploading: boolean;
  progress: number;
  error: string | null;
  projectId: string | null;
}

export interface AnalysisState {
  analyzing: boolean;
  progress: number;
  currentStep: string;
  error: string | null;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

// ============================================================================
// EXPORT ALL PRISMA TYPES
// ============================================================================

export type {
  Project,
  User,
  FileNode,
  AnalysisResult,
  CodeFlowGraph,
  FeatureModule,
  ChatMessage,
} from "@prisma/client";
