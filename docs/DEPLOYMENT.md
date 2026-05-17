# 🚀 Deployment Guide

This guide will help you deploy the AI Codebase Autopilot application to production.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (or Vercel Postgres)
- GitHub OAuth App credentials
- IBM Bob AI API credentials

## Environment Setup

### 1. Create Environment Variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

### 2. Configure Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# GitHub OAuth
GITHUB_ID="your-github-oauth-app-id"
GITHUB_SECRET="your-github-oauth-app-secret"

# IBM Bob AI
IBM_BOB_API_KEY="your-ibm-bob-api-key"
IBM_BOB_API_URL="https://api.ibm-bob.ai"
```

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed database
npx prisma db seed
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your application.

## Production Deployment

### Option 1: Vercel (Recommended)

#### Step 1: Prepare Repository

1. Push your code to GitHub
2. Ensure all files are committed

#### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Configure project settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

#### Step 3: Configure Environment Variables

Add all environment variables from your `.env` file in Vercel dashboard:

1. Go to Project Settings → Environment Variables
2. Add each variable:
   - `DATABASE_URL`
   - `NEXTAUTH_URL` (use your Vercel domain)
   - `NEXTAUTH_SECRET`
   - `GITHUB_ID`
   - `GITHUB_SECRET`
   - `IBM_BOB_API_KEY`
   - `IBM_BOB_API_URL`

#### Step 4: Setup Database

**Option A: Vercel Postgres**

1. Go to Storage tab in Vercel
2. Create new Postgres database
3. Copy connection string to `DATABASE_URL`

**Option B: External PostgreSQL**

1. Use Railway, Supabase, or any PostgreSQL provider
2. Copy connection string to `DATABASE_URL`

#### Step 5: Run Database Migrations

After deployment, run migrations:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Run migrations
vercel env pull .env.local
npx prisma db push
```

#### Step 6: Deploy

```bash
vercel --prod
```

### Option 2: Docker Deployment

#### Step 1: Create Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npx prisma generate
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Step 2: Create docker-compose.yml

```yaml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - GITHUB_ID=${GITHUB_ID}
      - GITHUB_SECRET=${GITHUB_SECRET}
      - IBM_BOB_API_KEY=${IBM_BOB_API_KEY}
      - IBM_BOB_API_URL=${IBM_BOB_API_URL}
    depends_on:
      - db

  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=autopilot
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

#### Step 3: Deploy

```bash
docker-compose up -d
```

### Option 3: Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Add environment variables
6. Add PostgreSQL database from Railway
7. Deploy

## Post-Deployment

### 1. Setup GitHub OAuth

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App:
   - Application name: AI Codebase Autopilot
   - Homepage URL: `https://yourdomain.com`
   - Authorization callback URL: `https://yourdomain.com/api/auth/callback/github`
3. Copy Client ID and Client Secret to environment variables

### 2. Test Authentication

1. Visit your deployed site
2. Click "Sign In"
3. Authorize with GitHub
4. Verify successful login

### 3. Test Upload

1. Upload a test repository
2. Verify analysis completes
3. Check dashboard displays correctly

### 4. Monitor Application

- Check Vercel logs for errors
- Monitor database connections
- Track API usage

## Troubleshooting

### Database Connection Issues

```bash
# Test database connection
npx prisma db pull

# Reset database (caution: deletes all data)
npx prisma db push --force-reset
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Authentication Issues

1. Verify `NEXTAUTH_URL` matches your domain
2. Check GitHub OAuth callback URL
3. Regenerate `NEXTAUTH_SECRET`

### API Rate Limits

- Monitor IBM Bob AI usage
- Implement caching for repeated requests
- Add rate limiting middleware

## Performance Optimization

### 1. Enable Caching

```typescript
// Add to next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
};
```

### 2. Database Optimization

```sql
-- Add indexes for common queries
CREATE INDEX idx_projects_user_id ON "Project"("userId");
CREATE INDEX idx_file_nodes_project_id ON "FileNode"("projectId");
CREATE INDEX idx_chat_messages_project_id ON "ChatMessage"("projectId");
```

### 3. CDN Configuration

- Enable Vercel Edge Network
- Configure image optimization
- Use static asset caching

## Security Checklist

- [ ] Environment variables are secure
- [ ] Database has strong password
- [ ] HTTPS is enabled
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented
- [ ] Input validation is in place
- [ ] SQL injection prevention (Prisma handles this)
- [ ] XSS protection enabled

## Monitoring

### Recommended Tools

- **Vercel Analytics**: Built-in performance monitoring
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Uptime Robot**: Uptime monitoring

### Key Metrics to Track

- Response times
- Error rates
- Database query performance
- API usage
- User engagement

## Backup Strategy

### Database Backups

```bash
# Manual backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

### Automated Backups

- Use Vercel Postgres automatic backups
- Or setup cron job for regular backups
- Store backups in S3 or similar

## Scaling

### Horizontal Scaling

- Vercel automatically scales
- Add read replicas for database
- Use Redis for caching

### Vertical Scaling

- Upgrade Vercel plan
- Increase database resources
- Optimize queries

## Support

For issues or questions:

- GitHub Issues: [your-repo]/issues
- Documentation: [your-docs-url]
- Email: support@yourdomain.com

---
