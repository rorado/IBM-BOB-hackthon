#!/bin/bash

# AI Codebase Autopilot - Setup Script
# This script helps you set up the project quickly

set -e

echo "🚀 AI Codebase Autopilot - Setup Script"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Dependencies installed successfully!"
echo ""

# Setup environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created!"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env and add your credentials:"
    echo "   - DATABASE_URL"
    echo "   - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)"
    echo "   - GITHUB_ID and GITHUB_SECRET"
    echo "   - IBM_BOB_API_KEY and IBM_BOB_API_URL"
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

echo ""
echo "✅ Prisma Client generated successfully!"
echo ""

# Ask if user wants to push database schema
read -p "Do you want to push the database schema now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗄️  Pushing database schema..."
    npx prisma db push
    echo "✅ Database schema pushed successfully!"
    echo ""
fi

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your credentials"
echo "2. Run 'npm run dev' to start development server"
echo "3. Visit http://localhost:3000"
echo ""
echo "For deployment instructions, see docs/DEPLOYMENT.md"
echo ""

