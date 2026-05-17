# 🧠 AI Codebase Autopilot - System Architecture

## 🎯 Product Vision

An AI-powered developer intelligence platform that transforms any codebase into a navigable, explainable, and interactive system - "Google Maps for Software Engineering"

## 🏗️ System Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Layer (Next.js)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Landing    │  │  Dashboard   │  │  AI Chat     │      │
│  │     Page     │  │   (2 Modes)  │  │   System     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    API Layer (Next.js API Routes)            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Auth API   │  │  Upload API  │  │  Analysis    │      │
│  │   (NextAuth) │  │  (GitHub/ZIP)│  │     API      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   AI Intelligence Layer                      │
│  ┌──────────────────────────────────────────────────┐       │
│  │              IBM Bob AI Engine                    │       │
│  │  • Code Analysis  • Architecture Detection        │       │
│  │  • Flow Mapping   • Bug Detection                 │       │
│  │  • Documentation  • Chat Intelligence             │       │
│  └──────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Data Layer (PostgreSQL + Prisma)           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Users     │  │   Projects   │  │   Analysis   │      │
│  │   Sessions   │  │  FileNodes   │  │   Results    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## 🎮 Two-Mode System Architecture

### Developer Mode Flow

```
User → Dashboard → [Dev Mode Selected]
  ↓
  ├─→ Code Tree Viewer (File Explorer)
  ├─→ AI Code Chat (Repository Context)
  ├─→ Flow Visualizer (React Flow Graph)
  ├─→ Bug Detector (AI Analysis)
  ├─→ Refactoring Engine (AI Suggestions)
  └─→ Test Generator (AI-Powered)
```

### Normal User Mode Flow

```
User → Dashboard → [User Mode Selected]
  ↓
  ├─→ Simple Project Overview
  ├─→ Feature Explorer (What does it do?)
  ├─→ Story Mode (Narrative Explanation)
  ├─→ Guided Onboarding
  └─→ Human-Language AI Chat
```

## 🔄 AI Analysis Pipeline

### Stage 1: Project Ingestion

```
GitHub URL / ZIP Upload
  ↓
Extract & Store Files
  ↓
Create Project Record
  ↓
Trigger Analysis Job
```

### Stage 2: AI Processing (IBM Bob)

```
1. Repository Scan
   - Read all files
   - Detect languages & frameworks
   - Identify entry points

2. Architecture Analysis
   - Extract modules
   - Map dependencies
   - Identify patterns

3. Flow Detection
   - Trace request paths
   - Map data flows
   - Identify critical paths

4. Intelligence Generation
   - Generate summaries
   - Detect issues
   - Create documentation
   - Build knowledge graph

5. Store Results
   - Save to PostgreSQL
   - Index for search
   - Cache for performance
```

### Stage 3: Visualization Preparation

```
Analysis Results
  ↓
Generate Graph Data (React Flow)
  ↓
Create Interactive Nodes
  ↓
Enable AI Navigation
```

## 📊 Data Flow Architecture

### Upload Flow

```
User Upload → API Route → File Storage → Database Record → AI Queue
```

### Analysis Flow

```
AI Queue → IBM Bob Processing → Results Generation → Database Storage → UI Update
```

### Chat Flow

```
User Message → Context Loading → IBM Bob Query → Response Generation → UI Display
```

### Visualization Flow

```
Project Selection → Load Analysis → Generate Graph → Render React Flow → Interactive Navigation
```

## 🗄️ Database Schema Design

### Core Entities

- **User**: Authentication and profile
- **Project**: Repository metadata
- **FileNode**: Individual files in codebase
- **AnalysisResult**: AI-generated insights
- **CodeFlowGraph**: Visual flow data
- **FeatureModule**: Detected features
- **ChatMessage**: Conversation history
- **Session**: NextAuth sessions

### Relationships

```
User (1) ──→ (N) Project
Project (1) ──→ (N) FileNode
Project (1) ──→ (1) AnalysisResult
Project (1) ──→ (N) CodeFlowGraph
Project (1) ──→ (N) FeatureModule
User (1) ──→ (N) ChatMessage
Project (1) ──→ (N) ChatMessage
```

## 🎨 Frontend Architecture

### Component Hierarchy

```
App Layout
├── Landing Page
│   ├── Hero Section
│   ├── Features Section
│   ├── Demo Section
│   └── CTA Section
│
├── Auth Pages
│   └── GitHub OAuth Flow
│
├── Upload Page
│   ├── GitHub URL Input
│   ├── ZIP Upload
│   └── Processing Status
│
└── Dashboard
    ├── Mode Selector
    ├── Sidebar Navigation
    ├── Main Content Area
    │   ├── Developer Mode
    │   │   ├── Code Tree
    │   │   ├── File Viewer
    │   │   ├── AI Chat
    │   │   └── Flow Graph
    │   │
    │   └── Normal User Mode
    │       ├── Project Overview
    │       ├── Feature Explorer
    │       ├── Story Mode
    │       └── Simple Chat
    │
    └── Right Panel (AI Assistant)
```

## 🔌 API Routes Structure

```
/api/auth/[...nextauth]     - NextAuth handlers
/api/projects/upload        - Project upload
/api/projects/[id]          - Project CRUD
/api/analysis/trigger       - Start AI analysis
/api/analysis/status        - Check analysis status
/api/analysis/results       - Get analysis results
/api/chat/message           - Send chat message
/api/chat/history           - Get chat history
/api/flows/generate         - Generate flow graph
/api/flows/[id]             - Get specific flow
/api/docs/generate          - Generate documentation
```

## 🤖 IBM Bob Integration Points

### 1. Repository Analysis

```typescript
// Analyze entire codebase
const analysis = await ibmBob.analyzeRepository({
  files: projectFiles,
  language: detectedLanguage,
  framework: detectedFramework,
});
```

### 2. Architecture Detection

```typescript
// Detect system architecture
const architecture = await ibmBob.detectArchitecture({
  projectStructure: fileTree,
  dependencies: packageJson,
});
```

### 3. Flow Mapping

```typescript
// Map code flows
const flows = await ibmBob.mapCodeFlows({
  entryPoints: ["index.ts", "app.ts"],
  traceDepth: 5,
});
```

### 4. Chat Intelligence

```typescript
// Context-aware chat
const response = await ibmBob.chat({
  message: userMessage,
  context: projectContext,
  mode: "developer" | "normal",
});
```

### 5. Bug Detection

```typescript
// Detect potential issues
const issues = await ibmBob.detectIssues({
  codebase: projectFiles,
  severity: ["high", "medium", "low"],
});
```

## 🎯 Key Differentiators

1. **Dual-Mode Intelligence**: Same codebase, two perspectives
2. **Visual Flow Mapping**: Interactive code journey visualization
3. **Living Documentation**: Auto-generated, always up-to-date
4. **Context-Aware AI**: Understands entire repository
5. **Production-Grade UX**: Startup-quality design

## 🚀 Technology Stack

- **Frontend**: Next.js 14+ (App Router), React 18+, TypeScript
- **Styling**: TailwindCSS, Framer Motion
- **Visualization**: React Flow, D3.js
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Auth**: NextAuth.js (GitHub OAuth)
- **AI**: IBM Bob AI Engine
- **Deployment**: Vercel (recommended)

## 📈 Scalability Considerations

1. **Async Processing**: AI analysis runs in background jobs
2. **Caching**: Redis for analysis results and chat context
3. **CDN**: Static assets and documentation
4. **Database Indexing**: Optimized queries for large codebases
5. **Rate Limiting**: API protection and cost management

## 🔒 Security Architecture

1. **Authentication**: GitHub OAuth via NextAuth
2. **Authorization**: Row-level security in Prisma
3. **API Protection**: Rate limiting and validation
4. **Data Encryption**: At rest and in transit
5. **Input Sanitization**: All user inputs validated

## 📱 Responsive Design Strategy

- **Desktop First**: Primary use case
- **Tablet Optimized**: Collapsible sidebars
- **Mobile Friendly**: Essential features accessible
- **Progressive Enhancement**: Core features work everywhere

## 🎨 UI/UX Design Principles

1. **Clarity**: Information hierarchy is obvious
2. **Speed**: Instant feedback, optimistic updates
3. **Beauty**: Modern, professional aesthetics
4. **Delight**: Subtle animations and micro-interactions
5. **Accessibility**: WCAG 2.1 AA compliance

## 🏁 MVP Implementation Priority

### Phase 1 (Day 1 - Core Foundation)

- [ ] Project setup and configuration
- [ ] Database schema and Prisma setup
- [ ] Authentication system
- [ ] Basic landing page
- [ ] Project upload system

### Phase 2 (Day 1-2 - AI Integration)

- [ ] IBM Bob integration layer
- [ ] Analysis pipeline
- [ ] Basic dashboard layout
- [ ] Mode switching system

### Phase 3 (Day 2 - Features)

- [ ] Developer Mode interface
- [ ] Normal User Mode interface
- [ ] Flow visualization
- [ ] AI chat system

### Phase 4 (Day 2 - Polish)

- [ ] UI refinement
- [ ] Animations
- [ ] Documentation
- [ ] Demo preparation

## 🎬 Demo Flow (For Judges)

1. **Landing**: Show professional SaaS homepage
2. **Login**: Quick GitHub OAuth
3. **Upload**: Paste a GitHub repo URL
4. **Analysis**: Show AI processing (with progress)
5. **Developer Mode**: Explore code tree, chat with AI
6. **Flow Visualization**: Show interactive graph
7. **Mode Switch**: Switch to Normal User Mode
8. **Simple Explanation**: AI explains in human terms
9. **Wow Factor**: Highlight unique features

## 📊 Success Metrics

- **Technical**: Clean architecture, scalable code
- **UX**: Intuitive, beautiful, fast
- **AI**: Accurate analysis, helpful responses
- **Demo**: Impressive, memorable, clear value
- **Completeness**: All core features working

---

This architecture is designed to be:
✅ Production-ready
✅ Scalable
✅ Demo-impressive
✅ Hackathon-winnable
