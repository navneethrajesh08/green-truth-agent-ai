
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Shield, Brain, Settings, Upload, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import DocumentUpload from "@/components/DocumentUpload";
import GreenwashingAnalysis from "@/components/GreenwashingAnalysis";
import ContentOptimizer from "@/components/ContentOptimizer";
import AIAgentChat from "@/components/AIAgentChat";
import LLMConfiguration from "@/components/LLMConfiguration";
import CompanyReportUpload from "@/components/CompanyReportUpload";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [activeTab, setActiveTab] = useState("detect");
  const [uploadedDocument, setUploadedDocument] = useState<File | string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [companyReport, setCompanyReport] = useState<File | null>(null);
  const { toast } = useToast();

  const handleDocumentUpload = (fileOrText: File | string) => {
    setUploadedDocument(fileOrText);
    
    if (typeof fileOrText === 'string') {
      toast({
        title: "Text content ready",
        description: "Your text is ready for analysis",
      });
    } else {
      toast({
        title: "Document uploaded successfully",
        description: `${fileOrText.name} is ready for analysis`,
      });
    }
  };

  const handleCompanyReportUpload = (file: File) => {
    setCompanyReport(file);
    toast({
      title: "Company report uploaded",
      description: "P&G sustainability report will be used for fact-checking",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">P&G GreenGuard</h1>
                <p className="text-sm text-gray-600">AI-Powered Greenwashing Detection & Communication Optimizer</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LLMConfiguration />
              <CompanyReportUpload onUpload={handleCompanyReportUpload} />
              {companyReport && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  P&G Report Loaded
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Dashboard */}
        {analysisResults && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
                <Shield className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {analysisResults?.overallScore}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {analysisResults?.riskLevel} Risk
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">EU Compliance</CardTitle>
                <span className="text-xs text-blue-600">Green Claims Directive</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {analysisResults?.compliance.eu}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">US Compliance</CardTitle>
                <span className="text-xs text-blue-600">FTC Green Guides</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {analysisResults?.compliance.us}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Violations Found</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {analysisResults?.violations.length || 0}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm">
            <TabsTrigger value="detect" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Detect Greenwashing</span>
            </TabsTrigger>
            <TabsTrigger value="optimize" className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Optimize Content</span>
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>Communication Creation</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="detect">
            <DocumentUpload 
              onUpload={handleDocumentUpload}
              onAnalysisComplete={setAnalysisResults}
              companyReport={companyReport}
            />
            
            {analysisResults && (
              <div className="mt-6">
                <GreenwashingAnalysis 
                  results={analysisResults}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="optimize">
            <ContentOptimizer 
              analysisResults={analysisResults}
              uploadedDocument={uploadedDocument}
            />
          </TabsContent>

          <TabsContent value="agents">
            <AIAgentChat />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
