# AWS Backend Documentation

## Lambda Function Details

**Function Name**: `audit-log-analyzer`
**Runtime**: Python 3.11
**Handler**: `lambda_function.lambda_handler`
**Timeout**: 30 seconds
**Memory**: 256 MB

## Files

- `lambda_function.py` - Main Lambda function with AI analysis
- `lambda-deployment.zip` - Deployment package
- `test-payload.json` - Sample test data

## API Gateway Endpoint

```
POST https://4l2ijugoc3.execute-api.us-east-1.amazonaws.com/prod/analyze
```

### Request Format
```json
{
  "auditData": [
    {
      "user": "test_user",
      "action": "LOGIN",
      "timestamp": "2025-01-21T10:00:00Z",
      "source_ip": "192.168.1.100"
    }
  ]
}
```

### Response Format
```json
{
  "success": true,
  "analysis": {
    "summary": {
      "totalEvents": 2,
      "uniqueUsers": 2,
      "timeRange": "2025-01-21T10:00:00Z to 2025-01-21T10:05:00Z"
    },
    "securityInsights": [...],
    "anomalies": [...],
    "trends": [...],
    "recommendations": [...]
  }
}
```

## Deployment

Update Lambda function:
```bash
aws lambda update-function-code \
    --function-name audit-log-analyzer \
    --region us-east-1 \
    --zip-file fileb://lambda-deployment.zip
```

## Testing

Test the function locally:
```bash
curl -X POST https://your-api-endpoint/prod/analyze \
  -H "Content-Type: application/json" \
  -d @test-payload.json
```