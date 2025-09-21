# AWS Lambda Deployment Instructions

## Step 1: Deploy the Lambda Function

### Option A: Using AWS Console (Recommended)

1. **Go to AWS Lambda Console**: https://console.aws.amazon.com/lambda/
2. **Create Function**:
   - Click "Create function"
   - Choose "Author from scratch"
   - Function name: `audit-log-analyzer`
   - Runtime: `Python 3.11`
   - Architecture: `x86_64`
   - Click "Create function"

3. **Upload the Code**:
   - In the Lambda function console, scroll down to the "Code source" section
   - Delete the existing code in `lambda_function.py`
   - Copy and paste the code from `lambda_function.py` in this project
   - Click "Deploy"

4. **Configure the Function**:
   - **Timeout**: Go to Configuration → General configuration → Edit
   - Set timeout to `5 minutes` (300 seconds)
   - **Memory**: Set to `512 MB` or higher

### Option B: Using AWS CLI

```bash
# Create a deployment package
zip lambda-deployment.zip lambda_function.py

# Create the Lambda function
aws lambda create-function \
  --function-name audit-log-analyzer \
  --runtime python3.11 \
  --role arn:aws:iam::YOUR-ACCOUNT-ID:role/lambda-execution-role \
  --handler lambda_function.lambda_handler \
  --zip-file fileb://lambda-deployment.zip \
  --timeout 300 \
  --memory-size 512
```

## Step 2: Set up IAM Permissions

The Lambda function needs permissions to access AWS Bedrock. Create or attach this policy:

### IAM Policy for Bedrock Access

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "bedrock:InvokeModel",
                "bedrock:ListFoundationModels"
            ],
            "Resource": [
                "arn:aws:bedrock:*:*:model/amazon.nova-lite-v1:0"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "arn:aws:logs:*:*:*"
        }
    ]
}
```

### Steps to Apply IAM Policy

1. **Go to IAM Console**: https://console.aws.amazon.com/iam/
2. **Find your Lambda execution role**:
   - Go to Roles
   - Search for your Lambda function's role (usually starts with your function name)
3. **Add the policy**:
   - Click on the role
   - Click "Add permissions" → "Create inline policy"
   - Paste the JSON policy above
   - Name it `BedrockNovaLiteAccess`
   - Click "Create policy"

## Step 3: Create API Gateway

### Using AWS Console

1. **Go to API Gateway Console**: https://console.aws.amazon.com/apigateway/
2. **Create API**:
   - Click "Create API"
   - Choose "REST API" (not Private)
   - Click "Build"
   - API name: `audit-analyzer-api`
   - Click "Create API"

3. **Create Resource and Method**:
   - Click "Actions" → "Create Resource"
   - Resource name: `analyze`
   - Resource path: `/analyze`
   - Enable CORS: ✓
   - Click "Create Resource"

4. **Add POST Method**:
   - Select the `/analyze` resource
   - Click "Actions" → "Create Method"
   - Choose "POST" from dropdown
   - Integration type: "Lambda Function"
   - Lambda function: `audit-log-analyzer`
   - Click "Save"

5. **Enable CORS**:
   - Select the `/analyze` resource
   - Click "Actions" → "Enable CORS"
   - Access-Control-Allow-Origin: `*`
   - Access-Control-Allow-Headers: `Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token`
   - Click "Enable CORS and replace existing CORS headers"

6. **Deploy API**:
   - Click "Actions" → "Deploy API"
   - Deployment stage: "prod"
   - Click "Deploy"
   - **Note the Invoke URL** - you'll need this for your React app

## Step 4: Test the Setup

You can test your Lambda function directly in the AWS console:

### Test Event (JSON)
```json
{
  "auditData": [
    {
      "timestamp": "2025-09-21T10:30:00Z",
      "user": "john.doe@company.com",
      "action": "LOGIN_SUCCESS",
      "source_ip": "192.168.1.100",
      "user_agent": "Mozilla/5.0 Chrome/120.0"
    },
    {
      "timestamp": "2025-09-21T10:35:00Z", 
      "user": "admin@company.com",
      "action": "PRIVILEGE_ESCALATION",
      "source_ip": "10.0.0.50",
      "user_agent": "curl/7.68.0"
    }
  ]
}
```

## Step 5: Update Your React App

Add this API endpoint URL to your React app environment. The API Gateway invoke URL will look like:

`https://abc123def4.execute-api.us-east-1.amazonaws.com/prod/analyze`

## Troubleshooting

### Common Issues:

1. **403 Forbidden**: Check IAM permissions for Bedrock access
2. **Timeout**: Increase Lambda timeout to 5+ minutes  
3. **CORS Errors**: Ensure CORS is properly configured on API Gateway
4. **Nova Lite Unavailable**: The function includes fallback analysis

### Enable Bedrock Nova Lite

If you get errors about Nova Lite not being available:

1. Go to AWS Bedrock Console: https://console.aws.amazon.com/bedrock/
2. Go to "Model access" in the left sidebar
3. Click "Request model access"
4. Find "Amazon Nova Lite" and request access
5. Wait for approval (usually instant for Nova models)

## Cost Considerations

- **Lambda**: $0.20 per 1M requests + $0.0000166667 per GB-second
- **API Gateway**: $3.50 per million API calls
- **Bedrock Nova Lite**: ~$0.00015 per 1K input tokens, ~$0.00060 per 1K output tokens
- **S3**: Minimal cost for hosting static website

For typical audit log analysis, costs should be very low (under $1/month for moderate usage).