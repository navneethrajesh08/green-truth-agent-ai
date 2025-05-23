
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Copy, RefreshCw, Download, CheckCircle, AlertTriangle, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContentOptimizerProps {
  analysisResults: any;
  uploadedDocument: File | string | null;
}

const ContentOptimizer = ({ analysisResults, uploadedDocument }: ContentOptimizerProps) => {
  const [originalContent, setOriginalContent] = useState(
    uploadedDocument && typeof uploadedDocument === 'string' 
      ? uploadedDocument 
      : `P&G is committed to environmental sustainability with our 100% eco-friendly packaging. Our natural ingredients and carbon-neutral operations make us the greenest choice for consumers who care about the planet. Our products are environmentally friendly and help reduce your carbon footprint.`
  );
  
  const [optimizedContent, setOptimizedContent] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedTone, setSelectedTone] = useState("professional");
  const { toast } = useToast();

  const toneOptions = [
    { value: "professional", label: "Professional", description: "Business-appropriate, authoritative" },
    { value: "friendly", label: "Friendly", description: "Approachable, conversational" },
    { value: "technical", label: "Technical", description: "Detailed, scientifically accurate" },
    { value: "marketing", label: "Marketing", description: "Engaging, persuasive" }
  ];

  const optimizeContent = async () => {
    setIsOptimizing(true);
    
    try {
      // This would call your LLM API
      console.log('Optimizing content with LLM...');
      console.log('Tone:', selectedTone);
      console.log('Original:', originalContent);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Sample optimized content
      const sampleOptimized = `P&G is committed to environmental sustainability through specific initiatives including our packaging reduction program, which has achieved 15% less material usage (certified by ISO 14001). Our products contain sustainably sourced ingredients where possible, with detailed sourcing information available in our annual sustainability report. We continue working toward our 2030 carbon reduction goals, with current progress detailed in our quarterly environmental impact reports.`;
      
      setOptimizedContent(sampleOptimized);
      
      toast({
        title: "Content optimized successfully",
        description: "Greenwashing risks have been identified and addressed",
      });
      
    } catch (error) {
      toast({
        title: "Optimization failed",
        description: "Please check your LLM configuration",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Content has been copied successfully",
    });
  };

  const complianceScore = optimizedContent ? 95 : analysisResults?.overallScore || 0;

  return (
    <div className="space-y-6">
      {/* Optimization Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Content Optimization</CardTitle>
          <CardDescription>
            AI-powered content optimization to eliminate greenwashing while maintaining impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Tone & Style
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {toneOptions.map((tone) => (
                  <button
                    key={tone.value}
                    onClick={() => setSelectedTone(tone.value)}
                    className={`p-3 text-left border rounded-lg transition-colors ${
                      selectedTone === tone.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-medium text-sm">{tone.label}</div>
                    <div className="text-xs text-gray-500">{tone.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Badge variant={complianceScore >= 90 ? "default" : "secondary"}>
                Compliance Score: {complianceScore}%
              </Badge>
              <Button onClick={optimizeContent} disabled={isOptimizing}>
                {isOptimizing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Optimize Content
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Comparison */}
      <Tabs defaultValue="comparison" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="comparison">Side-by-Side</TabsTrigger>
          <TabsTrigger value="original">Original</TabsTrigger>
          <TabsTrigger value="optimized">Optimized</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Original Content */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <span>Original Content</span>
                  </CardTitle>
                  <Badge variant="destructive">
                    {analysisResults?.violations?.length || 0} Issues
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={originalContent}
                  onChange={(e) => setOriginalContent(e.target.value)}
                  className="min-h-[200px] mb-4"
                  placeholder="Paste your original content here..."
                />
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {originalContent.length} characters
                  </div>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(originalContent)}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Optimized Content */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Optimized Content</span>
                  </CardTitle>
                  <Badge variant="default">
                    0 Issues
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={optimizedContent}
                  onChange={(e) => setOptimizedContent(e.target.value)}
                  className="min-h-[200px] mb-4"
                  placeholder="Optimized content will appear here..."
                  readOnly={!optimizedContent}
                />
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {optimizedContent.length} characters
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(optimizedContent)} disabled={!optimizedContent}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" disabled={!optimizedContent}>
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="original">
          <Card>
            <CardContent className="pt-6">
              <Textarea
                value={originalContent}
                onChange={(e) => setOriginalContent(e.target.value)}
                className="min-h-[300px]"
                placeholder="Paste your original content here..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimized">
          <Card>
            <CardContent className="pt-6">
              <Textarea
                value={optimizedContent}
                onChange={(e) => setOptimizedContent(e.target.value)}
                className="min-h-[300px]"
                placeholder="Optimized content will appear here..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Optimization Details */}
      {optimizedContent && (
        <Card>
          <CardHeader>
            <CardTitle>Optimization Summary</CardTitle>
            <CardDescription>
              Changes made to improve compliance and reduce greenwashing risk
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">+28%</div>
                  <div className="text-sm text-gray-600">Compliance Improvement</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">3</div>
                  <div className="text-sm text-gray-600">Issues Resolved</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">95%</div>
                  <div className="text-sm text-gray-600">Final Score</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium">Key Changes Made:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Replaced "100% eco-friendly" with specific, measurable claims</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Added references to verifiable certifications and reports</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Clarified "carbon-neutral" claim with progress indicators</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Removed vague terminology like "environmentally friendly"</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContentOptimizer;
