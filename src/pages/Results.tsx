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
  Activity,
  Shield,
  TrendingUp,
  Info
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { analyzeAuditData, type AIAnalysisResult } from "@/lib/api";

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
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedData = localStorage.getItem("auditData");
    const storedAnalysis = localStorage.getItem("aiAnalysis");
    
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
    
    if (storedAnalysis) {
      try {
        setAiAnalysis(JSON.parse(storedAnalysis));
      } catch (error) {
        console.error("Error parsing stored AI analysis:", error);
      }
    }
  }, [toast]);

  // Re-analyze with AI (refresh analysis)
  const analyzeWithAI = async () => {
    if (!auditData) {
      toast({
        variant: "destructive",
        title: "No Data Available",
        description: "Please upload audit data first.",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const result = await analyzeAuditData(auditData);
      setAiAnalysis(result);
      
      // Store the updated analysis
      localStorage.setItem("aiAnalysis", JSON.stringify(result));
      
      toast({
        title: "AI Analysis Complete",
        description: "Your audit log has been re-analyzed by Nova Lite AI.",
      });
    } catch (error: any) {
      console.error("Re-analysis error:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message || "Unable to analyze with AI. Please check your configuration.",
      });
    } finally {
      setIsAnalyzing(false);
    }
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
      <div className="min-h-screen bg-aws_squid_ink-900">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <Card className="text-center bg-white border-aws_gray-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-center space-x-2 text-aws_blue-800">
                <AlertTriangle className="h-5 w-5 text-aws_orange-500" />
                <span>No Data Available</span>
              </CardTitle>
              <CardDescription className="text-aws_gray-600">
                Please upload an audit log first to view analysis results.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => window.location.href = '/upload'}
                className="bg-aws_orange-500 hover:bg-aws_orange-600 text-white border-0 font-medium"
              >
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
    <div className="min-h-screen bg-aws_squid_ink-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Audit Analysis Results</h1>
            <p className="text-aws_gray-300">
              Comprehensive analysis of your audit log data
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button
              onClick={analyzeWithAI}
              disabled={isAnalyzing}
              className="bg-aws_orange-500 hover:bg-aws_orange-600 text-white border-0 shadow-lg font-medium"
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
            
            <Button 
              variant="outline" 
              onClick={exportResults}
              className="border-aws_gray-400 text-aws_gray-700 hover:bg-aws_gray-100 hover:text-aws_blue-800 hover:border-aws_gray-500"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Summary Stats */}
          <Card className="bg-white border-aws_gray-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2 text-aws_blue-800">
                <Activity className="h-5 w-5 text-aws_orange-500" />
                <span>Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-aws_gray-600">Total Events</span>
                <span className="font-semibold text-aws_blue-800">{events.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-aws_gray-600">Access Granted</span>
                <span className="font-semibold text-green-600">
                  {events.filter((e: AuditEvent) => e["Access granted"] === "Yes").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-aws_gray-600">Access Denied</span>
                <span className="font-semibold text-red-600">
                  {events.filter((e: AuditEvent) => e["Access granted"] === "No").length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-aws_gray-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2 text-aws_blue-800">
                <Calendar className="h-5 w-5 text-aws_orange-500" />
                <span>Time Range</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm text-aws_gray-600 block">First Event</span>
                <span className="font-semibold text-aws_blue-800">
                  {events[0]?.["Hire Date"] ? new Date(events[0]["Hire Date"]).toLocaleString() : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-sm text-aws_gray-600 block">Last Event</span>
                <span className="font-semibold text-aws_blue-800">
                  {events[events.length - 1]?.["Date of Approval"] ? new Date(events[events.length - 1]["Date of Approval"]).toLocaleString() : 'N/A'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-aws_gray-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2 text-aws_blue-800">
                <User className="h-5 w-5 text-aws_orange-500" />
                <span>Users</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <span className="text-sm text-aws_gray-600 block">Unique Users</span>
                <span className="font-semibold text-aws_blue-800">
                  {new Set(events.map((e: AuditEvent) => e["Name"]).filter(Boolean)).size}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Analysis Results */}
        {aiAnalysis && (
          <div className="space-y-6 mb-8">
            {/* Analysis Summary */}
            <Card className="bg-white border-aws_gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-aws_blue-800">
                  <Brain className="h-5 w-5 text-aws_orange-500" />
                  <span>AI Analysis Summary</span>
                </CardTitle>
                <CardDescription className="text-aws_gray-600">
                  Overview by AWS Bedrock Nova Lite
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-aws_gray-50 p-4 rounded-lg border border-aws_gray-200">
                    <div className="text-2xl font-bold text-aws_blue-800">{aiAnalysis.summary.totalEvents}</div>
                    <div className="text-sm text-aws_gray-600">Total Events</div>
                  </div>
                  {aiAnalysis.summary.uniqueUsers && (
                    <div className="bg-aws_gray-50 p-4 rounded-lg border border-aws_gray-200">
                      <div className="text-2xl font-bold text-aws_blue-800">{aiAnalysis.summary.uniqueUsers}</div>
                      <div className="text-sm text-aws_gray-600">Unique Users</div>
                    </div>
                  )}
                  {/* {aiAnalysis.summary.uniqueIPs && (
                    <div className="bg-aws_gray-50 p-4 rounded-lg border border-aws_gray-200">
                      <div className="text-2xl font-bold text-aws_blue-800">{aiAnalysis.summary.uniqueIPs}</div>
                      <div className="text-sm text-aws_gray-600">Unique IPs</div>
                    </div>
                  )} */}
                  {aiAnalysis.summary.timeRange && (
                    <div className="bg-aws_gray-50 p-4 rounded-lg border border-aws_gray-200">
                      <div className="text-sm font-semibold text-aws_blue-800">{aiAnalysis.summary.timeRange}</div>
                      <div className="text-sm text-aws_gray-600">Time Range</div>
                    </div>
                  )}
                </div>
                {aiAnalysis.summary.analysisNote && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Info className="h-4 w-4 text-amber-600 mt-0.5" />
                      <span className="text-sm text-amber-800">{aiAnalysis.summary.analysisNote}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Insights */}
            {aiAnalysis.securityInsights.length > 0 && (
              <Card className="bg-white border-aws_gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-aws_blue-800">
                    <Shield className="h-5 w-5 text-aws_orange-500" />
                    <span>Security Insights</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aiAnalysis.securityInsights.map((insight, index) => (
                      <div key={index} className="bg-aws_gray-50 border border-aws_gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-medium text-aws_blue-800">{insight.type.replace(/_/g, ' ').toUpperCase()}</div>
                          <Badge 
                            className={
                              insight.severity === 'HIGH' ? 'bg-red-600 hover:bg-red-700 text-white' : 
                              insight.severity === 'MEDIUM' ? 'bg-amber-600 hover:bg-amber-700 text-white' :
                              insight.severity === 'LOW' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-aws_gray-600 hover:bg-aws_gray-700 text-white'
                            }
                          >
                            {insight.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-aws_gray-700 mb-2">{insight.description}</p>
                        <p className="text-sm font-medium text-aws_blue-700">Recommendation: {insight.recommendation}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Anomalies */}
            {aiAnalysis.anomalies.length > 0 && (
              <Card className="bg-white border-aws_gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-aws_blue-800">
                    <AlertTriangle className="h-5 w-5 text-aws_orange-500" />
                    <span>Anomalies Detected</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {aiAnalysis.anomalies.map((anomaly, index) => (
                      <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-medium text-red-800">{anomaly.pattern}</div>
                          <Badge className={anomaly.risk === 'HIGH' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-amber-600 hover:bg-amber-700 text-white'}>
                            {anomaly.risk} RISK
                          </Badge>
                        </div>
                        <p className="text-sm text-red-700">{anomaly.details}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Trends */}
            {aiAnalysis.trends.length > 0 && (
              <Card className="bg-white border-aws_gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-aws_blue-800">
                    <TrendingUp className="h-5 w-5 text-aws_orange-500" />
                    <span>Trends Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {aiAnalysis.trends.map((trend, index) => (
                      <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="font-medium text-blue-800 mb-1">{trend.trend}</div>
                        <p className="text-sm text-blue-700">{trend.significance}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            {aiAnalysis.recommendations.length > 0 && (
              <Card className="bg-white border-aws_gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-aws_blue-800">
                    <CheckCircle className="h-5 w-5 text-aws_orange-500" />
                    <span>Recommendations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {aiAnalysis.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-aws_gray-700">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Event Details Table */}
        <Card className="bg-white border-aws_gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-aws_blue-800">
              <Eye className="h-5 w-5 text-aws_orange-500" />
              <span>Event Details</span>
            </CardTitle>
            <CardDescription className="text-aws_gray-600">
              Detailed view of all audit events in your log
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-aws_gray-200 hover:bg-aws_gray-50">
                    <TableHead className="text-aws_gray-700">Status</TableHead>
                    <TableHead className="text-aws_gray-700">Ticket #</TableHead>
                    <TableHead className="text-aws_gray-700">Name</TableHead>
                    <TableHead className="text-aws_gray-700">Action</TableHead>
                    <TableHead className="text-aws_gray-700">Requestor</TableHead>
                    <TableHead className="text-aws_gray-700">Access Requested</TableHead>
                    <TableHead className="text-aws_gray-700">Approver</TableHead>
                    <TableHead className="text-aws_gray-700">Date of Approval</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.slice(0, 50).map((event: AuditEvent, index: number) => (
                    <TableRow key={event["Ticket #"] || index} className="border-b border-aws_gray-100 hover:bg-aws_gray-50">
                      <TableCell>
                        {getEventIcon(event)}
                      </TableCell>
                      <TableCell className="font-medium text-aws_blue-800">
                        {event["Ticket #"] || 'N/A'}
                      </TableCell>
                      <TableCell className="font-medium text-aws_blue-800">
                        {event["Name"] || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {getEventBadge(event["Action"] || 'unknown')}
                      </TableCell>
                      <TableCell className="text-aws_gray-700">
                        {event["Requestor"] || 'N/A'}
                      </TableCell>
                      <TableCell className="text-aws_gray-700">
                        {event["Access requested"] || 'N/A'}
                      </TableCell>
                      <TableCell className="text-aws_gray-700">
                        {event["Approver"] || 'N/A'}
                      </TableCell>
                      <TableCell className="text-aws_gray-700">
                        {event["Date of Approval"] ? new Date(event["Date of Approval"]).toLocaleString() : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {events.length > 50 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-aws_gray-600">
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