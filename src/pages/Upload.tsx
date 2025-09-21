import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload as UploadIcon, FileText, AlertCircle, CheckCircle } from "lucide-react";
import Navigation from "@/components/Navigation";

const Upload = () => {
  const [jsonText, setJsonText] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateAndProcessJSON = (jsonString: string) => {
    setIsValidating(true);
    try {
      const parsed = JSON.parse(jsonString);
      localStorage.setItem("auditData", JSON.stringify(parsed));
      toast({
        title: "JSON Validated Successfully",
        description: "Your audit log has been parsed and is ready for analysis.",
      });
      navigate("/results");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Invalid JSON Format",
        description: "Please check your JSON syntax and try again.",
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
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Upload Audit Logs</h1>
          <p className="text-muted-foreground">
            Upload your JSON audit logs for AI-powered analysis and insights
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* File Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UploadIcon className="h-5 w-5" />
                <span>File Upload</span>
              </CardTitle>
              <CardDescription>
                Drag and drop or click to upload your JSON audit log file
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Click to select or drag and drop your JSON file here
                </p>
                <p className="text-xs text-muted-foreground">
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Paste JSON</span>
              </CardTitle>
              <CardDescription>
                Alternatively, paste your JSON audit log directly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your JSON audit log here..."
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Button
            onClick={() => validateAndProcessJSON(jsonText)}
            disabled={!jsonText.trim() || isValidating}
            className="px-8"
          >
            {isValidating ? (
              <>
                <AlertCircle className="h-4 w-4 mr-2 animate-spin" />
                Validating...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Process & Analyze
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setJsonText("")}
            disabled={!jsonText.trim()}
          >
            Clear
          </Button>
        </div>

        {/* Sample JSON Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Sample JSON Format</CardTitle>
            <CardDescription>
              Your audit log should follow this general structure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
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