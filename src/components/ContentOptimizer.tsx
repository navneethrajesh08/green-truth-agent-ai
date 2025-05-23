
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand2, Copy, RotateCw, CheckCheck, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContentOptimizerProps {
  analysisResults: any;
  uploadedDocument: File | string | null;
}

const ContentOptimizer = ({ analysisResults, uploadedDocument }: ContentOptimizerProps) => {
  const [originalContent, setOriginalContent] = useState<string>("");
  const [optimizedContent, setOptimizedContent] = useState<string>("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [tone, setTone] = useState<string>("professional");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // If we have uploaded content, use it as the original
    if (uploadedDocument) {
      if (typeof uploadedDocument === 'string') {
        // If it's direct text
        setOriginalContent(uploadedDocument);
      } else {
        // For demo purposes, we'll use a placeholder for files
        // In a real app, we'd extract text from the file
        setOriginalContent("P&G is committed to environmental sustainability with our 100% eco-friendly packaging. Our natural ingredients and carbon-neutral operations make us the greenest choice for consumers who care about the planet. Our products are environmentally friendly and help reduce your carbon footprint.");
      }
    } else if (analysisResults) {
      // For demo purposes, if we have analysis results but no content, use a default
      setOriginalContent("P&G is committed to environmental sustainability with our 100% eco-friendly packaging. Our natural ingredients and carbon-neutral operations make us the greenest choice for consumers who care about the planet. Our products are environmentally friendly and help reduce your carbon footprint.");
    }
  }, [uploadedDocument, analysisResults]);

  const optimizeContent = async () => {
    if (!originalContent) {
      toast({
        title: "No content to optimize",
        description: "Please enter some text first",
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);
    
    console.log('Optimizing content with LLM...');
    console.log('Tone:', tone);
    console.log('Original:', originalContent);

    try {
      // Simulate LLM processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // This would be replaced with actual LLM call in production
      let optimizedText = "";
      
      if (originalContent.toLowerCase().includes("100% eco-friendly")) {
        // Replace problematic absolute claims
        optimizedText = originalContent.replace(
          /100% eco-friendly packaging/gi, 
          "packaging that contains 35% recycled content (certified by SGS)"
        );
      } else {
        optimizedText = originalContent;
      }
      
      // Replace vague terms
      optimizedText = optimizedText.replace(
        /environmentally friendly/gi, 
        "designed to reduce water usage by 25% compared to our 2020 baseline"
      );
      
      // Replace unsubstantiated carbon claims
      optimizedText = optimizedText.replace(
        /carbon-neutral operations/gi, 
        "operations with a 15% carbon reduction since 2021 (verified by third-party audit)"
      );
      
      // Replace "greenest" with specific comparisons
      optimizedText = optimizedText.replace(
        /greenest choice/gi, 
        "choice that uses 30% less plastic than our previous packaging"
      );

      // Adjust tone based on selection
      switch (tone) {
        case "professional":
          // Already professional
          break;
        case "casual":
          optimizedText = optimizedText.replace(
            /designed to reduce water usage/gi,
            "helps save water"
          );
          optimizedText = optimizedText.replace(
            /verified by third-party audit/gi,
            "according to our latest sustainability report"
          );
          break;
        case "technical":
          optimizedText = optimizedText.replace(
            /contains 35% recycled content/gi,
            "incorporates 35% post-consumer recycled polyethylene terephthalate (rPET)"
          );
          optimizedText = optimizedText.replace(
            /15% carbon reduction/gi,
            "15% reduction in scope 1 and 2 carbon emissions"
          );
          break;
      }
      
      setOptimizedContent(optimizedText);
      toast({
        title: "Content optimized",
        description: "Your content has been optimized to avoid greenwashing",
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

  const copyToClipboard = () => {
    if (optimizedContent) {
      navigator.clipboard.writeText(optimizedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Copied to clipboard",
        description: "Optimized content has been copied to your clipboard",
      });
    }
  };

  const getComplianceStatus = () => {
    if (!analysisResults) return null;
    
    const compliant = analysisResults.overallScore >= 80;
    
    return (
      <div className="mb-4 p-3 rounded-lg flex items-center space-x-3 border">
        {compliant ? (
          <>
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">Content looks compliant</p>
              <p className="text-sm text-gray-600">Minor optimizations may still be recommended</p>
            </div>
          </>
        ) : (
          <>
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <div>
              <p className="font-medium text-gray-900">Content needs optimization</p>
              <p className="text-sm text-gray-600">
                {analysisResults.violations.length} issues need to be addressed
              </p>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Content Optimization</CardTitle>
          <CardDescription>
            Optimize your communication to be effective while avoiding greenwashing
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Configuration Options */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-3">
              <label className="text-sm font-medium mb-2 block">Communication Tone</label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Apply Suggestions</label>
              <Button
                onClick={optimizeContent}
                disabled={isOptimizing || !originalContent}
                className="w-full"
              >
                {isOptimizing ? (
                  <>
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Optimize
                  </>
                )}
              </Button>
            </div>
          </div>

          {getComplianceStatus()}
          
          <Tabs defaultValue="edit" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit">Edit Content</TabsTrigger>
              <TabsTrigger value="compare">Compare Versions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="edit" className="space-y-4 pt-4">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Original Content</label>
                </div>
                <Textarea
                  value={originalContent}
                  onChange={(e) => setOriginalContent(e.target.value)}
                  className="min-h-[150px]"
                  placeholder="Enter your marketing content here..."
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Optimized Content</label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    disabled={!optimizedContent}
                  >
                    {copied ? (
                      <>
                        <CheckCheck className="mr-1 h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-1 h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <Textarea
                  value={optimizedContent}
                  readOnly
                  className="min-h-[150px]"
                  placeholder="Optimized content will appear here..."
                />
              </div>
            </TabsContent>
            
            <TabsContent value="compare" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Original</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm">{originalContent}</p>
                    
                    {analysisResults && analysisResults.violations && analysisResults.violations.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium mb-2">Issues Detected:</p>
                        <div className="space-y-1">
                          {analysisResults.violations.map((violation: any, i: number) => (
                            <div key={i} className="flex items-start space-x-2">
                              <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                              <p className="text-xs text-gray-600">{violation.type}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex justify-between items-center">
                      <span>Optimized</span>
                      <Badge variant="outline" className="text-green-600">
                        Compliant
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm">{optimizedContent || "Not yet optimized"}</p>
                    
                    {optimizedContent && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium mb-2">Improvements:</p>
                        <div className="space-y-1">
                          <div className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            <p className="text-xs text-gray-600">Replaced vague claims with specific metrics</p>
                          </div>
                          <div className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            <p className="text-xs text-gray-600">Added proper substantiation</p>
                          </div>
                          <div className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            <p className="text-xs text-gray-600">Avoided absolute environmental claims</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentOptimizer;
