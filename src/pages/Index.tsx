import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileSearch, 
  Upload, 
  Brain, 
  Shield, 
  BarChart3, 
  Zap,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import Navigation from "@/components/Navigation";

const Index = () => {
  const features = [
    {
      icon: Upload,
      title: "Easy Upload",
      description: "Upload JSON audit logs via drag & drop or copy/paste. Instant validation and parsing."
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description: "Powered by AWS Bedrock Nova Lite for intelligent insights and anomaly detection."
    },
    {
      icon: Shield,
      title: "Security Focused",
      description: "Built for enterprise audit analysis with security and compliance in mind."
    },
    {
      icon: BarChart3,
      title: "Visual Analytics",
      description: "Clean, responsive data visualization with exportable results."
    }
  ];

  return (
    <div className="min-h-screen bg-aws_squid_ink-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-aws_blue-900/10 via-transparent to-aws_orange-900/5" />
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-aws_orange-500 rounded-2xl shadow-lg">
              <FileSearch className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            AI-Powered 
            <span className="bg-gradient-to-r from-aws_orange-400 to-aws_orange-500 bg-clip-text text-transparent"> Audit Log </span>
            Analysis
          </h1>
          
          <p className="text-xl text-aws_gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Upload your JSON audit logs and get instant AI-powered insights using AWS Bedrock Nova Lite. 
            Identify security anomalies, track patterns, and generate comprehensive reports.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/upload">
              <Button size="lg" className="px-8 py-3 bg-aws_orange-500 hover:bg-aws_orange-600 text-white border-0 shadow-lg font-medium">
                <Upload className="h-5 w-5 mr-2" />
                Start Analysis
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link to="/results">
              <Button size="lg" variant="outline" className="px-8 py-3 bg-aws_gray-800 border-aws_gray-800 text-aws_gray-200 hover:bg-aws_blue-800 hover:text-white hover:border-aws_blue-800">
                <BarChart3 className="h-5 w-5 mr-2" />
                View Sample
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-aws_blue-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Enterprise-Grade Audit Analysis
            </h2>
            <p className="text-lg text-aws_gray-300 max-w-2xl mx-auto">
              Comprehensive tools for security professionals and compliance teams
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white border-aws_gray-200 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-aws_orange-50 rounded-xl w-fit border border-aws_orange-200">
                    <feature.icon className="h-6 w-6 text-aws_orange-500" />
                  </div>
                  <CardTitle className="text-lg text-aws_blue-800">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-sm leading-relaxed text-aws_gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Get Started in 3 Simple Steps
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto mb-4 p-4 bg-aws_orange-500 rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Upload JSON</h3>
              <p className="text-aws_gray-300 text-sm">
                Upload your audit log file or paste JSON data directly
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto mb-4 p-4 bg-aws_orange-600 rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">AI Analysis</h3>
              <p className="text-aws_gray-300 text-sm">
                Let Nova Lite analyze patterns and identify anomalies
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto mb-4 p-4 bg-aws_orange-600 rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Export Results</h3>
              <p className="text-aws_gray-300 text-sm">
                Download comprehensive reports and insights
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-500 mb-4">
            Ready to Analyze Your Audit Logs?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start uncovering insights with AI-powered analysis today.
          </p>
          <Link to="/upload">
            <Button size="lg" variant="gradient" className="px-8 py-3">
              <Zap className="h-5 w-5 mr-2" />
              Begin Analysis
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
