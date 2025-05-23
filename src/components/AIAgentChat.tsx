
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Send, Copy, CheckCheck } from "lucide-react";

const AIAgentChat = () => {
  const [messages, setMessages] = useState<Array<{role: string; content: string; timestamp: Date}>>([
    {
      role: "system",
      content: "Hello! I'm your P&G GreenWash Guard communication specialist. I can help you create effective, compliant marketing communications that avoid greenwashing. What kind of content would you like to create today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [communicationType, setCommunicationType] = useState("social");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const newUserMessage = {
      role: "user",
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInput("");
    setIsGenerating(true);
    
    // Simulate AI response
    setTimeout(() => {
      let responseContent = "";
      
      // Generate different responses based on the communication type
      switch (communicationType) {
        case "social":
          responseContent = "Here's a draft for your social media post:\n\n\"Discover P&G's new packaging that uses 30% less plastic than before. Based on our verified lifecycle assessment, this change will help reduce our plastic footprint by an estimated 5,000 tons annually. Learn more about our specific sustainability initiatives at [link]. #BetterPackaging #VerifiedImpact\"";
          break;
        case "press":
          responseContent = "**PRESS RELEASE DRAFT**\n\nP&G Launches New Packaging Design to Reduce Plastic Use\n\nCINCINNATI, May 23, 2025 — Procter & Gamble (P&G) today announced the launch of new packaging for its leading products that reduces plastic content by 30% compared to previous designs. This initiative is part of the company's verified commitment to reduce virgin plastic usage by 50% by 2030.\n\n\"This redesign is a significant step in our sustainability journey,\" said [EXECUTIVE NAME], [TITLE] at P&G. \"Third-party lifecycle assessments confirm this change will reduce our annual plastic usage by approximately 5,000 tons while maintaining the same product protection and consumer experience.\"\n\nThe company has provided detailed substantiation of these claims through its published Environmental Product Declarations, available on their sustainability portal.";
          break;
        case "website":
          responseContent = "**WEBSITE CONTENT DRAFT**\n\nSustainable Packaging: Our Journey\n\nAt P&G, we're making measurable progress toward our packaging goals:\n\n• 30% reduction in plastic content across our primary packaging lines\n• 25% of our packaging now incorporates recycled materials\n• 80% of our packaging is technically recyclable in standard facilities\n\nThese statements are verified through independent third-party assessment (Bureau Veritas, 2024). We recognize we still face challenges with certain packaging types and are committed to continued innovation.\n\nDownload our detailed packaging sustainability report [link] to learn about our specific initiatives, timelines, and verification methods.";
          break;
        default:
          responseContent = "I've prepared some compliant marketing copy for your product. Let me know if you'd like any adjustments to better align with your specific goals while maintaining regulatory compliance.";
      }
      
      const newAiMessage = {
        role: "assistant",
        content: responseContent,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newAiMessage]);
      setIsGenerating(false);
    }, 3000);
  };

  const copyToClipboard = () => {
    // Find the last AI message
    const lastAiMessage = [...messages].reverse().find(m => m.role === "assistant");
    
    if (lastAiMessage) {
      navigator.clipboard.writeText(lastAiMessage.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Marketing Communication Creator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1 space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Communication Type</label>
                <Select value={communicationType} onValueChange={setCommunicationType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="social">Social Media Post</SelectItem>
                    <SelectItem value="press">Press Release</SelectItem>
                    <SelectItem value="website">Website Content</SelectItem>
                    <SelectItem value="email">Email Campaign</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Card>
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm">About this Agent</CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <p className="text-xs text-gray-600">
                    This communication agent helps create marketing content that:
                  </p>
                  <ul className="text-xs text-gray-600 mt-2 space-y-1">
                    <li>• Avoids greenwashing claims</li>
                    <li>• Follows EU and US regulations</li>
                    <li>• Uses specific, verifiable claims</li>
                    <li>• Provides proper substantiation</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Button 
                className="w-full" 
                variant="outline" 
                onClick={copyToClipboard} 
                disabled={messages.length <= 1}
              >
                {copied ? <CheckCheck className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? "Copied!" : "Copy Latest Response"}
              </Button>
            </div>
            
            <div className="md:col-span-3 flex flex-col h-[600px]">
              <ScrollArea className="flex-1 border rounded-t-lg p-4 mb-4">
                {messages.map((message, index) => (
                  <div key={index} className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    {message.role === "assistant" && (
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-blue-600 text-white">AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div 
                      className={`rounded-lg p-3 max-w-[80%] ${
                        message.role === "user" 
                          ? "bg-blue-600 text-white" 
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    {message.role === "user" && (
                      <Avatar className="h-8 w-8 ml-2">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-gray-400 text-white">U</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isGenerating && (
                  <div className="flex justify-start mb-4">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback className="bg-blue-600 text-white">AI</AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 text-gray-900 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></div>
                      </div>
                    </div>
                  </div>
                )}
              </ScrollArea>
              
              <div className="flex space-x-2">
                <Textarea 
                  placeholder="Describe the communication you need..." 
                  className="flex-1"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <Button onClick={handleSend} disabled={isGenerating || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAgentChat;
