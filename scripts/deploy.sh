#!/bin/bash
# AWS Deployment Script for AuditScope AI

echo "🚀 Deploying AuditScope AI to AWS..."

# Build the React application
echo "📦 Building React application..."
npm run build

# Deploy Lambda function
echo "🔧 Deploying Lambda function..."
cd aws-backend
aws lambda update-function-code \
    --function-name audit-log-analyzer \
    --region us-east-1 \
    --zip-file fileb://lambda-deployment.zip

# Sync to S3
echo "☁️ Syncing to S3..."
cd ../
aws s3 sync dist/ s3://your-bucket-name --delete

echo "✅ Deployment complete!"
echo "🌐 Your app should be available at your S3 website URL"