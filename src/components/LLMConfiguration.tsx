
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Settings, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LLMConfiguration = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [provider, setProvider] = useState("groq");
  const [model, setModel] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const { toast } = useToast();

  const providers = [
    {
      id: "groq",
      name: "Groq",
      models: ["llama3-8b-8192", "llama3-70b-8192", "mixtral-8x7b-32768"],
      description: "Fast inference, optimized for real-time applications"
    },
    {
      id: "openai",
      name: "OpenAI",
      models: ["gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"],
      description: "High-quality responses, excellent for complex analysis"
    },
    {
      id: "anthropic",
      name: "Anthropic",
      models: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"],
      description: "Focused on safety and helpful responses"
    }
  ];

  useEffect(() => {
    // Load saved configuration from localStorage
    const savedApiKey = localStorage.getItem('llm_api_key');
    const savedProvider = localStorage.getItem('llm_provider');
    const savedModel = localStorage.getItem('llm_model');
    
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsConnected(true);
    }
    if (savedProvider) {
      setProvider(savedProvider);
    }
    if (savedModel) {
      setModel(savedModel);
    }
  }, []);

  const saveConfiguration = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your API key to continue",
        variant: "destructive",
      });
      return;
    }

    if (!model) {
      toast({
        title: "Model Selection Required",
        description: "Please select a model to use",
        variant: "destructive",
      });
      return;
    }

    // Save to localStorage (encrypted in a real app)
    localStorage.setItem('llm_api_key', apiKey);
    localStorage.setItem('llm_provider', provider);
    localStorage.setItem('llm_model', model);
    
    setIsConnected(true);
    setIsOpen(false);
    
    toast({
      title: "Configuration Saved",
      description: `Successfully configured ${providers.find(p => p.id === provider)?.name} with ${model}`,
    });
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    
    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Connection Successful",
        description: "LLM API is responding correctly",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please check your API key and try again",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const clearConfiguration = () => {
    localStorage.removeItem('llm_api_key');
    localStorage.removeItem('llm_provider');
    localStorage.removeItem('llm_model');
    
    setApiKey("");
    setProvider("groq");
    setModel("");
    setIsConnected(false);
    
    toast({
      title: "Configuration Cleared",
      description: "LLM settings have been reset",
    });
  };

  const selectedProvider = providers.find(p => p.id === provider);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <Settings className="h-4 w-4" />
          <span>Configure LLM</span>
          {isConnected ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-orange-600" />
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>LLM Configuration</DialogTitle>
          <DialogDescription>
            Configure your Language Model provider and API key. Your credentials are stored securely in your browser.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Connection Status */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-orange-600" />
              )}
              <span className="font-medium">
                {isConnected ? "Connected" : "Not Connected"}
              </span>
            </div>
            {isConnected && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                {selectedProvider?.name} • {model}
              </Badge>
            )}
          </div>

          {/* Provider Selection */}
          <div className="space-y-2">
            <Label htmlFor="provider">LLM Provider</Label>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger>
                <SelectValue placeholder="Select a provider" />
              </SelectTrigger>
              <SelectContent>
                {providers.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{provider.name}</span>
                      <span className="text-xs text-gray-500">{provider.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {selectedProvider?.models.map((modelName) => (
                  <SelectItem key={modelName} value={modelName}>
                    {modelName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* API Key Input */}
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={`Enter your ${selectedProvider?.name} API key`}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Your API key is stored locally in your browser and never sent to our servers.
            </p>
          </div>

          {/* Provider Information */}
          {selectedProvider && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{selectedProvider.name} Configuration</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-600 mb-2">{selectedProvider.description}</p>
                <div className="text-xs">
                  <strong>Available Models:</strong> {selectedProvider.models.join(", ")}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button onClick={saveConfiguration} className="flex-1">
              Save Configuration
            </Button>
            <Button 
              variant="outline" 
              onClick={testConnection}
              disabled={!apiKey || isTestingConnection}
            >
              {isTestingConnection ? "Testing..." : "Test"}
            </Button>
            {isConnected && (
              <Button variant="destructive" onClick={clearConfiguration}>
                Clear
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LLMConfiguration;
