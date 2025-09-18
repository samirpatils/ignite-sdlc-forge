import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Code, 
  Globe,
  Server,
  Database,
  Send,
  Bot,
  FolderTree,
  FileCode,
  Clock
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface LocationState {
  projectId: string;
  projectName: string;
}

interface CodeStructure {
  frontend: { [key: string]: string };
  middleware: { [key: string]: string };
  backend: { [key: string]: string };
}

const CodeAgent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const state = location.state as LocationState;
  
  const [activeTab, setActiveTab] = useState("frontend");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [folderStructure, setFolderStructure] = useState<CodeStructure>({
    frontend: {},
    middleware: {},
    backend: {}
  });

  const codeCategories = [
    {
      id: 'frontend',
      title: 'Frontend Code',
      description: 'User interface components, pages, and client-side logic',
      icon: Globe,
      color: 'primary',
      prompts: [
        'Create React components for user dashboard',
        'Generate responsive landing page with Tailwind CSS',
        'Build authentication forms with validation',
        'Create data visualization components with charts'
      ]
    },
    {
      id: 'middleware',
      title: 'Middleware Code',
      description: 'API routes, middleware functions, and service layers',
      icon: Server,
      color: 'accent',
      prompts: [
        'Generate Express.js API routes for user management',
        'Create authentication middleware with JWT',
        'Build data validation and sanitization middleware',
        'Generate REST API endpoints for CRUD operations'
      ]
    },
    {
      id: 'backend',
      title: 'Backend Scripts',
      description: 'Database operations, background jobs, and server utilities',
      icon: Database,
      color: 'success',
      prompts: [
        'Create database migration scripts',
        'Generate background job processors',
        'Build data seeding and cleanup scripts',
        'Create automated backup and monitoring scripts'
      ]
    }
  ];

  const generateFolderStructure = (category: string) => {
    const structures = {
      frontend: {
        'src/': '',
        'src/components/': '',
        'src/components/ui/': '',
        'src/components/forms/': '',
        'src/pages/': '',
        'src/hooks/': '',
        'src/utils/': '',
        'src/types/': '',
        'src/assets/': '',
        'public/': '',
        'package.json': '{\n  "name": "frontend-app",\n  "version": "1.0.0",\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build"\n  }\n}'
      },
      middleware: {
        'src/': '',
        'src/routes/': '',
        'src/middleware/': '',
        'src/controllers/': '',
        'src/services/': '',
        'src/utils/': '',
        'src/types/': '',
        'src/config/': '',
        'package.json': '{\n  "name": "middleware-api",\n  "version": "1.0.0",\n  "scripts": {\n    "start": "node dist/index.js",\n    "dev": "nodemon src/index.ts"\n  }\n}'
      },
      backend: {
        'scripts/': '',
        'scripts/migrations/': '',
        'scripts/seeds/': '',
        'scripts/jobs/': '',
        'scripts/utils/': '',
        'config/': '',
        'logs/': '',
        'package.json': '{\n  "name": "backend-scripts",\n  "version": "1.0.0",\n  "scripts": {\n    "migrate": "node scripts/migrations/run.js",\n    "seed": "node scripts/seeds/run.js"\n  }\n}'
      }
    };
    
    return structures[category as keyof typeof structures] || {};
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setProgress(0);
    
    const steps = [
      "Analyzing code requirements...",
      "Planning folder structure...",
      "Generating boilerplate code...",
      "Creating configuration files...",
      "Setting up development environment...",
      "Finalizing code structure..."
    ];

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(steps[i]);
      setProgress((i + 1) * (100 / steps.length));
      await new Promise(resolve => setTimeout(resolve, 1200));
    }

    // Generate folder structure based on active tab
    const structure = generateFolderStructure(activeTab);
    
    // Add some generated code files based on prompt
    const generatedFiles = {
      [`src/components/Generated${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}.tsx`]: 
        `// Generated based on prompt: "${prompt}"\n\n` +
        `export const Generated${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} = () => {\n` +
        `  // TODO: Implement functionality based on requirements\n` +
        `  return (\n    <div>\n      {/* Generated component */}\n    </div>\n  );\n};\n`,
      [`src/utils/generated-${activeTab}.ts`]: 
        `// Utility functions for ${activeTab}\n\n` +
        `export const generateHelper = () => {\n` +
        `  // TODO: Implement helper functions\n};\n`
    };

    const finalStructure = { ...structure, ...generatedFiles };

    setFolderStructure(prev => ({
      ...prev,
      [activeTab]: finalStructure
    }));

    setIsGenerating(false);
    setCurrentStep("");
    
    toast({
      title: "Code Structure Generated",
      description: `${codeCategories.find(c => c.id === activeTab)?.title} structure has been created.`,
    });
  };

  const renderFileTree = (files: { [key: string]: string }) => {
    return (
      <div className="space-y-1">
        {Object.entries(files).map(([path, content]) => {
          const isFolder = path.endsWith('/');
          const depth = (path.match(/\//g) || []).length;
          const paddingLeft = depth * 20;
          
          return (
            <div key={path} className="flex items-center gap-2" style={{ paddingLeft }}>
              {isFolder ? (
                <FolderTree className="h-4 w-4 text-accent" />
              ) : (
                <FileCode className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={`text-sm ${isFolder ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                {path.split('/').pop() || path}
              </span>
            </div>
          );
        })}
      </div>
    );
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
                <Code className="h-5 w-5 text-success" />
                <h1 className="text-xl font-bold text-foreground">Code Agent</h1>
                {state?.projectName && (
                  <Badge variant="secondary">{state.projectName}</Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Code Generation Interface */}
          <Card className="bg-gradient-card shadow-soft border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Code Generation Agent
              </CardTitle>
              <CardDescription>
                Generate application folder structure and boilerplate code for your project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Describe the code structure and functionality you want to generate..."
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

              <Button 
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                {isGenerating ? "Generating..." : "Generate Code Structure"}
              </Button>
            </CardContent>
          </Card>

          {/* Code Tabs */}
          <Card className="bg-gradient-card shadow-soft border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderTree className="h-5 w-5" />
                Application Structure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  {codeCategories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <TabsTrigger 
                        key={category.id} 
                        value={category.id}
                        className="gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        {category.title}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                {codeCategories.map((category) => (
                  <TabsContent key={category.id} value={category.id} className="space-y-4">
                    {/* Quick Prompts for each category */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground">Quick Prompts:</h4>
                      <div className="flex flex-wrap gap-2">
                        {category.prompts.map((quickPrompt, index) => (
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

                    {/* Generated Structure */}
                    {folderStructure[category.id as keyof CodeStructure] && 
                     Object.keys(folderStructure[category.id as keyof CodeStructure]).length > 0 && (
                      <Card className="bg-muted/10">
                        <CardHeader>
                          <CardTitle className="text-base">Generated {category.title} Structure</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {renderFileTree(folderStructure[category.id as keyof CodeStructure])}
                        </CardContent>
                      </Card>
                    )}

                    {/* Category Description */}
                    <Card className="bg-muted/5">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                          <div className={`bg-${category.color}/10 p-3 rounded-lg`}>
                            <category.icon className={`h-6 w-6 text-${category.color}`} />
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground mb-2">{category.title}</h3>
                            <p className="text-sm text-muted-foreground">{category.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CodeAgent;