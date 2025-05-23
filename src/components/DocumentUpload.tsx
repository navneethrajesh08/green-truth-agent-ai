
import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, Image, FileSpreadsheet, Presentation, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploadProps {
  onUpload: (file: File | string) => void;
  onAnalysisComplete: (results: any) => void;
  companyReport: File | null;
}

const DocumentUpload = ({ onUpload, onAnalysisComplete, companyReport }: DocumentUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [uploadMethod, setUploadMethod] = useState<"file" | "text">("file");
  const { toast } = useToast();

  const supportedFormats = [
    { type: "Text", extensions: [".txt", ".rtf"], icon: FileText },
    { type: "Word", extensions: [".doc", ".docx"], icon: FileText },
    { type: "PDF", extensions: [".pdf"], icon: FileText },
    { type: "PowerPoint", extensions: [".ppt", ".pptx"], icon: Presentation },
    { type: "Excel", extensions: [".xls", ".xlsx"], icon: FileSpreadsheet },
    { type: "Images", extensions: [".jpg", ".png", ".gif"], icon: Image },
  ];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 50MB",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    setUploadMethod("file");
    setPastedText("");
    onUpload(file);
  };

  const handleTextInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPastedText(e.target.value);
    if (uploadedFile) {
      setUploadedFile(null);
    }
  };

  const analyzeContent = async () => {
    if (!uploadedFile && !pastedText) {
      toast({
        title: "No content to analyze",
        description: "Please upload a file or enter text first",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    try {
      // This would call your LLM API
      console.log('Analyzing content with LLM...');
      if (uploadedFile) {
        console.log('File:', uploadedFile.name);
      } else {
        console.log('Text input:', pastedText.substring(0, 50) + '...');
      }
      console.log('Company report available:', !!companyReport);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Sample violations that include text positions 
      const sampleViolations = [
        {
          type: "Unsubstantiated Claims",
          severity: "High",
          text: "100% eco-friendly packaging",
          context: "Our products come in 100% eco-friendly packaging that...",
          position: "Paragraph 2, line 3",
          guideline: "EU Green Claims Directive Article 3",
          suggestion: "Provide specific certification or lifecycle assessment data"
        },
        {
          type: "Vague Environmental Benefit",
          severity: "Medium",
          text: "environmentally friendly",
          context: "Our environmentally friendly manufacturing process reduces...",
          position: "Paragraph 4, line 1",
          guideline: "FTC Green Guides Section 260.4",
          suggestion: "Specify which environmental impact is addressed"
        }
      ];

      // Mock analysis results based on EU and US guidelines
      const mockResults = {
        overallScore: Math.floor(Math.random() * 40) + 60, // 60-100
        riskLevel: Math.random() > 0.7 ? "High" : Math.random() > 0.4 ? "Medium" : "Low",
        violations: sampleViolations,
        compliance: {
          eu: Math.floor(Math.random() * 30) + 60,
          us: Math.floor(Math.random() * 30) + 65
        },
        companyReportConflicts: companyReport ? [
          {
            claim: "Carbon neutral operations",
            conflict: "Company report shows 15% increase in emissions",
            severity: "High"
          }
        ] : []
      };

      onAnalysisComplete(mockResults);
      
      toast({
        title: "Analysis complete",
        description: `Found ${mockResults.violations.length} potential issues`,
      });

    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Please check your LLM configuration",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      clearInterval(progressInterval);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Upload or Enter Communication Content</CardTitle>
          <CardDescription>
            Upload materials or paste text for greenwashing analysis against legal guidelines
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="file" onValueChange={(value) => setUploadMethod(value as "file" | "text")} className="mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="file">Upload File</TabsTrigger>
              <TabsTrigger value="text">Enter Text</TabsTrigger>
            </TabsList>
            <TabsContent value="file" className="mt-4">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop your file here, or{" "}
                  <label className="text-blue-600 cursor-pointer hover:text-blue-500">
                    browse
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileSelect}
                      accept=".txt,.doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx,.jpg,.png,.gif"
                    />
                  </label>
                </p>
                <p className="text-sm text-gray-500">
                  Maximum file size: 50MB
                </p>
              </div>
            </TabsContent>
            <TabsContent value="text" className="mt-4">
              <Textarea 
                placeholder="Paste or type your content here for greenwashing analysis..." 
                className="min-h-[200px]"
                value={pastedText}
                onChange={handleTextInput}
              />
            </TabsContent>
          </Tabs>

          {(uploadedFile || pastedText) && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  {uploadedFile && (
                    <>
                      <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </>
                  )}
                  {pastedText && !uploadedFile && (
                    <>
                      <p className="font-medium text-gray-900">Text Input</p>
                      <p className="text-sm text-gray-500">
                        {pastedText.length} characters
                      </p>
                    </>
                  )}
                </div>
              </div>
              <Button onClick={analyzeContent} disabled={isAnalyzing}>
                {isAnalyzing ? "Analyzing..." : "Analyze Content"}
              </Button>
            </div>
          )}

          {isAnalyzing && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Analyzing content against EU & US guidelines...</span>
                <span>{analysisProgress}%</span>
              </div>
              <Progress value={analysisProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Supported Formats */}
      <Card>
        <CardHeader>
          <CardTitle>Supported File Formats</CardTitle>
          <CardDescription>
            Our AI can analyze various document types and extract text content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {supportedFormats.map((format) => (
              <div key={format.type} className="flex items-center space-x-3 p-3 border rounded-lg">
                <format.icon className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">{format.type}</p>
                  <p className="text-xs text-gray-500">
                    {format.extensions.join(", ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Guidelines Info */}
      <Card>
        <CardHeader>
          <CardTitle>Legal Guidelines Applied</CardTitle>
          <CardDescription>
            Analysis is based on current European and US environmental marketing regulations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700">EU</Badge>
                <h3 className="font-medium">European Union</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Green Claims Directive (2024)</li>
                <li>• Unfair Commercial Practices Directive</li>
                <li>• Consumer Rights Directive</li>
                <li>• EU Taxonomy Regulation</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline" className="bg-green-50 text-green-700">US</Badge>
                <h3 className="font-medium">United States</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• FTC Green Guides</li>
                <li>• FTC Act Section 5</li>
                <li>• State Environmental Marketing Laws</li>
                <li>• SEC Climate Disclosure Rules</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentUpload;
