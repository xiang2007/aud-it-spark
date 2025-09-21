# 🔍 AuditScope AI

> **Enterprise-grade AI-powered audit log analysis platform built with AWS Bedrock Nova Lite**

AuditScope AI transforms complex audit log analysis through intelligent AI interpretation, providing actionable security insights, anomaly detection, and compliance recommendations in an intuitive, AWS-designed interface.

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![AWS](https://img.shields.io/badge/AWS-Bedrock%20Nova%20Lite-FF9900?logo=amazon-aws&logoColor=white)](https://aws.amazon.com/bedrock/)
[![Vite](https://img.shields.io/badge/Vite-5.4.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.1-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and **Bun** package manager
- **AWS Account** with Bedrock access (Nova Lite model)
- **Git** for version control

### Installation
```bash
# Clone the repository
git clone https://github.com/xiang2007/aud-it-spark.git
cd aud-it-spark

# Install dependencies
bun install

# Start development server
bun run dev
```

### AWS Backend Setup
```bash
# Make setup script executable and run
chmod +x scripts/setup.sh
./scripts/setup.sh

# Deploy to AWS Lambda
./scripts/deploy.sh
```

Visit `http://localhost:5173` to access the application.

## 📋 Features

### 🎯 Core Capabilities
- **AI-Powered Analysis**: AWS Bedrock Nova Lite for intelligent audit interpretation
- **Real-time Processing**: Instant JSON validation and structured analysis
- **Anomaly Detection**: Automatic identification of suspicious patterns and outliers
- **Security Insights**: Comprehensive security threat assessment and recommendations
- **Trend Analysis**: Historical pattern recognition and predictive insights
- **Compliance Reporting**: Automated compliance check and audit trail generation

### 🎨 User Experience
- **AWS Design System**: Professional interface following AWS design principles
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Intuitive Navigation**: Clean, accessible UI with consistent AWS styling
- **Export Functionality**: Download analysis results in multiple formats
- **Real-time Feedback**: Instant validation and processing status updates

### 🔒 Security & Performance
- **Serverless Architecture**: AWS Lambda for scalable, secure processing
- **Data Validation**: Comprehensive input sanitization and JSON schema validation
- **Error Handling**: Robust error management with user-friendly feedback
- **Performance Optimization**: Lazy loading, code splitting, and efficient bundling

## 🏗️ Architecture

### Frontend Stack
- **React 18.3.1** with TypeScript for type-safe development
- **Vite** for fast build tooling and development server
- **Tailwind CSS** with custom AWS Design System integration
- **shadcn/ui** for consistent, accessible UI components
- **Bun** for fast package management and script execution

### Backend Infrastructure
- **AWS Lambda** (Python 3.11) for serverless compute
- **API Gateway** for RESTful API management
- **AWS Bedrock Nova Lite** for AI-powered analysis
- **S3** for static hosting and file storage
- **CloudWatch** for logging and monitoring

### Project Structure
```
aud-it-spark/
├── 📁 src/                     # Frontend application source
│   ├── 📁 components/          # Reusable UI components
│   │   ├── Navigation.tsx      # Main navigation component
│   │   └── 📁 ui/             # shadcn/ui component library
│   ├── 📁 pages/              # Application pages
│   │   ├── Index.tsx          # Landing page with hero section
│   │   ├── Upload.tsx         # File upload and validation
│   │   ├── Results.tsx        # Analysis results display
│   │   └── NotFound.tsx       # 404 error page
│   ├── 📁 hooks/              # Custom React hooks
│   ├── 📁 lib/                # Utilities and API integration
│   └── 📁 assets/             # Static assets and styles
├── 📁 aws-backend/            # AWS Lambda backend
│   ├── lambda_function.py     # Main Lambda function
│   ├── lambda-deployment.zip  # Deployment package
│   └── test-payload.json      # Test data and examples
├── 📁 docs/                   # Comprehensive documentation
│   └── AWS_SETUP_GUIDE.md     # Detailed AWS setup instructions
├── 📁 scripts/                # Automation and utility scripts
│   ├── deploy.sh              # AWS deployment automation
│   └── setup.sh               # Environment setup script
├── 📁 public/                 # Static public assets
└── 📁 dist/                   # Built application output
```

## 🛠️ Development

### Available Scripts
```bash
# Development
bun run dev          # Start development server with HMR
bun run build        # Build for production
bun run preview      # Preview production build locally
bun run lint         # Run ESLint for code quality

# AWS Operations
./scripts/setup.sh   # Configure AWS environment
./scripts/deploy.sh  # Deploy backend to AWS Lambda

# Testing
bun run test         # Run test suite (when implemented)
```

### Environment Configuration
Create a `.env.local` file for local development:
```env
VITE_API_ENDPOINT=your-api-gateway-endpoint
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

### Code Quality Standards
- **TypeScript** strict mode enabled for type safety
- **ESLint** with React and TypeScript rules
- **Prettier** for consistent code formatting
- **AWS Design System** compliance for UI consistency

## 📊 Usage Examples

### 1. Upload Audit Logs
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "user": "admin@company.com",
  "action": "login",
  "ip": "192.168.1.100",
  "status": "success"
}
```

### 2. AI Analysis Response
The system provides comprehensive analysis including:
- **Anomaly Detection**: Unusual login patterns, suspicious IP addresses
- **Security Insights**: Potential threats, access violations, privilege escalations
- **Trend Analysis**: User behavior patterns, system usage trends
- **Recommendations**: Security improvements, compliance actions

## 🚀 Deployment

### Frontend Deployment (S3 + CloudFront)
```bash
# Build the application
bun run build

# Deploy to S3 (configure AWS CLI first)
aws s3 sync dist/ s3://your-bucket-name --delete
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### Backend Deployment (Lambda)
```bash
# Use the automated deployment script
./scripts/deploy.sh

# Or manually deploy
cd aws-backend
zip -r lambda-deployment.zip lambda_function.py
aws lambda update-function-code --function-name AuditScopeAI --zip-file fileb://lambda-deployment.zip
```

## 🔧 Configuration

### AWS Bedrock Setup
1. Enable AWS Bedrock in your AWS account
2. Request access to Nova Lite model
3. Configure IAM roles and permissions
4. Update Lambda function with your AWS region

### Customization Options
- **Styling**: Modify `tailwind.config.ts` for custom AWS colors
- **API Integration**: Update `src/lib/api.ts` for custom endpoints
- **UI Components**: Extend `src/components/ui/` for custom components

## 📚 Documentation

- [AWS Setup Guide](docs/AWS_SETUP_GUIDE.md) - Comprehensive AWS configuration
- [API Documentation](docs/API.md) - Backend API reference
- [Component Library](docs/COMPONENTS.md) - UI component documentation
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment instructions

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details on:
- Code of conduct and development process
- Submitting bug reports and feature requests
- Creating pull requests and code review process

## 🐛 Troubleshooting

### Common Issues
- **CORS Errors**: Ensure API Gateway CORS is configured correctly
- **AWS Permissions**: Verify IAM roles have Bedrock and Lambda access
- **Build Errors**: Check Node.js version compatibility (18+)

### Support
- **GitHub Issues**: [Report bugs or request features](https://github.com/xiang2007/aud-it-spark/issues)
- **AWS Documentation**: [Bedrock Nova Lite Guide](https://docs.aws.amazon.com/bedrock/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏷️ Version History

- **v1.0.0** - Initial release with AWS Bedrock Nova Lite integration
- **v1.1.0** - Enhanced UI with AWS Design System
- **v1.2.0** - Added comprehensive analysis features and export functionality

---
