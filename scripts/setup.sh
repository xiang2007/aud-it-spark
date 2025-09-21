#!/bin/bash
# Development Setup Script for AuditScope AI

echo "🔧 Setting up AuditScope AI development environment..."

# Install dependencies
echo "📦 Installing dependencies..."
if command -v bun &> /dev/null; then
    bun install
else
    npm install
fi

# Build the project once to ensure everything works
echo "🏗️ Building project..."
npm run build

# Create .env.local template if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating environment template..."
    cat > .env.local << EOF
# AWS Configuration (Optional - for local testing)
# AWS_ACCESS_KEY_ID=your_access_key
# AWS_SECRET_ACCESS_KEY=your_secret_key
# AWS_REGION=us-east-1

# API Configuration
# VITE_API_ENDPOINT=https://your-api-gateway-url.amazonaws.com/prod
EOF
fi

echo "✅ Setup complete!"
echo "🚀 Run 'npm run dev' to start development server"
echo "📖 Check docs/AWS_SETUP_GUIDE.md for AWS setup instructions"