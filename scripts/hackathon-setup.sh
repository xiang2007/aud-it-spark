#!/bin/bash

# AuditScope AI - Hackathon Quick Start Script
# This script sets up everything you need for a hackathon demo

echo "🚀 AuditScope AI - Hackathon Setup"
echo "=================================="

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ Bun is not installed. Installing..."
    curl -fsSL https://bun.sh/install | bash
    source ~/.bashrc
fi

# Install dependencies
echo "📦 Installing dependencies..."
bun install

# Create local environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "🔧 Creating environment file..."
    cp .env.example .env.local
    echo "⚠️  Please edit .env.local with your AWS credentials"
fi

# Type check
echo "🔍 Running type check..."
bun run type-check

# Build the project
echo "🏗️  Building project..."
bun run build

# Check if port 8080 is available
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null; then
    echo "⚠️  Port 8080 is in use. Stopping any running processes..."
    pkill -f "vite.*8080" || true
fi

echo "✅ Setup complete!"
echo ""
echo "🎯 Quick Commands:"
echo "  npm run dev     - Start development server"
echo "  npm run build   - Build for production"
echo "  npm run demo    - Build and preview demo"
echo "  npm run lint    - Fix code style issues"
echo ""
echo "🌐 Development server will be available at:"
echo "  Local:   http://localhost:8080"
echo "  Network: http://[your-ip]:8080"
echo ""
echo "💡 For hackathon demos:"
echo "  1. Edit .env.local with your AWS credentials"
echo "  2. Run 'npm run demo' for a production build"
echo "  3. The app will auto-open in your browser"
echo ""
echo "🔥 Ready to hack! Good luck!"