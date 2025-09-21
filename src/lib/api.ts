// API configuration for AWS services
export const API_CONFIG = {
  // Your actual API Gateway endpoint with the /analyze path
  LAMBDA_API_ENDPOINT: "https://4l2ijugoc3.execute-api.us-east-1.amazonaws.com/prod/analyze",
  
  // Request timeout in milliseconds (5 minutes)
  REQUEST_TIMEOUT: 300000,
};

export interface AIAnalysisResult {
  summary: {
    totalEvents: number;
    timeRange?: string;
    uniqueUsers?: number;
    uniqueIPs?: number;
    analysisNote?: string;
  };
  securityInsights: Array<{
    type: string;
    severity: "HIGH" | "MEDIUM" | "LOW" | "INFO";
    description: string;
    recommendation: string;
  }>;
  anomalies: Array<{
    pattern: string;
    risk: "HIGH" | "MEDIUM" | "LOW";
    details: string;
  }>;
  trends: Array<{
    trend: string;
    significance: string;
  }>;
  recommendations: string[];
  aiResponse?: string; // Fallback if JSON parsing fails
}

export interface APIResponse {
  success: boolean;
  analysis: AIAnalysisResult;
  processedEntries: number;
  timestamp: string;
  error?: string;
  message?: string;
}

/**
 * Call the AWS Lambda function to analyze audit data with Nova Lite AI
 */
export const analyzeAuditData = async (auditData: any[]): Promise<AIAnalysisResult> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.REQUEST_TIMEOUT);

  try {
    const response = await fetch(API_CONFIG.LAMBDA_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        auditData: auditData
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const rawResult = await response.json();
    
    // Handle Lambda response format (API Gateway returns statusCode, headers, body)
    let result: APIResponse;
    if (rawResult.statusCode && rawResult.body) {
      // Parse the body string into JSON
      result = JSON.parse(rawResult.body);
    } else {
      // Direct response format
      result = rawResult;
    }
    
    if (!result.success) {
      throw new Error(result.message || 'Analysis failed');
    }

    return result.analysis;

  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - analysis took too long');
    }
    
    // If the API call fails, provide a fallback analysis
    console.error('API call failed:', error);
    return getFallbackAnalysis(auditData);
  }
};

/**
 * Provide basic analysis when API is unavailable
 */
const getFallbackAnalysis = (auditData: any[]): AIAnalysisResult => {
  const totalEvents = auditData.length;
  
  // Basic analysis of the data
  const users = new Set();
  const ips = new Set();
  const actions = new Set();
  
  auditData.forEach(entry => {
    if (typeof entry === 'object' && entry !== null) {
      // Try different common field names for users
      const userFields = ['user', 'username', 'userId', 'User ID', 'Name', 'actor'];
      for (const field of userFields) {
        if (entry[field]) {
          users.add(String(entry[field]));
          break;
        }
      }
      
      // Try different common field names for IPs
      const ipFields = ['ip', 'source_ip', 'sourceIP', 'clientIP', 'remote_addr'];
      for (const field of ipFields) {
        if (entry[field]) {
          ips.add(String(entry[field]));
          break;
        }
      }
      
      // Try different common field names for actions
      const actionFields = ['action', 'event', 'eventType', 'Action', 'activity'];
      for (const field of actionFields) {
        if (entry[field]) {
          actions.add(String(entry[field]));
          break;
        }
      }
    }
  });

  return {
    summary: {
      totalEvents,
      uniqueUsers: users.size,
      uniqueIPs: ips.size,
      analysisNote: "API unavailable - showing basic analysis. Please check your Lambda function configuration."
    },
    securityInsights: [
      {
        type: "connection_status",
        severity: "INFO",
        description: `Unable to connect to AI analysis service. Processed ${totalEvents} events locally.`,
        recommendation: "Verify your AWS Lambda function and API Gateway are properly configured and deployed."
      }
    ],
    anomalies: [],
    trends: [
      {
        trend: `Dataset contains ${actions.size} different action types from ${users.size} users`,
        significance: "Basic statistics available - enable AI analysis for detailed insights"
      }
    ],
    recommendations: [
      "Deploy and configure the AWS Lambda function",
      "Update the API_CONFIG.LAMBDA_API_ENDPOINT with your actual API Gateway URL",
      "Verify AWS Bedrock Nova Lite model access is enabled",
      "Check network connectivity and CORS configuration"
    ]
  };
};