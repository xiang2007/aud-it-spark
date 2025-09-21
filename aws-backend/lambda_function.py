import json
import boto3
import logging
from typing import Dict, Any, List

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event: Dict[str, Any], context) -> Dict[str, Any]:
    """
    Lambda function to analyze audit logs using AWS Bedrock Nova Lite
    """
    
    # Set up CORS headers
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
    
    try:
        # Handle preflight CORS requests
        if event.get('httpMethod') == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'message': 'CORS preflight'})
            }
        
        # Parse the request body
        if 'body' in event:
            body = json.loads(event['body']) if isinstance(event['body'], str) else event['body']
        else:
            body = event
            
        audit_data = body.get('auditData', [])
        
        if not audit_data:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({
                    'error': 'No audit data provided',
                    'message': 'Please provide audit log data in the request body'
                })
            }
        
        logger.info(f"Processing {len(audit_data)} audit log entries")
        
        # Initialize Bedrock client
        bedrock_client = boto3.client('bedrock-runtime', region_name='us-east-1')
        
        # Analyze the audit data using Nova Lite
        analysis_result = analyze_with_nova_lite(bedrock_client, audit_data)
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'success': True,
                'analysis': analysis_result,
                'processedEntries': len(audit_data),
                'timestamp': context.aws_request_id
            })
        }
        
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {str(e)}")
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({
                'error': 'Invalid JSON format',
                'message': str(e)
            })
        }
        
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'error': 'Internal server error',
                'message': str(e)
            })
        }

def analyze_with_nova_lite(bedrock_client, audit_data: List[Dict]) -> Dict[str, Any]:
    """
    Analyze audit log data using AWS Bedrock Nova Lite model
    """
    
    # Prepare the audit data summary for analysis
    audit_summary = prepare_audit_summary(audit_data)
    
    # Create the prompt for Nova Lite
    prompt = f"""
    You are a cybersecurity analyst specializing in audit log analysis. 
    Analyze the following audit log data and provide insights:

    AUDIT LOG DATA:
    {json.dumps(audit_summary, indent=2)}

    Please provide your analysis in the following JSON format:
    {{
        "summary": {{
            "totalEvents": number,
            "timeRange": "start_time to end_time",
            "uniqueUsers": number,
            "uniqueIPs": number
        }},
        "securityInsights": [
            {{
                "type": "security_finding_type",
                "severity": "HIGH|MEDIUM|LOW", 
                "description": "detailed description",
                "recommendation": "what to do about it"
            }}
        ],
        "anomalies": [
            {{
                "pattern": "description of unusual pattern",
                "risk": "HIGH|MEDIUM|LOW",
                "details": "specific details about the anomaly"
            }}
        ],
        "trends": [
            {{
                "trend": "trend description",
                "significance": "why this trend matters"
            }}
        ],
        "recommendations": [
            "actionable security recommendation 1",
            "actionable security recommendation 2"
        ]
    }}

    Focus on identifying security risks, unusual patterns, failed login attempts, 
    privilege escalations, and suspicious activities.
    """
    
    # Nova Lite model configuration
    model_id = "amazon.nova-lite-v1:0"
    
    request_body = {
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "text": prompt
                    }
                ]
            }
        ],
        "inferenceConfig": {
            "max_new_tokens": 4000,
            "temperature": 0.1,
            "top_p": 0.9
        }
    }
    
    try:
        # Call Nova Lite model
        response = bedrock_client.invoke_model(
            modelId=model_id,
            body=json.dumps(request_body),
            contentType="application/json",
            accept="application/json"
        )
        
        # Parse the response
        response_body = json.loads(response['body'].read())
        
        # Extract the generated text
        if 'output' in response_body and 'message' in response_body['output']:
            ai_response = response_body['output']['message']['content'][0]['text']
            
            # Clean up the AI response (remove markdown code blocks if present)
            cleaned_response = ai_response.strip()
            if cleaned_response.startswith('```json'):
                # Remove ```json at the start and ``` at the end
                cleaned_response = cleaned_response[7:]  # Remove ```json
                if cleaned_response.endswith('```'):
                    cleaned_response = cleaned_response[:-3]  # Remove trailing ```
                cleaned_response = cleaned_response.strip()
            elif cleaned_response.startswith('```'):
                # Remove ``` at the start and end
                lines = cleaned_response.split('\n')
                if lines[0].strip() == '```' or lines[0].strip().startswith('```'):
                    lines = lines[1:]  # Remove first line
                if lines and lines[-1].strip() == '```':
                    lines = lines[:-1]  # Remove last line
                cleaned_response = '\n'.join(lines).strip()
            
            # Try to parse as JSON, fallback to text if it fails
            try:
                analysis_result = json.loads(cleaned_response)
                return analysis_result
            except json.JSONDecodeError as e:
                logger.error(f"JSON parsing error: {str(e)}")
                logger.error(f"Cleaned response: {cleaned_response[:500]}...")
                # If AI didn't return valid JSON, return a structured response
                return {
                    "summary": {
                        "totalEvents": len(audit_data),
                        "analysisNote": "AI response received but JSON parsing failed"
                    },
                    "aiResponse": ai_response[:1000] + "..." if len(ai_response) > 1000 else ai_response,
                    "securityInsights": [],
                    "anomalies": [],
                    "trends": [],
                    "recommendations": ["Review the AI response manually for insights"]
                }
        else:
            raise Exception("Unexpected response format from Nova Lite")
            
    except Exception as e:
        logger.error(f"Bedrock Nova Lite error: {str(e)}")
        # Return a fallback analysis
        return get_fallback_analysis(audit_data)

def prepare_audit_summary(audit_data: List[Dict]) -> Dict[str, Any]:
    """
    Prepare a concise summary of audit data for AI analysis
    """
    
    if not audit_data:
        return {}
    
    # Extract key fields commonly found in audit logs
    summary = {
        "totalEntries": len(audit_data),
        "sampleEntries": audit_data[:5],  # First 5 entries for context
        "fieldAnalysis": {}
    }
    
    # Analyze common fields across all entries
    all_fields = set()
    for entry in audit_data:
        if isinstance(entry, dict):
            all_fields.update(entry.keys())
    
    summary["fieldAnalysis"]["availableFields"] = list(all_fields)
    
    # Extract common patterns
    if audit_data and isinstance(audit_data[0], dict):
        # Look for common audit log fields
        common_fields = ['timestamp', 'user', 'action', 'source_ip', 'event_type', 
                        'status', 'resource', 'user_agent', 'response_code']
        
        for field in common_fields:
            values = []
            for entry in audit_data[:100]:  # Sample first 100 entries
                if isinstance(entry, dict) and field in entry:
                    values.append(entry[field])
            
            if values:
                unique_values = list(set(values))
                summary["fieldAnalysis"][field] = {
                    "sampleValues": unique_values[:10],  # First 10 unique values
                    "totalUnique": len(unique_values)
                }
    
    return summary

def get_fallback_analysis(audit_data: List[Dict]) -> Dict[str, Any]:
    """
    Provide basic analysis when AI model is unavailable
    """
    
    total_events = len(audit_data)
    
    # Basic statistical analysis
    users = set()
    ips = set()
    actions = set()
    
    for entry in audit_data:
        if isinstance(entry, dict):
            # Try common field names for users
            for user_field in ['user', 'username', 'userId', 'actor']:
                if user_field in entry:
                    users.add(str(entry[user_field]))
                    break
            
            # Try common field names for IPs
            for ip_field in ['ip', 'source_ip', 'sourceIP', 'clientIP']:
                if ip_field in entry:
                    ips.add(str(entry[ip_field]))
                    break
            
            # Try common field names for actions
            for action_field in ['action', 'event', 'eventType', 'activity']:
                if action_field in entry:
                    actions.add(str(entry[action_field]))
                    break
    
    return {
        "summary": {
            "totalEvents": total_events,
            "uniqueUsers": len(users),
            "uniqueIPs": len(ips),
            "uniqueActions": len(actions),
            "note": "Basic analysis - AI model unavailable"
        },
        "securityInsights": [
            {
                "type": "data_overview",
                "severity": "INFO",
                "description": f"Processed {total_events} audit events from {len(users)} users and {len(ips)} IP addresses",
                "recommendation": "Enable AI analysis for deeper security insights"
            }
        ],
        "anomalies": [],
        "trends": [
            {
                "trend": f"Dataset contains {len(actions)} different action types",
                "significance": "Variety in actions may indicate normal business operations or potential suspicious activity"
            }
        ],
        "recommendations": [
            "Enable AWS Bedrock Nova Lite for AI-powered analysis",
            "Review logs for failed authentication attempts",
            "Monitor for unusual access patterns",
            "Implement real-time alerting for high-risk activities"
        ]
    }