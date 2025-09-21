# 🏆 Hackathon Development Guide

## 🚀 Quick Start (5 minutes)

```bash
# 1. Run the hackathon setup script
./scripts/hackathon-setup.sh

# 2. Edit your environment variables
cp .env.example .env.local
# Add your AWS credentials to .env.local

# 3. Start developing
npm run dev
```

## 📋 Essential Commands

### Development
```bash
npm run dev          # Start dev server (auto-opens browser)
npm run build        # Production build
npm run demo         # Build + preview (perfect for demos)
npm run lint         # Fix code issues automatically
npm run type-check   # Check TypeScript errors
npm run clean        # Clean build cache
```

### AWS Backend
```bash
./scripts/setup.sh   # Configure AWS environment
./scripts/deploy.sh  # Deploy Lambda function
```

## 🎯 Hackathon Tips

### 1. **Fast Development**
- Use `npm run dev` - HMR for instant updates
- TypeScript strict mode is disabled for rapid prototyping
- ESLint auto-fixes on save
- All path aliases configured (`@/components`, `@/lib`, etc.)

### 2. **Demo Preparation**
- Run `npm run demo` for production build + preview
- Server auto-starts on `http://localhost:8080`
- Network accessible for mobile demos
- Error overlays disabled for clean presentations

### 3. **AWS Integration**
- Copy `.env.example` to `.env.local`
- Add your AWS Bedrock credentials
- Lambda deployment automated via scripts
- Test payload included in `aws-backend/`

### 4. **UI Components**
- Full shadcn/ui library available
- AWS Design System colors configured
- Responsive design built-in
- Professional styling ready

## 🔧 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Navigation.tsx  # Main navigation
│   └── ui/            # shadcn/ui components
├── pages/             # Application pages
│   ├── Index.tsx      # Landing page
│   ├── Upload.tsx     # File upload
│   └── Results.tsx    # AI analysis results
├── lib/               # Utilities & API integration
└── hooks/             # Custom React hooks

aws-backend/           # Lambda function
scripts/               # Automation scripts
docs/                  # Documentation
```

## 🎨 Styling Guide

### Colors (AWS Design System)
```typescript
// Primary colors
'aws_orange'     // #FF9900 - Primary actions
'aws_blue'       // #232F3E - Headers, navigation  
'aws_squid_ink'  // #16191F - Dark backgrounds
'aws_gray'       // #545B64 - Text, borders

// Usage in components
className="bg-aws_orange text-white hover:bg-aws_orange/90"
className="text-aws_blue border-aws_gray/20"
```

### Responsive Design
```typescript
// Tailwind breakpoints configured
'sm:'   // 640px+
'md:'   // 768px+
'lg:'   // 1024px+
'xl:'   // 1280px+
'2xl:'  // 1536px+
```

## 🚨 Common Issues & Solutions

### 1. **Port 8080 in use**
```bash
# Kill any existing processes
pkill -f "vite.*8080"
npm run dev
```

### 2. **AWS Credentials**
```bash
# Check your .env.local file has:
VITE_AWS_REGION=us-east-1
VITE_API_GATEWAY_URL=your-endpoint
VITE_AWS_ACCESS_KEY_ID=your-key
VITE_AWS_SECRET_ACCESS_KEY=your-secret
```

### 3. **TypeScript Errors**
```bash
# Run type check
npm run type-check

# Most strict rules disabled for hackathons
# Focus on functionality over perfect types
```

### 4. **Build Issues**
```bash
# Clean and rebuild
npm run clean
npm run build
```

## 🏃‍♂️ Speed Development Tricks

### 1. **Component Generation**
```typescript
// Use the ui components library
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Quick AWS-styled button
<Button className="bg-aws_orange hover:bg-aws_orange/90">
  Analyze Logs
</Button>
```

### 2. **API Integration**
```typescript
// API utilities in src/lib/api.ts
import { analyzeLogs } from "@/lib/api"

// Quick mock data for development
const mockData = {
  anomalies: ["Unusual login pattern", "High-risk IP address"],
  insights: ["Security breach detected", "Compliance violation"]
}
```

### 3. **State Management**
```typescript
// Use React Query for server state
import { useQuery } from '@tanstack/react-query'

const { data, isLoading } = useQuery({
  queryKey: ['analysis'],
  queryFn: () => analyzeLogs(file)
})
```

## 🎪 Demo Day Checklist

### Before Presentation
- [ ] `npm run demo` - production build ready
- [ ] Test all features work
- [ ] Prepare sample audit log files
- [ ] Check network connectivity for mobile demos
- [ ] Have backup screenshots/recordings

### During Demo
- [ ] Start with the problem statement
- [ ] Show live upload & AI analysis
- [ ] Highlight AWS integration
- [ ] Demo mobile responsiveness
- [ ] Emphasize security insights

### Technical Stack Highlights
- [ ] React 18 + TypeScript for type safety
- [ ] AWS Bedrock Nova Lite for AI analysis  
- [ ] Serverless architecture (Lambda + API Gateway)
- [ ] Professional AWS Design System
- [ ] Real-time processing & validation

## 🔥 Advanced Features to Showcase

### 1. **AI-Powered Analysis**
- Anomaly detection with confidence scores
- Security threat identification
- Compliance recommendations
- Trend analysis and predictions

### 2. **Professional UI/UX**
- AWS Design System compliance
- Responsive across all devices
- Accessibility features built-in
- Export functionality

### 3. **Enterprise Architecture**
- Serverless scalability
- AWS best practices
- Security by design
- Performance optimized

---

**🎯 Remember:** Focus on working features over perfect code. The hackathon setup is optimized for rapid development and impressive demos!

**🚀 Good luck with your hackathon!**