import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  FileText, 
  Layers,
  Settings,
  Send,
  Bot,
  CheckCircle,
  Clock,
  FolderOpen
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface LocationState {
  projectId: string;
  projectName: string;
}

const TechDocsAgent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const state = location.state as LocationState;
  
  const [activeDocument, setActiveDocument] = useState<'hld' | 'lld' | 'tech-spec' | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [generatedDocuments, setGeneratedDocuments] = useState<{
    hld?: string;
    lld?: string;
    techSpec?: string;
  }>({});

  const documentTypes = [
    {
      id: 'hld' as const,
      title: 'High Level Design (HLD)',
      description: 'System architecture overview, component interactions, and technology decisions',
      icon: Layers,
      color: 'primary',
      prompts: [
        'Generate a high-level system architecture for an e-commerce platform',
        'Create HLD for microservices-based application',
        'Design system architecture for real-time data processing'
      ]
    },
    {
      id: 'lld' as const,
      title: 'Low Level Design (LLD)',
      description: 'Detailed component design, database schemas, and API specifications',
      icon: Settings,
      color: 'accent',
      prompts: [
        'Design detailed database schema for user management system',
        'Create API specifications for REST endpoints',
        'Generate component-level design for authentication module'
      ]
    },
    {
      id: 'tech-spec' as const,
      title: 'Technical Specification',
      description: 'Comprehensive technical documentation including both HLD and LLD',
      icon: FileText,
      color: 'success',
      prompts: [
        'Generate complete technical specification for web application',
        'Create full tech spec including architecture and detailed design',
        'Build comprehensive technical documentation for mobile app'
      ]
    }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() || !activeDocument) return;

    setIsGenerating(true);
    setProgress(0);
    
    const steps = [
      "Analyzing requirements...",
      "Researching best practices...",
      "Designing architecture...",
      "Creating documentation structure...",
      "Generating technical content...",
      "Finalizing document..."
    ];

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(steps[i]);
      setProgress((i + 1) * (100 / steps.length));
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Simulate document generation
    const mockDocument = `# ${documentTypes.find(d => d.id === activeDocument)?.title}

## Project: ${state?.projectName || 'Current Project'}

### Generated based on prompt:
"${prompt}"

## Overview
This document provides ${activeDocument === 'hld' ? 'high-level architectural design' : 
activeDocument === 'lld' ? 'detailed component specifications' : 'comprehensive technical specifications'} 
for the project requirements.

## Key Components
- System Architecture
- Technology Stack
- Design Patterns
- Implementation Guidelines

## Next Steps
- Review and validate design decisions
- Share with development team
- Create implementation timeline

*Document generated on ${new Date().toLocaleDateString()}*`;

    setGeneratedDocuments(prev => ({
      ...prev,
      [activeDocument]: mockDocument
    }));

    setIsGenerating(false);
    setCurrentStep("");
    
    toast({
      title: "Document Generated Successfully",
      description: `${documentTypes.find(d => d.id === activeDocument)?.title} has been created.`,
    });
  };

  const handleSaveToRepository = () => {
    toast({
      title: "Saved to Repository",
      description: "Document has been saved to the project repository.",
    });
    navigate("/repository", { 
      state: { 
        projectId: state?.projectId, 
        projectName: state?.projectName,
        newDocument: {
          type: activeDocument,
          title: documentTypes.find(d => d.id === activeDocument)?.title,
          content: generatedDocuments[activeDocument!]
        }
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(`/project/${state?.projectId}`)}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Project
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-accent" />
                <h1 className="text-xl font-bold text-foreground">Technical Documentation Agent</h1>
                {state?.projectName && (
                  <Badge variant="secondary">{state.projectName}</Badge>
                )}
              </div>
            </div>
            <Button 
              variant="outline"
              onClick={() => navigate("/repository")}
              className="gap-2"
            >
              <FolderOpen className="h-4 w-4" />
              Repository
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Document Types */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-card shadow-soft border-0">
              <CardHeader>
                <CardTitle>Document Types</CardTitle>
                <CardDescription>Select the type of technical document to generate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {documentTypes.map((docType) => {
                  const Icon = docType.icon;
                  const isActive = activeDocument === docType.id;
                  const hasGenerated = generatedDocuments[docType.id];
                  
                  return (
                    <Button
                      key={docType.id}
                      variant={isActive ? "default" : "outline"}
                      className={`w-full justify-start gap-3 h-auto p-4 ${
                        isActive ? 'ring-2 ring-offset-2 ring-primary/20' : ''
                      }`}
                      onClick={() => setActiveDocument(docType.id)}
                    >
                      <div className={`p-2 rounded-lg ${
                        isActive ? 'bg-primary-foreground/20' : `bg-${docType.color}/10`
                      }`}>
                        <Icon className={`h-4 w-4 ${
                          isActive ? 'text-primary-foreground' : `text-${docType.color}`
                        }`} />
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-medium flex items-center gap-2">
                          {docType.title}
                          {hasGenerated && <CheckCircle className="h-4 w-4 text-success" />}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {docType.description}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Generation Interface */}
          <div className="lg:col-span-2 space-y-6">
            {activeDocument ? (
              <>
                {/* Prompt Input */}
                <Card className="bg-gradient-card shadow-soft border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="h-5 w-5" />
                      Generate {documentTypes.find(d => d.id === activeDocument)?.title}
                    </CardTitle>
                    <CardDescription>
                      Describe your requirements and the agent will generate the technical documentation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Quick Prompts */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Quick Prompts:</label>
                      <div className="flex flex-wrap gap-2">
                        {documentTypes.find(d => d.id === activeDocument)?.prompts.map((quickPrompt, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => setPrompt(quickPrompt)}
                            className="text-xs"
                          >
                            {quickPrompt}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Textarea
                      placeholder="Describe the system, requirements, or specific aspects you want documented..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-24"
                    />

                    {isGenerating && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 animate-spin" />
                          {currentStep}
                        </div>
                        <Progress value={progress} className="w-full" />
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button 
                        onClick={handleGenerate}
                        disabled={!prompt.trim() || isGenerating}
                        className="gap-2"
                      >
                        <Send className="h-4 w-4" />
                        {isGenerating ? "Generating..." : "Generate Document"}
                      </Button>
                      
                      {generatedDocuments[activeDocument] && (
                        <Button 
                          variant="outline"
                          onClick={handleSaveToRepository}
                          className="gap-2"
                        >
                          <FolderOpen className="h-4 w-4" />
                          Save to Repository
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Generated Document Preview */}
                {generatedDocuments[activeDocument] && (
                  <Card className="bg-gradient-card shadow-soft border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-success" />
                        Generated Document Preview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="whitespace-pre-wrap text-sm bg-muted/20 p-4 rounded-lg max-h-96 overflow-y-auto">
                        {generatedDocuments[activeDocument]}
                      </pre>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="bg-gradient-card shadow-soft border-0">
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select Document Type</h3>
                  <p className="text-muted-foreground">
                    Choose a document type from the left panel to start generating technical documentation
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechDocsAgent;