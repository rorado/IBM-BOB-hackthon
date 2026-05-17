# 🧠 AI Codebase Autopilot

> Transform any codebase into an intelligent, navigable, and explainable system

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**AI Codebase Autopilot** is an AI-powered developer intelligence platform that turns any codebase into a navigable, explainable, and interactive system. Think of it as "Google Maps for Software Engineering."

![AI Codebase Autopilot Demo](https://via.placeholder.com/1200x600/0ea5e9/ffffff?text=AI+Codebase+Autopilot)

---

## ✨ Key Features

### 🎯 Dual-Mode Intelligence

#### 👨‍💻 Developer Mode

- **Code Tree Explorer**: Navigate your entire codebase with AI-powered insights
- **Flow Visualization**: See how requests flow through your system
- **AI Code Chat**: Ask questions about any part of your codebase
- **Bug Detection**: Automatically identify potential issues
- **Refactoring Engine**: Get AI-powered improvement suggestions
- **Test Generation**: Generate tests for your code

#### 👤 Normal User Mode

- **Simple Overview**: Understand what the project does in plain English
- **Feature Explorer**: Discover features without reading code
- **Story Mode**: Learn how the system works through narratives
- **Guided Tour**: Step-by-step walkthrough of the application

### 🚀 Core Capabilities

- **🔍 Intelligent Analysis**: IBM Bob AI analyzes your entire codebase
- **📊 Architecture Detection**: Automatically identifies design patterns
- **🗺️ Flow Mapping**: Visualizes code execution paths
- **📚 Auto Documentation**: Generates comprehensive docs
- **💬 Context-Aware Chat**: AI assistant with full repository context
- **🔄 Real-time Updates**: Live analysis as you explore

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js 14)                    │
│  • App Router  • TypeScript  • TailwindCSS  • React Flow    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   AI Intelligence Layer                      │
│              IBM Bob AI Engine (Core Brain)                  │
│  • Code Analysis  • Architecture Detection  • Flow Mapping   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                Data Layer (PostgreSQL + Prisma)              │
│  • Projects  • Analysis Results  • Chat History  • Flows    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 14+
- GitHub account (for OAuth)
- IBM Bob API credentials

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/ai-codebase-autopilot.git
cd ai-codebase-autopilot
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ai_codebase_autopilot"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
GITHUB_ID="your-github-oauth-id"
GITHUB_SECRET="your-github-oauth-secret"
IBM_BOB_API_KEY="your-ibm-bob-api-key"
IBM_BOB_API_URL="https://api.ibm-bob.com/v1"
```

4. **Setup database**

```bash
npx prisma generate
npx prisma db push
```

5. **Start development server**

```bash
npm run dev
```

6. **Open your browser**

```
http://localhost:3000
```

---

## 📖 Usage

### 1. Sign In

- Click "Sign in with GitHub"
- Authorize the application

### 2. Upload a Project

- **Option A**: Paste a GitHub repository URL
- **Option B**: Upload a ZIP file of your project

### 3. Wait for Analysis

- IBM Bob AI analyzes your codebase
- Progress is shown in real-time
- Usually takes 30-60 seconds

### 4. Explore Your Codebase

#### Developer Mode

```
Dashboard → Select Project → Developer Mode
```

- Browse file tree
- View code with AI insights
- Visualize code flows
- Chat with AI about your code
- Get refactoring suggestions

#### Normal User Mode

```
Dashboard → Select Project → Normal User Mode
```

- Read simple project overview
- Explore features
- View story mode
- Ask questions in plain English

---

## 🎨 Tech Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Visualization**: React Flow
- **UI Components**: Radix UI

### Backend

- **API**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **AI Engine**: IBM Bob

### DevOps

- **Hosting**: Vercel (recommended)
- **Database**: Vercel Postgres / Railway
- **CI/CD**: GitHub Actions

---

## 📁 Project Structure

```
ai-codebase-autopilot/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth pages
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── upload/            # Upload page
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── ui/               # Base UI components
│   │   ├── layout/           # Layout components
│   │   ├── landing/          # Landing page
│   │   ├── dashboard/        # Dashboard
│   │   ├── dev-mode/         # Developer mode
│   │   ├── user-mode/        # Normal user mode
│   │   ├── flow/             # Flow visualization
│   │   └── chat/             # Chat interface
│   ├── lib/                   # Core libraries
│   │   ├── ai/               # AI integration
│   │   ├── upload/           # Upload handlers
│   │   └── analysis/         # Analysis pipeline
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript types
│   └── utils/                 # Utility functions
├── prisma/
│   └── schema.prisma          # Database schema
├── docs/                      # Documentation
└── public/                    # Static assets
```

---

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npm run db:push          # Push schema to database
npm run db:migrate       # Create migration
npm run db:studio        # Open Prisma Studio
npm run db:generate      # Generate Prisma Client
npm run db:seed          # Seed demo data
```

### Environment Variables

| Variable          | Description                  | Required |
| ----------------- | ---------------------------- | -------- |
| `DATABASE_URL`    | PostgreSQL connection string | ✅       |
| `NEXTAUTH_URL`    | Application URL              | ✅       |
| `NEXTAUTH_SECRET` | NextAuth secret key          | ✅       |
| `GITHUB_ID`       | GitHub OAuth client ID       | ✅       |
| `GITHUB_SECRET`   | GitHub OAuth client secret   | ✅       |
| `IBM_BOB_API_KEY` | IBM Bob API key              | ✅       |
| `IBM_BOB_API_URL` | IBM Bob API endpoint         | ✅       |

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**

```bash
git push origin main
```

2. **Import to Vercel**

- Go to [vercel.com](https://vercel.com)
- Click "Import Project"
- Select your repository
- Add environment variables
- Deploy!

3. **Setup Database**

- Use Vercel Postgres or Railway
- Update `DATABASE_URL` in Vercel
- Run migrations

### Manual Deployment

```bash
# Build
npm run build

# Start
npm run start
```

---

## 🎯 Roadmap

### Phase 1: MVP (Current)

- [x] Core architecture
- [x] Authentication system
- [x] Project upload
- [x] AI analysis pipeline
- [x] Dual-mode interface
- [x] Flow visualization
- [x] AI chat system

### Phase 2: Enhancement

- [ ] Team collaboration
- [ ] Code search
- [ ] Export documentation
- [ ] API integrations
- [ ] Mobile app

### Phase 3: Scale

- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Custom AI models
- [ ] Enterprise features

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **IBM Bob AI** for the incredible AI engine
- **Vercel** for Next.js and hosting
- **Prisma** for the amazing ORM
- **React Flow** for flow visualization
- **Radix UI** for accessible components
