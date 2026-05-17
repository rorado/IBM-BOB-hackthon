# 🗂️ AI Codebase Autopilot - Complete Project Structure

## 📁 Full Directory Tree

```
ai-codebase-autopilot/
├── .env.local                          # Environment variables
├── .env.example                        # Environment template
├── .gitignore                          # Git ignore rules
├── next.config.js                      # Next.js configuration
├── package.json                        # Dependencies
├── tsconfig.json                       # TypeScript config
├── tailwind.config.ts                  # Tailwind configuration
├── postcss.config.js                   # PostCSS config
├── prisma/
│   ├── schema.prisma                   # Database schema
│   └── migrations/                     # Database migrations
│
├── public/
│   ├── logo.svg                        # App logo
│   ├── hero-bg.svg                     # Landing page graphics
│   └── icons/                          # UI icons
│
├── src/
│   ├── app/                            # Next.js App Router
│   │   ├── layout.tsx                  # Root layout
│   │   ├── page.tsx                    # Landing page
│   │   ├── globals.css                 # Global styles
│   │   │
│   │   ├── auth/
│   │   │   ├── signin/
│   │   │   │   └── page.tsx            # Sign in page
│   │   │   └── error/
│   │   │       └── page.tsx            # Auth error page
│   │   │
│   │   ├── upload/
│   │   │   ├── page.tsx                # Upload page
│   │   │   └── loading.tsx             # Upload loading state
│   │   │
│   │   ├── dashboard/
│   │   │   ├── layout.tsx              # Dashboard layout
│   │   │   ├── page.tsx                # Dashboard home (mode selector)
│   │   │   │
│   │   │   ├── dev/
│   │   │   │   ├── page.tsx            # Developer mode main
│   │   │   │   ├── [projectId]/
│   │   │   │   │   ├── page.tsx        # Project view
│   │   │   │   │   ├── files/
│   │   │   │   │   │   └── page.tsx    # File explorer
│   │   │   │   │   ├── chat/
│   │   │   │   │   │   └── page.tsx    # AI chat
│   │   │   │   │   └── flows/
│   │   │   │   │       └── page.tsx    # Flow visualization
│   │   │   │   └── loading.tsx
│   │   │   │
│   │   │   ├── user/
│   │   │   │   ├── page.tsx            # Normal user mode main
│   │   │   │   ├── [projectId]/
│   │   │   │   │   ├── page.tsx        # Project overview
│   │   │   │   │   ├── features/
│   │   │   │   │   │   └── page.tsx    # Feature explorer
│   │   │   │   │   ├── story/
│   │   │   │   │   │   └── page.tsx    # Story mode
│   │   │   │   │   └── guide/
│   │   │   │   │       └── page.tsx    # Guided tour
│   │   │   │   └── loading.tsx
│   │   │   │
│   │   │   ├── docs/
│   │   │   │   └── [projectId]/
│   │   │   │       └── page.tsx        # Auto-generated docs
│   │   │   │
│   │   │   └── settings/
│   │   │       └── page.tsx            # User settings
│   │   │
│   │   └── api/                        # API Routes
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts        # NextAuth handler
│   │       │
│   │       ├── projects/
│   │       │   ├── route.ts            # List/create projects
│   │       │   ├── [id]/
│   │       │   │   └── route.ts        # Get/update/delete project
│   │       │   └── upload/
│   │       │       └── route.ts        # Upload handler
│   │       │
│   │       ├── analysis/
│   │       │   ├── trigger/
│   │       │   │   └── route.ts        # Start analysis
│   │       │   ├── status/
│   │       │   │   └── route.ts        # Check status
│   │       │   └── results/
│   │       │       └── route.ts        # Get results
│   │       │
│   │       ├── chat/
│   │       │   ├── message/
│   │       │   │   └── route.ts        # Send message
│   │       │   └── history/
│   │       │       └── route.ts        # Get history
│   │       │
│   │       ├── flows/
│   │       │   ├── generate/
│   │       │   │   └── route.ts        # Generate flow
│   │       │   └── [id]/
│   │       │       └── route.ts        # Get flow
│   │       │
│   │       └── docs/
│   │           └── generate/
│   │               └── route.ts        # Generate docs
│   │
│   ├── components/                     # React components
│   │   ├── ui/                         # Base UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── toast.tsx
│   │   │
│   │   ├── layout/                     # Layout components
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── navigation.tsx
│   │   │
│   │   ├── landing/                    # Landing page components
│   │   │   ├── hero.tsx
│   │   │   ├── features.tsx
│   │   │   ├── demo.tsx
│   │   │   ├── pricing.tsx
│   │   │   ├── testimonials.tsx
│   │   │   └── cta.tsx
│   │   │
│   │   ├── upload/                     # Upload components
│   │   │   ├── github-input.tsx
│   │   │   ├── zip-uploader.tsx
│   │   │   └── upload-progress.tsx
│   │   │
│   │   ├── dashboard/                  # Dashboard components
│   │   │   ├── mode-selector.tsx
│   │   │   ├── project-card.tsx
│   │   │   ├── project-list.tsx
│   │   │   └── stats-overview.tsx
│   │   │
│   │   ├── dev-mode/                   # Developer mode components
│   │   │   ├── code-tree.tsx
│   │   │   ├── file-viewer.tsx
│   │   │   ├── code-editor.tsx
│   │   │   ├── bug-detector.tsx
│   │   │   ├── refactor-panel.tsx
│   │   │   └── test-generator.tsx
│   │   │
│   │   ├── user-mode/                  # Normal user mode components
│   │   │   ├── project-overview.tsx
│   │   │   ├── feature-card.tsx
│   │   │   ├── story-viewer.tsx
│   │   │   └── guided-tour.tsx
│   │   │
│   │   ├── flow/                       # Flow visualization components
│   │   │   ├── flow-canvas.tsx
│   │   │   ├── flow-node.tsx
│   │   │   ├── flow-edge.tsx
│   │   │   ├── flow-controls.tsx
│   │   │   └── flow-minimap.tsx
│   │   │
│   │   ├── chat/                       # Chat components
│   │   │   ├── chat-interface.tsx
│   │   │   ├── message-list.tsx
│   │   │   ├── message-item.tsx
│   │   │   ├── chat-input.tsx
│   │   │   └── context-selector.tsx
│   │   │
│   │   └── docs/                       # Documentation components
│   │       ├── doc-viewer.tsx
│   │       ├── doc-sidebar.tsx
│   │       └── doc-search.tsx
│   │
│   ├── lib/                            # Core libraries
│   │   ├── prisma.ts                   # Prisma client
│   │   ├── auth.ts                     # NextAuth config
│   │   ├── utils.ts                    # Utility functions
│   │   ├── constants.ts                # App constants
│   │   │
│   │   ├── ai/                         # AI integration
│   │   │   ├── ibm-bob.ts              # IBM Bob client
│   │   │   ├── analyzer.ts             # Code analyzer
│   │   │   ├── flow-mapper.ts          # Flow detection
│   │   │   ├── bug-detector.ts         # Bug detection
│   │   │   ├── doc-generator.ts        # Doc generation
│   │   │   └── chat-engine.ts          # Chat intelligence
│   │   │
│   │   ├── upload/                     # Upload handlers
│   │   │   ├── github.ts               # GitHub integration
│   │   │   ├── zip.ts                  # ZIP processing
│   │   │   └── file-parser.ts          # File parsing
│   │   │
│   │   └── analysis/                   # Analysis pipeline
│   │       ├── pipeline.ts             # Main pipeline
│   │       ├── language-detector.ts    # Language detection
│   │       ├── framework-detector.ts   # Framework detection
│   │       ├── dependency-mapper.ts    # Dependency mapping
│   │       └── architecture-builder.ts # Architecture detection
│   │
│   ├── hooks/                          # Custom React hooks
│   │   ├── use-project.ts              # Project data hook
│   │   ├── use-analysis.ts             # Analysis data hook
│   │   ├── use-chat.ts                 # Chat hook
│   │   ├── use-flow.ts                 # Flow data hook
│   │   ├── use-mode.ts                 # Mode switching hook
│   │   └── use-toast.ts                # Toast notifications
│   │
│   ├── types/                          # TypeScript types
│   │   ├── index.ts                    # Main types export
│   │   ├── project.ts                  # Project types
│   │   ├── analysis.ts                 # Analysis types
│   │   ├── flow.ts                     # Flow types
│   │   ├── chat.ts                     # Chat types
│   │   └── user.ts                     # User types
│   │
│   ├── styles/                         # Additional styles
│   │   ├── animations.css              # Custom animations
│   │   └── themes.css                  # Theme variables
│   │
│   └── utils/                          # Utility functions
│       ├── format.ts                   # Formatting utilities
│       ├── validation.ts               # Input validation
│       ├── api.ts                      # API helpers
│       └── storage.ts                  # Local storage helpers
│
├── docs/                               # Documentation
│   ├── SETUP.md                        # Setup guide
│   ├── API.md                          # API documentation
│   ├── DEPLOYMENT.md                   # Deployment guide
│   └── HACKATHON_GUIDE.md              # 48-hour implementation plan
│
└── scripts/                            # Utility scripts
    ├── setup-db.sh                     # Database setup
    ├── seed-data.ts                    # Seed sample data
    └── generate-types.ts               # Type generation
```

## 📦 Key Dependencies (package.json)

### Core Dependencies

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.4.0",

    "@prisma/client": "^5.12.0",
    "next-auth": "^4.24.0",

    "react-flow-renderer": "^10.3.17",
    "framer-motion": "^11.0.0",

    "@tailwindcss/forms": "^0.5.7",
    "@tailwindcss/typography": "^0.5.12",

    "zod": "^3.22.0",
    "zustand": "^4.5.0",

    "axios": "^1.6.0",
    "swr": "^2.2.0",

    "react-markdown": "^9.0.0",
    "react-syntax-highlighter": "^15.5.0",

    "date-fns": "^3.6.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "prisma": "^5.12.0",
    "@types/node": "^20.12.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0"
  }
}
```

## 🎯 File Purposes

### Configuration Files

**next.config.js**

- Next.js configuration
- Image optimization
- API routes setup
- Environment variables

**tsconfig.json**

- TypeScript compiler options
- Path aliases (@/ for src/)
- Strict type checking

**tailwind.config.ts**

- Custom color palette
- Typography settings
- Animation configurations
- Plugin setup

**prisma/schema.prisma**

- Database models
- Relationships
- Indexes
- Enums

### Core Application Files

**src/app/layout.tsx**

- Root layout wrapper
- Global providers
- Font loading
- Metadata

**src/app/page.tsx**

- Landing page
- Hero section
- Feature showcase
- CTA sections

**src/lib/auth.ts**

- NextAuth configuration
- GitHub OAuth setup
- Session management
- JWT handling

**src/lib/prisma.ts**

- Prisma client singleton
- Connection pooling
- Error handling

**src/lib/ai/ibm-bob.ts**

- IBM Bob AI client
- API integration
- Request/response handling
- Error management

### Component Organization

**ui/** - Reusable base components

- Buttons, inputs, cards
- Modals, dropdowns, tabs
- Consistent styling
- Accessibility features

**layout/** - Layout components

- Header with navigation
- Sidebar with menu
- Footer with links
- Responsive behavior

**landing/** - Marketing components

- Hero with animation
- Feature cards
- Demo section
- Pricing table

**dashboard/** - Dashboard components

- Mode selector
- Project cards
- Statistics
- Quick actions

**dev-mode/** - Developer features

- Code tree viewer
- File explorer
- AI chat panel
- Flow visualizer

**user-mode/** - User-friendly features

- Simple overview
- Feature explorer
- Story mode
- Guided tour

**flow/** - Flow visualization

- React Flow canvas
- Custom nodes
- Custom edges
- Controls and minimap

**chat/** - Chat interface

- Message list
- Input field
- Context selector
- Typing indicator

## 🔄 Data Flow

### Upload Flow

```
User → Upload Page → API Route → File Storage → Database → AI Queue
```

### Analysis Flow

```
AI Queue → IBM Bob → Analysis Results → Database → Dashboard Update
```

### Chat Flow

```
User Message → Chat API → IBM Bob (with context) → Response → UI
```

### Visualization Flow

```
Project Data → Flow Generator → React Flow Graph → Interactive UI
```

## 🎨 Styling Strategy

### Tailwind Classes

- Utility-first approach
- Custom color palette
- Responsive breakpoints
- Dark mode support

### Framer Motion

- Page transitions
- Component animations
- Gesture interactions
- Scroll animations

### CSS Modules

- Component-specific styles
- Scoped styling
- Animation keyframes
- Theme variables

## 🚀 Build & Development

### Development

```bash
npm run dev          # Start dev server
npm run db:push      # Push schema to DB
npm run db:studio    # Open Prisma Studio
```

### Production

```bash
npm run build        # Build for production
npm run start        # Start production server
npm run db:migrate   # Run migrations
```

### Database

```bash
npx prisma generate  # Generate Prisma Client
npx prisma migrate dev  # Create migration
npx prisma studio    # Open database GUI
```

## 📝 Environment Variables

Required in `.env.local`:

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# GitHub OAuth
GITHUB_ID="your-github-oauth-id"
GITHUB_SECRET="your-github-oauth-secret"

# IBM Bob AI
IBM_BOB_API_KEY="your-ibm-bob-key"
IBM_BOB_API_URL="https://api.ibm-bob.com"

# Storage (optional)
AWS_S3_BUCKET="your-bucket"
AWS_ACCESS_KEY_ID="your-key"
AWS_SECRET_ACCESS_KEY="your-secret"
```

## 🎯 Implementation Priority

### Phase 1: Foundation (Hours 0-12)

- Project setup
- Database schema
- Authentication
- Basic UI components

### Phase 2: Core Features (Hours 12-24)

- Upload system
- AI integration
- Dashboard layout
- Mode switching

### Phase 3: Advanced Features (Hours 24-36)

- Flow visualization
- Chat system
- Developer mode
- User mode

### Phase 4: Polish (Hours 36-48)

- UI refinement
- Animations
- Testing
- Demo preparation

---

This structure is designed for:
✅ Scalability
✅ Maintainability
✅ Clear separation of concerns
✅ Easy navigation
✅ Hackathon speed
