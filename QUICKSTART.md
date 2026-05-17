# 🚀 Quick Start Guide

Get your AI Codebase Autopilot up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (or use Vercel Postgres)
- GitHub account for OAuth

## Step 1: Clone & Setup (2 minutes)

```bash
# Clone the repository
git clone <your-repo-url>
cd hackathon

# Run the setup script
./scripts/setup.sh

# Or manually:
npm install
cp .env.example .env
npx prisma generate
```

## Step 2: Configure Environment (2 minutes)

Edit `.env` file with your credentials:

```env
# Database (use Vercel Postgres or your own)
DATABASE_URL="postgresql://user:password@host:5432/database"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"

# GitHub OAuth (create at: https://github.com/settings/developers)
GITHUB_ID="your_github_client_id"
GITHUB_SECRET="your_github_client_secret"

# IBM Bob AI
IBM_BOB_API_KEY="your_api_key"
IBM_BOB_API_URL="https://api.ibm-bob.ai"
```

### Quick GitHub OAuth Setup

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: AI Codebase Autopilot
   - **Homepage URL**: `http://localhost:3000`
   - **Callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret to `.env`

## Step 3: Initialize Database (1 minute)

```bash
# Push database schema
npx prisma db push

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

## Step 4: Start Development Server

```bash
npm run dev
```

Visit **http://localhost:3000** 🎉

## What's Next?

### Try These Features:

1. **Sign In** with GitHub
2. **Upload a Project**:
   - Use GitHub URL: `https://github.com/vercel/next.js`
   - Or upload a ZIP file
3. **Explore Developer Mode**:
   - Browse file tree
   - View code with AI insights
   - Visualize code flows
   - Chat with AI about the code
4. **Switch to Normal User Mode**:
   - See simple explanations
   - Explore features
   - Ask questions in plain English

## Common Issues

### Database Connection Error

```bash
# Check your DATABASE_URL is correct
# Test connection:
npx prisma db pull
```

### GitHub OAuth Not Working

- Verify callback URL matches exactly
- Check NEXTAUTH_URL is correct
- Regenerate NEXTAUTH_SECRET if needed

### Port Already in Use

```bash
# Use a different port
PORT=3001 npm run dev
```

## Project Structure

```
hackathon/
├── src/
│   ├── app/              # Next.js pages & API routes
│   ├── components/       # React components
│   ├── lib/             # Core libraries
│   └── types/           # TypeScript types
├── prisma/              # Database schema
├── docs/                # Documentation
└── scripts/             # Setup scripts
```

## Key Files

- `src/app/page.tsx` - Landing page
- `src/app/dashboard/page.tsx` - Main dashboard
- `src/lib/ai/ibm-bob.ts` - AI integration
- `prisma/schema.prisma` - Database schema

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Format code
npm run format

# Database commands
npx prisma studio        # Open database GUI
npx prisma db push       # Push schema changes
npx prisma generate      # Generate Prisma Client
```

## Deploy to Vercel (5 minutes)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Then deploy to production
vercel --prod
```

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions.

## Need Help?

- 📖 [Full Documentation](README.md)
- 🏗️ [Architecture Guide](ARCHITECTURE.md)
- 🎯 [Hackathon Guide](docs/HACKATHON_GUIDE.md)
- 🚀 [Deployment Guide](docs/DEPLOYMENT.md)

## Features Overview

### 👨‍💻 Developer Mode

- Full file tree explorer
- Code viewer with syntax highlighting
- Interactive flow visualization
- AI chat with technical context
- Bug detection
- Refactoring suggestions

### 👤 Normal User Mode

- Simple project overview
- Feature cards with explanations
- Story mode
- Guided tours
- Human-friendly AI chat

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma
- **Auth**: NextAuth.js with GitHub OAuth
- **AI**: IBM Bob AI
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Flow Viz**: React Flow

## Tips for Success

1. **Start Simple**: Upload a small project first
2. **Explore Both Modes**: See the difference between developer and normal user views
3. **Use AI Chat**: Ask questions about the code
4. **Check Flows**: Visualize how the code works
5. **Read Docs**: Check the comprehensive guides

## What Makes This Special?

✨ **Dual-Mode Intelligence** - Technical AND human-friendly
🎨 **Beautiful UI** - Modern, responsive, accessible
🤖 **AI-Powered** - IBM Bob AI for deep code understanding
📊 **Visual Flows** - See how code works visually
🚀 **Production-Ready** - Enterprise-grade architecture

---

**Ready to transform how people understand code!** 🎉
