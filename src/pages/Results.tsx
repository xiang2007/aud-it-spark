import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  Download, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye,
  Calendar,
  User,
  Activity
} from "lucide-react";
import Navigation from "@/components/Navigation";

interface AuditEvent {
  "Ticket #"?: string;
  "Name"?: string;
  "User ID"?: string;
  "Hire Date"?: string;
  "Left Date"?: string | null;
  "Action"?: string;
  "Account creation date"?: string;
  "Requestor"?: string;
  "Access requested"?: string;
  "Approver"?: string;
  "Date of Approval"?: string;
  "Access granted"?: string;
  "Status"?: string;
  [key: string]: any;
}

const Results = () => {
  const [auditData, setAuditData] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedData = localStorage.getItem("auditData");
    if (storedData) {
      try {
        setAuditData(JSON.parse(storedData));
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error Loading Data",
          description: "Failed to load audit data. Please upload again.",
        });
      }
    }
  }, [toast]);

  // AWS Bedrock Nova Lite Integration (Placeholder)
  const analyzeWithAI = async () => {
    setIsAnalyzing(true);
    
    try {
      // Placeholder for AWS Bedrock Nova Lite API call
      // Replace with actual implementation
      const response = await callAWSBedrockNovaLite(auditData);
      setAiAnalysis(response);
      
      toast({
        title: "AI Analysis Complete",
        description: "Your audit log has been analyzed by Nova Lite.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Unable to analyze with AI. Please check your configuration.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Placeholder function for AWS Bedrock Nova Lite API call
  const callAWSBedrockNovaLite = async (data: any): Promise<string> => {
    // TODO: Replace with actual AWS Bedrock Nova Lite implementation
    
    /* Example implementation structure:
    
    const API_ENDPOINT = "https://bedrock-runtime.{region}.amazonaws.com/model/{model-id}/invoke";
    const API_KEY = "your-aws-access-key"; // Should be stored securely
    
    const requestBody = {
      inputText: `Analyze this audit log data: ${JSON.stringify(data)}`,
      textGenerationConfig: {
        maxTokenCount: 4096,
        temperature: 0.7,
        topP: 0.9
      }
    };
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `AWS4-HMAC-SHA256 ${API_KEY}`, // Proper AWS signature
        'X-Amz-Target': 'AmazonBedrockRuntime.InvokeModel'
      },
      body: JSON.stringify(requestBody)
    });
    
    const result = await response.json();
    return result.results[0].outputText;
    
    */
    
    // Simulated AI response for demo purposes
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`AI Analysis Summary:
        
• Total Events Analyzed: ${auditData?.events?.length || 'N/A'}
• Security Risk Level: LOW
• Anomalies Detected: 2 minor irregularities
• Success Rate: 98.5%
• Peak Activity: 10:30 AM - 11:00 AM
• Recommendations: Monitor failed login attempts, review after-hours access`);
      }, 2000);
    });
  };

  const exportResults = () => {
    const dataStr = JSON.stringify({ auditData, aiAnalysis }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-analysis-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getEventIcon = (event: AuditEvent) => {
    if (event["Access granted"] === "No") return <XCircle className="h-4 w-4 text-destructive" />;
    if (event["Access granted"] === "Yes") return <CheckCircle className="h-4 w-4 text-success" />;
    return <Activity className="h-4 w-4 text-muted-foreground" />;
  };

  const getEventBadge = (action: string) => {
    const variants: Record<string, any> = {
      create: "default",
      update: "secondary", 
      delete: "destructive",
      approve: "outline",
      reject: "destructive",
    };
    
    return (
      <Badge variant={variants[action?.toLowerCase()] || "outline"}>
        {action}
      </Badge>
    );
  };

  if (!auditData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <span>No Data Available</span>
              </CardTitle>
              <CardDescription>
                Please upload an audit log first to view analysis results.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.href = '/upload'}>
                Upload Audit Log
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const events = Array.isArray(auditData) ? auditData : auditData.events || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Audit Analysis Results</h1>
            <p className="text-muted-foreground">
              Comprehensive analysis of your audit log data
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button
              onClick={analyzeWithAI}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-primary to-primary/80"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  AI Analysis
                </>
              )}
            </Button>
            
            <Button variant="outline" onClick={exportResults}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Summary Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Events</span>
                <span className="font-semibold">{events.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Access Granted</span>
                <span className="font-semibold text-success">
                  {events.filter((e: AuditEvent) => e["Access granted"] === "Yes").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Access Denied</span>
                <span className="font-semibold text-destructive">
                  {events.filter((e: AuditEvent) => e["Access granted"] === "No").length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Time Range</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm text-muted-foreground block">First Event</span>
                <span className="font-semibold">
                  {events[0]?.["Hire Date"] ? new Date(events[0]["Hire Date"]).toLocaleString() : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground block">Last Event</span>
                <span className="font-semibold">
                  {events[events.length - 1]?.["Date of Approval"] ? new Date(events[events.length - 1]["Date of Approval"]).toLocaleString() : 'N/A'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Users</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground block">Unique Users</span>
                <span className="font-semibold">
                  {new Set(events.map((e: AuditEvent) => e["Name"]).filter(Boolean)).size}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Analysis Results */}
        {aiAnalysis && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>AI Analysis by Nova Lite</span>
              </CardTitle>
              <CardDescription>
                Intelligent insights and recommendations based on your audit data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="text-sm whitespace-pre-wrap text-foreground">
                  {aiAnalysis}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Event Details Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Event Details</span>
            </CardTitle>
            <CardDescription>
              Detailed view of all audit events in your log
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Ticket #</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Requestor</TableHead>
                    <TableHead>Access Requested</TableHead>
                    <TableHead>Approver</TableHead>
                    <TableHead>Date of Approval</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.slice(0, 50).map((event: AuditEvent, index: number) => (
                    <TableRow key={event["Ticket #"] || index}>
                      <TableCell>
                        {getEventIcon(event)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {event["Ticket #"] || 'N/A'}
                      </TableCell>
                      <TableCell className="font-medium">
                        {event["Name"] || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {getEventBadge(event["Action"] || 'unknown')}
                      </TableCell>
                      <TableCell>
                        {event["Requestor"] || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {event["Access requested"] || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {event["Approver"] || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {event["Date of Approval"] ? new Date(event["Date of Approval"]).toLocaleString() : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {events.length > 50 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Showing first 50 events of {events.length} total events
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Results;