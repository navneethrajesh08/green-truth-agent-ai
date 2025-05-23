
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Brain, Send, Copy, Download, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AIAgentChat = () => {
  const [messages, setMessages] = useState<{ role: string; content: string; timestamp: Date }[]>([
    {
      role: "assistant",
      content: "Hello! I'm your P&G communication assistant. I can help you create effective and compliant marketing messages. What type of content would you like to create today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      role: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock response based on user input
    let responseContent = "";
    if (inputValue.toLowerCase().includes("sustainability")) {
      responseContent = "Here's a draft for your sustainability messaging:\n\n\"At P&G, our commitment to sustainability is backed by measurable actions. We've reduced manufacturing water usage by 25% since 2010 (verified by third-party auditors), and 85% of our packaging is now recyclable or reusable. Our goal is to achieve 100% recyclable packaging by 2030 through our partnership with the Ellen MacArthur Foundation.\"\n\nThis statement avoids common greenwashing pitfalls by providing specific percentages, timeframes, and verification sources.";
    } else if (inputValue.toLowerCase().includes("green") || inputValue.toLowerCase().includes("eco")) {
      responseContent = "Here's a draft for your eco-friendly messaging:\n\n\"P&G's Tide coldwater formula is designed to save energy with every wash. Independent testing shows it cleans effectively in cold water, potentially reducing household energy usage by up to 90% per load compared to hot water washing. This contributes to our verified goal of helping consumers reduce their carbon footprint by 50 million tons by 2030.\"\n\nThis message focuses on specific benefits and includes verification of claims.";
    } else {
      responseContent = "I can help you create compliant marketing content that effectively communicates your sustainability initiatives without greenwashing. Here are some tips:\n\n1. Be specific about environmental claims\n2. Provide evidence and certifications\n3. Avoid vague terminology like \"green\" or \"eco-friendly\"\n4. Clearly state the scope of benefits\n5. Be transparent about progress toward goals\n\nWhat specific product or initiative would you like to create messaging for?";
    }

    const assistantMessage = {
      role: "assistant",
      content: responseContent,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Content has been copied successfully",
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <span>Communication Assistant</span>
          </CardTitle>
          <CardDescription>
            Create effective marketing messages that comply with greenwashing regulations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col h-[500px]">
            <div className="flex-1 overflow-auto p-4 space-y-4 bg-slate-50 rounded-md mb-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <div className="flex items-start mb-1">
                      {message.role !== "user" && (
                        <Avatar className="h-6 w-6 mr-2">
                          <Sparkles className="h-4 w-4" />
                        </Avatar>
                      )}
                      <div className="flex-1">
                        <div
                          className="whitespace-pre-wrap text-sm"
                          style={{ wordBreak: "break-word" }}
                        >
                          {message.content}
                        </div>
                        <div className="text-xs mt-1 opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    {message.role === "assistant" && (
                      <div className="flex justify-end mt-2 space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => copyToClipboard(message.content)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-4 bg-white border border-gray-200">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Describe the marketing content you need..."
                className="flex-1 min-h-[80px]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button onClick={handleSendMessage} disabled={isLoading} className="self-end">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAgentChat;
