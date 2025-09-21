import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload as UploadIcon, FileText, AlertCircle, CheckCircle, Brain } from "lucide-react";
import Navigation from "@/components/Navigation";
import { analyzeAuditData, type AIAnalysisResult } from "@/lib/api";

const Upload = () => {
  const [jsonText, setJsonText] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateAndProcessJSON = async (jsonString: string) => {
    setIsValidating(true);
    
    try {
      // First validate JSON syntax
      const parsed = JSON.parse(jsonString);
      
      // Ensure it's an array
      const auditArray = Array.isArray(parsed) ? parsed : [parsed];
      
      if (auditArray.length === 0) {
        throw new Error("No audit data found in JSON");
      }
      
      toast({
        title: "JSON Validated ✓",
        description: `Processing ${auditArray.length} audit entries with AI analysis...`,
      });
      
      // Call AWS Lambda function for AI analysis
      const analysisResult: AIAnalysisResult = await analyzeAuditData(auditArray);
      
      // Store both original data and AI analysis
      localStorage.setItem("auditData", JSON.stringify(auditArray));
      localStorage.setItem("aiAnalysis", JSON.stringify(analysisResult));
      
      toast({
        title: "AI Analysis Complete ✓",
        description: "Your audit log has been analyzed by Nova Lite AI. View results now.",
      });
      
      navigate("/results");
      
    } catch (error: any) {
      console.error("Analysis error:", error);
      
      let errorMessage = "Please check your JSON syntax and try again.";
      let errorTitle = "Invalid JSON Format";
      
      if (error.message?.includes("timeout")) {
        errorTitle = "Analysis Timeout";
        errorMessage = "The analysis took too long. Try with a smaller dataset or check your connection.";
      } else if (error.message?.includes("HTTP")) {
        errorTitle = "API Error";
        errorMessage = "Unable to connect to analysis service. Check your configuration.";
      } else if (!error.message?.includes("JSON")) {
        errorTitle = "Analysis Error";
        errorMessage = error.message || "An error occurred during analysis.";
      }
      
      toast({
        variant: "destructive",
        title: errorTitle,
        description: errorMessage,
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setJsonText(content);
      };
      reader.readAsText(file);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please upload a JSON file.",
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/json") {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          setJsonText(content);
        };
        reader.readAsText(file);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a JSON file.",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-aws_squid_ink-900">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Upload Audit Logs</h1>
          <p className="text-aws_gray-300">
            Upload your JSON audit logs for AI-powered analysis and insights
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* File Upload Card */}
          <Card className="bg-white border-aws_gray-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-aws_blue-800">
                <UploadIcon className="h-5 w-5 text-aws_orange-500" />
                <span>File Upload</span>
              </CardTitle>
              <CardDescription className="text-aws_gray-600">
                Drag and drop or click to upload your JSON audit log file
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  dragActive
                    ? "border-aws_orange-400 bg-aws_orange-50"
                    : "border-aws_gray-300 hover:border-aws_orange-400 hover:bg-aws_gray-50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <FileText className="h-12 w-12 text-aws_orange-500 mx-auto mb-4" />
                <p className="text-sm text-aws_gray-700 mb-2 font-medium">
                  Click to select or drag and drop your JSON file here
                </p>
                <p className="text-xs text-aws_gray-500">
                  Supports: .json files
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>

          {/* Text Input Card */}
          <Card className="bg-white border-aws_gray-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-aws_blue-800">
                <FileText className="h-5 w-5 text-aws_orange-500" />
                <span>Paste JSON</span>
              </CardTitle>
              <CardDescription className="text-aws_gray-600">
                Alternatively, paste your JSON audit log directly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your JSON audit log here..."
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                className="min-h-[200px] font-mono text-sm bg-aws_gray-50 border-aws_gray-300 text-aws_gray-800 placeholder:text-aws_gray-400 focus:border-aws_orange-400 focus:ring-aws_orange-400"
              />
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Button
            onClick={() => validateAndProcessJSON(jsonText)}
            disabled={!jsonText.trim() || isValidating}
            className="px-8 bg-aws_orange-500 hover:bg-aws_orange-600 text-white border-0 shadow-lg font-medium"
          >
            {isValidating ? (
              <>
                <Brain className="h-4 w-4 mr-2 animate-pulse" />
                AI Analyzing...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Process with AI
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setJsonText("")}
            disabled={!jsonText.trim()}
            className="border-aws_gray-300 text-aws_gray-700 hover:bg-aws_gray-50 hover:border-aws_gray-400"
          >
            Clear
          </Button>
        </div>

        {/* Sample JSON Info */}
        <Card className="mt-8 bg-white border-aws_gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-aws_blue-800">Sample JSON Format</CardTitle>
            <CardDescription className="text-aws_gray-600">
              Your audit log should follow this general structure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-aws_gray-50 border border-aws_gray-200 p-4 rounded-lg text-sm overflow-x-auto text-aws_gray-800">
{`[
  {
    "Ticket #": "TIC-10002",
    "Name": "User 3",
    "User ID": "user1002",
    "Hire Date": "2024-01-24T18:32:09Z",
    "Left Date": null,
    "Action": "Create",
    "Account creation date": "2024-01-24T18:32:09Z",
    "Requestor": "HR System",
    "Access requested": "Support Portal",
    "Approver": "hr_manager",
    "Date of Approval": "2024-01-24T18:32:09Z",
    "Access granted": "Yes",
    "Status": "active"
  }
]`}
            </pre>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Upload;