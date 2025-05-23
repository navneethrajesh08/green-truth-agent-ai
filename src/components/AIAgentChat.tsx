
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Bot, User, Shield, FileText, Zap, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  agentType?: string;
  timestamp: Date;
}

const AIAgentChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'agent',
      content: 'Hello! I\'m your Compliance Agent. I can help you understand greenwashing regulations and ensure your marketing materials meet legal requirements. What would you like to know?',
      agentType: 'compliance',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [activeAgent, setActiveAgent] = useState("compliance");
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  const agents = [
    {
      id: "compliance",
      name: "Compliance Agent",
      icon: Shield,
      color: "bg-blue-500",
      description: "Legal compliance and regulation expert",
      speciality: "EU & US greenwashing laws"
    },
    {
      id: "content",
      name: "Content Agent", 
      icon: FileText,
      color: "bg-green-500",
      description: "Content optimization and copywriting",
      speciality: "Marketing copy improvement"
    },
    {
      id: "strategy",
      name: "Strategy Agent",
      icon: Zap,
      color: "bg-purple-500", 
      description: "Marketing strategy and positioning",
      speciality: "Brand messaging strategy"
    },
    {
      id: "research",
      name: "Research Agent",
      icon: Users,
      color: "bg-orange-500",
      description: "Market research and competitor analysis", 
      speciality: "Industry insights"
    }
  ];

  const mockResponses = {
    compliance: [
      "Based on the EU Green Claims Directive, you need to provide substantial evidence for any environmental claim. I recommend adding specific certifications or lifecycle assessment data.",
      "Under FTC Green Guides Section 260.4, vague terms like 'eco-friendly' should be avoided unless you can specify which environmental benefit you're referring to.",
      "This claim may violate truth-in-advertising laws. Consider rephrasing to include measurable data and time-bound commitments."
    ],
    content: [
      "I can help rewrite this to be more specific and compelling. Instead of '100% natural,' try '95% naturally-derived ingredients, with detailed sourcing information available.'",
      "This content could be more impactful with concrete numbers. Let me suggest some alternative phrasings that maintain persuasive power while ensuring accuracy.",
      "The tone is good, but we need to add more substantiation. I'll help you craft messaging that's both engaging and legally compliant."
    ],
    strategy: [
      "For P&G's sustainability positioning, I recommend focusing on specific product innovations rather than broad company claims. This reduces legal risk while highlighting real achievements.",
      "Consider a phased communication strategy: Start with easily verifiable claims, then build toward more ambitious messaging as you achieve sustainability milestones.",
      "Your competitive advantage lies in transparency. I suggest creating a sustainability dashboard that supports your marketing claims with real-time data."
    ],
    research: [
      "Recent studies show consumers are increasingly skeptical of green claims. 73% want specific data rather than general environmental statements.",
      "Competitor analysis reveals most brands in your category are vulnerable to greenwashing accusations. This is an opportunity to differentiate through genuine transparency.",
      "Industry trend: Companies with third-party environmental certifications see 23% higher consumer trust scores in sustainability messaging."
    ]
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      const responses = mockResponses[activeAgent as keyof typeof mockResponses];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: randomResponse,
        agentType: activeAgent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getAgentInfo = (agentType: string) => {
    return agents.find(agent => agent.id === agentType) || agents[0];
  };

  return (
    <div className="space-y-6">
      {/* Agent Selection */}
      <Card>
        <CardHeader>
          <CardTitle>AI Marketing Agents</CardTitle>
          <CardDescription>
            Specialized AI agents to assist with different aspects of marketing communication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeAgent} onValueChange={setActiveAgent}>
            <TabsList className="grid w-full grid-cols-4">
              {agents.map((agent) => (
                <TabsTrigger key={agent.id} value={agent.id} className="flex flex-col items-center space-y-1 p-3">
                  <agent.icon className="h-4 w-4" />
                  <span className="text-xs">{agent.name.split(' ')[0]}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {agents.map((agent) => (
              <TabsContent key={agent.id} value={agent.id}>
                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className={`p-3 rounded-full ${agent.color}`}>
                    <agent.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{agent.name}</h3>
                    <p className="text-sm text-gray-600">{agent.description}</p>
                    <Badge variant="outline" className="mt-1">
                      {agent.speciality}
                    </Badge>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <span>Chat with {getAgentInfo(activeAgent).name}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Message History */}
          <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {message.role === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`rounded-lg p-3 ${
                    message.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask the ${getAgentInfo(activeAgent).name} anything...`}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1"
            />
            <Button onClick={sendMessage} disabled={!inputMessage.trim() || isTyping}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and questions for the AI agents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button variant="outline" className="justify-start h-auto p-3" onClick={() => setInputMessage("What are the latest greenwashing regulations I should be aware of?")}>
              <Shield className="h-4 w-4 mr-2" />
              <div className="text-left">
                <div className="font-medium">Check Regulations</div>
                <div className="text-xs text-gray-500">Latest legal requirements</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-3" onClick={() => setInputMessage("Can you help me rewrite this claim to be more compliant?")}>
              <FileText className="h-4 w-4 mr-2" />
              <div className="text-left">
                <div className="font-medium">Rewrite Content</div>
                <div className="text-xs text-gray-500">Optimize for compliance</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-3" onClick={() => setInputMessage("What's the best strategy for sustainable marketing in our industry?")}>
              <Zap className="h-4 w-4 mr-2" />
              <div className="text-left">
                <div className="font-medium">Strategy Advice</div>
                <div className="text-xs text-gray-500">Marketing positioning</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-3" onClick={() => setInputMessage("What are competitors doing in sustainable marketing?")}>
              <Users className="h-4 w-4 mr-2" />
              <div className="text-left">
                <div className="font-medium">Market Research</div>
                <div className="text-xs text-gray-500">Competitive analysis</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAgentChat;
